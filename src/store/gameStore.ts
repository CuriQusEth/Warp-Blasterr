import { create } from 'zustand';

export type ShipClass = 'Assault' | 'Stealth' | 'Heavy' | 'Speedster';

interface GameState {
  screen: 'TITLE' | 'HANGAR' | 'GAME' | 'GAMEOVER' | 'LEADERBOARD';
  score: number;
  wave: number;
  health: number;
  maxHealth: number;
  shipClass: ShipClass;
  isWalletConnected: boolean;
  walletAddress: string | null;
  bestScore: number;
  
  setScreen: (screen: GameState['screen']) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setWave: (wave: number | ((prev: number) => number)) => void;
  setHealth: (health: number) => void;
  setShipClass: (ship: ShipClass) => void;
  connectWallet: (address: string) => void;
  endGame: (finalScore: number, finalWave: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'TITLE',
  score: 0,
  wave: 1,
  health: 100,
  maxHealth: 100,
  shipClass: 'Assault',
  isWalletConnected: false,
  walletAddress: null,
  bestScore: 0,

  setScreen: (screen) => set({ screen }),
  setScore: (score) => set((state) => ({ score: typeof score === 'function' ? score(state.score) : score })),
  setWave: (wave) => set((state) => ({ wave: typeof wave === 'function' ? wave(state.wave) : wave })),
  setHealth: (health) => set({ health }),
  setShipClass: (shipClass) => set({ shipClass }),
  connectWallet: (address) => set({ isWalletConnected: true, walletAddress: address }),
  endGame: (finalScore, finalWave) => set((state) => ({ 
    screen: 'GAMEOVER', 
    score: finalScore, 
    wave: finalWave,
    bestScore: Math.max(state.bestScore, finalScore)
  })),
  resetGame: () => set({ score: 0, wave: 1, health: 100 }), // resets stats, but keeps screen, bestScore, shipClass
}));
