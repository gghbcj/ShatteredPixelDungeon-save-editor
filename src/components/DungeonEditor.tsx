import React from 'react';
import { Compass, Coins, Flame, Key, Trophy, Sparkles } from 'lucide-react';
import { SpdSaveFile } from '../types';

interface DungeonEditorProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

export const DungeonEditor: React.FC<DungeonEditorProps> = ({ saveData, onChange, isZh }) => {
  const updateSave = (fields: Partial<SpdSaveFile>) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    Object.assign(next, fields);
    onChange(next);
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-5 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-dungeon-border/60 pb-3">
        <Compass className="w-5 h-5 text-amber-400" />
        <h2 className="text-base font-bold text-slate-100">
          {isZh ? '地牢与游戏环境 (Dungeon & Game Progress)' : 'Dungeon & Game Progress'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Depth */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            {isZh ? '当前层数 (Depth)' : 'Current Depth'}
          </label>
          <input
            type="number"
            min={1}
            max={26}
            value={saveData.depth ?? 1}
            onChange={(e) => updateSave({ depth: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-indigo-500 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isZh ? '地牢总共 26 层（25层古神，26层护符）' : 'Standard dungeon has 26 floors.'}
          </span>
        </div>

        {/* Gold */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            {isZh ? '持有金币 (Gold)' : 'Gold'}
          </label>
          <input
            type="number"
            min={0}
            max={999999}
            value={saveData.gold ?? 0}
            onChange={(e) => updateSave({ gold: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-amber-300 font-semibold focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isZh ? '可自由在商人和商店消费' : 'For shop purchases.'}
          </span>
        </div>

        {/* Energy */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-teal-400 mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            {isZh ? '炼金能量 (Alchemy Energy)' : 'Alchemy Energy'}
          </label>
          <input
            type="number"
            min={0}
            max={9999}
            value={saveData.energy ?? 0}
            onChange={(e) => updateSave({ energy: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-teal-300 font-semibold focus:ring-1 focus:ring-teal-500 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isZh ? '用于炼金坩埚合成秘药与符石' : 'Used at alchemy pots.'}
          </span>
        </div>

        {/* Seed */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-purple-400" />
            {isZh ? '地牢随机种子 (Seed)' : 'Dungeon Seed'}
          </label>
          <input
            type="text"
            value={saveData.custom_seed || saveData.seed || ''}
            onChange={(e) => updateSave({ custom_seed: e.target.value })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-mono focus:ring-1 focus:ring-purple-500 outline-none"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isZh ? '固定地图与战利品生成的随机种子' : 'World generation seed.'}
          </span>
        </div>
      </div>

      {/* Checkboxes row */}
      <div className="flex flex-wrap items-center gap-6 mt-4 pt-3 border-t border-dungeon-border/60 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!saveData.amuletObtained}
            onChange={(e) => updateSave({ amuletObtained: e.target.checked })}
            className="rounded bg-dungeon-card border-dungeon-border text-amber-500 focus:ring-0 w-4 h-4"
          />
          <span className="text-slate-200 font-medium">
            🏆 {isZh ? '已获得 Yendor 护符 (Amulet Obtained)' : 'Amulet Obtained'}
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!saveData.ascended}
            onChange={(e) => updateSave({ ascended: e.target.checked })}
            className="rounded bg-dungeon-card border-dungeon-border text-indigo-500 focus:ring-0 w-4 h-4"
          />
          <span className="text-slate-200 font-medium">
            ☀️ {isZh ? '已完成重返地表通关 (Ascended)' : 'Ascended'}
          </span>
        </label>
      </div>
    </div>
  );
};
