#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { repoRoot, reportFindings, walkFiles } from "./common.mjs";

const findings = [];

function addFinding(code, message, files) {
  findings.push({ code, message, files: files.map((file) => relative(repoRoot, file)) });
}

const requiredRoles = JSON.parse(readFileSync(join(repoRoot, "config/agent-naming.schema.json"), "utf8")).roles;
const agentDir = join(repoRoot, ".codex/agents");
const missingAgents = requiredRoles
  .map((role) => join(agentDir, `${role}.toml.template`))
  .filter((path) => !existsSync(path));
if (missingAgents.length > 0) {
  addFinding("MISSING_AGENT_TEMPLATE", "Required role-based agent template is missing.", missingAgents);
}

for (const role of requiredRoles) {
  const file = join(agentDir, `${role}.toml.template`);
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const marker of ["Role:", "Scope:", "Inputs:", "Outputs:", "Forbidden:", "Review gate:", "Handoff rules:"]) {
    if (!text.includes(marker)) {
      addFinding("WEAK_AGENT_TEMPLATE", `Agent template ${role} is missing marker ${marker}`, [file]);
    }
  }
}

const skillFiles = walkFiles(join(repoRoot, ".agents/skills")).filter((file) => file.endsWith("SKILL.md"));
if (skillFiles.length < 25) {
  addFinding("MISSING_SKILLS", "Expected full skill pack is incomplete.", [join(repoRoot, ".agents/skills")]);
}
for (const file of skillFiles) {
  const text = readFileSync(file, "utf8");
  if (!/^---\nname:\s*[-a-z0-9]+/m.test(text) || !/\ndescription:\s*/m.test(text)) {
    addFinding("INVALID_SKILL_FRONTMATTER", "Skill frontmatter must include name and description.", [file]);
  }
}

const gateRegistry = join(repoRoot, ".agents/skills/pipeline-core/references/gate-registry.md");
const handoffMatrix = join(repoRoot, ".agents/skills/pipeline-core/references/handoff-matrix.md");
const artifactTemplates = join(repoRoot, ".agents/skills/pipeline-core/templates/artifact-templates.md");
for (const file of [gateRegistry, handoffMatrix, artifactTemplates]) {
  if (!existsSync(file)) addFinding("MISSING_PIPELINE_FILE", "Required pipeline core file is missing.", [file]);
}

if (existsSync(gateRegistry)) {
  const text = readFileSync(gateRegistry, "utf8");
  for (const gate of ["intent_lock", "workflow_route", "brief_completeness", "reference_authority_fit", "evidence_fit", "instruction_packet_fit", "direction_fit", "structure_fit", "copy_fit", "promptability_fit", "execution_manifest_fit", "asset_manifest_fit", "post_execution_fit", "delivery_fit"]) {
    if (!text.includes(`\`${gate}\``)) addFinding("MISSING_GATE", `Gate is missing: ${gate}`, [gateRegistry]);
  }
}

if (existsSync(handoffMatrix)) {
  const text = readFileSync(handoffMatrix, "utf8");
  for (const fragment of ["intent-confirmation | workflow-orchestrator", "image-prompting | tool-routing-cost", "video-prompting | tool-routing-cost", "qa-iteration | delivery-documentation", "instruction-packet-factory"]) {
    if (!text.includes(fragment)) addFinding("MISSING_HANDOFF", `Handoff fragment is missing: ${fragment}`, [handoffMatrix]);
  }
}

if (existsSync(artifactTemplates)) {
  const text = readFileSync(artifactTemplates, "utf8");
  for (const section of ["Task Confirmation", "Brief Contract", "Reference Pack", "Instruction Packet", "Prompt Pack", "Execution Manifest", "QA / Iteration Report", "Delivery Manifest"]) {
    if (!text.includes(`## ${section}`)) addFinding("MISSING_TEMPLATE_SECTION", `Artifact template section is missing: ${section}`, [artifactTemplates]);
  }
}

const textPolicy = readFileSync(join(repoRoot, "config/text-image-policy.json"), "utf8");
if (!textPolicy.includes("openai/gpt-image-2") || !textPolicy.includes("one-pass generation")) {
  addFinding("WEAK_TEXT_IMAGE_POLICY", "Text-image policy is missing required model or one-pass rule.", [join(repoRoot, "config/text-image-policy.json")]);
}

process.exit(reportFindings(findings, "workflow validation passed"));
