# Node.js 18 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production --silent

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 포트 설정
EXPOSE 3000

# 서버 시작
CMD ["npm", "start"]
