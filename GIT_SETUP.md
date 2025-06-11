# Git 초기화 및 GitHub 업로드 가이드

## 🔧 Git 저장소 초기화

현재 프로젝트 폴더에서 다음 명령어들을 순서대로 실행하세요:

### 1단계: Git 초기화
```bash
git init
```

### 2단계: 모든 파일 추가
```bash
git add .
```

### 3단계: 첫 번째 커밋
```bash
git commit -m "🎮 Economic Strategy Simulation v1.0.0 - Ready for Railway deployment"
```

### 4단계: 메인 브랜치 설정
```bash
git branch -M main
```

### 5단계: GitHub 저장소 생성 및 연결

#### 옵션 A: GitHub 웹사이트에서 저장소 생성
1. [GitHub](https://github.com) 접속 및 로그인
2. "New repository" 클릭
3. Repository name: `economic-strategy-simulation` (또는 원하는 이름)
4. Public/Private 선택
5. "Create repository" 클릭
6. 생성된 저장소 URL 복사 (예: `https://github.com/YOUR_USERNAME/economic-strategy-simulation.git`)

#### 원격 저장소 연결 및 업로드
```bash
git remote add origin https://github.com/YOUR_USERNAME/economic-strategy-simulation.git
git push -u origin main
```

### 📝 전체 명령어 순서 (복사해서 사용)

```bash
# Git 초기화
git init

# 파일 추가
git add .

# 커밋
git commit -m "🎮 Economic Strategy Simulation v1.0.0 - Ready for Railway deployment"

# 메인 브랜치 설정
git branch -M main

# 원격 저장소 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/economic-strategy-simulation.git

# 업로드
git push -u origin main
```

## 🚀 Railway 배포 (GitHub 연결 후)

### 방법 1: GitHub 연동 (권장)
1. [Railway](https://railway.app) 로그인
2. "New Project" → "Deploy from GitHub repo"
3. 방금 생성한 저장소 선택
4. 자동 배포 시작! ⚡

### 방법 2: Railway CLI (GitHub 없이 직접 배포)
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

## ⚠️ 문제 해결

### GitHub 인증 문제 시
```bash
# Personal Access Token 사용 (권장)
# GitHub Settings → Developer settings → Personal access tokens에서 토큰 생성
git remote set-url origin https://TOKEN@github.com/YOUR_USERNAME/economic-strategy-simulation.git
```

### SSH 키 사용 시
```bash
git remote add origin git@github.com:YOUR_USERNAME/economic-strategy-simulation.git
```

## 📋 체크리스트

- [ ] `git init` 실행
- [ ] `git add .` 실행  
- [ ] `git commit` 실행
- [ ] GitHub 저장소 생성
- [ ] `git remote add origin` 실행
- [ ] `git push` 실행
- [ ] Railway 배포 시작

---

💡 **팁**: GitHub 저장소가 없어도 Railway CLI로 직접 배포할 수 있습니다!
