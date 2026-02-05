module.exports = {
  name: 'start',
  triggers: ['start', 'démarrer', 'demarrer'],
  description: 'Message de bienvenue',
  async handle() {
    const msg = `Bienvenue sur Dark.killer 👋\nTape "help" pour les commandes.\nPour commencer: tape "quiz" ou "menu".`;
    return { type: 'text', body: msg };
  }
};
