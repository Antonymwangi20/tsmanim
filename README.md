# TS-Manim

A TypeScript animation framework for Node.js inspired by Manim. Create mathematical animations and educational videos programmatically.

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
# Windows: choco install ffmpeg