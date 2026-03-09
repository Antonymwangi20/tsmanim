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
export declare class PluginManager {
    private plugins;
    private shapes;
    private animations;
    private eventListeners;
    private api;
    constructor();
    /**
     * Load and install a plugin
     */
    load(plugin: Plugin): void;
    /**
     * Get a registered shape constructor
     */
    getShape(name: string): any;
    /**
     * Get a registered animation constructor
     */
    getAnimation(name: string): any;
    /**
     * Get all loaded plugins
     */
    getPlugins(): Map<string, Plugin>;
    /**
     * List all registered shapes
     */
    listShapes(): string[];
    /**
     * List all registered animations
     */
    listAnimations(): string[];
    private createAPI;
    private emit;
}
/**
 * Global plugin manager instance
 */
export declare const pluginManager: PluginManager;
//# sourceMappingURL=PluginManager.d.ts.map