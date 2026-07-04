# Video Post-Production CLIs for VEO 3 Generation

## Overview
After VEO 3 generates raw video, post-production CLIs provide editing, encoding, audio processing, captioning, and format optimization. These are optional but essential for professional deliverables and multi-platform export.

**Sources:** CLI-Anything-main project (GitHub HKUDS/CLI-Anything); OpenSpace ffmpeg reliability patterns; production workflows after veo-genesis raw generation.

---

## Primary Video Editing & Rendering

### FFmpeg + Encoder Probe Pattern
**Purpose:** Universal video codec and format handling; batch encoding with automatic fallback
**Install:** `winget install ffmpeg` or `brew install ffmpeg`
**Key pattern:** Always probe available encoders BEFORE building render command

**Probe encoders:**
```bash
ffmpeg -encoders | grep -i h264    # Check if libx264 available
ffmpeg -encoders | grep -i hevc    # Check if libx265 available
```

**Codec fallback ladder:**
```bash
# Try libx265 (HEVC, better compression) → fallback libx264 (H.264, universal compat)
VIDEO_CODEC=$(ffmpeg -encoders | grep -q libx265 && echo "libx265" || echo "libx264")
```

**Common rendering:**
```bash
# WebM for web
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 1M -c:a libopus output.webm

# MP4 for universal
ffmpeg -i input.mov -c:v libx264 -b:v 5M -c:a aac -b:a 192k output.mp4

# ProRes for archival
ffmpeg -i input.mov -c:v prores_ks -profile:v 3 output.mov
```

**Gotcha:** Missing encoder build → build fails cryptically. Probe first, then select or skip.

**Sources:** `OpenSpace-main\gdpval_bench\skills\{ffmpeg-encoder-check, ffmpeg-graceful-degradation}\`; FFmpeg docs

---

### Kdenlive / Shotcut (Melt CLI)
**Purpose:** Timeline editing and multi-track rendering
**Install:** `winget install Kdenlive` or `winget install Shotcut`
**Invoke via melt:** `melt input.mov -mix mix.png duration -consumer avformat:output.mp4`
**Key patterns:**
- Multi-track composition (A/B roll, overlays)
- Transition and effect application
- Timeline export to intermediate format
- Batch render via MLT XML templates

**Kdenlive CLI advantages:** Project files are MLT XML — can be generated programmatically.

**Gotcha:** Kdenlive GUI is powerful but CLI is minimal; better for preset workflows than ad-hoc editing.

**Source:** `CLI-Anything-main\{kdenlive, shotcut}\`

---

### VideoCaptioner
**Purpose:** Complete captioning workflow — transcribe speech → optimize/translate → burn subtitled video
**Workflow:** Speech recognition → subtitle file (SRT/VTT) → styling → render with subtitles
**Key patterns:**
- Auto-transcription (Whisper or commercial API)
- Subtitle timing adjustment and editing
- Multi-language translation
- Styled subtitle burn (font, position, colors)
- Batch caption application

**Output:** Deliverable video with burnt subtitles (for social media) + separate SRT for accessibility

**When to use:** YouTube uploads, social clips, accessibility compliance

**Source:** `CLI-Anything-main\videocaptioner\`

---

## Audio Processing

### Audacity + Sox
**Purpose:** Audio mixing, effects, noise reduction, format conversion
**Install:** `winget install Audacity` and `winget install sox`
**Audacity CLI:** Limited (mainly file conversion); better to use audio editing GUI then export
**Sox CLI:** Powerful command-line audio tool
**Key patterns:**
```bash
# Normalize audio level
sox input.wav -n stat  # Analyze levels
sox input.wav output.wav gain -l  # Normalize

# Remove silence
sox input.wav output.wav silence 1 0.1 1% 1 2.0 1%

# Add fade
sox input.wav output.wav fade 2 effect-time 2
```

**Gotcha:** Audacity CLI support is minimal; use as editor + Sox for scripting.

**Source:** `CLI-Anything-main\audacity\`; Sox documentation

---

## Scene Management & Live Streaming

### OBS Studio CLI
**Purpose:** Scene capture and streaming setup orchestration (local content, streaming config)
**Install:** `winget install obs-studio`
**Invoke:** `obs --startreplaybuffer` (start replay buffer) + API calls to manage scenes
**Key patterns:**
- Programmatic scene switching
- Output management (file output, streaming, recording)
- Source state control (show/hide, position)

**Gotcha:** CLI support is limited; mostly through obs-websocket API (third-party plugin).

**When to use:** Automate streaming setup, not for video editing

**Source:** `CLI-Anything-main\obs-studio\`

---

## FFmpeg Graceful Degradation Pattern

**Problem:** Video encoder builds vary by OS/architecture (some systems lack HEVC, VP9, or AV1).

**Solution:** Detect + fallback before rendering fails:

```bash
#!/bin/bash
set -e

INPUT="$1"
OUTPUT="$2"
ENCODER_CHOICE=""

# Probe available video codecs
AVAILABLE_CODECS=$(ffmpeg -encoders 2>/dev/null | awk '{print $2}')

# Select best available
if echo "$AVAILABLE_CODECS" | grep -q "libx265"; then
    ENCODER_CHOICE="libx265"
elif echo "$AVAILABLE_CODECS" | grep -q "libx264"; then
    ENCODER_CHOICE="libx264"
else
    echo "ERROR: No H.264/H.265 encoder available" >&2
    exit 1
fi

# Render with chosen codec
ffmpeg -i "$INPUT" -c:v "$ENCODER_CHOICE" -b:v 5M "$OUTPUT"
echo "Rendered with $ENCODER_CHOICE"
```

**Integration:** Wrap in agent-called script to handle encoder availability automatically.

**Source:** OpenSpace `ffmpeg-graceful-degradation` skill

---

## Recommended Workflow Chain

### Simple video export (most common):
```
VEO generate → FFmpeg encode to MP4 → Deliver
```

### Professional social content:
```
VEO generate
  → Kdenlive: add branding/overlays
  → Parallel FFmpeg: export WebM (web), MP4 (universal), ProRes (archive)
  → VideoCaptioner: transcribe + burn subtitles
  → Deliver by platform (Twitter 16:9, Instagram 1:1, etc.)
```

### Accessible content pipeline:
```
VEO generate
  → FFmpeg: extract audio
  → Audacity: normalize levels
  → VideoCaptioner: transcribe + translate
  → FFmpeg: render with subtitles
  → Deliver video + SRT files
```

---

## Integration Checklist

- [ ] FFmpeg installed + encoder probe working
- [ ] Fallback codec ladder defined for target platforms
- [ ] Kdenlive/Shotcut for complex edits (optional)
- [ ] Audacity for audio mixing (optional)
- [ ] VideoCaptioner installed for accessibility
- [ ] Output directory structure (raw/ → edited/ → encoded/ → deliverables/)
- [ ] Platform-specific format templates (Twitter, Instagram, YouTube specs)
- [ ] Batch encoding script with error recovery

---

## References

- **FFmpeg Documentation:** https://ffmpeg.org/documentation.html
- **FFmpeg Codecs:** https://ffmpeg.org/general.html#Supported-File-Formats-and-Codecs
- **Kdenlive Rendering:** https://userbase.kde.org/Kdenlive/Manual/Rendering
- **VideoCaptioner:** https://github.com/videocaptioner/videocaptioner
- **Sox Manual:** http://sox.sourceforge.net/sox.html

---

**Last updated:** 2026-07-03 | **Sources:** CLI-Anything-main, OpenSpace ffmpeg patterns, FFmpeg docs
