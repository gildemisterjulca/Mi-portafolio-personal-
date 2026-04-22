/* ═══════════════════════════════════════════════════
   PROYECCIÓN UNIFSLB — JAVASCRIPT PRINCIPAL
   ═══════════════════════════════════════════════════ */

/* ── HERO CANVAS ── */
const heroCanvas = document.getElementById('heroCanvas');
const hctx = heroCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * heroCanvas.width;
    this.y = Math.random() * heroCanvas.height;
    this.vx = (Math.random() - .5) * .6;
    this.vy = (Math.random() - .5) * .6;
    this.r = Math.random() * 2.5 + .5;
    this.alpha = Math.random() * .5 + .1;
    this.color = Math.random() > .5 ? '0,229,176' : '245,166,35';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > heroCanvas.width || this.y < 0 || this.y > heroCanvas.height) this.reset();
  }
  draw() {
    hctx.beginPath();
    hctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    hctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    hctx.fill();
  }
}

for (let i = 0; i < 110; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        hctx.beginPath();
        hctx.moveTo(particles[i].x, particles[i].y);
        hctx.lineTo(particles[j].x, particles[j].y);
        hctx.strokeStyle = `rgba(0,229,176,${.12 * (1 - dist / 100)})`;
        hctx.lineWidth = .6;
        hctx.stroke();
      }
    }
  }
}

function animateHero() {
  hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateHero);
}
animateHero();

/* ── SLIDES ── */
let currentSlide = 0;
const totalSlides = 8;
const allSlides = document.querySelectorAll('.slide');
const progressFill = document.getElementById('slideProgress');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const dotsContainer = document.getElementById('slideDots');

for (let i = 0; i < totalSlides; i++) {
  const d = document.createElement('div');
  d.className = 'sdot' + (i === 0 ? ' active' : '');
  d.onclick = () => goToSlide(i);
  dotsContainer.appendChild(d);
}

function goToSlide(n) {
  allSlides[currentSlide].classList.remove('active');
  allSlides[currentSlide].classList.add('exit-left');
  setTimeout(() => allSlides[currentSlide].classList.remove('exit-left'), 500);
  currentSlide = n;
  allSlides[currentSlide].classList.add('active');
  updateSlideUI();
}

function changeSlide(dir) {
  const n = currentSlide + dir;
  if (n < 0 || n >= totalSlides) return;
  goToSlide(n);
}

function updateSlideUI() {
  progressFill.style.width = (((currentSlide + 1) / totalSlides) * 100).toFixed(1) + '%';
  document.querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  prevSlideBtn.disabled = currentSlide === 0;
  nextSlideBtn.disabled = currentSlide === totalSlides - 1;
}
updateSlideUI();

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'ArrowLeft') changeSlide(-1);
});

/* ── Q&A ── */
const qnaData = [
  { q: '¿Qué me llamó más la atención de la carrera de Educación Tecnológica?', a: 'Reflexiona sobre los aspectos que más te motivaron: ¿la tecnología, la enseñanza, el enfoque intercultural o las oportunidades laborales en tu región?' },
  { q: '¿Cómo puede la tecnología mejorar la educación en comunidades Awajún y Wampis?', a: 'Piensa en plataformas digitales en lengua originaria, preservación cultural digital, conectividad rural y recursos educativos adaptados a la cosmovisión amazónica.' },
  { q: '¿Qué diferencia a la UNIFSLB de otras universidades del Perú?', a: 'Su enfoque intercultural, ubicación en la Amazonía, convivencia activa con pueblos originarios y compromiso con el desarrollo regional sostenible hacen de la UNIFSLB una universidad única en el país.' },
  { q: '¿Cuáles son los pasos para obtener el Título Profesional de Licenciado en Educación?', a: 'Primero el Grado de Bachiller (10 semestres, 214 créditos, dominio de idioma), luego la aprobación de una tesis de investigación y los demás requisitos del reglamento de grados y títulos de la UNIFSLB.' },
];

const qnaGrid = document.getElementById('qnaGrid');
qnaData.forEach((item, i) => {
  qnaGrid.innerHTML += `<div class="qna-item" id="qna${i}"><div class="qna-q" onclick="toggleQna(${i})"><span>${item.q}</span><span class="toggle">+</span></div><div class="qna-a">${item.a}</div></div>`;
});

function toggleQna(i) { document.getElementById('qna' + i).classList.toggle('open'); }

/* ── TRIVIA GAME ── */
const questions = [
  { cat: '🎓 La Carrera', text: '¿Cuántos semestres dura la carrera de Educación Tecnológica en la UNIFSLB?', opts: ['8 semestres', '10 semestres', '12 semestres', '6 semestres'], correct: 1, exp: '¡Correcto! Son 10 semestres académicos, equivalentes a 5 años de formación profesional.' },
  { cat: '📘 Créditos', text: '¿Cuántos créditos académicos se necesitan para obtener el Grado de Bachiller?', opts: ['180 créditos', '200 créditos', '214 créditos', '250 créditos'], correct: 2, exp: '¡Exacto! Se requieren 214 créditos aprobados para alcanzar el Grado de Bachiller en Educación.' },
  { cat: '🌿 Interculturalidad', text: '¿Con cuáles pueblos originarios comparte identidad la UNIFSLB?', opts: ['Shipibo y Asháninka', 'Awajún y Wampis', 'Quechua y Aymara', 'Matsés y Kukama'], correct: 1, exp: '¡Muy bien! La UNIFSLB tiene un fuerte vínculo cultural con las etnias Awajún y Wampis de la Amazonía peruana.' },
  { cat: '💼 Titulación', text: '¿Qué se necesita para obtener el Título de Licenciado en Educación en la UNIFSLB?', opts: ['Solo el Bachillerato', 'Bachillerato + examen oral', 'Bachillerato + tesis aprobada', 'Solo aprobar los cursos'], correct: 2, exp: 'Correcto. Primero debes tener el Grado de Bachiller y luego aprobar una tesis de investigación.' },
  { cat: '💻 Tecnología', text: '¿Qué significa "TIC" en el contexto educativo?', opts: ['Técnicas de Instrucción Continua', 'Tecnologías de la Información y Comunicación', 'Temas Interculturales y Culturales', 'Talleres de Informática y Cómputo'], correct: 1, exp: '¡Bien! TIC = Tecnologías de la Información y Comunicación. Son herramientas clave en esta carrera profesional.' },
  { cat: '📍 UNIFSLB', text: '¿Dónde está ubicada la sede de la UNIFSLB?', opts: ['Jr. Amazonas N° 100, Chachapoyas', 'Jr. Ancash N° 520, Bagua, Amazonas', 'Av. Universitaria s/n, Utcubamba', 'Calle Principal s/n, Santa María de Nieva'], correct: 1, exp: '¡Exacto! La UNIFSLB está en Jirón Ancash N° 520, en la ciudad de Bagua, región Amazonas, Perú.' },
  { cat: '🎯 Perfil Ingresante', text: '¿Cuál de estas habilidades NO es parte del perfil del ingresante a Educación Tecnológica?', opts: ['Pasión por la tecnología y la enseñanza', 'Manejo básico de computadoras', 'Experiencia de 2 años en programación avanzada', 'Aptitud para el trabajo en equipo'], correct: 2, exp: 'Correcto. Se requieren conocimientos BÁSICOS, no experiencia avanzada. La carrera te forma desde tus bases.' },
  { cat: '🏫 Campo Laboral', text: '¿En qué ámbitos puede trabajar un egresado de Educación Tecnológica de la UNIFSLB?', opts: ['Solo en colegios privados', 'Solo en el sector público', 'Colegios, sector público, emprendimiento y comunidades', 'Solo en empresas de tecnología'], correct: 2, exp: '¡Excelente! El campo laboral es muy amplio: docencia, UGEL, DRE, emprendimiento, consultoría TIC y proyectos comunitarios.' },
  { cat: '🔬 Investigación', text: '¿Cuál es el nombre de la revista científica e intercultural de la UNIFSLB?', opts: ['Revista Amazónica', 'MANGUARÉ', 'Revista Awajún', 'Bagua Científica'], correct: 1, exp: '¡Muy bien! MANGUARÉ es la Revista Intercultural de la UNIFSLB, donde se publican investigaciones de la comunidad universitaria.' },
  { cat: '🌐 Admisión', text: '¿Qué valora especialmente el perfil del ingresante según el enfoque intercultural de la UNIFSLB?', opts: ['Dominar solo el español', 'Expresión en lengua originaria Y en español', 'Solo conocimientos de matemática avanzada', 'Haber estudiado en colegio privado'], correct: 1, exp: '¡Perfecto! El perfil valora la expresión en lengua originaria Y español, reflejando el enfoque intercultural único de la UNIFSLB.' },
];

let currentQ = 0, score = 0, streak = 0, answered = false, timerInterval = null, timeLeft = 20, shuffledQ = [];
const CIRC = 138.23;

function shuffleArray(arr) { return [...arr].sort(() => Math.random() - .5); }

function startGame() {
  shuffledQ = shuffleArray(questions); currentQ = 0; score = 0; streak = 0; answered = false;
  document.getElementById('questionArea').style.display = 'block';
  document.getElementById('resultsScreen').style.display = 'none';
  updateScore(); renderQuestion();
}

function renderQuestion() {
  if (currentQ >= shuffledQ.length) { showResults(); return; }
  answered = false;
  const q = shuffledQ[currentQ];
  document.getElementById('qCategory').textContent = q.cat;
  document.getElementById('qText').textContent = q.text;
  document.getElementById('questionCounter').textContent = `${currentQ + 1} / ${shuffledQ.length}`;
  document.getElementById('feedbackToast').style.display = 'none';
  document.getElementById('nextQBtn').style.display = 'none';
  const grid = document.getElementById('optionsGrid');
  const letters = ['A', 'B', 'C', 'D'];
  const indices = [0, 1, 2, 3];
  const shuffled = shuffleArray(indices);
  const newCorrect = shuffled.indexOf(q.correct);
  grid.innerHTML = '';
  shuffled.forEach((origIdx, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.correct = (i === newCorrect) ? '1' : '0';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${q.opts[origIdx]}`;
    btn.onclick = () => selectOption(btn, i === newCorrect, q.exp);
    grid.appendChild(btn);
  });
  const card = document.getElementById('questionCard');
  card.style.animation = 'none'; card.offsetHeight; card.style.animation = 'fadeUp .4s ease';
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval); timeLeft = 20; updateTimerUI();
  timerInterval = setInterval(() => {
    timeLeft--; updateTimerUI();
    if (timeLeft <= 0) { clearInterval(timerInterval); if (!answered) timeOut(); }
  }, 1000);
}

function updateTimerUI() {
  document.getElementById('timerText').textContent = timeLeft;
  const pct = timeLeft / 20;
  document.getElementById('timerRing').style.strokeDashoffset = CIRC * (1 - pct);
  const col = pct > .5 ? '0,229,176' : pct > .25 ? '245,166,35' : '232,52,74';
  document.getElementById('timerRing').style.stroke = `rgb(${col})`;
  document.getElementById('timerText').style.color = `rgb(${col})`;
}

function timeOut() {
  answered = true; streak = 0; updateScore();
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.correct === '1') btn.classList.add('correct');
  });
  showFeedback(false, '⏰ ¡Tiempo agotado! La respuesta correcta está marcada en verde.');
  document.getElementById('nextQBtn').style.display = 'block';
}

function selectOption(btn, isCorrect, exp) {
  if (answered) return;
  answered = true; clearInterval(timerInterval);
  document.querySelectorAll('.option-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === '1') b.classList.add('correct');
  });
  if (isCorrect) {
    btn.classList.add('correct');
    const bonus = timeLeft >= 15 ? 15 : timeLeft >= 10 ? 10 : 5;
    score += bonus; streak++;
    showFeedback(true, `✅ ¡Correcto! +${bonus} puntos (racha: ${streak} 🔥). ${exp}`);
  } else {
    btn.classList.add('wrong'); streak = 0;
    showFeedback(false, `❌ Incorrecto. ${exp}`);
  }
  updateScore(); document.getElementById('nextQBtn').style.display = 'block';
}

function showFeedback(correct, msg) {
  const t = document.getElementById('feedbackToast');
  t.className = 'feedback-toast ' + (correct ? 'correct-fb' : 'wrong-fb');
  t.textContent = msg; t.style.display = 'block';
}

function updateScore() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('streakDisplay').textContent = streak;
}

function nextQuestion() { currentQ++; renderQuestion(); }

function showResults() {
  clearInterval(timerInterval);
  document.getElementById('questionArea').style.display = 'none';
  document.getElementById('resultsScreen').style.display = 'block';
  const maxScore = shuffledQ.length * 15;
  const pct = score / maxScore;
  let trophy, msg;
  if (pct >= .8) { trophy = '🏆'; msg = '¡Extraordinario! Tienes un conocimiento sólido sobre la carrera de Educación Tecnológica de la UNIFSLB. ¡Tienes todas las condiciones para ser un excelente docente tecnológico del futuro!'; }
  else if (pct >= .6) { trophy = '🥈'; msg = '¡Muy bien! Conoces bastante sobre esta carrera. Te invitamos a repasar las diapositivas y visitar el sitio oficial de la UNIFSLB para profundizar tu conocimiento.'; }
  else if (pct >= .4) { trophy = '🥉'; msg = '¡Buen intento! Hay cosas interesantes por descubrir sobre esta carrera. Repasa las diapositivas y vuelve a jugar. ¡Cada intento te acerca más a tu vocación!'; }
  else { trophy = '📚'; msg = '¡Esta es tu primera exploración! Revisa las diapositivas con atención y visita el sitio oficial de la UNIFSLB. Luego, ¡vuelve a intentarlo!'; }
  document.getElementById('resultsTrophy').textContent = trophy;
  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalOutOf').textContent = `de ${maxScore} puntos posibles`;
  document.getElementById('resultsMessage').textContent = msg;
  if (pct >= .6) launchConfetti();
}

function restartGame() { startGame(); }

/* ── CONFETTI ── */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const confetti = [];
  const colors = ['#00e5b0', '#f5a623', '#c45e1a', '#1ea87a', '#7c3aed', '#e8344a', '#ffffff'];
  for (let i = 0; i < 200; i++) confetti.push({ x: Math.random() * canvas.width, y: Math.random() * -canvas.height, w: Math.random() * 12 + 4, h: Math.random() * 6 + 3, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - .5) * 4, vy: Math.random() * 5 + 3, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .1 });
  let frames = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => { c.x += c.vx; c.y += c.vy; c.rot += c.vrot; ctx.save(); ctx.translate(c.x + c.w / 2, c.y + c.h / 2); ctx.rotate(c.rot); ctx.fillStyle = c.color; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h); ctx.restore(); });
    frames++; if (frames < 200) requestAnimationFrame(draw); else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  }
  draw();
}

/* ── NAV ── */
function jumpSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const navSections = [
  { id: 'slidesSection', label: '📊 Exposición' },
  { id: 'campoSection', label: '💼 Campo Laboral' },
  { id: 'bibliotecaSection', label: '📚 Biblioteca' },
  { id: 'juegoPromoSection', label: '🎮 Juego' },
  { id: 'gameSection', label: '🧩 Trivia' },
];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  navSections.forEach(sec => {
    const el = document.getElementById(sec.id);
    const lbl = document.querySelector(`.nav-label[data-section="${sec.id}"]`);
    if (el && lbl) {
      const top = el.offsetTop;
      const bot = top + el.offsetHeight;
      lbl.classList.toggle('active', scrollY >= top && scrollY < bot);
    }
  });
});

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  const startGameBtn = document.getElementById('startGameBtn');
  const gameIntro = document.getElementById('gameIntro');
  const questionArea = document.getElementById('questionArea');
  const scoreBar = document.querySelector('.score-bar');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      if (gameIntro) gameIntro.style.display = 'none';
      if (scoreBar) scoreBar.style.display = 'flex';
      if (questionArea) questionArea.style.display = 'block';
      startGame();
    });
  }

  /* ── MUSIC CONTROL ── */
  const musicControlBtn = document.getElementById('musicControlBtn');
  const backgroundMusic = document.getElementById('backgroundMusic');

  if (musicControlBtn && backgroundMusic) {
      const iconPlay = musicControlBtn.querySelector('.icon-play');
      const iconPause = musicControlBtn.querySelector('.icon-pause');

      musicControlBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // La reproducción comenzó exitosamente
                    if(iconPlay) iconPlay.style.display = 'none';
                    if(iconPause) iconPause.style.display = 'inline';
                }).catch(error => {
                    // La reproducción fue bloqueada
                    console.error("La reproducción de audio fue bloqueada por el navegador:", error);
                    // No cambiamos el ícono porque la música no está sonando
                    if(iconPlay) iconPlay.style.display = 'inline';
                    if(iconPause) iconPause.style.display = 'none';
                });
            }
        } else {
            backgroundMusic.pause();
            if(iconPlay) iconPlay.style.display = 'inline';
            if(iconPause) iconPause.style.display = 'none';
        }
    });
  }
});