# Manim-Style Enhanced API Reference

## 🎬 Complete Feature Set

The enhanced Manim-style API now includes everything you need to create professional animations like Manim, with a simple and intuitive interface.

---

## 📦 Table of Contents

1. [**Scene & Objects**](#scene--objects)
2. [**Shapes**](#shapes)
3. [**Animations**](#animations)
4. [**Grouping (VGroup)**](#grouping-vgroup)
5. [**Camera Controls**](#camera-controls)
6. [**Coordinate System**](#coordinate-system)
7. [**Color Utilities**](#color-utilities)
8. [**Examples**](#examples)

---

## Scene & Objects

### ManimScene

The main scene object for creating animations.

```typescript
import { ManimScene } from 'ts-manim';

const scene = new ManimScene();
const circle = SimpleCircle({ center: [0, 0], radius: 50, color: '#3498db' });

scene
  .add(circle)
  .play(FadeInAnim({ duration: 1 }))
  .wait(0.5)
  .play(FadeOutAnim({ duration: 1 }));
```

**Methods:**
- `add(...objects)` - Add objects to scene
- `play(animation, options?)` - Play animation
- `wait(duration)` - Wait for duration
- `remove(...objects)` - Remove objects
- `clear()` - Clear scene
- `getScene()` - Get underlying core scene
- `getTimeline()` - Get timeline
- `getCurrentTime()` - Get current animation time
- `setTime(time)` - Set current time
- `getObjects()` - Get all objects in scene

---

## Shapes

### Basic Shapes

```typescript
import {
  SimpleCircle,
  SimpleRect,
  SimpleText,
  createLine,
  createPolygon,
  createTriangle,
  createStar,
  createArc,
  createAnnulus,
  createGrid,
  createBezierCurve,
  createWave
} from 'ts-manim';
```

### SimpleCircle

```typescript
const circle = SimpleCircle({
  center: [0, 0],
  radius: 50,
  color: '#FF6B6B',
  fill: true,
  stroke: '#000000',
  strokeWidth: 2
});
```

### SimpleRect

```typescript
const rect = SimpleRect({
  center: [100, 100],
  width: 80,
  height: 60,
  color: '#4ECDC4'
});
```

### SimpleText

```typescript
const text = SimpleText('Hello World', {
  center: [0, 50],
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#1E90FF'
});
```

### Advanced Shapes

#### Polygon
```typescript
const poly = createPolygon(
  [[0, 0], [50, 0], [50, 50], [0, 50]],
  { color: '#FF006E' }
);
```

#### Triangle
```typescript
const triangle = createTriangle(
  [[0, 0], [50, 50], [-50, 50]],
  { color: '#9D4EDD' }
);
```

#### Regular Polygon
```typescript
const hexagon = createRegularPolygon(
  6,           // 6 sides
  [0, 0],      // center
  50,          // radius
  { color: '#35B100' }
);
```

#### Star
```typescript
const star = createStar(
  [0, 0],      // center
  40,          // outer radius
  20,          // inner radius
  5,           // number of points
  { color: '#FFFF00' }
);
```

#### Arc
```typescript
const arc = createArc(
  [0, 0],      // center
  50,          // radius
  0,           // start angle
  Math.PI,     // end angle
  { color: '#0087FF' }
);
```

#### Ring (Annulus)
```typescript
const ring = createAnnulus(
  [0, 0],      // center
  20,          // inner radius
  50,          // outer radius
  { color: '#00D9FF' }
);
```

#### Grid
```typescript
const grid = createGrid(
  [0, 0],      // center
  200,         // width
  200,         // height
  50,          // cell width
  50,          // cell height
  { color: '#BBBBBB' }
);
```

#### Bezier Curve
```typescript
const curve = createBezierCurve(
  [[0, 0], [50, 100], [100, 0]],  // control points
  { color: '#FF8C42' }
);
```

#### Wave
```typescript
const wave = createWave(
  [0, 0],      // center
  200,         // width
  30,          // amplitude
  2,           // frequency
  { color: '#FC6255' }
);
```

---

## Animations

### Basic Animations

```typescript
import {
  FadeInAnim,
  FadeOutAnim,
  MoveAnim,
  RotateAnim,
  ScaleAnim
} from 'ts-manim';
```

#### Fade In/Out
```typescript
scene.play(FadeInAnim({ duration: 1 }));
scene.play(FadeOutAnim({ duration: 1 }));
```

#### Move
```typescript
scene.play(MoveAnim({
  from: [0, 0],
  to: [100, 100],
  duration: 1.5
}));
```

#### Rotate
```typescript
scene.play(RotateAnim({
  angle: Math.PI / 2,  // 90 degrees
  duration: 1
}));
```

#### Scale
```typescript
scene.play(ScaleAnim({
  scale: 1.5,
  duration: 1
}));
```

### Emphasis Animations

```typescript
import {
  IndicateAnim,
  FlashAnim,
  PulseAnim,
  WiggleAnim,
  ShakeAnim,
  BounceAnim,
  SwingAnim,
  SpinAnim
} from 'ts-manim';
```

#### Indicate (highlight)
```typescript
scene.play(IndicateAnim({ duration: 0.5 }));
```

#### Pulse
```typescript
scene.play(PulseAnim({ duration: 1 }));
```

#### Wiggle
```typescript
scene.play(WiggleAnim({ duration: 1 }));
```

#### Shake
```typescript
scene.play(ShakeAnim({ duration: 0.5 }));
```

#### Bounce
```typescript
scene.play(BounceAnim({ duration: 1 }));
```

#### Spin (rotate multiple times)
```typescript
scene.play(SpinAnim({
  angle: 4 * Math.PI,  // 2 full rotations
  duration: 2
}));
```

### Grow/Shrink

```typescript
import {
  GrowFromCenterAnim,
  ShrinkToCenterAnim
} from 'ts-manim';
```

```typescript
scene.play(GrowFromCenterAnim({ duration: 1 }));
scene.play(ShrinkToCenterAnim({ duration: 1 }));
```

### Color Animations

```typescript
import { ColorChangeAnim } from 'ts-manim';

scene.play(ColorChangeAnim({
  from: '#FF0000',
  to: '#00FF00',
  duration: 1
}));
```

### Composite Animations

#### Lagged Start (sequential with lag)
```typescript
import { LaggedStartAnim } from 'ts-manim';

const animations = [
  RotateAnim({ angle: Math.PI, duration: 1 }),
  ScaleAnim({ scale: 0.5, duration: 1 }),
  MoveAnim({ to: [100, 0], duration: 1 })
];

scene.play(LaggedStartAnim(animations, 0.2));  // 0.2s lag between each
```

#### Simultaneous
```typescript
import { SimultaneousAnim } from 'ts-manim';

scene.play(SimultaneousAnim([
  RotateAnim({ angle: Math.PI / 2, duration: 1 }),
  ScaleAnim({ scale: 2, duration: 1 }),
  ColorChangeAnim({ from: '#FF0000', to: '#0000FF', duration: 1 })
]));
```

### Animation Options

All animations support:
```typescript
{
  duration?: number,      // How long (default: 1)
  delay?: number,         // Delay before start (default: 0)
  easing?: string         // Easing function (default: 'easeInOut')
}
```

---

## Grouping (VGroup)

Group multiple objects and manipulate them together.

```typescript
import { VGroup } from 'ts-manim';

const circle1 = SimpleCircle({ center: [-50, 0], radius: 20, color: '#FF0000' });
const circle2 = SimpleCircle({ center: [0, 0], radius: 20, color: '#00FF00' });
const circle3 = SimpleCircle({ center: [50, 0], radius: 20, color: '#0000FF' });

const group = new VGroup(circle1, circle2, circle3);
scene.add(...group.getObjects());

// Arrange in circle
group.arrangeInCircle(50);

// Scale entire group
group.scale(1.5);

// Rotate entire group
group.rotate(Math.PI / 4);

// Arrange vertically
group.arrangeVertical(30);

// Arrange in grid
group.arrangeInGrid(2, 40);  // 2 columns, 40px spacing

// Get bounding box
const bbox = group.getBoundingBox();
console.log(`Width: ${bbox.width}, Height: ${bbox.height}`);
```

**Methods:**
- `add(...objects)` - Add objects
- `remove(...objects)` - Remove objects
- `getObjects()` - Get all objects
- `arrangeHorizontal(spacing)` - Line up horizontally
- `arrangeVertical(spacing)` - Line up vertically
- `arrangeInCircle(radius)` - Arrange in circle
- `arrangeInGrid(cols, spacing)` - Arrange in grid
- `scale(factor)` - Scale all objects
- `rotate(angle)` - Rotate all objects
- `move(offset)` - Move all objects
- `setColor(color)` - Set color for all
- `setOpacity(opacity)` - Set opacity
- `getBoundingBox()` - Get bounding box

---

## Camera Controls

Control the camera viewport.

```typescript
import { Camera } from 'ts-manim';

const camera = new Camera({
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0
});

// Pan
scene.play(camera.pan([100, 0], 1));

// Zoom
scene.play(camera.zoom_in(1.5, 1));  // Zoom in 1.5x
scene.play(camera.zoom_out(1.5, 1));  // Zoom out 1.5x

// Focus on point
scene.play(camera.focus([50, 50], 1));

// Rotate
scene.play(camera.rotate(Math.PI / 4, 1));
```

---

## Coordinate System

### Direction Constants

```typescript
import {
  ORIGIN,  // [0, 0]
  UP,      // [0, 1]
  DOWN,    // [0, -1]
  LEFT,    // [-1, 0]
  RIGHT,   // [1, 0]
  UL,      // [-1, 1] - Up Left
  UR,      // [1, 1]  - Up Right
  DL,      // [-1, -1]- Down Left
  DR       // [1, -1] - Down Right
} from 'ts-manim';
```

### Angle Constants

```typescript
import { PI, TAU, DEG } from 'ts-manim';

const quarterCircle = PI / 2;      // 90 degrees
const fullCircle = TAU;            // 360 degrees
const angle45Degrees = 45 * DEG;   // Convert degrees to radians
```

### Vector Utilities

```typescript
import {
  vectorAdd,
  vectorSub,
  vectorMult,
  vectorDist,
  vectorNorm,
  vectorAngle,
  interpolate,
  lerp,
  findCenter
} from 'ts-manim';

const v1 = [10, 20];
const v2 = [30, 40];

vectorAdd(v1, v2);           // [40, 60]
vectorSub(v1, v2);           // [-20, -20]
vectorMult(v1, 2);           // [20, 40]
vectorDist(v1, v2);          // distance between points
vectorNorm(v1);              // magnitude
vectorAngle(v1);             // angle in radians

interpolate(v1, v2, 0.5);    // Midpoint
lerp(10, 20, 0.5);           // 15

// Find center of multiple points
const center = findCenter([[0, 0], [100, 0], [100, 100], [0, 100]]);
```

---

## Color Utilities

### Color Constants

```typescript
import { COLORS } from 'ts-manim';

COLORS.BLUE
COLORS.RED
COLORS.GREEN
COLORS.YELLOW
COLORS.PURPLE
COLORS.CYAN
COLORS.ORANGE
COLORS.PINK
COLORS.WHITE
COLORS.BLACK

// And many more!
COLORS.LIGHT_BLUE
COLORS.DARK_RED
COLORS.LIGHT_PURPLE
// ... full palette available
```

### Color Utilities

```typescript
import {
  colorGradient,
  interpolateColor,
  lighten,
  darken,
  invert,
  hexToRgb,
  rgbToHex,
  getColor
} from 'ts-manim';

// Create gradient between two colors
const gradient = colorGradient('#FF0000', '#0000FF', 5);
// ['#FF0000', '#DE3300', '#BB6600', '#989900', '#7700CC', '#0000FF']

// Interpolate between colors
const midColor = interpolateColor('#FF0000', '#0000FF', 0.5); // '#7F0080'

// Lighten/Darken
const lighter = lighten('#FF0000', 0.2);   // Lighter red
const darker = darken('#FF0000', 0.2);     // Darker red

// Invert
const inverted = invert('#FF0000');        // '#00FFFF' (cyan)

// Convert between formats
const rgb = hexToRgb('#FF0000');           // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(255, 0, 0);           // '#FF0000'
```

---

## Examples

See `examples/` folder for complete examples:
- `manim-quick-start.ts` - Basic usage examples
- `manim-enhanced-features.ts` - All enhanced features showcase

Run examples:
```bash
npx ts-node examples/manim-quick-start.ts
npx ts-node examples/manim-enhanced-features.ts
```

---

## 🚀 Quick Start

```typescript
import {
  ManimScene,
  SimpleCircle,
  FadeInAnim,
  RotateAnim,
  PI,
  COLORS
} from 'ts-manim';

const scene = new ManimScene();
const circle = SimpleCircle({
  center: [0, 0],
  radius: 50,
  color: COLORS.BLUE
});

scene
  .add(circle)
  .play(FadeInAnim({ duration: 1 }))
  .play(RotateAnim({ angle: PI, duration: 2 }))
  .wait(0.5)
  .play(FadeOutAnim({ duration: 1 }));

console.log(`Total duration: ${scene.getCurrentTime()}s`);
```

---

## 📚 Manim vs ts-manim

| Feature | Manim | ts-manim |
|---------|-------|----------|
| Basic shapes | ✅ | ✅ |
| Animations | ✅ | ✅ |
| Grouping | ✅ | ✅ |
| Color gradients | ✅ | ✅ |
| Camera control | ✅ | ✅ |
| Complex curves | ✅ | ✅ |
| Enterprise features | ❌ | ✅ (GPU, Cloud, AI, Collab) |
| Easy to learn | ✅ | ✅ |
| TypeScript | ❌ | ✅ |

---

## 🎓 API organized by usage frequency

**Most common (Start here):**
- ManimScene
- SimpleCircle, SimpleRect, SimpleText
- FadeInAnim, FadeOutAnim, MoveAnim, RotateAnim
- COLORS, UP, DOWN, LEFT, RIGHT

**Frequently used:**
- VGroup (grouping)
- ScaleAnim, IndicateAnim, PulseAnim
- Camera
- colorGradient, lighten, darken

**Advanced:**
- Complex shapes (createStar, createArc, etc.)
- Composite animations (LaggedStartAnim, SimultaneousAnim)
- Vector utilities (vectorAdd, interpolate, etc.)
- All easing functions

---

**Happy animating! 🎬**
