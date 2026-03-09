# 🎬 Live Animation Preview - Implementation Guide

## What You Get

Two ways to preview animations in real-time as you write code:

### 1. **Web Dev Server** (⭐ Recommended) 
- Browser-based preview that updates live
- Works in any browser
- No installation required (just npm)
- Perfect for quick iteration
- **Status**: Ready to use now

### 2. **VS Code Extension** (Advanced)
- Integrated preview panel in VS Code
- Side-by-side editing and preview
- Keyboard shortcuts
- Requires building the extension
- **Status**: Complete, ready to build

---

## 🚀 Quick Start (Web Dev Server)

### Step 1: Start the Server

```bash
npm run dev:preview
```

This will:
- Install dependencies automatically
- Start the preview server on http://localhost:5173
- Watch for example file changes

### Step 2: Open in Browser

Open http://localhost:5173 in your browser

### Step 3: Write Code

1. Select an example from the dropdown, or
2. Type/paste animation code directly in the editor
3. See it animate live on the right side (updates every 500ms)

---

## 💡 Usage Examples

### Example 1: Simple Circle Animation

```typescript
import { ManimScene, SimpleCircle, FadeInAnim, RotateAnim, COLORS } from 'ts-manim';

const scene = new ManimScene();
const circle = SimpleCircle({ 
  center: [0, 0], 
  radius: 50, 
  color: COLORS.BLUE 
});

scene.add(circle);
scene.play(FadeInAnim({ duration: 1 }));
scene.play(RotateAnim({ angle: Math.PI, duration: 2 }));
```

Copy this into the editor → See it animate!

### Example 2: Multiple Shapes

```typescript
import { ManimScene, SimpleCircle, SimpleRect, VGroup, COLORS } from 'ts-manim';

const scene = new ManimScene();

const circle = SimpleCircle({ center: [-50, 0], radius: 30, color: COLORS.BLUE });
const rect = SimpleRect({ center: [50, 0], width: 60, height: 40, color: COLORS.RED });

const group = new VGroup(circle, rect);
scene.add(circle, rect);
```

---

## 🎨 Features

### Live Updates
- **Auto-update**: Refreshes every 500ms as you type
- **Instant feedback**: See changes immediately
- **No compilation step**: TypeScript compiled in the browser

### Error Handling
- Syntax errors shown inline with helpful messages
- Stack traces displayed
- Static type checking (via TypeScript)

### Editor Features
- Syntax highlighting
- Line numbers
- Character count and line count stats
- Status bar shows compilation status

### Preview Controls
- **Gallery Mode**: View multiple animations at once
- **Single Mode**: Focus on one animation
- **Refresh Button**: Manual refresh
- **File Selector**: Load pre-made examples

---

## 🔧 Advanced Usage

### Load Pre-made Examples

The dropdown menu auto-loads from `examples/`:

```
examples/
├── sample-scene.ts
├── manim-complete-features.ts
├── my-custom-animation.ts    ← Add your files here
```

All `.ts` files in `examples/` appear in the dropdown.

### Toggle Gallery View

Click the **📊 Gallery** button to:
- View multiple animations in a grid
- See what different effects look like side-by-side
- Click any to focus

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Refresh preview |
| Mouse wheel | Scroll editor/preview |

### Status Indicators

| Icon | Meaning |
|------|---------|
| ✓ (green) | Success - code compiled and rendered |
| ⏳ (spinner) | Processing - running TypeScript transpiler |
| ✗ (red) | Error - see error panel for details |

---

## 🐛 Troubleshooting

### Preview shows "Waiting for code..."
- **Cause**: No code in editor or not compiled yet
- **Fix**: Paste code and wait 500ms for auto-refresh

### Nothing renders on canvas
- **Cause**: Missing `scene.add()` or incorrect code
- **Fix**: Check error panel, verify scene setup

### Animations are too fast/slow
- **Cause**: Duration values in milliseconds
- **Fix**: Adjust duration parameter (typical: 0.1 to 3 seconds)

### "Undefined" errors
- **Cause**: Missing imports or wrong variable names
- **Fix**: Check console (F12) for specific errors

### Server won't start
- **Cause**: Port 5173 already in use
- **Fix**: Kill other processes or change port

---

## 📁 Project Structure

```
ts-manim/
├── dev-server/                    # Live preview server
│   ├── index.ts                  # Express server
│   ├── public/
│   │   └── index.html            # Web UI
│   └── package.json
├── extension/                     # VS Code extension
│   ├── src/
│   │   └── extension.ts          # Extension code
│   ├── package.json
│   └── tsconfig.json
├── examples/                      # Example animations
│   ├── sample-scene.ts
│   └── manim-complete-features.ts
├── src/                          # Main framework
└── PREVIEW_SETUP.md              # Detailed setup docs
```

---

## 🎯 Workflow Examples

### Workflow 1: Quick Experimentation

```bash
# Terminal 1: Start preview
npm run dev:preview

# Browser: http://localhost:5173
# → Paste code → See animation instantly
```

### Workflow 2: Iterative Development

```bash
# Terminal 1: Start preview
npm run dev:preview

# VS Code:
# - Open examples/my-animation.ts
# - Edit code → Save
# - Preview auto-updates
# - Repeat until happy
```

### Workflow 3: Multiple Variations

```bash
# Create multiple files in examples/:
- examples/effect1.ts
- examples/effect2.ts
- examples/effect3.ts

# Select from dropdown in preview
# Compare side-by-side with Gallery mode
```

---

## 🚀 Performance Tips

1. **Keep animations simple for preview** - Use short durations (0.1-1s)
2. **Test with fewer objects** - Large scenes may be slower
3. **Use gallery mode for comparison** - Don't load too many at once
4. **Refresh manually if jumpy** - Click 🔄 Refresh button

---

## 📊 Browser Compatibility

✅ Chrome/Chromium 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

*Canvas rendering is used, so older browsers may have issues*

---

## 🔌 VS Code Extension (Alternative)

If you prefer integrated preview in VS Code:

### Build Steps

```bash
cd extension
npm install
npm run build
npm run package
```

### Install

1. Open VS Code
2. Ctrl+Shift+X (Extensions)
3. "Install from VSIX..."
4. Select the built `.vsix` file

### Use

- Open any `.ts` file with animations
- Press Alt+A or Ctrl+Shift+P → "Open Manim Preview"
- Preview panel opens on the right
- Updates every 500ms as you type

---

## 💬 Tips & Tricks

1. **Quick Test Format**:
   ```typescript
   // Always wrap in IIFE for preview
   (() => {
     const scene = new ManimScene();
     // ... your code
   })();
   ```

2. **Debugging**: Open DevTools with F12 to see console logs

3. **Color Testing**: Use COLORS object:
   ```typescript
   circle.color = COLORS.BLUE;  // Built-in colors
   circle.color = '#0099ff';     // Custom hex
   ```

4. **Performance**: The 500ms debounce prevents lag. Manual refresh if needed.

---

## 📖 Next Steps

1. ✅ Start dev server: `npm run dev:preview`
2. ✅ Open http://localhost:5173
3. ✅ Paste example code above
4. ✅ Start editing and watch animations
5. ✅ When happy, export to video with `npm run build && npx ts-node examples/file.ts`

---

## Support

- **Issues**: Check PREVIEW_SETUP.md for detailed docs
- **Examples**: Find working examples in `examples/` directory
- **API Reference**: See MANIM_COMPLETE_REFERENCE.md

**Enjoy live animation previewing! 🎬✨**
