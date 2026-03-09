# ts-manim Architecture Overview

## The Complete Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ts-manim Framework v2                        │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      User Animation Code                           │
│  @Scene class with @EntryPoint → async construct() generator       │
└────────────────────────────────────────────────────────────────────┘

                              ↓

┌────────────────────────────────────────────────────────────────────┐
│                      tsm CLI Entry Point                           │
│  $ tsm -qh scene.ts output -f videos/                             │
└────────────────────────────────────────────────────────────────────┘

                              ↓

┌────────────────────────────────────────────────────────────────────┐
│                   Core Rendering Pipeline                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. TypeScript Compilation                                        │
│                                                                    │
│  2. Scene Metadata Extraction                                     │
│     └─ @Scene, @Track, @Constraint decorators                    │
│                                                                    │
│  3. Animation Execution                                           │
│     └─ Run construct() generator, collect frames                  │
│                                                                    │
│  4. Frame Buffering                                               │
│     └─ PNG sequence for FFmpeg                                    │
│                                                                    │
│  5. Video Encoding                                                │
│     └─ FFmpeg with quality preset (l/m/h/p/k)                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

                              ↓

┌────────────────────────┬─────────────────────────────────────────┐
│   Core Framework       │    Optional Plugins (on-demand)        │
├────────────────────────┼─────────────────────────────────────────┤
│                        │                                         │
│ ✓ Type System (V2)     │ 🔌 GPU Plugin     (WebGPU, Skia)       │
│   └─ Mobject<T>       │    ├─ SkiaGPUPlugin                    │
│   └─ TrackedValue     │    └─ WebGPURenderer                   │
│   └─ Decorators       │                                         │
│                        │ 🔌 AI Plugin      (TensorFlow.js, ONNX) │
│ ✓ Animations (V1)     │    ├─ Auto-layout                      │
│   └─ 70+ animations   │    ├─ Animation generation             │
│                        │    └─ Constraint optimization          │
│ ✓ Shapes              │                                         │
│   └─ 25+ shapes       │ 🔌 Cloud Plugin    (AWS, GCP, Azure)    │
│                        │    ├─ Job queuing                     │
│ ✓ Scene Management    │    ├─ Distributed rendering            │
│   └─ Timeline         │    └─ Result streaming                 │
│   └─ Rendering        │                                         │
│                        │                                         │
│ ✓ CLI (tsm)           │                                         │
│   └─ FFmpeg renderer  │                                         │
│   └─ Constraint solver│                                         │
│                        │                                         │
│ ✓ V2 Features         │                                         │
│   └─ Type safety      │                                         │
│   └─ Decorators       │                                         │
│   └─ Constraints      │                                         │
│                        │                                         │
└────────────────────────┴─────────────────────────────────────────┘

                              ↓

               Output: videos/output.mp4
```

## Quality Presets (FFmpeg)

```
┌─────────────────────────────────────────────────────────────┐
│               FFmpeg Quality Presets                        │
├─────┬──────────┬─────────┬────────┬──────────┬────────────┤
│Flag │Resolution│   FPS   │ Codec  │ Bitrate  │  Use Case  │
├─────┼──────────┼─────────┼────────┼──────────┼────────────┤
│-ql  │640x360   │   24    │H.264   │  500k    │ Quick test │
│-qm  │1280x720  │   30    │H.264   │  2.5M    │ Default    │
│-qh  │1920x1080 │   60    │H.264   │   8M     │ Standard   │
│-qp  │2560x1440 │   60    │H.265   │  15M     │ Premium    │
│-qk  │3840x2160 │   60    │H.265   │  40M     │ 4K Cinema  │
└─────┴──────────┴─────────┴────────┴──────────┴────────────┘
```

## Directory Structure

```
ts-manim/
├── src/
│   ├── core/                    # Core animations & shapes
│   │   ├── Animation.ts
│   │   ├── Scene.ts
│   │   ├── Timeline.ts
│   │   └── ...
│   │
│   ├── v2/                      # V2 Type System
│   │   ├── index.ts
│   │   ├── types.ts             # Generic Mobject<T>
│   │   ├── decorators.ts        # @Scene, @Track, @Constraint
│   │   └── constraints.ts       # Constraint solver
│   │
│   ├── renderer/                # Rendering engines
│   │   ├── SkiaRenderer.ts
│   │   └── FFmpegRenderer.ts    # ← Video encoding
│   │
│   ├── cli/
│   │   ├── tsm.ts               # ← Main CLI (tsm command)
│   │   ├── mathviz.ts           # ← Advanced CLI
│   │   └── render.ts
│   │
│   └── plugins/                 # ← Optional features
│       ├── index.ts             # Plugin manager
│       ├── gpu/
│       │   └── SkiaGPUPlugin.ts
│       ├── ai/
│       │   └── AIPlugin.ts
│       └── cloud/
│           └── CloudPlugin.ts
│
├── CLI_GUIDE.md                 # tsm command usage
├── PLUGINS.md                   # Plugin system docs
├── V2_ARCHITECTURE.md           # Type system details
└── examples/
    ├── example-workflow.ts      # Complete end-to-end
    ├── v2-api-examples.ts       # API showcase
    └── ...
```

## Rendering Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ User: tsm -qh scene.ts output -f videos/                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 1. CLI Parsing                                                  │
│    • Quality: high (1080p, 60fps, H.264)                        │
│    • Scene: scene.ts                                            │
│    • Output: videos/output.mp4                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Scene Loading                                                │
│    • Transpile TypeScript → JavaScript                          │
│    • Extract @Scene metadata                                    │
│    • Verify @EntryPoint() exists                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Constraint Resolution                                        │
│    • Load @Constraint decorators                                │
│    • Initialize ConstraintSolver                                │
│    • Prepare for animation execution                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Animation Execution                                          │
│    • Run construct() async generator                            │
│    • For each yield: capture frame                              │
│    • Apply tracked value animations                             │
│    • Solve constraints before each frame                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Frame Capture                                                │
│    • FrameBuffer collects PNG sequence                          │
│    • Saves to temporary directory                               │
│    • Total frames = fps × duration                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. FFmpeg Encoding                                              │
│    • Input: frame_%04d.png sequence                             │
│    • Settings: 1920x1080, 60fps, H.264, 8Mb/s                  │
│    • Output: videos/output.mp4                                  │
│    • Duration: ~5s (depending on animation)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Result: videos/output.mp4 (ready to use)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Plugin Loading Flow

```
Automatic Plugin Detection
├─ If skia-canvas installed
│  └─ Load SkiaGPUPlugin
├─ If TensorFlow.js installed
│  └─ Load AIPlugin
└─ If cloud credentials configured
   └─ Load CloudPlugin

Manual Plugin Usage
├─ Import plugin
├─ Register with PluginManager
├─ Initialize when needed
└─ Get reference to use
```

## Performance Profile

```
Rendering 5-second animation (1080p, 60fps = 300 frames)

CPU Only (default)
├─ Scene parse: 500ms
├─ Frame generation: 8-12 seconds
├─ FFmpeg encoding: 3-5 seconds
├─ Total: ~12-18 seconds
└─ Memory: 45MB

With GPU Plugin (Skia)
├─ Scene parse: 500ms
├─ Frame generation: 2-4 seconds (3-5x faster)
├─ FFmpeg encoding: 2-3 seconds
├─ Total: ~5-8 seconds
└─ Memory: 120MB (higher)

Cloud Rendering (8 workers)
├─ Scene parse: 500ms
├─ Upload: 1 second
├─ Cloud render: 2-3 seconds
├─ Download: 1 second
├─ Total: ~4-5 seconds
└─ Memory: 30MB (client-side)
```

## Type Safety (V2)

```typescript
// Compile-time checks
const circle2d = new Mobject2D();    // ✓ Type: Mobject<Point2D>
const shape3d = new Mobject3D();      // ✓ Type: Mobject<Point3D>

// Type mismatch at compile time
const invalid = circle2d as Mobject3D;  // ✗ TypeScript error

// Generic constraints
const group = new MobjectGroup<Point2D>();  // Only 2D objects allowed
group.add(circle2d);  // ✓
group.add(shape3d);   // ✗ Type error
```

## From V1 to V2 (Progression)

```
V1 (Current Foundation)
├─ 70+ animations
├─ 25+ shapes
├─ Scene management
└─ Basic CLI

      ↓ Add

V2 (Type-Safe Enhanced)
├─ Generic Mobject<T extends Dimension>
├─ Decorator system (@Scene, @Track, @Constraint)
├─ Constraint solver (mechanical animations)
├─ Modern CLI (tsm)
├─ Plugin architecture
└─ All V1 features work unchanged

      ↓ Add

V2.1+ (Advanced Features)
├─ GPU acceleration (WebGPU)
├─ AI assistant (TensorFlow)
├─ Cloud rendering (distributed)
├─ Physics simulation
├─ Inverse kinematics
└─ Non-linear time/branching
```

## Feature Comparison

| Feature | Manim | ts-manim V1 | ts-manim V2 | ts-manim V2+ |
|---------|-------|-----------|------------|--------------|
| Language | Python | TypeScript | TypeScript | TypeScript |
| Type Safety | ❌ | Partial | ✅ Full | ✅ Full |
| Decorators | ❌ | ❌ | ✅ Yes | ✅ Yes |
| Constraint Solver | ❌ | ❌ | ✅ Yes | ✅ Enhanced |
| GPU Acceleration | ❌ | ❌ | 🔌 Plugin | ✅ Integrated |
| AI Features | ❌ | ❌ | 🔌 Plugin | ✅ Integrated |
| Cloud Rendering | ❌ | ❌ | 🔌 Plugin | ✅ Integrated |
| Modern CLI | ❌ | Basic | ✅ tsm | ✅ Enhanced |
| Hot Reload | ✅ Via Jupyter | ❌ | 🔄 Planned | ✅ Yes |
| Physics Sim | ❌ | ❌ | 🔄 Planned | ✅ Yes |
| 4K Support | ❌ | ✅ | ✅ | ✅ |
| IDE Support | ❌ | Partial | ✅ Full | ✅ Full |

---

**Next Steps:**
1. Review [CLI Guide](CLI_GUIDE.md) for command usage
2. Check [Plugin Architecture](PLUGINS.md) for advanced features
3. See [V2 Type System](V2_ARCHITECTURE.md) for type safety details
4. Run [Examples](examples/) to see it in action

**Questions?** Check the relevant guide or open an issue on GitHub.
