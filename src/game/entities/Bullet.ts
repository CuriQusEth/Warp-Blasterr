import { Vector2 } from '../core/types';

export class Bullet {
  public pos: Vector2;
  public vel: Vector2;
  public radius: number = 3;
  public damage: number;
  public color: string;
  public active: boolean = true;
  public isEnemy: boolean;

  constructor(x: number, y: number, vx: number, vy: number, damage: number, color: string, isEnemy: boolean) {
    this.pos = { x, y };
    this.vel = { x: vx, y: vy };
    this.damage = damage;
    this.color = color;
    this.isEnemy = isEnemy;
    this.radius = isEnemy ? 4 : 3;
  }

  update(dt: number, width: number, height: number) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
