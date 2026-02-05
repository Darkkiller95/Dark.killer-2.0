const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'data', 'state.json');

let store = {};
try {
  if (fs.existsSync(FILE)) store = JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}');
} catch (e) {
  store = {};
}

function persist() {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('Erreur écriture state.json', e);
  }
}

module.exports = {
  getUser: (id) => store[id],
  setUser: (id, obj) => { store[id] = obj; persist(); },
  deleteUser: (id) => { delete store[id]; persist(); },
  _raw: () => store
};
