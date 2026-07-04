# Advanced JSON Architecture (Nano Banana / Gemini 2.5 Flash)

Source: NANO_GENESIS_Commercial.txt sections 5.1-5.3, 5.6 + core-07-NANO_GENESIS.md Section 5.

## Meta-Control & Priority Stacks
Every Nano Banana JSON generation should open with a `meta_control` block that tells the model what to prioritize when instructions conflict:
```json
{
  "meta_control": {
    "generation_mode": "character_consistency | product_photography | editorial_print | marketing_asset",
    "priority_stack": ["highest_priority_element", "second_priority", "third_priority", "fallback_priority"],
    "quality_target": "draft | standard | high | maximum",
    "style_lock": "enabled | disabled",
    "consistency_strength": 0.85,
    "allow_variation_in": ["specific_allowed_variations"],
    "prohibit_variation_in": ["locked_elements"]
  }
}
```
- `priority_stack`: array top-to-bottom = highest-to-lowest priority when trade-offs occur.
- `consistency_strength`: 0.0-1.0; higher = stricter adherence to reference images. Use 0.90-0.95 for tight character lock, lower (0.7-0.85) when some creative drift across variations is acceptable.
- Always pair `allow_variation_in` with `prohibit_variation_in` — never leave both implicit.

Example (character with expression variation):
```json
{
  "meta_control": {
    "generation_mode": "character_consistency",
    "priority_stack": ["identity_lock", "expression_accuracy", "pose_naturalness", "environment_context"],
    "consistency_strength": 0.95,
    "allow_variation_in": ["expression", "pose", "clothing", "environment"],
    "prohibit_variation_in": ["facial_features", "hair", "body_proportions", "skin_tone"]
  }
}
```

## Multi-Panel Layouts & Grid Systems
For comic panels, storyboards, or multi-frame grids:
```json
{
  "frame": {
    "layout": {"type": "grid | comic | storyboard", "columns": 4, "rows": 3, "total_panels": 12, "gutter_width": "2px white", "panel_uniformity": "identical_dimensions | varied_for_emphasis"}
  },
  "cross_panel_consistency": {
    "character": "same identity all panels (reference character lock)",
    "environment": "same location OR progression through locations",
    "lighting": "consistent light direction unless time/location changes",
    "color_grade": "unified color treatment across all panels",
    "style": "identical artistic style all panels"
  }
}
```
Common grid patterns: 2x2 (4-panel comparison), 3x1 strip (sequence/before-after-after), 4x3 (12-panel expression/pose sheet).

## Identity Locking with Multiple Reference Images
When more than one reference image is supplied, be explicit about what each reference contributes (e.g. reference 1 = face/front, reference 2 = profile, reference 3 = pose range) rather than letting the model average them ambiguously.

## Layered Scene Architecture (multi-element compositions)
```json
{
  "scene_architecture": {
    "foreground": {"elements": ["[PRIMARY SUBJECT]"], "depth": "closest to camera", "focus": "sharp, highest detail"},
    "midground": {"elements": ["[SUPPORTING ELEMENTS]"], "depth": "mid-distance", "focus": "sharp to slightly soft"},
    "background": {"elements": ["[ENVIRONMENT, CONTEXT]"], "depth": "furthest", "focus": "soft bokeh or contextual"}
  },
  "depth_cues": {
    "atmospheric_perspective": "distant objects cooler, less saturated",
    "size_diminution": "farther objects smaller",
    "overlap": "foreground obscures background",
    "detail_gradation": "less detail with distance",
    "aerial_perspective": "slight haze in deep background"
  }
}
```
Use this whenever a scene has 3+ distinct depth layers that need independent focus/lighting/color treatment — plain single-subject product shots don't need it.

## Editorial Print-Ready Specifications
- Magazine/editorial: 300 DPI minimum. Large-format poster: 150 DPI. Billboard: 30-50 DPI. Fine art print: 300-600 DPI.
- Generate in RGB, convert to CMYK in post-production for professional print runs.
- Bleed: extend image 0.125-0.25in beyond trim edge. Safe zone: keep critical content 0.25-0.5in inside trim.

## When to Use Nano Banana (JSON) vs Imagen (Natural Language)
**Nano Banana (JSON)**: character consistency across multiple images (up to 14 references), multi-panel layouts/grids, editorial print-ready quality, complex material rendering, precise technical control.
**Imagen (natural language)**: fast iteration/exploration, single-shot high-quality output, photorealistic product photography, marketing assets needing text rendering, whenever JSON overhead isn't justified by the task.
