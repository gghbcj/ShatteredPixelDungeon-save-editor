import React, { useState, useMemo } from 'react';
import { Package, Plus, Trash2, Search, X, Check, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { SpdSaveFile, SpdItem, CatalogItem } from '../types';
import itemsCatalog from '../data/items.json';
import { createDefaultItem } from '../utils/saveFile';

interface InventoryEditorProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

const CATEGORIES = [
  { id: 'all', labelZh: '全部', labelEn: 'All' },
  { id: 'weapon_melee', labelZh: '近战武器', labelEn: 'Melee' },
  { id: 'weapon_missiles', labelZh: '投掷/弹药', labelEn: 'Thrown' },
  { id: 'armor', labelZh: '防具护甲', labelEn: 'Armor' },
  { id: 'potion', labelZh: '药剂魔药', labelEn: 'Potions' },
  { id: 'scroll', labelZh: '卷轴符咒', labelEn: 'Scrolls' },
  { id: 'wand', labelZh: '法杖魔杖', labelEn: 'Wands' },
  { id: 'ring', labelZh: '戒指指环', labelEn: 'Rings' },
  { id: 'artifact', labelZh: '远古神器', labelEn: 'Artifacts' },
  { id: 'trinket', labelZh: '神秘饰品', labelEn: 'Trinkets' },
  { id: 'food', labelZh: '食物补给', labelEn: 'Food' },
  { id: 'seed', labelZh: '植物种子', labelEn: 'Seeds' },
  { id: 'stone', labelZh: '神秘符石', labelEn: 'Stones' },
  { id: 'bag', labelZh: '收纳容器', labelEn: 'Bags' },
  { id: 'misc', labelZh: '杂项任务', labelEn: 'Misc' },
];

export const InventoryEditor: React.FC<InventoryEditorProps> = ({ saveData, onChange, isZh }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'velvet' | 'holster' | 'bandolier' | 'scrollholder'>('main');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addQty, setAddQty] = useState<number>(1);
  const [addLevel, setAddLevel] = useState<number>(0);

  const hero = saveData.hero;
  const inventory = hero.inventory || [];

  // Find sub-containers in hero inventory
  const velvetPouch = inventory.find((i) => i.__className.includes('VelvetPouch'));
  const magicalHolster = inventory.find((i) => i.__className.includes('MagicalHolster'));
  const potionBandolier = inventory.find((i) => i.__className.includes('PotionBandolier'));
  const scrollHolder = inventory.find((i) => i.__className.includes('ScrollHolder'));

  // Get active items according to tab
  const activeItems = useMemo(() => {
    if (activeTab === 'main') {
      return inventory;
    } else if (activeTab === 'velvet') {
      return velvetPouch?.inventory || [];
    } else if (activeTab === 'holster') {
      return magicalHolster?.inventory || [];
    } else if (activeTab === 'bandolier') {
      return potionBandolier?.inventory || [];
    } else if (activeTab === 'scrollholder') {
      return scrollHolder?.inventory || [];
    }
    return [];
  }, [activeTab, inventory, velvetPouch, magicalHolster, potionBandolier, scrollHolder]);

  // Update a specific item in the currently active container
  const handleUpdateItem = (itemRef: SpdItem, patch: Partial<SpdItem>) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    const updateTargetArray = (arr: SpdItem[]) => {
      const idx = arr.findIndex((x) => x === itemRef || (x.__className === itemRef.__className && x.level === itemRef.level && x.quantity === itemRef.quantity));
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...patch };
      }
    };

    if (activeTab === 'main') {
      updateTargetArray(next.hero.inventory);
    } else if (activeTab === 'velvet') {
      const pouch = next.hero.inventory.find((i) => i.__className.includes('VelvetPouch'));
      if (pouch && pouch.inventory) updateTargetArray(pouch.inventory);
    } else if (activeTab === 'holster') {
      const holster = next.hero.inventory.find((i) => i.__className.includes('MagicalHolster'));
      if (holster && holster.inventory) updateTargetArray(holster.inventory);
    } else if (activeTab === 'bandolier') {
      const band = next.hero.inventory.find((i) => i.__className.includes('PotionBandolier'));
      if (band && band.inventory) updateTargetArray(band.inventory);
    } else if (activeTab === 'scrollholder') {
      const holder = next.hero.inventory.find((i) => i.__className.includes('ScrollHolder'));
      if (holder && holder.inventory) updateTargetArray(holder.inventory);
    }

    onChange(next);
  };

  // Safe delete
  const handleDeleteItem = (targetIndex: number) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;

    if (activeTab === 'main') {
      next.hero.inventory.splice(targetIndex, 1);
    } else if (activeTab === 'velvet') {
      const pouch = next.hero.inventory.find((i) => i.__className.includes('VelvetPouch'));
      if (pouch?.inventory) pouch.inventory.splice(targetIndex, 1);
    } else if (activeTab === 'holster') {
      const holster = next.hero.inventory.find((i) => i.__className.includes('MagicalHolster'));
      if (holster?.inventory) holster.inventory.splice(targetIndex, 1);
    } else if (activeTab === 'bandolier') {
      const band = next.hero.inventory.find((i) => i.__className.includes('PotionBandolier'));
      if (band?.inventory) band.inventory.splice(targetIndex, 1);
    } else if (activeTab === 'scrollholder') {
      const holder = next.hero.inventory.find((i) => i.__className.includes('ScrollHolder'));
      if (holder?.inventory) holder.inventory.splice(targetIndex, 1);
    }

    onChange(next);
  };

  // Add new item from modal
  const handleAddNewItem = (catalogItem: CatalogItem) => {
    const next = JSON.parse(JSON.stringify(saveData)) as SpdSaveFile;
    const newItem = createDefaultItem(catalogItem.className, {
      quantity: addQty,
      level: addLevel,
      cursed: false,
      cursedKnown: true,
      levelKnown: true,
    });

    if (activeTab === 'main') {
      next.hero.inventory = [...(next.hero.inventory || []), newItem];
    } else if (activeTab === 'velvet') {
      let pouch = next.hero.inventory.find((i) => i.__className.includes('VelvetPouch'));
      if (!pouch) {
        pouch = createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.VelvetPouch', { inventory: [] });
        next.hero.inventory.push(pouch);
      }
      if (!pouch.inventory) pouch.inventory = [];
      pouch.inventory.push(newItem);
    } else if (activeTab === 'holster') {
      let holster = next.hero.inventory.find((i) => i.__className.includes('MagicalHolster'));
      if (!holster) {
        holster = createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.MagicalHolster', { inventory: [] });
        next.hero.inventory.push(holster);
      }
      if (!holster.inventory) holster.inventory = [];
      holster.inventory.push(newItem);
    } else if (activeTab === 'bandolier') {
      let band = next.hero.inventory.find((i) => i.__className.includes('PotionBandolier'));
      if (!band) {
        band = createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.PotionBandolier', { inventory: [] });
        next.hero.inventory.push(band);
      }
      if (!band.inventory) band.inventory = [];
      band.inventory.push(newItem);
    } else if (activeTab === 'scrollholder') {
      let holder = next.hero.inventory.find((i) => i.__className.includes('ScrollHolder'));
      if (!holder) {
        holder = createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.bags.ScrollHolder', { inventory: [] });
        next.hero.inventory.push(holder);
      }
      if (!holder.inventory) holder.inventory = [];
      holder.inventory.push(newItem);
    }

    onChange(next);
    setShowAddModal(false);
  };

  // Filter catalog items
  const filteredCatalog = useMemo(() => {
    return (itemsCatalog as CatalogItem[]).filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.nameZh.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.simpleName.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const getItemDisplayName = (className: string) => {
    const found = (itemsCatalog as CatalogItem[]).find((i) => i.className === className);
    if (found) return isZh ? found.nameZh : found.nameEn;
    return className.split('.').pop() || className;
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-5 shadow-lg mb-6">
      {/* Title & Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-dungeon-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            {isZh ? '背包与收纳袋道具管理 (Inventory & Bags)' : 'Inventory & Bags'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {activeItems.length} {isZh ? '件' : 'items'}
          </span>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setAddQty(1);
            setAddLevel(0);
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {isZh ? '添加任意物品 (全图鉴)' : 'Add Any Item'}
        </button>
      </div>

      {/* Bag Tabs */}
      <div className="flex items-center gap-1.5 mb-4 border-b border-dungeon-border pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('main')}
          className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap ${
            activeTab === 'main'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card'
          }`}
        >
          🎒 {isZh ? '主背包 (Backpack)' : 'Main Backpack'} ({inventory.length})
        </button>

        <button
          onClick={() => setActiveTab('velvet')}
          className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap ${
            activeTab === 'velvet'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card'
          }`}
        >
          🌱 {isZh ? '天鹅绒种子袋' : 'Velvet Pouch'} ({velvetPouch?.inventory?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('holster')}
          className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap ${
            activeTab === 'holster'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card'
          }`}
        >
          ⚡ {isZh ? '魔法秘药/弹药袋' : 'Magical Holster'} ({magicalHolster?.inventory?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('bandolier')}
          className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap ${
            activeTab === 'bandolier'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card'
          }`}
        >
          🧪 {isZh ? '魔药腰带' : 'Potion Bandolier'} ({potionBandolier?.inventory?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('scrollholder')}
          className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap ${
            activeTab === 'scrollholder'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dungeon-card'
          }`}
        >
          📜 {isZh ? '卷轴夹' : 'Scroll Holder'} ({scrollHolder?.inventory?.length || 0})
        </button>
      </div>

      {/* Items List Table */}
      {activeItems.length === 0 ? (
        <div className="text-center py-10 bg-dungeon-card/50 rounded-xl border border-dashed border-dungeon-border text-slate-500 text-sm">
          {isZh ? '此容器中当前没有物品，点击上方 "+ 添加任意物品" 可自由放入。' : 'This container is empty. Click "+ Add Any Item" to add items.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dungeon-border text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">{isZh ? '物品名称 (Item)' : 'Item'}</th>
                <th className="py-2.5 px-2 w-28 text-center">{isZh ? '数量 (Qty)' : 'Quantity'}</th>
                <th className="py-2.5 px-2 w-28 text-center">{isZh ? '强化等级' : 'Level'}</th>
                <th className="py-2.5 px-2 w-28 text-center">{isZh ? '状态' : 'Status'}</th>
                <th className="py-2.5 px-2 w-16 text-center">{isZh ? '操作' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dungeon-border/60">
              {activeItems.map((item, idx) => {
                const displayName = getItemDisplayName(item.__className);
                const hasSubInv = item.inventory && Array.isArray(item.inventory);

                return (
                  <tr key={`${item.__className}-${idx}`} className="hover:bg-dungeon-card/60 transition group">
                    {/* Item Name & Details */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">
                          {displayName}
                        </span>
                        {hasSubInv && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                            {isZh ? `收纳袋 (${item.inventory?.length || 0})` : `Container (${item.inventory?.length || 0})`}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-sm" title={item.__className}>
                        {item.__className}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateItem(item, { quantity: Math.max(1, (item.quantity || 1) - 1) })}
                          className="w-5 h-5 bg-dungeon-card hover:bg-slate-700 text-slate-300 rounded border border-dungeon-border flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={item.quantity ?? 1}
                          onChange={(e) => handleUpdateItem(item, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-14 bg-dungeon-card border border-dungeon-border rounded px-1 py-0.5 text-center font-semibold text-slate-100 text-xs"
                        />
                        <button
                          onClick={() => handleUpdateItem(item, { quantity: (item.quantity || 1) + 1 })}
                          className="w-5 h-5 bg-dungeon-card hover:bg-slate-700 text-slate-300 rounded border border-dungeon-border flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={item.level ?? 0}
                          onChange={(e) => handleUpdateItem(item, { level: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-12 bg-dungeon-card border border-dungeon-border rounded px-1 py-0.5 text-center font-semibold text-amber-300 text-xs"
                        />
                        <button
                          onClick={() => handleUpdateItem(item, { level: 10 })}
                          className="px-1 py-0.5 text-[10px] bg-dungeon-card hover:bg-slate-700 text-amber-400 rounded border border-dungeon-border"
                          title="设为 +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Cursed Checkbox */}
                    <td className="py-2.5 px-2 text-center">
                      <label className="inline-flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!item.cursed}
                          onChange={(e) => handleUpdateItem(item, { cursed: !e.target.checked, cursedKnown: true })}
                          className="rounded bg-dungeon-card border-dungeon-border text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className={`text-[11px] ${item.cursed ? 'text-red-400 font-medium' : 'text-emerald-400'}`}>
                          {item.cursed ? (isZh ? '诅咒' : 'Cursed') : (isZh ? '纯净' : 'Clean')}
                        </span>
                      </label>
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition"
                        title={isZh ? '删除此道具' : 'Delete item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dungeon-panel border border-dungeon-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-dungeon-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {isZh ? '从全图鉴中添加物品' : 'Add Item from Catalog'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isZh ? '已收录官方全部 370+ 件道具，支持中文/英文双语实时搜索。' : 'Covers all 370+ official items. Bilingual search supported.'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-dungeon-card"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter & Search Bar */}
            <div className="p-4 border-b border-dungeon-border bg-dungeon-card/60 space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={isZh ? '搜索道具名称（如：升级卷轴 / 巨剑 / 触媒 / 力量...）' : 'Search item (e.g., Greatsword, Upgrade, Catalyst...)'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dungeon-panel border border-dungeon-border rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition font-medium ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-dungeon-panel text-slate-400 hover:text-slate-200 border border-dungeon-border'
                    }`}
                  >
                    {isZh ? cat.labelZh : cat.labelEn}
                  </button>
                ))}
              </div>

              {/* Preset Quantity & Level */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{isZh ? '预设数量:' : 'Initial Qty:'}</span>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={addQty}
                    onChange={(e) => setAddQty(parseInt(e.target.value) || 1)}
                    className="w-16 bg-dungeon-panel border border-dungeon-border rounded px-2 py-1 text-xs font-semibold text-slate-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{isZh ? '初始等级:' : 'Initial Level:'}</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={addLevel}
                    onChange={(e) => setAddLevel(parseInt(e.target.value) || 0)}
                    className="w-16 bg-dungeon-panel border border-dungeon-border rounded px-2 py-1 text-xs font-semibold text-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Catalog List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-dungeon-border/60">
              {filteredCatalog.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  {isZh ? '未找到符合条件的道具，请尝试其他关键词。' : 'No items match your search query.'}
                </div>
              ) : (
                filteredCatalog.map((item) => (
                  <div
                    key={item.className}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-dungeon-card/60 px-3 rounded-lg transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">
                          {isZh ? item.nameZh : item.nameEn}
                        </span>
                        <span className="text-xs text-slate-400 font-sans">
                          ({item.nameEn})
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.className}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddNewItem(item)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow transition active:scale-95 whitespace-nowrap"
                    >
                      {isZh ? '+ 添加' : '+ Add'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
