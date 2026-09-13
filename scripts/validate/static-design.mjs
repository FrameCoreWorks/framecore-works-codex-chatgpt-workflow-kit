import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCatalog } from "../../.agents/skills/commercial-visual-campaign-director/scripts/poster-codes.mjs";
import { preflight } from "../../.agents/skills/image-prompt-architect/scripts/static-design-preflight.mjs";

export function run(ctx) {
  const { findings, addFinding } = ctx.helpers.createFindings(ctx.root);
  const sourceFile = join(ctx.root, "docs/static-graphic-design-provenance.json");
  try {
    const provenance = JSON.parse(readFileSync(sourceFile, "utf8"));
    if (!/^[a-f0-9]{40}$/.test(provenance.source_commit) || provenance.license !== "Apache-2.0" ||
        !Array.isArray(provenance.files) || provenance.files.length < 10) throw new Error("Incomplete source provenance.");
    for (const entry of provenance.files) {
      if (!/^[a-f0-9]{64}$/.test(entry.source_sha256) ||
          typeof entry.target_path !== "string" || !/^\.agents\/skills\/[a-z0-9-]+\/references\/[a-z0-9.-]+$/.test(entry.target_path)) {
        throw new Error("Invalid mapped source path or checksum.");
      }
      const file = join(ctx.root, entry.target_path);
      if (!existsSync(file)) addFinding("MISSING_STATIC_DESIGN_RESOURCE", "Mapped static design resource is missing.", [file]);
      else if (entry.treatment === "unchanged_data") {
        const bytes = readFileSync(file);
        if (createHash("sha256").update(bytes).digest("hex") !== entry.source_sha256) {
          addFinding("STATIC_DESIGN_SOURCE_DRIFT", "Unchanged source data differs from its recorded upstream hash.", [file]);
        }
        validateCatalog(JSON.parse(bytes.toString("utf8")));
      }
    }
  } catch (error) {
    addFinding("INVALID_STATIC_DESIGN_SOURCES", error.message, [sourceFile]);
  }
  const notesFile = join(ctx.root, ".agents/skills/image-prompt-architect/templates/static-design-notes.json");
  try {
    const result = preflight(JSON.parse(readFileSync(notesFile, "utf8")));
    if (result.status !== "ready_for_prompt_review") throw new Error(result.blockers.join("; "));
  } catch (error) {
    addFinding("INVALID_STATIC_DESIGN_EXAMPLE", error.message, [notesFile]);
  }
  const separateSkill = join(ctx.root, ".agents/skills/static-graphic-design-creator");
  if (existsSync(separateSkill)) {
    addFinding("DUPLICATE_STATIC_DESIGN_SKILL", "Static design must remain merged into existing skills.", [separateSkill]);
  }
  return { findings };
}
