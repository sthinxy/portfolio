/* ===========================================================
   STHINXY :: SNAKE CURSOR
   - desktop: head follows pointer
   - mobile/touch: touch or idle scene snake
   - red prey flees on proximity, can be caught once per reload
   =========================================================== */
(function(){
  if (window.__sthinxySnakeReady) return;
  window.__sthinxySnakeReady = true;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var coarse = matchMedia('(hover: none), (pointer: coarse)').matches;

  var oldC = document.getElementById('cursor');
  var oldT = document.getElementById('cursorTrail');
  if (oldC){ oldC.innerHTML=''; oldC.style.display='none'; }
  if (oldT){ oldT.style.display='none'; }

  var canvas = document.createElement('canvas');
  canvas.id = 'snakeCanvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha:true });

  var dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  function resize(){
    dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width  = Math.floor(innerWidth  * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width  = innerWidth  + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener('resize', resize, { passive:true });

  var target = { x: innerWidth/2, y: innerHeight/2 };
  var lastMoveTs = performance.now() - 3000;
  var pointerActive = false;
  var wasIdle = false;
  var idleAnchor = { x: target.x, y: target.y };

  function setTarget(x, y){
    target.x = Math.max(12, Math.min(innerWidth - 12, x));
    target.y = Math.max(12, Math.min(innerHeight - 12, y));
    lastMoveTs = performance.now();
    pointerActive = true;
    wasIdle = false;
    idleAnchor.x = target.x;
    idleAnchor.y = target.y;
  }

  addEventListener('mousemove', function(e){
    if (coarse) return;
    setTarget(e.clientX, e.clientY);
  }, { passive:true });

  addEventListener('pointermove', function(e){
    if (!coarse || e.pointerType === 'mouse') return;
    setTarget(e.clientX, e.clientY);
  }, { passive:true });

  addEventListener('touchmove', function(e){
    var t = e.touches && e.touches[0];
    if (t) setTarget(t.clientX, t.clientY);
  }, { passive:true });

  var SEG_COUNT = coarse ? 16 : 22;
  var SEG_SIZE  = coarse ? 7 : 9;
  var GAP       = coarse ? 2 : 2.5;
  var head      = { x: target.x, y: target.y };
  var segments  = [];
  for (var i = 0; i < SEG_COUNT; i++){
    segments.push({ x: head.x - i*(SEG_SIZE+GAP), y: head.y });
  }

  var prey = { x: innerWidth*0.72, y: innerHeight*0.42, vx: 0, vy: 0 };
  var preySize = coarse ? 5 : 4;
  var PREY_FLEE_DIST = coarse ? 230 : 340;
  var PREY_FORCE = coarse ? 2.75 : 4.25;
  var PREY_MAX_SPEED = coarse ? 6.8 : 10.8;
  var CAPTURE_DIST = coarse ? 9 : 4.5;
  var preyCaught = false;
  var paused = false;

  document.addEventListener('visibilitychange', function(){
    paused = document.hidden;
    if (!paused) requestAnimationFrame(loop);
  });

  function loop(ts){
    if (paused) return;

    var dark = document.documentElement.getAttribute('data-mode') === 'black';
    var ink  = dark ? '#f3f1ea' : '#0c0c0c';
    var paper= dark ? '#0c0c0c' : '#f3f1ea';
    var red  = dark ? '#ff3b34' : '#e23a2e';

    var idle = (ts - lastMoveTs) > (coarse ? 700 : 1800);
    if (idle){
      if (!wasIdle){
        idleAnchor.x = head.x;
        idleAnchor.y = head.y;
        wasIdle = true;
      }
      var t = ts * 0.001;
      var cx = idleAnchor.x;
      var cy = idleAnchor.y;
      var a = Math.min(innerWidth, innerHeight) * (coarse ? 0.09 : 0.13);
      target.x = cx + a * Math.sin(t * 0.9);
      target.y = cy + a * Math.sin(t * 1.8) * 0.55;
      target.x = Math.max(18, Math.min(innerWidth - 18, target.x));
      target.y = Math.max(18, Math.min(innerHeight - 18, target.y));
    }

    var dx = target.x - head.x;
    var dy = target.y - head.y;
    head.x += dx * (coarse ? 0.18 : 0.22);
    head.y += dy * (coarse ? 0.18 : 0.22);

    var prev = head;
    for (var i = 0; i < segments.length; i++){
      var s = segments[i];
      var ddx = prev.x - s.x;
      var ddy = prev.y - s.y;
      var d = Math.hypot(ddx, ddy) || 0.0001;
      var spacing = SEG_SIZE + GAP;
      var k = (d - spacing) / d;
      s.x += ddx * k * 0.9;
      s.y += ddy * k * 0.9;
      prev = s;
    }

    if (!preyCaught) updatePrey(ts);

    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (var j = segments.length - 1; j >= 0; j--){
      var seg = segments[j];
      var sizeFade = 1 - (j / (segments.length + 4));
      var sz = SEG_SIZE * (0.5 + 0.5 * sizeFade);
      drawSeg(seg.x, seg.y, sz, ink, paper, false);
    }
    drawSeg(head.x, head.y, SEG_SIZE * 1.15, ink, paper, true);

    if (!preyCaught) drawPrey(red);

    requestAnimationFrame(loop);
  }

  function updatePrey(ts){
    var pdx = prey.x - head.x;
    var pdy = prey.y - head.y;
    var pd  = Math.hypot(pdx, pdy);

    if (pd < CAPTURE_DIST){
      preyCaught = true;
      window.dispatchEvent(new CustomEvent('sthinxy:prey-caught'));
      return;
    }

    if (pd < PREY_FLEE_DIST){
      var force = (PREY_FLEE_DIST - pd) / PREY_FLEE_DIST;
      var panic = pd < PREY_FLEE_DIST * 0.52 ? 2.05 : 1;
      prey.vx += (pdx / (pd||1)) * force * PREY_FORCE * panic;
      prey.vy += (pdy / (pd||1)) * force * PREY_FORCE * panic;
    }

    prey.vx += Math.sin(ts*0.0011) * 0.12;
    prey.vy += Math.cos(ts*0.0013) * 0.12;
    prey.vx *= 0.982;
    prey.vy *= 0.982;

    var speed = Math.hypot(prey.vx, prey.vy);
    if (speed > PREY_MAX_SPEED){
      prey.vx = (prey.vx / speed) * PREY_MAX_SPEED;
      prey.vy = (prey.vy / speed) * PREY_MAX_SPEED;
    }

    prey.x += prey.vx;
    prey.y += prey.vy;

    var m = coarse ? 28 : 34;
    if (prey.x < m){ prey.x = m; prey.vx = Math.abs(prey.vx) * 0.92; }
    if (prey.x > innerWidth - m){ prey.x = innerWidth - m; prey.vx = -Math.abs(prey.vx) * 0.92; }
    if (prey.y < m){ prey.y = m; prey.vy = Math.abs(prey.vy) * 0.92; }
    if (prey.y > innerHeight - m){ prey.y = innerHeight - m; prey.vy = -Math.abs(prey.vy) * 0.92; }
  }

  function drawSeg(x, y, sz, ink, paper, isHead){
    var half = sz/2;
    ctx.fillStyle = paper;
    ctx.fillRect(x-half, y-half, sz, sz);
    ctx.strokeStyle = ink;
    ctx.lineWidth = isHead ? 1.4 : 1;
    ctx.strokeRect(x-half + 0.5, y-half + 0.5, sz - 1, sz - 1);
    if (isHead){
      ctx.fillStyle = ink;
      ctx.fillRect(x-1.5, y-1.5, 3, 3);
    }
  }

  function drawPrey(red){
    ctx.fillStyle = red;
    ctx.fillRect(prey.x - preySize/2, prey.y - preySize/2, preySize, preySize);
    ctx.strokeStyle = red;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    ctx.strokeRect(prey.x - preySize, prey.y - preySize, preySize*2, preySize*2);
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(loop);
})();
