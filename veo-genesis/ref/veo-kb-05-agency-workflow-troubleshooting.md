# Agency Workflow, QA, and Troubleshooting

Source: core-08-VEO_GENESIS.md Section 9 + CRITICAL RULES + QA checklist.

## Client Intake Framework
**Phase 1 — initial contact**: client name/company, industry, project type, primary use case/platform, quantity of videos, timeline, budget. Core questions: primary goal (sales/awareness/education/engagement)? target audience (demographics/psychographics/platform)? where will videos be used? existing brand guidelines/references?

**Phase 2 — creative brief development**: video specs (platform, aspect ratio, duration, quantity, resolution), content requirements (subject/focus, key message, CTA, dialogue source, music source), visual direction (style/mood/lighting/camera work), brand assets (logo, colors, fonts, product images, references), audio requirements (dialogue script source, voice, music genre, ambient environment).

**Phase 3 — brief confirmation**: write a full creative brief document (objectives, audience, specs, visual direction, script, audio direction, timeline, revision policy — typically 2 rounds included, approval process). Get written sign-off before production.

**Phase 4 — prompt engineering**: extract subject/action/scene/style/dialogue/audio/technical from the brief → structure as 7-component or JSON → generate 2-3 concept variations → quality-check against brief and technical specs before presenting.

**Phase 5 — client presentation**: organized presentation with brief for context, explain creative decisions, present variations, request specific feedback (what works / what needs adjustment / matches brief / achieves goal), categorize feedback as Technical / Creative / Content / Fundamental.

## Revision Management
Classify every revision request before acting:
- **Type A (minor tweaks, fixable in post)**: audio level, color grade tweak, slight timing, music selection, minor text overlay.
- **Type B (prompt adjustment, requires re-generation)**: dialogue changes, camera angle/movement, lighting style, action/gesture, scene environment.
- **Type C (fundamental, new creative direction)**: complete subject change, different concept, major style shift, different messaging/objective — treat as new project/budget discussion, don't silently absorb into "revision."

Standard project includes 2 revision rounds: Round 1 = implement classified changes + deliver with change log; Round 2 = final polish only (minor audio/color/timing). Requests beyond 2 rounds or Type-C requests: communicate scope clearly, quote additional fee, get written agreement.

File naming: `ClientName_ProjectName_VideoNumber_Version_Date.mp4` e.g. `AcmeCorp_ProductLaunch_Video01_v1_2025-01-09.mp4` → `_v1.1_` → `_v2_` → `_FINAL_`. Keep a version-tracking table (video#, version, date, changes made, client feedback, status).

## Troubleshooting Guide (symptom → fix)
| Issue | Fix |
|---|---|
| Unwanted subtitles/captions | Colon syntax `Character says: "..."`; add "NO subtitles, NO captions, NO text overlays" to Technical |
| Dialogue not lip-synced | Check 8-second word-count rule; add explicit lip-sync-priority line; shorten/simplify phrasing |
| Audio hallucinations (crowd/laughter/etc) | Comprehensively specify all 4 audio layers + exclusion list; state "quiet professional space" explicitly |
| Character inconsistent across series | Word-for-word identical description every episode; same reference images; `consistency_id` in JSON |
| Camera movement too fast/slow/jerky | Specify exact duration + stabilization method + explicit start/end positions |
| Lighting too dark/harsh/flat | Name the setup explicitly; specify light source + direction; add exclusions to Technical |
| Subject/product not prominent | Specify shot type explicitly; "hero element, primary focus"; shallow DOF; raise in priority_stack |
| Wrong aspect ratio/duration generated | Double-check explicit JSON `output` block before generating; state platform by name in prompt |
| Dialogue too quiet / music too loud | Set explicit volume percentages for both; state "dialogue is absolute foreground priority"; add ducking instruction |
| Unwanted extra elements in scene | Comprehensive Technical negative list; describe scene with spatial specificity ("clean minimal background, no distractions") |

**Regenerate immediately if**: wrong subject/environment/aspect ratio, wrong duration/resolution, major quality issues (blurry, bad lighting, unusable audio).
**Adjust prompt + regenerate if**: consistent unwanted elements (refine negatives), style mismatch (refine style descriptors), character inconsistency (tighten description), audio issues (specify more comprehensively).
**Fixable in post**: minor color grade, small audio level tweaks, slight timing/speed, adding text overlays/graphics.

## Pre-Delivery QA Checklist
- [ ] Correct aspect ratio and duration and resolution for the specified platform
- [ ] Subject/product clearly visible and prominent
- [ ] Lighting matches creative brief; camera movement smooth and professional
- [ ] Dialogue clear, lip-synced, follows 8-second rule and colon syntax
- [ ] Audio mix balanced (dialogue foreground; no hallucinated sounds)
- [ ] No unwanted visual elements (subtitles, watermarks, clutter)
- [ ] Character consistent with reference (if series work)
- [ ] Matches brand guidelines; achieves creative brief objectives
- [ ] File named with version control; multiple format exports if needed (MP4 primary, MOV backup)

## Critical Rules (mandatory)
**Always**: use JSON for professional/master tier; specify all 7 components every time; colon syntax for every dialogue line; cap dialogue at 8 seconds (12-15 words); specify ambient sounds explicitly; include "(thats where the camera is)" for every camera position; read dialogue aloud to verify timing; specify phonetic pronunciation for tricky words; include "(no subtitles)" in Technical; use word-for-word identical character descriptions across a series.

**Never**: use quote-only dialogue format (triggers subtitles); exceed 8-second dialogue; omit negative prompts; skip character continuity for series work; leave audio unspecified; ignore platform aspect-ratio/duration specs.

## Success Metrics
| Category | Metric | Target |
|---|---|---|
| Production | Character consistency | 95%+ visual match across episodes |
| Production | Audio sync | 100% lip-sync, zero hallucinations |
| Production | Platform optimization | 100% meets technical specs |
| Client | First-pass success | 80%+ approval without major revision |
| Client | Revision turnaround | <2 hrs |
| Commercial | Revenue-ready | 100% usable without additional work |
