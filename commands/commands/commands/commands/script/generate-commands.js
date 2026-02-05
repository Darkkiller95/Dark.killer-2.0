/**
 * Génère commandes placeholders dans commands/ pour atteindre un total.
 * Usage: node script/generate-commands.js [TOTAL]
 */
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
const TOTAL = arg ? parseInt(arg,10) : 100;

const dir = path.join(__dirname, '..', 'commands');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existingFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const existing = existingFiles.length;

let idx = 1;
let created = 0;
const existingNames = new Set(existingFiles.map(f=>path.basename(f,'.js')));

while (existing + created < TOTAL) {
  const name = `cmd${String(idx).padStart(3,'0')}`;
  idx++;
  if (existingNames.has(name)) continue;
  const p = path.join(dir, name + '.js');
  const content = `module.exports = {
  name: '${name}',
  triggers: ['${name}'],
  description: 'Placeholder ${name}',
  async handle() { return { type: 'text', body: 'Commande placeholder ${name} exécutée.' }; }
};`;
  fs.writeFileSync(p, content, { flag: 'wx' });
  created++;
  existingNames.add(name);
  console.log('Créé', p);
}

console.log('Terminé. Existant:', existing, 'Créés:', created, 'Total visé:', TOTAL);
