const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  // Extract path and strip query strings or hash
  let safePath = decodeURI(req.url.split('?')[0].split('#')[0]);
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  // Prevent directory traversal
  const normalizedPath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, normalizedPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404 - Page Not Found</h1>
          <p>The requested URL <code>${escapeHtml(safePath)}</code> was not found.</p>
          <a href="/" style="color: #4f46e5; font-weight: bold;">Return to CVCraft Home</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CVCraft Local Server is running!`);
  console.log(`👉 Home:      http://localhost:${PORT}/`);
  console.log(`👉 Builder:   http://localhost:${PORT}/builder.html`);
  console.log(`👉 Templates: http://localhost:${PORT}/templates.html`);
  console.log(`👉 Examples:  http://localhost:${PORT}/examples.html`);
  console.log(`======================================================\n`);
});
