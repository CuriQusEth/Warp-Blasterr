import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect } from 'react';

export default function TitleScreen() {
  const { setScreen, connectWallet, isWalletConnected, walletAddress } = useGameStore();
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();

  // Sync vagmi state to game store
  useEffect(() => {
    if (isConnected && address) {
      connectWallet(address);
    }
  }, [isConnected, address, connectWallet]);

  const handleConnect = () => {
    try {
      connect({ connector: injected() });
    } catch (e) {
      // Fallback for iframe environments with no provider
      console.warn("Wagmi connect failed, using mock", e);
      connectWallet("0x1234...abcd");
    }
    // Set a timeout to mock connection if wallet doesn't popup (iframe issue)
    setTimeout(() => {
      if (!isWalletConnected) {
         connectWallet("0xBase...Dapp");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative neon-bg overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00f3ff22 0%, transparent 70%)' }}></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent uppercase mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          WARP BLASTER
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-[#00f3ff] uppercase tracking-widest font-bold mb-12 bg-[#00f3ff]/10 border border-[#00f3ff]/30 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse"></span> Base Mainnet (Denim • 200ms Blocks)
        </div>

        <div className="flex flex-col gap-4 w-full px-8 max-w-xs">
          {!isWalletConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              className="py-3 px-6 rounded-full bg-[#111] border border-[#333] hover:border-[#00f3ff] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors text-white"
            >
              Connect Wallet
            </motion.button>
          ) : (
             <div className="text-center text-[10px] uppercase font-bold tracking-widest flex flex-col items-center mb-2">
              <span className="text-gray-500 mb-1">Pilot Profile</span>
              <span className="text-sm font-mono text-[#ff00ff]">{walletAddress}</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('HANGAR')}
            className="py-3 px-6 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#0066ff] text-black font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
            Start
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('LEADERBOARD')}
            className="py-3 px-6 rounded-lg bg-[#111] border border-[#333] hover:border-[#00f3ff] text-[#f0f0f0] font-black text-sm uppercase tracking-widest transition-colors"
          >
            Leaderboard
          </motion.button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-4 text-[10px] text-gray-500 uppercase tracking-widest font-mono flex gap-4">
         <span>BUILDER CODE: bc_bthamkx9</span>
         <span>|</span>
         <span>[ATTRIBUTION_CODE]</span>
      </div>
    </div>
  );
}
