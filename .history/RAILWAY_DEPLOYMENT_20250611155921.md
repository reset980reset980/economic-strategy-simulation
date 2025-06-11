# Railway 배포 가이드

## 🚂 Railway에서 배포하기

이 프로젝트를 Railway에서 배포하는 방법을 안내합니다.

### 1. 사전 준비

1. [Railway](https://railway.app) 계정 생성
2. GitHub 저장소에 프로젝트 업로드
3. Railway와 GitHub 연동

### 2. 배포 과정

#### 방법 1: GitHub 연동 (권장)

1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 해당 저장소 선택
4. 자동으로 배포 시작

#### 방법 2: Railway CLI 사용

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 배포
railway up
```

### 3. 환경 설정

Railway는 다음 파일들을 자동으로 인식합니다:

- `package.json`: 의존성 및 스크립트
- `railway.json`: Railway 특정 설정
- `nixpacks.toml`: 빌드 환경 설정
- `.railwayignore`: 배포에서 제외할 파일

### 4. 빌드 과정

1. **Setup**: Node.js 18.x 환경 설정
2. **Install**: `npm ci`로 의존성 설치
3. **Build**: `npm run build`로 프로덕션 빌드
4. **Start**: `npm start`로 Express 서버 실행

### 5. 서버 구성

- **Express 서버**: 정적 파일 서빙
- **SPA 지원**: 모든 라우트를 index.html로 리다이렉트
- **포트**: Railway가 자동으로 할당 (환경변수 PORT 사용)

### 6. 배포 후 확인사항

✅ **체크리스트:**
- [ ] 빌드가 성공적으로 완료되었는가?
- [ ] 서버가 정상적으로 시작되었는가?
- [ ] 웹사이트가 정상적으로 로드되는가?
- [ ] 게임 기능이 모두 작동하는가?
- [ ] 모바일에서도 정상 작동하는가?

### 7. 도메인 설정

Railway는 기본적으로 `*.railway.app` 도메인을 제공합니다.

**커스텀 도메인 설정:**
1. Railway 프로젝트 설정에서 "Domains" 탭 클릭
2. "Custom Domain" 추가
3. DNS 설정에서 CNAME 레코드 추가

### 8. 환경 변수

현재 프로젝트는 환경 변수가 필요하지 않지만, 필요한 경우:

1. Railway 대시보드에서 "Variables" 탭 클릭
2. 환경 변수 추가
3. 재배포 (자동으로 트리거됨)

### 9. 모니터링

Railway 대시보드에서 다음을 모니터링할 수 있습니다:
- 배포 로그
- 애플리케이션 로그
- 메트릭스 (CPU, 메모리 사용량)
- 네트워크 트래픽

### 10. 자동 배포

GitHub와 연동된 경우:
- `main` 브랜치에 푸시할 때마다 자동 배포
- Pull Request 시 프리뷰 배포 (선택사항)

### 11. 비용

Railway 요금제:
- **Hobby Plan**: 월 $5 (500시간 실행 시간)
- **Pro Plan**: 월 $20 (무제한 실행 시간)

### 12. 문제 해결

#### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 확인
npm ci
```

#### 서버 시작 실패
- `server.js` 파일 확인
- `package.json`의 `start` 스크립트 확인
- Railway 로그에서 에러 메시지 확인

#### 정적 파일 로드 실패
- `dist` 폴더가 빌드되었는지 확인
- Express 정적 파일 설정 확인

### 13. 성능 최적화

```javascript
// server.js에 추가 최적화
import compression from 'compression';
import helmet from 'helmet';

app.use(compression()); // Gzip 압축
app.use(helmet()); // 보안 헤더

// 캐시 설정
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1d', // 1일 캐시
  etag: true
}));
```

### 14. 로그 확인

```bash
# Railway CLI로 로그 확인
railway logs

# 실시간 로그 스트리밍
railway logs --follow
```

### 15. 백업 및 복구

Railway는 자동으로 프로젝트를 백업하지만:
- GitHub 저장소가 주요 백업
- 데이터베이스 사용 시 별도 백업 필요

---

## 🎯 배포 완료 후

배포가 완료되면 Railway에서 제공하는 URL을 통해 게임에 접속할 수 있습니다.

**예시 URL:** `https://your-project-name.railway.app`

게임이 정상적으로 작동하는지 확인하고, 문제가 있다면 Railway 대시보드의 로그를 확인해 주세요.