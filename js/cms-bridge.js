/* ============================================================
   STHINXY CMS BRIDGE
   Lê conteúdo do painel admin em localStorage ou Supabase.
   ============================================================ */
(function () {
  "use strict";

  const LOCAL_KEY = "sthinxy_cms_content_v5";
  const CONFIG = window.STHINXY_SUPABASE || {};
  const DEFAULTS = window.STHINXY_DEFAULT_CONTENT || {};

  function isObject(v) {
    return v && typeof v === "object" && !Array.isArray(v);
  }

  function deepMerge(target, source) {
    const out = Array.isArray(target) ? target.slice() : Object.assign({}, target || {});
    if (!isObject(source)) return out;
    Object.keys(source).forEach((key) => {
      const sv = source[key];
      const tv = out[key];
      if (Array.isArray(sv)) out[key] = sv.slice();
      else if (isObject(sv)) out[key] = deepMerge(isObject(tv) ? tv : {}, sv);
      else if (sv !== undefined) out[key] = sv;
    });
    return out;
  }

  function readLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("[STHINXY CMS] localStorage inválido:", err);
      return null;
    }
  }

  function writeLocal(content) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(content));
  }

  async function fetchSupabaseContent() {
    if (!CONFIG.enabled || !CONFIG.url || !CONFIG.anonKey) return null;
    const table = CONFIG.table || "site_settings";
    const rowId = CONFIG.rowId || "main";
    const url = `${CONFIG.url.replace(/\/$/, "")}/rest/v1/${table}?id=eq.${encodeURIComponent(rowId)}&select=content&limit=1`;

    const res = await fetch(url, {
      headers: {
        apikey: CONFIG.anonKey,
        Authorization: `Bearer ${CONFIG.anonKey}`,
        Accept: "application/json"
      }
    });

    if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
    const rows = await res.json();
    return rows && rows[0] ? rows[0].content : null;
  }

  async function loadContent() {
    let content = null;

    if (CONFIG.enabled) {
      try {
        content = await fetchSupabaseContent();
      } catch (err) {
        console.warn("[STHINXY CMS] Não consegui ler Supabase, usando local/default:", err);
      }
    }

    if (!content) content = readLocal();

    return deepMerge(DEFAULTS, content || {});
  }

  function applyDesign(content) {
    const d = (content && content.design) || {};
    const root = document.documentElement;

    if (d.accentWhite) root.style.setProperty("--cms-accent-white", d.accentWhite);
    if (d.accentBlack) root.style.setProperty("--cms-accent-black", d.accentBlack);
    if (d.backgroundWhite) root.style.setProperty("--cms-bg-white", d.backgroundWhite);
    if (d.backgroundBlack) root.style.setProperty("--cms-bg-black", d.backgroundBlack);

    const white = document.querySelector(".portrait-white");
    const dark = document.querySelector(".portrait-dark");
    if (white && d.portraitWhite) white.setAttribute("src", d.portraitWhite);
    if (dark && d.portraitDark) dark.setAttribute("src", d.portraitDark);
    if (d.cursorImage) root.style.setProperty("--cursor-image", `url("${d.cursorImage}")`);
    if (d.favicon) {
      let icon = document.querySelector('link[rel="icon"]');
      if (!icon) {
        icon = document.createElement("link");
        icon.setAttribute("rel", "icon");
        icon.setAttribute("type", "image/png");
        document.head.appendChild(icon);
      }
      icon.setAttribute("href", d.favicon);
    }

    let style = document.getElementById("cmsCustomCss");
    if (!style) {
      style = document.createElement("style");
      style.id = "cmsCustomCss";
      document.head.appendChild(style);
    }
    style.textContent = d.customCss || "";
  }

  function applyMeta(content) {
    const meta = (content && content.meta) || {};
    if (meta.title) document.title = meta.title;
    if (meta.description) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "description");
        document.head.appendChild(el);
      }
      el.setAttribute("content", meta.description);
    }
  }

  window.STHINXY_CMS = {
    LOCAL_KEY,
    deepMerge,
    readLocal,
    writeLocal,
    loadContent,
    applyDesign,
    applyMeta,
    defaults: DEFAULTS,
    config: CONFIG
  };
})();
