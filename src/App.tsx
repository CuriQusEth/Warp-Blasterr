import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import TitleScreen from './components/screens/TitleScreen';
import HangarScreen from './components/screens/HangarScreen';
import GameScreen from './components/screens/GameScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';

export default function App() {
  const { screen } = useGameStore();

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#050505] text-[#f0f0f0] relative font-sans overflow-hidden select-none">
      {screen === 'TITLE' && <TitleScreen />}
      {screen === 'HANGAR' && <HangarScreen />}
      {screen === 'GAME' && <GameScreen />}
      {screen === 'GAMEOVER' && <GameOverScreen />}
      {screen === 'LEADERBOARD' && <LeaderboardScreen />}
    </div>
  );
}
