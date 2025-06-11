import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 정적 파일 서빙
app.use(express.static(join(__dirname, 'dist')));

// SPA를 위한 fallback - 모든 요청을 index.html로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다`);
  console.log(`📱 앱 URL: http://localhost:${port}`);
});