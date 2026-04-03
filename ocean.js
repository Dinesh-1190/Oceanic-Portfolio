/* ═══════════════════════════════════════════════════════════
   DINESH KUMAR PATTANAIK — DEEP OCEAN PORTFOLIO
   JavaScript · All Animations & Interactions
   Fish · Sharks · Bubbles · Flashlight · Parallax · Canvas
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Footer Year ────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ─── Hamburger ──────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});
mobileMenu.querySelectorAll('.mob-link').forEach(l =>
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

// ─── Navbar scroll ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Active nav link ────────────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');
const depthFill  = document.getElementById('depthFill');
const depthValue = document.getElementById('depthValue');
const depthMap   = { hero: '0m', about: '40m', skills: '200m', projects: '1000m', contact: '3800m' };
const depthPct   = { hero: 0, about: 20, skills: 45, projects: 75, contact: 100 };

function updateDepth() {
  let current = 'hero';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  depthFill.style.width  = (depthPct[current] ?? 0) + '%';
  depthValue.textContent = depthMap[current] ?? '0m';
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateDepth, { passive: true });
updateDepth();

// ─── Scroll Reveal ──────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ═══════════════════════════════════════════════════════════
// 🫧 BUBBLE SYSTEM
// ═══════════════════════════════════════════════════════════
function createBubble() {
  const container = document.getElementById('bubbles-global');
  const b   = document.createElement('div');
  const sz  = Math.random() * 18 + 4;
  const dur = Math.random() * 10 + 7;
  const x   = Math.random() * 100;
  const delay = Math.random() * 8;
  b.className = 'bubble';
  b.style.cssText = `
    left:${x}%;
    width:${sz}px; height:${sz}px;
    animation-duration:${dur}s;
    animation-delay:${delay}s;
    opacity:${Math.random() * 0.5 + 0.1};
  `;
  container.appendChild(b);
  b.addEventListener('animationend', () => { b.remove(); createBubble(); });
}
// Reduce bubbles on mobile
const isMobile = window.innerWidth <= 768;
const bubbleCount = isMobile ? 15 : 45;
for (let i = 0; i < bubbleCount; i++) createBubble();

// ═══════════════════════════════════════════════════════════
// ☀️ SUN RAYS — HERO
// ═══════════════════════════════════════════════════════════
const sunRaysContainer = document.getElementById('sunRays');
const numRays = isMobile ? 8 : 14;
for (let i = 0; i < numRays; i++) {
  const ray = document.createElement('div');
  ray.className = 'sun-ray';
  const angle = (i / numRays) * 360;
  const opacity = Math.random() * 0.25 + 0.05;
  const h = Math.random() * 40 + 60;
  ray.style.cssText = `
    transform: rotate(${angle}deg);
    opacity: ${opacity};
    height: ${h}vh;
    animation: ray-flicker ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite;
  `;
  sunRaysContainer.appendChild(ray);
}
// Add ray flicker keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ray-flicker {
    0%, 100% { opacity: var(--base-op, 0.1); }
    50% { opacity: calc(var(--base-op, 0.1) * 2.5); }
  }
`;
document.head.appendChild(styleSheet);

// ═══════════════════════════════════════════════════════════
// 🌊 AMBIENT PARTICLES CANVAS (global floating dust)
// ═══════════════════════════════════════════════════════════
(function initAmbient() {
  // Skip heavy canvas animation on mobile
  if (isMobile) return;
  
  const canvas = document.getElementById('ambient-particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      color: `hsl(${180 + Math.random() * 60}, 80%, 70%)`
    });
  }

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(tick);
  })();
})();

// ═══════════════════════════════════════════════════════════
// 🐠 FISH SYSTEM — ABOUT SECTION (Canvas)
// ═══════════════════════════════════════════════════════════
(function FishSystem() {
  const canvas = document.getElementById('fish-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const fish = [];

  const FISH_COLORS = [
    { body: '#FF6B35', fin: '#FF4500', stripe: 'rgba(255,255,255,0.6)' },
    { body: '#FF8C00', fin: '#FF6000', stripe: 'rgba(255,255,255,0.4)' },
    { body: '#00CED1', fin: '#008B8B', stripe: 'rgba(255,255,0,0.35)' },
    { body: '#FFD700', fin: '#FFA500', stripe: 'rgba(0,100,0,0.3)' },
    { body: '#9370DB', fin: '#6A0DAD', stripe: 'rgba(255,255,255,0.3)' },
    { body: '#32CD32', fin: '#228B22', stripe: 'rgba(255,255,0,0.3)' },
    { body: '#FF69B4', fin: '#FF1493', stripe: 'rgba(255,255,255,0.4)' },
    { body: '#00BFFF', fin: '#0080FF', stripe: 'rgba(255,255,0,0.3)' },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeFish(fromEdge = false) {
    const c   = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
    const dir = Math.random() > 0.5 ? 1 : -1;
    const sz  = Math.random() * 28 + 14;
    const spd = Math.random() * 1.8 + 0.6;
    return {
      x:       fromEdge ? (dir === 1 ? -sz * 3 : W + sz * 3) : Math.random() * W,
      baseY:   Math.random() * (H * 0.85) + H * 0.05,
      y:       0,
      dir,
      sz,
      spd,
      col:     c.body,
      finCol:  c.fin,
      stripe:  c.stripe,
      hasStripe: Math.random() > 0.45,
      wobble:  Math.random() * Math.PI * 2,
      wobSpd:  Math.random() * 0.035 + 0.015,
      wobAmp:  Math.random() * 35 + 12,
      tail:    0,
      tailSpd: Math.random() * 0.18 + 0.12,
      opacity: Math.random() * 0.4 + 0.55,
    };
  }

  function drawFish(f) {
    const { x, y, sz, dir, col, finCol, stripe, hasStripe, tail } = f;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.globalAlpha = f.opacity;

    const tailWag = Math.sin(tail) * 0.25;

    // Tail fin
    ctx.save();
    ctx.translate(-sz * 0.92, 0);
    ctx.rotate(tailWag);
    ctx.fillStyle = finCol;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-sz * 0.55, -sz * 0.48);
    ctx.lineTo(-sz * 0.38, 0);
    ctx.lineTo(-sz * 0.55, sz * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, 0, sz, sz * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gradient sheen
    const grad = ctx.createRadialGradient(-sz * 0.2, -sz * 0.2, 0, 0, 0, sz);
    grad.addColorStop(0, 'rgba(255,255,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, sz, sz * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stripes
    if (hasStripe) {
      ctx.fillStyle = stripe;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, sz, sz * 0.42, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillRect(-sz * 0.15, -sz * 0.42, sz * 0.18, sz * 0.84);
      ctx.restore();
    }

    // Dorsal fin
    ctx.fillStyle = finCol;
    ctx.beginPath();
    ctx.moveTo(-sz * 0.1, -sz * 0.42);
    ctx.quadraticCurveTo(sz * 0.1, -sz * 0.88, sz * 0.42, -sz * 0.42);
    ctx.closePath();
    ctx.fill();

    // Pectoral fin
    ctx.fillStyle = finCol;
    ctx.globalAlpha = f.opacity * 0.65;
    ctx.beginPath();
    ctx.ellipse(sz * 0.05, sz * 0.18, sz * 0.22, sz * 0.12, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = f.opacity;

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(sz * 0.58, -sz * 0.06, sz * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(sz * 0.61, -sz * 0.06, sz * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(sz * 0.64, -sz * 0.09, sz * 0.025, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sz * 0.88, 0, sz * 0.07, Math.PI * 0.1, Math.PI * 0.7);
    ctx.stroke();

    ctx.restore();
  }

  function init() {
    resize();
    for (let i = 0; i < 22; i++) fish.push(makeFish());
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    fish.forEach(f => {
      // Fish move opposite to scroll for parallax feel
      const parallaxOffset = scrollY * 0.04 * f.dir;
      f.x      += f.spd * f.dir - (parallaxOffset - f._lastParallax || 0) * 0.1;
      f._lastParallax = parallaxOffset;
      f.wobble += f.wobSpd;
      f.tail   += f.tailSpd;
      f.y       = f.baseY + Math.sin(f.wobble) * f.wobAmp;

      if (f.dir === 1 && f.x > W + f.sz * 3)  { const nf = makeFish(true); Object.assign(f, nf); f.dir = 1; f.x = -f.sz * 3; }
      if (f.dir === -1 && f.x < -f.sz * 3)    { const nf = makeFish(true); Object.assign(f, nf); f.dir = -1; f.x = W + f.sz * 3; }

      drawFish(f);
    });
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', () => { resize(); });
  init();
})();

// ═══════════════════════════════════════════════════════════
// 🦈 SHARK SYSTEM — SKILLS SECTION (Canvas)
// ═══════════════════════════════════════════════════════════
(function SharkSystem() {
  const canvas = document.getElementById('shark-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const sharks = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeShark(fromEdge = false) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const sz  = Math.random() * 70 + 60;
    const spd = Math.random() * 0.4 + 0.15;
    return {
      x:     fromEdge ? (dir === 1 ? -sz * 3 : W + sz * 3) : Math.random() * W,
      baseY: Math.random() * (H * 0.7) + H * 0.1,
      y:     0,
      dir,
      sz,
      spd,
      wobble: Math.random() * Math.PI * 2,
      wobSpd: Math.random() * 0.008 + 0.004,
      wobAmp: Math.random() * 25 + 10,
      tail:   0,
      tailSpd: Math.random() * 0.06 + 0.04,
      alpha:  Math.random() * 0.35 + 0.15,
    };
  }

  function drawShark(s) {
    const { x, y, sz, dir, tail, alpha } = s;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.globalAlpha = alpha;

    const tailWag = Math.sin(tail) * 0.18;
    const bodyCol = 'rgba(15, 40, 80, 1)';
    const darkCol = 'rgba(8, 22, 50, 1)';

    // Tail
    ctx.save();
    ctx.translate(-sz * 1.05, 0);
    ctx.rotate(tailWag);
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-sz * 0.38, -sz * 0.38);
    ctx.lineTo(-sz * 0.25, 0);
    ctx.lineTo(-sz * 0.38, sz * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Main body
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.moveTo(sz * 1.1, 0);
    ctx.bezierCurveTo(sz * 0.8, -sz * 0.28, -sz * 0.3, -sz * 0.22, -sz * 1.0, -sz * 0.1);
    ctx.bezierCurveTo(-sz * 1.05, 0, -sz * 1.0, sz * 0.1, -sz * 1.0, sz * 0.1);
    ctx.bezierCurveTo(-sz * 0.3, sz * 0.28, sz * 0.6, sz * 0.22, sz * 1.1, 0);
    ctx.closePath();
    ctx.fill();

    // Belly lighter
    const bellyGrad = ctx.createLinearGradient(0, sz * 0.05, 0, sz * 0.22);
    bellyGrad.addColorStop(0, 'rgba(50,80,130,0.5)');
    bellyGrad.addColorStop(1, 'rgba(30,60,110,0)');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.ellipse(0, sz * 0.1, sz * 0.65, sz * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dorsal fin
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.moveTo(sz * 0.15, -sz * 0.22);
    ctx.lineTo(sz * 0.48, -sz * 0.78);
    ctx.lineTo(sz * 0.68, -sz * 0.22);
    ctx.closePath();
    ctx.fill();

    // Pectoral fin
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.moveTo(sz * 0.2, 0);
    ctx.lineTo(sz * 0.55, sz * 0.45);
    ctx.lineTo(sz * 0.65, 0);
    ctx.closePath();
    ctx.fill();

    // Eye (small, dark, menacing)
    ctx.fillStyle = 'rgba(20,20,60,0.9)';
    ctx.beginPath();
    ctx.arc(sz * 0.82, -sz * 0.06, sz * 0.055, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(80,80,160,0.3)';
    ctx.beginPath();
    ctx.arc(sz * 0.82, -sz * 0.06, sz * 0.025, 0, Math.PI * 2);
    ctx.fill();

    // Gill lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 4; g++) {
      const gx = sz * 0.55 - g * sz * 0.07;
      ctx.beginPath();
      ctx.moveTo(gx, -sz * 0.12);
      ctx.lineTo(gx - sz * 0.03, sz * 0.12);
      ctx.stroke();
    }

    ctx.restore();
  }

  function init() {
    resize();
    for (let i = 0; i < 4; i++) sharks.push(makeShark());
  }

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    sharks.forEach(s => {
      s.x      += s.spd * s.dir;
      s.wobble += s.wobSpd;
      s.tail   += s.tailSpd;
      s.y       = s.baseY + Math.sin(s.wobble) * s.wobAmp;

      if (s.dir === 1  && s.x > W + s.sz * 2) { Object.assign(s, makeShark(true)); s.dir = 1; s.x = -s.sz * 2; }
      if (s.dir === -1 && s.x < -s.sz * 2)    { Object.assign(s, makeShark(true)); s.dir = -1; s.x = W + s.sz * 2; }

      drawShark(s);
    });
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', resize);
  init();
})();

// ═══════════════════════════════════════════════════════════
// 💡 BIOLUMINESCENCE PARTICLES — SKILLS SECTION
// ═══════════════════════════════════════════════════════════
(function BiolumSystem() {
  const container = document.getElementById('bioLights');
  if (!container) return;
  const colors = ['#00FFD4', '#00AAFF', '#AA66FF', '#FF66AA', '#66FFAA', '#FFCC00'];

  function spawnParticle() {
    const p = document.createElement('div');
    const sz  = Math.random() * 6 + 2;
    const col = colors[Math.floor(Math.random() * colors.length)];
    const dur = Math.random() * 8 + 5;
    const delay = Math.random() * 6;
    p.className = 'bio-particle';
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      background:${col};
      box-shadow: 0 0 ${sz * 3}px ${col}, 0 0 ${sz * 6}px ${col}88;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000);
  }

  for (let i = 0; i < 50; i++) spawnParticle();
  setInterval(() => spawnParticle(), 400);
})();

// ═══════════════════════════════════════════════════════════
// 🔦 FLASHLIGHT CURSOR — PROJECTS SECTION
// ═══════════════════════════════════════════════════════════
(function FlashlightCursor() {
  const section  = document.getElementById('projects');
  const overlay  = document.getElementById('flashlightOverlay');
  if (!section || !overlay) return;

  let isInSection  = false;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;
  let radius = 0;

  // Custom cursor dot
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed; width:14px; height:14px; border-radius:50%;
    background:rgba(255,255,180,0.9);
    box-shadow:0 0 20px rgba(255,255,180,0.8),0 0 40px rgba(255,220,80,0.4);
    pointer-events:none; z-index:9999;
    transform:translate(-50%,-50%);
    transition:width 0.2s,height 0.2s,opacity 0.3s;
    opacity:0;
  `;
  document.body.appendChild(cursor);

  section.addEventListener('mouseenter', () => {
    isInSection = true;
    cursor.style.opacity = '1';
    radius = 0;
    // Grow radius
    const grow = setInterval(() => {
      radius = Math.min(radius + 8, 200);
      if (radius >= 200) clearInterval(grow);
    }, 16);
  });

  section.addEventListener('mouseleave', () => {
    isInSection = false;
    cursor.style.opacity = '0';
    overlay.style.background = `rgba(0,8,20,0.97)`;
  });

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function updateFlashlight() {
    if (isInSection) {
      // Smooth follow
      curX += (mouseX - curX) * 0.1;
      curY += (mouseY - curY) * 0.1;

      const rect   = section.getBoundingClientRect();
      const relX   = curX - rect.left;
      const relY   = curY - rect.top;

      overlay.style.background = `
        radial-gradient(circle ${radius}px at ${relX}px ${relY}px,
          rgba(255,255,200,0.03) 0%,
          rgba(0,5,20,0.4) 40%,
          rgba(0,8,20,0.97) 100%
        )
      `;
    }
    requestAnimationFrame(updateFlashlight);
  }
  updateFlashlight();

  // Pulse cursor on hover over cards
  section.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.boxShadow = '0 0 30px rgba(255,255,180,1),0 0 60px rgba(255,220,80,0.6)';
    });
    card.addEventListener('mouseleave', () => {
      cursor.style.width  = '14px';
      cursor.style.height = '14px';
      cursor.style.boxShadow = '0 0 20px rgba(255,255,180,0.8),0 0 40px rgba(255,220,80,0.4)';
    });
  });
})();

// ═══════════════════════════════════════════════════════════
// 🐙 ABYSS DRIFTING CREATURES
// ═══════════════════════════════════════════════════════════
(function AbyssCreatures() {
  const container = document.getElementById('abyssCreatures');
  if (!container) return;
  const creatures = ['🦑','🐟','🐠','🦐','🫧','🐡'];
  for (let i = 0; i < 8; i++) {
    const c = document.createElement('div');
    c.className = 'abyss-creature';
    c.textContent = creatures[Math.floor(Math.random() * creatures.length)];
    c.style.cssText = `
      left:${Math.random() * 90}%;
      top:${Math.random() * 90}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * -10}s;
      font-size:${Math.random() * 2.5 + 1.5}rem;
      opacity:${Math.random() * 0.06 + 0.03};
    `;
    container.appendChild(c);
  }
})();

// ═══════════════════════════════════════════════════════════
// 🌊 HERO CANVAS — Surface water ripples
// ═══════════════════════════════════════════════════════════
(function HeroSurface() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const ripples = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Small surface fish
  const smallFish = [];
  for (let i = 0; i < 8; i++) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    smallFish.push({
      x: Math.random() * W,
      y: H * 0.6 + Math.random() * H * 0.3,
      sz: Math.random() * 12 + 6,
      spd: (Math.random() * 1.2 + 0.4) * dir,
      dir,
      wobble: Math.random() * Math.PI * 2,
      wobSpd: Math.random() * 0.04 + 0.02,
      col: `hsl(${180 + Math.random() * 60}, 80%, 65%)`,
    });
  }

  function drawSmallFish(f) {
    ctx.save();
    ctx.translate(f.x, f.y + Math.sin(f.wobble) * 15);
    ctx.scale(f.dir, 1);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = f.col;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.sz, f.sz * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-f.sz * 0.9, 0);
    ctx.lineTo(-f.sz * 1.4, -f.sz * 0.4);
    ctx.lineTo(-f.sz * 1.4, f.sz * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Spawn random ripples on click/tap in hero
  canvas.addEventListener('click', e => {
    ripples.push({ x: e.offsetX, y: e.offsetY, r: 0, maxR: 80, alpha: 0.5 });
  });

  // Periodic auto ripples
  setInterval(() => {
    ripples.push({
      x: Math.random() * W,
      y: H * 0.55 + Math.random() * H * 0.3,
      r: 0, maxR: 50 + Math.random() * 50, alpha: 0.25
    });
  }, 1800);

  (function tick() {
    ctx.clearRect(0, 0, W, H);

    // Draw ripples
    ripples.forEach((rp, i) => {
      rp.r     += 1.5;
      rp.alpha -= 0.008;
      if (rp.alpha <= 0) { ripples.splice(i, 1); return; }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${rp.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Second ring
      if (rp.r > 15) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${rp.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw + update small fish
    smallFish.forEach(f => {
      f.x += f.spd;
      f.wobble += f.wobSpd;
      if (f.dir === 1 && f.x > W + 50)  f.x = -50;
      if (f.dir === -1 && f.x < -50)    f.x = W + 50;
      drawSmallFish(f);
    });

    requestAnimationFrame(tick);
  })();
})();

// ═══════════════════════════════════════════════════════════
// 🌊 PARALLAX SCROLL EFFECTS
// ═══════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Hero content gentle parallax
  const heroContent = document.getElementById('heroContent');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - scrollY / window.innerHeight * 1.4);
  }

  // Sun parallax
  const sunWrap = document.querySelector('.sun-wrap');
  if (sunWrap) {
    sunWrap.style.transform = `translateX(-50%) translateY(${scrollY * 0.3}px)`;
  }

}, { passive: true });

// ═══════════════════════════════════════════════════════════
// 📩 CONTACT FORM
// ═══════════════════════════════════════════════════════════
const form       = document.getElementById('contactForm');
const formSubmit = document.getElementById('formSubmit');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('input[type=text]').value.trim();
    const email   = form.querySelector('input[type=email]').value.trim();
    const subject = form.querySelectorAll('input[type=text]')[1]?.value.trim() || 'Portfolio Inquiry';
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) return;

    // Animate button
    formSubmit.disabled = true;
    formSubmit.querySelector('.submit-text').textContent = '🌊 Sending...';

    const mailto = `mailto:dineshpattanaik388@gmail.com`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    setTimeout(() => {
      window.location.href = mailto;
      formSubmit.querySelector('.submit-text').textContent = '🚀 Launch Message';
      formSubmit.disabled = false;
      formSuccess.style.display = 'block';
      form.reset();
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 800);
  });
}

// ═══════════════════════════════════════════════════════════
// 🎨 JELLYFISH HOVER — ripple trail effect
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.jellyfish').forEach(jelly => {
  jelly.addEventListener('mouseenter', () => {
    const glow = jelly.dataset.glow || '#00FFD4';
    jelly.style.filter = `drop-shadow(0 0 20px ${glow})`;
    // Tentacle glow
    jelly.querySelectorAll('.jelly-tentacles span').forEach(t => {
      t.style.boxShadow = `0 0 8px ${glow}`;
      t.style.background = `linear-gradient(to bottom, ${glow}, transparent)`;
    });
  });
  jelly.addEventListener('mouseleave', () => {
    jelly.style.filter = '';
    jelly.querySelectorAll('.jelly-tentacles span').forEach(t => {
      t.style.boxShadow = '';
      t.style.background = '';
    });
  });
});

// ═══════════════════════════════════════════════════════════
// 🏝️ OCEAN FLOOR — drifting micro-bubbles from sand
// ═══════════════════════════════════════════════════════════
setInterval(() => {
  const contact = document.getElementById('contact');
  if (!contact) return;
  const b = document.createElement('div');
  const sz = Math.random() * 6 + 2;
  b.style.cssText = `
    position:absolute; bottom:${90 + Math.random() * 30}px;
    left:${Math.random() * 100}%;
    width:${sz}px; height:${sz}px;
    border-radius:50%;
    background:rgba(255,255,255,0.15);
    border:1px solid rgba(255,255,255,0.25);
    pointer-events:none;
    animation:bubble-rise ${Math.random() * 4 + 3}s ease-out forwards;
    z-index:2;
  `;
  contact.appendChild(b);
  setTimeout(() => b.remove(), 7000);
}, 400);

// ═══════════════════════════════════════════════════════════
// ✨ PAGE LOAD SEQUENCE
// ═══════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// ═══════════════════════════════════════════════════════════
// 🔗 SMOOTH SCROLL for anchor links
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ═══════════════════════════════════════════════════════════
// 🎯 CURSOR TRAIL (subtle water droplets)
// ═══════════════════════════════════════════════════════════
let lastDrop = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastDrop < 80) return;
  lastDrop = now;

  const drop = document.createElement('div');
  const sz   = Math.random() * 8 + 4;
  drop.style.cssText = `
    position:fixed;
    left:${e.clientX}px; top:${e.clientY}px;
    width:${sz}px; height:${sz}px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(0,255,212,0.4),transparent 70%);
    pointer-events:none;
    z-index:9997;
    transform:translate(-50%,-50%);
    animation:drop-fade 0.6s ease forwards;
  `;
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 600);
});

// Drop fade keyframe
const dropStyle = document.createElement('style');
dropStyle.textContent = `
  @keyframes drop-fade {
    from { opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
    to   { opacity: 0;   transform: translate(-50%,-50%) scale(2.5); }
  }
`;
document.head.appendChild(dropStyle);

// ═══════════════════════════════════════════════════════════
// 🐠 HERO — Click to create ripple
// ═══════════════════════════════════════════════════════════
document.getElementById('hero').addEventListener('click', function(e) {
  if (e.target.closest('a') || e.target.closest('button')) return;
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:absolute;
    left:${e.clientX}px; top:${e.clientY}px;
    width:10px; height:10px;
    border-radius:50%;
    border:2px solid rgba(255,255,255,0.6);
    pointer-events:none;
    z-index:20;
    transform:translate(-50%,-50%);
    animation:hero-ripple 1s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
});
const heroRippleStyle = document.createElement('style');
heroRippleStyle.textContent = `
  @keyframes hero-ripple {
    from { opacity:0.8; transform:translate(-50%,-50%) scale(1); }
    to   { opacity:0;   transform:translate(-50%,-50%) scale(15); }
  }
`;
document.head.appendChild(heroRippleStyle);