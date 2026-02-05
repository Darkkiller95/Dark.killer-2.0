module.exports = {
  name: 'vans_arsenal',
  triggers: ['menu', 'vansmenu', 'arsenal', 'vansbot', 'vans'],
  description: 'Affiche le menu VANSBOT V5.1',
  async handle() {
    const menu = `╔═════════════════

 *VANSBOT V5.1 - ⚔️ TOJI'S COMMAND ARSENAL⚔️*   

╠═════════════════

 *🖤Le tueur de sorciers vous salue !*

╚═════════════════

UTILISATEUR STANDARD (PLAN GRATUIT)

┌─ 👑 Admin Tools
│ • admincheck
│ • tagadmin
└──────────────────────

┌─ 🛡️ Anti Features
│ • antiaudio
│ • antidemote
│ • antiforbidden
│ • antiimage
│ • antilink
│ • antipromote
│ • antispam
│ • antistatut
│ • antisticker
│ • antitag
│ • antitransfer
│ • antivideo
│ • antibot
└──────────────────────

┌─ 🤖 Auto Features
│ • autoreact
│ • autovustatut
│ • autowrite
└──────────────────────

┌─ 🎥 Media Management
│ • deletemedia
│ • listmedia
│ • playaudio
│ • playvideo
│ • sendaudio
│ • senddocument
│ • sendimage
│ • sendsticker
│ • sendvideo
│ • takesticker
│ • tosticker
│ • tomp3
│ • youtube
└──────────────────────

┌─ ⚖️ Moderation
│ • demote
│ • demute
│ • kick
│ • kickall
│ • mute
│ • promote
│ • block
│ • unblock
└──────────────────────

┌─ ℹ️ Information
│ • getid
│ • getinfo
│ • getpp
│ • groupinfo
└──────────────────────

┌─ 🎮 Fun & Games
│ • mindset
│ • motivation
│ • quiz
└──────────────────────

┌─ 🔧 Utility
│ • geolocalisation
│ • ping
│ • searchimage
│ • tiktok
│ • vv
└──────────────────────

┌─ ⚙️ Settings
│ • setpp
│ • setprefix
│ • vcfgroupe
│ • setprivate
│ • setpublic
│ • setmenuaudio
│ • setmenuvideo
│ • setlitemode
│ • setfullmode
└──────────────────────

┌─ 👋 Social
│ • goodbye
│ • welcome
└──────────────────────

┌─ 🛒 Store
│ • store
└──────────────────────

┌─ 👤 Sudo
│ • sudo
└──────────────────────

┌─ 🏷️ Tagging
│ • tagall
│ • tagoffline
│ • tagonline
└──────────────────────

┌─ 🏆 Ranking
│ • ranking
└──────────────────────

┌─ 💬 Responder
│ • responder
└──────────────────────

┌─ 📝 List
│ • listcommands
└──────────────────────

┌─ 📚 Help
│ • help
└──────────────────────

*🗡️ Utilisez ces commandes avec la froide précision de Toji Fushiguro.*
 
> POWERED BY VANSCODE`;
    return { type: 'text', body: menu };
  }
};
