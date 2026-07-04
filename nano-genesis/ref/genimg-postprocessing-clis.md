# Image Post-Processing CLIs for Imagen 4 Generation

## Overview
After Imagen 4 generates base images via Vertex AI, post-processing CLIs provide batch operations, effects, vector conversion, and export optimization. These are optional enhancement chains — not required for basic generation but enable professional deliverables.

**Sources:** CLI-Anything-main project (GitHub HKUDS/CLI-Anything); used in production workflows after nano-genesis raw generation.

---

## Available Post-Processing CLIs

### GIMP Batch Mode
**Purpose:** Raster operations (filters, color correction, effects, layer compositing)
**Install:** Included in most systems; verify: `gimp --version`
**Invoke:** `gimp -i -b '(script-fu-do-something 1 2)'` (headless, batch mode)
**Key patterns:**
- Filter chains (blur → sharpen → levels)
- Color correction (curves, levels, saturation)
- Watermark overlay
- Batch export to multiple formats (PNG, JPEG, WebP)

**Gotcha:** Script-Fu syntax is Scheme-dialect; requires careful quoting. For complex ops, use Python-Fu instead (GIMP 2.10+).

**Source:** `CLI-Anything-main\gimp\`

---

### Inkscape CLI
**Purpose:** Vector editing and export (SVG → PDF, EPS, PNG, WebP)
**Install:** `winget install Inkscape` or `brew install inkscape` (macOS)
**Invoke:** `inkscape input.svg --export-filename=output.png --export-type=png`
**Key patterns:**
- SVG → raster format conversion (preserves quality at any scale)
- Text rendering and font substitution
- Batch export to multiple resolutions (3x, 2x, 1x for responsive web)
- Trim/resize canvas
- Save optimized SVG (removes metadata, shortens paths)

**Common exports:**
```bash
inkscape logo.svg --export-filename=logo.png --export-type=png --export-dpi=300  # Hi-res PNG
inkscape banner.svg --export-filename=banner.pdf --export-type=pdf                 # Vector PDF
inkscape icon.svg --export-filename=icon.webp --export-type=webp                   # WebP (web)
```

**Gotcha:** Export filename must be absolute or relative from CWD (no `--export-dir` separate from `--export-filename`).

**Source:** `CLI-Anything-main\inkscape\`

---

### Krita CLI Export Pipeline
**Purpose:** Digital painting/drawing post-export (XCF native format → multiple formats)
**Install:** `winget install Krita` or `brew install krita` (macOS)
**Invoke:** `krita --export-as filename.kra --export filename.png`
**Key patterns:**
- Flatten layers and export
- Batch PNG/JPEG/WebP export from Krita projects
- DPI-aware export for print (300 DPI)
- Transparency handling and background removal

**Gotcha:** Krita CLI support is limited compared to Inkscape; designed for export workflows more than complex batch ops.

**Source:** `CLI-Anything-main\krita\`

---

## ComfyUI as Local Generation Alternative

**Purpose:** Headless diffusion pipeline orchestration (alternative to cloud Vertex AI for local generation)
**Workflow:** REST-driven node graphs; supports custom models, LoRA, embeddings, and sampler control
**Install:** `pip install comfyui` or docker: `docker run --gpus all comfyui-rest`
**Invoke:** POST JSON workflow to REST endpoint (`http://localhost:8188/api/prompt`)
**Key patterns:**
- Batch generation (100+ images in parallel, limited by VRAM)
- Custom model loading (Civitai, HuggingFace)
- LoRA/ControlNet chaining
- Sampler fine-tuning (K-Sampler, DPM++, Euler)
- Local storage (no cloud upload)

**Gotcha:** Requires GPU (NVIDIA CUDA recommended); CPU mode is ~100× slower.

**When to use vs Vertex AI:**
- **ComfyUI:** Batch generation, custom models, local data privacy, fine-tuned sampling
- **Vertex AI:** Fast single image, fewer dependencies, higher VRAM efficiency per request

**Source:** `CLI-Anything-main\comfyui\`

---

## Novita CLI for Alternative LLM-Capable Models

**Purpose:** OpenAI-compatible API access to DeepSeek, GLM, MiniMax models (image + text generation in one flow)
**Install:** `pip install novita-sdk`
**Invoke:** `novita generate --model=deepseek-v2 --prompt="..."`
**Key patterns:**
- Multi-modal generation (text + image in same request)
- Fallback when Vertex AI quota exhausted
- Faster inference for simpler image tasks

**Gotcha:** Requires Novita API key (different from Google/OpenAI credentials).

**Source:** `CLI-Anything-main\novita\`

---

## Recommended Workflow Chain

### Simple enhancement (most common):
```
Vertex AI generate → Inkscape export-as (PNG) → Deliver
```

### Professional e-commerce photography:
```
Vertex AI generate (base shot)
  → GIMP batch: color correction + sharpening
  → Inkscape: resize to 3x/2x/1x for responsive web
  → Deliver PNG + WebP variants
```

### Batch social content:
```
Vertex AI generate (10 variants)
  → Parallel: GIMP (color correct each)
  → Parallel: Inkscape (export to Twitter 16:9, Instagram 1:1, Pinterest 2:3)
  → Deliver categorized by platform
```

---

## Integration Checklist

- [ ] Vertex AI image script (`generate-image.py`) produces base PNG
- [ ] Inkscape installed + PATH verified
- [ ] GIMP batch script templates pre-written for common filters
- [ ] Output directories organized (raw/ → processed/ → deliverables/)
- [ ] Format variants documented (web PNG, hi-res JPEG, vector PDF if applicable)
- [ ] Batch driver script chains operations with error handling

---

## References

- **Inkscape CLI:** https://inkscape.org/doc/inkscape-man.html (search `--export`)
- **GIMP Batch:** https://www.gimp.org/docs/userfaq.html#q-batch-mode
- **ComfyUI REST:** https://github.com/comfyorg/ComfyUI/wiki/API
- **Novita SDK:** https://novita.ai/docs/api/v1/txt2img

---

**Last updated:** 2026-07-03 | **Sources:** CLI-Anything-main, Vertex AI integration docs
