import { Vector2 } from '../core/types';
import { Bullet } from './Bullet';
import { Particle } from './Particle';

export class Enemy {
  public pos: Vector2;
  public health: number;
  public radius: number = 15;
  public active: boolean = true;
  public color: string = '#ff003c';

  private moveTimer: number = 0;
  private changeDirInterval: number = 1000;
  private targetPos: Vector2;
  private speed = 0.1;
  private fireCooldown = 0;

  constructor(x: number, y: number, health: number) {
    this.pos = { x, y };
    this.health = health;
    this.targetPos = { x, y: y + 100 }; // Move down initially
  }

  takeDamage(amount: number) {
    this.health -= amount;
  }

  update(dt: number, width: number, height: number, enemyBullets: Bullet[], particles: Particle[], playerPos: Vector2) {
    this.moveTimer += dt;
    if (this.moveTimer > this.changeDirInterval) {
      this.moveTimer = 0;
      this.targetPos = {
        x: Math.max(30, Math.min(width - 30, this.pos.x + (Math.random() - 0.5) * 150)),
        y: Math.max(30, Math.min(height / 2, this.pos.y + (Math.random() - 0.5) * 100 + 20))
      };
      this.changeDirInterval = Math.random() * 1000 + 500;
    }

    // Move towards target
    const dx = this.targetPos.x - this.pos.x;
    const dy = this.targetPos.y - this.pos.y;
    this.pos.x += dx * this.speed * (dt / 16);
    this.pos.y += dy * this.speed * (dt / 16);

    // Engine particles
    if (Math.random() > 0.5) {
      particles.push(new Particle(this.pos.x, this.pos.y - 10, '#fbbf24', 0.5, 0.05));
    }

    // Shoot
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && this.pos.y > 0) {
      this.fireCooldown = Math.random() * 2000 + 1000;
      // Aim at player
      const pdx = playerPos.x - this.pos.x;
      const pdy = playerPos.y - this.pos.y;
      const dist = Math.hypot(pdx, pdy);
      enemyBullets.push(new Bullet(
        this.pos.x, this.pos.y,
        (pdx / dist) * 0.3, (pdy / dist) * 0.3,
        10, '#ff0055', true
      ));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y + this.radius);
    ctx.lineTo(this.pos.x - this.radius, this.pos.y - this.radius);
    ctx.lineTo(this.pos.x + this.radius, this.pos.y - this.radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}
