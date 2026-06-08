import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEB_BACKEND_URL =
  process.env.WEB_BACKEND_URL || 'http://localhost:3000/api/auth/protected/sync-tally-to-web';
const API_SECRET = process.env.LOCAL_BRIDGE_SECRET || 'LOCAL_BRIDGE_SECRET_123';
const sampleXml = fs.readFileSync(path.join(__dirname, 'sample-stock-summary.xml'), 'utf8');

console.log('Posting sample Tally XML to backend...');
console.log('URL:', WEB_BACKEND_URL);

const response = await fetch(WEB_BACKEND_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_SECRET}`,
  },
  body: JSON.stringify({ tallyXml: sampleXml }),
});

const body = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error('FAILED:', response.status, body);
  process.exit(1);
}

console.log('SUCCESS:', body);
