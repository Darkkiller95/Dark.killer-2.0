const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = {
  name: 'apk',
  triggers: ['apk'],
  description: 'Gérer APK: apk list | apk get <name>',
  async handle({ text }) {
    const args = text.split(/\s+/).slice(1);
    const apksDir = path.join(__dirname, '..', config.publicDir, 'apk');

    if (!args.length || args[0] === 'list') {
      if (!fs.existsSync(apksDir)) return { type: 'text', body: 'Aucun APK disponible. Dépose des fichiers dans public/apk/' };
      const files = fs.readdirSync(apksDir).filter(f => /\.apk$/i.test(f));
      if (!files.length) return { type: 'text', body: 'Aucun APK trouvé dans public/apk/' };
      return { type: 'text', body: 'APK disponibles:\n' + files.join('\n') + '\nTape "apk get <name>" pour obtenir le lien.' };
    }

    if (args[0] === 'get' && args[1]) {
      const name = args.slice(1).join(' ');
      const filePath = path.join(apksDir, name);
      if (!fs.existsSync(filePath)) return { type: 'text', body: 'APK introuvable: ' + name };
      const publicBase = process.env.PUBLIC_URL_BASE;
      if (!publicBase) return { type: 'text', body: 'Définis PUBLIC_URL_BASE dans .env pointant vers le dossier public.' };
      const url = `${publicBase}/apk/${encodeURIComponent(name)}`;
      return { type: 'text', body: `Télécharge: ${url}` };
    }

    return { type: 'text', body: 'Usage: apk list | apk get <name>' };
  }
};
