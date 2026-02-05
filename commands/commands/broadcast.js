const config = require('../config');
const stateUtil = require('../utils/state');

module.exports = {
  name: 'broadcast',
  triggers: ['broadcast', 'bcast'],
  description: 'Envoyer broadcast (owner only): broadcast <message>',
  async handle({ from, text }) {
    if (!config.owners.includes(from)) {
      return { type: 'text', body: 'Accès refusé: commande réservée à owner.' };
    }
    const msg = text.split(/\s+/).slice(1).join(' ');
    if (!msg) return { type: 'text', body: 'Usage: broadcast <message>' };

    const db = stateUtil._raw();
    const targets = Object.keys(db);

    return { type: 'text', body: `Broadcast prêt pour ${targets.length} utilisateurs.\nMessage: ${msg}` };
  }
};
