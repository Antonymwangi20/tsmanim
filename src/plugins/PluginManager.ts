// src/plugin/PluginManager.ts
import { Node } from '../core/Node.js';
import { Animation } from '../core/Animation.js';

export interface Plugin {
  name: string;
  version: string;
  install(api: PluginAPI): void;
}

export interface PluginAPI {
  registerShape: (name: string, constructor: any) => void;
  registerAnimation: (name: string, constructor: any) => void;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

/**
 * Plugin system for extending ts-manim with custom shapes and animations
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private shapes: Map<string, any> = new Map();
  private animations: Map<string, any> = new Map();
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();
  private api: PluginAPI;

  constructor() {
    this.api = this.createAPI();
  }

  /**
   * Load and install a plugin
   */
  load(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already loaded`);
    }
    
    try {
      plugin.install(this.api);
      this.plugins.set(plugin.name, plugin);
      console.log(`🔌 Loaded plugin: ${plugin.name} v${plugin.version}`);
      this.emit('plugin:loaded', plugin.name);
    } catch (err) {
      console.error(`❌ Failed to load plugin ${plugin.name}:`, err);
      throw err;
    }
  }

  /**
   * Get a registered shape constructor
   */
  getShape(name: string): any {
    return this.shapes.get(name);
  }

  /**
   * Get a registered animation constructor
   */
  getAnimation(name: string): any {
    return this.animations.get(name);
  }

  /**
   * Get all loaded plugins
   */
  getPlugins(): Map<string, Plugin> {
    return new Map(this.plugins);
  }

  /**
   * List all registered shapes
   */
  listShapes(): string[] {
    return Array.from(this.shapes.keys());
  }

  /**
   * List all registered animations
   */
  listAnimations(): string[] {
    return Array.from(this.animations.keys());
  }

  private createAPI(): PluginAPI {
    return {
      registerShape: (name: string, constructor: any) => {
        if (this.shapes.has(name)) {
          console.warn(`⚠️  Overwriting shape: ${name}`);
        }
        this.shapes.set(name, constructor);
        this.emit('shape:registered', name);
      },

      registerAnimation: (name: string, constructor: any) => {
        if (this.animations.has(name)) {
          console.warn(`⚠️  Overwriting animation: ${name}`);
        }
        this.animations.set(name, constructor);
        this.emit('animation:registered', name);
      },

      emit: (event: string, ...args: any[]) => {
        this.emit(event, ...args);
      },

      on: (event: string, handler: (...args: any[]) => void) => {
        if (!this.eventListeners.has(event)) {
          this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(handler);
      }
    };
  }

  private emit(event: string, ...args: any[]): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(...args);
        } catch (err) {
          console.error(`Error in event handler for '${event}':`, err);
        }
      }
    }
  }
}

/**
 * Global plugin manager instance
 */
export const pluginManager = new PluginManager();