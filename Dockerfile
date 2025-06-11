# Node.js 18 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들 복사
COPY package*.json ./

# 모든 의존성 설치 (빌드를 위해 devDependencies도 필요)
RUN npm ci --silent

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 프로덕션 의존성만 재설치 (빌드 후 용량 최적화)
RUN npm ci --only=production --silent && npm cache clean --force

# 포트 설정
EXPOSE 3000

# 서버 시작
CMD ["npm", "start"]
