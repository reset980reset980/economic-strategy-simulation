export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'victory' | 'economic' | 'survival' | 'special';
  requirement: (gameState: any) => boolean;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  hidden?: boolean; // 달성하기 전까지 숨김
}

export interface AchievementProgress {
  achievementId: string;
  unlockedAt: number; // 달성한 턴
  gameLength: number;
  faction: string;
  timestamp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // === 승리 관련 성취 ===
  {
    id: 'first_victory',
    name: '첫 승리',
    description: '첫 번째 게임에서 승리하세요',
    icon: '🎉',
    category: 'victory',
    requirement: (gameState) => !!gameState.winner && gameState.winner.includes('승리'),
    points: 100,
    rarity: 'common'
  },
  {
    id: 'quick_victory',
    name: '번개 승리',
    description: '15턴 이내에 승리하세요',
    icon: '⚡',
    category: 'victory',
    requirement: (gameState) => !!gameState.winner && gameState.winner.includes('승리') && gameState.turn <= 15,
    points: 300,
    rarity: 'epic'
  },
  {
    id: 'perfect_victory',
    name: '완벽한 승리',
    description: '모든 지표가 80% 이상일 때 승리하세요',
    icon: '👑',
    category: 'victory',
    requirement: (gameState) => {
      if (!gameState.winner || !gameState.winner.includes('승리')) return false;
      const indicators = gameState.economicIndicators;
      return indicators.gdp >= 80 && indicators.unemployment <= 10 && indicators.stockMarket >= 80;
    },
    points: 500,
    rarity: 'legendary'
  },

  // === 경제 관련 성취 ===
  {
    id: 'millionaire',
    name: '백만장자',
    description: '가계로 총 자산 1,000,000원 달성',
    icon: '💰',
    category: 'economic',
    requirement: (gameState) => {
      if (gameState.playerFaction !== 'household') return false;
      return (gameState.household.money + gameState.household.investments) >= 1000000;
    },
    points: 200,
    rarity: 'rare'
  },
  {
    id: 'market_dominator',
    name: '시장 지배자',
    description: '기업으로 시장점유율 90% 달성',
    icon: '📈',
    category: 'economic',
    requirement: (gameState) => {
      if (gameState.playerFaction !== 'business') return false;
      return gameState.business.marketShare >= 90;
    },
    points: 250,
    rarity: 'epic'
  },
  {
    id: 'beloved_government',
    name: '국민의 정부',
    description: '정부로 신뢰도 95% 달성',
    icon: '🤝',
    category: 'economic',
    requirement: (gameState) => {
      if (gameState.playerFaction !== 'government') return false;
      return gameState.government.trustRating >= 95;
    },
    points: 250,
    rarity: 'epic'
  },

  // === 생존 관련 성취 ===
  {
    id: 'crisis_survivor',
    name: '위기 생존자',
    description: '경제 위기 이벤트 중에 승리하세요',
    icon: '🛡️',
    category: 'survival',
    requirement: (gameState) => {
      if (!gameState.winner || !gameState.winner.includes('승리')) return false;
      return gameState.activeEvents.some(event => event.id === 'economic-crisis');
    },
    points: 300,
    rarity: 'epic'
  },
  {
    id: 'comeback_king',
    name: '컴백 킹',
    description: '자금이 1,000원 이하에서 다시 10,000원 이상으로 회복',
    icon: '🔄',
    category: 'survival',
    requirement: (gameState) => {
      // 이는 게임 진행 중 추적해야 함
      return false; // 나중에 구현
    },
    points: 400,
    rarity: 'legendary',
    hidden: true
  },

  // === 특별 성취 ===
  {
    id: 'chaos_master',
    name: '혼돈의 지배자',
    description: '무작위형 AI가 포함된 게임에서 승리',
    icon: '🎭',
    category: 'special',
    requirement: (gameState) => {
      // AI 성격 정보가 필요 (나중에 구현)
      return false;
    },
    points: 200,
    rarity: 'rare',
    hidden: true
  },
  {
    id: 'speed_demon',
    name: '스피드 데몬',
    description: 'AI 속도를 "즉시"로 설정하고 승리',
    icon: '💨',
    category: 'special',
    requirement: (gameState) => {
      if (!gameState.winner || !gameState.winner.includes('승리')) return false;
      return gameState.settings?.aiSpeed === 'instant';
    },
    points: 150,
    rarity: 'rare'
  },
  {
    id: 'hardmode_champion',
    name: '하드모드 챔피언',
    description: '어려움 난이도에서 승리',
    icon: '🔥',
    category: 'special',
    requirement: (gameState) => {
      if (!gameState.winner || !gameState.winner.includes('승리')) return false;
      return gameState.settings?.difficulty === 'hard';
    },
    points: 400,
    rarity: 'epic'
  },
  {
    id: 'minimalist',
    name: '미니멀리스트',
    description: '시작 자원 50%로 설정하고 승리',
    icon: '🎯',
    category: 'special',
    requirement: (gameState) => {
      if (!gameState.winner || !gameState.winner.includes('승리')) return false;
      return gameState.settings?.startingResources === 0.5;
    },
    points: 300,
    rarity: 'epic'
  },

  // === 연속 성취 ===
  {
    id: 'win_streak_3',
    name: '연승 스트릭',
    description: '연속으로 3번 승리',
    icon: '🔥',
    category: 'victory',
    requirement: () => false, // 별도 로직 필요
    points: 250,
    rarity: 'rare',
    hidden: true
  },
  {
    id: 'versatile_player',
    name: '다재다능',
    description: '3개 세력 모두로 승리 경험',
    icon: '🎪',
    category: 'victory',
    requirement: () => false, // 별도 로직 필요
    points: 500,
    rarity: 'legendary',
    hidden: true
  }
];

const ACHIEVEMENT_STORAGE_KEY = 'economicStrategy_achievements';

export function checkAchievements(gameState: any): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const currentProgress = getAchievementProgress();
  
  ACHIEVEMENTS.forEach(achievement => {
    // 이미 달성한 성취는 건너뛰기
    if (currentProgress.some(p => p.achievementId === achievement.id)) {
      return;
    }
    
    // 성취 조건 확인
    if (achievement.requirement(gameState)) {
      newlyUnlocked.push(achievement);
      
      // 성취 진행도 저장
      const progress: AchievementProgress = {
        achievementId: achievement.id,
        unlockedAt: gameState.turn,
        gameLength: gameState.settings?.gameLength || 30,
        faction: gameState.playerFaction || 'unknown',
        timestamp: Date.now()
      };
      
      saveAchievementProgress(progress);
      console.log(`🏆 성취 달성: ${achievement.name}`);
    }
  });
  
  return newlyUnlocked;
}

export function getAchievementProgress(): AchievementProgress[] {
  try {
    const saved = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveAchievementProgress(progress: AchievementProgress): void {
  try {
    const current = getAchievementProgress();
    current.push(progress);
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('성취 저장 실패:', error);
  }
}

export function getAchievementStats(): {
  totalUnlocked: number;
  totalPoints: number;
  byRarity: Record<string, number>;
  byCategory: Record<string, number>;
} {
  const progress = getAchievementProgress();
  const unlockedIds = progress.map(p => p.achievementId);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
  
  return {
    totalUnlocked: unlockedAchievements.length,
    totalPoints: unlockedAchievements.reduce((sum, a) => sum + a.points, 0),
    byRarity: unlockedAchievements.reduce((acc, a) => {
      acc[a.rarity] = (acc[a.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: unlockedAchievements.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

export function resetAchievements(): void {
  localStorage.removeItem(ACHIEVEMENT_STORAGE_KEY);
  console.log('🗑️ 모든 성취가 초기화되었습니다');
}
