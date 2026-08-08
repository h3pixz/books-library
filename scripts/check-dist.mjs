import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

const entries = readdirSync(distDir);
const htmlFiles = entries.filter((name) => name.endsWith('.html'));
const jsFiles = entries.filter((name) => name.endsWith('.js'));
const assetsDir = entries.find(
  (name) => name === 'assets' && statSync(join(distDir, name)).isDirectory()
);

const hasIndexHtml = htmlFiles.includes('index.html');
const hasSingleJs = jsFiles.length === 1;
const hasAssetsDir = Boolean(assetsDir);
const onlyThreeEntries = entries.length === 3;

console.log(`dist/ contents: ${entries.join(', ')}`);

if (hasIndexHtml && hasSingleJs && hasAssetsDir && onlyThreeEntries) {
  console.log('OK: build output matches the 3-artifact requirement.');
  process.exit(0);
} else {
  console.error('FAIL: expected exactly index.html, one JS bundle and one assets/ folder.');
  process.exit(1);
}
