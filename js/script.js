
/* STHINXY :: white/black space */
(() => {
  const $ = (s) => document.querySelector(s);

  /* ===== PLAYER NAME / NAME GATE ===== */
  const nameGate = $('#nameGate');
  const nameForm = $('#nameForm');
  const playerNameInput = $('#playerNameInput');

  let playerName = '';

  if (playerNameInput) {
    playerNameInput.value = '';
  }

  if (nameForm && playerNameInput) {
    nameForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const typedName = playerNameInput.value.trim();

      if (!typedName) {
        playerNameInput.focus();
        return;
      }

      playerName = typedName;

      if (nameGate) {
        nameGate.classList.add('hidden');

        setTimeout(() => {
          nameGate.style.display = 'none';
          startBoot();
        }, 500);
      } else {
        startBoot();
      }
    });
  }

  /* ===== BOOT / LOADING ===== */
  const boot = $('#boot');
  const fill = $('#bootFill');
  const pct = $('#bootPct');
  const log = $('#bootLog');

  const logs = [
    'loading memories...',
    'unpacking white_space.dat',
    'syncing pixels...',
    'reticulating splines...',
    'waking up...',
    'ready.'
  ];

  function startBoot() {
    if (!boot || !fill || !pct || !log) return;

    const finalName = playerName || 'Sthinxy';

    let p = 0;
    let li = 0;

    fill.style.width = '0%';
    pct.textContent = '0';
    log.textContent = 'loading memories...';

    const tick = setInterval(() => {
      p += Math.random() * 8 + 2;

      if (p >= 100) {
        p = 100;
      }

      fill.style.width = p + '%';
      pct.textContent = Math.floor(p);

      if (Math.random() < 0.35) {
        log.textContent = logs[li++ % logs.length];
      }

      if (p >= 100) {
        clearInterval(tick);
        log.textContent = `welcome, ${finalName}.`;

        setTimeout(() => {
          boot.classList.add('done');
        }, 600);
      }
    }, 140);
  }

  if (!nameGate) {
    startBoot();
  }

  /* ===== DIALOG ===== */
  const dialog = $('#dialog');
  const dText = $('#dialogText');
  let typing = null;

  const showDialog = (text) => {
    if (!dialog || !dText) return;

    dialog.classList.add('show');

    if (typing) {
      clearInterval(typing);
    }

    dText.textContent = '';

    let i = 0;

    typing = setInterval(() => {
      dText.textContent += text[i++] || '';

      if (i >= text.length) {
        clearInterval(typing);
        typing = null;
      }
    }, 28);

    clearTimeout(showDialog._t);

    showDialog._t = setTimeout(() => {
      dialog.classList.remove('show');
    }, 6000);
  };

  /* ===== THEME TOGGLE ===== */
  const html = document.documentElement;
  const tg = $('#themeToggle');

  const setMode = (mode) => {
    html.setAttribute('data-mode', mode);

    if (tg) {
      const label = tg.querySelector('.theme-label');

      if (label) {
        label.textContent = mode.toUpperCase();
      }
    }

    showDialog(
      mode === 'black'
        ? 'você entrou no BLACK SPACE. cuidado com o que se move.'
        : 'voltando ao WHITE SPACE. tudo está em silêncio.'
    );
  };

  if (tg) {
    tg.addEventListener('click', () => {
      const currentMode = html.getAttribute('data-mode');
      setMode(currentMode === 'white' ? 'black' : 'white');
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 't' && tg) {
      tg.click();
    }

    if (event.code === 'Space' && dialog && dialog.classList.contains('show')) {
      dialog.classList.remove('show');
    }
  });

  /* ===== FIRST HELLO ===== */
  setTimeout(() => {
    showDialog(
      'olá. este é o WHITE SPACE. pressione [ T ] ou toque em WHITE para atravessar o espaço.'
    );
  }, 3200);

  /* ===== CURSOR ===== */
  const cur = $('#cursor');
  const trail = $('#cursorTrail');

  if (cur && trail) {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', (event) => {
      cur.style.left = event.clientX + 'px';
      cur.style.top = event.clientY + 'px';

      tx = event.clientX;
      ty = event.clientY;
    });

    function loop() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;

      trail.style.left = cx + 'px';
      trail.style.top = cy + 'px';

      requestAnimationFrame(loop);
    }

    loop();

    document.querySelectorAll('a, button, .proj, .btn, .contact-card').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        cur.classList.add('hover');
      });

      element.addEventListener('mouseleave', () => {
        cur.classList.remove('hover');
      });
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section').forEach((section) => {
    io.observe(section);
  });

  /* ===== MOOD RANDOM ===== */
  const moods = [
    'neutro',
    'melancólico',
    'curioso',
    'sonolento',
    'vazio',
    'feliz?',
    'observando'
  ];

  const moodEl = $('#moodWord');

  setInterval(() => {
    if (moodEl) {
      moodEl.textContent = moods[Math.floor(Math.random() * moods.length)];
    }
  }, 3500);

  /* ===== SMOOTH ANCHOR + EASTER NAV DIALOG ===== */
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      const map = {
        '#sobre': 'abrindo página sobre... [ok]',
        '#skills': 'inventário carregado.',
        '#projetos': 'fragmentos recuperados.',
        '#contato': 'canal de comunicação aberto.',
        '#hero': 'voltando para o início.'
      };

      const text = map[link.getAttribute('href')];

      if (text) {
        showDialog(text);
      }
    });
  });
})();