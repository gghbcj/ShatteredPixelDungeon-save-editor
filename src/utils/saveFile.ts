import pako from 'pako';
import { SpdSaveFile, SpdItem } from '../types';

/**
 * Decompresses and parses a .dat save file.
 * Gracefully handles both standard gzipped .dat files and raw JSON files.
 */
export function parseSaveFile(buffer: ArrayBuffer): { data: SpdSaveFile; rawJson: string } {
  const uint8 = new Uint8Array(buffer);
  let rawJson = '';

  try {
    // Try gzipped first (standard SPD format)
    const decompressed = pako.ungzip(uint8);
    rawJson = new TextDecoder('utf-8').decode(decompressed);
  } catch (gzipErr) {
    // Fallback: check if it's already plain UTF-8 JSON text
    try {
      rawJson = new TextDecoder('utf-8').decode(uint8);
    } catch {
      throw new Error('无法解压或读取该存档文件，请确认是否为 Shattered Pixel Dungeon 的 game.dat');
    }
  }

  try {
    const data = JSON.parse(rawJson) as SpdSaveFile;
    if (!data.hero) {
      throw new Error('存档文件缺少英雄 (hero) 数据，可能是无效或损坏的存档。');
    }
    return { data, rawJson };
  } catch (err: any) {
    throw new Error('解析存档 JSON 失败: ' + err.message);
  }
}

/**
 * Serializes and compresses save data into a valid game.dat Uint8Array.
 */
export function compressSaveFile(data: SpdSaveFile): Uint8Array {
  // Deep clone to avoid mutating in-place during sanitization
  const cleanData = JSON.parse(JSON.stringify(data));

  // Ensure hero.class does not have stray whitespace
  if (cleanData.hero && typeof cleanData.hero.class === 'string') {
    cleanData.hero.class = cleanData.hero.class.trim();
  }

  const jsonStr = JSON.stringify(cleanData);
  return pako.gzip(jsonStr);
}

/**
 * Triggers a browser download of the compressed game.dat file.
 */
export function downloadSaveFile(data: SpdSaveFile, filename: string = 'game.dat') {
  const compressed = compressSaveFile(data);
  const blob = new Blob([compressed as any], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a fully-initialized new item object compatible with SPD 4.0.2 / 922.
 */
export function createDefaultItem(className: string, extra: Partial<SpdItem> = {}): SpdItem {
  const isWeapon = className.includes('.weapon.');
  const isArmor = className.includes('.armor.');
  const isWand = className.includes('.wands.');
  const isStackable = className.includes('.potions.') || 
                      className.includes('.scrolls.') || 
                      className.includes('.food.') || 
                      className.includes('.stones.') ||
                      className.includes('.seed') ||
                      className.includes('Dewdrop') ||
                      className.includes('EnergyCrystal');

  const baseItem: SpdItem = {
    __className: className,
    quantity: extra.quantity ?? (isStackable ? 1 : 1),
    level: extra.level ?? 0,
    cursed: extra.cursed ?? false,
    cursedKnown: true,
    levelKnown: true,
    kept_lost: false,
    ...extra
  };

  if (isWeapon || isArmor || isWand) {
    baseItem.uses_left_to_id = 20;
    baseItem.available_uses = 10;
    baseItem.curse_infusion_bonus = false;
    baseItem.mastery_potion_bonus = false;
    baseItem.augment = 'NONE';
  }

  if (isWeapon) {
    baseItem.enchant_hardened = false;
  }
  if (isArmor) {
    baseItem.glyph_hardened = false;
  }

  return baseItem;
}

/**
 * 1-click Identification:
 * Discovers all potions, scrolls, rings and identifies all items in hero inventory & bags.
 */
export function identifyAllKnowledge(save: SpdSaveFile): SpdSaveFile {
  const next = JSON.parse(JSON.stringify(save)) as SpdSaveFile;

  // Mark all knowledge flags in root save
  Object.keys(next).forEach((key) => {
    if (key.endsWith('_known') || key.endsWith('_label')) {
      if (key.endsWith('_known')) next[key] = true;
    }
  });

  function identifyItem(item: SpdItem) {
    item.cursedKnown = true;
    item.levelKnown = true;
    if (item.curChargeKnown !== undefined) item.curChargeKnown = true;
    if (item.inventory && Array.isArray(item.inventory)) {
      item.inventory.forEach(identifyItem);
    }
  }

  if (next.hero.weapon) identifyItem(next.hero.weapon);
  if (next.hero.armor) identifyItem(next.hero.armor);
  if (next.hero.ring) identifyItem(next.hero.ring);
  if (next.hero.artifact) identifyItem(next.hero.artifact);
  if (next.hero.misc) identifyItem(next.hero.misc);
  if (next.hero.secondWep) identifyItem(next.hero.secondWep);

  if (Array.isArray(next.hero.inventory)) {
    next.hero.inventory.forEach(identifyItem);
  }

  return next;
}

/**
 * Injects beginner god starter pack into backpack (Upgrade scrolls, Health potions, Ankh, Meat).
 */
export function addGodPack(save: SpdSaveFile): SpdSaveFile {
  const next = JSON.parse(JSON.stringify(save)) as SpdSaveFile;
  const packItems: SpdItem[] = [
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.scrolls.ScrollOfUpgrade', { quantity: 15 }),
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.potions.PotionOfHealing', { quantity: 10 }),
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.potions.PotionOfStrength', { quantity: 5 }),
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.Ankh', { quantity: 2 }),
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.food.Pasty', { quantity: 5 }),
    createDefaultItem('com.shatteredpixel.shatteredpixeldungeon.items.potions.PotionOfExperience', { quantity: 5 }),
  ];

  next.hero.inventory = [...(next.hero.inventory || []), ...packItems];
  return next;
}
