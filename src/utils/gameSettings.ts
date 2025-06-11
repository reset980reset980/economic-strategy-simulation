export interface GameSettings {
  gameLength: 15 | 30 | 45;
  difficulty: 'easy' | 'normal' | 'hard';
  startingResources: 0.5 | 1.0 | 1.5;
  aiSpeed: 'slow' | 'normal' | 'fast' | 'instant';
}

export const DEFAULT_SETTINGS: GameSettings = {
  gameLength: 30,
  difficulty: 'normal',
  startingResources: 1.0,
  aiSpeed: 'normal'
};

export const AI_SPEED_VALUES = {
  slow: 2000,
  normal: 1500,
  fast: 500,
  instant: 0
} as const;

export const DIFFICULTY_MULTIPLIERS = {
  easy: {
    playerBonus: 1.5,
    aiEfficiency: 0.7,
    victoryRequirement: 0.8
  },
  normal: {
    playerBonus: 1.0,
    aiEfficiency: 1.0,
    victoryRequirement: 1.0
  },
  hard: {
    playerBonus: 0.8,
    aiEfficiency: 1.3,
    victoryRequirement: 1.2
  }
} as const;

export const STARTING_RESOURCES_MULTIPLIERS = {
  0.5: 0.5,  // 50% 자원으로 시작
  1.0: 1.0,  // 기본 자원
  1.5: 1.5   // 150% 자원으로 시작
} as const;

const SETTINGS_KEY = 'economicStrategy_settings';

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('설정 불러오기 실패:', error);
  }
  return DEFAULT_SETTINGS;
}
