import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";

const CONTRACT_SCHEMA = "creative_prompt_contract.v1";
const TASK_KINDS = new Set(["image", "edit", "video"]);
const REFERENCE_ROLES = new Set(["identity", "source", "style", "motion", "performance", "audio", "coverage"]);
const READY_STATES = new Set(["planning_only", "execution_ready"]);
const NEGATIVE_HANDLING_MODES = new Set(["integrated_constraints", "separate_field", "minimal_exclusions", "unresolved"]);
const VIDEO_TEXT_MODES = new Set(["none", "native", "post_only_when_explicitly_requested"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function contractChecksum(contract) {
  const immutable = { ...contract };
  delete immutable.content_checksum;
  delete immutable.adapter_verification;
  delete immutable.execution_evidence;
  return `sha256:${createHash("sha256").update(JSON.stringify(stableValue(immutable))).digest("hex")}`;
}

function add(errors, code) {
  if (!errors.includes(code)) errors.push(code);
}

function requiresTextLayout(contract, errors) {
  const layout = contract.text_layout_contract;
  if (!isRecord(layout)) {
    add(errors, "TEXT_LAYOUT_CONTRACT_REQUIRED");
    return;
  }
  if (typeof layout.visible_text !== "boolean") add(errors, "TEXT_LAYOUT_VISIBILITY_REQUIRED");
  if (layout.visible_text === true) {
    if (!hasItems(layout.exact_text) || !layout.exact_text.every(hasText)) add(errors, "TEXT_LAYOUT_EXACT_TEXT_REQUIRED");
    for (const field of ["hierarchy", "safe_area", "correction_path"]) {
      if (!hasText(layout[field])) add(errors, "TEXT_LAYOUT_LAYOUT_RULE_REQUIRED");
    }
    if (!Number.isInteger(layout.text_count_limit) || layout.text_count_limit < 1) add(errors, "TEXT_LAYOUT_TEXT_LIMIT_REQUIRED");
  }
}

function validateReferences(contract, errors) {
  const roles = contract.reference_roles;
  const attachments = contract.attachment_plan;
  if (!Array.isArray(roles)) {
    add(errors, "REFERENCE_ROLES_REQUIRED");
    return new Set();
  }
  if (!Array.isArray(attachments)) {
    add(errors, "ATTACHMENT_PLAN_REQUIRED");
    return new Set();
  }

  const aliases = new Set();
  const strictAliases = new Set();
  for (const reference of roles) {
    if (!isRecord(reference) || !hasText(reference.alias) || !REFERENCE_ROLES.has(reference.role) || !hasText(reference.control_ownership)) {
      add(errors, "REFERENCE_ROLE_INVALID");
      continue;
    }
    if (aliases.has(reference.alias)) add(errors, "REFERENCE_ROLE_ALIAS_DUPLICATE");
    aliases.add(reference.alias);
    if (reference.strict_lock === true) strictAliases.add(reference.alias);
  }

  const attachedAliases = new Set();
  for (const attachment of attachments) {
    if (!isRecord(attachment) || !hasText(attachment.alias) || attachment.request_scope !== "this_generation_unit") {
      add(errors, "ATTACHMENT_PLAN_INVALID");
      continue;
    }
    if (!aliases.has(attachment.alias)) add(errors, "ATTACHMENT_REFERENCE_UNKNOWN");
    attachedAliases.add(attachment.alias);
  }
  for (const alias of strictAliases) {
    if (!attachedAliases.has(alias)) add(errors, "STRICT_REFERENCE_ATTACHMENT_REQUIRED");
  }
  return attachedAliases;
}

function validateContinuity(contract, attachedAliases, errors) {
  const continuity = contract.continuity;
  if (!isRecord(continuity) || !Array.isArray(continuity.strict_locks) || !Array.isArray(continuity.continuity_carriers)) {
    add(errors, "CONTINUITY_CONTRACT_REQUIRED");
    return;
  }
  const carriersByLock = new Map();
  for (const carrier of continuity.continuity_carriers) {
    if (!isRecord(carrier) || !hasText(carrier.lock) || !hasText(carrier.alias) || !hasText(carrier.carrier_type)) {
      add(errors, "CONTINUITY_CARRIER_INVALID");
      continue;
    }
    if (!attachedAliases.has(carrier.alias)) add(errors, "CONTINUITY_CARRIER_UNATTACHED");
    if (carrier.state !== "actual") continue;
    carriersByLock.set(carrier.lock, carrier);
  }
  for (const lock of continuity.strict_locks) {
    if (!hasText(lock) || !carriersByLock.has(lock)) add(errors, "STRICT_CONTINUITY_CARRIER_REQUIRED");
  }

  if (isRecord(contract.rewrite_forward) && contract.rewrite_forward.from_actual_output === true) {
    if (!hasText(contract.rewrite_forward.accepted_output_ref)) add(errors, "REWRITE_FORWARD_ACCEPTED_OUTPUT_REQUIRED");
    if (continuity.continuity_carriers.every((carrier) => carrier?.state !== "actual")) add(errors, "REWRITE_FORWARD_ACTUAL_CARRIER_REQUIRED");
  }
}

function validateEdit(contract, errors) {
  if (contract.task_kind !== "edit") return;
  const delta = contract.edit_delta_contract;
  if (!isRecord(delta)) {
    add(errors, "EDIT_DELTA_CONTRACT_REQUIRED");
    return;
  }
  if (!hasText(delta.source_alias)) add(errors, "EDIT_DELTA_SOURCE_REQUIRED");
  if (!hasItems(delta.requested_changes)) add(errors, "EDIT_DELTA_CHANGE_SCOPE_REQUIRED");
  if (!hasItems(delta.preserve_locks)) add(errors, "EDIT_DELTA_PRESERVATION_REQUIRED");
  if (!hasItems(delta.verification_observables)) add(errors, "EDIT_DELTA_VERIFICATION_REQUIRED");
}

function validateVideo(contract, errors) {
  if (contract.task_kind !== "video") return;
  const shot = contract.shot_contract;
  if (!isRecord(shot)) {
    add(errors, "SHOT_CONTRACT_REQUIRED");
    return;
  }
  if (!(typeof shot.duration_seconds === "number" && shot.duration_seconds > 0)) add(errors, "SHOT_DURATION_REQUIRED");
  for (const field of ["frame", "subject", "action", "camera_move", "setting", "lighting"]) {
    if (!hasText(shot[field])) add(errors, "SHOT_OBSERVABLE_REQUIRED");
  }
  if (!Number.isInteger(shot.action_count) || shot.action_count < 1) add(errors, "SHOT_ACTION_COUNT_REQUIRED");
  if (!Number.isInteger(shot.camera_move_count) || shot.camera_move_count < 1) add(errors, "SHOT_CAMERA_MOVE_COUNT_REQUIRED");
  if (shot.video_text_mode !== undefined && !VIDEO_TEXT_MODES.has(shot.video_text_mode)) add(errors, "SHOT_VIDEO_TEXT_MODE_INVALID");

  const needsException = shot.action_count > 1 || shot.camera_move_count > 1;
  if (needsException) {
    const exceptions = Array.isArray(contract.heuristic_exceptions) ? contract.heuristic_exceptions : [];
    const justified = exceptions.some((exception) => isRecord(exception)
      && exception.scope === "action_or_camera"
      && hasText(exception.rationale)
      && hasText(exception.evidence));
    if (!justified) add(errors, "HEURISTIC_EXCEPTION_REQUIRED");
  }

  if (contract.timing_beats !== undefined) {
    if (!Array.isArray(contract.timing_beats)) {
      add(errors, "TIMING_BEATS_INVALID");
    } else {
      for (const beat of contract.timing_beats) {
        if (!isRecord(beat)
          || typeof beat.start_seconds !== "number"
          || typeof beat.end_seconds !== "number"
          || beat.start_seconds < 0
          || beat.end_seconds <= beat.start_seconds
          || beat.end_seconds > shot.duration_seconds
          || !hasText(beat.description)) {
          add(errors, "TIMING_BEAT_OUT_OF_RANGE");
        }
      }
    }
  }
}

function validateTargetAndReadiness(contract, errors) {
  const target = contract.target;
  if (!isRecord(target) || !hasText(target.target_generator) || !isRecord(target.official_source_check)) {
    add(errors, "TARGET_CONTRACT_REQUIRED");
    return;
  }
  if (target.negative_handling_mode !== undefined && !NEGATIVE_HANDLING_MODES.has(target.negative_handling_mode)) {
    add(errors, "NEGATIVE_HANDLING_MODE_INVALID");
  }
  if (target.target_generator !== "unresolved") {
    const source = target.official_source_check;
    if (source.status !== "verified" || !hasText(source.source_url) || !source.source_url.startsWith("https://") || !hasText(source.checked_on)) {
      add(errors, "OFFICIAL_SOURCE_CHECK_REQUIRED");
    }
  }
  if (contract.readiness !== "execution_ready") return;
  const adapter = contract.adapter_verification;
  const evidence = contract.execution_evidence;
  if (!isRecord(adapter)
    || adapter.status !== "verified"
    || adapter.contract_revision !== contract.revision
    || adapter.content_checksum !== contract.content_checksum
    || !Array.isArray(adapter.semantic_drops)
    || !Array.isArray(adapter.semantic_additions)
    || adapter.semantic_drops.length > 0
    || adapter.semantic_additions.length > 0) {
    add(errors, "ADAPTER_VERIFICATION_REQUIRED");
  }
  if (!isRecord(evidence) || !Array.isArray(evidence.attached_aliases) || !Array.isArray(evidence.output_refs) || !hasText(evidence.acceptance_status)) {
    add(errors, "EXECUTION_EVIDENCE_REQUIRED");
  }
}

export function validateCreativePromptContract(contract) {
  const errors = [];
  if (!isRecord(contract)) return ["CREATIVE_PROMPT_CONTRACT_INVALID"];
  if (contract.contract_schema !== CONTRACT_SCHEMA) add(errors, "CREATIVE_PROMPT_SCHEMA_INVALID");
  if (!hasText(contract.contract_id)) add(errors, "CREATIVE_PROMPT_ID_REQUIRED");
  if (!Number.isInteger(contract.revision) || contract.revision < 1) add(errors, "CREATIVE_PROMPT_REVISION_REQUIRED");
  if (!TASK_KINDS.has(contract.task_kind)) add(errors, "CREATIVE_PROMPT_TASK_KIND_INVALID");
  if (!READY_STATES.has(contract.readiness)) add(errors, "CREATIVE_PROMPT_READINESS_INVALID");
  if (!isRecord(contract.prompt) || !hasText(contract.prompt.text)) add(errors, "CREATIVE_PROMPT_TEXT_REQUIRED");
  if (!hasItems(contract.qa_observables)) add(errors, "QA_OBSERVABLES_REQUIRED");

  if (!hasText(contract.content_checksum) || contract.content_checksum !== contractChecksum(contract)) {
    add(errors, "CREATIVE_PROMPT_CHECKSUM_MISMATCH");
  }

  requiresTextLayout(contract, errors);
  const attachedAliases = validateReferences(contract, errors);
  validateContinuity(contract, attachedAliases, errors);
  validateEdit(contract, errors);
  validateVideo(contract, errors);
  validateTargetAndReadiness(contract, errors);
  return errors;
}

export function run(ctx) {
  const { createFindings, read } = ctx.helpers;
  const { findings, addFinding } = createFindings(ctx.root);
  const fixturePath = ctx.paths.creativePromptContractFixtures;
  const standardPath = ctx.paths.creativePromptingStandard;
  const templatePath = ctx.paths.creativePromptContractTemplate;

  for (const file of [standardPath, templatePath, fixturePath]) {
    if (!existsSync(file)) addFinding("MISSING_CREATIVE_PROMPT_CONTRACT_FILE", "Creative prompting contract file is missing.", [file]);
  }

  if (existsSync(standardPath)) {
    const text = read(standardPath);
    for (const phrase of [
      "Coverage Ledger",
      "stable",
      "heuristic",
      "target-dependent",
      "official_source_check",
      "text_layout_contract",
      "edit_delta_contract",
      "reference_role",
      "control_ownership",
      "continuity_carrier",
      "rewrite_forward",
      "adapter_verification",
      "execution_evidence"
    ]) {
      if (!text.includes(phrase)) addFinding("WEAK_CREATIVE_PROMPTING_STANDARD", `Creative prompting standard is missing: ${phrase}`, [standardPath]);
    }
  }

  if (!existsSync(fixturePath)) return { findings };
  let fixture;
  try {
    fixture = JSON.parse(read(fixturePath));
  } catch (error) {
    addFinding("INVALID_CREATIVE_PROMPT_FIXTURES", `Creative prompt fixture file must be valid JSON: ${error.message}`, [fixturePath]);
    return { findings };
  }
  if (fixture.schema_version !== 1 || !Array.isArray(fixture.cases) || fixture.cases.length < 4) {
    addFinding("INVALID_CREATIVE_PROMPT_FIXTURES", "Creative prompt fixtures must define schema_version 1 and at least four cases.", [fixturePath]);
    return { findings };
  }
  for (const fixtureCase of fixture.cases) {
    if (!isRecord(fixtureCase) || !hasText(fixtureCase.id) || !["pass", "fail"].includes(fixtureCase.expect)) {
      addFinding("INVALID_CREATIVE_PROMPT_FIXTURE_CASE", "Creative prompt fixture case is missing an id or valid expectation.", [fixturePath]);
      continue;
    }
    const errors = validateCreativePromptContract(fixtureCase.contract);
    if (fixtureCase.expect === "pass" && errors.length > 0) {
      addFinding("CREATIVE_PROMPT_FIXTURE_REJECTED", `Expected valid creative prompt fixture was rejected: ${fixtureCase.id} (${errors.join(", ")})`, [fixturePath]);
    }
    if (fixtureCase.expect === "fail") {
      if (!hasText(fixtureCase.expected_code) || !errors.includes(fixtureCase.expected_code)) {
        addFinding("CREATIVE_PROMPT_FIXTURE_ACCEPTED", `Expected invalid creative prompt fixture did not produce its expected code: ${fixtureCase.id}`, [fixturePath]);
      }
    }
  }
  return { findings };
}
