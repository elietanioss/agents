# Character Production System — Identity Locking, Expressions, Poses, Variations

Source: NANO_GENESIS_Commercial.txt section 2 + core-07-NANO_GENESIS.md Section 2.

## 14-Image Identity Lock Protocol
Generate these 14 foundation images FIRST, before any variation work, to lock character identity (facial structure, proportions, features, style).

**Core identity views (6):**
1. Front view, neutral expression — establishes baseline facial features/proportions
2. 3/4 view (45° camera-right), neutral — confirms depth, nose shape, profile
3. Profile view (90° side), neutral, eyes forward not at camera — locks nose/chin/forehead/ear placement
4. Back view, neutral pose — hair from behind, back of clothing
5. Close-up face, neutral — high detail on eyes/skin/hair texture
6. Full body, natural stance, slight 3/4 — body proportions, limb lengths, clothing

**Expression samples (4):** Happy/Smiling, Surprised, Thinking (hand on chin), Confident

**Pose samples (4):** Pointing, Waving, Arms Crossed, Sitting

All 14 share: solid neutral gray background (RGB 180,180,180), even soft studio lighting no harsh shadows, "professional reference sheet quality."

### Imagen 3 prompt template (natural language)
```
Full body character design of [character description].
Character: [age, gender, ethnicity, defining features]. [clothing]. [hair]. [personality traits reflected in design].
View: [front/3-4/profile/back/close-up].
Expression: Neutral, calm, looking at camera.
Background: Solid neutral gray (RGB 180,180,180).
Lighting: Even, soft studio lighting, no harsh shadows. Professional reference sheet quality.
Style: [photorealistic/illustrated/3D/cartoon]. Clean, clear details.
Technical: High resolution, sharp focus throughout, consistent proportions.
```

### Nano Banana JSON template (character reference sheet)
```json
{
  "meta_control": {
    "generation_mode": "character_reference_sheet",
    "priority_stack": ["character_consistency", "feature_clarity", "neutral_baseline", "reference_quality"],
    "quality_target": "high",
    "style_lock": "enabled"
  },
  "character": {
    "archetype": "...", "physical_attributes": {}, "personality_traits": [], "defining_features": []
  },
  "camera": {"angle": "front view", "distance": "full body in frame", "lens": "50mm equivalent", "height": "eye level"},
  "expression": {"type": "neutral", "mouth": "slight friendly curve", "eyes": "looking directly at camera"},
  "pose": {"stance": "standing straight, professional", "arms": "relaxed at sides"},
  "background": {"type": "solid_color", "color": "neutral gray RGB(180,180,180)"},
  "lighting": {"style": "professional reference lighting", "setup": "even soft light front + both sides"},
  "technical": {"resolution": "high (2048x2048 minimum)", "reference_sheet_quality": true}
}
```

## Expression Library (12 core emotions)
For each: mouth / eyes / eyebrows / facial_muscles / overall_mood / energy_level as JSON fields, plus a one-line Imagen 3 prompt addition.

1. **Happy/Joy** — wide smile teeth visible, eyes slightly squinted (Duchenne smile), radiant joy
2. **Surprised/Shocked** — mouth open O-shape, eyes wide max aperture, eyebrows raised high
3. **Thinking/Pondering** — eyes narrowed or gaze up, one eyebrow raised, often paired with hand-on-chin pose
4. **Concerned/Worried** — eyebrows furrowed inner-corners-raised (triangular), slight frown, tension in forehead/jaw
5. **Excited/Enthusiastic** — eyes wide bright, eyebrows dynamically raised, face fully engaged, very high energy
6. **Confident/Proud** — direct steady gaze, slight smile, shoulders back/open chest posture note
7. **Confused/Uncertain** — asymmetric eyebrows (one raised) or both questioning, head often tilted to side
8. **Friendly/Welcoming** — warm genuine smile (not overly big), soft gentle gaze, relaxed no tension
9. **Determined/Focused** — eyes intense/narrowed, eyebrows furrowed/lowered, firm mouth line, controlled tension
10. **Playful/Mischievous** — smirk/asymmetric grin, sparkle + slight squint eyes, one eyebrow raised
11. **Loving/Caring** — soft gentle compassionate eyes, tender smile, maximum facial softness
12. **Angry/Frustrated** — eyes narrowed intense hard gaze, eyebrows strongly furrowed toward center, clenched jaw

Full JSON field structure (repeat per expression):
```json
{"expression": {"type": "...", "mouth": "...", "eyes": "...", "eyebrows": "...", "facial_muscles": "...", "overall_mood": "...", "energy_level": "..."}}
```

## Multi-Pose Generation with Identity Lock
25-pose library across 4 categories: Business (Presenting, Welcoming, Thumbs Up, Pointing, Handshake Ready, Arms Crossed, Holding Clipboard, Sitting at Desk), Action (Running, Jumping, Celebrating, Reaching, Pulling/Pushing, Climbing), Casual (Relaxed Standing, Sitting Casually, Leaning, Walking, Waving, Phone Call), Emotional (Thinking, Surprised, Shrugging, Facepalm, Cheering).

Generation-with-reference-lock JSON skeleton:
```json
{
  "meta_control": {
    "generation_mode": "character_consistency",
    "priority_stack": ["identity_lock", "pose_accuracy", "expression_fidelity", "lighting_adaptation"],
    "reference_images": "use_all_uploaded",
    "consistency_strength": 0.95,
    "allow_variation_in": ["pose", "clothing_optional", "environment"]
  },
  "character": {
    "identity_source": "reference_images",
    "maintain_features": ["facial_structure", "eye_color_shape", "hair_style_color", "skin_tone_texture", "body_proportions", "defining_characteristics"]
  },
  "pose": {"type": "presenting", "description": "...", "arm_right": "...", "arm_left": "...", "legs": "...", "torso": "..."}
}
```

## Character Variations (outfit / environment / activity / age)
**Rule**: always declare `maintain_exact` (facial features, hair, proportions, skin tone, defining marks) alongside `variation_allow` (the one thing that changes). Never let both drift in the same generation.

- **Outfit change**: keep face/hair/proportions constant, swap clothing only (seasonal wardrobe, professional context, lifestyle activity).
- **Environment change**: keep identity + similar pose constant, swap background + match lighting to new environment (location series, time of day, season/weather).
- **Activity/action scenario**: keep identity constant, change action + props + environment together (hobbies, sports, work tasks).
- **Age progression/regression**: keep eye color/shape, facial structure proportions, hair color, defining marks recognizable; adjust skin smoothness, cheek/face roundness, body proportions, hair style, clothing for the target age. Consistency note: "must be clearly recognizable as same character at different age."

Best practices: always reference the 14-image lock; be explicit about what stays the same; use `consistency_strength` 0.90–0.95 for tight lock; test variations incrementally (small before large); keep lighting quality consistent across all variations.

## Style Adaptations & Character Sheets
Same character can be re-rendered across artistic styles (realistic/illustrated/simplified/icon) while keeping identity locked — useful for a full brand style guide. A comprehensive character asset package = base character (4K, transparent bg) + expression library (min 8) + pose library (min 8) + style variations + composite grid sheets + a color/usage guidelines PDF.
