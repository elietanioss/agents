# VEO 3 Technical Intelligence & Prompt Formats

Source: core-08-VEO_GENESIS.md Section 1.

## Technical Specs
- **Resolution**: 720p (default, faster, mobile-optimized) or 1080p (professional, final deliverables, desktop/TV).
- **Aspect ratios**: 16:9 horizontal (YouTube/LinkedIn/corporate), 9:16 vertical (TikTok/Reels/Shorts/mobile), 1:1 square (Instagram Feed/Facebook, versatile).
- **Duration**: 4s (quick cuts, b-roll, transitions), 6s (social ads, quick demos), 8s (optimal — full narrative, dialogue delivery, story beats).
- **Generation time**: ~2-3 min per video. Modes: `veo-3.0-fast-generate-preview` (testing/iteration) vs `veo-3.0-generate-preview` (final quality).
- **Native audio**: dialogue with lip-sync, ambient environmental sound, music scoring, sound effects — all generated natively, so all must be explicitly specified (see veo-kb-04 for hallucination prevention).
- **Character consistency**: up to 3 reference images per character; requires word-for-word description matching across a series (see veo-kb-03).

Selection guide: 720p for social/mobile/drafts, 1080p for client deliverables/TV/portfolio. 16:9 for YouTube/corporate/tutorials, 9:16 for TikTok/Reels/Shorts, 1:1 for Feed/Facebook. 4s for reveals/b-roll, 6s for single-feature ads, 8s for complete narratives/dialogue.

## The 7-Component Professional Format
VEO 3 responds best to this structure, in this order, every time:

1. **SUBJECT** — 15+ specific descriptors: character/object type, age/ethnicity/gender if human, build, height reference, hair, facial features, clothing (colors/style/fit/accessories), frame position, posture, emotional state.
2. **ACTION** — movement verb + timing + secondary gestures + expression changes + beginning→middle→end progression.
3. **SCENE** — location, lighting conditions, background elements near-to-far, props, spatial relationships, atmosphere, color palette, depth layers, practical lights.
4. **STYLE** — shot type (EWS/WS/MS/MCU/CU/ECU), aspect ratio, camera angle, camera movement + speed/direction, **camera positioning must include the literal phrase "(thats where the camera is)"**, stabilization method, focal length feel, depth of field, film grade/mood.
5. **DIALOGUE** — see veo-kb-02 for the full rule set (8-second rule, colon syntax, tone specification).
6. **SOUNDS** — dialogue quality/volume, ambient (3 layered elements), music (genre/mood/volume split dialogue-vs-instrumental), specific sounds, explicit hallucination-prevention exclusion list.
7. **TECHNICAL (negative prompt)** — exhaustive `NO [artifact/error/unwanted element]` list; this is not optional, it's how VEO 3 quality-controls itself.

## JSON-First Architecture
VEO 3 responds with superior precision to JSON-structured prompts vs natural-language paragraphs — use JSON whenever character continuity, multi-scene orchestration, or precise audio/cinematography control matters (i.e. Professional tier and above; see veo-genesis.md Complexity Tier System).

Master JSON skeleton (top-level keys): `version`, `output` (resolution/aspect_ratio/duration/frame_rate/generation_mode), `global_style` (visual_aesthetic/color_palette/film_grade/mood), `character` (name/consistency_id/physical/wardrobe/reference_images), `shot_composition` (subject/action/scene/cinematography/dialogue/audio/technical_negative), `meta_control` (priority_stack + quality_gates).

JSON workflow: copy master template → customize character/scene/dialogue → adjust cinematography/audio → set priority stack → generate → iterate via targeted JSON field edits (not full re-writes).

## Complexity Tier System
- **Basic** ($2-10 marketplace level): simple natural language, single subject, minimal camera movement, standard lighting. Use for quick product shots, simple b-roll, filler content.
- **Professional** (agency standard): full 7-component structure, JSON recommended, advanced camera work, named lighting setups, brand-guideline adherence, full audio engineering with hallucination prevention. Use for client deliverables, brand videos, product demos, corporate content.
- **Master** (broadcast quality): multi-scene timeline orchestration, character continuity with reference images, complex nested JSON with timeline markers, cinematic techniques (rack focus, crane, dolly combos), precise audio scoring. Use for brand mascot series, episodic content, commercial campaigns, broadcast ads.

| Request type | Tier | Format |
|---|---|---|
| Quick product shot | Basic | Natural language |
| Client brand video | Professional | 7-component JSON |
| Character series | Master | Full JSON with continuity |
| Social media ad | Professional | 7-component structured |
| Corporate presentation | Professional | 7-component JSON |
| Broadcast commercial | Master | Full JSON with timeline |
