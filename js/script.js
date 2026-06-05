/* STHINXY :: white/black space */
(function () {
  const $ = function (selector) {
    return document.querySelector(selector);
  };

  /* ===== TYPEWRITER HELPER ===== */
  function typeText(element, text, speed, callback) {
    if (!element) return;

    element.textContent = '';

    let index = 0;

    const typing = setInterval(function () {
      element.textContent += text.charAt(index);
      index++;

      if (index >= text.length) {
        clearInterval(typing);

        if (callback) {
          callback();
        }
      }
    }, speed);
  }

  /* ===== PLAYER NAME / NAME GATE ===== */
  const nameGate = $('#nameGate');
  const nameBox = document.querySelector('.name-box');
  const nameForm = $('#nameForm');
  const playerNameInput = $('#playerNameInput');
  const nameTitleText = $('#nameTitleText');

  let playerName = '';
  let nameGateReady = false;

  if (playerNameInput) {
    playerNameInput.value = '';
    playerNameInput.disabled = true;
  }

  if (nameBox) {
    nameBox.classList.add('is-typing');
  }

  typeText(nameTitleText, 'ANTES DE ENTRAR NO WHITE SPACE...', 55, function () {
    nameGateReady = true;

    if (nameBox) {
      nameBox.classList.remove('is-typing');
      nameBox.classList.add('is-ready');
    }

    const title = document.querySelector('.name-title');

    if (title) {
      title.classList.add('done');
    }

    if (playerNameInput) {
      playerNameInput.disabled = false;
      playerNameInput.focus();
    }
  });

  if (nameForm && playerNameInput) {
    nameForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!nameGateReady) return;

      const typedName = playerNameInput.value.trim();

      if (!typedName) {
        playerNameInput.focus();
        return;
      }

      playerName = typedName;

      if (nameGate) {
        nameGate.classList.add('hidden');

        setTimeout(function () {
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

    const tick = setInterval(function () {
      p += Math.random() * 8 + 2;

      if (p >= 100) {
        p = 100;
      }

      fill.style.width = p + '%';
      pct.textContent = Math.floor(p);

      if (Math.random() < 0.35) {
        log.textContent = logs[li % logs.length];
        li++;
      }

      if (p >= 100) {
        clearInterval(tick);
        log.textContent = 'welcome, ' + finalName + '.';

        setTimeout(function () {
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

  function showDialog(text) {
    if (!dialog || !dText) return;

    dialog.classList.add('show');

    if (typing) {
      clearInterval(typing);
    }

    dText.textContent = '';

    let i = 0;

    typing = setInterval(function () {
      dText.textContent += text.charAt(i);
      i++;

      if (i >= text.length) {
        clearInterval(typing);
        typing = null;
      }
    }, 28);

    clearTimeout(showDialog.timer);

    showDialog.timer = setTimeout(function () {
      dialog.classList.remove('show');
    }, 6000);
  }

  /* ===== THEME TOGGLE ===== */
  const html = document.documentElement;
  const themeToggle = $('#themeToggle');

  function setMode(mode) {
    html.setAttribute('data-mode', mode);

    if (themeToggle) {
      const label = themeToggle.querySelector('.theme-label');

      if (label) {
        label.textContent = mode.toUpperCase();
      }
    }

    if (mode === 'black') {
      showDialog('você entrou no BLACK SPACE. cuidado com o que se move.');
    } else {
      showDialog('voltando ao WHITE SPACE. tudo está em silêncio.');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentMode = html.getAttribute('data-mode');
      const nextMode = currentMode === 'white' ? 'black' : 'white';

      setMode(nextMode);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 't' && themeToggle) {
      themeToggle.click();
    }

    if (event.code === 'Space' && dialog && dialog.classList.contains('show')) {
      dialog.classList.remove('show');
    }
  });

  /* ===== FIRST HELLO ===== */
  setTimeout(function () {
    showDialog('olá. este é o WHITE SPACE. pressione [ T ] ou toque em WHITE para atravessar o espaço.');
  }, 3200);

  /* ===== CURSOR ===== */
  const cursor = $('#cursor');
  const cursorTrail = $('#cursorTrail');

  if (cursor && cursorTrail) {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';

      tx = event.clientX;
      ty = event.clientY;
    });

    function cursorLoop() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;

      cursorTrail.style.left = cx + 'px';
      cursorTrail.style.top = cy + 'px';

      requestAnimationFrame(cursorLoop);
    }

    cursorLoop();

    document
      .querySelectorAll('a, button, .proj, .btn, .contact-card, .proj-links a')
      .forEach(function (element) {
        element.addEventListener('mouseenter', function () {
          cursor.classList.add('hover');
        });

        element.addEventListener('mouseleave', function () {
          cursor.classList.remove('hover');
        });
      });
  }

  /* ===== SCROLL REVEAL ===== */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  document.querySelectorAll('.section').forEach(function (section) {
    observer.observe(section);
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

  setInterval(function () {
    if (moodEl) {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      moodEl.textContent = randomMood;
    }
  }, 3500);

  /* ===== NAV DIALOG ===== */
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      const map = {
        '#sobre': 'abrindo página sobre... [ok]',
        '#skills': 'inventário carregado.',
        '#projetos': 'fragmentos recuperados.',
        '#contato': 'canal de comunicação aberto.',
        '#hero': 'voltando para o início.'
      };

      const href = link.getAttribute('href');
      const text = map[href];

      if (text) {
        showDialog(text);
      }
    });
  });

  /* ===== PROJECT LINK DIALOGS ===== */
  document.querySelectorAll('.proj-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      const text = link.textContent.trim().toLowerCase();

      if (text.includes('site')) {
        showDialog('abrindo projeto publicado...');
      }

      if (text.includes('repositório')) {
        showDialog('abrindo repositório no GitHub...');
      }
    });
  });

  /* ===== CONTACT LINK DIALOGS ===== */
  document.querySelectorAll('.contact-card').forEach(function (link) {
    link.addEventListener('click', function () {
      const text = link.textContent.trim().toLowerCase();

      if (text.includes('whatsapp')) {
        showDialog('abrindo canal no WhatsApp...');
      } else if (text.includes('email')) {
        showDialog('preparando mensagem de e-mail...');
      } else if (text.includes('github')) {
        showDialog('abrindo GitHub...');
      } else if (text.includes('instagram')) {
        showDialog('abrindo Instagram...');
      } else if (text.includes('discord')) {
        showDialog('abrindo Discord...');
      }
    });
  });
})();
