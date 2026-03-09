import { Scene } from '../core/Scene.js';
/**
 * Export animations to interactive web formats
 * Supports React, Vue, and Three.js/WebGL
 */
export declare class WebExporter {
    /**
     * Export scene as React component with Three.js
     */
    exportReact(scene: Scene, componentName?: string): string;
    /**
     * Export scene as Vue component
     */
    exportVue(scene: Scene, componentName?: string): string;
    /**
     * Export as vanilla Three.js (no framework)
     */
    exportThreeJS(scene: Scene): string;
    /**
     * Export as HTML with Canvas 2D
     */
    exportHTML(scene: Scene): string;
    /**
     * Export as Lottie JSON (for web animation libraries)
     */
    exportLottie(scene: Scene): object;
    private extractAnimations;
    private extractNodes;
    private generateReactAnimationCode;
    private generateReactJSX;
    private generateVueAnimationInterface;
    private generateVueInitialState;
    private generateVueAnimationCode;
    private generateThreeJSObjects;
    private generateThreeJSAnimationCode;
    private generateCanvasAnimationCode;
    private generateLottieLayers;
}
export declare const webExporter: WebExporter;
//# sourceMappingURL=WebExporter.d.ts.map