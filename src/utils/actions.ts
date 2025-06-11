import { GameState } from '../types/GameTypes';

export interface Action {
  id: string;
  name: string;
  description: string;
  cost: number;
  category?: 'production' | 'consumption' | 'investment' | 'social' | 'upgrade';
  execute: (gameState: GameState) => GameState;
  isAvailable: (gameState: GameState) => boolean;
  requiredLevel?: number;
  experienceGain?: number;
}

// 레벨업 시스템 유틸리티 함수들
export function getLevel(reputation: number): number {
  return Math.floor(reputation / 100) + 1;
}

export function getExperienceToNextLevel(reputation: number): number {
  const currentLevel = getLevel(reputation);
  return (currentLevel * 100) - reputation;
}

export function addExperience(gameState: GameState, faction: 'household' | 'business' | 'government', exp: number): GameState {
  const newState = { ...gameState };
  
  if (faction === 'household') {
    newState.household = {
      ...newState.household,
      reputation: Math.min(1000, newState.household.reputation + exp)
    };
  } else if (faction === 'business') {
    newState.business = {
      ...newState.business,
      reputation: Math.min(1000, newState.business.reputation + exp)
    };
  } else if (faction === 'government') {
    newState.government = {
      ...newState.government,
      reputation: Math.min(1000, newState.government.reputation + exp)
    };
  }
  
  return newState;
}

export const HOUSEHOLD_ACTIONS: Action[] = [
  // ============ 기존 행동들 (레벨업 시스템 추가) ============
  {
    id: 'work-overtime',
    name: '야근하기',
    description: '추가 수입을 얻지만 행복도가 감소합니다.',
    cost: 0,
    category: 'production',
    experienceGain: 5,
    execute: (state) => {
      const skillBonus = Math.floor(state.household.skills / 20) * 100;
      const income = 800 + skillBonus;
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money + income,
          happiness: Math.max(0, state.household.happiness - 5),
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, `[가계] 야근으로 ${income}원을 벌었습니다. (행복도 -5, 기술 보너스: ${skillBonus}원)`]
      };
      return addExperience(newState, 'household', 5);
    },
    isAvailable: (state) => state.household.actionsUsed < state.household.maxActions
  },
  
  // ============ 새로운 소비 행동들 (기업에 수익 제공) ============
  {
    id: 'buy-goods',
    name: '생필품 구매',
    description: '기업 상품을 구매하여 기업에 수익을 제공하고 행복도를 높입니다.',
    cost: 1200,
    category: 'consumption',
    experienceGain: 3,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 1200,
          happiness: Math.min(100, state.household.happiness + 8),
          actionsUsed: state.household.actionsUsed + 1
        },
        business: {
          ...state.business,
          capital: state.business.capital + 1000 // 기업에 수익 제공
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 1)
        },
        gameLog: [...state.gameLog, '[가계] 생필품 구매로 기업에 1,000원 수익 제공 (행복도 +8, GDP +1)']
      };
      return addExperience(newState, 'household', 3);
    },
    isAvailable: (state) => state.household.money >= 1200 && state.household.actionsUsed < state.household.maxActions
  },
  
  {
    id: 'luxury-consumption',
    name: '고급 소비',
    description: '고급 상품을 구매하여 기업에 큰 수익을 제공합니다.',
    cost: 3000,
    category: 'consumption',
    experienceGain: 8,
    requiredLevel: 2,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 3000,
          happiness: Math.min(100, state.household.happiness + 15),
          actionsUsed: state.household.actionsUsed + 1
        },
        business: {
          ...state.business,
          capital: state.business.capital + 2500,
          brandRecognition: Math.min(100, state.business.brandRecognition + 3)
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 2)
        },
        gameLog: [...state.gameLog, '[가계] 고급 소비로 기업에 2,500원 수익 제공 (행복도 +15, 브랜드 +3)']
      };
      return addExperience(newState, 'household', 8);
    },
    isAvailable: (state) => {
      const level = getLevel(state.household.reputation);
      return state.household.money >= 3000 && level >= 2 && state.household.actionsUsed < state.household.maxActions;
    }
  },

  // ============ 새로운 직업/기술 관련 행동들 ============
  {
    id: 'apply-job',
    name: '취업 활동',
    description: '기업에 취업하여 안정적인 수입을 확보합니다.',
    cost: 500,
    category: 'social',
    experienceGain: 10,
    execute: (state) => {
      const salary = 1500 + (state.household.skills * 10);
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 500 + salary,
          happiness: Math.min(100, state.household.happiness + 10),
          actionsUsed: state.household.actionsUsed + 1
        },
        business: {
          ...state.business,
          productivity: Math.min(100, state.business.productivity + 5)
        },
        gameLog: [...state.gameLog, `[가계] 취업 활동으로 ${salary}원 급여 획득 (기업 생산성 +5)`]
      };
      return addExperience(newState, 'household', 10);
    },
    isAvailable: (state) => state.household.money >= 500 && state.household.actionsUsed < state.household.maxActions
  },
  
  {
    id: 'freelance-work',
    name: '프리랜스 업무',
    description: '자유업으로 수입을 얻고 기술을 향상시킵니다.',
    cost: 0,
    category: 'production',
    experienceGain: 8,
    requiredLevel: 2,
    execute: (state) => {
      const income = 600 + (state.household.skills * 8);
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money + income,
          skills: Math.min(100, state.household.skills + 3),
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, `[가계] 프리랜스로 ${income}원 수입과 기술 +3`]
      };
      return addExperience(newState, 'household', 8);
    },
    isAvailable: (state) => {
      const level = getLevel(state.household.reputation);
      return level >= 2 && state.household.actionsUsed < state.household.maxActions;
    }
  },

  {
    id: 'invest-stocks',
    name: '주식 투자',
    description: '주식에 투자하여 장기적 수익을 노립니다.',
    cost: 2000,
    category: 'investment',
    experienceGain: 6,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 2000,
          investments: state.household.investments + 2200,
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[가계] 2,000원을 투자하여 2,200원의 투자자산을 얻었습니다.']
      };
      return addExperience(newState, 'household', 6);
    },
    isAvailable: (state) => state.household.money >= 2000 && state.household.actionsUsed < state.household.maxActions
  },

  {
    id: 'liquidate-investments',
    name: '투자자산 현금화',
    description: '투자자산의 80%를 현금으로 전환합니다.',
    cost: 0,
    category: 'investment',
    experienceGain: 4,
    execute: (state) => {
      const liquidationAmount = Math.floor(state.household.investments * 0.8);
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money + liquidationAmount,
          investments: Math.floor(state.household.investments * 0.2),
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, `[가계] 투자자산을 현금화하여 ${liquidationAmount.toLocaleString()}원을 얻었습니다.`]
      };
      return addExperience(newState, 'household', 4);
    },
    isAvailable: (state) => state.household.investments >= 1000 && state.household.actionsUsed < state.household.maxActions
  },

  {
    id: 'family-time',
    name: '가족 시간',
    description: '가족과의 시간을 보내 행복도를 높입니다.',
    cost: 0,
    category: 'social',
    experienceGain: 5,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          happiness: Math.min(100, state.household.happiness + 15),
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[가계] 가족과의 시간으로 행복도가 15 증가했습니다.']
      };
      return addExperience(newState, 'household', 5);
    },
    isAvailable: (state) => state.household.actionsUsed < state.household.maxActions
  },

  {
    id: 'skill-training',
    name: '기술 교육',
    description: '새로운 기술을 배워 능력을 향상시킵니다.',
    cost: 1500,
    category: 'upgrade',
    experienceGain: 12,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 1500,
          skills: Math.min(100, state.household.skills + 10),
          actionsUsed: state.household.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[가계] 1,500원으로 교육을 받아 기술이 10 향상되었습니다.']
      };
      return addExperience(newState, 'household', 12);
    },
    isAvailable: (state) => state.household.money >= 1500 && state.household.actionsUsed < state.household.maxActions
  },
  
  // ============ 고급 행동들 (레벨 3+ 필요) ============
  {
    id: 'start-business',
    name: '창업 시도',
    description: '소규모 사업을 시작하여 추가 수입원을 만듭니다.',
    cost: 5000,
    category: 'investment',
    experienceGain: 20,
    requiredLevel: 3,
    execute: (state) => {
      let newState = {
        ...state,
        household: {
          ...state.household,
          money: state.household.money - 5000 + 2000,
          skills: Math.min(100, state.household.skills + 5),
          actionsUsed: state.household.actionsUsed + 1
        },
        business: {
          ...state.business,
          marketShare: Math.max(0, state.business.marketShare - 2) // 경쟁 증가
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 1)
        },
        gameLog: [...state.gameLog, '[가계] 창업으로 2,000원 수익 및 기술 +5 (기업 경쟁 증가)']
      };
      return addExperience(newState, 'household', 20);
    },
    isAvailable: (state) => {
      const level = getLevel(state.household.reputation);
      return state.household.money >= 5000 && level >= 3 && state.household.actionsUsed < state.household.maxActions;
    }
  }
];

export const BUSINESS_ACTIONS: Action[] = [
  // ============ 개선된 기존 행동들 ============
  {
    id: 'hire-employees',
    name: '직원 고용',
    description: '새로운 직원을 고용하여 생산성을 높입니다.',
    cost: 3000,
    category: 'production',
    experienceGain: 8,
    execute: (state) => {
      const employeeBonus = Math.floor(state.business.technology / 10);
      const productivityGain = 8 + employeeBonus;
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 3000,
          employees: state.business.employees + 2,
          productivity: Math.min(100, state.business.productivity + productivityGain),
          actionsUsed: state.business.actionsUsed + 1
        },
        household: {
          ...state.household,
          money: state.household.money + 1000
        },
        economicIndicators: {
          ...state.economicIndicators,
          unemployment: Math.max(0, state.economicIndicators.unemployment - 1)
        },
        gameLog: [...state.gameLog, `[기업] 3,000원으로 직원 2명을 고용했습니다. (가계에 1,000원 급여, 생산성 +${productivityGain})`]
      };
      return addExperience(newState, 'business', 8);
    },
    isAvailable: (state) => state.business.capital >= 3000 && state.business.actionsUsed < state.business.maxActions
  },

  // ============ 새로운 생산-판매 시스템 ============
  {
    id: 'produce-goods',
    name: '상품 생산',
    description: '소비재를 대량 생산하여 가계에 판매합니다.',
    cost: 4000,
    category: 'production',
    experienceGain: 10,
    execute: (state) => {
      const productionBonus = Math.floor(state.business.productivity / 10) * 500;
      const revenue = 5000 + productionBonus;
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 4000 + revenue,
          marketShare: Math.min(100, state.business.marketShare + 3),
          actionsUsed: state.business.actionsUsed + 1
        },
        household: {
          ...state.household,
          happiness: Math.min(100, state.household.happiness + 5) // 상품 공급으로 만족도 증가
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 2)
        },
        gameLog: [...state.gameLog, `[기업] 상품 생산으로 ${revenue}원 수익 (가계 행복도 +5, GDP +2)`]
      };
      return addExperience(newState, 'business', 10);
    },
    isAvailable: (state) => state.business.capital >= 4000 && state.business.actionsUsed < state.business.maxActions
  },

  {
    id: 'premium-products',
    name: '프리미엄 상품 출시',
    description: '고급 상품을 출시하여 높은 수익을 추구합니다.',
    cost: 8000,
    category: 'production',
    experienceGain: 15,
    requiredLevel: 2,
    execute: (state) => {
      const brandBonus = Math.floor(state.business.brandRecognition / 20) * 1000;
      const revenue = 10000 + brandBonus;
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 8000 + revenue,
          brandRecognition: Math.min(100, state.business.brandRecognition + 8),
          marketShare: Math.min(100, state.business.marketShare + 5),
          actionsUsed: state.business.actionsUsed + 1
        },
        gameLog: [...state.gameLog, `[기업] 프리미엄 상품으로 ${revenue}원 수익 (브랜드 +8, 시장점유율 +5)`]
      };
      return addExperience(newState, 'business', 15);
    },
    isAvailable: (state) => {
      const level = getLevel(state.business.reputation);
      return state.business.capital >= 8000 && level >= 2 && state.business.actionsUsed < state.business.maxActions;
    }
  },

  {
    id: 'marketing-campaign',
    name: '마케팅 캠페인',
    description: '광고를 통해 브랜드 인지도와 시장점유율을 높입니다.',
    cost: 5000,
    category: 'social',
    experienceGain: 10,
    execute: (state) => {
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 5000,
          brandRecognition: Math.min(100, state.business.brandRecognition + 12),
          marketShare: Math.min(100, state.business.marketShare + 5),
          actionsUsed: state.business.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[기업] 5,000원의 마케팅으로 브랜드 인지도 +12, 시장점유율 +5']
      };
      return addExperience(newState, 'business', 10);
    },
    isAvailable: (state) => state.business.capital >= 5000 && state.business.actionsUsed < state.business.maxActions
  },

  {
    id: 'rd-investment',
    name: 'R&D 투자',
    description: '연구개발에 투자하여 기술력을 향상시킵니다.',
    cost: 8000,
    category: 'upgrade',
    experienceGain: 12,
    execute: (state) => {
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 8000,
          technology: Math.min(100, state.business.technology + 15),
          productivity: Math.min(100, state.business.productivity + 5),
          actionsUsed: state.business.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[기업] 8,000원의 R&D 투자로 기술력 +15, 생산성 +5']
      };
      return addExperience(newState, 'business', 12);
    },
    isAvailable: (state) => state.business.capital >= 8000 && state.business.actionsUsed < state.business.maxActions
  },

  {
    id: 'expand-production',
    name: '생산 확대',
    description: '생산 시설을 확대하여 수익을 증대시킵니다.',
    cost: 10000,
    category: 'investment',
    experienceGain: 15,
    execute: (state) => {
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 10000 + 15000,
          marketShare: Math.min(100, state.business.marketShare + 8),
          actionsUsed: state.business.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[기업] 10,000원 투자로 생산을 확대하여 15,000원 수익과 시장점유율 +8']
      };
      return addExperience(newState, 'business', 15);
    },
    isAvailable: (state) => state.business.capital >= 10000 && state.business.actionsUsed < state.business.maxActions
  },

  {
    id: 'dividend-payment',
    name: '배당금 지급',
    description: '주주들에게 배당금을 지급하여 브랜드 이미지를 개선합니다.',
    cost: 5000,
    category: 'social',
    experienceGain: 8,
    execute: (state) => {
      let newState = {
        ...state,
        business: {
          ...state.business,
          capital: state.business.capital - 5000,
          brandRecognition: Math.min(100, state.business.brandRecognition + 8),
          actionsUsed: state.business.actionsUsed + 1
        },
        household: {
          ...state.household,
          money: state.household.money + 2000,
          happiness: Math.min(100, state.household.happiness + 5)
        },
        gameLog: [...state.gameLog, '[기업] 5,000원으로 배당금을 지급했습니다. (가계에 2,000원 지급, 브랜드 +8)']
      };
      return addExperience(newState, 'business', 8);
    },
    isAvailable: (state) => state.business.capital >= 5000 && state.business.actionsUsed < state.business.maxActions
  }
];

export const GOVERNMENT_ACTIONS: Action[] = [
  {
    id: 'collect-taxes',
    name: '세금 징수',
    description: '가계와 기업으로부터 세금을 징수합니다.',
    cost: 0,
    category: 'production',
    experienceGain: 5,
    execute: (state) => {
      const householdTax = Math.floor(state.household.money * 0.1);
      const businessTax = Math.floor(state.business.capital * 0.05);
      
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget + householdTax + businessTax,
          trustRating: Math.max(0, state.government.trustRating - 3),
          actionsUsed: state.government.actionsUsed + 1
        },
        household: {
          ...state.household,
          money: state.household.money - householdTax,
          happiness: Math.max(0, state.household.happiness - 5)
        },
        business: {
          ...state.business,
          capital: state.business.capital - businessTax
        },
        gameLog: [...state.gameLog, `[정부] 세금 징수: 가계 ${householdTax}원, 기업 ${businessTax}원 (신뢰도 -3)`]
      };
      return addExperience(newState, 'government', 5);
    },
    isAvailable: (state) => state.government.actionsUsed < state.government.maxActions
  },

  {
    id: 'welfare-program',
    name: '복지 프로그램',
    description: '복지 혜택을 제공하여 신뢰도를 높입니다.',
    cost: 5000,
    category: 'social',
    experienceGain: 10,
    execute: (state) => {
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget - 5000,
          welfare: Math.min(100, state.government.welfare + 10),
          trustRating: Math.min(100, state.government.trustRating + 8),
          actionsUsed: state.government.actionsUsed + 1
        },
        household: {
          ...state.household,
          money: state.household.money + 2000,
          happiness: Math.min(100, state.household.happiness + 10)
        },
        gameLog: [...state.gameLog, '[정부] 복지 프로그램으로 5,000원 지출, 가계에 2,000원 지원 (신뢰도 +8)']
      };
      return addExperience(newState, 'government', 10);
    },
    isAvailable: (state) => state.government.budget >= 5000 && state.government.actionsUsed < state.government.maxActions
  },

  {
    id: 'infrastructure-investment',
    name: '인프라 투자',
    description: '도로, 통신 등 인프라에 투자합니다.',
    cost: 15000,
    category: 'investment',
    experienceGain: 15,
    execute: (state) => {
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget - 15000,
          infrastructure: Math.min(100, state.government.infrastructure + 12),
          actionsUsed: state.government.actionsUsed + 1
        },
        business: {
          ...state.business,
          productivity: Math.min(100, state.business.productivity + 8)
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 3)
        },
        gameLog: [...state.gameLog, '[정부] 15,000원 인프라 투자로 기업 생산성 +8, 인프라 +12, GDP +3']
      };
      return addExperience(newState, 'government', 15);
    },
    isAvailable: (state) => state.government.budget >= 15000 && state.government.actionsUsed < state.government.maxActions
  },

  {
    id: 'business-support',
    name: '기업 지원',
    description: '기업에 지원금을 제공하여 경제를 활성화합니다.',
    cost: 8000,
    category: 'social',
    experienceGain: 12,
    execute: (state) => {
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget - 8000,
          trustRating: Math.min(100, state.government.trustRating + 5),
          actionsUsed: state.government.actionsUsed + 1
        },
        business: {
          ...state.business,
          capital: state.business.capital + 6000,
          technology: Math.min(100, state.business.technology + 5)
        },
        gameLog: [...state.gameLog, '[정부] 8,000원으로 기업에 6,000원 지원 및 기술력 +5 (신뢰도 +5)']
      };
      return addExperience(newState, 'government', 12);
    },
    isAvailable: (state) => state.government.budget >= 8000 && state.government.actionsUsed < state.government.maxActions
  },

  {
    id: 'emergency-fund',
    name: '긴급 자금 조달',
    description: '국채 발행을 통해 긴급 자금을 조달합니다.',
    cost: 0,
    category: 'production',
    experienceGain: 8,
    execute: (state) => {
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget + 20000,
          trustRating: Math.max(0, state.government.trustRating - 10),
          actionsUsed: state.government.actionsUsed + 1
        },
        gameLog: [...state.gameLog, '[정부] 국채 발행으로 20,000원을 조달했습니다. (신뢰도 -10)']
      };
      return addExperience(newState, 'government', 8);
    },
    isAvailable: (state) => state.government.budget < 30000 && state.government.actionsUsed < state.government.maxActions
  },

  // ============ 새로운 정부 행동들 ============
  {
    id: 'economic-stimulus',
    name: '경기 부양책',
    description: '경제 전반에 자금을 투입하여 GDP를 증진시킵니다.',
    cost: 12000,
    category: 'investment',
    experienceGain: 18,
    requiredLevel: 2,
    execute: (state) => {
      let newState = {
        ...state,
        government: {
          ...state.government,
          budget: state.government.budget - 12000,
          actionsUsed: state.government.actionsUsed + 1
        },
        household: {
          ...state.household,
          money: state.household.money + 3000,
          happiness: Math.min(100, state.household.happiness + 8)
        },
        business: {
          ...state.business,
          capital: state.business.capital + 4000,
          marketShare: Math.min(100, state.business.marketShare + 3)
        },
        economicIndicators: {
          ...state.economicIndicators,
          gdp: Math.min(120, state.economicIndicators.gdp + 5),
          unemployment: Math.max(0, state.economicIndicators.unemployment - 2)
        },
        gameLog: [...state.gameLog, '[정부] 경기 부양책으로 전 경제 부문 지원 (GDP +5, 실업률 -2)']
      };
      return addExperience(newState, 'government', 18);
    },
    isAvailable: (state) => {
      const level = getLevel(state.government.reputation);
      return state.government.budget >= 12000 && level >= 2 && state.government.actionsUsed < state.government.maxActions;
    }
  }
];
