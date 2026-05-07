import { motion } from 'motion/react';
import { useGameStore, ShipClass } from '../../store/gameStore';
import { ChevronLeft } from 'lucide-react';

const SHIPS: { id: ShipClass; name: string; color: string; desc: string; stats: string }[] = [
  { id: 'Assault', name: 'Assault', color: 'bg-[#00f3ff]', desc: 'Balanced fighter with rapid fire.', stats: 'HP: 100 • SPD: 5 • DMG: 10' },
  { id: 'Stealth', name: 'Stealth', color: 'bg-[#ff00ff]', desc: 'Fast warp with low cooldown.', stats: 'HP: 70 • SPD: 8 • DMG: 8' },
  { id: 'Heavy', name: 'Heavy', color: 'bg-orange-500', desc: 'High health and heavy damage.', stats: 'HP: 150 • SPD: 3 • DMG: 20' },
  { id: 'Speedster', name: 'Speedster', color: 'bg-yellow-400', desc: 'Lightning fast movement.', stats: 'HP: 60 • SPD: 10 • DMG: 6' },
];

export default function HangarScreen() {
  const { setScreen, shipClass, setShipClass, resetGame } = useGameStore();

  const handleLaunch = () => {
    resetGame();
    setScreen('GAME');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#050505] p-6 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00f3ff22 0%, transparent 70%)' }}></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <button onClick={() => setScreen('TITLE')} className="relative z-10 flex items-center text-gray-500 hover:text-white mb-6 w-fit text-[10px] font-bold uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h2 className="relative z-10 text-2xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_#00f3ff] uppercase mb-2">
        Hangar
      </h2>
      <p className="relative z-10 text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-8">Select your ship class</p>

      <div className="relative z-10 flex-1 overflow-y-auto space-y-4 pb-20">
        {SHIPS.map((ship) => (
          <motion.div
            key={ship.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShipClass(ship.id)}
            className={`p-4 rounded-xl border relative transition-colors ${
              shipClass === ship.id ? 'border-[#00f3ff] bg-[#111]' : 'border-[#222] bg-[#0a0a0a]'
            }`}
          >
            {shipClass === ship.id && <div className="absolute -top-2 -right-2 bg-[#ff00ff] text-[9px] font-black text-white px-2 py-0.5 rounded-full shadow-lg shadow-[#ff00ff]/30">ACTIVE</div>}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#333] bg-[#050505] overflow-hidden`}>
                <div className={`w-full h-full ${ship.color} opacity-40 blur-md`}></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black italic">{ship.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase">{ship.desc}</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-[#00f3ff] font-mono tracking-wider">{ship.stats}</p>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLaunch}
          className="w-full py-4 rounded-lg bg-[#00f3ff] text-black font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
        >
          Deploy Mission
        </motion.button>
      </div>
    </div>
  );
}
