/* ============================================================
   STHINXY :: WHITE/BLACK SPACE  —  v2
   ============================================================ */
(function () {
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const STORE = { theme:'sthinxy_theme', lang:'sthinxy_lang', start:'sthinxy_start' }; // nick is intentionally not saved

  /* ===========================================================
     I18N — full PT/EN dictionary
     =========================================================== */
  const i18n = {
    pt:{
      'gate.label':'PLAYER_NAME',
      'gate.desc':'Digite seu nome para começar.',
      'gate.placeholder':'seu nome...',
      'gate.enter':'ENTRAR',
      'gate.hint':'aperte ENTER para continuar',
      'gate.intro':'ANTES DE ENTRAR NO WHITE SPACE...',
      'boot.sub':'> inicializando white_space . . .',
      'nav.home':'INÍCIO','nav.about':'SOBRE','nav.services':'SERVIÇOS','nav.skills':'SKILLS','nav.projects':'PROJETOS','nav.quest':'QUEST LOG','nav.contact':'CONTATO',
      'hero.kicker':'// arquivo_001 — white_space.exe',
      'hero.strike':'PORTFÓLIO COMUM',
      'hero.accent':'UM ESPAÇO QUE EXISTE.',
      'hero.text':'Sou <strong>Ana Beatriz</strong>, também conhecida como <strong>Sthinxy</strong>. Crio sites, interfaces e experiências digitais com estética, lógica e propósito.',
      'hero.text2':'Bem-vindo(a) ao meu white space. Pressione <kbd>T</kbd> ou toque em <strong>WHITE</strong> para atravessar o espaço.',
      'hero.cta1':'▶ VER PROJETOS','hero.cta2':'SERVIÇOS','hero.cta3':'CONTATO',
      'hero.status':'status:','hero.statusValue':'disponível para freelas','hero.mood':'humor:','hero.moodValue':'criativa',
      'about.tag':'// 002 — sobre','about.title':'QUEM HABITA ESTE ESPAÇO?',
      'about.name':'NOME','about.class':'CLASSE','about.classValue':'Web Designer & Front-end Dev','about.element':'ELEMENTO','about.elementValue':'Monocromático','about.status':'STATUS','about.statusValue':'Aceitando projetos',
      'about.text':'Estudo <strong>Análise e Desenvolvimento de Sistemas</strong> e trabalho com <strong>front-end</strong>, <strong>web design</strong>, <strong>UI/UX</strong> e criação de sites para clientes. Meu diferencial é unir <em>estética autoral</em> com <em>funcionalidade real</em> — sites que vendem, contam uma história e funcionam em qualquer tela.',
      'about.text2':'Faço sites responsivos, portfólios, landing pages, interfaces e projetos com painel administrativo quando necessário. Inspirações: <strong>OMORI</strong>, <strong>Yume Nikki</strong>, <strong>LISA: The Painful</strong>, cadernos antigos e a estética do <em>white/black space</em>.',
      'services.tag':'// 003 — serviços','services.title':'ITENS DISPONÍVEIS','services.sub':'Cada serviço é um item do inventário — pronto para ser equipado no seu projeto.',
      'skills.tag':'// 004 — habilidades','skills.title':'INVENTÁRIO TÉCNICO',
      'projects.tag':'// 005 — projetos','projects.title':'FRAGMENTOS SALVOS','projects.sub':'Clique em qualquer card para abrir o arquivo do projeto.',
      'quest.tag':'// 006 — quest log','quest.title':'DIÁRIO DE MISSÕES',
      'save.tag':'// 007 — save file','save.title':'SAVE FILE 01',
      'save.name':'NOME','save.class':'CLASSE','save.classValue':'Web Designer & Front-end Developer','save.location':'LOCAL','save.language':'IDIOMAS','save.status':'STATUS','save.statusValue':'Disponível para freelas','save.quest':'MISSÃO ATUAL','save.questValue':'Criar experiências digitais memoráveis','save.playtime':'TEMPO DE SESSÃO',
      'contact.tag':'// 008 — canal aberto','contact.title':'CANAL ABERTO','contact.lead':'Quer criar um site com identidade forte? Vamos conversar.',
      'channel.nameLabel':'Seu nome','channel.emailLabel':'Seu e-mail','channel.messageLabel':'Sua mensagem','channel.name':'seu nome','channel.email':'seu e-mail','channel.message':'sua mensagem...','channel.send':'▶ ENVIAR MENSAGEM','channel.note':'O botão abre seu e-mail com a mensagem pronta para enviar.','channel.sent':'mensagem preparada. seu cliente de e-mail foi aberto.',
      'contact.ctaTitle':'▼ NOVA MISSÃO DISPONÍVEL','contact.ctaText':'Pronta para começar um projeto novo. Me chama no WhatsApp e em até 24h te respondo com um orçamento.','contact.ctaBtn':'▶ INICIAR PROJETO',
      'dialog.next':'▸ aperte [espaço] ou clique',
      'foot.by':'desenvolvido por <strong>sthinxy</strong> — 2026',
      'foot.hint':'pressione <kbd>T</kbd> para alternar white_space ↔ black_space',
      'foot.hint2':'no celular, toque em WHITE.',
      'modal.viewSite':'▶ VER SITE','modal.repo':'◧ REPOSITÓRIO','modal.objective':'OBJETIVO','modal.tech':'TECNOLOGIAS','modal.features':'FUNCIONALIDADES','modal.result':'RESULTADO',
      'dialog.welcome':name=>`Bem-vinda de volta, ${name}. O espaço estava te esperando.`,
      'dialog.toBlack':'glitch... atravessando para o black space...',
      'dialog.toWhite':'voltando ao white space. respira fundo.',
      'mood.creative':'criativa','mood.coding':'codando','mood.dreaming':'sonhando','mood.glitched':'glitched',
    },
    en:{
      'gate.label':'PLAYER_NAME',
      'gate.desc':'Type your name to begin.',
      'gate.placeholder':'your name...',
      'gate.enter':'ENTER',
      'gate.hint':'press ENTER to continue',
      'gate.intro':'BEFORE ENTERING THE WHITE SPACE...',
      'boot.sub':'> initializing white_space . . .',
      'nav.home':'HOME','nav.about':'ABOUT','nav.services':'SERVICES','nav.skills':'SKILLS','nav.projects':'PROJECTS','nav.quest':'QUEST LOG','nav.contact':'CONTACT',
      'hero.kicker':'// file_001 — white_space.exe',
      'hero.strike':'GENERIC PORTFOLIO',
      'hero.accent':'A SPACE THAT EXISTS.',
      'hero.text':"I'm <strong>Ana Beatriz</strong>, also known as <strong>Sthinxy</strong>. I build websites, interfaces and digital experiences with aesthetics, logic and purpose.",
      'hero.text2':'Welcome to my white space. Press <kbd>T</kbd> or tap <strong>WHITE</strong> to cross over.',
      'hero.cta1':'▶ VIEW PROJECTS','hero.cta2':'SERVICES','hero.cta3':'CONTACT',
      'hero.status':'status:','hero.statusValue':'available for freelance','hero.mood':'mood:','hero.moodValue':'creative',
      'about.tag':'// 002 — about','about.title':'WHO LIVES IN THIS SPACE?',
      'about.name':'NAME','about.class':'CLASS','about.classValue':'Web Designer & Front-end Dev','about.element':'ELEMENT','about.elementValue':'Monochrome','about.status':'STATUS','about.statusValue':'Taking new projects',
      'about.text':"I study <strong>Systems Analysis & Development</strong> and work as a <strong>front-end</strong>, <strong>web designer</strong>, <strong>UI/UX</strong> and freelance site builder. My edge is mixing <em>authorial aesthetics</em> with <em>real functionality</em> — sites that sell, tell a story, and work on every screen.",
      'about.text2':'I build responsive websites, portfolios, landing pages, interfaces and projects with admin panels when needed. Inspirations: <strong>OMORI</strong>, <strong>Yume Nikki</strong>, <strong>LISA: The Painful</strong>, old notebooks and the <em>white/black space</em> aesthetic.',
      'services.tag':'// 003 — services','services.title':'AVAILABLE ITEMS','services.sub':'Each service is an inventory item — ready to be equipped on your project.',
      'skills.tag':'// 004 — skills','skills.title':'TECH INVENTORY',
      'projects.tag':'// 005 — projects','projects.title':'SAVED FRAGMENTS','projects.sub':'Click any card to open the project file.',
      'quest.tag':'// 006 — quest log','quest.title':'MISSION LOG',
      'save.tag':'// 007 — save file','save.title':'SAVE FILE 01',
      'save.name':'NAME','save.class':'CLASS','save.classValue':'Web Designer & Front-end Developer','save.location':'LOCATION','save.language':'LANGUAGES','save.status':'STATUS','save.statusValue':'Available for freelance','save.quest':'CURRENT QUEST','save.questValue':'Creating memorable digital experiences','save.playtime':'PLAYTIME',
      'contact.tag':'// 008 — open channel','contact.title':'OPEN CHANNEL','contact.lead':"Want a website with a strong visual identity? Let's talk.",
      'channel.nameLabel':'Your name','channel.emailLabel':'Your e-mail','channel.messageLabel':'Your message','channel.name':'your name','channel.email':'your e-mail','channel.message':'your message...','channel.send':'▶ SEND MESSAGE','channel.note':'The button opens your e-mail app with the message ready to send.','channel.sent':'message prepared. your e-mail app was opened.',
      'contact.ctaTitle':'▼ NEW QUEST AVAILABLE','contact.ctaText':"Ready to start a new project. Message me on WhatsApp and I'll get back within 24h with a quote.",'contact.ctaBtn':'▶ START PROJECT',
      'dialog.next':'▸ press [space] or click',
      'foot.by':'crafted by <strong>sthinxy</strong> — 2026',
      'foot.hint':'press <kbd>T</kbd> to toggle white_space ↔ black_space',
      'foot.hint2':'on mobile, tap WHITE.',
      'modal.viewSite':'▶ VIEW SITE','modal.repo':'◧ REPOSITORY','modal.objective':'OBJECTIVE','modal.tech':'TECH STACK','modal.features':'FEATURES','modal.result':'OUTCOME',
      'dialog.welcome':name=>`Welcome back, ${name}. The space was waiting for you.`,
      'dialog.toBlack':'glitch... crossing into the black space...',
      'dialog.toWhite':'returning to white space. breathe in.',
      'mood.creative':'creative','mood.coding':'coding','mood.dreaming':'dreaming','mood.glitched':'glitched',
    }
  };

  /* ===========================================================
     SERVICES, PROJECTS, QUESTS — content data
     =========================================================== */
  const services = [
    { id:'landing', icon:'▣', pt:{n:'LANDING PAGES', d:'Páginas únicas de alta conversão — focadas em apresentar produto, serviço ou evento com clareza e impacto.'},
      en:{n:'LANDING PAGES', d:'Single high-conversion pages — built to present a product, service or event with clarity and impact.'}},
    { id:'portfolio', icon:'◈', pt:{n:'PORTFOLIO WEBSITES', d:'Portfólios autorais e memoráveis para artistas, designers e devs que querem se destacar.'},
      en:{n:'PORTFOLIO WEBSITES', d:'Authorial, memorable portfolios for artists, designers and devs who want to stand out.'}},
    { id:'business', icon:'◆', pt:{n:'BUSINESS WEBSITES', d:'Sites institucionais profissionais com identidade forte, performáticos e fáceis de manter.'},
      en:{n:'BUSINESS WEBSITES', d:'Professional company websites with strong identity, performance and easy maintenance.'}},
    { id:'redesign', icon:'↻', pt:{n:'WEBSITE REDESIGN', d:'Renovo sites antigos ou genéricos com estética atual, responsividade e melhor UX.'},
      en:{n:'WEBSITE REDESIGN', d:'I refresh old or generic sites with modern aesthetics, responsiveness and better UX.'}},
    { id:'uiux', icon:'◐', pt:{n:'UI / UX DESIGN', d:'Wireframes, protótipos e telas finais no Figma. Interfaces que respeitam o usuário.'},
      en:{n:'UI / UX DESIGN', d:'Wireframes, prototypes and final screens in Figma. Interfaces that respect the user.'}},
    { id:'frontend', icon:'</>', pt:{n:'FRONT-END DEVELOPMENT', d:'HTML, CSS, JS, React, TypeScript e Tailwind. Código limpo, animado e responsivo.'},
      en:{n:'FRONT-END DEVELOPMENT', d:'HTML, CSS, JS, React, TypeScript and Tailwind. Clean, animated, responsive code.'}},
    { id:'ecom', icon:'⌘', pt:{n:'E-COMMERCE INTERFACES', d:'Interfaces de loja, carrinho e checkout — pensadas para vender e converter.'},
      en:{n:'E-COMMERCE INTERFACES', d:'Store, cart and checkout interfaces — designed to sell and convert.'}},
    { id:'admin', icon:'⚙', pt:{n:'ADMIN PANELS', d:'Painéis administrativos protegidos para o cliente editar o próprio site sem mexer no código.'},
      en:{n:'ADMIN PANELS', d:'Protected admin dashboards so the client can edit their own site without touching code.'}},
    { id:'catalog', icon:'☷', pt:{n:'CATALOG WEBSITES', d:'Catálogos digitais com filtros, busca e integração com WhatsApp para fechar pedidos.'},
      en:{n:'CATALOG WEBSITES', d:'Digital catalogs with filters, search and WhatsApp integration to close orders.'}},
    { id:'responsive', icon:'▱', pt:{n:'RESPONSIVE DESIGN', d:'Tudo que entrego é mobile-first, testado em telas de todos os tamanhos.'},
      en:{n:'RESPONSIVE DESIGN', d:'Everything I ship is mobile-first, tested across every screen size.'}},
  ];

  const projects = [
    { id:'sthinxy', cat:'PORTFOLIO', art:'port',
      label:'STHINXY',
      site:'https://sthinxy.github.io/portfolio/',
      repo:'https://github.com/sthinxy/portfolio',
      tech:'HTML · CSS · JS',
      status:'LIVE',
      pt:{ n:'STHINXY PORTFOLIO', d:'Portfólio autoral com estética white/black space, sistema bilíngue e modal de projetos.',
           obj:'Criar um portfólio que pareça uma experiência digital, não um template.',
           feat:['Dual theme white/black com transição narrativa','Sistema bilíngue PT/EN','Modal estilo RPG para cada projeto','Name gate inicial','Boot screen animado','100% responsivo'],
           res:'Site usado para atrair clientes brasileiros e internacionais.' },
      en:{ n:'STHINXY PORTFOLIO', d:'Authorial portfolio with white/black space aesthetic, bilingual system and project modal.',
           obj:'Build a portfolio that feels like a digital experience, not a template.',
           feat:['Dual white/black theme with narrative transition','PT/EN language system','RPG-style modal per project','Intro name gate','Animated boot screen','Fully responsive'],
           res:'Used to attract both Brazilian and international clients.' } },
    { id:'noir', cat:'E-COMMERCE', art:'cafe',
      label:'NOIR CAFÉ',
      site:'https://sthinxy.github.io/noircafe/',
      repo:'https://github.com/sthinxy/noircafe',
      tech:'HTML · CSS · JS · LocalStorage',
      status:'LIVE',
      pt:{ n:'NOIR CAFÉ', d:'Cardápio digital interativo com carrinho funcional, login fictício, quiz e pedido via WhatsApp.',
           obj:'Mostrar como uma cafeteria pode ter um site temático sem perder usabilidade.',
           feat:['Cardápio com filtros','Carrinho com LocalStorage','Login fictício','Quiz interativo','Checkout via WhatsApp','Tema escuro noir'],
           res:'Projeto de demonstração para clientes do ramo de alimentação.' },
      en:{ n:'NOIR CAFÉ', d:'Interactive digital menu with working cart, mock login, quiz and WhatsApp ordering.',
           obj:'Show how a café can have a themed site without losing usability.',
           feat:['Menu with filters','LocalStorage cart','Mock login','Interactive quiz','WhatsApp checkout','Noir dark theme'],
           res:'Demo project for food & beverage clients.' } },
    { id:'todo', cat:'WEB APP', art:'todo',
      label:'SOMETHING TO DO',
      site:'https://sthinxy.github.io/something-to-do/',
      repo:'https://github.com/sthinxy/something-to-do',
      tech:'HTML · CSS · JS',
      status:'LIVE',
      pt:{ n:'SOMETHING TO DO', d:'Task manager minimalista em white space com filtros e prioridades.',
           obj:'Aplicar a estética white space em uma ferramenta realmente útil.',
           feat:['Tarefas com prioridade','Filtros por status','Persistência LocalStorage','Tema claro/escuro','Atalhos de teclado'],
           res:'Usado no dia a dia como meu gerenciador pessoal.' },
      en:{ n:'SOMETHING TO DO', d:'Minimalist white-space task manager with filters and priorities.',
           obj:'Apply the white space aesthetic to a genuinely useful tool.',
           feat:['Priority tasks','Status filters','LocalStorage persistence','Light/dark theme','Keyboard shortcuts'],
           res:'Used daily as my personal task manager.' } },
    { id:'anna', cat:'BUSINESS', art:'fashion',
      label:'ANNA CHIQUE',
      site:'#',
      repo:'#',
      tech:'HTML · CSS · JS · Responsive',
      status:'CASE',
      pt:{ n:'ANNA CHIQUE', d:'Site institucional com identidade feminina elegante para boutique de moda.',
           obj:'Transmitir sofisticação e converter visitantes em clientes.',
           feat:['Identidade visual exclusiva','Galeria de coleções','Integração com Instagram','Contato direto via WhatsApp','Mobile-first'],
           res:'Visual premium alinhado à proposta da marca.' },
      en:{ n:'ANNA CHIQUE', d:'Elegant feminine business site for a fashion boutique.',
           obj:'Convey sophistication and convert visitors into clients.',
           feat:['Exclusive visual identity','Collection gallery','Instagram integration','Direct WhatsApp contact','Mobile-first'],
           res:'Premium look aligned with the brand proposition.' } },
    { id:'oca', cat:'ARCHITECTURE', art:'arch',
      label:'OCA ARQUITETOS',
      site:'#',
      repo:'#',
      tech:'HTML · CSS · JS',
      status:'CASE',
      pt:{ n:'OCA ARQUITETOS', d:'Portfólio digital para escritório de arquitetura com galeria de projetos.',
           obj:'Mostrar projetos arquitetônicos com o protagonismo das imagens.',
           feat:['Galeria filtrável de projetos','Layout editorial','Tipografia expressiva','Carregamento otimizado','Páginas de caso'],
           res:'Portfólio que reforça a autoridade do escritório.' },
      en:{ n:'OCA ARQUITETOS', d:'Digital portfolio for an architecture studio with a project gallery.',
           obj:'Showcase architectural projects with images as the lead.',
           feat:['Filterable project gallery','Editorial layout','Expressive typography','Optimized loading','Case study pages'],
           res:'Portfolio that reinforces the studio’s authority.' } },
    { id:'diary', cat:'EXPERIMENT', art:'diary',
      label:'DIÁRIO DO VAZIO',
      site:'#', repo:'#',
      tech:'JS · LocalStorage',
      status:'WIP',
      pt:{ n:'DIÁRIO DO VAZIO', d:'Pequeno diário digital com entradas datadas e tema noturno automático.',
           obj:'Experimentar narrativa íntima dentro de uma interface digital.',
           feat:['Entradas datadas','Tema automático noite/dia','Persistência LocalStorage','Estética caderno'],
           res:'Experimento de design narrativo.' },
      en:{ n:'EMPTINESS DIARY', d:'Small digital diary with dated entries and auto night theme.',
           obj:'Experiment with intimate narrative inside a digital interface.',
           feat:['Dated entries','Auto day/night theme','LocalStorage persistence','Notebook aesthetic'],
           res:'A narrative design experiment.' } },
  ];

  const quests = [
    { done:true,  pt:'Criei sites responsivos para clientes reais',         en:'Built responsive websites for real clients' },
    { done:true,  pt:'Desenvolvi interfaces interativas com vanilla JS',    en:'Developed interactive interfaces with vanilla JS' },
    { done:true,  pt:'Criei catálogos e e-commerces funcionais',            en:'Created functional catalogs and e-commerces' },
    { done:true,  pt:'Montei painéis administrativos com Supabase',         en:'Built admin panels with Supabase' },
    { done:true,  pt:'Construí portfólios autorais para criativos',         en:'Built authorial portfolios for creatives' },
    { done:true, pt:'Trabalhar com clientes internacionais',                en:'Work with international clients' },
    { done:false, pt:'Evoluir back-end avançado (Node + APIs)',            en:'Level up advanced back-end (Node + APIs)' },
    { done:false, pt:'Lançar um produto digital próprio',                   en:'Launch my own digital product' },
  ];

  /* ===========================================================
     STATE
     =========================================================== */
  let lang  = localStorage.getItem(STORE.lang) || 'pt';
  let theme = localStorage.getItem(STORE.theme) || 'white';
  let playerName = ''; // always asked again on every visit
  let sessionStart = parseInt(localStorage.getItem(STORE.start) || Date.now(), 10);
  if (!localStorage.getItem(STORE.start)) localStorage.setItem(STORE.start, sessionStart);

  /* ===========================================================
     CMS CONTENT OVERRIDES — admin panel / Supabase / localStorage
     =========================================================== */
  let cmsContent = null;
  let cmsSettings = {};

  function deepMergeLocal(target, source){
    const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
    const out = Array.isArray(target) ? target.slice() : Object.assign({}, target || {});
    if(!isObj(source)) return out;
    Object.keys(source).forEach(k=>{
      const sv = source[k], tv = out[k];
      if(Array.isArray(sv)) out[k] = sv.slice();
      else if(isObj(sv)) out[k] = deepMergeLocal(isObj(tv) ? tv : {}, sv);
      else if(sv !== undefined) out[k] = sv;
    });
    return out;
  }

  function replaceArray(target, source){
    if(!Array.isArray(source)) return;
    target.splice(0, target.length, ...source);
  }

  function applyCmsDom(){
    if(!cmsContent) return;
    const settings = cmsSettings || {};
    const contactGrid = document.querySelector('.contact-grid');
    if(contactGrid && Array.isArray(settings.contactCards)){
      contactGrid.innerHTML = settings.contactCards.map(card => {
        const url = card.url || '#';
        const target = /^https?:\/\//.test(url) ? ' target="_blank" rel="noreferrer"' : '';
        return `<a class="contact-card" href="${url}"${target}>
          <span class="cc-ico">${card.icon || '▣'}</span><span class="cc-l">${card.label || ''}</span><span class="cc-s">${card.text || ''}</span>
        </a>`;
      }).join('');
    }
    document.querySelectorAll('.cta-box a.btn-primary').forEach(a=>{
      if(settings.whatsappUrl) a.setAttribute('href', settings.whatsappUrl);
    });
    if(window.STHINXY_CMS){
      window.STHINXY_CMS.applyDesign?.(cmsContent);
      window.STHINXY_CMS.applyMeta?.(cmsContent);
    }
  }

  function applyCmsContent(content){
    if(!content || typeof content !== 'object') return;
    cmsContent = content;
    cmsSettings = content.settings || {};
    if(content.i18n){
      if(content.i18n.pt) Object.assign(i18n.pt, content.i18n.pt);
      if(content.i18n.en) Object.assign(i18n.en, content.i18n.en);
      // permite que o admin use {name} em vez de função JS
      if(typeof i18n.pt['dialog.welcome'] !== 'function' && !i18n.pt['dialog.welcome']) i18n.pt['dialog.welcome'] = 'Bem-vinda de volta, {name}. O espaço estava te esperando.';
      if(typeof i18n.en['dialog.welcome'] !== 'function' && !i18n.en['dialog.welcome']) i18n.en['dialog.welcome'] = 'Welcome back, {name}. The space was waiting for you.';
    }
    replaceArray(services, content.services);
    replaceArray(projects, content.projects);
    replaceArray(quests, content.quests);
  }

  async function loadCmsContent(){
    if(!window.STHINXY_CMS || typeof window.STHINXY_CMS.loadContent !== 'function') return;
    try{
      const content = await window.STHINXY_CMS.loadContent();
      applyCmsContent(content);
    }catch(err){
      console.warn('[STHINXY CMS] conteúdo não carregado:', err);
    }
  }

  /* ===========================================================
     I18N APPLY
     =========================================================== */
  function t(key){ const d=i18n[lang]; if(!d) return key; const v=d[key]; return v===undefined?key:v; }
  function applyI18n(){
    document.documentElement.lang = lang==='pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(el => { const k=el.getAttribute('data-i18n'); const v=t(k); if(typeof v==='string') el.textContent=v; });
    $$('[data-i18n-html]').forEach(el => { const k=el.getAttribute('data-i18n-html'); const v=t(k); if(typeof v==='string') el.innerHTML=v; });
    $$('[data-i18n-attr]').forEach(el => {
      const spec=el.getAttribute('data-i18n-attr'); // "placeholder:gate.placeholder"
      const [attr,k]=spec.split(':'); const v=t(k); if(typeof v==='string') el.setAttribute(attr,v);
    });
    // Hero glitch data-text follows accent text
    const accent=$('#heroAccent'); if(accent) accent.setAttribute('data-text',accent.textContent);
    // labels
    const ll=$('#langLabel'),lm=$('#langMuted');
    if(ll&&lm){ if(lang==='pt'){ ll.textContent='PT'; lm.textContent='EN'; } else { ll.textContent='EN'; lm.textContent='PT'; } }
    $$('.gate-lang-btn').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-gate-lang')===lang));
    renderServices(); renderProjects(); renderQuests();
    applyCmsDom();
    updateFrameLabel();
  }
  function setLang(L){ lang=L; localStorage.setItem(STORE.lang,L); applyI18n(); }

  /* ===========================================================
     THEME (white/black) — narrative transition
     =========================================================== */
  function applyTheme(silent){
    document.documentElement.setAttribute('data-mode', theme);
    localStorage.setItem(STORE.theme, theme);
    const lbl=$('#themeLabel'); if(lbl) lbl.textContent = theme==='white' ? 'WHITE' : 'BLACK';
    const personaLogo=$('#personaLogo'); if(personaLogo) personaLogo.textContent = theme==='white' ? '[ BEATRIZ ]' : '[ STHINXY ]';
    updateFrameLabel();
    if(!silent){
      flashGlitch();
      showDialog(theme==='black' ? t('dialog.toBlack') : t('dialog.toWhite'));
      const mood=$('#moodWord'); if(mood) mood.textContent = theme==='black' ? t('mood.glitched') : t('mood.creative');
    }
  }
  function toggleTheme(){ theme = (theme==='white'?'black':'white'); applyTheme(false); }
  function updateFrameLabel(){
    const fl=$('#frameLabel'); if(!fl) return;
    fl.textContent = theme==='black' ? 'CHARACTER_LOADED // 002 // STHINXY' : 'CHARACTER_LOADED // 001 // BEATRIZ';
  }

  function flashGlitch(){
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;z-index:9000;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 2px,transparent 2px 4px);mix-blend-mode:difference;opacity:0;transition:opacity .12s';
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{ overlay.style.opacity='1'; });
    setTimeout(()=>{ overlay.style.opacity='0'; setTimeout(()=>overlay.remove(),200); },220);
  }

  /* ===========================================================
     RENDER: services / projects / quests
     =========================================================== */
  function renderServices(){
    const grid=$('#servicesGrid'); if(!grid) return;
    grid.innerHTML = services.map((s,i)=>{
      const c=s[lang]; const tag = lang==='pt' ? `ITEM #${String(i+1).padStart(2,'0')}` : `ITEM #${String(i+1).padStart(2,'0')}`;
      return `<article class="service-card" tabindex="0">
        <p class="service-tag">${tag} <span class="service-ico">${s.icon}</span></p>
        <h3 class="service-name">${c.n}</h3>
        <p class="service-desc">${c.d}</p>
      </article>`;
    }).join('');
  }

  function thumbMarkup(p){
    const counts = { todo:4, diary:3, rpg:4, port:3, cafe:4, fashion:5, arch:5 };
    const art = p.art || 'port';
    const spans = Array.from({length: counts[art] || 3}, () => '<span></span>').join('');
    return `<div class="proj-thumb" data-art="${art}" aria-hidden="true">
      <div class="proj-art">${spans}</div>
      <span class="proj-thumb-label">[ ${p.label} ]</span>
    </div>`;
  }

  function renderProjects(){
    const grid=$('#projGrid'); if(!grid) return;
    grid.innerHTML = projects.map(p=>{
      const c=p[lang];
      return `<article class="proj" data-pid="${p.id}" tabindex="0" role="button" aria-label="${c.n}">
        ${thumbMarkup(p)}
        <h3>${c.n}</h3>
        <p>${c.d}</p>
        <div><span class="proj-status">${p.status}</span><span class="proj-tags">${p.cat}</span></div>
        <p class="proj-tags">${p.tech}</p>
      </article>`;
    }).join('');
    grid.querySelectorAll('.proj').forEach(el=>{
      const open=()=>openProject(el.getAttribute('data-pid'));
      el.addEventListener('click',open);
      el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); }});
    });
  }

  function renderQuests(){
    const ul=$('#questList'); if(!ul) return;
    ul.innerHTML = quests.map(q=>`<li class="${q.done?'done':'todo'}">${q[lang]}</li>`).join('');
  }

  /* ===========================================================
     PROJECT MODAL
     =========================================================== */
  const modal=$('#projModal'), modalBody=$('#modalBody');
  function openProject(id){
    const p=projects.find(x=>x.id===id); if(!p||!modal) return;
    const c=p[lang];
    const feats = c.feat.map(f=>`<li>${f}</li>`).join('');
    const links = `<div class="m-links">
      ${p.site && p.site!=='#' ? `<a class="btn btn-primary" href="${p.site}" target="_blank" rel="noreferrer">${t('modal.viewSite')}</a>`:''}
      ${p.repo && p.repo!=='#' ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noreferrer">${t('modal.repo')}</a>`:''}
    </div>`;
    modalBody.innerHTML = `
      <p class="m-tag">FILE_${p.id.toUpperCase()}.dat // ${p.cat}</p>
      <h3>${c.n}</h3>
      <p>${c.d}</p>
      <h4>${t('modal.objective')}</h4><p>${c.obj}</p>
      <h4>${t('modal.features')}</h4><ul>${feats}</ul>
      <h4>${t('modal.tech')}</h4><p>${p.tech}</p>
      <h4>${t('modal.result')}</h4><p>${c.res}</p>
      ${links}
    `;
    modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    document.body.style.overflow='hidden';
  }
  function closeModal(){ if(!modal) return; modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); document.body.style.overflow=''; }
  modal?.addEventListener('click',e=>{ if(e.target.matches('[data-close]')) closeModal(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

  /* ===========================================================
     DIALOG
     =========================================================== */
  const dialog=$('#dialog'), dialogText=$('#dialogText'); let dialogTimer;
  function showDialog(text, ms=3200){
    if(!dialog||!dialogText) return;
    dialogText.textContent=''; let i=0;
    dialog.classList.add('show');
    clearInterval(dialogTimer);
    const speed=20;
    dialogTimer=setInterval(()=>{ dialogText.textContent+=text.charAt(i++); if(i>=text.length){ clearInterval(dialogTimer); } },speed);
    clearTimeout(dialog._hide); dialog._hide=setTimeout(()=>dialog.classList.remove('show'),ms+text.length*speed);
  }
  dialog?.addEventListener('click',()=>dialog.classList.remove('show'));

  /* ===========================================================
     PLAYTIME
     =========================================================== */
  function tickPlaytime(){
    const el=$('#playtime'); if(!el) return;
    const ms=Date.now()-sessionStart;
    const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);
    el.textContent = `${String(h).padStart(3,'0')}h ${String(m).padStart(2,'0')}m`;
  }

  /* ===========================================================
     CURSOR
     =========================================================== */
  function initCursor(){
    const c=$('#cursor'), tr=$('#cursorTrail'); if(!c||!tr) return;
    let x=0,y=0,tx=0,ty=0;
    document.addEventListener('mousemove',e=>{ x=e.clientX; y=e.clientY; c.style.left=x+'px'; c.style.top=y+'px'; });
    function loop(){ tx+=(x-tx)*0.18; ty+=(y-ty)*0.18; tr.style.left=tx+'px'; tr.style.top=ty+'px'; requestAnimationFrame(loop); } loop();
    document.addEventListener('mouseover',e=>{ if(e.target.closest('a,button,.proj,.contact-card,.service-card,input,textarea,.open-channel')) c.classList.add('hover'); });
    document.addEventListener('mouseout',e=>{ if(e.target.closest('a,button,.proj,.contact-card,.service-card,input,textarea,.open-channel')) c.classList.remove('hover'); });
  }

  /* ===========================================================
     NAME GATE / BOOT
     =========================================================== */
  let gateTypeTimer = null;
  function typeText(el,text,speed,cb){
    if(!el) return;
    clearInterval(gateTypeTimer);
    el.textContent='';
    let i=0;
    gateTypeTimer=setInterval(()=>{
      el.textContent+=text.charAt(i++);
      if(i>=text.length){ clearInterval(gateTypeTimer); gateTypeTimer=null; cb&&cb(); }
    },speed);
  }

  function initNameGate(){
    const gate=$('#nameGate'), box=$('.name-box'), form=$('#nameForm'), input=$('#playerNameInput'), title=$('#nameTitleText');
    if(!gate) return;

    function startGateIntro(){
      if(input){ input.disabled=true; }
      box?.classList.remove('is-ready');
      box?.classList.add('is-typing');
      typeText(title, t('gate.intro'), 45, ()=>{
        box?.classList.remove('is-typing');
        box?.classList.add('is-ready');
        if(input){ input.disabled=false; input.focus(); }
      });
    }

    $$('.gate-lang-btn', gate).forEach(btn=>{
      btn.addEventListener('click',()=>{
        const selected = btn.getAttribute('data-gate-lang') || 'pt';
        setLang(selected);
        startGateIntro();
      });
    });

    startGateIntro();
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      const v=(input?.value||'').trim(); if(!v){ input?.focus(); return; }
      playerName=v;
      gate.classList.add('hidden'); setTimeout(()=>{ gate.style.display='none'; startBoot(); },500);
    });
  }

  function startBoot(){
    const boot=$('#boot'), fill=$('#bootFill'), pct=$('#bootPct'), log=$('#bootLog');
    if(!boot){ greet(); return; }
    const logs = lang==='pt'
      ? ['carregando memórias...','descompactando white_space.dat','sincronizando pixels...','inicializando sthinxy.exe...','quase lá...','pronto.']
      : ['loading memories...','unpacking white_space.dat','syncing pixels...','initializing sthinxy.exe...','almost there...','ready.'];
    let p=0, li=0;
    fill.style.width='0%'; pct.textContent='0'; log.textContent=logs[0];
    const id=setInterval(()=>{
      p+=Math.random()*7+3;
      if(p>=100){ p=100; clearInterval(id); fill.style.width='100%'; pct.textContent='100'; log.textContent=logs[logs.length-1];
        setTimeout(()=>{ boot.classList.add('done'); setTimeout(()=>{ boot.style.display='none'; greet(); },650); },350);
      } else {
        fill.style.width=p+'%'; pct.textContent=Math.floor(p);
        const ni=Math.min(logs.length-1, Math.floor(p/(100/logs.length)));
        if(ni!==li){ li=ni; log.textContent=logs[li]; }
      }
    },110);
  }

  function greet(){
    const name=playerName||'Sthinxy';
    const fn=t('dialog.welcome');
    const msg = typeof fn==='function' ? fn(name) : String(fn || `Welcome, ${name}.`).replaceAll('{name}', name);
    setTimeout(()=>showDialog(msg,3500),500);
  }

  /* ===========================================================
     NAV / MOBILE
     =========================================================== */
  function initNav(){
    const btn=$('#menuToggle'), links=$('#navLinks'); if(!btn||!links) return;
    btn.addEventListener('click',()=>{ const open=links.classList.toggle('open'); btn.classList.toggle('open',open); btn.setAttribute('aria-expanded',open); });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ links.classList.remove('open'); btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }));
  }

  function initOpenChannel(){
    const form=$('#openChannelForm'); if(!form) return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(form);
      const name=(data.get('name')||'').toString().trim();
      const email=(data.get('email')||'').toString().trim();
      const message=(data.get('message')||'').toString().trim();
      if(!name || !email || !message) return;
      const subject = lang==='pt' ? 'Novo projeto pelo portfólio' : 'New project from portfolio';
      const body = lang==='pt'
        ? `Nome: ${name}
E-mail: ${email}

Mensagem:
${message}`
        : `Name: ${name}
E-mail: ${email}

Message:
${message}`;
      const to = (cmsSettings && cmsSettings.contactEmail) || 'venanciobeatriz620@gmail.com';
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showDialog(t('channel.sent'), 2400);
    });
  }

  /* ===========================================================
     SCROLL REVEAL
     =========================================================== */
  function initReveal(){
    const els=$$('.section, .service-card, .proj, .skill, .about-card, .contact-card');
    if(!('IntersectionObserver' in window)){ els.forEach(e=>e.style.opacity=1); return; }
    els.forEach(e=>{ e.style.opacity='0'; e.style.transform='translateY(14px)'; e.style.transition='opacity .5s ease, transform .5s ease'; });
    const io=new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.style.opacity='1'; en.target.style.transform='none'; io.unobserve(en.target); }});
    },{threshold:.08});
    els.forEach(e=>io.observe(e));
  }

  /* ===========================================================
     INIT
     =========================================================== */
  async function init(){
    localStorage.removeItem('sthinxy_name');
    await loadCmsContent();
    applyTheme(true);
    applyI18n();
    initCursor();
    initNav();
    initOpenChannel();
    initNameGate();
    initReveal();
    tickPlaytime(); setInterval(tickPlaytime,60000);

    // toggles
    $('#themeToggle')?.addEventListener('click',toggleTheme);
    $('#langToggle')?.addEventListener('click',()=>setLang(lang==='pt'?'en':'pt'));

    // keyboard
    document.addEventListener('keydown',e=>{
      const tag=(e.target?.tagName||'').toLowerCase();
      if(tag==='input'||tag==='textarea') return;
      if(e.key==='t'||e.key==='T') toggleTheme();
      if(e.key==='l'||e.key==='L') setLang(lang==='pt'?'en':'pt');
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();