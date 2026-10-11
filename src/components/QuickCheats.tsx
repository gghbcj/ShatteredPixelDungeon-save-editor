import React from 'react';
import { Heart, Coins, Eye, Gift, ShieldPlus, Zap, ArrowUpCircle } from 'lucide-react';
import { SpdSaveFile } from '../types';
import { identifyAllKnowledge, addGodPack } from '../utils/saveFile';

interface QuickCheatsProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

export const QuickCheats: React.FC<QuickCheatsProps> = ({ saveData, onChange, isZh }) => {
  const handleFullHeal = () => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.hero.HP = next.hero.HT;
    next.hero.htboost = 50;
    onChange(next);
  };

  const handleMaxGoldEnergy = () => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.gold = 99999;
    next.energy = 999;
    onChange(next);
  };

  const handleMaxStrength = () => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.hero.STR = 25;
    onChange(next);
  };

  const handleLevel30 = () => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.hero.lvl = 30;
    next.hero.exp = 0;
    next.hero.HT = Math.max(next.hero.HT, 150);
    next.hero.HP = next.hero.HT;
    onChange(next);
  };

  const handleIdentifyAll = () => {
    const next = identifyAllKnowledge(saveData);
    onChange(next);
  };

  const handleGodPack = () => {
    const next = addGodPack(saveData);
    onChange(next);
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-4 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {isZh ? '⚡ 快捷修改 (一键神装/保命)' : '⚡ Quick Cheats & Helpers'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Full heal */}
        <button
          onClick={handleFullHeal}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 rounded-lg text-red-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/30" />
          <span>{isZh ? '回满生命+护盾' : 'Full HP + Shield'}</span>
        </button>

        {/* Max gold & energy */}
        <button
          onClick={handleMaxGoldEnergy}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg text-amber-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>{isZh ? '99999金币+能量' : 'Max Gold & Energy'}</span>
        </button>

        {/* Max Strength */}
        <button
          onClick={handleMaxStrength}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg text-indigo-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <ShieldPlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isZh ? '力量设为 25' : 'Strength to 25'}</span>
        </button>

        {/* Level 30 */}
        <button
          onClick={handleLevel30}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/60 rounded-lg text-blue-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <ArrowUpCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>{isZh ? '满级 30 级' : 'Max Level 30'}</span>
        </button>

        {/* Identify all */}
        <button
          onClick={handleIdentifyAll}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg text-emerald-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isZh ? '全图鉴鉴定' : 'Identify All'}</span>
        </button>

        {/* God Starter Pack */}
        <button
          onClick={handleGodPack}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 rounded-lg text-purple-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <Gift className="w-3.5 h-3.5 text-purple-400" />
          <span>{isZh ? '获取物资大礼包' : 'Supply Bundle'}</span>
        </button>
      </div>
    </div>
  );
};
