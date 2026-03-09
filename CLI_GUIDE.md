# tsm CLI Guide

The `tsm` command is a simple, modern CLI for rendering animations to video.

**Philosophy**: Write code → render video. No fuss, no complexity.

## Installation

```bash
npm install -g ts-manim
# or use locally: npx tsm
```

## Quick Start

### 1. Write an Animation

Create `scene.ts`:

```typescript
import { Scene, EntryPoint, Mobject2D } from 'ts-manim';

@Scene({ fps: 60, duration: 3 })
class SimpleAnimation {
  @EntryPoint()
  async construct() {
    const circle = new Mobject2D();
    // Animation code here
    yield; // Render frame
  }
}

export default SimpleAnimation;
```

### 2. Render to Video

```bash
# Simple - uses default settings (medium quality, current folder)
tsm scene.ts

# Specify output name
tsm scene.ts animation

# Custom quality and folder
tsm -qh scene.ts animation -f renders/
```

### 3. Get Video

```
renders/
└── animation.mp4  ← Your rendered video!
```

## Quality Presets

| Flag | Name | Resolution | FPS | Codec | Bitrate | Use Case |
|------|------|------------|-----|-------|---------|----------|
| `-ql` | Low | 640x360 | 24 | H.264 | 500k | Quick preview, web |
| `-qm` | Medium | 1280x720 | 30 | H.264 | 2.5M | Default, fast |
| `-qh` | High | 1920x1080 | 60 | H.264 | 8M | Professional, smooth |
| `-qp` | Pro | 2560x1440 | 60 | H.265 | 15M | Ultra HD, smaller file |
| `-qk` | King | 3840x2160 | 60 | H.265 | 40M | 4K, cinema quality |

## Examples

### Quick Preview

```bash
# Fast render for testing (360p, 24fps)
tsm -ql scene.ts test -f /tmp

# Result: /tmp/test.mp4 (quick, playable)
```

### Standard Video

```bash
# High-quality HD (1080p, 60fps)
tsm -qh scene.ts demo -f videos/

# Result: videos/demo.mp4 (professional quality)
```

### 4K Export

```bash
# Ultra HD (2160p, 60fps)
tsm -qk animation.ts cinema -f exports/

# Result: exports/cinema.mp4 (huge file, best quality)
```

### With Audio

```bash
# Sync animation with music
tsm -qh scene.ts video -f renders/ --audio music.mp3

# Result: renders/video.mp4 (video + audio, duration = shorter)
```

### Preview Immediately

```bash
# Render and open (macOS/Linux)
tsm -qm scene.ts demo -f renders/ --preview

# Or preview only (don't save to disk)
tsm -qm scene.ts --preview-only
```

## Command Reference

### render (default)

Render animation to video file.

```bash
tsm render <sceneFile> [outputName] [options]
  or
tsm [quality] <sceneFile> [outputName] [options]
```

**Options:**
- `-q, --quality <preset>` - Quality: l/m/h/p/k (default: m)
- `-f, --folder <path>` - Output folder (default: ./)
- `--fps <fps>` - Override FPS from quality
- `--audio <file>` - Audio file to sync
- `--preview` - Preview after rendering
- `--preview-only` - Preview without saving

**Examples:**
```bash
tsm -qh scene.ts                    # High quality, render to ./animation.mp4
tsm -qh scene.ts demo -f renders/   # High quality, save as renders/demo.mp4
tsm -qk scene.ts 4k -f 4k/ --audio music.mp3  # 4K with audio
tsm -qm scene.ts --preview          # Render and open video
```

### validate

Check if scene is valid without rendering.

```bash
tsm validate <sceneFile>
```

**Output:**
```
✅ Validating scene.ts...
   ✓ TypeScript syntax valid
   ✓ Scene class found
   ✓ @EntryPoint decorator present
   ✓ All imports resolved
✅ Scene is valid!
```

### list-presets

Show all available quality presets.

```bash
tsm list-presets
```

**Output:**
```
Available Quality Presets:

  -ql   Low      • 640x360, 24fps,  H.264, 500k bitrate
  -qm   Medium   • 1280x720, 30fps, H.264, 2.5M bitrate  ← Default
  -qh   High     • 1920x1080, 60fps, H.264, 8M bitrate
  -qp   Pro      • 2560x1440, 60fps, H.265, 15M bitrate
  -qk   King     • 3840x2160, 60fps, H.265, 40M bitrate
```

### help

Show detailed help.

```bash
tsm help
```

## Workflow Examples

### Example 1: Quick Development

```bash
# Test animation quickly
tsm -ql scene.ts test

# Tweak scene.ts in editor...
# Run again (same command)
tsm -ql scene.ts test

# When happy, render final version
tsm -qh scene.ts final -f videos/
```

### Example 2: Batch Rendering

```bash
# Create multiple quality versions
tsm -qh animation.ts output -f hd/
tsm -qk animation.ts output -f 4k/

# Result:
# hd/output.mp4    (1080p)
# 4k/output.mp4    (4K)
```

### Example 3: Social Media Export

```bash
# YouTube (1080p recommended)
tsm -qh scene.ts youtube_video -f social/

# Instagram Reel (vertical, short)
# (Custom aspect ratio coming in Phase 2)
tsm -qm scene.ts instagram -f social/

# TikTok (vertical, 1080p)
tsm -qm scene.ts tiktok -f social/
```

### Example 4: Presentation

```bash
# Export for conference talk
# Fast draft
tsm -qm talk-animation.ts draft -f .

# Final version for presentation
tsm -qh talk-animation.ts presentation -f exports/ --preview
```

## Environment Variables

Configure default behavior:

```bash
# Set default output folder
export TSMANIM_OUTPUT_FOLDER=~/videos

# Enable GPU if available
export TSMANIM_GPU=true

# Enable verbose output
export TSMANIM_VERBOSE=true

# Now these are equivalent:
tsm -qh scene.ts
# = tsm -qh scene.ts -f ~/videos --gpu
```

## Troubleshooting

### "FFmpeg not found"

```
Error: FFmpeg not found. Install from https://ffmpeg.org/download.html
```

**Fix:**
- macOS: `brew install ffmpeg`
- Ubuntu: `sudo apt install ffmpeg`
- Windows: Download from https://ffmpeg.org/download.html
- Or use WSL with Ubuntu

### "Scene file not found"

```
Error: Scene file not found: scene.ts
```

**Fix:**
- Verify file exists: `ls -la scene.ts`
- Use correct path: `tsm ./path/to/scene.ts`

### "Invalid quality preset"

```
Error: Invalid quality: x. Use: l, m, h, p, k
```

**Fix:**
- Only use `-ql`, `-qm`, `-qh`, `-qp`, `-qk`
- Default is `-qm` (medium)

### Output file too large

For `-qk` (4K), files can be 50-100 MB for 5 seconds.

**Solutions:**
- Use `-qh` (High) instead for 8-15 MB files
- Use `-qp` (Pro) for middle ground (15-25 MB)
- Reduce duration if possible
- Use cloud rendering for splitting into chunks (Phase 5)

### Slow rendering

**Options:**
1. **Use lower quality**: `-ql` instead of `-qh`
2. **Reduce duration**: Shorter animations = faster
3. **Enable GPU**: `--gpu` flag (if available)
4. **Use cloud rendering** (Phase 5): `--cloud --workers 8`

## File Output

### Standard Output

```
renders/
├── animation.mp4              # Video file
└── animation-metadata.json    # Scene info, duration, frames
```

### Metadata File Example

```json
{
  "scene": "SimpleAnimation",
  "duration": 5,
  "fps": 60,
  "totalFrames": 300,
  "resolution": "1920x1080",
  "codec": "h264",
  "bitrate": "8000k",
  "fileSize": "12.5 MB",
  "quality": "high",
  "renderedAt": "2026-03-09T17:30:45Z"
}
```

## Performance Tips

1. **Quick iteration**: Use `-ql` while developing
2. **Batch renders**: Let multiple jobs run in background
3. **Large scenes**: Use cloud rendering (Phase 5)
4. **Particle systems**: Enable GPU if available (`--gpu`)
5. **Multiple formats**: Render once, transcode for different platforms

## Integration with Scripts

```bash
#!/bin/bash
# Render all scenes in a folder

for scene in scenes/*.ts; do
  filename=$(basename "$scene" .ts)
  echo "Rendering $filename..."
  tsm -qh "$scene" "$filename" -f renders/
done

echo "All done! Check renders/ folder"
```

## Next Steps

- **Read**: [Plugin Architecture](./PLUGINS.md) for advanced features
- **Learn**: [Type System](./V2_ARCHITECTURE.md) for type safety
- **Explore**: [Examples](./examples/) for more patterns
- **Contribute**: Issues and PRs welcome on GitHub

---

**Command Reference Quick:**
```bash
tsm -ql scene.ts                      # Low quality
tsm -qm scene.ts output -f folder/    # Medium (default)
tsm -qh scene.ts output -f folder/    # High quality  ← Most common
tsm -qk scene.ts output -f folder/    # 4K quality
tsm validate scene.ts                 # Check validity
tsm list-presets                      # Show all options
tsm help                              # Full help
```
