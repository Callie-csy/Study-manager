// 简单的HTTP服务器
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  // 解析URL
  const parsedUrl = url.parse(req.url);
  // 获取路径
  let pathname = `.${parsedUrl.pathname}`;
  // 默认文件
  if (pathname === './') {
    pathname = './index.html';
  }

  // 获取文件扩展名
  const ext = path.parse(pathname).ext;
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  // 读取文件
  fs.readFile(pathname, (err, data) => {
    if (err) {
      // 文件不存在
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // 成功返回文件
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`);
  console.log('按 Ctrl+C 停止服务器');
});