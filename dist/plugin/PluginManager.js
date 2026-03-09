/**
 * Plugin system for extending ts-manim with custom shapes and animations
 */
export class PluginManager {
    plugins = new Map();
    shapes = new Map();
    animations = new Map();
    eventListeners = new Map();
    api;
    constructor() {
        this.api = this.createAPI();
    }
    /**
     * Load and install a plugin
     */
    load(plugin) {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`Plugin ${plugin.name} already loaded`);
        }
        try {
            plugin.install(this.api);
            this.plugins.set(plugin.name, plugin);
            console.log(`🔌 Loaded plugin: ${plugin.name} v${plugin.version}`);
            this.emit('plugin:loaded', plugin.name);
        }
        catch (err) {
            console.error(`❌ Failed to load plugin ${plugin.name}:`, err);
            throw err;
        }
    }
    /**
     * Get a registered shape constructor
     */
    getShape(name) {
        return this.shapes.get(name);
    }
    /**
     * Get a registered animation constructor
     */
    getAnimation(name) {
        return this.animations.get(name);
    }
    /**
     * Get all loaded plugins
     */
    getPlugins() {
        return new Map(this.plugins);
    }
    /**
     * List all registered shapes
     */
    listShapes() {
        return Array.from(this.shapes.keys());
    }
    /**
     * List all registered animations
     */
    listAnimations() {
        return Array.from(this.animations.keys());
    }
    createAPI() {
        return {
            registerShape: (name, constructor) => {
                if (this.shapes.has(name)) {
                    console.warn(`⚠️  Overwriting shape: ${name}`);
                }
                this.shapes.set(name, constructor);
                this.emit('shape:registered', name);
            },
            registerAnimation: (name, constructor) => {
                if (this.animations.has(name)) {
                    console.warn(`⚠️  Overwriting animation: ${name}`);
                }
                this.animations.set(name, constructor);
                this.emit('animation:registered', name);
            },
            emit: (event, ...args) => {
                this.emit(event, ...args);
            },
            on: (event, handler) => {
                if (!this.eventListeners.has(event)) {
                    this.eventListeners.set(event, []);
                }
                this.eventListeners.get(event).push(handler);
            }
        };
    }
    emit(event, ...args) {
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(...args);
                }
                catch (err) {
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
//# sourceMappingURL=PluginManager.js.map