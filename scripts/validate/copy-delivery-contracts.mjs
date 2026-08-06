import { existsSync } from "node:fs";

const REQUIRED_PHASES = ["draft", "deep_review", "revision", "final_qa", "delivery"];
const STOP_DECISIONS = new Set(["stop_sufficient", "patch_one_gap", "ask_user", "blocked"]);
const PRECISION_CHANNELS = new Set(["business_email", "formal_email", "offer", "report", "specification", "documentation", "safety_instruction", "legal", "medical", "financial", "compliance"]);
const CASUAL_CHANNELS = new Set(["social_post", "post", "comment", "private_message", "dialogue"]);

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function finding(code, message) {
  return { code, message };
}

export function validateCopyDeliveryRecord(record) {
  const findings = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return [finding("INVALID_COPY_DELIVERY_RECORD", "Record must be an object.")];
  if (!new Set(["draft", "ready_to_use"]).has(record.copy_pack_status)) findings.push(finding("INVALID_COPY_PACK_STATUS", "copy_pack_status must be draft or ready_to_use."));

  const author = record.author_context;
  if (!author || typeof author !== "object") {
    findings.push(finding("MISSING_AUTHOR_CONTEXT", "author_context is required."));
  } else {
    for (const field of ["speaker", "audience", "channel", "goal", "content_type", "concrete_anchor"]) {
      if (!nonEmpty(author[field])) findings.push(finding("MISSING_AUTHOR_CONTEXT_FIELD", `author_context.${field} is required.`));
    }
  }

  const ledger = record.fact_and_lock_ledger;
  if (!ledger || typeof ledger !== "object") {
    findings.push(finding("MISSING_FACT_AND_LOCK_LEDGER", "fact_and_lock_ledger is required."));
  } else {
    if (!new Set(["user_provided", "verified", "unresolved"]).has(ledger.source_status)) findings.push(finding("INVALID_SOURCE_STATUS", "source_status must be user_provided, verified, or unresolved."));
    if (!Array.isArray(ledger.locked_facts)) findings.push(finding("INVALID_LOCKED_FACTS", "locked_facts must be an array."));
    if (!new Set(["none", "user_provided", "verified"]).has(ledger.personal_experience_status)) findings.push(finding("INVALID_PERSONAL_EXPERIENCE_STATUS", "personal_experience_status is invalid."));
    if (ledger.personal_experience_status === "none" && ledger.first_person_claim === true) findings.push(finding("FABRICATED_AUTHOR_EXPERIENCE", "A first-person claim cannot be used without user-provided or verified experience."));
    if (ledger.invented_claims !== false) findings.push(finding("INVENTED_CLAIMS", "invented_claims must be false for public-ready copy."));
  }

  const format = record.format_decisions;
  if (!format || typeof format !== "object" || !Array.isArray(format.requested_elements) || !Array.isArray(format.included_elements)) {
    findings.push(finding("INVALID_FORMAT_DECISIONS", "format_decisions must record requested and included elements."));
  } else {
    const requested = new Set(format.requested_elements);
    for (const element of format.included_elements) {
      if (!requested.has(element) && !nonEmpty(format[element + "_reason"])) findings.push(finding("UNJUSTIFIED_FORMAT_ELEMENT", `Included format element needs a request or reason: ${element}.`));
    }
  }

  const review = record.human_voice_review;
  if (!review || typeof review !== "object") {
    findings.push(finding("MISSING_HUMAN_VOICE_REVIEW", "human_voice_review is required."));
  } else {
    for (const field of ["author_and_audience_fit", "factual_honesty", "channel_and_structure_fit"]) {
      if (review[field] !== "pass") findings.push(finding("HUMAN_VOICE_REVIEW_INCOMPLETE", `${field} must pass before delivery.`));
    }
    const patterns = review.high_risk_patterns;
    if (!Array.isArray(patterns)) findings.push(finding("INVALID_HIGH_RISK_PATTERNS", "high_risk_patterns must be an array."));
    if (Array.isArray(patterns) && patterns.length > 1 && !nonEmpty(review.high_risk_pattern_reason)) findings.push(finding("HIGH_RISK_PATTERN_REASON_REQUIRED", "More than one high-risk pattern needs a channel or goal-based reason."));
    const imperfection = review.controlled_imperfection;
    if (!imperfection || typeof imperfection !== "object" || !new Set(["off", "on"]).has(imperfection.mode) || !Array.isArray(imperfection.elements)) {
      findings.push(finding("INVALID_CONTROLLED_IMPERFECTION", "controlled_imperfection must record mode and elements."));
    } else if (imperfection.mode === "off" && imperfection.elements.length > 0) {
      findings.push(finding("CONTROLLED_IMPERFECTION_OFF_CONFLICT", "Controlled-imperfection elements require mode on."));
    } else if (imperfection.mode === "on") {
      if (PRECISION_CHANNELS.has(author?.channel) || PRECISION_CHANNELS.has(author?.content_type)) findings.push(finding("CONTROLLED_IMPERFECTION_PRECISION_CONFLICT", "Controlled imperfection is not allowed in precision-critical text."));
      if (!CASUAL_CHANNELS.has(author?.channel)) findings.push(finding("CONTROLLED_IMPERFECTION_CHANNEL_CONFLICT", "Controlled imperfection requires a suitable casual channel."));
      if (!new Set(["explicit_user_request", "confirmed_author_profile"]).has(imperfection.basis)) findings.push(finding("CONTROLLED_IMPERFECTION_BASIS_REQUIRED", "Controlled imperfection needs an explicit request or confirmed profile."));
      if (imperfection.elements.length > 2) findings.push(finding("CONTROLLED_IMPERFECTION_EXCESSIVE", "Controlled imperfection permits at most two elements in a short text."));
      if ((imperfection.typo_count ?? 0) > 1) findings.push(finding("CONTROLLED_IMPERFECTION_EXCESSIVE", "At most one harmless typo is permitted."));
      if ((imperfection.typo_count ?? 0) === 1 && imperfection.basis !== "explicit_user_request") findings.push(finding("CONTROLLED_IMPERFECTION_TYPO_REQUEST_REQUIRED", "A typo requires an explicit unpolished-draft request."));
    }
  }

  if (record.copy_pack_status === "ready_to_use") {
    const loop = record.copy_delivery_loop;
    if (!loop || typeof loop !== "object") {
      findings.push(finding("MISSING_COPY_DELIVERY_LOOP", "Ready-to-use copy requires copy_delivery_loop."));
    } else {
      if (!Number.isInteger(loop.iteration) || loop.iteration < 1) findings.push(finding("INVALID_COPY_DELIVERY_ITERATION", "A ready Copy Pack needs at least one completed iteration."));
      if (!Number.isInteger(loop.max_iterations) || loop.max_iterations < loop.iteration || loop.max_iterations > 3) findings.push(finding("INVALID_COPY_DELIVERY_BUDGET", "copy_delivery_loop max_iterations must bound the iteration and be at most three."));
      if (!Array.isArray(loop.phases_completed) || REQUIRED_PHASES.some((phase, index) => loop.phases_completed[index] !== phase)) findings.push(finding("INCOMPLETE_COPY_DELIVERY_LOOP", "Ready-to-use copy must complete draft, deep review, revision, final QA, and delivery in order."));
      for (const field of ["root_cause", "repair_target", "regression_check"]) {
        if (!nonEmpty(loop[field])) findings.push(finding("COPY_DELIVERY_EVIDENCE_MISSING", `copy_delivery_loop.${field} is required.`));
      }
      if (!Array.isArray(loop.evidence) || loop.evidence.length === 0) findings.push(finding("COPY_DELIVERY_EVIDENCE_MISSING", "copy_delivery_loop.evidence is required."));
      if (!STOP_DECISIONS.has(loop.stop_decision)) findings.push(finding("INVALID_COPY_DELIVERY_STOP_DECISION", "copy_delivery_loop must use an existing Loop Protocol stop decision."));
    }
  }
  return findings;
}

export function run(ctx) {
  const { createFindings, read } = ctx.helpers;
  const { findings, addFinding } = createFindings(ctx.root);
  const fixturePath = ctx.paths.copyDeliveryContractFixtures;
  const policyPath = ctx.paths.humanVoicePolicy;
  for (const file of [fixturePath, policyPath]) {
    if (!existsSync(file)) addFinding("MISSING_COPY_DELIVERY_FILE", "Required Human Voice and Copy Delivery file is missing.", [file]);
  }
  if (!existsSync(fixturePath)) return { findings };
  let fixtures;
  try {
    fixtures = JSON.parse(read(fixturePath));
  } catch (error) {
    addFinding("INVALID_COPY_DELIVERY_FIXTURES", `Copy delivery fixtures must be valid JSON: ${error.message}`, [fixturePath]);
    return { findings };
  }
  if (fixtures.schema_version !== 1 || !Array.isArray(fixtures.cases)) {
    addFinding("INVALID_COPY_DELIVERY_FIXTURES", "Copy delivery fixtures must define schema_version 1 and cases.", [fixturePath]);
    return { findings };
  }
  const ids = new Set();
  for (const entry of fixtures.cases) {
    if (!nonEmpty(entry?.id) || ids.has(entry.id)) {
      addFinding("INVALID_COPY_DELIVERY_FIXTURE", "Copy delivery fixture IDs must be unique and non-empty.", [fixturePath]);
      continue;
    }
    ids.add(entry.id);
    const result = validateCopyDeliveryRecord(entry.record);
    if (entry.expected_code === "VALID") {
      if (result.length > 0) addFinding("COPY_DELIVERY_FIXTURE_REJECTED", `Expected valid fixture ${entry.id} failed: ${result.map((item) => item.code).join(", ")}.`, [fixturePath]);
    } else if (!result.some((item) => item.code === entry.expected_code)) {
      addFinding("COPY_DELIVERY_FIXTURE_EXPECTATION_MISMATCH", `Fixture ${entry.id} did not produce expected code ${entry.expected_code}.`, [fixturePath]);
    }
  }
  if (existsSync(policyPath)) {
    const text = read(policyPath);
    for (const phrase of ["Situation Recognition", "Controlled Imperfection", "Mandatory Copy Delivery Loop", "draft -> deep review -> revision -> final QA -> delivery", "detector-evasion", "Do not assume a hook", "Default maximum: three iterations"]) {
      if (!text.includes(phrase)) addFinding("WEAK_HUMAN_VOICE_POLICY", `Human Voice policy is missing required phrase: ${phrase}`, [policyPath]);
    }
  }
  return { findings };
}
