# Client Brief Intelligence & Agency Workflow

Source: NANO_GENESIS_Commercial.txt sections 1, 8 + core-07-NANO_GENESIS.md Section 1, 6.

## Brief Analysis Framework

### Tier 1: Critical requirements (must-have before generating)
1. Primary asset type (character, product, marketing, editorial)
2. Intended use case (website, print, social, packaging)
3. Technical specs (resolution, format, aspect ratio)
4. Brand context (existing brand, new brand, style guidelines)
5. Delivery timeline

### Tier 2: Creative direction (should-have)
- Subject matter, style preference (photorealistic/illustrated/minimalist/dramatic)
- Mood/emotion, color palette, lighting preference, composition type

### Tier 3: Technical nice-to-haves
- Exact DPI, color space, file size caps, safe-zone requirements

## Gap Detection Protocol
Common missing info and the default/ask response:
| Gap | Response |
|---|---|
| Aspect ratio not specified | Ask, or suggest based on use case |
| No mood/emotion guidance | Suggest options based on industry/product |
| No lighting preference | Recommend professional studio lighting as default |
| No background preference | Suggest clean/white for product, contextual for lifestyle |
| Character details incomplete | Request age, gender, ethnicity, clothing, personality |
| Product details missing | Request material, color, size reference, key features |

## Value-Add Suggestions (proactive)
- E-commerce: "I recommend 5 angles: front, 3/4, side, detail, lifestyle"
- Social: "I suggest variations for Instagram (1:1), Stories (9:16), Facebook (1.91:1)"
- Brand character: "I can create a 14-image identity lock with 12 expressions for consistency"
- Product launch: bundle = hero shot + lifestyle + infographic background + social ads

## Marketing Language → Visual Translation
| Client says | Visual translation |
|---|---|
| Premium/Luxury | Dramatic lighting, dark bg + rim lights, reflective surfaces, shallow DOF |
| Modern/Cutting-Edge | Clean lines, minimalist bg, cool color temp, geometric composition, high contrast |
| Warm/Approachable | Soft natural lighting, golden-hour tones, lifestyle context |
| Professional/Corporate | Balanced three-point lighting, neutral bg, centered, sharp throughout |
| Fun/Playful | Bright vibrant colors, dynamic angles, energetic poses |
| Trustworthy/Reliable | Even lighting, straightforward angles, realistic rendering, no excess effects |
| Innovative/Futuristic | Dramatic angles, neon accents, sci-fi elements, abstract bg |
| Natural/Organic | Soft diffused lighting, earth tones, natural textures, outdoor |

Abstract-concept translations:
- "Make it pop" → high contrast + vibrant accents + diagonal composition + sharp subject/blurred bg + dramatic highlights
- "Needs to stand out" → bold complementary contrast + unconventional angle + selective focus + negative space
- "Make it feel expensive" → dramatic rim light on dark bg + reflective surface + shallow DOF + metallic/leather texture
- "Should feel trustworthy" → even lighting no harsh shadows + neutral bg + straight-on/slight 3/4 angle + realistic proportions

Vague-request clarifying questions:
- "Make it pop" → "High saturation? Bold contrast? Dramatic lighting?"
- "Something fresh" → "Unconventional composition? Unexpected colors? Modern minimal?"
- "On-brand" → "Specific brand colors? Existing visual style? Mood alignment?"

## Brand Personality → Visual Style
| Personality | Lighting | Color | Composition | Style |
|---|---|---|---|---|
| Corporate B2B | Professional studio | Blues, grays, white | Centered, balanced | Clean, sharp |
| Tech Startup | Bright, modern | Vibrant, gradients | Dynamic angles | Contemporary |
| Lifestyle Brand | Natural, soft | Warm, earth tones | Lifestyle scenes | Relatable |
| Luxury Brand | Dramatic, moody | Black, gold, deep | Elegant, simple | Sophisticated |
| Health/Wellness | Soft, bright | Pastels, white | Airy, spacious | Fresh, clean |
| Entertainment | Bold, colorful | Vibrant, contrasting | Dynamic, energetic | Eye-catching |

## Revision Management
Categorize every revision before acting:
- **Technical (easy)** — aspect ratio, background color, crop, resolution, format → quick regen with locked creative params
- **Creative (moderate)** — lighting adjustment, color grading, composition refinement, mood shift → modify specific JSON/prompt elements while preserving approved elements
- **Fundamental (regenerate)** — subject change, style overhaul, angle/perspective change, identity modification → start fresh, apply lessons learned

Example — client says "make it brighter and warmer": adjust `overall_exposure +1.5 stops`, `color_temperature 5500K`, `shadow_fill +30%`, `warmth +20`; explicitly list `preserve_from_original: [composition, subject_pose, background_elements, camera_angle]`.

### Revision scope categories (agency framing)
1. **Specification refinement (easy)** — colors, sizes, text, backgrounds → execute immediately
2. **Creative direction shift (moderate)** — different mood, alternate composition, style variation → estimate timeline, confirm direction first
3. **Scope change (complex)** — new elements not in original brief, concept pivot, expanded deliverable count → flag as scope change, discuss timeline/budget before proceeding

### File naming & version control
```
ClientName_AssetType_Version_Status.ext
AcmeCorp_HeadphonesHero_v1_Draft.png
AcmeCorp_HeadphonesHero_v3_Final_Approved.png
```
Full convention: `[CLIENT]_[PROJECT]_[ASSET-TYPE]_[VARIANT]_[SIZE]_[VERSION].ext`
e.g. `Acme_ProductLaunch_Hero_Concept-A_1080x1080_v1.png`

Folder structure:
```
PROJECT_ROOT/
├── 01_Brief/
├── 02_Concepts/{concept_a,concept_b,concept_c}/
├── 03_Approved/selected_direction/
├── 04_Revisions/revision_01/, revision_02/
└── 05_Finals/{web,print,source}/
```

Track feedback per version in a change log (version, generated date, specs, client feedback, action taken, status).

## Presentation & Approval
- **Conceptual directions (new projects)**: present 3 distinct aesthetic directions with strategic rationale each ("Best for X, mood: Y").
- **Refinement variants (polish stage)**: present 3 variants of the SAME concept differing in one dimension only.
- Approval language: "Which direction best aligns with [BRAND/CAMPAIGN GOAL]? I can refine the selected option with any adjustments needed."

## Project Intake Checklist
Client Name/Company, Industry, Project Type, Primary Use Case, Quantity of Assets, Timeline, Budget Range, plus the 8 creative-brief questions (objective, audience, emotional response, brand personality, key messages, deliverable specs, brand guidelines, success criteria).
