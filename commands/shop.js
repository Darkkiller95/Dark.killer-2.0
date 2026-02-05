// Boutique minimal : catalogue en mémoire
const CATALOG = [
  { id: 1, name: 'Vans Classic', price: 70 },
  { id: 2, name: 'Vans Pro', price: 90 },
  { id: 3, name: 'Sneaker Dark', price: 85 }
];

module.exports = {
  name: 'shop',
  triggers: ['shop', 'boutique'],
  description: 'Afficher catalogue ou product <id>',
  async handle({ text }) {
    const parts = text.split(/\s+/).slice(1);
    if (parts[0] === 'product' && parts[1]) {
      const id = parseInt(parts[1], 10);
      const p = CATALOG.find(x => x.id === id);
      if (!p) return { type: 'text', body: 'Produit introuvable.' };
      return { type: 'text', body: `${p.name} - ${p.price}€\nCommande: "order create ${p.id}"` };
    }
    let s = 'Catalogue:\n';
    CATALOG.forEach(p => s += `${p.id}) ${p.name} - ${p.price}€\n`);
    s += '\nVoir produit: "shop product <id>"';
    return { type: 'text', body: s };
  }
};
