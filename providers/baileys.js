const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const P = require('pino');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Auth file placé dans ./auth/auth_info_multi.json (persisté par Docker volume)
const authDir = path.join(__dirname, '..', 'auth');
const authFile = path.join(authDir, 'auth_info_multi.json');

if (!fs.existsSync(authDir)) {
  try { fs.mkdirSync(authDir, { recursive: true }); } catch (e) { /* ignore */ }
}

const { state, saveState } = useSingleFileAuthState(authFile);

async function start() {
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) console.log('QR code generated - scanne le QR avec ton WhatsApp pour lier le bot.');
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log('Connection close - reconnect?', shouldReconnect);
      if (shouldReconnect) start();
    } else if (connection === 'open') {
      console.log('Baileys connecté ✅');
    }
  });

  const commands = loadCommands();

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages?.[0];
    if (!msg || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
    if (!text) return;

    console.log('[baileys] message from', from, text);
    const lower = text.toLowerCase();

    // state
    const stateUtil = require('../utils/state');
    const user = stateUtil.getUser(from);

    if (user && user.step && user.step.startsWith('quiz:')) {
      const quiz = Object.values(commands).find(c => c.name === 'quiz');
      if (quiz) {
        const resp = await quiz.handle({ from, text: lower, state: stateUtil, provider: 'baileys', config });
        return sendRespBaileys(sock, from, resp);
      }
    }

    const first = lower.split(/\s+/)[0] || '';
    const cmd = commands[first];
    if (!cmd) return sock.sendMessage(from, { text: `Tape "help" pour le menu.` });

    try {
      const resp = await cmd.handle({ from, text: lower, state: stateUtil, provider: 'baileys', config });
      return sendRespBaileys(sock, from, resp);
    } catch (e) {
      console.error('Erreur commande', e);
      return sock.sendMessage(from, { text: 'Erreur interne.' });
    }
  });
}

function loadCommands() {
  const dir = path.join(__dirname, '..', 'commands');
  const cmds = {};
  fs.readdirSync(dir).forEach(f => {
    if (!f.endsWith('.js')) return;
    const c = require(path.join(dir, f));
    (c.triggers || []).forEach(t => cmds[t] = c);
  });
  return cmds;
}

async function sendRespBaileys(sock, to, resp) {
  if (!resp) return sock.sendMessage(to, { text: '' });

  if (resp.type === 'media' && resp.mediaUrl) {
    if (resp.mediaUrl.startsWith('file://')) {
      const filePath = resp.mediaUrl.replace('file://', '');
      return sock.sendMessage(to, { image: { url: filePath }, caption: resp.body || '' });
    }
    return sock.sendMessage(to, { image: { url: resp.mediaUrl }, caption: resp.body || '' });
  }

  return sock.sendMessage(to, { text: resp.body || '' });
}

start().catch(console.error);
