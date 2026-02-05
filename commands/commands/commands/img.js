const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = {
  name: 'img',
  triggers: ['img', 'image'],
  description: 'Gérer les images: img list | img get <name> | img <prompt> (si IA configurée)',
  async handle({ from, text, provider }) {
    const args = text.split(/\s+/).slice(1);
    const imagesDir = path.join(__dirname, '..', config.publicDir, 'images');

    if (!args.length || args[0] === 'list') {
      if (!fs.existsSync(imagesDir)) return { type: 'text', body: 'Aucune image disponible. Dépose des images dans public/images/' };
      const files = fs.readdirSync(imagesDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
      if (!files.length) return { type: 'text', body: 'Aucune image trouvée dans public/images/' };
      return { type: 'text', body: 'Images disponibles:\n' + files.join('\n') + '\nTape "img get <name>" pour recevoir une image.' };
    }

    if (args[0] === 'get' && args[1]) {
      const name = args.slice(1).join(' ');
      const filePath = path.join(imagesDir, name);
      if (!fs.existsSync(filePath)) return { type: 'text', body: 'Fichier introuvable: ' + name };
      if (provider === 'baileys') {
        return { type: 'media', body: `Image: ${name}`, mediaUrl: 'file://' + filePath };
      } else {
        const publicBase = process.env.PUBLIC_URL_BASE;
        if (!publicBase) return { type: 'text', body: 'Pour Twilio, définis PUBLIC_URL_BASE dans .env pointant vers le répertoire public.' };
        const url = `${publicBase}/images/${encodeURIComponent(name)}`;
        return { type: 'media', body: `Image: ${name}`, mediaUrl: url };
      }
    }

    const prompt = args.join(' ');
    return { type: 'text', body: `Prompt reçu: "${prompt}". (Génération d'images IA non configurée ici)` };
  }
};
