# Game Development CLIs — Blender, RenderDoc, CloudCompare

## Overview
Three specialized CLIs extend game development workflows beyond traditional game engines: Blender for 3D asset creation, RenderDoc for GPU frame analysis, and CloudCompare for point-cloud/mesh processing.

**Sources:** CLI-Anything-main project (GitHub HKUDS/CLI-Anything); production game pipelines
**Integration:** Automate asset generation, GPU debugging, and mesh processing without GUI friction

---

## Blender Headless CLI

### Purpose
3D modeling, animation, rendering (EEVEE/Cycles) via terminal — batch asset generation, automated rendering, procedural modeling.

### Install
```bash
# Windows
winget install blender

# macOS
brew install blender

# Linux
apt install blender
```

### Verify
```bash
blender --version
```

### Basic Render Command
```bash
blender input.blend --background --render-frame 1 --render-output output.png
```

**Key flags:**
| Flag | Meaning |
|------|---------|
| `--background` | Headless mode (no GUI) |
| `--render-frame N` | Render frame N only |
| `--render-frame 1..100` | Render frame range |
| `--render-output PATH` | Output filepath (MUST be absolute) |
| `--engine cycles` | Switch to Cycles renderer |
| `--engine eevee` | Switch to EEVEE renderer |
| `--python script.py` | Run Python script in Blender context |
| `-o PATH` | Shorthand for output |

### Common Workflows

#### 1. Batch Asset Rendering
```bash
#!/bin/bash
# Render all blend files in directory to PNG
for file in models/*.blend; do
  output="renders/$(basename $file .blend).png"
  blender "$file" --background --render-output "$output" --render-frame 1
  echo "Rendered $file → $output"
done
```

#### 2. Procedural Model Generation
Create `generate.py` in Blender context:
```python
import bpy

# Clear default scene
bpy.ops.object.delete(use_global=False)

# Generate cube procedurally
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))

# Save
bpy.ops.wm.save_mainfile(filepath="/tmp/generated.blend")
```

**Run:**
```bash
blender --background --python generate.py
```

#### 3. Animation Rendering
```bash
blender animation.blend --background \
  --render-frame 1..120 \
  --render-output animation_frames/frame_###.png
# Produces frame_001.png, frame_002.png, ..., frame_120.png
```

#### 4. Cycles GPU Rendering
```bash
# Render with Cycles on GPU (CUDA/HIP/OptiX)
blender scene.blend --background \
  --engine cycles \
  --python - <<'EOF'
import bpy
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.cycles.use_denoising = True
EOF \
  --render-output output.exr
```

### Critical Gotcha: Output Path

**ALWAYS use absolute paths.** Relative paths are evaluated from Blender's working directory (usually the binary location), not your script's CWD.

❌ WRONG:
```bash
blender scene.blend --background --render-output renders/output.png
# Likely renders to: /path/to/blender/executable/renders/output.png (wrong!)
```

✅ CORRECT:
```bash
OUTDIR="$PWD/renders"
mkdir -p "$OUTDIR"
blender scene.blend --background --render-output "$OUTDIR/output.png"
```

### Version Gotcha: EEVEE Engine Name

EEVEE naming changed between Blender 3.x and 4.x:
- **Blender 3.6:** `--engine eevee_next`
- **Blender 4.0+:** `--engine eevee`

**Safe approach:** Probe version first:
```bash
VERSION=$(blender --version | grep -oE '[0-9]+\.[0-9]+')
if [[ $(echo "$VERSION < 4.0" | bc -l) -eq 1 ]]; then
  ENGINE="eevee_next"
else
  ENGINE="eevee"
fi
blender scene.blend --background --engine "$ENGINE" --render-output output.png
```

---

## RenderDoc CLI — GPU Frame Capture & Analysis

### Purpose
Inspect GPU state, shaders, textures, draw calls per frame — deep debugging of rendering pipeline issues (wrong shader, bad texture bindings, Z-fighting, etc.).

### Install
```bash
# Windows
winget install renderdoc

# Build from source
git clone https://github.com/baldurk/renderdoc.git
# See: https://github.com/baldurk/renderdoc/wiki/Compilation
```

### Capture a Frame (CLI)
```bash
renderdoccmd capture --executable "path/to/game.exe" --working-dir "." --frame-count 1 --output capture.rdc
```

### Inspect Capture
```bash
# List draw calls
renderdoccmd info capture.rdc --drawcalls

# Export all textures
renderdoccmd info capture.rdc --textures > textures.txt

# Export shader sources
renderdoccmd info capture.rdc --shaders > shaders.txt
```

### Workflow: Capture + Analysis
```bash
# Capture frame 100 of running game
renderdoccmd capture --executable ./game.exe --wait-for-exit --output frame100.rdc

# Analyze in RenderDoc GUI (or via Python API)
python - <<'EOF'
import renderdoc

cap = renderdoc.OpenCapture("frame100.rdc")
controller = renderdoc.ReplayController(cap)

# List all draw calls
for event in controller.GetFrameInfo()[0]:
    if event.name:
        print(f"Event: {event.name}")

controller.Shutdown()
EOF
```

### Typical Debug Checklist
- [ ] Correct texture bound to each sampler?
- [ ] Shader inputs populated (constants, view matrix)?
- [ ] Render target correct (color + depth)?
- [ ] Depth test state correct (enabled, comparison func)?
- [ ] Blending enabled/disabled as intended?
- [ ] Culling front/back correct?
- [ ] All vertices rendered (not culled incorrectly)?

---

## CloudCompare CLI — Point Cloud & Mesh Processing

### Purpose
Large-scale point cloud analysis, mesh repair, decimation, normal estimation, plane/sphere fitting.

### Install
```bash
# Windows / macOS / Linux (universal)
apt install cloudcompare

# Or download from
https://www.cloudcompare.org/release/
```

### Common Commands

#### 1. Mesh Decimation (Reduce Poly Count)
```bash
CloudCompare -SILENT -O mesh.ply \
  -MERGE_CLOUDS -PYRAMID_LEVEL 0 \
  -M3C2 DIST 0.01 -SS GAUSSIAN 0.05 -SAVE_CLOUDS FILE "/tmp/decimated.ply"
```

#### 2. Normal Estimation
```bash
CloudCompare -SILENT -O cloud.ply \
  -COMPUTE_NORMALS ORIENT_NORMALS_MST \
  -SAVE_CLOUDS FILE "/tmp/with_normals.ply"
```

#### 3. Delaunay Meshing (Point Cloud → Surface)
```bash
CloudCompare -SILENT -O points.xyz \
  -DELAUNAY 2D \  # 2D or 3D
  -SAVE_CLOUDS FILE "/tmp/mesh.ply"
```

#### 4. Plane Fit Detection
```bash
CloudCompare -SILENT -O building.ply \
  -PLANE_STRAIN 0.05 \  # Fit tolerance
  -SAVE_CLOUDS FILE "/tmp/planes_segmented.ply"
```

#### 5. ICP Alignment (Cloud-to-Cloud Registration)
```bash
CloudCompare -SILENT -O reference.ply -O_ALIGNED moving.ply \
  -ICP -ITER 50 \
  -SAVE_CLOUDS FILE "/tmp/aligned.ply"
```

### Script Workflow: Batch Processing
```bash
#!/bin/bash
# Process all point clouds in directory

for cloud in input/*.ply; do
  echo "Processing $cloud..."
  output="output/$(basename $cloud .ply)_processed.ply"
  
  CloudCompare -SILENT -O "$cloud" \
    -COMPUTE_NORMALS ORIENT_NORMALS_MST \
    -SAVE_CLOUDS FILE "$output"
done
```

### Output Formats
- `.ply` (readable ASCII/binary)
- `.xyz` (simple XYZ text)
- `.las`/`.laz` (LiDAR standard)
- `.bin` (CloudCompare native, fastest I/O)
- `.obj` (mesh format)
- `.stl` (3D printing)

---

## Integration: Game Asset Pipeline

### Example: Generate → Mesh Process → Render

```bash
#!/bin/bash
set -e

# Step 1: Generate 3D mesh in Blender
echo "Generating 3D asset..."
blender --background --python generate_mesh.py --render-output /tmp/mesh.blend

# Step 2: Decimate mesh (reduce poly count for game)
echo "Decimating mesh..."
CloudCompare -SILENT -O /tmp/mesh.ply \
  -MESH_DENSITY 1.0 \
  -SAVE_CLOUDS FILE /tmp/mesh_decimated.ply

# Step 3: Re-render at game resolution
echo "Rendering final asset..."
blender /tmp/mesh_decimated.blend --background \
  --engine eevee \
  --render-output /tmp/asset_final.png

echo "Done! Output: /tmp/asset_final.png"
```

---

## CI/CD Integration

### GitHub Actions: Render on Every Commit
```yaml
name: 3D Asset Rendering

on: [push, pull_request]

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Blender
        run: apt-get update && apt-get install -y blender
      
      - name: Render assets
        run: |
          mkdir -p renders
          for file in models/*.blend; do
            blender "$file" --background \
              --render-frame 1 \
              --render-output "renders/$(basename $file .blend).png"
          done
      
      - name: Upload renders
        uses: actions/upload-artifact@v3
        with:
          name: rendered-assets
          path: renders/
```

---

## Troubleshooting

### Blender Crashes / Missing Encoder
```
ERROR: Invalid image format specified
```
→ Ensure `--render-output` path ends with valid extension (`.png`, `.jpg`, `.exr`)

### CloudCompare Hanging
```
CloudCompare -SILENT -O huge_cloud.ply [never returns]
```
→ Reduce cloud size first: decimate, downsample, or split into tiles

### RenderDoc Can't Attach
```
Failed to attach to process
```
→ Ensure game runs with graphics debugger enabled (DirectX11/Vulkan validation layers)

---

## References

- **Blender CLI:** https://docs.blender.org/manual/en/latest/advanced/command_line/
- **RenderDoc:** https://github.com/baldurk/renderdoc/wiki/
- **CloudCompare:** https://www.cloudcompare.org/doc/wiki/index.php
- **CloudCompare CLI:** https://www.cloudcompare.org/doc/wiki/index.php?title=Command_line_mode

---

**Last updated:** 2026-07-03 | **Sources:** CLI-Anything-main, Blender/RenderDoc/CloudCompare official docs
