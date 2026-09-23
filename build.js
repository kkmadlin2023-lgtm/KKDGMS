const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('[Build] Packaging KKDGMS static assets into dist/ for Vercel deployment...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const entries = fs.readdirSync(rootDir);

for (const entry of entries) {
  if (['dist', 'node_modules', '.git', 'package-lock.json', 'bun.lock'].includes(entry)) {
    continue;
  }

  const srcPath = path.join(rootDir, entry);
  const destPath = path.join(distDir, entry);

  try {
    fs.cpSync(srcPath, destPath, { recursive: true });
  } catch (err) {
    console.warn(`Could not copy ${entry}:`, err.message);
  }
}

console.log('[Build] Deployment bundle ready in dist/ with total entries:', fs.readdirSync(distDir).length);
