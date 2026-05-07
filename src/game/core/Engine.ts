import { ShipClass } from '../../store/gameStore';
import { Vector2 } from './types';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import { Particle } from '../entities/Particle';
import { InputManager } from './InputManager';

interface EngineCallbacks {
  setScore: (score: number | ((prev: number) => number)) => void;
  setWave: (w: number | ((prev: number) => number)) => void;
  setHealth: (h: number) => void;
  endGame: (score: number, wave: number) => void;
  shipClass: ShipClass;
}

export function createEngine(canvas: HTMLCanvasElement, callbacks: EngineCallbacks) {
  const ctx = canvas.getContext('2d')!;
  let animationFrameId: number;
  let lastTime = 0;
  
  let width = canvas.width;
  let height = canvas.height;

  const input = new InputManager(canvas);

  let score = 0;
  let wave = 1;
  let isGameOver = false;

  let screenShake = 0;
  let combo = 1;
  let timeSinceLastKill = 1000;

  // Entities
  let player = new Player(width / 2, height - 100, callbacks.shipClass);
  let enemies: Enemy[] = [];
  let playerBullets: Bullet[] = [];
  let enemyBullets: Bullet[] = [];
  let particles: Particle[] = [];

  // Wave Spawning
  let waveTimer = 0;
  let enemiesToSpawn = 5;
  let spawnDelay = 2000;
  let timeSinceLastSpawn = 0;

  function resize(w: number, h: number) {
    width = w;
    height = h;
    // ensure player doesn't go out of bounds on resize
    player.pos.x = Math.min(player.pos.x, width);
    player.pos.y = Math.min(player.pos.y, height);
  }

  function destroy() {
    cancelAnimationFrame(animationFrameId);
    input.destroy();
  }

  function getPlayerHealth() {
    return player.health;
  }

  function checkCollisions() {
    // Player bullets vs Enemies
    playerBullets.forEach(b => {
      enemies.forEach(e => {
        if (!b.active || !e.active) return;
        const dist = Math.hypot(b.pos.x - e.pos.x, b.pos.y - e.pos.y);
        if (dist < b.radius + e.radius) {
          b.active = false;
          e.takeDamage(b.damage);
        }
      });
    });

    // Enemy bullets vs Player
    enemyBullets.forEach(b => {
      if (!b.active || !player.active) return;
      const dist = Math.hypot(b.pos.x - player.pos.x, b.pos.y - player.pos.y);
      if (dist < b.radius + player.radius) {
        b.active = false;
        player.takeDamage(b.damage);
        callbacks.setHealth(player.health);
        screenShake = Math.max(screenShake, 100);
      }
    });

    // Enemies vs Player Warp Trail
    if (player.warpTrail.length > 0) {
      enemies.forEach(e => {
        if (!e.active) return;
        player.warpTrail.forEach(trailPoint => {
          const dist = Math.hypot(trailPoint.x - e.pos.x, trailPoint.y - e.pos.y);
          if (dist < 30) {
            e.takeDamage(0.5); // Damage over time
            screenShake = Math.max(screenShake, 30); // slight shake for warp trail hit
          }
        });
      });
    }
  }

  function update(dt: number) {
    if (isGameOver) return;

    // Apply input to player
    player.update(dt, input, width, height, playerBullets, particles);

    if (player.health <= 0) {
      isGameOver = true;
      callbacks.endGame(score, wave);
    }

    // Spawning logic
    timeSinceLastSpawn += dt;
    if (enemiesToSpawn > 0 && timeSinceLastSpawn > spawnDelay) {
      const ex = Math.random() * (width - 60) + 30;
      const ey = -30;
      // scale hp/damage with wave
      enemies.push(new Enemy(ex, ey, 20 + wave * 10));
      enemiesToSpawn--;
      timeSinceLastSpawn = 0;
    }

    if (enemiesToSpawn === 0 && enemies.filter(e => e.active).length === 0) {
      // Wave cleared
      wave++;
      callbacks.setWave(wave);
      enemiesToSpawn = 5 + wave * 2;
      spawnDelay = Math.max(500, 2000 - wave * 100);
      timeSinceLastSpawn = 0;
      
      // Heal player slightly between waves
      player.health = Math.min(player.maxHealth, player.health + 20);
      callbacks.setHealth(player.health);
    }

    timeSinceLastKill += dt;

    // Update Entities
    enemies.forEach(e => {
      e.update(dt, width, height, enemyBullets, particles, player.pos);
      if (e.health <= 0 && e.active) {
        e.active = false;
        
        if (timeSinceLastKill < 1000) {
          combo++;
        } else {
          combo = 1;
        }
        timeSinceLastKill = 0;
        
        score += 100 * combo;
        callbacks.setScore(score);
        screenShake = Math.max(screenShake, 150);
        // explosion particles
        for(let i=0; i<15; i++) {
          particles.push(new Particle(e.pos.x, e.pos.y, e.color));
        }
      }
    });
    
    playerBullets.forEach(b => b.update(dt, width, height));
    enemyBullets.forEach(b => b.update(dt, width, height));
    particles.forEach(p => p.update(dt));

    checkCollisions();

    // Cleanup inactive
    enemies = enemies.filter(e => e.active);
    playerBullets = playerBullets.filter(b => b.active);
    enemyBullets = enemyBullets.filter(b => b.active);
    particles = particles.filter(p => p.active);
  }

  function draw() {
    ctx.save();
    if (screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * 15 * (screenShake / 150);
      const shakeY = (Math.random() - 0.5) * 15 * (screenShake / 150);
      ctx.translate(shakeX, shakeY);
    }
  
    // Clear and draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // trailing effect
    ctx.fillRect(0, 0, width, height);

    // Draw Entities
    particles.forEach(p => p.draw(ctx));
    playerBullets.forEach(b => b.draw(ctx));
    enemyBullets.forEach(b => b.draw(ctx));
    enemies.forEach(e => e.draw(ctx));
    if (!isGameOver) player.draw(ctx);

    input.drawDebug(ctx, width, height);

    // Combo indicator
    if (combo > 1 && timeSinceLastKill < 1000) {
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(`x${combo}`, player.pos.x + 20, player.pos.y - 20);
    }
    
    ctx.restore();
  }

  function loop(time: number) {
    if (!lastTime) lastTime = time;
    const dt = time - lastTime;
    lastTime = time;
    
    if (screenShake > 0) screenShake -= dt;

    update(dt);
    draw();

    animationFrameId = requestAnimationFrame(loop);
  }

  function start() {
    animationFrameId = requestAnimationFrame(loop);
  }

  return { start, resize, destroy, getPlayerHealth };
}
