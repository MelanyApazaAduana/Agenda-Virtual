import { createInflate } from 'zlib';
import { createReadStream, writeFileSync } from 'fs';
import { pipeline } from 'stream/promises';
import { promises as fsp } from 'fs';

const objects = [
  { name: 'Commit 1 (edbd160)', path: '.git/objects/ed/bd160d6565e99c5159d3ad20cd0c5f6fb2cf03' },
  { name: 'Commit 2 (af807451)', path: '.git/objects/af/807451f56885932eec38ca652f8219e27bc3bb' }
];

async function decompress(path) {
  const buf = await fsp.readFile(path);
  const zlib = await import('zlib');
  const deflated = zlib.inflateSync(buf);
  return deflated.toString('utf-8');
}

for (const obj of objects) {
  console.log(`\n\n========== ${obj.name} ==========`);
  const content = await decompress(obj.path);
  console.log(content);
}

// Also try to get the trees from the commit content
