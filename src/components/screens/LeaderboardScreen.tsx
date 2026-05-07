import { useGameStore } from '../../store/gameStore';
import { ChevronLeft } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, address: '0x1A2B...3C4D', score: 95000, wave: 42 },
  { rank: 2, address: '0x9F8E...7D6C', score: 82000, wave: 38 },
  { rank: 3, address: '0x5B4A...1F2E', score: 71000, wave: 31 },
  { rank: 4, address: '0x3C2D...4E5F', score: 65000, wave: 29 },
  { rank: 5, address: '0x7G8H...9I0J', score: 54000, wave: 25 },
];

export default function LeaderboardScreen() {
  const { setScreen } = useGameStore();

  return (
    <div className="flex flex-col h-full w-full bg-[#050505] p-6 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ff00ff22 0%, transparent 70%)' }}></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <button onClick={() => setScreen('TITLE')} className="relative z-10 flex items-center text-gray-500 hover:text-white mb-6 w-fit text-[10px] font-bold uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="relative z-10 flex items-center justify-between mb-8 border-b border-[#222] pb-6">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_#ff00ff] uppercase">
            Top Pilots
          </h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Verified on Base Mainnet</p>
        </div>
        <span className="text-[10px] text-[#00f3ff] border border-[#00f3ff]/30 px-3 py-1 rounded bg-[#00f3ff]/10">Global</span>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-3">
        {MOCK_LEADERBOARD.map((entry) => (
          <div key={entry.rank} className="flex items-center gap-4 p-3 bg-[#111]/80 rounded-lg border border-[#222] hover:border-[#333] transition-colors backdrop-blur-sm">
            <div className="text-xs font-black text-gray-600 w-6 text-center">{entry.rank.toString().padStart(2, '0')}</div>
            <div className={`w-8 h-8 rounded-md ${entry.rank === 1 ? 'bg-gradient-to-tr from-orange-400 to-red-600' : 'bg-[#222]'}`}></div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold truncate text-[#f0f0f0]">{entry.address}</div>
              <div className="text-[10px] text-[#00f3ff] font-mono tracking-widest uppercase">Wave {entry.wave} Survived</div>
            </div>
            <div className="text-right flex flex-col items-end">
               <div className="text-lg font-black font-mono text-white">{entry.score}</div>
               <div className="text-[8px] uppercase tracking-widest text-gray-500">Score</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer info matching sleek interface */}
      <div className="relative z-10 mt-6 p-4 bg-gradient-to-tr from-[#111] to-[#0a0a0a] rounded-xl border border-[#222]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#ff00ff]/20 rounded text-[#ff00ff]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff00ff]">Trustless Agents</div>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">ERC-8004 Protocol Integrated. Real-time attribution active for all warp events.</p>
      </div>
    </div>
  );
}
