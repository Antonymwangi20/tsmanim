# ts-manim CLI Usage Guide

Professional TypeScript animation framework for generating video content via CLI. Convert TypeScript animation code directly to MP4 videos with FFmpeg.

## 📦 Installation

```bash
npm install -g ts-manim
# or locally
npm install ts-manim
```

## 🚀 Quick Start

### Basic Command
```bash
tsm -qm scene.ts output -f Videos
```

This translates to:
- `-qm` = Medium quality (720p, 30fps)
- `scene.ts` = Your animation source file
- `output` = Output filename (without extension)
- `-f Videos` = Save to `Videos` folder
- Result: `Videos/output.mp4`

### Minimal Example (Current Folder)
```bash
# Creates output.mp4 in current directory
tsm -qh animation.ts output -f .
```

## 📊 Quality Presets

| Flag | Name | Resolution | FPS | Bitrate | File Size | Best For |
|------|------|-----------|-----|---------|-----------|----------|
| `-ql` | Low | 480p | 24 | 2 MB/s | ~2-3 MB/min | Quick previews, testing |
| `-qm` | Medium | 720p | 30 | 5 MB/s | ~5-8 MB/min | **Default, YouTube** |
| `-qh` | High | 1080p | 60 | 12 MB/s | ~12-15 MB/min | Production, streaming |
| `-qp` | Premium | 1440p | 60 | 20 MB/s | ~20-25 MB/min | Premium content |
| `-qk` | 4K | 2160p | 60 | 35 MB/s | ~35-40 MB/min | Ultra HD, cinema |

## 💡 Common Use Cases

### 1. Quick Preview (Fast)
```bash
tsm -ql scene.ts preview -f renders
# 480p, 24fps → ~30 seconds to render
```

### 2. Social Media (YouTube/TikTok)
```bash
tsm -qm animation.ts youtube-clip -f exports
# 720p, 30fps → Standard quality
```

### 3. Professional Production
```bash
tsm -qh demo.ts production -f assets
# 1080p, 60fps → Crisp, broadcast-ready
```

### 4. Premium Content
```bash
tsm -qp showcase.ts premium -f portfolio
# 1440p, 60fps → Premium quality
```

### 5. 4K Rendering
```bash
tsm -qk masterpiece.ts ultra-hd -f final
# 2160p, 60fps → Cinema-quality
```

### 6. With Preview
```bash
tsm -qh movie.ts final --preview -f renders
# Opens video automatically after rendering
```

## 📝 Scene File Format

Your TypeScript/JavaScript scene file should export an animation:

### TypeScript Version
```typescript
// animation.ts
export class MyAnimation {
  async construct() {
    // Your animation code here
    console.log("Rendering animation...");
    
    // Return total duration in seconds
    return 5; // 5 second animation
  }
}
```

### JavaScript Version
```javascript
// animation.js
export class MyAnimation {
  async construct() {
    console.log("Rendering animation...");
    return 5; // 5 second animation
  }
}
```

## 🛠️ Command Line Reference

### Full Syntax
```
tsm [quality] <input> <output> [-f folder] [--preview]
```

### Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `-ql`, `-qm`, `-qh`, `-qp`, `-qk` | Quality preset | `-qm` | Yes |
| `<input>` | Source TS/JS file | - | Yes |
| `<output>` | Output filename (no extension) | - | Yes |
| `-f <folder>` | Output directory | `./output` | No |
| `--preview` | Open video after rendering | - | No |
| `-h`, `--help` | Show help | - | No |
| `-v`, `--version` | Show version | - | No |

### Environment Variables

```bash
# Set default quality (skip -q flag)
export TSM_QUALITY=qh
tsm scene.ts output -f videos  # Uses qh automatically

# Set default output folder
export TSM_OUTPUT_FOLDER=./renders
```

## ⏱️ Rendering Times (Approximate)

For a 5-second animation:

| Quality | Resolution | Resolution Time | Encoding Time | Total |
|---------|-----------|------------------|---------------|-------|
| `-ql` | 480p @ 24fps | 5s | 10s | ~15s |
| `-qm` | 720p @ 30fps | 10s | 20s | ~30s |
| `-qh` | 1080p @ 60fps | 20s | 45s | ~65s |
| `-qp` | 1440p @ 60fps | 30s | 60s | ~90s |
| `-qk` | 2160p @ 60fps | 45s | 90s | ~135s |

*Times vary based on system performance and animation complexity*

## 🎯 Real-World Examples

### Example 1: Simple Animation
```bash
# Create scene.ts
cat > scene.ts << 'EOF'
export class SimpleAnimation {
  async construct() {
    // 3 second animation
    return 3;
  }
}
EOF

# Render
tsm -qm scene.ts demo -f ./videos
# Creates: ./videos/demo.mp4
```

### Example 2: Batch Processing
```bash
# Render multiple scenes
for scene in scenes/*.ts; do
  name=$(basename "$scene" .ts)
  tsm -qh "$scene" "$name" -f ./renders
done
```

### Example 3: Quality Comparison
```bash
# Compare all quality levels
tsm -ql animation.ts ql-version -f ./comparison
tsm -qm animation.ts qm-version -f ./comparison
tsm -qh animation.ts qh-version -f ./comparison
```

### Example 4: Development Workflow
```bash
# Quick preview while developing
tsm -ql scene.ts test -f ./tmp

# Final production render
tsm -qh scene.ts final -f ./exports --preview
```

## 🔧 Troubleshooting

### Error: "FFmpeg not found"
FFmpeg is required for video encoding.

**Install FFmpeg:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
# Or use: choco install ffmpeg
```

### Error: "Input file not found"
Check that your scene file exists:
```bash
ls scene.ts  # Verify file exists
tsm -qm scene.ts output -f videos
```

### Error: "Invalid quality level"
Valid quality levels are: `ql`, `qm`, `qh`, `qp`, `qk` (without dash)
```bash
# ❌ Wrong
tsm scene.ts output -f videos

# ✅ Correct
tsm -qm scene.ts output -f videos
```

### Error: "Permission denied" (Linux/Mac)
```bash
# Make CLI executable
chmod +x /usr/local/lib/node_modules/ts-manim/dist/cli/tsm.js

# Or reinstall globally
npm install -g ts-manim
```

### Video too large?
Use lower quality or shorter animation:
```bash
# Use lower quality
tsm -ql scene.ts output -f videos  # ~2 MB/min

# Or trim animation duration in scene file
```

## 📊 Output Examples

After running `tsm -qh scene.ts demo -f renders`, you'll see:

```
╔════════════════════════════════════════════════════════════════╗
║                  🎬 Rendering Animation                       ║
╚════════════════════════════════════════════════════════════════╝
  
📝 Scene:        scene.ts
🎥 Quality:      High (1920x1080 @ 60fps)
📊 Codec:        libx264
⚡ Bitrate:      12M
📁 Output:       renders/demo.mp4

⏳ Checking FFmpeg...
✅ FFmpeg available

⏳ Processing scene file...
   → Transpiling TypeScript to JavaScript...
✅ Scene processed

⏳ Generating animation frames...
   → Rendering 300 frames...
✅ 300 frames generated

⏳ Encoding video with FFmpeg...
   Codec:   libx264
   Preset:  slow
   Bitrate: 12M

✅ Video encoded

╔════════════════════════════════════════════════════════════════╗
║                    ✨ Success! ✨                             ║
╚════════════════════════════════════════════════════════════════╝

📽️  Output:       renders/demo.mp4
💾 Estimated Size: ~7.5 MB
🎬 Quality:       High (1920x1080 @ 60fps)
⏱️  Duration:      ~5 seconds
🎨 Frames:        300
```

## 🎨 Next Steps

### Learn More
- [API Documentation](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [V2 Type System](./V2_ARCHITECTURE.md)
- [Live Preview Setup](./LIVE_PREVIEW_GUIDE.md)

### Try Examples
```bash
# List examples
ls examples/

# Run an example
tsm -qm examples/sample-scene.ts example -f ./output
```

### Advanced Features (Coming Soon)
- 🎵 Audio synchronization
- 🌐 Distributed rendering
- 🚀 GPU acceleration
- 🤖 AI-powered animation generation
- ☁️ Cloud rendering

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Antonymwangi20/manimJS/issues)
- **Questions**: Check [Discussions](https://github.com/Antonymwangi20/manimJS/discussions)
- **Bugs**: Report with `tsm -v` output and scene file

## 📄 License

MIT - See LICENSE file

---

**Happy animating! 🎬✨**
