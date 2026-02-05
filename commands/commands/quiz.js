const qs = require('../data/questions.json');
const config = require('../config');

function shuffle(a){ return a.sort(()=>Math.random()-0.5); }

module.exports = {
  name: 'quiz',
  triggers: ['quiz', 'quizz', '/quiz'],
  description: 'Lancer un quiz. Ex: "quiz" puis choix de catégorie.',
  async handle({ from, text, state }) {
    const user = state.getUser(from) || {};

    if (text === 'quiz' || text === '/quiz' || text === 'quizz') {
      user.step = 'quiz:choose_category';
      state.setUser(from, user);
      const cats = Object.keys(qs).map(c => `- ${c}`).join('\n');
      return { type: 'text', body: `Choisis une catégorie:\n${cats}\n\nRéponds par le nom exact.` };
    }

    if (user.step === 'quiz:choose_category') {
      const chosen = text.toLowerCase();
      const possible = Object.keys(qs);
      const found = possible.find(p => p.toLowerCase() === chosen || p.replace(/[-_ ]/g,'').includes(chosen.replace(/[-_ ]/g,'')));
      if (!found) return { type: 'text', body: `Catégorie inconnue. Choisis parmi: ${possible.join(', ')}` };

      const pool = shuffle(qs[found]);
      const size = config.defaultQuizSize || 5;
      user.step = 'quiz:in_progress';
      user.quiz = { category: found, questions: pool.slice(0, size), index: 0, score: 0, total: size };
      state.setUser(from, user);
      return { type: 'text', body: formatQuestion(user.quiz.questions[0], 1) };
    }

    if (user.step === 'quiz:in_progress' && user.quiz) {
      const current = user.quiz;
      const qObj = current.questions[current.index];
      const ans = text.trim().toLowerCase();
      let correct = false;

      if (/^[1-9][0-9]*$/.test(ans)) {
        const idx = parseInt(ans,10)-1;
        if (qObj.choices[idx] && qObj.choices[idx].toLowerCase() === qObj.answer.toLowerCase()) correct = true;
      } else {
        if (ans === qObj.answer.toLowerCase()) correct = true;
      }

      let reply = correct ? '✅ Bonne réponse!\n' : `❌ Mauvaise. Réponse: ${qObj.answer}\n`;
      if (correct) current.score++;
      current.index++;

      if (current.index >= current.total) {
        reply += `\nFin du quiz "${current.category}". Score: ${current.score}/${current.total}\nTape "quiz" pour rejouer.`;
        delete user.quiz;
        user.step = null;
        state.setUser(from, user);
        return { type: 'text', body: reply };
      } else {
        state.setUser(from, user);
        reply += '\n' + formatQuestion(current.questions[current.index], current.index+1);
        return { type: 'text', body: reply };
      }
    }

    return { type: 'text', body: 'Tape "quiz" pour commencer un quiz.' };
  }
};

function formatQuestion(q, num){
  let s = `Q${num}: ${q.q}\n`;
  q.choices.forEach((c,i)=> s+=`${i+1}) ${c}\n`);
  s += `\nRéponds par le numéro ou le texte.`;
  return s;
              }
