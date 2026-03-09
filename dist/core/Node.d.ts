import { Vector2 } from '../utils/Vector2.js';
export declare abstract class Node {
    position: Vector2;
    scale: Vector2;
    rotation: number;
    opacity: number;
    visible: boolean;
    children: Node[];
    parent: Node | null;
    private animationState;
    add(child: Node): void;
    remove(child: Node): void;
    update(time: number): void;
    abstract render(ctx: any): void;
    getGlobalPosition(): Vector2;
    setAnimationState(key: string, value: any): void;
    getAnimationState(key: string): any;
    abstract getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
//# sourceMappingURL=Node.d.ts.map