# Product Photography Arsenal

Source: NANO_GENESIS_Commercial.txt sections 3, 5.5 + core-07-NANO_GENESIS.md Section 3.

## E-Commerce Hero Shot Standards
- Resolution: min 2000x2000px, ideal 2500x2500px. Aspect ratio 1:1 (4:5 for Instagram).
- Background: pure white #FFFFFF or transparent PNG. Format: PNG w/ transparency primary, JPG white-bg backup.
- Color space sRGB, file size under 1MB web.
- Lighting: even soft professional, no harsh shadows. Focus: entire product sharp (f/8-f/11 equivalent).
- Framing: product fills 80-85% of frame with breathing room. Angle: straight-on or slight 3/4.

Three-point lighting JSON skeleton: key light (large softbox camera-right 45°), fill light (softbox camera-left 30% key intensity), back/rim light (soft, behind-top, edge definition), subtle highlight on logo/glossy areas for dimension.

### Multi-angle e-commerce set (5 images)
1. Hero shot (front/3-4 view) — primary listing image, all key features visible
2. Side profile (90°) — shows thickness/profile
3. Top view (bird's eye) — shows adjustment mechanisms, hardware detail
4. Detail/macro shot — close-up on controls/ports/texture
5. Flat lay (viewed from above) — shows compact/full-size storage

Naming: `ProductName_HeroShot_2500x2500.png`, `_SideView_`, `_TopView_`, `_DetailControls_`, `_FlatLay_`.

## Lifestyle Product Photography
Core elements: realistic context matching target audience; human element (hands/person using, or implied presence); visual story showing benefit; shallow DOF (product sharp, background soft blur f/2.8-f/4); natural/authentic not overly staged.

Scenario library by product type:
- **Tech** (headphones/phones/laptops): person wearing/using in café or modern workspace; product + coffee + laptop desk setup; outdoors with natural light.
- **Fashion/accessories**: worn by model with outfit visible; flat lay with complementary items; close-up in-use (watch on wrist); lifestyle scene (bag on café table).
- **Home/kitchen**: in clean modern kitchen, in-use by hands, styled with complementary items, shown at scale in living space.
- **Fitness/sports**: athletic pose with product, gym/outdoor environment, in-use close-up, post-workout scene.

Camera: 3/4 view slightly above table height, medium shot, 50-85mm equivalent, f/2.8-f/4 aperture, focus point on product. Lighting: natural ambient + soft fill, warm color temp 3500-4500K for café/home scenes. Composition: rule of thirds, layered depth (foreground/midground/background).

## 360° Product Views
Frame-count tiers: Basic 8 frames (45° increments), Standard 12 (30°), Premium 24 (15°), Ultra 36 (10°).

Non-negotiable consistency requirements across ALL frames:
- Identical lighting, camera position, background every frame (no drift)
- Product rotates on exact center axis, no position/scale drift
- Same upright orientation, no tilt between frames
- Min 2000x2000px per frame, sequential naming (`product_frame_001.png`...)
- Shadow does NOT rotate with product (use rim/edge lighting instead of a rotating cast shadow)

Verification checklist before delivery: all frames generated; size/position/lighting/background identical across frames; smooth rotation increments; sequential correct naming; ready for web rotation viewer.

## Advanced Techniques

**Levitation/floating** — product suspended mid-air, soft shadow beneath on invisible surface, strong rim light from behind for edge glow, dark gradient background (#1A1A1A→#2D2D2D). Mood: premium, high-tech, futuristic.

**Splash photography** — dynamic water/liquid frozen mid-splash around product (waterproof gear, beverages, "fresh/clean" messaging). Bright backlight to illuminate droplets + front fill light on product. Dark background contrasts bright water. Freeze-motion sharpness on all droplets.

**Reflection/mirror** — product on glossy black acrylic/glass, clear mirror reflection below. Key light from above-front avoiding harsh reflections; rim light for separation; gradient background (dark at product level, lighter above) for elegance. Symmetric composition.

**Knolling/flat lay** — product + complementary items arranged at strict 90° angles (parallel/perpendicular only), even gaps, color-coordinated. Camera directly overhead, zero parallax distortion. Even lighting from all sides to eliminate shadows. Mood: organized, curated, aspirational.

## Advanced Material Rendering (critical for product/editorial work)
Material-specific JSON specs — always include the relevant block when the product is:
- **Subsurface scattering** (skin, wax, fruit): backlight is essential to reveal light penetration/glow through thin areas; warmer red-shift tones in lit areas.
- **Metal**: distinguish polished (mirror reflectivity, crisp highlights) vs brushed (directional linear reflection pattern) vs chrome (extreme mirror + intense pinpoint highlights); metal takes on the color of its lit environment.
- **Fabric/textile**: cotton (matte, visible weave close-up), silk (fine sheen, fluid drape), wool (fuzzy nap, structured folds), denim (twill texture, natural fading/whiskers), leather (smooth/grained, realistic crease at bend points).
- **Glass/transparent**: clear (minimal color, crisp refraction) vs frosted (diffused, no sharp refraction) vs tinted (color cast, reduced transparency) vs textured (distorted refraction pattern); backlight shows transparency best, side-light creates edge highlights.

## Product Category Quick-Reference
Tech products, fashion/apparel, food & beverage, beauty/cosmetics, home/furniture each have distinct default lighting/prop/mood conventions — check `nano-kb-04-marketing-assets.md` color-palette-by-industry table and cross-reference with the brand-personality table in `nano-kb-01` before defaulting.
