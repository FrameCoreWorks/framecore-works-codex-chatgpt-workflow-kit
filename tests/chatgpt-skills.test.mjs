import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  buildChatGptSkillSourceManifest,
  validateChatGptRepositorySetup,
  writeChatGptSkillSourceManifest,
} from "../scripts/chatgpt-skill-sources.mjs";
import { copyRepoFixture, root } from "./helpers.mjs";

test("ChatGPT repository installer, profiles, sources, and UI metadata validate", () => {
  assert.deepEqual(validateChatGptRepositorySetup(root), []);
});

test("ChatGPT native creation starts in Work with an explicit skill mention", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.schema_version, 6);
  assert.equal(config.native_creator, undefined);
  assert.equal(config.entry_surface.primary, "chatgpt_work");
  assert.equal(config.entry_surface.select_before_pasting_prompt, true);
  assert.equal(config.entry_surface.alternate_path, "plugins_skills_create_with_chat");
  assert.equal(config.entry_surface.alternate_path_opens_work, true);
  assert.equal(config.native_creation.mode, "work_surface_explicit_skill_mention");
  assert.equal(config.native_creation.creator_skill, "skill-creator");
  assert.equal(config.native_creation.creator_invocation, "@skill-creator");
  assert.equal(config.native_creation.explicit_skill_mention_required, true);
  assert.equal(config.native_creation.dollar_command_required, false);
  assert.equal(config.native_creation.tool_discovery_required, false);
  assert.equal(config.native_creation.capability_preflight_required, false);
  assert.equal(config.native_creation.surface, "chatgpt_work");
  assert.equal(config.native_creation.creation_flow, "create_with_chat");
  assert.equal(config.installation_rules.require_visible_install_confirmation, undefined);
});

test("ChatGPT delays source resolution and scopes an unavailable source to the current skill", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.source_resolution.start_after, "installation_approved");
  assert.equal(config.source_resolution.setup_must_continue_without_source_access, true);
  assert.deepEqual(config.source_resolution.access_order, [
    "active_skill_creator_repository_route",
    "github_repository_paths",
    "raw_source_manifest",
  ]);
  assert.equal(config.source_resolution.raw_urls_are_verification_fallback, true);
  assert.equal(config.source_resolution.failure_scope, "current_skill");
  assert.equal(config.source_resolution.require_source_before_creation, true);
  assert.equal(config.source_resolution.user_supplied_source_fallback_allowed, false);

  const bootstrap = readFileSync(join(root, "CHATGPT_INSTALL.md"), "utf8");
  assert.match(bootstrap, /Do not resolve sources while asking for the setup language/);
  assert.match(bootstrap, /active `@skill-creator` use its available public repository-reading\s+route/);
  assert.match(bootstrap, /An unavailable raw URL is not a reason to stop onboarding/);
  assert.match(bootstrap, /current skill as `blocked`/);
});

test("ChatGPT setup offers fresh, history-assisted, and current-profile onboarding", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.setup_session_scope.context_source_selection_required, true);
  assert.equal(config.setup_session_scope.default_context_source, "fresh");
  assert.deepEqual(config.setup_session_scope.allowed_context_sources, [
    "fresh",
    "history_assisted",
    "current_profile",
  ]);
  assert.equal(config.setup_session_scope.history_assisted_requires_current_user_approval, true);
  assert.equal(config.setup_session_scope.use_chatgpt_memory_when_history_assisted, true);
  assert.equal(config.setup_session_scope.use_previous_conversations_when_history_assisted, true);
  assert.equal(config.setup_session_scope.history_access_must_be_available, true);
  assert.equal(config.setup_session_scope.history_observations_are_provisional, true);
  assert.equal(config.setup_session_scope.user_confirmation_required_before_profile_use, true);
  assert.equal(config.setup_session_scope.ask_only_unresolved_questions_after_confirmation, true);
  assert.equal(config.setup_session_scope.use_existing_skills_as_setup_completion, false);
  assert.equal(config.setup_session_scope.reuse_prior_profile_only_if_user_provides_it_in_current_setup, true);

  const bootstrap = readFileSync(join(root, "CHATGPT_INSTALL.md"), "utf8");
  assert.match(bootstrap, /## Onboarding Context Choice/);
  assert.match(bootstrap, /History-assisted onboarding/);
  assert.match(bootstrap, /provisional/);
  assert.match(bootstrap, /confirm or correct/);
  assert.match(bootstrap, /remaining unresolved questions/);
  assert.doesNotMatch(bootstrap, /Do not use ChatGPT Memory, previous chats/);
});

test("ChatGPT beginner preflight explains the workflow in entry-level language", () => {
  const bootstrap = readFileSync(join(root, "CHATGPT_INSTALL.md"), "utf8");
  assert.match(bootstrap, /small workflow helpers ChatGPT can use later in normal conversations/);
  assert.match(bootstrap, /turn an idea into a clear brief/);
  assert.match(bootstrap, /prepare simple notes or checklists for sharing with a client or team/);
  assert.match(bootstrap, /edit any skill, expand it/);
  assert.doesNotMatch(bootstrap, /delivery preparation/);
});

test("ChatGPT setup supports batch and guided conversational approval", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.installation_modes.selection_required, true);
  assert.equal(config.installation_modes.default, "guided");
  assert.equal(config.installation_modes.options.batch.approval_scope, "approved_skill_list");
  assert.equal(config.installation_modes.options.batch.approval_count, 1);
  assert.equal(config.installation_modes.options.batch.continue_without_additional_approval, true);
  assert.equal(config.installation_modes.options.guided.approval_scope, "current_skill");
  assert.equal(config.installation_modes.options.guided.approval_count, "one_per_skill");
  assert.equal(config.installation_modes.options.guided.explain_each_before_creation, true);
  assert.deepEqual(config.installation_states, [
    "onboarding_complete",
    "workflow_profile_approved",
    "skill_list_approved",
    "installation_mode_selected",
    "installation_approved",
    "source_resolved",
    "creation_in_progress",
    "created",
    "created_not_installed",
    "installed",
    "already_present_needs_review",
    "blocked",
  ]);
  assert.equal(config.installation_confirmation.required, true);
  assert.equal(config.installation_confirmation.method, "conversation");
  assert.equal(config.installation_confirmation.separate_ui_prompt_expected, false);
  assert.equal(config.installation_confirmation.assistant_ui_introspection_required, false);
  assert.equal(config.installation_confirmation.batch_approval_authorizes_all_selected_skills, true);
  assert.equal(config.installation_confirmation.guided_approval_authorizes_current_skill, true);
  assert.equal(config.installation_confirmation.approval_alone_marks_installed, false);
  assert.deepEqual(config.installation_confirmation.successful_install_evidence, [
    "active_skill_creator_reports_created_and_saved",
    "skill_visible_in_chatgpt_skills_library",
  ]);
  for (const reply of ["yes", "approve", "install", "tak", "zatwierdzam", "instaluj"]) {
    assert.ok(config.installation_confirmation.accepted_user_replies.includes(reply));
  }
});

test("ChatGPT voice-mode setup can approve decisions but cannot mark skills installed", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.voice_mode_rules.voice_approval_can_authorize_profile, true);
  assert.equal(config.voice_mode_rules.voice_approval_can_authorize_skill_list, true);
  assert.equal(config.voice_mode_rules.voice_approval_can_select_installation_mode, true);
  assert.equal(config.voice_mode_rules.voice_approval_can_authorize_creation, true);
  assert.equal(config.voice_mode_rules.approval_alone_marks_installed, false);
  assert.equal(config.voice_mode_rules.assistant_must_not_claim_ui_introspection, true);
});

test("ChatGPT provider-cost preflight is required before paid external execution", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  assert.equal(config.provider_cost_preflight.default_paid_external_execution, "disabled");
  assert.equal(config.provider_cost_preflight.provider_mention_is_not_consent, true);
  assert.equal(config.provider_cost_preflight.require_current_explicit_approval, true);
  assert.equal(config.provider_cost_preflight.unknown_cost_label, "Unknown");
  for (const field of [
    "provider",
    "tool_or_operation",
    "inputs_and_operation_count",
    "estimated_or_unknown_cost",
    "billing_unit",
    "uploaded_data_scope",
    "privacy_risks",
    "limits",
    "retry_policy",
    "verification_plan",
  ]) {
    assert.ok(config.provider_cost_preflight.required_fields.includes(field), `missing ${field}`);
  }
});

test("ChatGPT bootstrap requires Work and distinguishes skill mention from tools", () => {
  const bootstrap = readFileSync(join(root, "CHATGPT_INSTALL.md"), "utf8");
  assert.match(bootstrap, /ChatGPT's \*\*Work\*\* surface/);
  assert.match(bootstrap, /Use @skill-creator/);
  assert.match(bootstrap, /native Skill mention, not a shell command/);
  assert.match(bootstrap, /switch to \*\*Work\*\* and paste the complete README prompt again/);
  assert.match(bootstrap, /Full batch installation/);
  assert.match(bootstrap, /Guided installation/);
  assert.match(bootstrap, /Do not wait for a separate interface prompt/);
  assert.match(bootstrap, /active `@skill-creator` workflow reports that it created and saved/);
  assert.match(bootstrap, /Use @skill-creator to help me create a skill\./);
  assert.doesNotMatch(bootstrap, /user does not need to type `?\$skill-creator`?/i);
});

test("ChatGPT source manifest covers every repository skill in declared install order", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const manifest = buildChatGptSkillSourceManifest(root);
  assert.equal(manifest.skills.length, 35);
  assert.deepEqual(manifest.skills.map((skill) => skill.name), config.profiles.full.skills);
  for (const skill of manifest.skills) {
    assert.ok(skill.files.some((file) => file.path === "SKILL.md"));
    assert.ok(skill.files.some((file) => file.path === "agents/openai.yaml"));
    for (const file of skill.files) {
      assert.match(file.sha256, /^[a-f0-9]{64}$/);
      assert.match(file.raw_url, /^https:\/\/raw\.githubusercontent\.com\//);
      assert.ok(file.repository_path.startsWith(`${skill.source_dir}/`));
    }
  }
});

test("new portable production skills are included in creative and full profiles", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const expected = [
    "caption-studio",
    "copy-voice",
    "creative-video-producer",
    "ecommerce-campaign-strategy-director",
    "opencut-video-studio",
    "producer-ai-task-builder",
    "research-evidence",
    "remotion-video-production",
    "screenplay-story-architect",
    "tool-routing-cost",
  ];
  for (const skill of expected) {
    assert.ok(config.profiles.creative.skills.includes(skill), `creative profile is missing ${skill}`);
    assert.ok(config.profiles.full.skills.includes(skill), `full profile is missing ${skill}`);
  }
});

test("ChatGPT post-install invocation policy matches every skill metadata file", () => {
  const config = JSON.parse(readFileSync(join(root, "config/chatgpt-skills.json"), "utf8"));
  const invocation = config.post_install_invocation;
  assert.equal(invocation.allow_implicit_routing_for_eligible_skills, true);
  assert.equal(invocation.prefer_smallest_sufficient_route, true);
  assert.equal(invocation.full_pipeline_requires_explicit_request_or_multistage_fit, true);
  assert.equal(invocation.explicit_route_skill, "workflow-orchestrator");
  assert.equal(invocation.explicit_pipeline_skill, "pipeline-core");
  assert.deepEqual(invocation.explicit_only_skills, [
    "onboarding-preference-tuning",
    "hipson-adapter",
    "workflow-self-improvement",
  ]);

  const explicitOnly = new Set(invocation.explicit_only_skills);
  for (const name of config.profiles.full.skills) {
    const metadata = readFileSync(join(root, `.agents/skills/${name}/agents/openai.yaml`), "utf8");
    assert.match(metadata, new RegExp(`allow_implicit_invocation: ${!explicitOnly.has(name)}`));
  }
});

test("ChatGPT setup validation rejects stale repository source hashes", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-source-stale-");
  const skill = join(fixture, ".agents/skills/brief-architect/SKILL.md");
  writeFileSync(skill, `${readFileSync(skill, "utf8")}\nRepository source changed.\n`);
  const errors = validateChatGptRepositorySetup(fixture);
  assert.ok(errors.some((error) => /source manifest is stale/.test(error.message)));
});

test("ChatGPT setup validation rejects a weak bootstrap contract", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-bootstrap-");
  const bootstrap = join(fixture, "CHATGPT_INSTALL.md");
  writeFileSync(bootstrap, readFileSync(bootstrap, "utf8").replace("## First Response", "## Start"));
  const errors = validateChatGptRepositorySetup(fixture);
  assert.ok(errors.some((error) => /missing section: First Response/.test(error.message)));
});

test("ChatGPT setup validation rejects invocation metadata drift", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-invocation-drift-");
  try {
    const metadata = join(fixture, ".agents/skills/brief-architect/agents/openai.yaml");
    writeFileSync(metadata, readFileSync(metadata, "utf8").replace("allow_implicit_invocation: true", "allow_implicit_invocation: false"));
    const errors = validateChatGptRepositorySetup(fixture);
    assert.ok(errors.some((error) => /brief-architect requires allow_implicit_invocation: true/.test(error.message)));
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("ChatGPT source manifest updater repairs a stale fixture", () => {
  const fixture = copyRepoFixture("framecore-chatgpt-source-update-");
  try {
    const skill = join(fixture, ".agents/skills/brief-architect/SKILL.md");
    writeFileSync(skill, `${readFileSync(skill, "utf8")}\nUpdated fixture source.\n`);
    assert.ok(validateChatGptRepositorySetup(fixture).some((error) => /source manifest is stale/.test(error.message)));
    writeChatGptSkillSourceManifest(fixture);
    assert.deepEqual(validateChatGptRepositorySetup(fixture), []);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
