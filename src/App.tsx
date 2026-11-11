import { useEffect } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { useGameStore } from './store/gameStore';
import TitleScreen from './components/screens/TitleScreen';
import HangarScreen from './components/screens/HangarScreen';
import GameScreen from './components/screens/GameScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import { Sun } from 'lucide-react';
import { parseEther } from 'viem';

export default function App() {
  const { screen } = useGameStore();
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'),
      data: '0x'
    });
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#050505] text-[#f0f0f0] relative font-sans overflow-hidden select-none">
      {screen === 'TITLE' && <TitleScreen />}
      {screen === 'HANGAR' && <HangarScreen />}
      {screen === 'GAME' && <GameScreen />}
      {screen === 'GAMEOVER' && <GameOverScreen />}
      {screen === 'LEADERBOARD' && <LeaderboardScreen />}
      
      {isConnected && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={16} />
            Say GM (Base Denim)
          </button>
          <div className="px-2.5 py-1.5 rounded-lg bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] text-[10px] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-ping" />
            DENIM • 200ms
          </div>
        </div>
      )}
    </div>
  );
}
