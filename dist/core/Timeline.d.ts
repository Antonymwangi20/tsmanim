import { Animation } from './Animation.js';
export declare class Timeline {
    private animations;
    private currentTime;
    add(animation: Animation): void;
    addConcurrent(animation: Animation): void;
    wait(duration: number): void;
    private getLastStartTime;
    update(time: number): void;
    getTotalDuration(): number;
    reset(): void;
}
//# sourceMappingURL=Timeline.d.ts.map