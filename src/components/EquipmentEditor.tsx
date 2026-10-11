import React from 'react';
import { Shield, Sparkles, Wand2, Gem, Layers } from 'lucide-react';
import { SpdSaveFile, SpdItem } from '../types';
import enchantsData from '../data/enchants.json';
import itemsData from '../data/items.json';

interface EquipmentEditorProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

export const EquipmentEditor: React.FC<EquipmentEditorProps> = ({ saveData, onChange, isZh }) => {
  const hero = saveData.hero;

  const updateSlot = (slotKey: 'weapon' | 'secondWep' | 'armor' | 'ring' | 'artifact' | 'misc', item: SpdItem | null) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.hero[slotKey] = item;
    onChange(next);
  };

  const getDisplayName = (className?: string) => {
    if (!className) return isZh ? '(空)' : '(Empty)';
    const found = itemsData.find((i: any) => i.className === className);
    if (found) {
      return isZh ? found.nameZh : found.nameEn;
    }
    return className.split('.').pop() || className;
  };

  const renderItemControl = (
    labelZh: string,
    labelEn: string,
    slotKey: 'weapon' | 'secondWep' | 'armor' | 'ring' | 'artifact' | 'misc',
    item?: SpdItem | null,
    isArmorSlot: boolean = false,
    isRingOrArtifact: boolean = false
  ) => {
    if (!item) {
      return (
        <div className="bg-dungeon-card p-4 rounded-xl border border-dungeon-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                {isZh ? labelZh : labelEn}
              </span>
              <span className="text-xs text-slate-500 italic">
                {isZh ? '未装备' : 'Empty Slot'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {isZh ? '此装备槽当前为空。' : 'No item equipped in this slot.'}
            </p>
          </div>
          <button
            onClick={() => {
              let defaultClass = 'com.shatteredpixel.shatteredpixeldungeon.items.weapon.melee.Greatsword';
              if (isArmorSlot) defaultClass = 'com.shatteredpixel.shatteredpixeldungeon.items.armor.PlateArmor';
              else if (slotKey === 'ring') defaultClass = 'com.shatteredpixel.shatteredpixeldungeon.items.rings.RingOfWealth';
              else if (slotKey === 'artifact') defaultClass = 'com.shatteredpixel.shatteredpixeldungeon.items.artifacts.ChaliceOfBlood';
              else if (slotKey === 'misc') defaultClass = 'com.shatteredpixel.shatteredpixeldungeon.items.trinkets.TrinketCatalyst';

              updateSlot(slotKey, {
                __className: defaultClass,
                level: 3,
                cursed: false,
                cursedKnown: true,
                levelKnown: true,
                quantity: 1,
                augment: 'NONE'
              });
            }}
            className="w-full py-1.5 bg-dungeon-panel hover:bg-slate-700 border border-dashed border-dungeon-border text-slate-300 rounded text-xs font-medium transition"
          >
            {isZh ? '+ 赋予强力默认装备' : '+ Equip Default Item'}
          </button>
        </div>
      );
    }

    const currentLevel = item.level ?? 0;

    return (
      <div className="bg-dungeon-card p-4 rounded-xl border border-dungeon-border/80 flex flex-col justify-between shadow-md">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-dungeon-border/60">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                {isZh ? labelZh : labelEn}
              </span>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 truncate" title={item.__className}>
                <span>{getDisplayName(item.__className)}</span>
                <span className="text-amber-400 font-mono text-xs">
                  {currentLevel > 0 ? `+${currentLevel}` : ''}
                </span>
              </h4>
            </div>

            <button
              onClick={() => updateSlot(slotKey, null)}
              className="text-[11px] text-red-400 hover:text-red-300 hover:bg-red-950/50 px-2 py-0.5 rounded transition"
              title="卸下或清空此槽"
            >
              {isZh ? '卸下' : 'Unequip'}
            </button>
          </div>

          {/* Level and Cursed Controls */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                {isZh ? '强化等级' : 'Level'}
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={item.level ?? 0}
                  onChange={(e) => {
                    const nextItem = { ...item, level: parseInt(e.target.value) || 0 };
                    updateSlot(slotKey, nextItem);
                  }}
                  className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2 py-1 text-xs font-semibold text-amber-300"
                />
                <button
                  onClick={() => updateSlot(slotKey, { ...item, level: 10 })}
                  className="px-1.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-dungeon-border"
                  title="一键+10"
                >
                  +10
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                {isZh ? '状态' : 'Status'}
              </label>
              <div className="flex items-center gap-1 h-7">
                <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!item.cursed}
                    onChange={(e) => {
                      updateSlot(slotKey, { ...item, cursed: !e.target.checked, cursedKnown: true });
                    }}
                    className="rounded bg-dungeon-panel border-dungeon-border text-emerald-500 focus:ring-0"
                  />
                  <span className={item.cursed ? 'text-red-400 text-xs' : 'text-emerald-400 text-xs'}>
                    {item.cursed ? (isZh ? '已诅咒' : 'Cursed') : (isZh ? '正常纯净' : 'Clean')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Enchants / Glyphs (for weapons and armor) */}
          {!isRingOrArtifact && (
            <div className="space-y-2 mb-3">
              {/* Weapon Enchantment or Armor Glyph */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {isArmorSlot 
                    ? (isZh ? '护甲刻印 (Glyph)' : 'Armor Glyph') 
                    : (isZh ? '武器附魔 (Enchantment)' : 'Weapon Enchantment')}
                </label>
                <select
                  value={isArmorSlot ? (item.glyph?.__className || '') : (item.enchantment?.__className || '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextItem = { ...item };
                    if (isArmorSlot) {
                      nextItem.glyph = val ? { __className: val } : null;
                    } else {
                      nextItem.enchantment = val ? { __className: val } : null;
                    }
                    updateSlot(slotKey, nextItem);
                  }}
                  className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="">{isZh ? '无附魔/印记 (None)' : 'None'}</option>
                  {(isArmorSlot ? enchantsData.armorGlyphs : enchantsData.weaponEnchants).map((opt: any) => (
                    <option key={opt.className} value={opt.className}>
                      {isZh ? `${opt.nameZh} (${opt.name})` : opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Augment selection */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {isZh ? '强化偏向 (Augment)' : 'Augment'}
                </label>
                <select
                  value={item.augment || 'NONE'}
                  onChange={(e) => {
                    updateSlot(slotKey, { ...item, augment: e.target.value as any });
                  }}
                  className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2 py-1 text-xs text-slate-200 outline-none"
                >
                  {enchantsData.augments
                    .filter((a: any) => {
                      if (isArmorSlot) return ['NONE', 'DEFENSE', 'EVASION'].includes(a.value);
                      return ['NONE', 'DAMAGE', 'SPEED'].includes(a.value);
                    })
                    .map((a: any) => (
                      <option key={a.value} value={a.value}>
                        {isZh ? a.label : a.labelEn}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-5 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-dungeon-border/60 pb-3">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h2 className="text-base font-bold text-slate-100">
          {isZh ? '已装备神装 (Equipped Gear)' : 'Equipped Gear'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Weapon */}
        {renderItemControl('主手武器 (Main Weapon)', 'Main Weapon', 'weapon', hero.weapon, false, false)}

        {/* Offhand Weapon (Champion / Dual wield) */}
        {renderItemControl('副手武器 (Off-hand / Duelist)', 'Off-hand Weapon', 'secondWep', hero.secondWep, false, false)}

        {/* Armor */}
        {renderItemControl('防具护甲 (Armor)', 'Equipped Armor', 'armor', hero.armor, true, false)}

        {/* Ring */}
        {renderItemControl('戒指 (Ring)', 'Equipped Ring', 'ring', hero.ring, false, true)}

        {/* Artifact */}
        {renderItemControl('神器 (Artifact)', 'Equipped Artifact', 'artifact', hero.artifact, false, true)}

        {/* Trinket / Misc */}
        {renderItemControl('饰品 (Trinket / Misc)', 'Equipped Trinket', 'misc', hero.misc, false, true)}
      </div>
    </div>
  );
};
