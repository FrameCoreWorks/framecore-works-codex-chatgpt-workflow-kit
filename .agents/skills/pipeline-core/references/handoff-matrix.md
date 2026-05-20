# Handoff Matrix

| From | To | Required fields |
|---|---|---|
| intent-confirmation | workflow-orchestrator | confirmed_goal, excluded_scope, work_mode, expected_output, immediate_next_step |
| workflow-orchestrator | brief-architect | goal, raw_context, constraints, expected_artifact |
| workflow-orchestrator | instruction-packet-factory | target_role, packet_type, context, goal, exclusions, output_need |
| instruction-packet-factory | research-evidence | packet_id, goal, source_rules, acceptance_criteria, output_schema |
| instruction-packet-factory | reference-curator | packet_id, reference_goals, suppression_rules, output_schema |
| brief-architect | reference-curator | brief_contract, reference_needs, constraints |
| reference-curator | static-direction | reference_pack, continuity_anchors, suppression_rules |
| reference-curator | motion-direction | reference_pack, continuity_anchors, suppression_rules |
| static-direction | image-prompting | direction_contract, prompt_constraints, copy_requirements |
| motion-direction | storyboard-architect | motion_direction, timing_constraints, continuity_rules |
| storyboard-architect | video-prompting | storyboard_contract, shot_cards, continuity_rules |
| storyboard-architect | hyperframes-producer | storyboard_contract, timing, copy, render_constraints |
| copy-voice | image-prompting | exact_copy, tone_notes, text_lock |
| copy-voice | video-prompting | VO, dialogue, supers, tone_notes |
| image-prompting | tool-routing-cost | prompt_pack, asset_requirements, acceptance_criteria |
| video-prompting | tool-routing-cost | prompt_pack, timing, acceptance_criteria |
| tool-routing-cost | execution-manifest | selected_tool, approval_status, required_inputs, output_plan, risks |
| execution-manifest | asset-manifest | output_files, params_summary, source_notes, redaction_status |
| asset-manifest | qa-iteration | file_list, source_traceability, acceptance_criteria |
| qa-iteration | delivery-documentation | accepted_assets, excluded_assets, QA status, caveats |

Invalid handoffs:

- prompt roles directly to delivery without QA when generated assets exist
- delivery without explicit user delivery request
- execution without tool-routing-cost when a user-configured tool is needed
- workflow self-improvement proposals adopted without explicit approval
