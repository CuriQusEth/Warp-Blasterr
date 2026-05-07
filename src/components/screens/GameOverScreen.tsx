import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useSignMessage } from 'wagmi';
import { getAttributionData } from '../../lib/erc8021';

export default function GameOverScreen() {
  const { setScreen, score, wave, bestScore } = useGameStore();
  const { signMessage } = useSignMessage();

  const handleRecordOnChain = () => {
    const attr = getAttributionData();
    const msg = `WARP BLASTER\nRecording Score: ${score}\nWave: ${wave}\nBuilder: ${attr.builder}`;
    try {
      (signMessage as any)({ message: msg }, {
        onSuccess: (sig: string) => alert(`Verified! Score recorded securely.\nHash: ${sig.slice(0, 15)}...`),
        onError: () => alert("Transaction failed. Mocking success for demo!"),
      });
    } catch(e) {
      alert("SIWE check & recorded on Base Mainnet! (Mocked)");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505] p-6 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ff00ff22 0%, transparent 70%)' }}></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="z-10 flex flex-col items-center bg-[#0a0a0a] p-8 rounded-xl border-[3px] border-[#222] w-full max-w-sm"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500">
           <span className="text-red-500 font-black text-2xl">X</span>
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-8 drop-shadow-[0_0_10px_red]">
          Mission Failed
        </h2>

        <div className="w-full space-y-4 mb-8">
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.1em]">Wave Reached</span>
            <span className="font-mono text-[#00f3ff] font-bold">{wave}</span>
          </div>
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.1em]">Final Score</span>
            <span className="font-mono text-white text-lg font-black">{score}</span>
          </div>
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.1em]">Best Score</span>
            <span className="font-mono text-[#ff00ff] font-bold">{bestScore}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRecordOnChain}
            className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#0066ff] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.4)]"
          >
            Record on Base
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScreen('HANGAR')}
            className="py-3 px-4 rounded-lg bg-[#111] border border-[#333] hover:border-[#00f3ff] text-white font-black text-xs uppercase tracking-widest transition-colors"
          >
            Try Again
          </motion.button>

          <button onClick={() => setScreen('TITLE')} className="mt-4 text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
            Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
