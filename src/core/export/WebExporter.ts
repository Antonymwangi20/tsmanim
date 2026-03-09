// src/export/WebExporter.ts
import { Scene } from '../Scene.js';
import { Node } from '../Node.js';

/**
 * Export animations to interactive web formats
 * Supports React, Vue, and Three.js/WebGL
 */
export class WebExporter {
  /**
   * Export scene as React component with Three.js
   */
  exportReact(scene: Scene, componentName: string = 'AnimatedScene'): string {
    const animations = this.extractAnimations(scene);
    const nodes = this.extractNodes(scene);

    return `import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ${componentName}() {
  const meshRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    
${this.generateReactAnimationCode(animations)}
  });

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group ref={meshRef}>
${this.generateReactJSX(nodes)}
      </group>
    </Canvas>
  );
}

${componentName}.displayName = '${componentName}';
export default ${componentName};
`;
  }

  /**
   * Export scene as Vue component
   */
  exportVue(scene: Scene, componentName: string = 'AnimatedScene'): string {
    const animations = this.extractAnimations(scene);
    const nodes = this.extractNodes(scene);

    return `<template>
  <div class="scene-container">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface AnimationState {
${this.generateVueAnimationInterface(animations)}
}

const canvas = ref<HTMLCanvasElement>();
const width = ref(800);
const height = ref(600);
const animationState = ref<AnimationState>({
${this.generateVueInitialState(animations)}
});

let animationId: number;
const startTime = ref(Date.now());

function animate() {
  if (!canvas.value) return;
  
  const elapsed = (Date.now() - startTime.value) / 1000;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width.value, height.value);

${this.generateVueAnimationCode(animations)}

  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  border: 1px solid #ccc;
  display: block;
}
</style>
`;
  }

  /**
   * Export as vanilla Three.js (no framework)
   */
  exportThreeJS(scene: Scene): string {
    const animations = this.extractAnimations(scene);

    return `import * as THREE from 'three';

class AnimatedScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private startTime: number;

  constructor(container: HTMLElement) {
    this.startTime = Date.now();
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    // Add objects
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.scene.add(mesh);

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const elapsed = (Date.now() - this.startTime) / 1000;
    // Animation updates would go here

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  if (container) {
    new AnimatedScene(container);
  }
});
`;
  }

  /**
   * Export as HTML with Canvas 2D
   */
  exportHTML(scene: Scene): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Scene</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f0f0f0;
      font-family: sans-serif;
    }
    canvas {
      border: 2px solid #333;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #info {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 12px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="800" height="600"></canvas>
  <div id="info">
    <div>FPS: <span id="fps">0</span></div>
    <div>Time: <span id="time">0.00s</span></div>
  </div>

  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startTime = Date.now();
    let frameCount = 0;
    let lastFpsUpdate = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Clear
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw placeholder content
      ctx.fillStyle = '#000000';
      ctx.font = '20px sans-serif';
      ctx.fillText(\`Time: \${elapsed.toFixed(2)}s\`, 20, 30);

      // Update stats
      frameCount++;
      const now = Date.now();
      if (now - lastFpsUpdate >= 1000) {
        document.getElementById('fps').textContent = frameCount;
        frameCount = 0;
        lastFpsUpdate = now;
      }
      document.getElementById('time').textContent = elapsed.toFixed(2);

      requestAnimationFrame(animate);
    }

    animate();
  </script>
</body>
</html>
`;
  }

  /**
   * Export as Lottie JSON (for web animation libraries)
   */
  exportLottie(scene: Scene): object {
    return {
      v: '5.5.2',
      fr: scene.fps || 60,
      ip: 0,
      op: 120,
      w: scene.width,
      h: scene.height,
      nm: 'Scene',
      ddd: 0,
      assets: [],
      layers: []
    };
  }

  // Helper methods

  private extractAnimations(scene: Scene): any[] {
    return [];
  }

  private extractNodes(scene: Scene): any[] {
    return [];
  }

  private generateReactAnimationCode(animations: any[]): string {
    return animations
      .map((anim, i) => {
        return `    // Animation ${i}
    if (elapsed >= ${anim.startTime || 0} && elapsed < ${(anim.startTime || 0) + (anim.duration || 1)}) {
      const progress = (elapsed - ${anim.startTime || 0}) / ${anim.duration || 1};
      // Apply animation properties
    }`;
      })
      .join('\n');
  }

  private generateReactJSX(nodes: any[]): string {
    return nodes
      .map(
        (node, i) => `        <mesh key="node-${i}">
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#${Math.floor(Math.random() * 16777215).toString(16)}" />
        </mesh>`
      )
      .join('\n');
  }

  private generateVueAnimationInterface(animations: any[]): string {
    return animations.map((_, i) => `  animation${i}: number;`).join('\n');
  }

  private generateVueInitialState(animations: any[]): string {
    return animations.map((_, i) => `  animation${i}: 0,`).join('\n');
  }

  private generateVueAnimationCode(animations: any[]): string {
    return animations
      .map((anim, i) => {
        return `  // Animation ${i}
  if (elapsed >= ${anim.startTime || 0} && elapsed < ${(anim.startTime || 0) + (anim.duration || 1)}) {
    animationState.value.animation${i} = (elapsed - ${anim.startTime || 0}) / ${anim.duration || 1};
  }`;
      })
      .join('\n');
  }

  private generateThreeJSObjects(nodes: any[]): string {
    return nodes
      .map(
        (node, i) => `    const mesh${i} = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x${Math.floor(Math.random() * 16777215).toString(16)} })
    );
    this.scene.add(mesh${i});`
      )
      .join('\n');
  }

  private generateThreeJSAnimationCode(animations: any[]): string {
    return animations
      .map((anim, i) => {
        return `    // Update animation ${i}`;
      })
      .join('\n');
  }

  private generateCanvasAnimationCode(animations: any[]): string {
    return `      ctx.fillStyle = '#000000';
      ctx.font = '20px sans-serif';
      ctx.fillText(\`Time: \${elapsed.toFixed(2)}s\`, 20, 30);`;
  }

  private generateLottieLayers(scene: Scene): any[] {
    return [];
  }
}

export const webExporter = new WebExporter();
