/**
 * Plugin System for ts-manim
 * 
 * Enables optional features without bloating core:
 * - GPU Acceleration (WebGPU, CUDA, Metal)
 * - AI Features (layout, generation, optimization)
 * - Cloud Rendering (distributed rendering, farm queuing)
 * 
 * Users only pay for what they import
 */

export type PluginType = 'renderer' | 'ai' | 'cloud' | 'physics' | 'custom';

export interface Plugin {
  name: string;
  version: string;
  type: PluginType;
  initialize(config?: Record<string, any>): Promise<void>;
  isAvailable(): boolean;
  getFeatures(): string[];
}

/**
 * Plugin Manager - handles dynamic loading and initialization
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private initialized: Set<string> = new Set();
  private config: Record<string, any>;

  constructor(globalConfig: Record<string, any> = {}) {
    this.config = globalConfig;
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Initialize a plugin
   */
  async initialize(pluginName: string, config?: Record<string, any>): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    if (!plugin.isAvailable()) {
      throw new Error(`Plugin not available: ${pluginName}`);
    }

    try {
      await plugin.initialize(config || this.config[pluginName] || {});
      this.initialized.add(pluginName);
    } catch (err) {
      throw new Error(`Failed to initialize plugin ${pluginName}: ${err}`);
    }
  }

  /**
   * Get plugin (only if initialized)
   */
  get(pluginName: string): Plugin {
    if (!this.initialized.has(pluginName)) {
      throw new Error(`Plugin not initialized: ${pluginName}. Call initialize() first.`);
    }
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }
    return plugin;
  }

  /**
   * Check if plugin is available
   */
  isAvailable(pluginName: string): boolean {
    const plugin = this.plugins.get(pluginName);
    return plugin ? plugin.isAvailable() : false;
  }

  /**
   * Get available plugins
   */
  listAvailable(): Plugin[] {
    return Array.from(this.plugins.values()).filter(p => p.isAvailable());
  }

  /**
   * Get initialized plugins
   */
  listInitialized(): Plugin[] {
    return Array.from(this.initialized).map(name => this.plugins.get(name)!);
  }

  /**
   * Get plugins by type
   */
  getByType(type: PluginType): Plugin[] {
    return Array.from(this.plugins.values()).filter(p => p.type === type);
  }
}

/**
 * Global plugin manager instance
 */
export const globalPluginManager = new PluginManager();

/**
 * Register built-in plugins on demand
 */
export async function registerBuiltinPlugins(): Promise<void> {
  // GPU plugin (optional, loaded from src/plugins/gpu/index.ts)
  try {
    const { SkiaGPUPlugin } = await import('./gpu/SkiaGPUPlugin.js');
    globalPluginManager.register(new SkiaGPUPlugin());
  } catch (e) {
    // GPU plugin not available (skia-canvas not installed)
  }

  // AI plugin (optional, loaded from src/plugins/ai/index.ts)
  try {
    const { AIPlugin } = await import('./ai/AIPlugin.js');
    globalPluginManager.register(new AIPlugin());
  } catch (e) {
    // AI plugin not available
  }

  // Cloud plugin (optional, loaded from src/plugins/cloud/index.ts)
  try {
    const { CloudPlugin } = await import('./cloud/CloudPlugin.js');
    globalPluginManager.register(new CloudPlugin());
  } catch (e) {
    // Cloud plugin not available
  }
}

// Export individual plugins
export { SkiaGPUPlugin } from './gpu/SkiaGPUPlugin.js';
export { GPUCompute } from './gpu/GPUCompute.js';
export { ShaderBuilder } from './gpu/ShaderBuilder.js';

export { AIPlugin } from './ai/AIPlugin.js';
export { AnimationAI } from './ai/AnimationAI.js';

export { CloudPlugin } from './cloud/CloudPlugin.js';
export { AWSRenderBackend } from './cloud/AWSRenderBackend.js';
export { GCPRenderBackend } from './cloud/GCPRenderBackend.js';
export { CloudInfrastructure } from './cloud/CloudInfrastructure.js';
export { RenderOrchestrator } from './cloud/RenderOrchestrator.js';

export { CollaborativeServer } from './collab/CollaborativeServer.js';
export { CollaborativeSession } from './collab/CollaborativeSession.js';

export { NodeGraph } from './ui/graph/NodeGraph.js';
export { NodeGraphUI } from './ui/graph/NodeGraphUI.js';
