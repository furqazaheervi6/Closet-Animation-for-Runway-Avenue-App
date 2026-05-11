/**
 * confetti.js  (Fireworks Edition)
 * Runway Avenue — Canvas-based fireworks celebration module.
 *
 * Replaces the original CSS confetti-particle approach with a full
 * canvas firework system: rising rocket shell → mid-air explosion →
 * star particles + sparks + trailing streamers that fade out.
 *
 * Color palette: brand golds + reds, corals, purples, blues, cyans,
 * greens, oranges, ambers, pinks, and blush tones (30-colour spread).
 *
 * Public API:
 *   Confetti.burst(x, y)                — instant radial burst at viewport coords
 *   Confetti.burst(x, y, count, rocket) — burst with custom particle count / rocket mode
 *   Confetti.rain(duration, interval)   — timed automatic fireworks show
 *   Confetti.stopRain()                 — halt an ongoing show
 */

const Confetti = (() => {

  /* ─────────────────────────────────────────
   *  Constants
   * ───────────────────────────────────────── */

  const COLORS = [
    /* Brand golds */
    '#c9a96e', '#e8d5b0', '#f5d376', '#d4a843', '#b8860b',
    /* Reds & corals */
    '#ff4d4d', '#ff6b6b', '#ff8c69', '#ff5733', '#e63946',
    /* Pinks & blush */
    '#ff85a1', '#ffb3c1', '#ff6eb4', '#f72585', '#c77dff',
    /* Purples */
    '#7b2d8b', '#9d4edd', '#c77dff', '#b5179e', '#7209b7',
    /* Blues & cyans */
    '#4361ee', '#4cc9f0', '#06d6a0', '#0077b6', '#00b4d8',
    /* Greens */
    '#52b788', '#74c69d', '#40916c', '#2d6a4f', '#95d5b2',
    /* Oranges & ambers */
    '#fb8500', '#ffb703', '#f4a261', '#e76f51', '#ff9f1c'
  ];

  const PARTICLE_COUNT  = 60;   /* per burst */
  const SPARK_COUNT     = 25;   /* extra sparks per burst */
  const GRAVITY         = 0.06; /* px / frame² */
  const FADE_RATE       = 0.013;
  const ROCKET_SPEED    = 8;    /* px / frame upward */

  /* ─────────────────────────────────────────
   *  Canvas setup (created once, layered over the page)
   * ───────────────────────────────────────── */

  let _canvas, _ctx, _raf, _particles = [], _rainTimer = null;

  function _initCanvas() {
    if (_canvas) return;
    _canvas = document.createElement('canvas');
    _canvas.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:9999'
    ].join(';');
    document.body.appendChild(_canvas);
    _resize();
    window.addEventListener('resize', _resize);
  }

  function _resize() {
    if (!_canvas) return;
    _canvas.width  = window.innerWidth;
    _canvas.height = window.innerHeight;
    _ctx = _canvas.getContext('2d');
  }

  /* ─────────────────────────────────────────
   *  Particle factory
   * ───────────────────────────────────────── */

  function _randColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  /** Create a single explosion star particle. */
  function _makeStar(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    return {
      type: 'star', x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      radius: 2 + Math.random() * 3,
      color: _randColor(),
      alpha: 1,
      trail: [],
    };
  }

  /** Create a small fast spark particle. */
  function _makeSpark(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    return {
      type: 'spark', x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      radius: 1 + Math.random() * 1.5,
      color: _randColor(),
      alpha: 1,
      trail: [],
    };
  }

  /** Create a rising rocket that will explode at peak. */
  function _makeRocket(x, y) {
    return {
      type: 'rocket', x, y,
      vx: (Math.random() - 0.5) * 2,
      vy: -(ROCKET_SPEED + Math.random() * 4),
      radius: 3,
      color: _randColor(),
      alpha: 1,
      trail: [],
      exploded: false,
    };
  }

  /* ─────────────────────────────────────────
   *  Animation loop
   * ───────────────────────────────────────── */

  function _loop() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    for (let i = _particles.length - 1; i >= 0; i--) {
      const p = _particles[i];

      /* Physics */
      p.vy += GRAVITY;
      p.x  += p.vx;
      p.y  += p.vy;

      /* Trail history (last 6 positions) */
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      if (p.type === 'rocket') {
        /* Rocket fades slightly while ascending */
        p.alpha -= 0.005;

        /* Explode when velocity turns positive (peak) */
        if (p.vy >= 0 && !p.exploded) {
          p.exploded = true;
          _explodeAt(p.x, p.y);
          _particles.splice(i, 1);
          continue;
        }
      } else {
        p.alpha -= FADE_RATE;
        p.vx   *= 0.98;  /* drag */
      }

      /* Remove dead particles */
      if (p.alpha <= 0) { _particles.splice(i, 1); continue; }

      /* Draw trail */
      if (p.trail.length > 1) {
        _ctx.save();
        for (let t = 1; t < p.trail.length; t++) {
          const a = (t / p.trail.length) * p.alpha * 0.4;
          _ctx.globalAlpha = a;
          _ctx.strokeStyle = p.color;
          _ctx.lineWidth   = p.radius * (t / p.trail.length);
          _ctx.beginPath();
          _ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
          _ctx.lineTo(p.trail[t].x, p.trail[t].y);
          _ctx.stroke();
        }
        _ctx.restore();
      }

      /* Draw particle head */
      _ctx.save();
      _ctx.globalAlpha = p.alpha;
      _ctx.fillStyle   = p.color;
      _ctx.shadowColor = p.color;
      _ctx.shadowBlur  = p.type === 'rocket' ? 10 : 6;
      _ctx.beginPath();
      _ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      _ctx.fill();
      _ctx.restore();
    }

    if (_particles.length > 0) {
      _raf = requestAnimationFrame(_loop);
    } else {
      _raf = null;
    }
  }

  function _startLoop() {
    if (!_raf) _raf = requestAnimationFrame(_loop);
  }

  /** Spawn explosion particles at a given position. */
  function _explodeAt(x, y) {
    for (let i = 0; i < PARTICLE_COUNT; i++) _particles.push(_makeStar(x, y));
    for (let i = 0; i < SPARK_COUNT;     i++) _particles.push(_makeSpark(x, y));
  }

  /* ─────────────────────────────────────────
   *  Public API
   * ───────────────────────────────────────── */

  /**
   * Spawn a firework burst (or rocket launch) at viewport coordinates.
   * @param {number}  x       Viewport X origin.
   * @param {number}  y       Viewport Y origin.
   * @param {number}  count   Override particle count (optional).
   * @param {boolean} rocket  true = launch a rocket that explodes at peak.
   */
  function burst(x, y, count = PARTICLE_COUNT, rocket = false) {
    _initCanvas();
    if (rocket) {
      _particles.push(_makeRocket(x, y));
    } else {
      const stars  = Math.round(count * 0.7);
      const sparks = count - stars;
      for (let i = 0; i < stars;  i++) _particles.push(_makeStar(x, y));
      for (let i = 0; i < sparks; i++) _particles.push(_makeSpark(x, y));
    }
    _startLoop();
  }

  /**
   * Run an automated fireworks show.
   * @param {number} duration  Total show length in ms  (default 5000).
   * @param {number} interval  ms between launches       (default 400).
   */
  function rain(duration = 5000, interval = 400) {
    _initCanvas();
    const end = Date.now() + duration;

    function _launch() {
      if (Date.now() > end) { _rainTimer = null; return; }
      const x = window.innerWidth  * (0.1 + Math.random() * 0.8);
      const y = window.innerHeight * (0.5 + Math.random() * 0.4);
      burst(x, y, PARTICLE_COUNT, true);
      _rainTimer = setTimeout(_launch, interval * (0.6 + Math.random()));
    }
    _launch();
  }

  /** Stop an ongoing fireworks show. */
  function stopRain() {
    if (_rainTimer) { clearTimeout(_rainTimer); _rainTimer = null; }
  }

  return { burst, rain, stopRain };

})();
