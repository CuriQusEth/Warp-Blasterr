import { useGameStore } from '../../store/gameStore';
import WarpCanvas from '../game/WarpCanvas';
import { useSignMessage } from 'wagmi';

export default function GameScreen() {
  const { score, wave, health, maxHealth } = useGameStore();
  const { signMessage } = useSignMessage();

  const handleSayGM = () => {
    try {
      (signMessage as any)({ message: "Say GM on Base!" }, {
        onSuccess: (data: string) => alert(`Tx signed: ${data.slice(0,10)}...`),
        onError: () => alert("Transaction skipped or failed. GM anyway!")
      });
    } catch(e) {
      alert("On-chain action: Say GM on Base! (Mocked)");
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden select-none touch-none">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00f3ff22 0%, transparent 70%)' }}></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Game Canvas */}
      <WarpCanvas />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-10">
        <div className="flex flex-col">
           <div className="text-[10px] uppercase tracking-[0.3em] text-[#00f3ff]">Wave {wave}</div>
           <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_#00f3ff]">{score}</div>
        </div>
        
        <div className="flex flex-col items-end gap-1.5 mt-2">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{Math.max(0, health)} / {maxHealth} Hull</div>
          <div className="w-32 h-1.5 bg-[#222] rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-red-500 shadow-[0_0_8px_red] transition-all duration-200" 
              style={{ width: `${Math.max(0, (health / maxHealth) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* On-chain Action Button (GM) placed somewhere unobtrusive */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-10">
        <button 
          onClick={handleSayGM}
          className="pointer-events-auto px-6 py-2.5 bg-gradient-to-r from-[#00f3ff] to-[#0066ff] text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
        >
          SAY GM (Base)
        </button>
      </div>
    </div>
  );
}
