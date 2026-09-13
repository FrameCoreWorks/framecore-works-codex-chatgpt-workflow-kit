#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value) => typeof value === "string" && value.trim().length > 0 && value !== "Unknown";

export function preflight(notes) {
  const blockers = [];
  const result = (status) => ({ status, blockers, evidence_scope: "declared planning state only; not consent, facts, pixels or execution" });
  if (!object(notes)) {
    blockers.push("notes must be an object");
    return result("blocked");
  }
  if (["advice", "concepts", "copy"].includes(notes.request_kind)) {
    if (typeof notes.prompt === "string" && notes.prompt.trim()) blockers.push("final prompt exceeds the requested scope");
    return result(blockers.length ? "blocked" : "not_applicable");
  }
  if (notes.request_kind !== "prompt") blockers.push("this checker accepts prompt planning, not render authorization");
  if (!["generate", "edit"].includes(notes.task_mode)) blockers.push("task_mode must be generate or edit");
  if (!["concept_raster", "digital_final", "production_master"].includes(notes.production_intent)) blockers.push("production intent is unresolved");
  if (notes.production_intent === "production_master" || notes.feasibility?.status === "dtp_required") {
    blockers.push("dtp_required: raster prompting cannot deliver this production intent");
  }
  if (!["supplied", "selected", "locked"].includes(notes.concept?.status) ||
      !(text(notes.concept?.lock) || (object(notes.concept?.lock) && text(notes.concept.lock.mechanism)))) {
    blockers.push("selected or supplied concept lock is required");
  }
  if (!["compact", "at_risk"].includes(notes.feasibility?.status) ||
      !Array.isArray(notes.feasibility?.review_plan) || !notes.feasibility.review_plan.length ||
      !notes.feasibility.review_plan.every(text)) blockers.push("feasibility and a concrete review plan are required");

  const copy = notes.copy;
  const items = Array.isArray(copy?.items) ? copy.items : [];
  if (!object(copy) || !Array.isArray(copy.items)) blockers.push("copy inventory is required, including explicit no_copy");
  if (copy?.route === "no_copy") {
    if (copy.selection_status !== "not_required" || items.length) blockers.push("no_copy must have an empty inventory and not_required selection");
  } else {
    if (!["locked_copy", "copy_discovery", "copy_refinement"].includes(copy?.route) ||
        !["selected", "locked"].includes(copy?.selection_status) || !items.length) blockers.push("copy must be selected or locked before finalization");
  }
  const ids = new Set();
  for (const item of items) {
    if (!object(item) || !text(item.id) || ids.has(item.id) || !text(item.text) ||
        !["must_read", "should_read", "metadata", "decoration"].includes(item.role) ||
        typeof item.required !== "boolean" || !text(item.authority)) {
      blockers.push("each copy item needs a unique ID, exact text, role, required flag and authority");
      continue;
    }
    ids.add(item.id);
  }
  if (!Array.isArray(notes.references)) blockers.push("reference inventory is required, even when empty");
  const references = Array.isArray(notes.references) ? notes.references : [];
  const referenceIds = new Set();
  for (const reference of references) {
    if (!object(reference) || !text(reference.id) || referenceIds.has(reference.id) ||
        typeof reference.required !== "boolean" || !Array.isArray(reference.roles) ||
        !reference.roles.length || !reference.roles.every(text) ||
        !["available", "unavailable", "Unknown", "conflict"].includes(reference.status)) {
      blockers.push("invalid reference entry or duplicate reference ID");
      continue;
    }
    referenceIds.add(reference.id);
    if (reference.required && (reference.status !== "available" || !text(reference.source))) {
      blockers.push(`required reference ${reference.id} is unresolved`);
    }
  }
  if (!text(notes.prompt)) blockers.push("a complete prompt is required for review");
  const prompt = typeof notes.prompt === "string" ? notes.prompt : "";
  let quotedIds = ids;
  if (notes.task_mode === "edit") {
    const edit = notes.edit_scope;
    const source = references.find((reference) => reference?.id === edit?.source_reference_id);
    if (!object(edit) || !text(edit.change) || !Array.isArray(edit.protected_properties) ||
        !edit.protected_properties.length || !edit.protected_properties.every(text) ||
        source?.status !== "available" || source?.required !== true ||
        !Array.isArray(source?.roles) || !source.roles.includes("edit_source") || !text(source?.source)) {
      blockers.push("edit requires the current source, one change and protected properties");
    }
    const changed = Array.isArray(edit?.changed_copy_ids) ? edit.changed_copy_ids : [];
    const protectedIds = Array.isArray(edit?.protected_copy_ids) ? edit.protected_copy_ids : [];
    const all = [...changed, ...protectedIds];
    if (!Array.isArray(edit?.changed_copy_ids) || !Array.isArray(edit?.protected_copy_ids) ||
        all.length !== ids.size || new Set(all).size !== all.length || all.some((id) => !ids.has(id))) {
      blockers.push("changed and protected copy IDs must partition the inventory without overlap");
    }
    quotedIds = new Set(changed);
  } else if (notes.edit_scope != null) {
    blockers.push("a fresh graphic cannot inherit a scoped-edit omission exception");
  }
  for (const item of items) {
    if (quotedIds.has(item?.id) && text(item.text) && !prompt.includes(item.text)) blockers.push(`prompt is missing exact copy ${item.id}`);
  }
  return result(blockers.length ? "blocked" : "ready_for_prompt_review");
}

export function main(args = process.argv.slice(2)) {
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    console.log("Read-only planning check: node static-design-preflight.mjs <notes.json>. No generation, file writes or approval decisions.");
    return 0;
  }
  if (args.length !== 1) {
    console.error("Provide exactly one static design notes JSON file.");
    return 2;
  }
  try {
    const result = preflight(JSON.parse(readFileSync(args[0], "utf8")));
    console.log(JSON.stringify(result, null, 2));
    return result.status === "blocked" ? 1 : 0;
  } catch (error) {
    console.error(`preflight error: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
