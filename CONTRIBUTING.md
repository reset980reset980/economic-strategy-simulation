# 기여 가이드

## 🤝 기여하기

경제 전략 시뮬레이션 프로젝트에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 효과적으로 기여하는 방법을 안내합니다.

## 📋 기여 방법

### 1. 이슈 리포팅
버그를 발견하거나 새로운 기능을 제안하고 싶다면:

1. 기존 이슈를 먼저 확인해 주세요
2. 새로운 이슈를 생성할 때는 다음 정보를 포함해 주세요:
   - 명확한 제목과 설명
   - 재현 단계 (버그의 경우)
   - 예상 결과와 실제 결과
   - 스크린샷 (필요한 경우)
   - 환경 정보 (브라우저, OS 등)

### 2. 코드 기여

#### 개발 환경 설정
```bash
# 저장소 포크 및 클론
git clone https://github.com/your-username/economic-strategy-simulation.git
cd economic-strategy-simulation

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 브랜치 전략
- `main`: 안정적인 릴리스 브랜치
- `develop`: 개발 중인 기능들이 통합되는 브랜치
- `feature/기능명`: 새로운 기능 개발
- `bugfix/버그명`: 버그 수정
- `hotfix/수정명`: 긴급 수정

#### 커밋 메시지 규칙
```
타입(범위): 간단한 설명

상세한 설명 (선택사항)

관련 이슈: #123
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스 또는 도구 변경

**예시:**
```
feat(actions): 가계 새로운 행동 '부동산 투자' 추가

부동산 투자 행동을 통해 가계가 장기적인 자산 증식을 
할 수 있는 기능을 추가했습니다.

관련 이슈: #45
```

## 🏗️ 개발 가이드라인

### 코드 스타일
- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 제공된 ESLint 규칙 준수
- **Prettier**: 코드 포맷팅 자동화
- **네이밍**: camelCase 사용, 의미있는 변수명 사용

### 컴포넌트 작성 규칙
```typescript
// ✅ 좋은 예시
interface ComponentProps {
  gameState: GameState;
  onAction: (action: Action) => void;
}

export const Component: React.FC<ComponentProps> = ({ gameState, onAction }) => {
  // 컴포넌트 로직
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};

// ❌ 나쁜 예시
export const Component = (props: any) => {
  // any 타입 사용 금지
  return <div>{/* JSX */}</div>;
};
```

### 상태 관리 규칙
```typescript
// ✅ 불변성 유지
const newState = {
  ...gameState,
  household: {
    ...gameState.household,
    money: gameState.household.money + 1000
  }
};

// ❌ 직접 수정 금지
gameState.household.money += 1000;
```

### 함수 작성 규칙
```typescript
// ✅ 순수 함수 사용
function calculateNewMoney(currentMoney: number, income: number): number {
  return currentMoney + income;
}

// ✅ 명확한 타입 정의
function executeAction(gameState: GameState, action: Action): GameState {
  return action.execute(gameState);
}
```

## 🧪 테스트

### 테스트 작성
새로운 기능을 추가할 때는 반드시 테스트를 포함해 주세요:

```typescript
// 예시: 행동 테스트
describe('Household Actions', () => {
  test('work-overtime should increase money and decrease happiness', () => {
    const initialState = createTestGameState();
    const action = HOUSEHOLD_ACTIONS.find(a => a.id === 'work-overtime')!;
    
    const newState = action.execute(initialState);
    
    expect(newState.household.money).toBeGreaterThan(initialState.household.money);
    expect(newState.household.happiness).toBeLessThan(initialState.household.happiness);
  });
});
```

### 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test -- actions.test.ts

# 커버리지 확인
npm run test:coverage
```

## 📝 문서화

### 코드 문서화
```typescript
/**
 * 게임 상태에서 다음 턴으로 진행합니다.
 * 
 * @param gameState - 현재 게임 상태
 * @returns 업데이트된 게임 상태
 * 
 * @example
 * ```typescript
 * const newState = nextTurn(currentState);
 * ```
 */
export function nextTurn(gameState: GameState): GameState {
  // 함수 구현
}
```

### README 업데이트
새로운 기능을 추가했다면 README.md도 함께 업데이트해 주세요.

## 🔍 코드 리뷰

### 리뷰 요청 전 체크리스트
- [ ] 모든 테스트가 통과하는가?
- [ ] ESLint 규칙을 준수하는가?
- [ ] 타입 에러가 없는가?
- [ ] 문서가 업데이트되었는가?
- [ ] 커밋 메시지가 규칙을 따르는가?

### 리뷰 과정
1. **자동 검사**: CI/CD 파이프라인이 자동으로 테스트와 린트를 실행합니다
2. **코드 리뷰**: 메인테이너가 코드를 검토합니다
3. **피드백**: 필요한 경우 수정 요청을 받을 수 있습니다
4. **승인**: 모든 검토가 완료되면 병합됩니다

## 🎯 기여 아이디어

### 쉬운 기여
- 오타 수정
- 문서 개선
- 번역 추가
- 버그 리포트

### 중간 난이도 기여
- 새로운 행동 추가
- UI/UX 개선
- 성능 최적화
- 테스트 추가

### 고급 기여
- 새로운 게임 모드
- AI 로직 개선
- 아키텍처 개선
- 새로운 기능 설계

## 📞 소통

### 질문하기
- GitHub Issues를 통해 질문해 주세요
- 명확하고 구체적인 질문을 해주세요
- 관련 코드나 스크린샷을 포함해 주세요

### 토론 참여
- GitHub Discussions에서 아이디어를 공유해 주세요
- 다른 기여자들과 협력해 주세요
- 건설적인 피드백을 제공해 주세요

## 🏆 인정

모든 기여자는 다음과 같이 인정받습니다:
- README의 기여자 목록에 추가
- 릴리스 노트에 기여 내용 명시
- 특별한 기여에 대한 별도 감사 표시

## 📜 라이선스

이 프로젝트에 기여함으로써, 귀하의 기여가 프로젝트와 동일한 MIT 라이선스 하에 배포됨에 동의하는 것으로 간주됩니다.

---

다시 한 번 기여해 주셔서 감사합니다! 함께 더 나은 게임을 만들어 나가요! 🎮