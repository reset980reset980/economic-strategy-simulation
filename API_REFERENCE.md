# API 레퍼런스

## 📚 타입 정의

### 핵심 인터페이스

#### GameState
게임의 전체 상태를 나타내는 메인 인터페이스

```typescript
interface GameState {
  turn: number;                    // 현재 턴 (1-30)
  currentPlayer: PlayerType;       // 현재 플레이어
  household: Household;            // 가계 데이터
  business: Business;              // 기업 데이터
  government: Government;          // 정부 데이터
  activeEvents: GameEvent[];       // 활성 이벤트 목록
  gameLog: string[];              // 게임 로그
  winner: string | null;          // 승리자 (null이면 게임 진행 중)
  playerFaction: PlayerType | null; // 플레이어가 선택한 세력
  gamePhase: 'setup' | 'playing' | 'ended'; // 게임 단계
  economicIndicators: EconomicIndicators; // 경제 지표
}
```

#### PlayerType
플레이어가 선택할 수 있는 세력 타입

```typescript
type PlayerType = 'household' | 'business' | 'government';
```

#### Action
게임에서 실행할 수 있는 행동을 정의하는 인터페이스

```typescript
interface Action {
  id: string;                      // 고유 식별자
  name: string;                    // 행동 이름
  description: string;             // 행동 설명
  cost: number;                    // 실행 비용
  execute: (gameState: GameState) => GameState; // 실행 함수
  isAvailable: (gameState: GameState) => boolean; // 사용 가능 여부
}
```

### 세력별 인터페이스

#### Household (가계)
```typescript
interface Household {
  id: string;
  name: string;
  money: number;                   // 보유 자금
  happiness: number;               // 행복도 (0-100)
  familySize: number;              // 가족 구성원 수
  job: string;                     // 직업
  skills: number;                  // 기술력 (0-100)
  investments: number;             // 투자자산
  heroes: Hero[];                  // 영웅 목록
  maxActions: number;              // 턴당 최대 행동 수
  actionsUsed: number;             // 현재 턴 사용한 행동 수
  buildings: Building[];           // 소유 건물
  technologies: Technology[];      // 보유 기술
  reputation: number;              // 평판 (0-100)
  isPlayer: boolean;               // 플레이어 여부
  aiPersonality: AIPersonality;   // AI 성격
}
```

#### Business (기업)
```typescript
interface Business {
  id: string;
  name: string;
  capital: number;                 // 자본금
  employees: number;               // 직원 수
  marketShare: number;             // 시장점유율 (0-100)
  brandRecognition: number;        // 브랜드 인지도 (0-100)
  productivity: number;            // 생산성 (0-100)
  technology: number;              // 기술력 (0-100)
  heroes: Hero[];
  maxActions: number;
  actionsUsed: number;
  buildings: Building[];
  technologies: Technology[];
  reputation: number;
  isPlayer: boolean;
  aiPersonality: AIPersonality;
}
```

#### Government (정부)
```typescript
interface Government {
  id: string;
  name: string;
  budget: number;                  // 예산
  trustRating: number;             // 신뢰도 (0-100)
  infrastructure: number;          // 인프라 (0-100)
  welfare: number;                 // 복지 (0-100)
  diplomacy: number;               // 외교력 (0-100)
  policies: Policy[];              // 활성 정책
  heroes: Hero[];
  maxActions: number;
  actionsUsed: number;
  buildings: Building[];
  technologies: Technology[];
  reputation: number;
  isPlayer: boolean;
  aiPersonality: AIPersonality;
}
```

### 보조 인터페이스

#### Hero (영웅)
```typescript
interface Hero {
  id: string;
  name: string;
  level: number;                   // 레벨
  experience: number;              // 경험치
  specialty: string;               // 전문 분야
  bonus: number;                   // 보너스 수치
  portrait: string;                // 초상화 (이모지)
  skills: string[];                // 보유 스킬
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // 희귀도
}
```

#### GameEvent (게임 이벤트)
```typescript
interface GameEvent {
  id: string;
  name: string;
  description: string;
  effects: {                       // 세력별 효과
    household?: Partial<Household>;
    business?: Partial<Business>;
    government?: Partial<Government>;
  };
  probability: number;             // 발생 확률 (0-1)
  duration: number;                // 지속 턴 수
  choices?: EventChoice[];         // 선택지 (선택적)
}
```

#### EconomicIndicators (경제 지표)
```typescript
interface EconomicIndicators {
  gdp: number;                     // GDP
  inflation: number;               // 인플레이션율
  unemployment: number;            // 실업률
  stockMarket: number;             // 주식시장 지수
}
```

## 🔧 핵심 함수

### 게임 로직 함수

#### initializeGameWithPlayer
새 게임을 초기화하고 플레이어 세력을 설정합니다.

```typescript
function initializeGameWithPlayer(playerFaction: PlayerType): GameState
```

**매개변수:**
- `playerFaction`: 플레이어가 선택한 세력

**반환값:**
- 초기화된 게임 상태

#### nextTurn
다음 턴으로 진행합니다.

```typescript
function nextTurn(gameState: GameState): GameState
```

**매개변수:**
- `gameState`: 현재 게임 상태

**반환값:**
- 업데이트된 게임 상태

#### calculateVictoryConditions
승리 조건을 확인합니다.

```typescript
function calculateVictoryConditions(gameState: GameState): string | null
```

**매개변수:**
- `gameState`: 현재 게임 상태

**반환값:**
- 승리자 문자열 또는 null (게임 진행 중)

#### updateEconomicIndicators
경제 지표를 업데이트합니다.

```typescript
function updateEconomicIndicators(gameState: GameState): GameState
```

#### processRandomEvents
랜덤 이벤트를 처리합니다.

```typescript
function processRandomEvents(gameState: GameState): GameState
```

### AI 관련 함수

#### createAIPlayers
AI 플레이어들을 생성합니다.

```typescript
function createAIPlayers(playerFaction: PlayerType): AIPlayer[]
```

**매개변수:**
- `playerFaction`: 플레이어가 선택한 세력

**반환값:**
- AI 플레이어 배열

#### AIPlayer.makeDecision
AI가 다음 행동을 결정합니다.

```typescript
class AIPlayer {
  makeDecision(gameState: GameState): Action | null
}
```

**매개변수:**
- `gameState`: 현재 게임 상태

**반환값:**
- 선택된 행동 또는 null (행동 불가)

## 📋 행동 목록

### 가계 행동 (HOUSEHOLD_ACTIONS)

| ID | 이름 | 비용 | 설명 |
|---|---|---|---|
| work-overtime | 야근하기 | 0 | 추가 수입을 얻지만 행복도 감소 |
| invest-stocks | 주식 투자 | 2,000 | 주식에 투자하여 장기적 수익 추구 |
| liquidate-investments | 투자자산 현금화 | 0 | 투자자산의 80%를 현금으로 전환 |
| family-time | 가족 시간 | 0 | 가족과의 시간으로 행복도 증가 |
| skill-training | 기술 교육 | 1,500 | 새로운 기술을 배워 능력 향상 |

### 기업 행동 (BUSINESS_ACTIONS)

| ID | 이름 | 비용 | 설명 |
|---|---|---|---|
| hire-employees | 직원 고용 | 3,000 | 새로운 직원을 고용하여 생산성 향상 |
| marketing-campaign | 마케팅 캠페인 | 5,000 | 광고를 통해 브랜드 인지도와 시장점유율 증가 |
| rd-investment | R&D 투자 | 8,000 | 연구개발에 투자하여 기술력 향상 |
| expand-production | 생산 확대 | 10,000 | 생산 시설을 확대하여 수익 증대 |
| dividend-payment | 배당금 지급 | 5,000 | 주주들에게 배당금을 지급하여 브랜드 이미지 개선 |

### 정부 행동 (GOVERNMENT_ACTIONS)

| ID | 이름 | 비용 | 설명 |
|---|---|---|---|
| collect-taxes | 세금 징수 | 0 | 가계와 기업으로부터 세금 징수 |
| welfare-program | 복지 프로그램 | 5,000 | 복지 혜택을 제공하여 신뢰도 증가 |
| infrastructure-investment | 인프라 투자 | 15,000 | 도로, 통신 등 인프라에 투자 |
| business-support | 기업 지원 | 8,000 | 기업에 지원금을 제공하여 경제 활성화 |
| emergency-fund | 긴급 자금 조달 | 0 | 국채 발행을 통해 긴급 자금 조달 |

## 🎲 랜덤 이벤트 목록

| ID | 이름 | 확률 | 지속 턴 | 설명 |
|---|---|---|---|---|
| economic-crisis | 경제 위기 | 10% | 3 | 글로벌 경제 위기 발생 |
| tech-boom | 기술 혁신 | 15% | 2 | 새로운 기술 혁신 발생 |
| natural-disaster | 자연재해 | 8% | 4 | 대규모 자연재해 발생 |
| market-boom | 시장 호황 | 12% | 2 | 경제 급성장 |
| political-scandal | 정치 스캔들 | 10% | 3 | 정부 신뢰도 하락 |

## 🔍 사용 예시

### 게임 초기화
```typescript
const gameState = initializeGameWithPlayer('household');
const aiPlayers = createAIPlayers('household');
```

### 행동 실행
```typescript
const action = HOUSEHOLD_ACTIONS.find(a => a.id === 'work-overtime');
if (action && action.isAvailable(gameState)) {
  const newState = action.execute(gameState);
}
```

### AI 턴 처리
```typescript
const currentAI = aiPlayers.find(ai => ai.faction === gameState.currentPlayer);
if (currentAI) {
  const aiAction = currentAI.makeDecision(gameState);
  if (aiAction) {
    const newState = aiAction.execute(gameState);
  }
}
```

### 승리 조건 확인
```typescript
const winner = calculateVictoryConditions(gameState);
if (winner) {
  console.log(`게임 종료: ${winner}`);
}
```

## ⚠️ 주의사항

1. **상태 불변성**: 모든 게임 상태 변경은 새로운 객체를 반환해야 합니다.
2. **타입 안전성**: TypeScript 타입을 엄격하게 준수해야 합니다.
3. **경계값 검사**: 모든 수치는 적절한 범위 내에서 유지되어야 합니다.
4. **에러 처리**: 예외 상황에 대한 적절한 처리가 필요합니다.

## 🔄 버전 히스토리

### v1.0.0
- 기본 게임 시스템 구현
- 3개 세력 및 기본 행동 시스템
- AI 로직 및 랜덤 이벤트 시스템
- 승리 조건 및 경제 지표 시스템