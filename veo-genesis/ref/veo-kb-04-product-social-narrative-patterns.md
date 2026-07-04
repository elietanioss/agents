# Content Pattern Library — Product, Social Platform, and Narrative Templates

Source: core-08-VEO_GENESIS.md Sections 2-4.

## Product Demonstration Patterns

**360° Product Rotation** (e-commerce/Amazon/catalog): product rotates smoothly 360° over 6-8s at constant speed, camera locked-off/static, tripod-mounted, shallow DOF (product sharp, bg blurred). Timing markers at quarter/half/three-quarter rotation highlighting different features. Technical negative must include "NO rotation wobble, NO speed inconsistencies, NO background color shifts."

**Feature Close-Up Demonstration**: slow dolly-in over 8s from medium shot to extreme close-up on one specific feature (stitching, hinge, texture); dramatic side lighting reveals texture depth; very shallow DOF with feature razor-sharp, everything else fading soft. Use for craftsmanship/material-quality storytelling.

**Lifestyle Context Integration**: show product in authentic real-world use (person wearing/using it in a café, office, outdoors); shallow DOF (f/2.8-f/4) keeps product sharp while environment blurs; camera 3/4 view slightly elevated; warm natural lighting 3500-4500K for cafés/homes.

**Before/After Transformation**: two approaches — (A) side-by-side split screen with divider + BEFORE/AFTER labels, both visible simultaneously; (B) sequential transition (0-3s before, transition effect at 4s, 5-8s after). Critical rule: SAME lighting, SAME camera angle/distance on both sides — anything else invalidates the comparison and reads as misleading.

## Social Platform Templates

**TikTok** (9:16, 6-8s optimal): Hook (0-2s, must be immediate), Body (2-6s, deliver on promise fast), CTA (6-8s, "follow for more"/"try this"). Authentic > polished; slight handheld acceptable; direct-to-camera eye contact throughout; trending-style music at 30% during speech / 65% during action. Vertical frame, subject fills it, ring-light aesthetic acceptable.

**Instagram Reels** (9:16, 6-8s optimal): more polished/aesthetic than TikTok, lifestyle-oriented, smooth stabilized movement (gimbal/tripod), aesthetic color grade matching brand (warm golden / cool moody / bright airy). Camera slightly above eye level for beauty content, eye level for lifestyle.

**YouTube Shorts** (9:16, 6-8s for quick tips): education-first — teach something specific with a clear actionable takeaway. Dialogue priority over music (100% foreground, music 10-20% max if present at all). Clean uncluttered background, stable tripod/gimbal camera for credibility.

**LinkedIn** (16:9 or 1:1, NOT 9:16): B2B professional value/thought-leadership. Business-professional or business-casual attire, excellent lighting on face, stable camera only (no handheld), neutral professional background, subtle corporate music if any.

**E-commerce/product pages** (16:9 or 1:1): product is hero and clearly visible, feature/quality/craftsmanship showcased, commercial-quality clean backgrounds, minimal music (40-60%) or optional voice-over.

### Platform selection flowchart
1. Aspect ratio first: vertical→TikTok/Reels/Shorts; horizontal→YouTube/LinkedIn/e-commerce; square→Feed/Facebook/LinkedIn.
2. Content type: entertainment/trends→TikTok; lifestyle/aesthetic→Reels; educational→Shorts; professional/B2B→LinkedIn; product showcase→e-commerce/YouTube.
3. Audience: Gen Z/young millennials→TikTok; millennials/lifestyle→Instagram; broad/educational→YouTube; professionals→LinkedIn; shoppers→e-commerce.

## Brand Storytelling Narrative Arcs

**Customer Journey (3-act, 8s)**: Act 1 (0-2s) problem/pain point, emotional state frustrated/overwhelmed; Act 2 (2-5s) discovery/solution, transition to relief; Act 3 (5-8s) transformation/result, satisfied/accomplished, subtle brand presence (not salesy). Camera progression: wide shot (chaos) → medium shot (solution) → close-up (satisfaction), continuous slow dolly-in throughout for intimacy.

**Tension → Release**: build tension (0-4s: uncertain/worried subject, cooler color grade, subtle handheld unease, tension-building music ~40%) then climax and release (4-8s: same subject now confident/relieved, warmer color grade, stabilizes, satisfying resolution chord, ~50% music). Critical: the release must actually deliver a satisfying payoff — don't let tension go unresolved or resolve weakly.

## Character Series Production

**Character consistency protocol**: lock a character reference sheet FIRST — physical_constants (age, ethnicity, gender, build, height, hair, eyes, facial features, distinctive marks, skin tone) that must be **word-for-word identical** across every episode prompt. Wardrobe can vary per-episode within a defined "wardrobe_signature" style; personality/speaking-style traits stay constant. Store up to 3 reference images per character, reused in every video prompt.

Production workflow: (1) develop + lock character reference sheet, generate 3 reference images, test consistency across 3 videos before committing to a series; (2) plan content calendar + scene variations while holding character constant; (3) generate episodes varying only outfit/environment/dialogue/action, always reusing the locked description; (4) verify each new episode against the reference sheet before delivery.

**Character inconsistency fix**: if a character looks different between episodes, the fix is always the same — use the word-for-word identical description, reference the same images, include `consistency_id` in the JSON, and check against the reference sheet before generating the next episode.
