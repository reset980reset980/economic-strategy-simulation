import { GameState, PlayerType } from '../types/GameTypes';
import { Action, HOUSEHOLD_ACTIONS, BUSINESS_ACTIONS, GOVERNMENT_ACTIONS } from './actions';

export interface AIDecision {
  action: Action;
  priority: number;
  reasoning: string;
}

export type AIPersonalityType = 'conservative' | 'aggressive' | 'balanced' | 'chaotic';

export interface AIPersonality {
  name: string;
  description: string;
  riskTolerance: number;      // 0-1, 위험 감수 정도
  planningHorizon: number;    // 1-5, 장기 계획 선호도
  adaptability: number;       // 0-1, 상황 적응력
  randomness: number;         // 0-1, 예측 불가능성
  specialBehaviors: string[]; // 특별한 행동 패턴
}

export const AI_PERSONALITIES: Record<AIPersonalityType, AIPersonality> = {
  conservative: {
    name: '수비형',
    description: '안전한 플레이를 선호하며 위기를 회피합니다',
    riskTolerance: 0.2,
    planningHorizon: 4,
    adaptability: 0.6,
    randomness: 0.1,
    specialBehaviors: ['avoid_debt', 'emergency_fund', 'defensive_play']
  },
  aggressive: {
    name: '공격형',
    description: '고위험 고수익을 추구하며 적극적으로 투자합니다',
    riskTolerance: 0.8,
    planningHorizon: 2,
    adaptability: 0.8,
    randomness: 0.3,
    specialBehaviors: ['high_investment', 'market_expansion', 'bold_moves']
  },
  balanced: {
    name: '균형형',
    description: '상황에 맞는 전략을 구사하며 안정적으로 성장합니다',
    riskTolerance: 0.5,
    planningHorizon: 3,
    adaptability: 0.9,
    randomness: 0.2,
    specialBehaviors: ['situation_based', 'steady_growth', 'flexible_strategy']
  },
  chaotic: {
    name: '무작위형',
    description: '예측 불가능한 행동으로 게임에 변화를 가져옵니다',
    riskTolerance: 0.6,
    planningHorizon: 1,
    adaptability: 0.7,
    randomness: 0.6,
    specialBehaviors: ['random_choice', 'unexpected_moves', 'chaos_factor']
  }
};

export class AIPlayer {
  public faction: PlayerType;
  public personalityType: AIPersonalityType;
  private personality: AIPersonality;
  private gameMemory: Array<{turn: number, action: string, result: string}>;
  private moodModifier: number; // -0.5 ~ +0.5, 현재 기분에 따른 변화

  constructor(faction: PlayerType, personalityType: AIPersonalityType) {
    this.faction = faction;
    this.personalityType = personalityType;
    this.personality = AI_PERSONALITIES[personalityType];
    this.gameMemory = [];
    this.moodModifier = 0;
    console.log(`🤖 AI 플레이어 생성: ${faction} (${this.personality.name} - ${this.personality.description})`);
  }

  makeDecision(gameState: GameState): Action | null {
    console.log(`🎯 ${this.faction} AI 결정 시작 (${this.personality.name})`);
    
    // 기분 업데이트
    this.updateMood(gameState);
    
    const availableActions = this.getAvailableActions(gameState);
    console.log(`📋 ${this.faction} 사용 가능한 행동:`, availableActions.map(a => a.name));
    
    if (availableActions.length === 0) {
      console.log(`❌ ${this.faction} 사용 가능한 행동 없음`);
      return null;
    }

    // 성격별 특별 로직 적용
    const selectedAction = this.selectActionByPersonality(availableActions, gameState);
    
    // 메모리에 기록
    this.recordDecision(gameState.turn, selectedAction.name);
    
    console.log(`✅ ${this.faction} 최종 선택: ${selectedAction.name} (성격: ${this.personality.name})`);
    return selectedAction;
  }

  private updateMood(gameState: GameState): void {
    const currentData = this.getCurrentFactionData(gameState);
    if (!currentData) return;

    // 성과에 따른 기분 변화
    if (this.faction === 'household') {
      if (currentData.money > 10000) this.moodModifier += 0.1;
      if (currentData.happiness < 40) this.moodModifier -= 0.2;
    } else if (this.faction === 'business') {
      if (currentData.marketShare > 30) this.moodModifier += 0.1;
      if (currentData.capital < 20000) this.moodModifier -= 0.2;
    } else if (this.faction === 'government') {
      if (currentData.trustRating > 70) this.moodModifier += 0.1;
      if (currentData.budget < 30000) this.moodModifier -= 0.2;
    }

    // 경제 위기 시 기분 악화
    if (gameState.economicIndicators.gdp < 80) this.moodModifier -= 0.1;
    if (gameState.economicIndicators.unemployment > 15) this.moodModifier -= 0.1;

    // 범위 제한
    this.moodModifier = Math.max(-0.5, Math.min(0.5, this.moodModifier));
  }

  private selectActionByPersonality(actions: Action[], gameState: GameState): Action {
    // 1. 기본 우선순위 계산
    const evaluatedActions = actions.map(action => ({
      action,
      priority: this.evaluateAction(action, gameState).priority
    }));

    // 2. 성격별 특별 로직
    if (this.personalityType === 'chaotic') {
      return this.chaoticDecision(evaluatedActions, gameState);
    }

    if (this.personalityType === 'conservative') {
      return this.conservativeDecision(evaluatedActions, gameState);
    }

    if (this.personalityType === 'aggressive') {
      return this.aggressiveDecision(evaluatedActions, gameState);
    }

    // 균형형은 상황에 따른 선택
    return this.balancedDecision(evaluatedActions, gameState);
  }

  private chaoticDecision(evaluatedActions: Array<{action: Action, priority: number}>, gameState: GameState): Action {
    // 60% 확률로 랜덤 선택, 40%는 우선순위 기반
    if (Math.random() < 0.6) {
      const randomIndex = Math.floor(Math.random() * evaluatedActions.length);
      console.log(`🎲 무작위 선택: ${evaluatedActions[randomIndex].action.name}`);
      return evaluatedActions[randomIndex].action;
    }
    
    evaluatedActions.sort((a, b) => b.priority - a.priority);
    return evaluatedActions[0].action;
  }

  private conservativeDecision(evaluatedActions: Array<{action: Action, priority: number}>, gameState: GameState): Action {
    // 비용이 낮고 안전한 행동 선호
    const safeActions = evaluatedActions.filter(ea => ea.action.cost <= this.getSafeSpendingLimit(gameState));
    
    if (safeActions.length > 0) {
      safeActions.sort((a, b) => b.priority - a.priority);
      console.log(`🛡️ 안전 선택: ${safeActions[0].action.name}`);
      return safeActions[0].action;
    }
    
    // 안전한 행동이 없으면 가장 저렴한 것 선택
    evaluatedActions.sort((a, b) => a.action.cost - b.action.cost);
    return evaluatedActions[0].action;
  }

  private aggressiveDecision(evaluatedActions: Array<{action: Action, priority: number}>, gameState: GameState): Action {
    // 고비용 고효과 행동 선호
    const expensiveActions = evaluatedActions.filter(ea => ea.action.cost > 3000);
    
    if (expensiveActions.length > 0) {
      expensiveActions.sort((a, b) => b.priority - a.priority);
      console.log(`⚡ 공격적 선택: ${expensiveActions[0].action.name}`);
      return expensiveActions[0].action;
    }
    
    // 고비용 행동이 없으면 우선순위 기반
    evaluatedActions.sort((a, b) => b.priority - a.priority);
    return evaluatedActions[0].action;
  }

  private balancedDecision(evaluatedActions: Array<{action: Action, priority: number}>, gameState: GameState): Action {
    // 상황에 따른 유연한 선택
    const currentData = this.getCurrentFactionData(gameState);
    if (!currentData) {
      evaluatedActions.sort((a, b) => b.priority - a.priority);
      return evaluatedActions[0].action;
    }

    // 위기 상황에서는 방어적, 여유 있을 때는 공격적
    const isInCrisis = this.assessCrisisSituation(gameState);
    
    if (isInCrisis) {
      return this.conservativeDecision(evaluatedActions, gameState);
    } else {
      evaluatedActions.sort((a, b) => b.priority - a.priority);
      console.log(`⚖️ 균형 선택: ${evaluatedActions[0].action.name}`);
      return evaluatedActions[0].action;
    }
  }

  private getAvailableActions(gameState: GameState): Action[] {
    let actions: Action[] = [];
    
    switch (this.faction) {
      case 'household':
        actions = HOUSEHOLD_ACTIONS;
        break;
      case 'business':
        actions = BUSINESS_ACTIONS;
        break;
      case 'government':
        actions = GOVERNMENT_ACTIONS;
        break;
    }

    const availableActions = actions.filter(action => action.isAvailable(gameState));
    console.log(`🔍 ${this.faction} 필터링 결과: ${availableActions.length}/${actions.length} 행동 가능`);
    
    return availableActions;
  }

  private getSafeSpendingLimit(gameState: GameState): number {
    const currentData = this.getCurrentFactionData(gameState);
    if (!currentData) return 0;

    if (this.faction === 'household') {
      return Math.floor(currentData.money * 0.3); // 보유 자금의 30%
    } else if (this.faction === 'business') {
      return Math.floor(currentData.capital * 0.2); // 자본의 20%
    } else if (this.faction === 'government') {
      return Math.floor(currentData.budget * 0.25); // 예산의 25%
    }
    return 0;
  }

  private assessCrisisSituation(gameState: GameState): boolean {
    const currentData = this.getCurrentFactionData(gameState);
    if (!currentData) return true;

    // 세력별 위기 상황 판단
    if (this.faction === 'household') {
      return currentData.money < 3000 || currentData.happiness < 30;
    } else if (this.faction === 'business') {
      return currentData.capital < 20000 || currentData.marketShare < 10;
    } else if (this.faction === 'government') {
      return currentData.budget < 30000 || currentData.trustRating < 30;
    }
    return false;
  }

  private recordDecision(turn: number, actionName: string): void {
    this.gameMemory.push({
      turn,
      action: actionName,
      result: 'executed' // 나중에 결과 평가 추가 가능
    });

    // 메모리 최대 10개 턴로 제한
    if (this.gameMemory.length > 10) {
      this.gameMemory.shift();
    }
  }

  private evaluateAction(action: Action, gameState: GameState): AIDecision {
    let priority = 0;
    let reasoning = '';

    const currentData = this.getCurrentFactionData(gameState);
    if (!currentData) return { action, priority: 0, reasoning: 'No data available' };

    // 기본 우선순위 계산
    switch (this.faction) {
      case 'household':
        priority = this.evaluateHouseholdAction(action, gameState);
        break;
      case 'business':
        priority = this.evaluateBusinessAction(action, gameState);
        break;
      case 'government':
        priority = this.evaluateGovernmentAction(action, gameState);
        break;
    }

    // 성격에 따른 조정
    priority = this.adjustForPersonality(priority, action, gameState);

    // 위기 상황 대응
    priority = this.adjustForCrisis(priority, action, gameState);

    return { action, priority, reasoning };
  }

  private evaluateHouseholdAction(action: Action, gameState: GameState): number {
    const household = gameState.household;
    let priority = 50; // 기본값

    switch (action.id) {
      case 'work-overtime':
        if (household.money < 3000) priority += 30;
        if (household.happiness < 50) priority -= 20;
        break;
      case 'invest-stocks':
        if (household.money > 10000) priority += 25;
        if (gameState.economicIndicators.stockMarket > 80) priority += 15;
        break;
      case 'liquidate-investments':
        if (household.money < 2000) priority += 40;
        break;
      case 'family-time':
        if (household.happiness < 60) priority += 35;
        break;
      case 'skill-training':
        if (household.skills < 70) priority += 20;
        if (gameState.business.technology > 70) priority += 10;
        break;
    }

    return priority;
  }

  private evaluateBusinessAction(action: Action, gameState: GameState): number {
    const business = gameState.business;
    let priority = 50;

    switch (action.id) {
      case 'hire-employees':
        if (business.employees < 30) priority += 25;
        if (business.capital > 20000) priority += 15;
        break;
      case 'marketing-campaign':
        if (business.marketShare < 40) priority += 30;
        if (business.brandRecognition < 50) priority += 20;
        break;
      case 'rd-investment':
        if (business.technology < 60) priority += 35;
        if (gameState.turn > 15) priority += 15;
        break;
      case 'expand-production':
        if (business.marketShare > 30 && business.capital > 50000) priority += 40;
        break;
      case 'dividend-payment':
        if (business.capital > 30000 && business.brandRecognition < 70) priority += 20;
        break;
    }

    return priority;
  }

  private evaluateGovernmentAction(action: Action, gameState: GameState): number {
    const government = gameState.government;
    let priority = 50;

    switch (action.id) {
      case 'collect-taxes':
        if (government.budget < 50000) priority += 40;
        if (government.trustRating > 70) priority += 10;
        break;
      case 'welfare-program':
        if (gameState.household.happiness < 50) priority += 30;
        if (government.trustRating < 60) priority += 25;
        break;
      case 'infrastructure-investment':
        if (government.infrastructure < 70) priority += 35;
        if (gameState.turn < 20) priority += 15;
        break;
      case 'business-support':
        if (gameState.business.capital < 30000) priority += 25;
        if (gameState.economicIndicators.unemployment > 15) priority += 20;
        break;
      case 'emergency-fund':
        if (government.budget < 20000) priority += 50;
        break;
    }

    return priority;
  }

  private adjustForPersonality(priority: number, action: Action, gameState: GameState): number {
    const personality = this.personality;
    
    // 위험 감수도에 따른 조정
    if (action.cost > 5000) {
      priority += (personality.riskTolerance - 0.5) * 30;
    }
    
    // 계획 수립 성향에 따른 조정
    if (action.id.includes('invest') || action.id.includes('research') || action.id.includes('infrastructure')) {
      priority += (personality.planningHorizon - 3) * 10;
    }
    
    // 기분에 따른 조정
    priority += this.moodModifier * 20;

    return Math.max(0, priority);
  }

  private adjustForCrisis(priority: number, action: Action, gameState: GameState): number {
    const isEconomicCrisis = gameState.economicIndicators.gdp < 80 || 
                            gameState.economicIndicators.unemployment > 20;
    
    if (isEconomicCrisis) {
      // 위기 상황에서는 방어적 행동 우선
      if (action.cost === 0) priority += 15; // 무료 행동 선호
      if (this.faction === 'government' && action.id === 'welfare-program') priority += 30;
      if (action.id.includes('emergency')) priority += 25;
    }

    return priority;
  }

  private getCurrentFactionData(gameState: GameState) {
    switch (this.faction) {
      case 'household': return gameState.household;
      case 'business': return gameState.business;
      case 'government': return gameState.government;
      default: return null;
    }
  }
}

export function createAIPlayers(playerFaction: PlayerType): AIPlayer[] {
  console.log('🏭 AI 플레이어 생성 시작, 플레이어 세력:', playerFaction);
  
  const aiPlayers: AIPlayer[] = [];
  const allFactions: PlayerType[] = ['household', 'business', 'government'];
  
  // 플레이어가 선택하지 않은 세력들을 AI로 생성
  allFactions.forEach((faction, index) => {
    if (faction !== playerFaction) {
      // 랜덤하게 성격 선택 (무작위형은 10% 확률)
      let selectedPersonality: AIPersonalityType;
      
      if (Math.random() < 0.1) {
        selectedPersonality = 'chaotic'; // 10% 확률로 무작위형
      } else {
        const normalPersonalities: AIPersonalityType[] = ['conservative', 'aggressive', 'balanced'];
        selectedPersonality = normalPersonalities[Math.floor(Math.random() * normalPersonalities.length)];
      }
      
      const aiPlayer = new AIPlayer(faction, selectedPersonality);
      aiPlayers.push(aiPlayer);
      console.log(`✅ AI 생성 완료: ${faction} (${AI_PERSONALITIES[selectedPersonality].name})`);
    } else {
      console.log(`👤 플레이어 세력 건너뛰기: ${faction}`);
    }
  });

  console.log('🎯 최종 AI 플레이어 목록:', aiPlayers.map(ai => {
    const personalityInfo = AI_PERSONALITIES[ai.personalityType];
    return `${ai.faction}(${personalityInfo.name})`;
  }));
  
  return aiPlayers;
}
