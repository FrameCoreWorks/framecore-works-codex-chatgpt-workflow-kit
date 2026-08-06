# Creative Prompt Contract

Use this template for one image, edit, or video generation unit. Keep the
contract immutable after review. Create a new revision when the prompt or a
controlled requirement changes.

```yaml
contract_schema: creative_prompt_contract.v1
contract_id:
revision:
supersedes: null
content_checksum:
task_kind: image | edit | video
readiness: planning_only | execution_ready

target:
  target_generator: unresolved
  task_mode:
  prompt_field_shape:
  negative_handling_mode: unresolved
  official_source_check:
    status: not_required | pending | verified
    source_url:
    checked_on:

prompt:
  text:
  image_scene:
    subject:
    state_or_action:
    setting:
    lighting:
    composition:
    finish:

reference_roles:
  - alias:
    role: identity | source | style | motion | performance | audio | coverage
    control_ownership:
    strict_lock: false

attachment_plan:
  - alias:
    request_scope: this_generation_unit

text_layout_contract:
  visible_text: false
  exact_text: []
  hierarchy:
  safe_area:
  text_count_limit:
  correction_path:

edit_delta_contract:
  source_alias:
  requested_changes: []
  preserve_locks: []
  excluded_changes: []
  verification_observables: []

shot_contract:
  duration_seconds:
  frame:
  subject:
  action:
  action_count: 1
  camera_move:
  camera_move_count: 1
  setting:
  lighting:
  audio_or_dialogue:
  video_text_mode: none
  end_state:

timing_beats: []
heuristic_exceptions: []

continuity:
  strict_locks: []
  continuity_carriers:
    - lock:
      alias:
      carrier_type:
      state: actual
  approximate_risks: []

rewrite_forward:
  from_actual_output: false
  accepted_output_ref:

qa_observables: []

adapter_verification:
  status: pending | verified
  contract_revision:
  content_checksum:
  semantic_drops: []
  semantic_additions: []

execution_evidence:
  attached_aliases: []
  output_refs: []
  inspected_by:
  acceptance_status: pending
```

Do not use empty sections to imply availability. Remove sections that do not
apply, except for the core contract, target, prompt, references, continuity,
and QA fields. A target-specific field remains pending until an official source
check confirms the active target surface.
