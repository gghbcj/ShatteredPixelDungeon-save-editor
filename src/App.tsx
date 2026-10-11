import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { SaveFileManager } from './components/SaveFileManager';
import { QuickCheats } from './components/QuickCheats';
import { HeroEditor } from './components/HeroEditor';
import { EquipmentEditor } from './components/EquipmentEditor';
import { InventoryEditor } from './components/InventoryEditor';
import { DungeonEditor } from './components/DungeonEditor';
import { RawJsonEditor } from './components/RawJsonEditor';
import { SpdSaveFile } from './types';
import { downloadSaveFile, createDefaultItem } from './utils/saveFile';
import { Zap, User, Sparkles, Package, Compass, Code, Play } from 'lucide-react';

export const App: React.FC = () => {
  const [saveData, setSaveData] = useState<SpdSaveFile | null>(null);
  const [fileName, setFileName] = useState<string>('game.dat');
  const [isZh, setIsZh] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<'all' | 'hero' | 'equipment' | 'inventory' | 'dungeon' | 'json'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download modified save file
  const handleDownload = () => {
    if (!saveData) return;
    downloadSaveFile(saveData, fileName);
  };

  // Demo save generator for users previewing on GitHub Pages
  const loadDemoSave = () => {
    const demo: SpdSaveFile = {
      version: 922,
      seed: 'DEMO-1234567890',
      custom_seed: 'DEMO-1234567890',
      depth: 6,
      gold: 1500,
      energy: 25,
      amuletObtained: false,
      hero: {
        __className: 'com.shatteredpixel.shatteredpixeldungeon.actors.hero.Hero',
        class: 'ROGUE',
        subClass: 'ASSASSIN',
        HP: 60,
        HT: 60,
        htboost: 10,
        STR: 14,
        lvl: 8,
        exp: 25,
        attackSkill: 18,
        defenseSkill: 13,
        weapon: createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.weapon.melee.Scimitar', {
          level: 2,
          enchantment: { __className: 'com.shatteredpixel.shatteredpixeldungeon.items.weapon.enchantments.Blazing' }
        }),
        armor: createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.armor.LeatherArmor', {
          level: 1,
          glyph: { __className: 'com.shatteredpixel.shatteredpixeldungeon.items.armor.glyphs.Flow' }
        }),
        ring: createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.rings.RingOfWealth', { level: 2 }),
        artifact: createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.artifacts.CloakOfShadows', { level: 3 }),
        misc: createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.trinkets.TrinketCatalyst', { level: 1 }),
        secondWep: null,
        inventory: [
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.potions.PotionOfHealing', { quantity: 3 }),
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.scrolls.ScrollOfUpgrade', { quantity: 2 }),
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.food.Food', { quantity: 3 }),
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.Waterskin', { quantity: 1 }),
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.VelvetPouch', {
            inventory: [
              createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.plants.Icecap$Seed', { quantity: 2 }),
              createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.stones.StoneOfIntuition', { quantity: 1 }),
            ]
          }),
          createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.MagicalHolster', {
            inventory: [
              createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.wands.WandOfMagicMissile', { level: 1 }),
              createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.weapon.missiles.ThrowingKnife', { quantity: 5 })
            ]
          })
        ],
        talents_tier_1: { PROTECTIVE_SHADOWS: 2, THIEFS_INTUITION: 2 },
        talents_tier_2: { SILENT_STEPS: 2 },
        talents_tier_3: {},
        talents_tier_4: {}
      }
    };
    setSaveData(demo);
    setFileName('demo-game.dat');
  };

  return (
    <div className="min-h-screen bg-dungeon-dark text-slate-100 flex flex-col font-sans">
      <Header
        saveData={saveData}
        onDownload={handleDownload}
        onUploadClick={() => fileInputRef.current?.click()}
        isZh={isZh}
        setIsZh={setIsZh}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Upload dropzone / status bar */}
        <SaveFileManager
          saveData={saveData}
          fileName={fileName}
          onSaveLoaded={(data, name) => {
            setSaveData(data);
            setFileName(name);
          }}
          isZh={isZh}
          fileInputRef={fileInputRef}
        />

        {/* Demo button if no save loaded */}
        {!saveData && (
          <div className="text-center mt-2">
            <button
              onClick={loadDemoSave}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition"
            >
              <Play className="w-3.5 h-3.5" />
              {isZh ? '没有存档？点击载入演示示例存档体验' : 'No save file handy? Click to load a demo save'}
            </button>
          </div>
        )}

        {/* Editor Main Body */}
        {saveData && (
          <div>
            {/* Quick Cheats Bar */}
            <QuickCheats
              saveData={saveData}
              onChange={setSaveData}
              isZh={isZh}
            />

            {/* Navigation Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-dungeon-border mb-6 overflow-x-auto text-xs pb-1">
              {[
                { id: 'all', labelZh: '📋 全部展开 (All)', labelEn: 'All Views' },
                { id: 'hero', labelZh: '👤 英雄属性 (Hero)', labelEn: 'Hero Stats' },
                { id: 'equipment', labelZh: '⚔️ 装备神装 (Gear)', labelEn: 'Equipped Gear' },
                { id: 'inventory', labelZh: '🎒 背包道具 (Inventory)', labelEn: 'Inventory' },
                { id: 'dungeon', labelZh: '🧭 地牢环境 (Dungeon)', labelEn: 'Dungeon' },
                { id: 'json', labelZh: '💻 原始 JSON (Raw)', labelEn: 'Raw JSON' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-3.5 py-2 font-bold rounded-lg transition whitespace-nowrap ${
                    activeSection === tab.id
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card/50'
                  }`}
                >
                  {isZh ? tab.labelZh : tab.labelEn}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            {(activeSection === 'all' || activeSection === 'hero') && (
              <HeroEditor
                saveData={saveData}
                onChange={setSaveData}
                isZh={isZh}
              />
            )}

            {(activeSection === 'all' || activeSection === 'equipment') && (
              <EquipmentEditor
                saveData={saveData}
                onChange={setSaveData}
                isZh={isZh}
              />
            )}

            {(activeSection === 'all' || activeSection === 'inventory') && (
              <InventoryEditor
                saveData={saveData}
                onChange={setSaveData}
                isZh={isZh}
              />
            )}

            {(activeSection === 'all' || activeSection === 'dungeon') && (
              <DungeonEditor
                saveData={saveData}
                onChange={setSaveData}
                isZh={isZh}
              />
            )}

            {(activeSection === 'all' || activeSection === 'json') && (
              <RawJsonEditor
                saveData={saveData}
                onChange={setSaveData}
                isZh={isZh}
              />
            )}

            {/* Bottom Download Banner */}
            <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-900/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mt-8 shadow-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-100">
                  {isZh ? '所有修改已实时就绪' : 'All modifications ready in memory'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isZh
                    ? '点击右侧按钮下载修改后的 game.dat，并覆盖原存档目录对应文件即可。'
                    : 'Download the modified game.dat and replace your original file.'}
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="px-5 py-2 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition active:scale-95"
              >
                {isZh ? '立即下载 game.dat' : 'Download game.dat Now'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dungeon-border/80 bg-dungeon-panel py-5 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {isZh ? '开源项目 • 遵守 MIT 协议 • 专为 Shattered Pixel Dungeon 玩家打造' : 'Open Source • MIT License • Built for Shattered Pixel Dungeon'}
          </p>
          <p className="text-[11px] text-slate-600">
            {isZh ? '提示：替换存档前请务必保留原版备份。' : 'Notice: Always backup your original save file.'}
          </p>
        </div>
      </footer>
    </div>
  );
};
