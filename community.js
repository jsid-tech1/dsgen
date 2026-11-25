(() => {
  const dashboard = window.DSGenDashboard;
  if (!dashboard?.root || typeof firebaseAuth === "undefined") return;
  const root = dashboard.root;
  let currentSystemId = null;
  let ownedSystems = [];
  let publicSystems = [];
  let activeCreator = null;

  const style = document.createElement("style");
  style.textContent = `
    .public-community .app-shell{display:block;min-height:0}
    .public-community .app-sidebar{display:none}
    .public-community .app-main{width:min(100%,1240px);margin:auto;min-height:65vh}
    .system-title-button{display:inline-flex;align-items:center;gap:.3em;text-align:left;background:none;color:inherit;border:0;padding:0;font:inherit;letter-spacing:inherit;cursor:pointer;overflow-wrap:anywhere}
    .system-title-button:hover{text-decoration:underline;text-underline-offset:.12em}
    .system-title-icon{flex:none;font-size:.45em}
    .system-title-input{width:100%;min-width:0;font:inherit;letter-spacing:inherit;color:inherit;border:1px solid #777;border-radius:8px;padding:0 8px;background:#fff}
    .system-title-button[hidden],.system-title-input[hidden]{display:none}
    .community-toast{position:fixed;z-index:100;bottom:max(20px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);max-width:calc(100% - 32px);width:max-content;pointer-events:none}
    .community-toast:not(:empty){padding:10px 16px;border-radius:9px;background:#111;color:#fff;font-size:13px;box-shadow:0 3px 16px #0003}
    .community-toolbar{display:grid;grid-template-columns:minmax(220px,1fr) 190px 190px;gap:10px;margin:-22px 0 20px}
    .community-toolbar input,.community-toolbar select{height:44px;width:100%;border:1px solid #ddd;border-radius:9px;background:#fff;padding:0 13px;font:inherit;font-size:13px;color:#111}
    .community-filters{display:flex;align-items:center;gap:8px;margin:0 0 18px;overflow:auto}
    .community-filter{border:1px solid #ddd;border-radius:18px;background:transparent;padding:8px 13px;font-size:12px;white-space:nowrap;color:#555}
    .community-filter.active{background:#111;color:#fff;border-color:#111}
    .community-result-count{margin-left:auto;color:#777;font-size:12px;white-space:nowrap}
    .community-preview{height:132px;border-radius:10px;overflow:hidden;padding:12px;display:grid;grid-template-rows:auto 1fr;gap:9px;background:var(--community-surface,#eef0f7);color:#111;position:relative}
    .community-preview .preview-palette{display:flex;gap:6px}
    .community-preview .preview-swatch{width:18px;height:18px;border-radius:5px;border:1px solid #0002}
    .community-preview .preview-sample{min-width:0;display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;padding:8px 10px;border:1px solid #00000016;border-radius:8px;background:#ffffffd9}
    .community-preview .preview-type{font-size:19px;line-height:1;font-weight:500;letter-spacing:-.06em;color:var(--community-primary,#3854ef)}
    .community-preview .preview-copy{font-size:9px;color:#555;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .community-preview .preview-actions{display:grid;gap:5px;justify-items:stretch}
    .community-preview .preview-action{font-size:8px;line-height:1;padding:6px 8px;border-radius:5px;border:1px solid var(--community-primary,#3854ef);background:var(--community-primary,#3854ef);color:#fff;white-space:nowrap}
    .community-preview .preview-action.secondary{background:transparent;color:#111}
    .community-preview .preview-components{grid-column:1/-1;display:flex;align-items:center;gap:5px;overflow:hidden}
    .community-preview .preview-chip{font-size:8px;line-height:1;border:1px solid #0002;border-radius:5px;padding:4px 6px;white-space:nowrap;background:#fff}
    .community-preview .preview-chip{border-color:var(--community-accent,#12a4a7)}
    .community-preview.variant-brutalist,.community-preview.variant-neo-brutalist{background:var(--community-primary,#3854ef);border-radius:3px}
    .community-preview.variant-brutalist .preview-sample,.community-preview.variant-neo-brutalist .preview-sample{border:2px solid #111;border-radius:2px;box-shadow:3px 3px 0 #111;background:#fff}
    .community-preview.variant-brutalist .preview-type,.community-preview.variant-neo-brutalist .preview-type{font-weight:600;letter-spacing:-.07em;color:#111}
    .community-preview.variant-glassmorphism{background:var(--community-secondary,#70a4ff)}
    .community-preview.variant-glassmorphism .preview-sample{background:#ffffffa8;backdrop-filter:blur(9px);border:1px solid #ffffffb8}
    .community-preview.variant-glassmorphism .preview-chip{background:#ffffff90;backdrop-filter:blur(8px);border-color:#ffffffb8}
    .community-preview.variant-neumorphic{background:var(--community-surface,#eef0f7)}
    .community-preview.variant-neumorphic .preview-sample{border:0;box-shadow:5px 5px 10px #00000018,-5px -5px 10px #ffffffbd;background:var(--community-surface,#eef0f7)}
    .community-preview.variant-editorial .preview-type{font-size:25px;font-weight:400;letter-spacing:-.09em}
    .community-preview.variant-minimalist .preview-sample{border-color:#0000000e;background:#fff}
    .community-preview.variant-material-design .preview-sample{border-radius:12px;box-shadow:0 2px 5px #0002}
    .community-preview.variant-playful,.community-preview.variant-playful .preview-sample{border-radius:15px}
    .community-preview.variant-corporate .preview-type{font-size:16px;letter-spacing:.015em}
    .community-preview.variant-corporate .preview-sample{border-radius:4px}
    .community-card-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px}
    .community-card-actions .app-button{padding:8px 10px;font-size:12px}
    .community-creator-link{border:0;background:none;padding:0;color:#777;text-decoration:underline;text-underline-offset:2px;font:inherit;cursor:pointer}
    .community-empty{padding:34px 24px;border:1px solid #ddd;border-radius:16px;background:#fff;color:#777;text-align:center;line-height:1.5}
    .community-detail-head{margin-bottom:22px}
    .community-detail-head h1{font-size:42px;letter-spacing:-.07em;font-weight:400;margin:0}
    .community-detail-head .app-subtitle{max-width:720px}
    .community-detail-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;color:#777;font-size:12px}
    .community-detail-layout{display:grid;grid-template-columns:minmax(300px,.9fr) minmax(0,1.2fr);gap:20px}
    .community-token-group{padding:17px 0;border-top:1px solid #eee}
    .community-token-group:first-of-type{border-top:0;padding-top:0}
    .community-token-label{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:12px}
    .community-token-colors{display:flex;gap:9px;flex-wrap:wrap}
    .community-token-color{display:grid;gap:6px;font-size:10px;color:#666}
    .community-token-color i{width:36px;height:36px;border:1px solid #ddd;border-radius:8px}
    .community-variant-preview{height:100%;min-height:500px;width:100%;display:grid;place-items:center;padding:24px;background:#f4f4f2;border-radius:12px}
    .community-variant-preview .preview-device{--preview-primary:#3854ef;--preview-secondary:#70a4ff;--preview-accent:#12a4a7;background:var(--preview-surface,#fff);color:#111;overflow:hidden}
    .community-variant-preview .preview-device.variant-brutalist,.community-variant-preview .preview-device.variant-neo-brutalist{border:7px solid #111;border-radius:3px;box-shadow:8px 8px 0 #111}
    .community-variant-preview .preview-device.variant-glassmorphism{background:#ffffffb5;backdrop-filter:blur(14px);border-color:#ffffffa0}
    .community-variant-preview .preview-device.variant-neumorphic{border:0;box-shadow:12px 12px 24px #00000018,-12px -12px 24px #fff}
    .community-variant-preview .preview-device.variant-material-design{border-radius:18px;box-shadow:0 3px 8px #0002}
    .community-variant-preview .preview-device.variant-playful{border-radius:36px}
    .community-variant-preview .preview-device.variant-corporate{border-radius:8px}
    .community-variant-preview .preview-hero{background:var(--preview-primary)}
    .community-variant-preview .preview-button{background:var(--preview-accent);color:#fff}
    .community-variant-preview .preview-device.variant-brutalist .preview-button,.community-variant-preview .preview-device.variant-neo-brutalist .preview-button{border:2px solid #111;border-radius:2px;box-shadow:3px 3px 0 #111}
    .community-variant-preview .preview-device.variant-glassmorphism .preview-hero{opacity:.78}
    .community-preview.variant-glassmorphism :is(.preview-sample,.preview-chip){border:0;box-shadow:inset 0 2px 4px #fff5,0 4px 12px #0002}
    .community-preview.variant-brutalist .preview-sample,.community-variant-preview .preview-device.variant-brutalist,.community-variant-preview .preview-device.variant-brutalist .preview-button{border-radius:0;box-shadow:none}
    .community-variant-preview .preview-device.variant-playful .preview-button{border:0;border-radius:999px;font-weight:700;box-shadow:inset 0 -4px 0 #0002}
    .community-detail-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    .community-review-dialog{max-width:640px}
    .community-review-dialog h2{font-size:28px;font-weight:400;margin:8px 0}
    .community-review-dialog .auth-dialog-head{display:flex;justify-content:space-between;align-items:flex-start}
    .community-review-dialog .auth-close{background:none;color:#111;font-size:28px;padding:0}
    .community-review-preview{margin:14px 0;padding:14px;border:1px solid #ddd;border-radius:12px;background:#f7f7f5}
    .community-review-list{font-size:13px;color:#555;line-height:1.55;padding-left:19px}
    .community-dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}
    .community-status{font-size:12px;color:#555;min-height:18px;margin:12px 0}
    .community-owner-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
    .community-owner-actions .app-button{font-size:12px;padding:8px 10px}
    .community-source-note{font-size:12px;color:#777;margin-top:12px}
    @media(max-width:1000px){.community-toolbar{grid-template-columns:1fr 1fr}.community-toolbar input{grid-column:1/-1}.community-detail-layout{grid-template-columns:1fr}.community-variant-preview{min-height:440px}}
    @media(max-width:650px){.community-toolbar{grid-template-columns:1fr}.community-toolbar input{grid-column:auto}.community-detail-head h1{font-size:34px}.community-detail-layout{grid-template-columns:1fr}.community-variant-preview{min-height:380px;padding:16px}.community-result-count{display:none}.community-card-actions{align-items:flex-start}}
  `;
  document.head.appendChild(style);

  const communityNav = document.createElement("button");
  communityNav.type = "button";
  communityNav.dataset.appView = "community";
  communityNav.textContent = "Community";
  root.querySelector(".app-nav")?.appendChild(communityNav);

  const home = root.querySelector("#app-home");
  const shortcut = document.createElement("button");
  shortcut.type = "button";
  shortcut.className = "app-button ghost";
  shortcut.textContent = "Explore Community →";
  shortcut.addEventListener("click", () => navigate("community"));
  const shortcutWrap = document.createElement("div");
  shortcutWrap.style.marginTop = "22px";
  shortcutWrap.append(shortcut);
  home?.append(shortcutWrap);

  const viewMarkup = `
    <section class="app-view" id="app-community">
      <div class="app-topline"><div><div class="app-kicker">Discover</div><h1 class="app-title">Community</h1><p class="app-subtitle">Explore design systems published by the DSGen community.</p></div><button type="button" class="app-button ghost" data-community-owner hidden>My published systems</button></div>
      <div class="community-toolbar"><input id="community-search" type="search" placeholder="Search systems and creators" aria-label="Search community systems"><select id="community-style" aria-label="Filter by style"><option value="">All styles</option><option>Minimalist</option><option>Modern</option><option>Brutalist</option><option>Neo-Brutalist</option><option>Neumorphic</option><option>Glassmorphism</option><option>Material Design</option><option>Editorial</option><option>Playful</option><option>Corporate</option><option>Flat Design</option></select><select id="community-sort" aria-label="Sort community systems"><option value="newest">Recently published</option><option value="name">Name A–Z</option></select></div>
      <div class="community-filters"><button type="button" class="community-filter active" data-platform-filter="">All</button><button type="button" class="community-filter" data-platform-filter="mobile">Mobile</button><button type="button" class="community-filter" data-platform-filter="web">Web</button><button type="button" class="community-filter" data-platform-filter="both">Both</button><span class="community-result-count" id="community-count"></span></div>
      <div class="system-grid" id="community-grid" aria-live="polite"></div><p class="community-status" id="community-status" role="status"></p>
    </section>
    <section class="app-view" id="app-community-detail"><button class="app-button ghost" type="button" data-community-back="community">← Back to Community</button><div id="community-detail-content"></div></section>
    <section class="app-view" id="app-community-creator"><button class="app-button ghost" type="button" data-community-back="community">← Back to Community</button><div id="community-creator-content"></div></section>
    <section class="app-view" id="app-community-owner"><div class="app-topline"><div><div class="app-kicker">Your community systems</div><h1 class="app-title">My published systems</h1><p class="app-subtitle">Manage the systems you have chosen to share publicly.</p></div><button type="button" class="app-button ghost" data-community-back="community">Back to Community</button></div><div class="system-grid" id="community-owner-grid"></div><p class="community-status" id="community-owner-status" role="status"></p></section>`;
  const parser = document.createElement("template");
  parser.innerHTML = viewMarkup;
  const newViews = [...parser.content.querySelectorAll(".app-view")];
  newViews.forEach((view) => {
    root.querySelector(".app-main")?.append(view);
    dashboard.registerView(view);
  });

  const publishDialog = document.createElement("dialog");
  publishDialog.id = "community-publish-dialog";
  publishDialog.className = "community-review-dialog";
  publishDialog.innerHTML = `<div class="auth-dialog-head"><div><div class="app-kicker">Review before publishing</div><h2>Publish to Community?</h2></div><button type="button" class="auth-close" data-close-publish aria-label="Close">×</button></div><p class="auth-dialog-copy">Only publish after reviewing the information below. Your system will be visible to anyone visiting Community.</p><div class="community-review-preview" id="community-review-preview"></div><ul class="community-review-list"><li>The system name, project description, selected styles, custom style notes, platform, colors, typography, and available component labels will be public.</li><li>${localWorkspace ? "This local preview uses Local creator for attribution." : "Your Google display name will appear as creator attribution. Your email and private account details are not included."}</li><li>Other users can view and create an independent copy. They cannot edit your original.</li></ul><p class="community-status" data-publish-status role="status"></p><div class="community-dialog-actions"><button type="button" class="app-button ghost" data-close-publish>Cancel</button><button type="button" class="app-button" id="community-confirm-publish">Confirm publish</button></div></div>`;
  document.body.append(publishDialog);

  function navigate(view) {
    dashboard.showView(view);
    const communityVisible = view === "community" || view.startsWith("community-");
    communityNav.classList.toggle("active", communityVisible);
    if (view === "community") refreshGallery();
    if (view === "community-owner") refreshOwnedSystems();
  }

  function escapeStyle(value) {
    const allowed = {
      "Neo-Brutalist": "neo-brutalist", "Brutalist": "brutalist", "Glassmorphism": "glassmorphism",
      "Neumorphic": "neumorphic", "Editorial": "editorial", "Minimalist": "minimalist",
      "Material Design": "material-design", "Playful": "playful", "Corporate": "corporate",
    };
    return allowed[value] || "default";
  }

  function color(value, fallback) {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function stylePreview(host, system) {
    const colors = system?.tokens?.colors || {};
    const primary = color(colors.primary, "#3854ef");
    const secondary = color(colors.secondary, "#70a4ff");
    const accent = color(colors.accent, "#12a4a7");
    const surface = color(colors.surface, "#eef0f7");
    const styleName = system?.wizard?.styles?.[0] || "";
    host.className = `community-preview variant-${escapeStyle(styleName)}`;
    host.style.setProperty("--community-primary", primary);
    host.style.setProperty("--community-secondary", secondary);
    host.style.setProperty("--community-accent", accent);
    host.style.setProperty("--community-surface", surface);
    const palette = make("div", "preview-palette");
    [primary, secondary, accent, surface].forEach((hex) => {
      const swatch = make("i", "preview-swatch");
      swatch.style.backgroundColor = hex;
      palette.append(swatch);
    });
    const sample = make("div", "preview-sample");
    const type = make("div");
    const font = system?.tokens?.typography?.fontFamily;
    if (globalThis.designPresets.hasFont(font)) {
      type.style.fontFamily = JSON.stringify(font) + ", " + globalThis.designPresets.fonts[font];
    }
    type.append(make("div", "preview-type", "Aa"));
    type.append(make("div", "preview-copy", system?.tokens?.typography?.fontFamily || "Typography preview"));
    const actions = make("div", "preview-actions");
    const primaryButton = make("span", "preview-action", system?.components?.buttons?.[0] || "Primary");
    const secondaryButton = make("span", "preview-action secondary", system?.components?.buttons?.[1] || "Secondary");
    primaryButton.style.backgroundColor = primary;
    primaryButton.style.borderColor = primary;
    secondaryButton.style.borderColor = primary;
    actions.append(primaryButton, secondaryButton);
    const componentRow = make("div", "preview-components");
    (system?.components?.cards || ["Card preview"]).slice(0, 2).forEach((label) => componentRow.append(make("span", "preview-chip", label)));
    sample.append(type, actions, componentRow);
    host.replaceChildren(palette, sample);
  }

  function makeGalleryCard(system) {
    const card = make("article", "system-card");
    const preview = make("div", "community-preview");
    stylePreview(preview, system);
    const meta = make("div");
    const title = make("h3", "", system.name);
    const creator = make("p");
    const creatorLink = make("button", "community-creator-link", `by ${system.creatorName}`);
    creatorLink.type = "button";
    creatorLink.addEventListener("click", (event) => {
      event.stopPropagation();
      withPending(creatorLink, "Opening…", () => openCreator(system.creatorId));
    });
    creator.append(creatorLink);
    const information = make("p", "", `${system.wizard?.styles?.join(", ") || "Design system"} · ${platformLabel(system.wizard?.platform)}`);
    const actions = make("div", "community-card-actions");
    const view = make("button", "app-button", "View system");
    view.type = "button";
    view.addEventListener("click", (event) => { event.stopPropagation(); withPending(view, "Opening…", () => openPublicSystem(system.id)); });
    actions.append(information, view);
    meta.append(title, creator, actions);
    card.append(preview, meta);
    card.addEventListener("click", (event) => {
      if (!event.target.closest("button")) withPending(view, "Opening…", () => openPublicSystem(system.id));
    });
    return card;
  }

  function platformLabel(platform) {
    return ({ mobile: "Mobile", web: "Web", both: "Mobile & Web" })[platform] || "Platform not set";
  }

  function apiUrl(path, params = {}) {
    const url = new URL(path, window.location.origin);
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") url.searchParams.set(key, value); });
    return url.toString();
  }

  async function request(path, { method = "GET", body = undefined, params = {}, publicRead = false } = {}) {
    const user = firebaseAuth?.currentUser;
    const headers = {};
    if (!publicRead && !localWorkspace) {
      if (!user) throw new Error("Sign in to use Community.");
      headers.Authorization = `Bearer ${await user.getIdToken()}`;
    }
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const response = await fetch(apiUrl(path, params), {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The request could not be completed.");
    return result;
  }

  function filters() {
    return {
      query: root.querySelector("#community-search")?.value.trim().toLowerCase() || "",
      style: root.querySelector("#community-style")?.value || "",
      platform: root.querySelector(".community-filter.active")?.dataset.platformFilter || "",
      sort: root.querySelector("#community-sort")?.value || "newest",
    };
  }

  function renderGallery() {
    const grid = root.querySelector("#community-grid");
    const status = root.querySelector("#community-status");
    const currentFilters = filters();
    let records = publicSystems.filter((system) => {
      const text = `${system.name} ${system.description} ${system.creatorName} ${(system.wizard?.styles || []).join(" ")}`.toLowerCase();
      return (!currentFilters.query || text.includes(currentFilters.query)) &&
        (!currentFilters.style || system.wizard?.styles?.includes(currentFilters.style)) &&
        (!currentFilters.platform || system.wizard?.platform === currentFilters.platform);
    });
    records = [...records].sort((a, b) => currentFilters.sort === "name"
      ? a.name.localeCompare(b.name)
      : (b.publishedAt || 0) - (a.publishedAt || 0));
    root.querySelector("#community-count").textContent = `${records.length} published system${records.length === 1 ? "" : "s"}`;
    grid.replaceChildren();
    status.textContent = "";
    if (!records.length) {
      const empty = make("div", "community-empty", publicSystems.length
        ? "No published systems match these filters. Try another search or filter."
        : "No systems have been published yet. Save a system and publish it to start the gallery.");
      grid.append(empty);
      return;
    }
    records.forEach((system) => grid.append(makeGalleryCard(system)));
  }

  async function refreshGallery() {
    const grid = root.querySelector("#community-grid");
    const status = root.querySelector("#community-status");
    status.textContent = "Loading published systems…";
    try {
      const result = await request("/api/community/gallery", { publicRead: true });
      publicSystems = Array.isArray(result.systems) ? result.systems : [];
      renderGallery();
    } catch (error) {
      grid.replaceChildren(make("div", "community-empty", error.message));
      status.textContent = "";
    }
  }

  function systemDetailContent(system) {
    const detail = root.querySelector("#community-detail-content");
    detail.replaceChildren();
    const head = make("div", "app-topline community-detail-head");
    const heading = make("div");
    heading.append(make("div", "app-kicker", "Published design system"), make("h1", "", system.name), make("p", "app-subtitle", system.description || ""));
    const creatorButton = make("button", "app-button ghost", `by ${system.creatorName}`);
    creatorButton.type = "button";
    creatorButton.addEventListener("click", () => withPending(creatorButton, "Opening…", () => openCreator(system.creatorId)));
    head.append(heading, creatorButton);
    const meta = make("div", "community-detail-meta");
    meta.append(make("span", "component-pill", system.wizard?.styles?.join(", ") || "Style not specified"));
    meta.append(make("span", "component-pill", platformLabel(system.wizard?.platform)));
    if (system.copiedFrom) {
      meta.append(make("span", "community-source-note", `Based on ${system.copiedFrom.systemName} · originally by ${system.copiedFrom.creatorName}`));
    }
    const layout = dashboard.renderPublishedWorkspace(system);
    const previewPanel = layout.querySelector(".mockup-panel");
    const actions = make("div", "community-detail-actions");
    const copy = make("button", "app-button", "Use this system");
    copy.type = "button";
    const copyStatus = make("p", "community-status");
    copyStatus.setAttribute("role", "status");
    copy.addEventListener("click", async () => {
      if (!localWorkspace && !firebaseAuth.currentUser) {
        document.querySelector("[data-auth-trigger]").click();
        return;
      }
      await withPending(copy, "Creating copy…", async () => {
        copyStatus.textContent = "";
        await copyPublishedSystem(system.id, copyStatus);
      });
    });
    actions.append(copy);
    previewPanel.append(actions, copyStatus);
    detail.append(head, meta, layout);
  }

  async function openPublicSystem(id) {
    try {
      const result = await request("/api/community/system", { params: { id }, publicRead: true });
      systemDetailContent(result.system);
      navigate("community-detail");
    } catch (error) {
      showSuccess(error.message);
    }
  }

  async function openCreator(id) {
    try {
      const result = await request("/api/community/creator", { params: { id }, publicRead: true });
      activeCreator = result.creator;
      const panel = root.querySelector("#community-creator-content");
      panel.replaceChildren();
      const head = make("div", "app-topline");
      const intro = make("div");
      intro.append(make("div", "app-kicker", "Creator profile"), make("h1", "app-title", activeCreator.name), make("p", "app-subtitle", "Published design systems"));
      head.append(intro);
      const grid = make("div", "system-grid");
      (result.systems || []).forEach((system) => grid.append(makeGalleryCard(system)));
      panel.append(head, grid);
      navigate("community-creator");
    } catch (error) {
      showSuccess(error.message);
    }
  }

  const untitledName = "Untitled design system";
  const title = root.querySelector("#app-workspace .workspace-header .app-title");
  const titleButton = make("button", "system-title-button");
  titleButton.type = "button";
  const titleText = make("span");
  const titleIcon = make("span", "system-title-icon", "✎");
  titleIcon.setAttribute("aria-hidden", "true");
  titleButton.append(titleText, titleIcon);
  const titleInput = make("input", "system-title-input");
  titleInput.type = "text";
  titleInput.maxLength = 80;
  titleInput.setAttribute("aria-label", "Design system name");
  title.replaceChildren(titleButton, titleInput);
  const descriptionInput = make("textarea", "text-input");
  descriptionInput.rows = 2;
  descriptionInput.maxLength = 300;
  descriptionInput.placeholder = "Add a design system description";
  descriptionInput.setAttribute("aria-label", "Design system description");
  title.after(descriptionInput);

  function setEditorName(name) {
    titleText.textContent = name;
    titleButton.setAttribute("aria-label", `Rename ${name}`);
    titleInput.hidden = true;
    titleButton.hidden = false;
  }

  function finishRenaming(commit) {
    if (titleInput.hidden) return;
    const name = commit ? titleInput.value.trim() : "";
    setEditorName(name || titleText.textContent);
  }

  titleButton.addEventListener("click", () => {
    titleInput.value = titleText.textContent === untitledName ? "" : titleText.textContent;
    titleInput.placeholder = untitledName;
    titleButton.hidden = true;
    titleInput.hidden = false;
    titleInput.focus();
    titleInput.select();
  });
  titleInput.addEventListener("blur", () => finishRenaming(true));
  titleInput.addEventListener("keydown", (event) => {
    if (event.isComposing || !["Enter", "Escape"].includes(event.key)) return;
    event.preventDefault();
    finishRenaming(event.key === "Enter");
    titleButton.focus();
  });
  setEditorName(untitledName);

  const toast = make("div", "community-toast");
  toast.setAttribute("role", "status");
  document.body.append(toast);
  let toastTimer;

  function showSuccess(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toastTimer = window.setTimeout(() => { toast.textContent = ""; }, 4200);
  }

  async function withPending(button, label, action) {
    if (button.disabled) return;
    const original = button.textContent;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = label;
    try {
      return await action();
    } finally {
      button.textContent = original;
      button.removeAttribute("aria-busy");
      button.disabled = false;
    }
  }

  function draftFromCurrentEditor() {
    const wizard = dashboard.getWizardState();
    const editorColors = {};
    root.querySelectorAll("#app-workspace [data-token]").forEach((input) => { editorColors[input.dataset.token] = input.value; });
    const description = wizard.description.trim();
    finishRenaming(true);
    return {
      schemaVersion: 1,
      name: titleText.textContent,
      description: descriptionInput.value.trim(),
      wizard: {
        platform: wizard.platform || "web",
        styles: wizard.styles || [],
        customStyleDescription: wizard.custom || "",
        projectDescription: description,
        ...(wizard.presetId ? { presetId: wizard.presetId } : {}),
        selectedColors: {
          primary: wizard.colors[0], secondary: wizard.colors[1], accent: wizard.colors[2],
        },
      },
      tokens: {
        colors: {
          primary: color(editorColors.primary, wizard.colors[0]),
          secondary: color(editorColors.secondary, wizard.colors[1]),
          accent: color(editorColors.accent, wizard.colors[2]),
          surface: color(editorColors.surface, "#eef0f7"),
        },
        typography: { fontFamily: wizard.fontFamily || "Inter", scale: { body: 16, heading: 24, display: 32 } },
      },
      components: { buttons: ["Primary", "Secondary", "Tertiary"], cards: ["Default", "Featured"] },
      editor: { previewDevice: root.querySelector("#preview-device")?.classList.contains("tablet") ? "tablet" : root.querySelector("#preview-device")?.classList.contains("laptop") ? "laptop" : "phone" },
    };
  }

  function restoreSystem(system) {
    currentSystemId = system.id;
    const wizard = system.wizard || {};
    dashboard.setWizardState({
      step: 1,
      platform: wizard.platform || "web",
      styles: Array.isArray(wizard.styles) ? [...wizard.styles] : [],
      custom: wizard.customStyleDescription || "",
      description: wizard.projectDescription || system.description || "",
      presetId: wizard.presetId,
      fontFamily: system.tokens?.typography?.fontFamily || "Inter",
      colors: [wizard.selectedColors?.primary, wizard.selectedColors?.secondary, wizard.selectedColors?.accent]
        .map((value, index) => color(value, ["#3854ef", "#70a4ff", "#12a4a7"][index])),
    });
    root.querySelectorAll("#app-workspace [data-token]").forEach((input) => {
      const value = system.tokens?.colors?.[input.dataset.token];
      if (value) {
        input.value = color(value, input.value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    const device = system.editor?.previewDevice || "phone";
    const devicePreview = root.querySelector("#preview-device");
    if (devicePreview) devicePreview.className = `preview-device ${devices.has(device) ? device : "phone"}`;
    root.querySelectorAll("#app-workspace [data-device]").forEach((button) => button.classList.toggle("active", button.dataset.device === device));
    setEditorName(system.name);
    descriptionInput.value = system.description || "";
    ensureWorkspaceStatus().textContent = "";
    dashboard.showView("workspace");
  }

  const devices = new Set(["phone", "tablet", "laptop"]);

  const saveButton = root.querySelector("#app-workspace .workspace-header button[data-app-view]");
  let pendingSave;

  function saveCurrentSystem() {
    if (!pendingSave) {
      saveButton.disabled = true;
      pendingSave = persistCurrentSystem().finally(() => {
        pendingSave = null;
        saveButton.disabled = false;
      });
    }
    return pendingSave;
  }

  async function persistCurrentSystem() {
    const status = ensureWorkspaceStatus();
    status.textContent = "Saving…";
    try {
      const draft = draftFromCurrentEditor();
      const result = currentSystemId
        ? await request("/api/systems/item", { method: "PUT", params: { id: currentSystemId }, body: draft })
        : await request("/api/systems", { method: "POST", body: draft });
      currentSystemId = result.system.id;
      status.textContent = "";
      await refreshOwnedSystems();
      return true;
    } catch (error) {
      status.textContent = error.message;
      return false;
    }
  }

  function ensureWorkspaceStatus() {
    let status = root.querySelector("#workspace-persistence-status");
    if (!status) {
      status = make("p", "community-status");
      status.id = "workspace-persistence-status";
      root.querySelector("#app-workspace .workspace")?.prepend(status);
    }
    return status;
  }

  async function refreshOwnedSystems() {
    try {
      const result = await request("/api/systems");
      ownedSystems = Array.isArray(result.systems) ? result.systems : [];
      renderOwnedCards();
      renderOwnerSystems();
    } catch (error) {
      root.querySelector("#community-owner-status").textContent = error.message;
    }
  }

  function ownerCard(system) {
    const card = make("article", "system-card");
    const preview = make("div", "community-preview");
    stylePreview(preview, system);
    const info = make("div");
    info.append(make("h3", "", system.name), make("p", "", `${system.sharing?.status === "published" ? "Published" : "Private draft"} · Updated ${new Date(system.updatedAt || Date.now()).toLocaleDateString()}`));
    const actions = make("div", "community-owner-actions");
    const open = make("button", "app-button ghost", system.sharing?.status === "published" ? "Edit" : "Open");
    open.type = "button";
    open.addEventListener("click", () => withPending(open, "Opening…", () => loadOwnedSystem(system.id)));
    actions.append(open);
    if (system.sharing?.status === "published") {
      const unpublish = make("button", "app-button ghost", "Unpublish");
      unpublish.type = "button";
      unpublish.addEventListener("click", () => withPending(unpublish, "Unpublishing…", () => unpublishSystem(system.id)));
      actions.append(unpublish);
    } else {
      const publish = make("button", "app-button", "Publish");
      publish.type = "button";
      publish.addEventListener("click", () => withPending(publish, "Opening…", async () => {
        if (await loadOwnedSystem(system.id)) openPublishReview();
      }));
      actions.append(publish);
    }
    const remove = make("button", "app-button ghost", "Delete");
    remove.type = "button";
    remove.addEventListener("click", () => withPending(remove, "Deleting…", () => deleteSystem(system.id)));
    actions.append(remove);
    info.append(actions);
    card.append(preview, info);
    return card;
  }

  function renderOwnedCards() {
    const homeGrid = root.querySelector("#system-grid");
    const systemsGrid = root.querySelector("#app-systems .system-grid");
    const createCard = () => {
      const card = make("article", "system-card new");
      card.dataset.startNew = "";
      card.append(make("div", "plus", "＋"), make("h3", "", "Start a new system"), make("p", "", "Answer four quick questions to begin."));
      card.addEventListener("click", dashboard.startNew);
      return card;
    };
    [homeGrid, systemsGrid].forEach((grid, index) => {
      if (!grid) return;
      grid.replaceChildren();
      grid.append(createCard());
      const records = index === 0 ? ownedSystems.slice(0, 2) : ownedSystems;
      records.forEach((system) => grid.append(ownerCard(system)));
      if (!records.length) {
        const empty = make("p", "community-status", "Your saved design systems will appear here.");
        grid.append(empty);
      }
    });
  }

  function renderOwnerSystems() {
    const grid = root.querySelector("#community-owner-grid");
    const status = root.querySelector("#community-owner-status");
    const published = ownedSystems.filter((system) => system.sharing?.status === "published");
    grid.replaceChildren();
    status.textContent = "";
    if (!published.length) {
      grid.append(make("div", "community-empty", "You have no published systems yet. Save a design system, then choose Publish to review what will be shared."));
      return;
    }
    published.forEach((system) => grid.append(ownerCard(system)));
  }

  async function loadOwnedSystem(id) {
    try {
      const result = await request("/api/systems/item", { params: { id } });
      restoreSystem(result.system);
      return true;
    } catch (error) {
      root.querySelector("#community-owner-status").textContent = error.message;
      return false;
    }
  }

  async function deleteSystem(id) {
    if (!window.confirm("Delete this design system? This cannot be undone.")) return;
    try {
      await request("/api/systems/item", { method: "DELETE", params: { id } });
      await refreshOwnedSystems();
    } catch (error) {
      root.querySelector("#community-owner-status").textContent = error.message;
    }
  }

  async function unpublishSystem(id) {
    if (!window.confirm("Unpublish this system? It will be removed from Community.")) return;
    try {
      await request("/api/systems/unpublish", { method: "POST", body: { id } });
      await refreshOwnedSystems();
      if (root.querySelector("#app-community").classList.contains("active")) await refreshGallery();
    } catch (error) {
      root.querySelector("#community-owner-status").textContent = error.message;
    }
  }

  function openPublishReview() {
    const draft = draftFromCurrentEditor();
    const preview = publishDialog.querySelector("#community-review-preview");
    preview.replaceChildren();
    preview.append(make("strong", "", draft.name), make("p", "", draft.description || "No description"));
    const visual = make("div");
    stylePreview(visual, draft);
    preview.append(visual);
    publishDialog.querySelector("[data-publish-status]").textContent = "";
    publishDialog.showModal();
  }

  publishDialog.querySelectorAll("[data-close-publish]").forEach((button) => button.addEventListener("click", () => publishDialog.close()));
  publishDialog.querySelector("#community-confirm-publish").addEventListener("click", async () => {
    const status = ensureWorkspaceStatus();
    const button = publishDialog.querySelector("#community-confirm-publish");
    const dialogStatus = publishDialog.querySelector("[data-publish-status]");
    dialogStatus.textContent = "Publishing…";
    button.disabled = true;
    try {
      if (!await saveCurrentSystem() || !currentSystemId) throw new Error(status.textContent);
      await request("/api/systems/publish", { method: "POST", body: { id: currentSystemId } });
      publishDialog.close();
      showSuccess("Published to Community");
      await refreshOwnedSystems();
    } catch (error) {
      dialogStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  async function copyPublishedSystem(id, status) {
    try {
      const result = await request("/api/community/copy", { method: "POST", body: { id } });
      await refreshOwnedSystems();
      restoreSystem(result.system);
      ensureWorkspaceStatus().textContent = "Independent copy created in My systems.";
    } catch (error) {
      status.textContent = error.message;
    }
  }

  root.querySelector("#community-search").addEventListener("input", renderGallery);
  ["#community-style", "#community-sort"].forEach((selector) => root.querySelector(selector).addEventListener("change", renderGallery));
  root.querySelectorAll("[data-platform-filter]").forEach((button) => button.addEventListener("click", () => {
    root.querySelectorAll("[data-platform-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderGallery();
  }));
  communityNav.addEventListener("click", () => navigate("community"));
  const ownerButton = root.querySelector("[data-community-owner]");
  ownerButton.addEventListener("click", () => navigate("community-owner"));
  root.querySelectorAll("[data-community-back]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.communityBack)));

  root.addEventListener("click", (event) => {
    const navButton = event.target.closest(".app-nav button");
    if (navButton && navButton !== communityNav) {
      communityNav.classList.remove("active");
      root.querySelectorAll(".app-community-view").forEach((view) => view.classList.remove("active"));
    }
    if (event.target.closest('[data-start-new], [data-app-view="new"]')) {
      currentSystemId = null;
      setEditorName(untitledName);
      descriptionInput.value = "";
      ensureWorkspaceStatus().textContent = "";
    }
  }, true);

  root.addEventListener("click", (event) => {
    const saveButton = event.target.closest("#app-workspace .workspace-header button[data-app-view]");
    if (saveButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      saveCurrentSystem().then((saved) => {
        if (saved) showSuccess("Saved to My systems");
      });
    }
  }, true);

  const workspaceHeader = root.querySelector("#app-workspace .workspace-header");
  const publishButton = make("button", "app-button ghost", "Publish to Community");
  publishButton.type = "button";
  publishButton.addEventListener("click", () => openPublishReview());
  workspaceHeader?.append(publishButton);

  if (location.pathname === "/community") {
    document.querySelector("#community-link").setAttribute("aria-current", "page");
    navigate("community");
  }

  if (localWorkspace) {
    ownerButton.hidden = false;
    refreshOwnedSystems();
  }

  firebaseAuth?.onAuthStateChanged((user) => {
    ownerButton.hidden = !user;
    if (user) refreshOwnedSystems();
    else {
      ownedSystems = [];
      currentSystemId = null;
      renderOwnedCards();
      if (location.pathname === "/community" &&
          root.querySelector("#app-community-owner").classList.contains("active")) {
        navigate("community");
      }
    }
  });
})();
