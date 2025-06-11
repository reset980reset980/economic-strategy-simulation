import { GameState, GameEvent, Household, Business, Government, PlayerType } from '../types/GameTypes';
import { GameSettings, DIFFICULTY_MULTIPLIERS, STARTING_RESOURCES_MULTIPLIERS } from './gameSettings';

export const INITIAL_GAME_STATE: GameState = {
  turn: 1,
  currentPlayer: 'household',
  household: {
    id: 'household-1',
    name: '김씨 가문',
    money: 5000,
    happiness: 70,
    familySize: 4,
    job: '회사원',
    skills: 50,
    investments: 1000,
    heroes: [
      {
        id: 'h1',
        name: '김가장',
        level: 1,
        experience: 0,
        specialty: '투자',
        bonus: 10,
        portrait: '👨‍💼',
        skills: ['투자', '절약'],
        rarity: 'common'
      }
    ],
    maxActions: 2,
    actionsUsed: 0,
    buildings: [],
    technologies: [],
    reputation: 50,
    isPlayer: false,
    aiPersonality: 'balanced'
  },
  business: {
    id: 'business-1',
    name: '혁신기업 코퍼레이션',
    capital: 50000,
    employees: 20,
    marketShare: 15,
    brandRecognition: 30,
    productivity: 60,
    technology: 40,
    heroes: [
      {
        id: 'b1',
        name: '이사장',
        level: 1,
        experience: 0,
        specialty: '경영',
        bonus: 15,
        portrait: '👩‍💼',
        skills: ['경영', '마케팅'],
        rarity: 'common'
      }
    ],
    maxActions: 3,
    actionsUsed: 0,
    buildings: [],
    technologies: [],
    reputation: 50,
    isPlayer: false,
    aiPersonality: 'aggressive'
  },
  government: {
    id: 'government-1',
    name: '대한민국 정부',
    budget: 100000,
    trustRating: 50,
    infrastructure: 60,
    welfare: 40,
    diplomacy: 50,
    policies: [],
    heroes: [
      {
        id: 'g1',
        name: '행정관',
        level: 1,
        experience: 0,
        specialty: '정책',
        bonus: 12,
        portrait: '🏛️',
        skills: ['정책', '외교'],
        rarity: 'common'
      }
    ],
    maxActions: 3,
    actionsUsed: 0,
    buildings: [],
    technologies: [],
    reputation: 50,
    isPlayer: false,
    aiPersonality: 'conservative'
  },
  activeEvents: [],
  gameLog: ['게임이 시작되었습니다!'],
  winner: null,
  playerFaction: null,
  gamePhase: 'setup',
  economicIndicators: {
    gdp: 100,
    inflation: 2.5,
    unemployment: 8,
    stockMarket: 100
  }
};

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'economic-crisis',
    name: '경제 위기',
    description: '글로벌 경제 위기가 발생했습니다.',
    effects: {
      household: { money: -1000, happiness: -10 },
      business: { capital: -5000, marketShare: -5 },
      government: { budget: -10000, trustRating: -15 }
    },
    probability: 0.1,
    duration: 3,
    choices: [
      {
        id: 'emergency-fund',
        text: '비상 자금 사용',
        effects: { money: 2000 }
      },
      {
        id: 'wait-it-out',
        text: '상황 지켜보기',
        effects: { happiness: -5 }
      }
    ]
  },
  {
    id: 'tech-boom',
    name: '기술 혁신',
    description: '새로운 기술 혁신이 일어났습니다.',
    effects: {
      business: { technology: 20, productivity: 15 },
      government: { infrastructure: 10 }
    },
    probability: 0.15,
    duration: 2
  },
  {
    id: 'natural-disaster',
    name: '자연재해',
    description: '대규모 자연재해가 발생했습니다.',
    effects: {
      household: { money: -500, happiness: -20 },
      business: { capital: -3000, productivity: -10 },
      government: { budget: -15000, infrastructure: -15 }
    },
    probability: 0.08,
    duration: 4
  },
  {
    id: 'market-boom',
    name: '시장 호황',
    description: '경제가 급성장하고 있습니다.',
    effects: {
      household: { money: 1500, investments: 2000 },
      business: { capital: 8000, marketShare: 8 },
      government: { budget: 12000 }
    },
    probability: 0.12,
    duration: 2
  },
  {
    id: 'political-scandal',
    name: '정치 스캔들',
    description: '정부에 대한 신뢰가 크게 흔들리고 있습니다.',
    effects: {
      government: { trustRating: -25, budget: -5000 },
      household: { happiness: -15 }
    },
    probability: 0.1,
    duration: 3
  }
];

export function calculateVictoryConditions(gameState: GameState, settings?: GameSettings): string | null {
  const { household, business, government, turn, playerFaction } = gameState;
  
  // 난이도 설정이 있으면 승리 조건 조정
  const difficultyMultiplier = settings ? DIFFICULTY_MULTIPLIERS[settings.difficulty].victoryRequirement : 1.0;
  const maxTurns = settings ? settings.gameLength : 30;
  
  // 턴 제한
  if (turn >= maxTurns) {
    return calculateFinalWinner(gameState, settings);
  }
  
  // 즉시 승리 조건 체크 (난이도 적용)
  if (playerFaction === 'household') {
    const requiredMoney = Math.floor(100000 * difficultyMultiplier);
    const requiredHappiness = Math.floor(90 * difficultyMultiplier);
    
    if (household.money + household.investments >= requiredMoney && household.happiness >= requiredHappiness) {
      return '🏆 가계 승리: 풍요로운 삶을 달성했습니다!';
    }
    if (household.money <= 0 || household.happiness <= 10) {
      return '💀 가계 패배: 파산하거나 절망에 빠졌습니다.';
    }
  }
  
  if (playerFaction === 'business') {
    const requiredMarketShare = Math.floor(70 * difficultyMultiplier);
    const requiredCapital = Math.floor(500000 * difficultyMultiplier);
    
    if (business.marketShare >= requiredMarketShare && business.capital >= requiredCapital) {
      return '🏆 기업 승리: 시장을 완전히 장악했습니다!';
    }
    if (business.capital <= 0 || business.marketShare <= 5) {
      return '💀 기업 패배: 파산하거나 시장에서 퇴출되었습니다.';
    }
  }
  
  if (playerFaction === 'government') {
    const requiredTrust = Math.floor(85 * difficultyMultiplier);
    const requiredInfra = Math.floor(95 * difficultyMultiplier);
    
    if (government.trustRating >= requiredTrust && government.infrastructure >= requiredInfra) {
      return '🏆 정부 승리: 이상적인 국가를 건설했습니다!';
    }
    if (government.trustRating <= 15 || government.budget <= 0) {
      return '💀 정부 패배: 신뢰를 잃거나 재정이 파탄났습니다.';
    }
  }
  
  return null;
}

function calculateFinalWinner(gameState: GameState, settings?: GameSettings): string {
  const { household, business, government, playerFaction } = gameState;
  
  // 난이도 설정이 있으면 점수 가중치 적용
  const difficultyBonus = settings ? DIFFICULTY_MULTIPLIERS[settings.difficulty].playerBonus : 1.0;
  
  // 각 세력의 점수 계산
  let householdScore = (household.money + household.investments) / 1000 + household.happiness;
  let businessScore = business.capital / 1000 + business.marketShare * 10 + business.technology;
  let governmentScore = government.budget / 1000 + government.trustRating + government.infrastructure;
  
  // 플레이어 세력에게 난이도 보너스 적용
  if (playerFaction === 'household') householdScore *= difficultyBonus;
  if (playerFaction === 'business') businessScore *= difficultyBonus;
  if (playerFaction === 'government') governmentScore *= difficultyBonus;
  
  const scores = [
    { faction: 'household', score: householdScore, name: '가계' },
    { faction: 'business', score: businessScore, name: '기업' },
    { faction: 'government', score: governmentScore, name: '정부' }
  ];
  
  scores.sort((a, b) => b.score - a.score);
  
  const winner = scores[0];
  const isPlayerWinner = winner.faction === playerFaction;
  
  return `${isPlayerWinner ? '🏆' : '😞'} ${winner.name} 승리! (${winner.score.toFixed(1)}점)`;
}

export function updateEconomicIndicators(gameState: GameState): GameState {
  const newState = { ...gameState };
  
  // GDP 계산 (모든 세력의 경제 활동 합계)
  const totalEconomicActivity = 
    gameState.household.money + gameState.household.investments +
    gameState.business.capital + 
    gameState.government.budget;
  
  newState.economicIndicators.gdp = Math.max(50, Math.min(150, totalEconomicActivity / 2000));
  
  // 실업률 계산
  const maxEmployment = gameState.business.employees + 10; // 기본 고용 + 기업 고용
  const targetEmployment = gameState.household.familySize * 0.6; // 가족 중 60%가 취업 대상
  newState.economicIndicators.unemployment = Math.max(0, Math.min(30, 
    ((targetEmployment - maxEmployment) / targetEmployment) * 100
  ));
  
  // 인플레이션 (정부 예산과 시장 상황에 따라)
  const inflationFactor = (gameState.government.budget / 100000) + (gameState.business.marketShare / 100);
  newState.economicIndicators.inflation = Math.max(0, Math.min(10, inflationFactor * 3));
  
  // 주식 시장 (기업 성과와 경제 상황에 따라)
  const marketFactor = (gameState.business.technology + gameState.business.productivity) / 2;
  newState.economicIndicators.stockMarket = Math.max(30, Math.min(200, marketFactor + Math.random() * 20 - 10));
  
  return newState;
}

export function processRandomEvents(gameState: GameState): GameState {
  const newState = { ...gameState };
  
  // 기존 이벤트 지속시간 감소
  newState.activeEvents = newState.activeEvents
    .map(event => ({ ...event, duration: event.duration - 1 }))
    .filter(event => event.duration > 0);
  
  // 새 이벤트 발생 체크 (턴이 진행될수록 확률 증가)
  const eventProbabilityMultiplier = 1 + (gameState.turn / 50);
  
  RANDOM_EVENTS.forEach(eventTemplate => {
    const adjustedProbability = eventTemplate.probability * eventProbabilityMultiplier;
    
    if (Math.random() < adjustedProbability && 
        !newState.activeEvents.find(e => e.id === eventTemplate.id)) {
      const newEvent = { ...eventTemplate };
      newState.activeEvents.push(newEvent);
      newState.gameLog.push(`[이벤트] ${newEvent.name}: ${newEvent.description}`);
      
      // 이벤트 효과 적용
      applyEventEffects(newState, newEvent);
    }
  });
  
  return newState;
}

function applyEventEffects(gameState: GameState, event: GameEvent) {
  if (event.effects.household) {
    Object.entries(event.effects.household).forEach(([key, value]) => {
      if (key in gameState.household) {
        (gameState.household as any)[key] = Math.max(0, (gameState.household as any)[key] + value);
      }
    });
  }
  
  if (event.effects.business) {
    Object.entries(event.effects.business).forEach(([key, value]) => {
      if (key in gameState.business) {
        (gameState.business as any)[key] = Math.max(0, (gameState.business as any)[key] + value);
      }
    });
  }
  
  if (event.effects.government) {
    Object.entries(event.effects.government).forEach(([key, value]) => {
      if (key in gameState.government) {
        (gameState.government as any)[key] = Math.max(0, (gameState.government as any)[key] + value);
      }
    });
  }
}

export function nextTurn(gameState: GameState): GameState {
  let newState = { ...gameState };
  
  // 현재 플레이어의 행동이 모두 완료되었는지 확인
  const currentFactionData = getCurrentFactionData(gameState, gameState.currentPlayer);
  
  if (currentFactionData && currentFactionData.actionsUsed < currentFactionData.maxActions) {
    // 아직 행동을 더 할 수 있으면 턴을 넘기지 않음
    console.log(`⚠️ ${gameState.currentPlayer} 아직 행동 가능: ${currentFactionData.actionsUsed}/${currentFactionData.maxActions}`);
    return newState;
  }
  
  // 다음 플레이어로 순환
  const playerOrder: Array<'household' | 'business' | 'government'> = ['household', 'business', 'government'];
  const currentIndex = playerOrder.indexOf(gameState.currentPlayer);
  const nextIndex = (currentIndex + 1) % playerOrder.length;
  
  newState.currentPlayer = playerOrder[nextIndex];
  
  console.log('🔄 턴 변경:', {
    from: gameState.currentPlayer,
    to: newState.currentPlayer,
    currentIndex,
    nextIndex
  });
  
  // 모든 플레이어가 턴을 마치면 새로운 턴 시작
  if (nextIndex === 0) {
    newState.turn += 1;
    newState.household.actionsUsed = 0;
    newState.business.actionsUsed = 0;
    newState.government.actionsUsed = 0;
    
    console.log('🆕 새 턴 시작:', newState.turn);
    
    // 경제 지표 업데이트
    newState = updateEconomicIndicators(newState);
    
    // 랜덤 이벤트 처리
    newState = processRandomEvents(newState);
    
    // 승리 조건 체크
    const winner = calculateVictoryConditions(newState, newState.settings);
    if (winner) {
      newState.winner = winner;
      newState.gamePhase = 'ended';
    }
    
    // 턴 로그 추가
    newState.gameLog.push(`--- ${newState.turn}턴 시작 ---`);
  }
  
  return newState;
}

function getCurrentFactionData(gameState: GameState, faction: 'household' | 'business' | 'government') {
  switch (faction) {
    case 'household': return gameState.household;
    case 'business': return gameState.business;
    case 'government': return gameState.government;
    default: return null;
  }
}

export function initializeGameWithPlayer(playerFaction: PlayerType): GameState {
  // 기본 설정으로 게임 초기화
  const defaultSettings: GameSettings = {
    gameLength: 30,
    difficulty: 'normal',
    startingResources: 1.0,
    aiSpeed: 'normal'
  };
  
  return initializeGameWithSettings(playerFaction, defaultSettings);
}

export function initializeGameWithSettings(playerFaction: PlayerType, settings: GameSettings): GameState {
  console.log('🎮 설정 적용된 게임 초기화:', { playerFaction, settings });
  
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[settings.difficulty];
  const resourceMultiplier = STARTING_RESOURCES_MULTIPLIERS[settings.startingResources];
  
  // 완전히 새로운 게임 상태 생성
  const newState: GameState = {
    turn: 1,
    currentPlayer: playerFaction, // 플레이어 세력부터 시작
    playerFaction,
    gamePhase: 'playing',
    activeEvents: [],
    gameLog: [`[시작] ${getPlayerName(playerFaction)}을(를) 선택했습니다! 여러분의 턴부터 시작합니다.`],
    winner: null,
    economicIndicators: {
      gdp: 100,
      inflation: 2.5,
      unemployment: 8,
      stockMarket: 100
    },
    settings: settings, // 설정 정보 저장
    // 세력별 데이터 초기화 (설정 적용)
    household: {
      ...INITIAL_GAME_STATE.household,
      isPlayer: playerFaction === 'household',
      actionsUsed: 0,
      money: Math.floor(INITIAL_GAME_STATE.household.money * resourceMultiplier),
      investments: Math.floor(INITIAL_GAME_STATE.household.investments * resourceMultiplier)
    },
    business: {
      ...INITIAL_GAME_STATE.business,
      isPlayer: playerFaction === 'business',
      actionsUsed: 0,
      capital: Math.floor(INITIAL_GAME_STATE.business.capital * resourceMultiplier)
    },
    government: {
      ...INITIAL_GAME_STATE.government,
      isPlayer: playerFaction === 'government',
      actionsUsed: 0,
      budget: Math.floor(INITIAL_GAME_STATE.government.budget * resourceMultiplier)
    }
  };
  
  // 게임 설정 정보를 로그에 추가
  newState.gameLog.push(`[설정] 게임 길이: ${settings.gameLength}턴, 난이도: ${settings.difficulty}, AI 속도: ${settings.aiSpeed}`);
  
  console.log('✅ 설정 적용된 게임 초기화 완료:', {
    playerFaction: newState.playerFaction,
    currentPlayer: newState.currentPlayer,
    gamePhase: newState.gamePhase,
    settings: settings,
    resourceMultiplier,
    difficultyMultiplier
  });
  
  return newState;
}

export function getPlayerName(faction: PlayerType): string {
  switch (faction) {
    case 'household': return '가계';
    case 'business': return '기업';
    case 'government': return '정부';
    default: return '';
  }
}