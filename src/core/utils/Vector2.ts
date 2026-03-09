// src/utils/Vector2.ts
export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  mul(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  lerp(target: Vector2, t: number): Vector2 {
    return new Vector2(
      this.x + (target.x - this.x) * t,
      this.y + (target.y - this.y) * t
    );
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}