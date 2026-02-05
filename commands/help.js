module.exports = {
  name: 'help',
  triggers: ['help', 'aide'],
  description: 'Afficher l\'aide',
  async handle() {
    const text = `Dark.killer - commandes principales:
- menu / vansmenu : afficher le menu complet
- quiz : lancer un quiz (plusieurs catégories)
- img <list|get|prompt> : gérer/obtenir images
- apk <list|get> : lister / obtenir apk
- profile : gérer profil
Tape "menu" pour le menu complet VANSBOT.`;
    return { type: 'text', body: text };
  }
};
