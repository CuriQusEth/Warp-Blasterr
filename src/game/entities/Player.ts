import { Vector2 } from '../core/types';
import { ShipClass } from '../../store/gameStore';
import { Bullet } from './Bullet';
import { Particle } from './Particle';
import { InputManager } from '../core/InputManager';

export class Player {
  public pos: Vector2;
  public active: boolean = true;
  public radius: number = 10;
  
  public shipClass: ShipClass;
  public health: number;
  public maxHealth: number;
  public speed: number;
  public damage: number;
  public color: string;

  // Warp
  private warpCooldown: number = 0;
  private warpCooldownMax: number = 2000;
  public warpTrail: Vector2[] = [];

  // Shoot
  private fireCooldown: number = 0;
  private fireRate: number;

  constructor(x: number, y: number, shipClass: ShipClass) {
    this.pos = { x, y };
    this.shipClass = shipClass;

    switch(shipClass) {
      case 'Stealth':
        this.maxHealth = 70; this.speed = 0.5; this.damage = 8; this.color = '#ff00ff'; this.fireRate = 120; this.warpCooldownMax = 1000; break;
      case 'Heavy':
        this.maxHealth = 150; this.speed = 0.2; this.damage = 20; this.color = '#f97316'; this.fireRate = 300; this.warpCooldownMax = 3000; break;
      case 'Speedster':
        this.maxHealth = 60; this.speed = 0.7; this.damage = 6; this.color = '#facc15'; this.fireRate = 100; this.warpCooldownMax = 1500; break;
      case 'Assault':
      default:
        this.maxHealth = 100; this.speed = 0.4; this.damage = 10; this.color = '#00f3ff'; this.fireRate = 150; this.warpCooldownMax = 2000; break;
    }
    this.health = this.maxHealth;
  }

  takeDamage(amount: number) {
    this.health -= amount;
  }

  update(dt: number, input: InputManager, width: number, height: number, playerBullets: Bullet[], particles: Particle[]) {
    // Movement
    if (input.joystickActive) {
      this.pos.x += input.joystickVector.x * this.speed * dt;
      this.pos.y += input.joystickVector.y * this.speed * dt;
      
      // Engine particles
      particles.push(new Particle(
        this.pos.x - input.joystickVector.x * 10,
        this.pos.y - input.joystickVector.y * 10,
        this.color, 1, 0.05
      ));
    }

    // Wrap / Bounds constraints
    this.pos.x = Math.max(this.radius, Math.min(width - this.radius, this.pos.x));
    this.pos.y = Math.max(this.radius, Math.min(height - this.radius, this.pos.y));

    // Shooting
    if (this.fireCooldown > 0) this.fireCooldown -= dt;
    if (input.isShooting && this.fireCooldown <= 0) {
      this.fireCooldown = this.fireRate;
      playerBullets.push(new Bullet(this.pos.x, this.pos.y - 10, 0, -0.8, this.damage, this.color, false));
      // shell particles
      particles.push(new Particle(this.pos.x, this.pos.y, '#fff', 0.5, 0.1));
    }

    // Warp mechanism
    if (this.warpCooldown > 0) this.warpCooldown -= dt;
    const warpDir = input.consumeWarp();
    if (warpDir && this.warpCooldown <= 0) {
      this.warpCooldown = this.warpCooldownMax;
      
      // Create trailing particles
      for (let i = 0; i < 5; i++) {
        const stepX = this.pos.x + warpDir.x * (150 / 5) * i;
        const stepY = this.pos.y + warpDir.y * (150 / 5) * i;
        this.warpTrail.push({ x: stepX, y: stepY });
        for (let j = 0; j < 5; j++) {
           particles.push(new Particle(stepX, stepY, this.color, 2, 0.02));
        }
      }

      this.pos.x += warpDir.x * 150;
      this.pos.y += warpDir.y * 150;
      
      // Keep in bounds
      this.pos.x = Math.max(this.radius, Math.min(width - this.radius, this.pos.x));
      this.pos.y = Math.max(this.radius, Math.min(height - this.radius, this.pos.y));
    }

    // Warp Trail Decay
    if (this.warpTrail.length > 0) {
      if (Math.random() < 0.1) this.warpTrail.shift(); // randomly decay trail
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw Warp Trail
    if (this.warpTrail.length > 0) {
      ctx.beginPath();
      ctx.moveTo(this.warpTrail[0].x, this.warpTrail[0].y);
      this.warpTrail.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }

    // Draw Ship
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y - 15);
    ctx.lineTo(this.pos.x + 10, this.pos.y + 10);
    ctx.lineTo(this.pos.x, this.pos.y + 5);
    ctx.lineTo(this.pos.x - 10, this.pos.y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    
    // Draw Warp Cooldown Arc if on cooldown
    if (this.warpCooldown > 0) {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, 25, -Math.PI/2, -Math.PI/2 + (Math.PI * 2) * (1 - this.warpCooldown / this.warpCooldownMax));
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
