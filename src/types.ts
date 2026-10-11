export type HeroClassType = 
  | 'WARRIOR' 
  | 'MAGE' 
  | 'ROGUE' 
  | 'HUNTRESS' 
  | 'DUELIST' 
  | 'CLERIC';

export type HeroSubClassType = 
  | 'NONE'
  | 'BERSERKER' | 'GLADIATOR'
  | 'BATTLEMAGE' | 'WARLOCK'
  | 'ASSASSIN' | 'FREERUNNER'
  | 'SNIPER' | 'WARDEN'
  | 'CHAMPION' | 'MONK'
  | 'PRIEST' | 'PALADIN';

export interface SpdItem {
  __className: string;
  level?: number;
  quantity?: number;
  cursed?: boolean;
  cursedKnown?: boolean;
  levelKnown?: boolean;
  kept_lost?: boolean;
  uses_left_to_id?: number;
  available_uses?: number;
  curse_infusion_bonus?: boolean;
  mastery_potion_bonus?: boolean;
  enchant_hardened?: boolean;
  glyph_hardened?: boolean;
  augment?: 'NONE' | 'DAMAGE' | 'SPEED' | 'DEFENSE' | 'EVASION';
  enchantment?: { __className: string } | null;
  glyph?: { __className: string } | null;
  curse?: { __className: string } | null;
  inventory?: SpdItem[];
  [key: string]: any;
}

export interface SpdHero {
  __className: string;
  class: HeroClassType;
  subClass: HeroSubClassType;
  HP: number;
  HT: number;
  htboost: number;
  STR: number;
  lvl: number;
  exp: number;
  attackSkill: number;
  defenseSkill: number;
  weapon?: SpdItem | null;
  armor?: SpdItem | null;
  ring?: SpdItem | null;
  artifact?: SpdItem | null;
  misc?: SpdItem | null;
  secondWep?: SpdItem | null;
  inventory: SpdItem[];
  talents_tier_1?: Record<string, number>;
  talents_tier_2?: Record<string, number>;
  talents_tier_3?: Record<string, number>;
  talents_tier_4?: Record<string, number>;
  buffs?: any[];
  [key: string]: any;
}

export interface SpdSaveFile {
  version: number;
  seed: string;
  depth: number;
  gold: number;
  energy: number;
  amuletObtained?: boolean;
  hero: SpdHero;
  [key: string]: any;
}

export interface CatalogItem {
  className: string;
  simpleName: string;
  category: string;
  nameEn: string;
  nameZh: string;
}
