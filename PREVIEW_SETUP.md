# Live Animation Preview Setup Guide

You have two options for live preview of animations as you write code:

## Option 1: Web Dev Server (Recommended - Fastest Setup ⚡)

Works immediately without building VS Code extensions. Opens a live preview in your browser that updates as you code.

### Quick Start

```bash
# Install dev dependencies
npm install --save-dev vite typescript esbuild

# Start dev server
npm run dev:preview
```

Then open `http://localhost:5173` in your browser. Start writing TypeScript code and see it rendered live!

### Features
✅ Live reload on every keystroke (500ms debounce)
✅ Shows errors inline with helpful messages
✅ Toggle between single scene and gallery view
✅ Works with all browsers
✅ No VS Code extension needed

---

## Option 2: VS Code Extension (Advanced)

Integrates preview directly in VS Code as a side panel.

### Installation

```bash
# Navigate to extension directory
cd extension

# Install dependencies
npm install

# Build extension
npm run build

# Package (optional - for sharing)
npm run package
```

### Load Extension in Development

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Extensions: Install from VSIX"
4. Select the packaged `.vsix` file

Or use the `Run Extension` debug configuration if you're developing the extension locally.

### Features
✅ Side panel preview in VS Code
✅ Real-time updates as you type
✅ Commands: Open Preview, Toggle Gallery, Refresh
✅ No need to switch windows
✅ Integrated workflow

### Commands

| Command | Shortcut | Function |
|---------|----------|----------|
| Open Manim Preview | Alt+A | Opens the preview panel |
| Toggle Gallery View | Alt+G | Switch between single/gallery |
| Refresh Preview | Alt+R | Manual refresh |

---

## Option 3: Hybrid - Dev Server + Browser Preview

Use the web dev server locally while developing the extension:

```bash
# Terminal 1: Start dev server
npm run dev:preview

# Terminal 2: Build extension in watch mode
cd extension && npm run watch

# Open browser to http://localhost:5173
```

---

## How to Use

### Web Dev Server (Option 1)

1. Create a TypeScript file with animations:

```typescript
// examples/my-animation.ts
import { ManimScene, SimpleCircle, FadeInAnim, RotateAnim, COLORS } from 'ts-manim';

const scene = new ManimScene();
const circle = SimpleCircle({ center: [0, 0], radius: 50, color: COLORS.BLUE });

scene.add(circle);
scene.play(FadeInAnim({ duration: 1 }));
scene.play(RotateAnim({ angle: Math.PI, duration: 2 }));
```

2. The preview automatically updates as you edit the file

3. Use editor dropdown/buttons to switch scenes

### VS Code Extension (Option 2)

1. Open a TypeScript file with animations

2. Click the "Open Manim Preview" button in the editor toolbar
   - Or press `Ctrl+Shift+P` → "Open Manim Animation Preview"

3. Preview panel opens on the right side

4. Start typing - preview updates live every 500ms

5. Toggle gallery to see multiple animations at once

---

## Project Structure For Dev Server

```
ts-manim/
├── dev-server/               # Dev server (created automatically)
│   ├── index.ts             # Entry point
│   └── config.ts            # Configuration
├── examples/
│   ├── sample-scene.ts
│   ├── manim-complete-features.ts
│   └── my-animation.ts       # Your animations
└── package.json
```

---

## Common Issues & Solutions

### Preview shows "Waiting for code..."
- Make sure you've opened a `.ts` file
- Try clicking Refresh button
- Check browser console for errors (F12)

### Animations don't render
- Check that your scene inherits from `ManimScene`
- Verify `scene.add()` is called before `scene.play()`
- Console shows specific error messages

### Performance is slow
- Close unused preview windows
- Reduce animation complexity for preview (use `duration: 0.1` for quick tests)
- The 500ms debounce prevents updates while actively typing

### TypeScript errors not showing
- These will appear in the error panel
- Fix the TypeScript error and preview updates automatically

---

## Advanced: Customizing the Preview

### Modify Preview Refresh Rate

Edit the debounce timeout in `extension/src/extension.ts`:

```typescript
changeTimeout = setTimeout(() => {
  updatePreview(event.document);
}, 500); // Change 500 to your preferred milliseconds
```

### Add Custom Animations to Preview

Edit the `ManimLibrary` object in the webview content to add stubs for your custom animations.

### Change Canvas Size

In the preview webview, modify:

```javascript
this.canvas.width = 800;   // Change width
this.canvas.height = 600;  // Change height
```

---

## Tips & Tricks

1. **Quick Scene Switching**: Use editor tabs to have multiple scenes open and switch between previews

2. **Gallery Mode**: Perfect for comparing multiple animation variations

3. **Debugging**: Open browser DevTools (F12) to see console logs and errors

4. **Export**: Once happy with your animation, run `npx ts-node examples/your-file.ts` to generate the full video

5. **Keyboard Shortcuts**:
   - Alt+A: Open preview (extension mode)
   - Alt+G: Toggle gallery (extension mode)
   - Alt+R: Refresh (extension mode)

---

## Next Steps

After setting up preview:

1. Create an animation file in `examples/`
2. Open the preview (dev server or extension)
3. Start writing code and see it animate in real-time
4. Use gallery view to compare variations
5. Export to video when ready

Happy animating! 🎬✨
