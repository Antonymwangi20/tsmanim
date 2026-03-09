// src/shaders/ShaderBuilder.ts
/**
 * GPU Shader graph builder for custom visual effects
 * Generates GLSL fragment shaders from a simple DSL
 */
export class ShaderBuilder {
    uniforms = new Map();
    functions = [];
    mainBody = [];
    varyings = new Map();
    /**
     * Add uniform variable
     */
    addUniform(name, type, value) {
        this.uniforms.set(name, { type, value });
        return this;
    }
    /**
     * Add Perlin/Simplex noise (built-in)
     */
    addNoise(scale = 1, speed = 0.1) {
        this.uniforms.set('u_time', { type: 'float', value: 0 });
        this.uniforms.set('u_noiseScale', { type: 'float', value: scale });
        this.functions.push(`
      // Perlin-like noise using sine waves
      float noise(vec3 p) {
        float n = sin(p.x * 12.9898) * 43758.5453;
        n += sin(p.y * 78.233) * 43758.5453;
        n = sin(n) * 43758.5453;
        return fract(n);
      }

      float perlinNoise(vec3 v) {
        vec3 p = floor(v);
        vec3 f = fract(v);
        f = f * f * (3.0 - 2.0 * f);

        float n0 = noise(p);
        float n1 = noise(p + vec3(1.0, 0.0, 0.0));
        float ix0 = mix(n0, n1, f.x);

        n0 = noise(p + vec3(0.0, 1.0, 0.0));
        n1 = noise(p + vec3(1.0, 1.0, 0.0));
        float ix1 = mix(n0, n1, f.x);

        return mix(ix0, ix1, f.y);
      }
    `);
        this.mainBody.push(`
      float noise = perlinNoise(vec3(uv * u_noiseScale, u_time * ${speed}));
    `);
        return this;
    }
    /**
     * Add fractal Brownian motion (fBm)
     */
    addFractalNoise(octaves = 5, persistence = 0.5) {
        this.addNoise();
        this.mainBody.push(`
      float fbm = 0.0;
      float amplitude = 1.0;
      float frequency = 1.0;
      float maxValue = 0.0;

      for (int i = 0; i < ${octaves}; i++) {
        fbm += amplitude * perlinNoise(vec3(uv * frequency, u_time * 0.1));
        maxValue += amplitude;
        amplitude *= ${persistence};
        frequency *= 2.0;
      }

      fbm /= maxValue;
    `);
        return this;
    }
    /**
     * Add color gradient
     */
    addGradient(colors, useNoise = false) {
        const colorStops = colors
            .map((c, i) => {
            const r = parseInt(c.slice(1, 3), 16) / 255;
            const g = parseInt(c.slice(3, 5), 16) / 255;
            const b = parseInt(c.slice(5, 7), 16) / 255;
            return `vec3(${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)})`;
        })
            .join(', ');
        this.mainBody.push(`
      float t = ${useNoise ? 'noise' : 'uv.x'};
      vec3 colors[${colors.length}] = vec3[${colors.length}](${colorStops});
      
      vec3 gradientColor;
      if (t < 0.5) {
        gradientColor = mix(colors[0], colors[1], t * 2.0);
      } else {
        gradientColor = mix(colors[1], colors[${colors.length - 1}], (t - 0.5) * 2.0);
      }
      
      color = vec4(gradientColor, 1.0);
    `);
        return this;
    }
    /**
     * Add glow/bloom effect
     */
    addGlow(intensity = 1.0, radius = 0.5) {
        this.mainBody.push(`
      // Glow effect
      vec4 glow = color * ${intensity};
      glow.rgb *= smoothstep(${radius}, 0.0, length(uv - 0.5));
      color = mix(color, glow, 0.5);
    `);
        return this;
    }
    /**
     * Add wave distortion
     */
    addWaves(frequency = 5.0, amplitude = 0.1, speed = 1.0) {
        this.uniforms.set('u_time', { type: 'float', value: 0 });
        this.mainBody.push(`
      // Wave distortion
      float wave = sin(uv.x * ${frequency} + u_time * ${speed}) * ${amplitude};
      uv.y += wave;
    `);
        return this;
    }
    /**
     * Add Voronoi pattern
     */
    addVoronoi(scale = 5.0) {
        this.functions.push(`
      float voronoi(vec2 uv) {
        uv *= ${scale};
        vec2 i_uv = floor(uv);
        vec2 f_uv = fract(uv);

        float minDist = length(f_uv);

        for (float y = -1.0; y <= 1.0; y++) {
          for (float x = -1.0; x <= 1.0; x++) {
            vec2 neighbor = vec2(x, y);
            vec2 point = sin(i_uv + neighbor);
            point = 0.5 + 0.5 * point;
            float dist = length(f_uv - (neighbor + point));
            minDist = min(minDist, dist);
          }
        }

        return minDist;
      }
    `);
        this.mainBody.push(`
      float vor = voronoi(uv);
      color = vec4(vec3(vor), 1.0);
    `);
        return this;
    }
    /**
     * Add radial gradient
     */
    addRadialGradient(innerColor, outerColor) {
        const parseColor = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return `vec3(${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)})`;
        };
        this.mainBody.push(`
      float dist = length(uv - 0.5);
      vec3 inner = ${parseColor(innerColor)};
      vec3 outer = ${parseColor(outerColor)};
      color = vec4(mix(inner, outer, dist * 2.0), 1.0);
    `);
        return this;
    }
    /**
     * Add time-based animation
     */
    addAnimation(pattern, speed = 1.0) {
        this.uniforms.set('u_time', { type: 'float', value: 0 });
        switch (pattern) {
            case 'spin':
                this.mainBody.push(`
          float angle = u_time * ${speed};
          uv = vec2(
            cos(angle) * (uv.x - 0.5) - sin(angle) * (uv.y - 0.5) + 0.5,
            sin(angle) * (uv.x - 0.5) + cos(angle) * (uv.y - 0.5) + 0.5
          );
        `);
                break;
            case 'pulse':
                this.mainBody.push(`
          float pulse = 0.5 + 0.5 * sin(u_time * ${speed});
          color = mix(color, vec4(1.0), pulse * 0.2);
        `);
                break;
            case 'wave':
                this.mainBody.push(`
          float wave = sin(u_time * ${speed} + length(uv - 0.5) * 20.0) * 0.1;
          color += wave;
        `);
                break;
            case 'bounce':
                this.mainBody.push(`
          float bounce = abs(sin(u_time * ${speed}));
          uv += (uv - 0.5) * bounce * 0.1;
        `);
                break;
        }
        return this;
    }
    /**
     * Add color adjustment
     */
    addColorCorrection(brightness = 1.0, saturation = 1.0, contrast = 1.0) {
        this.mainBody.push(`
      // Brightness
      color.rgb *= ${brightness};

      // Saturation
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(gray), color.rgb, ${saturation});

      // Contrast
      color.rgb = mix(vec3(0.5), color.rgb, ${contrast});
    `);
        return this;
    }
    /**
     * Build complete shader
     */
    build() {
        const uniformDeclarations = Array.from(this.uniforms)
            .map(([name, { type }]) => `uniform ${type} ${name};`)
            .join('\n');
        const fragment = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform vec2 u_resolution;
      ${uniformDeclarations}

      ${this.functions.join('\n')}

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

        ${this.mainBody.join('\n')}

        gl_FragColor = color;
      }
    `;
        const vertex = `
      attribute vec2 position;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
        const uniforms = {};
        for (const [name, { type, value }] of this.uniforms) {
            uniforms[name] = { type, value };
        }
        return { vertex, fragment, uniforms };
    }
    /**
     * Get GLSL code as string
     */
    toString() {
        const uniform = this.build();
        return `${uniform.vertex}\n\n${uniform.fragment}`;
    }
}
/**
 * Pre-built shader presets
 */
export const ShaderPresets = {
    /**
     * Animated noise field
     */
    noiseField: () => {
        return new ShaderBuilder()
            .addNoise(3, 0.5)
            .addColorCorrection(1.2, 1.0, 1.1);
    },
    /**
     * Plasma effect
     */
    plasma: () => {
        return new ShaderBuilder()
            .addFractalNoise(3, 0.6)
            .addGradient(['#ff00ff', '#00ffff', '#ffff00'], true)
            .addAnimation('pulse', 2.0);
    },
    /**
     * Radio wave
     */
    radioWave: () => {
        return new ShaderBuilder()
            .addRadialGradient('#ffffff', '#000000')
            .addWaves(10, 0.2, 2.0)
            .addAnimation('pulse', 1.5);
    },
    /**
     * Voronoi cells
     */
    voronoi: () => {
        return new ShaderBuilder()
            .addVoronoi(8)
            .addGradient(['#ff0000', '#00ff00', '#0000ff']);
    },
    /**
     * Spinning galaxy
     */
    galaxy: () => {
        return new ShaderBuilder()
            .addFractalNoise(4, 0.7)
            .addRadialGradient('#ffff00', '#000033')
            .addAnimation('spin', 0.3);
    },
    /**
     * Retro sunset
     */
    sunset: () => {
        return new ShaderBuilder()
            .addGradient(['#ff6600', '#ffaa00', '#ffff00', '#00aaff'])
            .addWaves(3, 0.05, 1.0);
    }
};
//# sourceMappingURL=ShaderBuilder.js.map