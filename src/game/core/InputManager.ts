import { Vector2 } from './types';

export class InputManager {
  private el: HTMLElement;
  
  // Joystick (Left half)
  public joystickActive = false;
  public joystickOrigin: Vector2 = { x: 0, y: 0 };
  public joystickCurrent: Vector2 = { x: 0, y: 0 };
  public joystickVector: Vector2 = { x: 0, y: 0 }; // Normalized or bounded

  // Actions (Right half)
  public isShooting = false;
  
  // Swipe for warp
  private rightPointerDownPos: Vector2 | null = null;
  private rightPointerDownTime: number = 0;
  
  public warpTriggered = false;
  public warpDirection: Vector2 = { x: 0, y: 0 };

  private activePointers: Map<number, { x: number; y: number; startX: number; startY: number }> = new Map();

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.addEventListener('pointerdown', this.onPointerDown);
    this.el.addEventListener('pointermove', this.onPointerMove);
    this.el.addEventListener('pointerup', this.onPointerUp);
    this.el.addEventListener('pointercancel', this.onPointerUp);
    this.el.addEventListener('contextmenu', e => e.preventDefault());
  }

  destroy() {
    this.el.removeEventListener('pointerdown', this.onPointerDown);
    this.el.removeEventListener('pointermove', this.onPointerMove);
    this.el.removeEventListener('pointerup', this.onPointerUp);
    this.el.removeEventListener('pointercancel', this.onPointerUp);
  }

  private onPointerDown = (e: PointerEvent) => {
    const isLeft = e.clientX < window.innerWidth / 2;
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY });

    if (isLeft) {
      if (!this.joystickActive) {
        this.joystickActive = true;
        this.joystickOrigin = { x: e.clientX, y: e.clientY };
        this.joystickCurrent = { x: e.clientX, y: e.clientY };
        this.joystickVector = { x: 0, y: 0 };
      }
    } else {
      this.isShooting = true;
      this.rightPointerDownPos = { x: e.clientX, y: e.clientY };
      this.rightPointerDownTime = performance.now();
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.activePointers.has(e.pointerId)) return;
    
    const ptr = this.activePointers.get(e.pointerId)!;
    ptr.x = e.clientX;
    ptr.y = e.clientY;

    const isLeft = ptr.startX < window.innerWidth / 2;

    if (isLeft && this.joystickActive) {
      this.joystickCurrent = { x: e.clientX, y: e.clientY };
      let dx = this.joystickCurrent.x - this.joystickOrigin.x;
      let dy = this.joystickCurrent.y - this.joystickOrigin.y;
      const dist = Math.hypot(dx, dy);
      const maxDist = 50;
      
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
      }
      
      this.joystickVector = { x: dx / maxDist, y: dy / maxDist };
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.activePointers.has(e.pointerId)) return;
    const ptr = this.activePointers.get(e.pointerId)!;
    const isLeft = ptr.startX < window.innerWidth / 2;
    
    this.activePointers.delete(e.pointerId);

    if (isLeft) {
      // Check if any remaining pointers are on the left
      let stillLeft = false;
      this.activePointers.forEach(p => {
        if (p.startX < window.innerWidth / 2) stillLeft = true;
      });
      if (!stillLeft) {
        this.joystickActive = false;
        this.joystickVector = { x: 0, y: 0 };
      }
    } else {
      // Swipe detection for Warp
      if (this.rightPointerDownPos) {
        const dx = e.clientX - this.rightPointerDownPos.x;
        const dy = e.clientY - this.rightPointerDownPos.y;
        const dist = Math.hypot(dx, dy);
        const timeDiff = performance.now() - this.rightPointerDownTime;

        if (dist > 30 && timeDiff < 300) {
          // It's a quick swipe -> WARP
          this.warpTriggered = true;
          this.warpDirection = { x: dx / dist, y: dy / dist };
        }
      }
      
      // Check if any remaining pointers are on the right
      let stillRight = false;
      this.activePointers.forEach(p => {
        if (p.startX >= window.innerWidth / 2) stillRight = true;
      });
      if (!stillRight) {
        this.isShooting = false;
      }
    }
  };

  public consumeWarp() {
    if (this.warpTriggered) {
      this.warpTriggered = false;
      return this.warpDirection;
    }
    return null;
  }

  public drawDebug(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Optional: Draw virtual joystick
    if (this.joystickActive) {
      ctx.beginPath();
      ctx.arc(this.joystickOrigin.x, this.joystickOrigin.y, 50, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.joystickOrigin.x + this.joystickVector.x * 50, this.joystickOrigin.y + this.joystickVector.y * 50, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.fill();
    }
  }
}
