import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { createEngine } from '../../game/core/Engine';

export default function WarpCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);

  const { setScore, setWave, setHealth, endGame, shipClass, health } = useGameStore();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    
    // Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        if (engineRef.current) engineRef.current.resize(width, height);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Initial size
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    // Initialize Game Engine
    engineRef.current = createEngine(canvas, {
      setScore,
      setWave,
      setHealth,
      endGame,
      shipClass,
    });
    
    engineRef.current.start();

    return () => {
      resizeObserver.disconnect();
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []); // Only run once on mount

  // Sync health state changes down to engine if needed, though engine might drive the store
  useEffect(() => {
    if (engineRef.current && engineRef.current.getPlayerHealth() !== health) {
       // if react state health gets reset, engine might want to know (for retries)
    }
  }, [health]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'none' }} // Prevent scrolling
      />
    </div>
  );
}
