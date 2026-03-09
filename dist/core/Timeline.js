export class Timeline {
    animations = [];
    currentTime = 0;
    add(animation) {
        animation.setStartTime(this.currentTime);
        this.animations.push(animation);
    }
    addConcurrent(animation) {
        // Add animation starting at the same time as the last group
        const lastStart = this.getLastStartTime();
        animation.setStartTime(lastStart);
        this.animations.push(animation);
    }
    wait(duration) {
        this.currentTime += duration;
    }
    getLastStartTime() {
        if (this.animations.length === 0)
            return 0;
        return Math.max(...this.animations.map(a => a.startTime));
    }
    update(time) {
        for (const anim of this.animations) {
            if (time >= anim.startTime && !anim.isComplete) {
                anim.update(time);
            }
        }
    }
    getTotalDuration() {
        if (this.animations.length === 0)
            return 0;
        return Math.max(...this.animations.map(a => a.startTime + a.duration));
    }
    reset() {
        this.currentTime = 0;
        for (const anim of this.animations) {
            anim.isComplete = false;
        }
    }
}
//# sourceMappingURL=Timeline.js.map