require('dotenv').config();
const provider = (process.env.PROVIDER || 'baileys').toLowerCase();
console.log('Démarrage Dark.killer - provider =', provider);

if (provider === 'baileys') {
  require('./providers/baileys');
} else {
  console.error('PROVIDER non supporté. Mets PROVIDER=baileys dans .env');
  process.exit(1);
}
