import React from 'react';
import { User, Shield, Swords, Sparkles, Heart, Activity } from 'lucide-react';
import { SpdSaveFile, HeroClassType, HeroSubClassType } from '../types';

interface HeroEditorProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

const CLASS_OPTIONS: { value: HeroClassType; labelZh: string; labelEn: string; subclasses: { value: HeroSubClassType; labelZh: string; labelEn: string }[] }[] = [
  {
    value: 'WARRIOR',
    labelZh: '战士 (Warrior)',
    labelEn: 'Warrior',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'BERSERKER', labelZh: '狂战士 (Berserker)', labelEn: 'Berserker' },
      { value: 'GLADIATOR', labelZh: '角斗士 (Gladiator)', labelEn: 'Gladiator' },
    ]
  },
  {
    value: 'MAGE',
    labelZh: '法师 (Mage)',
    labelEn: 'Mage',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'BATTLEMAGE', labelZh: '战斗法师 (Battlemage)', labelEn: 'Battlemage' },
      { value: 'WARLOCK', labelZh: '术士 (Warlock)', labelEn: 'Warlock' },
    ]
  },
  {
    value: 'ROGUE',
    labelZh: '盗贼 (Rogue)',
    labelEn: 'Rogue',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'ASSASSIN', labelZh: '刺客 (Assassin)', labelEn: 'Assassin' },
      { value: 'FREERUNNER', labelZh: '疾跑者 (Freerunner)', labelEn: 'Freerunner' },
    ]
  },
  {
    value: 'HUNTRESS',
    labelZh: '女猎手 (Huntress)',
    labelEn: 'Huntress',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'SNIPER', labelZh: '神射手 (Sniper)', labelEn: 'Sniper' },
      { value: 'WARDEN', labelZh: '守望者 (Warden)', labelEn: 'Warden' },
    ]
  },
  {
    value: 'DUELIST',
    labelZh: '女斗士 (Duelist)',
    labelEn: 'Duelist',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'CHAMPION', labelZh: '角斗冠军 (Champion)', labelEn: 'Champion' },
      { value: 'MONK', labelZh: '武僧 (Monk)', labelEn: 'Monk' },
    ]
  },
  {
    value: 'CLERIC',
    labelZh: '神职人员 (Cleric)',
    labelEn: 'Cleric',
    subclasses: [
      { value: 'NONE', labelZh: '未转职 (None)', labelEn: 'None' },
      { value: 'PRIEST', labelZh: '牧师 (Priest)', labelEn: 'Priest' },
      { value: 'PALADIN', labelZh: '圣骑士 (Paladin)', labelEn: 'Paladin' },
    ]
  },
];

export const HeroEditor: React.FC<HeroEditorProps> = ({ saveData, onChange, isZh }) => {
  const hero = saveData.hero;

  const updateHero = (fields: Partial<typeof hero>) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    next.hero = { ...next.hero, ...fields };
    onChange(next);
  };

  const currentClassDef = CLASS_OPTIONS.find(c => c.value === hero.class) || CLASS_OPTIONS[0];

  const handleClassChange = (newClass: HeroClassType) => {
    updateHero({
      class: newClass,
      subClass: 'NONE'
    });
  };

  const handleTalentChange = (tierKey: 'talents_tier_1' | 'talents_tier_2' | 'talents_tier_3' | 'talents_tier_4', talentName: string, val: number) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    if (!next.hero[tierKey]) next.hero[tierKey] = {};
    next.hero[tierKey][talentName] = Math.max(0, val);
    onChange(next);
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-5 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-dungeon-border/60 pb-3">
        <User className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base font-bold text-slate-100">
          {isZh ? '英雄属性与职业 (Hero Stats & Class)' : 'Hero Stats & Class'}
        </h2>
      </div>

      {/* Class & Subclass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isZh ? '职业 (Hero Class)' : 'Hero Class'}
          </label>
          <select
            value={hero.class}
            onChange={(e) => handleClassChange(e.target.value as HeroClassType)}
            className="w-full bg-dungeon-card border border-dungeon-border rounded-lg px-3 py-2 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {CLASS_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {isZh ? c.labelZh : c.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isZh ? '转职 / 专精 (SubClass)' : 'Specialization (SubClass)'}
          </label>
          <select
            value={hero.subClass || 'NONE'}
            onChange={(e) => updateHero({ subClass: e.target.value as HeroSubClassType })}
            className="w-full bg-dungeon-card border border-dungeon-border rounded-lg px-3 py-2 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {currentClassDef.subclasses.map((s) => (
              <option key={s.value} value={s.value}>
                {isZh ? s.labelZh : s.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* HP */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-red-400">
              <Heart className="w-3.5 h-3.5" />
              {isZh ? '当前生命 (HP)' : 'Current HP'}
            </span>
            <button
              onClick={() => updateHero({ HP: hero.HT })}
              className="text-[10px] text-red-400 hover:text-red-300 underline"
            >
              {isZh ? '拉满' : 'Max'}
            </button>
          </div>
          <input
            type="number"
            value={hero.HP}
            onChange={(e) => updateHero({ HP: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-red-500 outline-none"
          />
        </div>

        {/* HT (Max HP) */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-red-400 mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-red-400/20" />
            {isZh ? '最大生命 (Max HP)' : 'Max HP (HT)'}
          </label>
          <input
            type="number"
            value={hero.HT}
            onChange={(e) => updateHero({ HT: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Shielding (htboost) */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            {isZh ? '临时护盾 (Shield)' : 'Shielding (htboost)'}
          </label>
          <input
            type="number"
            value={hero.htboost || 0}
            onChange={(e) => updateHero({ htboost: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Strength */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" />
            {isZh ? '力量等级 (Strength)' : 'Strength (STR)'}
          </label>
          <input
            type="number"
            value={hero.STR}
            onChange={(e) => updateHero({ STR: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Level */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            {isZh ? '角色等级 (Level)' : 'Level (lvl)'}
          </label>
          <input
            type="number"
            value={hero.lvl}
            onChange={(e) => updateHero({ lvl: parseInt(e.target.value) || 1 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* EXP */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-purple-300 mb-1">
            {isZh ? '当前经验 (EXP)' : 'Experience (exp)'}
          </label>
          <input
            type="number"
            value={hero.exp}
            onChange={(e) => updateHero({ exp: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Attack Skill */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {isZh ? '攻击命中修正 (Attack)' : 'Attack Skill'}
          </label>
          <input
            type="number"
            value={hero.attackSkill}
            onChange={(e) => updateHero({ attackSkill: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-slate-500 outline-none"
          />
        </div>

        {/* Defense Skill */}
        <div className="bg-dungeon-card p-3 rounded-lg border border-dungeon-border/80">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {isZh ? '闪避防御修正 (Defense)' : 'Defense Skill'}
          </label>
          <input
            type="number"
            value={hero.defenseSkill}
            onChange={(e) => updateHero({ defenseSkill: parseInt(e.target.value) || 0 })}
            className="w-full bg-dungeon-panel border border-dungeon-border rounded px-2.5 py-1.5 text-sm text-slate-100 font-semibold focus:ring-1 focus:ring-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Talents section */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {isZh ? '天赋树已分配点数 (Talent Tiers)' : 'Allocated Talents'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['talents_tier_1', 'talents_tier_2', 'talents_tier_3', 'talents_tier_4'] as const).map((tierKey, idx) => {
            const tierData = hero[tierKey] || {};
            const keys = Object.keys(tierData);
            return (
              <div key={tierKey} className="bg-dungeon-card/70 p-3 rounded-lg border border-dungeon-border/60">
                <span className="text-xs font-bold text-indigo-300 block mb-2">
                  Tier {idx + 1}
                </span>
                {keys.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">
                    {isZh ? '暂无投入点数' : 'No points allocated'}
                  </span>
                ) : (
                  <div className="space-y-1.5">
                    {keys.map((k) => (
                      <div key={k} className="flex items-center justify-between text-xs gap-2">
                        <span className="text-slate-300 truncate" title={k}>
                          {k.replace(/_/g, ' ')}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={tierData[k]}
                          onChange={(e) => handleTalentChange(tierKey, k, parseInt(e.target.value) || 0)}
                          className="w-12 bg-dungeon-panel border border-dungeon-border rounded px-1.5 py-0.5 text-center text-xs font-semibold text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
