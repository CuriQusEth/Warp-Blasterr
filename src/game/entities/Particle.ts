import { Vector2 } from '../core/types';

export class Particle {
  public pos: Vector2;
  public vel: Vector2;
  public color: string;
  public life: number = 1;
  public active: boolean = true;
  private decay: number;

  constructor(x: number, y: number, color: string, speedMult: number = 1, decay: number = 0.02) {
    this.pos = { x, y };
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * speedMult * 0.5;
    this.vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    this.color = color;
    this.decay = decay;
  }

  update(dt: number) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.life -= this.decay * (dt / 16);
    if (this.life <= 0) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
