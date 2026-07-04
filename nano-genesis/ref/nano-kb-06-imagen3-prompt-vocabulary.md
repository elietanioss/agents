# Imagen 3 Prompt Vocabulary — Lighting, Camera, Color, Composition, Text

Source: NANO_GENESIS_Commercial.txt sections 6.1-6.6 (richest vocabulary source — use this over paraphrasing).

## Prompt Structure
Optimal pattern: `[SHOT TYPE] of [SUBJECT] [DOING WHAT] in/on [ENVIRONMENT]. [LIGHTING]. [STYLE]. [TECHNICAL SPECS]. [MOOD/ATMOSPHERE].`

Example: "Professional product photography of wireless headphones on reflective black surface with gradient background. Dramatic studio lighting with rim highlights. Modern tech aesthetic. 4K commercial quality. Futuristic premium mood."

By genre:
- **Portrait**: "Professional [type] portrait of [subject]. [lens/aperture]. [lighting setup]. [background]. [mood]. [processing style]. High-resolution commercial quality."
- **Product**: "[type] photography of [product] on [surface/bg]. [lighting style]. [angle/framing]. [purpose]. [quality level]."
- **Food**: "[angle] food photography of [dish]. [plating/styling]. [lighting]. [surface/props]. [mood]. [purpose]. Professional culinary quality."
- **Digital illustration**: "Digital illustration of [subject] in [art style]. [color palette]. [detail level]. [composition]. [mood]."
- **Traditional media simulation**: "[medium] artwork of [subject]. [artist influence/movement]. [color approach]. [composition style]. [mood]."
- **3D render**: "3D render of [subject] in [rendering style]. [material properties]. [lighting setup]. [background]. [technical approach]."

## Lighting Vocabulary
**Natural light:**
- Golden hour: warm, soft diffused, long shadows, glowing atmosphere
- Blue hour: cool twilight, soft ambient, deep blue tones, minimal shadows
- Overcast: soft even diffused, no harsh shadows, muted tones
- Direct sunlight: high contrast, sharp defined shadows, intense highlights
- Window light: soft directional but diffused, gentle shadows, interior daylight

**Studio setups:**
- Three-point: key+fill+rim, dimensional depth, balanced illumination
- Rembrandt: triangular cheek highlight, dramatic side light, classical portrait, chiaroscuro
- Butterfly/Paramount: overhead frontal key, symmetrical nose shadow, glamour
- Split: one side lit, other in shadow, dramatic contrast, editorial
- Loop: slight angle off camera axis, small nose-shadow loop, flattering
- Broad / Short: key light toward camera-side of face (widening) vs away (slimming)
- Rim/edge: strong backlight, bright edge highlight, subject separation
- Clamshell: beauty dish above + reflector below, glamour headshot

**Specialty:** Neon/colored (vibrant glow + atmospheric fog, cyberpunk), Practical (visible in-scene light sources, cinematic realism), Chiaroscuro (extreme light/dark contrast, painterly), High-key (bright even, minimal shadow, commercial), Low-key (predominantly dark, selective illumination, moody).

## Camera & Lens Vocabulary
| Focal length | Effect |
|---|---|
| Wide (16-35mm) | Expansive FOV, environmental context, slight distortion, dynamic |
| Standard (40-60mm) | Natural perspective, minimal distortion, eye-like view |
| Portrait (70-135mm) | Compressed perspective, flattering, beautiful bokeh, subject isolation |
| Telephoto (200mm+) | Extreme compression, distant magnification, shallow DOF |
| Macro | 1:1 magnification, extreme close-up, texture emphasis |

Aperture: wide-open f/1.2-2.8 (extremely shallow DOF, creamy bokeh) · moderate f/4-5.6 (balanced sharpness, gentle blur) · deep f/8-16 (foreground-to-background sharp).

Angles: eye-level (neutral, natural) · low-angle (heroic, imposing, looking up) · high-angle (vulnerable, spatial overview, looking down) · Dutch/tilted (dynamic tension, unsettling, editorial) · overhead/bird's-eye (flat lay, graphic).

## Color & Mood Vocabulary
Palettes: warm (reds/oranges/yellows, cozy energetic) · cool (blues/greens/purples, calm sophisticated) · monochromatic (tonal variation, unified minimalism) · complementary (opposite-wheel, high contrast) · analogous (3 adjacent, cohesive flow) · triadic (3 equally-spaced, vibrant balanced) · muted/desaturated (subtle, vintage/minimalist) · vibrant/saturated (bold, energetic).

Moods: professional/corporate, luxurious/premium, playful/fun, dramatic/intense, serene/calm, edgy/bold, nostalgic/vintage, futuristic/modern — each maps to a one-line descriptor phrase (see source for exact wording per mood).

## Compositional Techniques
Rule of thirds, golden ratio spiral, leading lines, natural framing (doorway/window/arch), symmetry vs intentional asymmetry, negative space (minimalist isolation), pattern/repetition with one breaking element as focal point, depth layers (distinct foreground/midground/background).

## Text Rendering in Imagen 3
- Max ~25 characters per text element; multiple text elements are possible; legible rendering across various font styles.
- Pattern: `[image description]. Include text '[EXACT TEXT]' in [placement] in [font style] [color] font.`
- Styled: `... Text '[text]' in [bold/italic/outlined] [font description] style positioned [location].`
- Multiple elements: `... Title text '[title]' at top in large bold font. Subtitle '[subtitle]' below in smaller text.`
- With effects: `... Text '[text]' with [outline/shadow/glow] effect for visibility against [background].`
- **Reminder**: this is the ONLY reliable path to correct on-image text. Never expect readable text from a generic prompt — always use one of these explicit text-directive patterns, and still plan to verify/refine in post (see nano-genesis.md TEXT ON IMAGES warning).

## Comprehensive Databases (quick lookup)
- **Shot types**: portrait (headshot, environmental, candid, group, lifestyle), product (hero, lifestyle, detail/macro, 360°, packaging, scale, group), food (overhead/flat-lay, 45°, close-up/macro, action, lifestyle/table), architectural (exterior elevation/perspective, interior wide/detail, aerial/drone), lifestyle/editorial (candid, editorial fashion, documentary, conceptual).
- **Artistic styles**: digital (photorealistic, stylized realism, low-poly, flat design, isometric, pixel art, vector, glitch, vaporwave, cyberpunk); traditional movements (impressionism, expressionism, art nouveau, art deco, surrealism, abstract, minimalism, pop art, cubism); photography styles (documentary, fine art, commercial, editorial, street, cinematic).
