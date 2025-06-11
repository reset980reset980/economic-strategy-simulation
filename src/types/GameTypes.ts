export interface Hero {
  id: string;
  name: string;
  level: number;
  experience: number;
  specialty: string;
  bonus: number;
  portrait: string;
  skills: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Building {
  id: string;
  name: string;
  level: number;
  type: string;
  effects: Record<string, number>;
  cost: number;
  description: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  prerequisites: string[];
  effects: Record<string, number>;
  researched: boolean;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  effects: Record<string, number>;
  active: boolean;
}

export interface Household {
  id: string;
  name: string;
  money: number;
  happiness: number;
  familySize: number;
  job: string;
  skills: number;
  investments: number;
  heroes: Hero[];
  maxActions: number;
  actionsUsed: number;
  buildings: Building[];
  technologies: Technology[];
  reputation: number;
  isPlayer: boolean;
  aiPersonality: 'conservative' | 'aggressive' | 'balanced' | 'chaotic';
}

export interface Business {
  id: string;
  name: string;
  capital: number;
  employees: number;
  marketShare: number;
  brandRecognition: number;
  productivity: number;
  technology: number;
  heroes: Hero[];
  maxActions: number;
  actionsUsed: number;
  buildings: Building[];
  technologies: Technology[];
  reputation: number;
  isPlayer: boolean;
  aiPersonality: 'conservative' | 'aggressive' | 'balanced' | 'chaotic';
}

export interface Government {
  id: string;
  name: string;
  budget: number;
  trustRating: number;
  infrastructure: number;
  welfare: number;
  diplomacy: number;
  policies: Policy[];
  heroes: Hero[];
  maxActions: number;
  actionsUsed: number;
  buildings: Building[];
  technologies: Technology[];
  reputation: number;
  isPlayer: boolean;
  aiPersonality: 'conservative' | 'aggressive' | 'balanced' | 'chaotic';
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  effects: {
    household?: Partial<Household>;
    business?: Partial<Business>;
    government?: Partial<Government>;
  };
  probability: number;
  duration: number;
  choices?: {
    id: string;
    text: string;
    effects: Record<string, number>;
  }[];
}

export interface GameState {
  turn: number;
  currentPlayer: 'household' | 'business' | 'government';
  household: Household;
  business: Business;
  government: Government;
  activeEvents: GameEvent[];
  gameLog: string[];
  winner: string | null;
  playerFaction: 'household' | 'business' | 'government' | null;
  gamePhase: 'setup' | 'playing' | 'ended';
  economicIndicators: {
    gdp: number;
    inflation: number;
    unemployment: number;
    stockMarket: number;
  };
  settings?: {
    gameLength: 15 | 30 | 45;
    difficulty: 'easy' | 'normal' | 'hard';
    startingResources: 0.5 | 1.0 | 1.5;
    aiSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  };
}

export type PlayerType = 'household' | 'business' | 'government';