# 🚀 Railway 배포 가이드

## 📋 배포 준비사항 체크리스트

### ✅ 완료된 설정들
- [x] `package.json`에 `start` 스크립트 추가
- [x] `express` 의존성 추가
- [x] `server.js` Express 서버 설정
- [x] `railway.json` 배포 설정
- [x] 빌드 명령어 설정

## 🌐 Railway 배포 방법

### 방법 1: GitHub 연동 배포 (권장)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Economic Strategy Simulation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/economic-strategy-simulation.git
   git push -u origin main
   ```

2. **Railway 프로젝트 생성**
   - [Railway](https://railway.app)에 로그인
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 저장소 선택

3. **자동 배포**
   - Railway가 자동으로 빌드 및 배포 진행
   - 약 3-5분 후 배포 완료

### 방법 2: Railway CLI 배포

1. **Railway CLI 설치**
   ```bash
   npm install -g @railway/cli
   ```

2. **로그인 및 배포**
   ```bash
   railway login
   railway init
   railway up
   ```

### 방법 3: 직접 업로드

1. **Railway 대시보드**에서 "New Project" → "Empty Project"
2. **Settings** → **Source** → "Connect Repo"에서 GitHub 연결
3. 또는 파일을 직접 업로드

## ⚙️ 배포 설정 상세

### `package.json` 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "start": "node server.js",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### `railway.json` 설정
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

### Express 서버 (`server.js`)
- 정적 파일 서빙 (`dist` 폴더)
- SPA 라우팅 지원
- 포트 자동 설정 (Railway 환경변수 사용)

## 🔧 환경변수 설정

현재 프로젝트는 환경변수가 필요하지 않지만, 필요한 경우:

1. **Railway 대시보드** → **Variables** 탭
2. 환경변수 추가:
   ```
   NODE_ENV=production
   PORT=3000 (Railway가 자동 설정)
   ```

## 📊 배포 후 확인사항

### ✅ 기능 테스트 체크리스트
- [ ] 게임 시작 (세력 선택)
- [ ] 게임플레이 (행동 실행)
- [ ] 저장/불러오기 기능
- [ ] 음향 효과 (BGM/효과음)
- [ ] 성취 시스템
- [ ] 게임설명서
- [ ] 모바일 반응형

### 🐛 문제 해결

**빌드 실패 시:**
```bash
# 로컬에서 빌드 테스트
npm run build
npm start
```

**정적 파일 로딩 실패 시:**
- `server.js`의 경로 설정 확인
- `dist` 폴더 생성 여부 확인

**메모리 부족 시:**
- Railway 플랜 업그레이드 고려
- 이미지/음성 파일 최적화

## 🌐 도메인 설정

### 기본 도메인
Railway가 자동으로 제공: `https://your-project-name.up.railway.app`

### 커스텀 도메인 (Pro 플랜)
1. **Settings** → **Domains**
2. 커스텀 도메인 추가
3. DNS 설정 (CNAME 레코드)

## 📈 성능 최적화

### 빌드 최적화
```json
// vite.config.ts 에 추가
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

### 캐싱 설정
```javascript
// server.js에 추가
app.use(express.static('dist', {
  maxAge: '1y', // 정적 파일 캐싱
  etag: false
}));
```

## 💰 비용 안내

### Hobby 플랜 (무료)
- ✅ 충분한 리소스
- ✅ 커스텀 도메인 지원
- ✅ 자동 배포
- ⚠️ 월 500시간 제한 (실제로는 무제한과 비슷)

### Pro 플랜 ($5/월)
- ✅ 무제한 사용
- ✅ 더 많은 메모리
- ✅ 우선 지원

## 🔗 유용한 링크

- **Railway 대시보드**: https://railway.app/dashboard
- **Railway 문서**: https://docs.railway.app
- **GitHub 저장소**: (배포 후 업데이트)
- **라이브 데모**: (배포 후 업데이트)

## 📝 배포 체크리스트

배포 전 최종 확인:
- [ ] 모든 파일이 Git에 커밋됨
- [ ] `npm run build` 성공
- [ ] `npm start` 로컬 테스트 성공
- [ ] Railway 계정 준비됨
- [ ] GitHub 저장소 준비됨 (방법 1 선택시)

---

🎉 **배포 완료 후**: 
게임 URL을 공유하여 다른 사람들과 함께 경제 전략 시뮬레이션을 즐기세요!
