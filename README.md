# 🗡️ Shattered Pixel Dungeon - Save Editor (Remake)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Supported Game Version](https://img.shields.io/badge/SPD%20Version-v4.0.2%20(Code%20922%2B)-blue.svg)](https://github.com/00-Evan/shattered-pixel-dungeon)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)

[**简体中文**](#简体中文) | [**English**](#english)

---

<a name="简体中文"></a>
## 📖 简介

本修改器是针对知名开源 Rogue-like 地牢探险游戏 **《破碎的像素地牢》(Shattered Pixel Dungeon)** 的现代化网页版存档修改器。

本项目参考`spud`、`spd-save-editor`优秀项目的灵感，基于官方最新游戏(v4.0.2)源码进行了全面重构。
//臣服一些AI神迹<img width="1214" height="1214" alt="371d0cf59e448721459fc9d178cd1d95" src="https://github.com/user-attachments/assets/9ede1c6a-ac03-49d4-9060-b2bed43674b2" />

### ✨ 核心特性

- 🛡️ **纯客户端运行与安全防坏档**：
  - 100% 在用户浏览器本地完成 Gzip 解压与序列化，绝不上传任何服务器。
  - 严格保持游戏 Java `Bundle` 序列化结构，彻底修复原先导出时插入非法空格导致的坏档 Bug。
- 📚 **全官方最新图鉴（370+ 件道具双语支持）**：
  - 直接从最新游戏源码中提取完整道具库，涵盖近战武器、弹药、护甲、药剂、卷轴、魔杖、戒指、远古神器、饰品（Trinkets）、食物、种子与符石。
  - 支持**中文/英文双语实时模糊搜索**与分类筛选。
- ⚡ **一键快捷修改 (神装与保命)**：
  - 一键回满生命值并附加 50 点临时护盾。
  - 99999 金币与 999 炼金能量拉满。
  - 力量属性一键拉满、等级直升 30 级。
  - **一键全图鉴鉴定**：自动识破所有药水、卷轴、戒指效果及背包全部物品。
  - **一键赠送神装物资大礼包**（15张升级卷轴、10瓶治疗药剂、5瓶力量药水、重生十字架等）。
- 👤 **全职业与转职支持**：
  - 完整支持所有 6 大职业：**战士、法师、盗贼、女猎手、女斗士 (Duelist)、神职人员 (Cleric)**。
  - 支持全部进阶转职与专精选择。
  - 支持天赋树点数（Tier 1 - 4）自由调节。
- ⚔️ **全装备槽位深度定制**：
  - 主手武器、副手武器（女斗士双持）、护甲防具、戒指、神器、饰品。
  - 自定义强化等级（+0 ~ +99，支持一键 +10）。
  - 支持所有 17 种武器附魔、10 种武器诅咒、13 种防具印记、8 种防具诅咒及强化偏向（重量/速度/防御/闪避）。
- 🎒 **完整背包与子容器收纳袋管理**：
  - 主背包（Backpack）、天鹅绒种子袋（Velvet Pouch）、魔法秘药袋（Magical Holster）、魔药腰带（Potion Bandolier）、卷轴夹（Scroll Holder）。
  - 支持数量随意增减、安全删除（无索引错位）、一键将任意道具放入指定收纳袋。
- 💻 **原始 JSON 编辑器**：内置 JSON 语法高亮校验与一键复制应用，满足高级玩家深度折腾需求。
- 🚀 **GitHub Pages 一键部署**：内置 GitHub Actions 工作流，Fork 或推送到仓库后全自动上线！

---

## 🎮 游戏存档位置

在游戏中开始冒险后，游戏会自动保存为 `game.dat`：

- **Windows**:
  ```text
  %APPDATA%\.shatteredpixel\Shattered Pixel Dungeon\game1\game.dat
  ```
  *(通常位于 `C:\Users\<你的用户名>\AppData\Roaming\.shatteredpixel\Shattered Pixel Dungeon\game1\game.dat`)*
- **Android**:
  ```text
  /data/data/com.shatteredpixel.shatteredpixeldungeon/files/game1/game.dat
  ```
  *(注：Android 访问该目录需要 Root 或 Shizuku / MT 管理器授权)*
- **Linux**:
  ```text
  ~/.local/share/.shatteredpixel/shattered-pixel-dungeon/game1/game.dat
  ```
- **macOS**:
  ```text
  ~/Library/Application Support/Shattered Pixel Dungeon/game1/game.dat
  ```

> ⚠️ **强烈建议**：在用任何修改器覆盖前，请先将原版 `game.dat` 复制一份命名为 `game.dat.bak` 进行备份！

---

## 🛠️ 本地运行与开发

本修改器基于 **Node.js + Vite + React + TypeScript + Tailwind CSS** 构建。

### 1. 克隆仓库与安装依赖
```bash
git clone https://github.com/gghbcj/ShatteredPixelDungeon-save-editor.git
cd ShatteredPixelDungeon-save-editor
npm install
```

### 2. 本地启动开发服务器
```bash
npm run dev
```
启动后终端会显示本地访问链接（通常为 `http://localhost:5173`），在浏览器中打开即可开始使用！

### 3. 构建静态网页 (生产环境)
```bash
npm run build
```
生成的纯静态网页位于 `dist` 目录，可部署在任何静态托管服务（GitHub Pages, Cloudflare Pages, Vercel 等）。

---

## ⚡ Windows 本地一键修改脚本 (可选)

如果你在 Windows PC 上游玩，本仓库还贴心提供了一个离线脚本 `local_mod.mjs`，可自动寻找你的本地存档目录、自动创建带时间戳的 `.bak` 备份并一键注入启动物资：

```bash
# 修改第 1 槽位存档 (game1)
node local_mod.mjs game1

# 修改第 2 槽位存档 (game2)
node local_mod.mjs game2
```

---

<a name="english"></a>
## 📖 English Introduction

A modern, robust, web-based save editor for **Shattered Pixel Dungeon** (SPD v4.0.2 / Code 922+).

Based on spud and spd-save-editor, this project is a complete remake built with modern technologies, guaranteeing zero-corruption saves and a rich UI.

### Features
- **100% In-Browser Execution**: All Gzip and JSON decoding/encoding happens locally on your computer.
- **Full Item Catalog**: Over 370+ official items extracted directly from current game assets, with full bilingual English & Chinese support.
- **Quick Cheats**: 1-click Max Health, 99999 Gold, Max Strength, Level 30, and Supply Bundles.
- **Full Hero Support**: All 6 classes including Duelist & Cleric, subclasses, talents (tiers 1-4).
- **Equipment & Enchants**: Weapon enchants, armor glyphs, curses, and augments.
- **Bag Management**: Sub-inventory containers (Velvet Pouch, Magical Holster, Bandolier, Scroll Holder).
- **Raw JSON Editor**: Live validation and editing for power users.
- **GitHub Pages Ready**: Integrated GitHub Actions CI/CD.

---

## 📄 开源许可 (License)

本项目基于 [MIT 协议](LICENSE) 开源发布。
致谢开源游戏原作 [Shattered Pixel Dungeon](https://github.com/00-Evan/shattered-pixel-dungeon) 及Evan。
