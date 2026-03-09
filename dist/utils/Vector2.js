// src/utils/Vector2.ts
export class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(s) {
        return new Vector2(this.x * s, this.y * s);
    }
    lerp(target, t) {
        return new Vector2(this.x + (target.x - this.x) * t, this.y + (target.y - this.y) * t);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
}
//# sourceMappingURL=Vector2.js.map