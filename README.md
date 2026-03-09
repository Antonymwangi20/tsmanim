# TS-Manim

A TypeScript animation framework for Node.js inspired by Manim. Create mathematical animations and educational videos programmatically.

## 🚀 Quick Start

```bash
npm install -g ts-manim
tsm -qm scene.ts output -f Videos
```

👉 **[Full Usage Guide →](./USAGE_GUIDE.md)**

## Features

- 🎬 **Programmatic Animation**: Write animations in TypeScript with a clean, intuitive API
- 🚀 **High Performance**: Parallel frame rendering using Worker Threads
- 🎨 **Skia Graphics**: Hardware-accelerated 2D graphics via skia-canvas
- 🎥 **FFmpeg Integration**: Encode to MP4/WebM with professional codecs
- 📐 **Mathematical Primitives**: Circles, rectangles, paths, text, and more
- ⏱️ **Deterministic**: Frame-perfect, reproducible animations

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Install FFmpeg (required)
# macOS: brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg
# Windows: choco install ffmpeg```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** | CLI commands, examples, troubleshooting |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Project structure and design |
| **[V2_ARCHITECTURE.md](./V2_ARCHITECTURE.md)** | Modern TypeScript type system |
| **[LIVE_PREVIEW_GUIDE.md](./LIVE_PREVIEW_GUIDE.md)** | Real-time animation preview |

## 💻 CLI Usage

```bash
# Basic command
tsm -qm scene.ts output -f Videos

# Quality levels
tsm -ql scene.ts preview -f tmp   # Low (480p)
tsm -qm scene.ts standard -f out  # Medium (720p) - DEFAULT
tsm -qh scene.ts hd -f renders    # High (1080p)
tsm -qp scene.ts premium -f pro   # Premium (1440p)
tsm -qk scene.ts 4k -f final      # 4K (2160p)

# With preview
tsm -qh animation.ts output --preview -f renders
```

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for complete CLI documentation.

## 📄 License

MIT
