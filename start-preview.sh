#!/bin/bash
# Quick start guide for ts-manim Live Preview

echo "╔════════════════════════════════════════════╗"
echo "║  🚀 ts-manim Live Preview Quick Start     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Option 1: Web Dev Server (Recommended)
echo "📊 Option 1: Web Dev Server (Recommended)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This opens a live preview in your browser that updates"
echo "as you type. Perfect for quick iteration!"
echo ""
echo "Start with:"
echo "  npm run dev:preview"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Option 2: VS Code Extension
echo "🔌 Option 2: VS Code Extension"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "For integrated preview in VS Code:"
echo ""
echo "1. cd extension"
echo "2. npm install"
echo "3. npm run build"
echo "4. npm run package"
echo "5. Install the .vsix file in VS Code"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📚 For full documentation, see: PREVIEW_SETUP.md"
echo ""
echo "Happy animating! 🎬✨"
