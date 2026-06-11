/* ============================================================
   STHINXY CMS ADMIN
   - Modo local: salva no localStorage.
   - Modo Supabase: salva em public.site_settings.content.
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const LOCAL_ADMIN = { user: "sthinxy", pass: "sthinxy2026" };
  const CONFIG = window.STHINXY_SUPABASE || {};
  const CMS = window.STHINXY_CMS;
  const DEFAULTS = window.STHINXY_DEFAULT_CONTENT || {};
  const SESSION_KEY = "sthinxy_admin_session_v1";

  let content = {};
  let supabaseClient = null;

  const editableTextKeys = [
    "gate.intro","gate.desc","gate.placeholder","gate.enter","gate.hint",
    "nav.home","nav.about","nav.services","nav.skills","nav.projects","nav.quest","nav.contact",
    "hero.kicker","hero.strike","hero.accent","hero.text","hero.text2","hero.cta1","hero.cta2","hero.cta3","hero.statusValue",
    "about.tag","about.title","about.classValue","about.elementValue","about.statusValue","about.text","about.text2",
    "services.title","services.sub","skills.title","projects.title","projects.sub","quest.title",
    "save.title","save.classValue","save.statusValue","save.questValue",
    "contact.title","contact.lead","contact.ctaTitle","contact.ctaText","contact.ctaBtn",
    "channel.name","channel.email","channel.message","channel.send","channel.note","channel.sent",
    "dialog.welcome","dialog.toBlack","dialog.toWhite","foot.by","foot.hint","foot.hint2"
  ];

  function status(msg, bad=false){
    const box = $("#statusBox");
    if(!box) return;
    box.textContent = msg;
    box.style.borderLeftColor = bad ? "#ff5555" : "#ff2a2a";
  }

  function isSupabaseMode(){
    return !!(CONFIG.enabled && CONFIG.url && CONFIG.anonKey && window.supabase);
  }

  function initSupabase(){
    if(!isSupabaseMode()) return null;
    if(!supabaseClient) supabaseClient = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
    return supabaseClient;
  }

  function deepMerge(a,b){ return CMS?.deepMerge ? CMS.deepMerge(a,b) : Object.assign({}, a, b); }

  function getPath(obj, path){
    return path.split(".").reduce((acc,k)=> acc && acc[k], obj);
  }
  function setPath(obj, path, value){
    const parts = path.split(".");
    let cur = obj;
    parts.slice(0,-1).forEach(k => { if(!cur[k] || typeof cur[k] !== "object") cur[k] = {}; cur = cur[k]; });
    cur[parts[parts.length-1]] = value;
  }

  function stableJson(v){ return JSON.stringify(v, null, 2); }
  function parseJson(id){
    try{ return JSON.parse($(id).value || "null"); }
    catch(err){ throw new Error(`${id}: JSON inválido — ${err.message}`); }
  }

  async function loadContent(){
    let loaded = null;
    if(isSupabaseMode()){
      const sb = initSupabase();
      const { data, error } = await sb.from(CONFIG.table || "site_settings").select("content").eq("id", CONFIG.rowId || "main").maybeSingle();
      if(error) throw error;
      loaded = data?.content || null;
    } else {
      loaded = CMS?.readLocal?.() || null;
    }
    content = deepMerge(DEFAULTS, loaded || {});
  }

  async function saveContent(){
    if(isSupabaseMode()){
      const sb = initSupabase();
      const { data: userData } = await sb.auth.getUser();
      if(!userData?.user) throw new Error("Você precisa estar logada no Supabase para salvar online.");
      const payload = {
        id: CONFIG.rowId || "main",
        content,
        updated_at: new Date().toISOString()
      };
      const { error } = await sb.from(CONFIG.table || "site_settings").upsert(payload, { onConflict: "id" });
      if(error) throw error;
    } else {
      CMS?.writeLocal?.(content);
    }
  }

  function buildTextFields(){
    ["pt","en"].forEach(lang => {
      const box = lang === "pt" ? $("#textsPt") : $("#textsEn");
      if(!box) return;
      box.innerHTML = editableTextKeys.map(key => {
        const val = (content.i18n?.[lang]?.[key] ?? "").toString();
        const isHtml = /html|text|about\.|hero\.|foot\.by|foot\.hint/.test(key);
        return `<label class="text-field"><small>${key}</small>
          <textarea data-i18n-edit="${lang}:${key}" rows="${isHtml ? 4 : 2}">${escapeHtml(val)}</textarea>
        </label>`;
      }).join("");
    });
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }

  function fillForm(){
    $$("[data-path]").forEach(el => {
      const val = getPath(content, el.dataset.path);
      if(el.type === "color") el.value = val || "#000000";
      else el.value = val ?? "";
    });
    $("#contactCardsJson").value = stableJson(content.settings?.contactCards || []);
    $("#servicesJson").value = stableJson(content.services || []);
    $("#projectsJson").value = stableJson(content.projects || []);
    $("#questsJson").value = stableJson(content.quests || []);
    $("#fullJson").value = stableJson(content);
    buildTextFields();
  }

  function collectForm(fromFullJson=false){
    if(fromFullJson){
      content = JSON.parse($("#fullJson").value);
      return;
    }

    $$("[data-path]").forEach(el => setPath(content, el.dataset.path, el.value));
    content.settings = content.settings || {};
    content.settings.contactCards = parseJson("#contactCardsJson");
    content.services = parseJson("#servicesJson");
    content.projects = parseJson("#projectsJson");
    content.quests = parseJson("#questsJson");

    $$("[data-i18n-edit]").forEach(el => {
      const [lang, key] = el.dataset.i18nEdit.split(":");
      content.i18n = content.i18n || {};
      content.i18n[lang] = content.i18n[lang] || {};
      content.i18n[lang][key] = el.value;
    });

    $("#fullJson").value = stableJson(content);
  }

  function showPanel(){
    $("#loginView").classList.add("hidden");
    $("#panelView").classList.remove("hidden");
  }

  async function login(user, pass){
    if(isSupabaseMode()){
      const sb = initSupabase();
      const { error } = await sb.auth.signInWithPassword({ email:user, password:pass });
      if(error) throw error;
      sessionStorage.setItem(SESSION_KEY, "supabase");
      return;
    }
    if(user !== LOCAL_ADMIN.user || pass !== LOCAL_ADMIN.pass) throw new Error("Login local incorreto.");
    sessionStorage.setItem(SESSION_KEY, "local");
  }

  function download(filename, text){
    const blob = new Blob([text], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();}, 500);
  }

  function initTabs(){
    $$(".tab").forEach(btn => btn.addEventListener("click", () => {
      $$(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      $$(".tab-panel").forEach(p => p.classList.toggle("show", p.dataset.panel === btn.dataset.tab));
    }));
  }

  async function enterPanel(){
    showPanel();
    status("carregando conteúdo...");
    await loadContent();
    fillForm();
    status(isSupabaseMode() ? "modo Supabase online ativo." : "modo local ativo. Para publicar online, configure Supabase.");
  }


  /* ===== ADMIN WHITE_SPACE / BLACK_SPACE ===== */
  function applyAdminTheme(mode){
    const chosen = mode === "white" ? "white" : "black";
    document.documentElement.setAttribute("data-mode", chosen);
    localStorage.setItem("sthinxy_admin_theme", chosen);

    const label = $("#adminThemeLabel");
    const identity = $("#adminIdentity");
    const loginIdentity = $("#loginIdentity");

    if(label) label.textContent = chosen === "white" ? "WHITE_SPACE" : "BLACK_SPACE";
    if(identity) identity.textContent = chosen === "white" ? "BEATRIZ" : "STHINXY";
    if(loginIdentity) loginIdentity.textContent = chosen === "white" ? "BEATRIZ" : "STHINXY";
  }

  function initAdminTheme(){
    const saved = localStorage.getItem("sthinxy_admin_theme") || "black";
    applyAdminTheme(saved);
    $("#adminThemeToggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-mode") || "black";
      applyAdminTheme(current === "white" ? "black" : "white");
      document.body.classList.remove("theme-flash");
      void document.body.offsetWidth;
      document.body.classList.add("theme-flash");
      setTimeout(() => document.body.classList.remove("theme-flash"), 360);
    });
  }

  function init(){
    initAdminTheme();
    initTabs();

    $("#loginForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      try{
        await login($("#loginUser").value.trim(), $("#loginPass").value);
        await enterPanel();
      }catch(err){
        status(err.message || "erro no login", true);
      }
    });

    $("#editorForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      try{
        const active = $(".tab.active")?.dataset.tab;
        collectForm(active === "json");
        await saveContent();
        fillForm();
        status("alterações salvas. Abra/atualize o site para ver.");
      }catch(err){
        status(err.message || "erro ao salvar", true);
      }
    });

    $("#previewBtn")?.addEventListener("click", () => {
      try{
        collectForm($(".tab.active")?.dataset.tab === "json");
        CMS?.writeLocal?.(content);
        $("#fullJson").value = stableJson(content);
        status("prévia local atualizada. Abra index.html neste mesmo navegador.");
      }catch(err){ status(err.message, true); }
    });

    $("#resetBtn")?.addEventListener("click", async () => {
      if(!confirm("Resetar todo o conteúdo para o padrão original?")) return;
      content = JSON.parse(JSON.stringify(DEFAULTS));
      try{ await saveContent(); }catch(_){}
      fillForm();
      status("conteúdo resetado para o padrão.");
    });

    $("#exportBtn")?.addEventListener("click", () => {
      try{ collectForm($(".tab.active")?.dataset.tab === "json"); }catch(_){}
      download("sthinxy-cms-content.json", stableJson(content));
    });

    $("#importInput")?.addEventListener("change", async e => {
      const file = e.target.files?.[0]; if(!file) return;
      try{
        content = JSON.parse(await file.text());
        fillForm();
        status("JSON importado. Clique em SALVAR ALTERAÇÕES para aplicar.");
      }catch(err){ status("não consegui importar: " + err.message, true); }
    });

    $("#logoutBtn")?.addEventListener("click", async () => {
      sessionStorage.removeItem(SESSION_KEY);
      if(isSupabaseMode()) await initSupabase()?.auth.signOut();
      location.reload();
    });

    // auto enter local session
    if(sessionStorage.getItem(SESSION_KEY)){
      enterPanel().catch(err => status(err.message, true));
    }
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
