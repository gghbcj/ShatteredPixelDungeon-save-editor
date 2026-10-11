#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import pako from 'pako';

const appData = process.env.APPDATA || path.join(process.env.HOME || '', '.local', 'share');
const baseDir = path.join(appData, '.shatteredpixel', 'Shattered Pixel Dungeon');

console.log('=== Shattered Pixel Dungeon 本地存档快速助手 ===\n');

if (!fs.existsSync(baseDir)) {
  console.error(`未在默认路径找到游戏目录: ${baseDir}`);
  process.exit(1);
}

// List all existing game slots
const gameSlots = fs.readdirSync(baseDir).filter(f => f.startsWith('game') && fs.statSync(path.join(baseDir, f)).isDirectory());

if (gameSlots.length === 0) {
  console.log('未检测到任何正在进行的游戏存档槽位 (game1, game2 等)。');
  process.exit(0);
}

console.log(`检测到可用游戏槽位: ${gameSlots.join(', ')}`);

const targetSlot = process.argv[2] || gameSlots[0];
const targetSavePath = path.join(baseDir, targetSlot, 'game.dat');

if (!fs.existsSync(targetSavePath)) {
  console.error(`槽位 ${targetSlot} 下未找到 game.dat`);
  process.exit(1);
}

console.log(`正在读取槽位: ${targetSlot} -> ${targetSavePath}`);

// 1. Read and parse
const buf = fs.readFileSync(targetSavePath);
const decompressed = pako.ungzip(buf);
const save = JSON.parse(new TextDecoder('utf-8').decode(decompressed));

console.log(`[当前状态] 版本: ${save.version} | 职业: ${save.hero.class} | 生命: ${save.hero.HP}/${save.hero.HT} | 金币: ${save.gold}`);

// 2. Backup
const backupPath = targetSavePath + `.${Date.now()}.bak`;
fs.copyFileSync(targetSavePath, backupPath);
console.log(`[自动备份] 已备份原存档至: ${backupPath}`);

// 3. Apply basic enhancements
save.gold = Math.max(save.gold || 0, 99999);
save.energy = Math.max(save.energy || 0, 999);
save.hero.HP = save.hero.HT;
save.hero.htboost = 50;
save.hero.STR = Math.max(save.hero.STR, 20);

// Identify all items & global knowledges
Object.keys(save).forEach(k => {
  if (k.endsWith('_known')) save[k] = true;
});

// Add 10 Upgrade Scrolls if not having too many
save.hero.inventory.push({
  __className: 'com.shatteredpixel.shatteredpixeldungeon.items.scrolls.ScrollOfUpgrade',
  quantity: 10,
  level: 0,
  cursed: false,
  cursedKnown: true,
  levelKnown: true,
  kept_lost: false,
  uses_left_to_id: 20,
  augment: 'NONE'
});

// Add 5 Healing Potions
save.hero.inventory.push({
  __className: 'com.shatteredpixel.shatteredpixeldungeon.items.potions.PotionOfHealing',
  quantity: 5,
  level: 0,
  cursed: false,
  cursedKnown: true,
  levelKnown: true,
  kept_lost: false,
  augment: 'NONE'
});

// 4. Save
const modifiedJson = JSON.stringify(save);
const recompressed = pako.gzip(modifiedJson);
fs.writeFileSync(targetSavePath, Buffer.from(recompressed));

console.log(`\n🎉 修改成功并写回！`);
console.log(`[修改后状态] 金币: ${save.gold} | 生命: ${save.hero.HP}/${save.hero.HT} (+50护盾) | 力量: ${save.hero.STR}`);
console.log(`[背包奖励] +10 升级卷轴, +5 治疗药水，全图鉴鉴定已开启！`);
console.log(`现在即可进入游戏继续冒险！`);
