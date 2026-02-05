module.exports = {
  name: 'profile',
  triggers: ['profile', 'profil'],
  description: 'Voir ou définir le pseudo: ex "profile set MonPseudo"',
  async handle({ from, text, state }) {
    const parts = text.split(/\s+/).slice(1);
    const user = state.getUser(from) || {};
    if (parts[0] === 'set' && parts[1]) {
      const name = parts.slice(1).join(' ');
      user.name = name;
      state.setUser(from, user);
      return { type: 'text', body: `Nom enregistré: ${name}` };
    }
    const name = user.name || 'inconnu';
    const msg = `Profil:\n- Numéro: ${from}\n- Nom: ${name}`;
    return { type: 'text', body: msg };
  }
};
