(() => {
  const style = document.createElement('style');
  style.textContent = `
    #app-dashboard{display:none;min-height:100vh;background:#ffffff;color:#111;font-family:Inter,Arial,sans-serif}
    .app-shell{display:grid;grid-template-columns:250px 1fr;min-height:100vh}.app-sidebar{background:#0b0b0b;color:#fff;padding:28px 20px;display:flex;flex-direction:column}.app-brand{font-size:18px;font-weight:600;letter-spacing:-.08em;margin:0 12px 60px}.app-nav{display:grid;gap:8px}.app-nav button{border:0;background:transparent;color:#aaa;text-align:left;padding:12px;border-radius:9px;font-size:14px}.app-nav button.active,.app-nav button:hover{background:#252525;color:#fff}.app-side-note{margin-top:auto;color:#777;font-size:12px;line-height:1.5;padding:12px}.app-main{padding:42px clamp(24px,5vw,72px);overflow:hidden}.app-view{display:none}.app-view.active{display:block}.app-topline{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px}.app-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#777;margin-bottom:12px}.app-title{font-size:42px;letter-spacing:-.07em;font-weight:400;margin:0}.app-subtitle{margin:12px 0 0;color:#777;max-width:570px;line-height:1.5}.app-button{background:#000;color:#fff;border:1px solid #000;border-radius:9px;padding:13px 18px;font-size:14px}.app-button.ghost{background:#fff;color:#000}.system-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.system-card{min-height:245px;padding:22px;border:1px solid #ddd;border-radius:16px;background:#fff;display:flex;flex-direction:column;justify-content:space-between}.system-preview{height:132px;border-radius:10px;background:#e5eafa;padding:16px}.mini-bars{display:grid;gap:8px}.mini-bars i{height:9px;border-radius:3px;background:#fff;display:block}.mini-bars i:nth-child(1){width:52%}.mini-bars i:nth-child(2){width:80%}.mini-bars i:nth-child(3){width:65%}.system-card h3{font-size:17px;font-weight:500;margin:18px 0 4px;letter-spacing:-.03em}.system-card p{font-size:13px;color:#777;margin:0}.system-card.new{border:1px dashed #aaa;align-items:center;justify-content:center;text-align:center;cursor:pointer}.plus{font-size:38px;font-weight:300;margin-bottom:12px}.wizard{max-width:920px;margin:auto}.progress-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;font-size:12px;color:#777}.progress-track{height:4px;background:#e5e5e5;border-radius:4px;margin-bottom:58px}.progress-bar{height:100%;width:25%;background:#000;border-radius:4px;transition:width .25s}.wizard h2{font-size:42px;font-weight:400;letter-spacing:-.07em;margin:0 0 12px}.wizard-copy{color:#777;margin:0 0 38px}.option-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.style-grid{grid-template-columns:repeat(4,1fr)}.option-card{position:relative;min-height:142px;padding:20px;border:1px solid #ddd;border-radius:12px;background:#fff;cursor:pointer;transition:border .15s,transform .15s}.option-card:hover{transform:translateY(-2px)}.option-card.selected{border:2px solid #000;padding:19px}.option-card .option-icon{font-size:34px;margin-bottom:22px}.option-card .option-name{font-size:14px}.check{display:none;position:absolute;right:12px;top:12px;width:20px;height:20px;border-radius:50%;background:#000;color:#fff;font-size:12px;text-align:center;line-height:20px}.selected .check{display:block}.style-grid .option-card{min-height:108px;padding:16px}.style-grid .option-card .option-icon{font-size:20px;margin-bottom:14px}.custom-style{display:none;margin-top:18px}.custom-style.show{display:block}.field-label{display:block;font-size:13px;margin-bottom:8px}.text-input,.color-hex{width:100%;border:1px solid #ddd;border-radius:9px;background:#fff;padding:13px;font:inherit;outline:0}.text-input:focus,.color-hex:focus{border-color:#000}.textarea-wrap{position:relative}.text-input.textarea{height:190px;resize:none}.char-count{position:absolute;bottom:12px;right:14px;color:#888;font-size:12px}.palette-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.color-field{border:1px solid #ddd;background:#fff;border-radius:12px;padding:18px}.color-picker{display:flex;align-items:center;gap:12px;margin-bottom:16px}.color-picker input[type=color]{width:52px;height:52px;border:0;border-radius:50%;padding:0;background:none}.color-picker input[type=color]::-webkit-color-swatch-wrapper{padding:0}.color-picker input[type=color]::-webkit-color-swatch{border:0;border-radius:50%}.suggest-palette{margin-top:18px}.wizard-footer{display:flex;justify-content:space-between;align-items:center;margin-top:52px}.wizard-footer .right-actions{display:flex;gap:12px}
    .loading-screen{min-height:70vh;display:grid;place-content:center;justify-items:center;gap:32px;text-align:center}
    .loading-print{position:relative;width:min(65vw,300px);aspect-ratio:1.45;background:#181818;border:8px solid #181818;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;align-items:stretch;transform:rotate(-3deg);box-shadow:5px 6px 0 var(--theme-accent)}
    .loading-print i{display:block;background:var(--print-1);border-radius:100px 100px 0 0;transform-origin:center bottom}
    .loading-print i:nth-child(2){background:var(--print-2);border-radius:0 0 100px 100px;transform-origin:center top}
    .loading-print i:nth-child(3){background:var(--print-3);border-radius:100px 0 0 0}
    .loading-screen h2{font:600 clamp(30px,4vw,56px)/1.04 Inter,Arial,sans-serif;letter-spacing:-.06em;margin:0;text-wrap:balance}
    @media(prefers-reduced-motion:no-preference){
      .app-view.active .loading-print i{animation:assemble-print 2.7s ease-in-out infinite}
      .app-view.active .loading-print i:nth-child(2){animation-delay:-1.8s}
      .app-view.active .loading-print i:nth-child(3){animation-delay:-.9s}
    }
    @keyframes assemble-print{0%,100%{transform:scaleY(.55)}45%,65%{transform:scaleY(1)}}
    .workspace{min-height:calc(100vh - 84px)}.workspace-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}.workspace-layout{display:grid;grid-template-columns:390px 1fr;gap:20px}.token-panel,.mockup-panel{background:#fff;border:1px solid #ddd;border-radius:16px;padding:24px}.token-panel h3,.mockup-panel h3{font-size:16px;font-weight:500;margin:0 0 22px}.token-group{padding:18px 0;border-top:1px solid #eee}.token-group:first-of-type{border-top:0;padding-top:0}.token-group-title{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:14px}.swatches{display:flex;gap:9px}.swatch-edit{width:42px;height:42px;border-radius:8px;border:1px solid #ddd;position:relative;overflow:hidden}.swatch-edit input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.swatch-edit span{display:block;width:100%;height:100%}.type-demo{font-size:30px;letter-spacing:-.06em}.component-row{display:flex;gap:8px;flex-wrap:wrap}.component-pill{padding:9px 13px;border:1px solid #000;border-radius:8px;font-size:12px}.mockup-toolbar{display:flex;gap:8px;margin-bottom:18px}.mockup-toolbar button{padding:9px 14px;background:#f1f1ef;border-radius:8px;font-size:12px}.mockup-toolbar button.active{background:#000;color:#fff}.mockup-stage{min-height:570px;display:grid;place-items:center;background:#f4f4f2;border-radius:12px}.preview-device{background:#fff;border:7px solid #161616;box-shadow:0 16px 36px #0001;padding:20px;transition:all .2s}.preview-device.phone{width:260px;height:490px;border-radius:30px}.preview-device.tablet{width:500px;height:400px;border-radius:20px}.preview-device.laptop{width:min(700px,90%);height:420px;border-radius:12px}.preview-device h4{font-size:22px;margin:22px 0 8px;letter-spacing:-.06em}.preview-device p{font-size:12px;color:#777;line-height:1.5}.preview-hero{height:110px;border-radius:8px;background:var(--preview-primary,#3854ef)}.preview-button{padding:10px 14px;border:0;border-radius:7px;background:var(--preview-accent,#12a4a7);color:#fff;font-size:12px}
    @media(max-width:1000px){.app-shell{grid-template-columns:1fr}.app-sidebar{min-height:auto;padding:18px;display:block}.app-brand{display:inline-block;margin:0 24px 0 0}.app-nav{display:inline-flex}.app-side-note{display:none}.system-grid{grid-template-columns:repeat(2,1fr)}.workspace-layout{grid-template-columns:1fr}.mockup-stage{min-height:420px}}
    @media(max-width:650px){.app-main{padding:28px 18px}.app-title,.wizard h2{font-size:34px}.app-topline,.workspace-header{display:block}.app-topline .app-button,.workspace-header .app-button{margin-top:20px}.option-grid,.style-grid,.palette-row,.system-grid{grid-template-columns:1fr}.wizard-footer{margin-top:32px}.app-nav button{padding:8px;font-size:12px}.preview-device.tablet,.preview-device.laptop{width:90%;height:300px}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'app-dashboard';
  root.innerHTML = `
    <div class="app-shell">
      <aside class="app-sidebar"><div class="app-brand">DSGen</div><nav class="app-nav"><button class="active" data-app-view="home">Overview</button><button data-app-view="systems">My systems</button><button data-app-view="new">Create new</button></nav><div class="app-side-note">Build a consistent design language, one decision at a time.</div></aside>
      <main class="app-main">
        <section class="app-view active" id="app-home"><div class="app-topline"><div><div class="app-kicker">Your workspace</div><h1 class="app-title">Good to see you<span id="user-name"></span>.</h1><p class="app-subtitle">Continue shaping your systems or start something new.</p></div><button class="app-button" data-start-new>＋ New design system</button></div><div class="system-grid" id="system-grid"><article class="system-card new" data-start-new><div class="plus">＋</div><h3>Start a new system</h3><p>Answer four quick questions to begin.</p></article><article class="system-card"><div class="system-preview"><div class="mini-bars"><i></i><i></i><i></i></div></div><div><h3>Fitness starter kit</h3><p>Edited 2 days ago · 18 components</p></div></article><article class="system-card"><div class="system-preview" style="background:#ffe2bd"><div class="mini-bars"><i></i><i></i><i></i></div></div><div><h3>Studio editorial</h3><p>Edited 1 week ago · 24 components</p></div></article></div></section>
        <section class="app-view" id="app-systems"><div class="app-topline"><div><div class="app-kicker">Library</div><h1 class="app-title">My design systems</h1><p class="app-subtitle">A home for every visual language you create.</p></div><button class="app-button" data-start-new>＋ New design system</button></div><div class="system-grid"><article class="system-card"><div class="system-preview"><div class="mini-bars"><i></i><i></i><i></i></div></div><div><h3>Fitness starter kit</h3><p>Edited 2 days ago · 18 components</p></div></article><article class="system-card"><div class="system-preview" style="background:#ffe2bd"><div class="mini-bars"><i></i><i></i><i></i></div></div><div><h3>Studio editorial</h3><p>Edited 1 week ago · 24 components</p></div></article><article class="system-card new" data-start-new><div class="plus">＋</div><h3>Create another</h3></article></div></section>
        <section class="app-view" id="app-new"><div class="wizard"><div class="progress-row"><span id="step-label">Step 1 of 4</span></div><div class="progress-track"><div class="progress-bar" id="progress-bar"></div></div><div id="wizard-content"></div><div class="wizard-footer"><button class="app-button ghost" id="wizard-back">← Back</button><div class="right-actions"><button class="app-button" id="wizard-next">Next →</button></div></div></div></section>
        <section class="app-view" id="app-loading">
          <div class="loading-screen" role="status">
            <div class="loading-print" aria-hidden="true"><i></i><i></i><i></i></div>
            <h2>Building your design system…</h2>
          </div>
        </section>
        <section class="app-view" id="app-workspace"><div class="workspace"><div class="workspace-header"><div><div class="app-kicker">Generated system</div><h1 class="app-title">Your design language</h1><p class="app-subtitle">Edit a token on the left and see the product preview respond instantly.</p></div><button class="app-button" data-app-view="home">Save to my systems</button></div><div class="workspace-layout"><aside class="token-panel"><h3>Design system</h3><div class="token-group"><div class="token-group-title">Colors</div><div class="swatches"><label class="swatch-edit"><input type="color" value="#3854ef" data-token="primary"><span style="background:#3854ef"></span></label><label class="swatch-edit"><input type="color" value="#70a4ff" data-token="secondary"><span style="background:#70a4ff"></span></label><label class="swatch-edit"><input type="color" value="#12a4a7" data-token="accent"><span style="background:#12a4a7"></span></label><label class="swatch-edit"><input type="color" value="#eef0f7" data-token="surface"><span style="background:#eef0f7"></span></label></div></div><div class="token-group"><div class="token-group-title">Typography</div><div class="type-demo">Aa</div><small>Inter · 16 / 24 / 32</small></div><div class="token-group"><div class="token-group-title">Buttons</div><div class="component-row"><span class="component-pill" style="background:#3854ef;color:white">Primary</span><span class="component-pill">Secondary</span><span class="component-pill" style="color:#12a4a7">Tertiary</span></div></div><div class="token-group"><div class="token-group-title">Cards</div><div class="component-row"><span class="component-pill">Card / Default</span><span class="component-pill">Card / Featured</span></div></div></aside><section class="mockup-panel"><h3>Preview</h3><div class="mockup-toolbar"><button class="active" data-device="phone">Mobile</button><button data-device="tablet">Tablet</button><button data-device="laptop">Laptop</button></div><div class="mockup-stage"><div class="preview-device phone" id="preview-device"><div class="preview-hero"></div><h4>Great product starts here</h4><p>Build consistent, functional, and beautiful experiences.</p><button class="preview-button">Get started</button></div></div></section></div></div></section>
      </main>
    </div>`;
  document.body.insertBefore(root, document.querySelector('body > footer'));

  const views = [...root.querySelectorAll('.app-view')];
  const showView = (id) => {
    if (location.pathname === '/community' && id !== 'community' && !id.startsWith('community-')) {
      history.replaceState(null, '', '/');
    }
    views.forEach(v => v.classList.toggle('active', v.id === `app-${id}`)); root.querySelectorAll('[data-app-view]').forEach(b => b.classList.toggle('active', b.dataset.appView === id)); };
  root.querySelectorAll('[data-app-view]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.appView === 'new') startNew();
      else showView(button.dataset.appView);
    });
  });
  root.querySelectorAll('[data-start-new]').forEach(button => button.addEventListener('click', startNew));

  const newWizardState = () => ({ step: 1, platform: '', styles: [], custom: '', description: '', colors: ['#3854ef', '#70a4ff', '#12a4a7'] });
  const state = newWizardState();
  const workspace = root.querySelector('#app-workspace');
  const presets = globalThis.designPresets;
  const presetStyles = document.createElement('style');
  presetStyles.textContent = `
    #app-workspace[data-preset] .preview-device {background:var(--preset-surface);color:var(--preset-ink)}
    #app-workspace[data-preset] .preview-device p {color:inherit}
    #app-workspace[data-preset] .preview-button,
    #app-workspace[data-preset] .component-pill {border-radius:var(--preset-radius);padding:var(--preset-padding);border:var(--preset-border) solid var(--preset-line)}
    #app-workspace[data-preset] .preview-button {background:var(--preset-accent);color:var(--preset-on-accent)}
    #app-workspace[data-preset] .component-pill {background-color:var(--preset-surface) !important;color:var(--preset-ink) !important}
    #app-workspace[data-preset] .component-row > .component-pill:first-child {background-color:var(--preset-primary) !important;color:var(--preset-on-primary) !important}
    #app-workspace[data-preset] .preview-hero {border-radius:var(--preset-radius);border:var(--preset-border) solid var(--preset-line)}
    #app-workspace[data-preset="glass"] .preview-device {background:var(--preset-tint)}
    #app-workspace[data-preset="glass"] .preview-hero {position:relative;overflow:hidden}
    #app-workspace[data-preset="glass"] .preview-hero::after {content:"";position:absolute;inset:18% 14%;border-radius:inherit;background:#ffffff35;border:1px solid #ffffff80;backdrop-filter:blur(10px);box-shadow:0 4px 14px #0002}
    #app-workspace[data-preset="soft"] .preview-hero {background:var(--preset-tint);box-shadow:inset 5px 5px 12px #0002,inset -5px -5px 12px #fff7}
    #app-workspace[data-preset="offset"] :is(.preview-button,.component-pill,.preview-hero) {box-shadow:4px 4px 0 var(--preset-line)}
    #app-workspace[data-preset="raw"] .preview-hero {background:var(--preset-primary)}
    #app-workspace[data-preset="rule"] .preview-device h4 {border-bottom:1px solid var(--preset-line)}
    #app-workspace[data-preset="raised"] :is(.preview-button,.component-pill,.preview-hero) {box-shadow:0 3px 8px #0003}
    #app-workspace :is(.preview-device,.type-demo,.component-pill,.preview-button) {font-family:var(--system-font,Inter),var(--system-font-fallback,sans-serif)}
    #app-workspace .font-picker {max-width:100%;padding:6px 8px;border:1px solid #ddd;border-radius:7px;background:white;color:#161616;font:inherit}
    #app-workspace .font-picker summary {cursor:pointer}
    #app-workspace .font-picker input {margin:8px 0}
    #app-workspace .font-picker button {text-align:left}
    #app-workspace .font-picker button[aria-pressed="true"] {background:#111;color:white}
    #app-workspace .workspace-layout > * {min-width:0}
    #app-workspace .preview-device {max-width:100%}
    #app-workspace .mockup-toolbar {flex-wrap:wrap}
    #app-workspace .workspace-header {gap:16px}
    #app-workspace[data-preset] :is(.preview-button,.button-sample) {cursor:pointer;transition:box-shadow .15s,transform .15s,filter .15s}
    #app-workspace[data-preset] :is(.preview-button,.button-sample):hover {filter:brightness(.92)}
    #app-workspace[data-preset] :is(.preview-button,.button-sample):active {transform:translateY(2px)}
    #app-workspace[data-preset] :is(.preview-button,.button-sample):focus-visible {outline:2px solid currentColor;outline-offset:-4px;box-shadow:0 0 0 2px var(--preset-surface),0 0 0 4px var(--preset-line)}
    #app-workspace[data-preset="glass"] :is(.preview-button,.component-pill) {backdrop-filter:blur(10px);box-shadow:inset 0 1px 0 #fff8,0 3px 10px #0002}
    #app-workspace[data-preset="glass"] :is(.preview-button,.button-sample):active {box-shadow:inset 0 2px 6px #0004}
    #app-workspace[data-preset="soft"] :is(.preview-button,.component-pill) {box-shadow:5px 5px 10px #0003,-4px -4px 9px #fff,inset 1px 1px 2px #fff7}
    #app-workspace[data-preset="soft"] :is(.preview-button,.button-sample):active {box-shadow:inset 4px 4px 8px #0005,inset -3px -3px 6px #fff6}
    #app-workspace[data-preset="offset"] :is(.preview-button,.button-sample):active {box-shadow:1px 1px 0 var(--preset-line);transform:translate(2px,2px)}
    #app-workspace[data-preset="raised"] :is(.preview-button,.button-sample):hover {box-shadow:0 5px 10px #0004}
    #app-workspace[data-preset="raised"] :is(.preview-button,.button-sample):active {box-shadow:0 1px 3px #0004}
    #app-workspace[data-preset] .card-sample {padding:var(--preset-padding);min-width:0}
    #app-workspace[data-preset] .card-sample:last-child {background-color:var(--preset-tint) !important}
    #app-workspace[data-preset] .button-sample:last-child {background:transparent !important;border-color:transparent}
    #app-workspace[data-preset="glass"] .preview-hero,
    #app-workspace[data-preset="glass"] .component-row {
      background:var(--preset-secondary);
    }
    #app-workspace[data-preset="glass"] .component-row {padding:12px;border-radius:var(--preset-radius)}
    #app-workspace[data-preset="glass"] .preview-hero::after {
      inset:18% 12% 18% 30%;border:none;background:#ffffff40;
      box-shadow:inset 0 2px 4px #fff6,0 8px 20px #0002;backdrop-filter:blur(14px);
    }
    #app-workspace[data-preset="glass"] :is(.preview-button,.component-pill) {
      --glass-fill:var(--preset-surface);
      border:none;background:color-mix(in srgb,var(--glass-fill) 91%,transparent) !important;
      backdrop-filter:blur(14px) saturate(125%);box-shadow:inset 0 2px 4px #fff3,0 4px 10px #0002;
    }
    #app-workspace[data-preset="glass"] .component-row > :first-child {--glass-fill:var(--preset-primary)}
    #app-workspace[data-preset="glass"] .preview-button {--glass-fill:var(--preset-accent)}
    #app-workspace[data-preset="raw"] :is(.button-sample,.preview-button,.preview-device h4) {font-weight:800;letter-spacing:-.035em}
    #app-workspace[data-preset="raw"] .preview-hero {
      background:var(--preset-primary);
      border-bottom-width:7px;
    }
    #app-workspace[data-preset="raw"] .card-sample {border-width:0 0 3px;border-radius:0}
    #app-workspace[data-preset="offset"] .preview-hero {
      background:var(--preset-primary);
    }
    #app-workspace[data-preset="offset"] :is(.preview-button,.button-sample) {font-weight:750}
    #app-workspace[data-preset="cushion"] :is(.preview-button,.button-sample) {
      border-radius:999px;font-weight:700;box-shadow:inset 0 -4px 0 #0002;
    }
    #app-workspace[data-preset="cushion"] :is(.preview-button,.button-sample):active {transform:translateY(2px);box-shadow:inset 0 -1px 0 #0002}
    #app-workspace[data-preset="cushion"] .card-sample {border-radius:24px 16px 24px 12px}
    #app-workspace[data-preset="cushion"] .preview-hero {
      background:var(--preset-primary);
      border-radius:32px 20px 42px 16px;
    }
    #app-workspace[data-preset] :is(.preview-button,.button-sample):focus-visible {
      outline:3px solid var(--preset-line);outline-offset:3px;
    }
    #app-workspace[data-preset][data-composition="compact"] .preview-hero {height:70px}
    #app-workspace[data-preset][data-composition="compact"] .preview-device h4 {margin-top:12px;font-size:20px}
    #app-workspace[data-preset][data-composition="showcase"] .preview-hero {height:clamp(105px,15vw,150px)}
    #app-workspace[data-preset][data-composition="showcase"] .preview-device h4 {font-size:26px;line-height:1.08}
    #app-workspace[data-preset][data-composition="reading"] .preview-device p {font-size:14px;line-height:1.65;max-width:52ch}
    #app-workspace[data-preset] .preview-device {overflow:auto}
    #app-workspace .card-gallery {display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
    #app-workspace .card-gallery article {display:grid;gap:8px;align-content:start;padding:18px;min-width:0;border:1px solid #ddd;border-radius:12px;background:white;font-family:var(--system-font,Inter),var(--system-font-fallback,sans-serif)}
    #app-workspace .card-gallery .card-body {margin:0;font-size:13px;line-height:1.5;color:inherit}
    #app-workspace .card-gallery .card-title {margin:0;font-size:18px;line-height:1.25;letter-spacing:-.025em}
    #app-workspace .card-gallery small {font-size:11px;letter-spacing:.06em;text-transform:uppercase}
    #app-workspace .card-gallery .card-art {height:52px;background:var(--preset-secondary,#70a4ff);border-radius:inherit;box-shadow:inset -14px 0 var(--preset-accent,#12a4a7)}
    #app-workspace .card-gallery .card-metric {font-size:28px;line-height:1.1;font-weight:700}
    #app-workspace .card-gallery .card-use {text-transform:none;letter-spacing:normal}
    #app-workspace .preview-device {box-sizing:border-box;overflow:auto;overscroll-behavior:contain;scrollbar-width:none}
    #app-workspace .preview-device::-webkit-scrollbar {display:none}
    #app-workspace .preview-device.phone {width:min(100%,310px);height:auto;aspect-ratio:9 / 17;min-height:0;padding:20px 16px 24px}
    #app-workspace .phone .preview-cards .card-gallery {display:grid;grid-template-columns:minmax(0,1fr);gap:12px;padding:0;background:none}
    #app-workspace .preview-device .card-gallery .card-title {margin:0;font-size:17px;line-height:1.25}
    #app-workspace .preview-device .card-gallery .card-body {margin:0;font-size:13px;line-height:1.5}
    #app-workspace .preview-device .preview-button {min-height:40px}
    #app-workspace .preview-cards {margin-top:24px}
    #app-workspace .preview-cards h5 {margin:0 0 12px;font-size:16px}
    #app-workspace[data-preset="glass"] .preview-cards h5 {width:fit-content;padding:4px 9px;border-radius:6px;background:var(--preset-surface);color:var(--preset-ink)}
    #app-workspace .preview-device:not(.phone) .preview-cards .card-gallery {grid-template-columns:repeat(auto-fit,minmax(min(100%,145px),1fr))}
    #app-workspace[data-preset] .card-gallery article {padding:max(16px,var(--card-inset));border-radius:var(--preset-radius);border-width:var(--preset-border);border-color:var(--preset-line)}
    #app-workspace[data-preset="cushion"] .card-gallery article {border-radius:24px 16px 24px 12px}
    #app-workspace[data-preset="raw"] .card-gallery article {border-width:3px}
    #app-workspace .preview-story {display:contents}
    #app-workspace[data-preset="glass"] .preview-device {
      isolation:isolate;background-color:var(--preset-secondary);
      background-image:
        radial-gradient(ellipse at 110% 24%,var(--preset-accent) 0 20%,transparent 43%),
        radial-gradient(ellipse at -12% 76%,var(--preset-primary) 0 22%,transparent 55%),
        linear-gradient(145deg,var(--preset-secondary),var(--preset-tint) 48%,var(--preset-secondary));
    }
    #app-workspace[data-preset="glass"] .preview-device .preview-hero {display:none}
    #app-workspace[data-preset="glass"] .preview-device .preview-hero::after {display:none}
    #app-workspace[data-preset="glass"] .preview-story {
      display:block;position:relative;padding:18px;border-radius:var(--preset-radius);
      background:color-mix(in srgb,var(--preset-surface) 74%,transparent);
      backdrop-filter:blur(16px) saturate(145%);box-shadow:inset 0 2px 5px #fff4,0 12px 28px #0002;
    }
    #app-workspace[data-preset="glass"] .preview-device .card-gallery {background:transparent;padding:0}
    #app-workspace[data-preset="glass"] .preview-device .card-gallery > article {
      background:color-mix(in srgb,var(--preset-surface) 78%,transparent) !important;
      color:var(--preset-ink) !important;backdrop-filter:blur(14px) saturate(135%);
      box-shadow:inset 0 1px 1px #ffffff70,0 5px 18px #0002;
    }
    #app-workspace[data-family="Minimalist"] .preview-device .card-art {height:4px;box-shadow:none}
    #app-workspace[data-family="Flat Design"] .preview-device .card-gallery article {box-shadow:none;border-radius:4px}
    #app-workspace[data-family="Corporate"] .preview-device .card-title {letter-spacing:0}
    #app-workspace[data-family="Modern"] .preview-device .card-art {height:36px}
    #app-workspace[data-family="Material Design"] .preview-device .card-gallery article {border-radius:16px}
    #app-workspace[data-preset="rule"] .preview-device .card-gallery article {border-width:1px 0 0;border-radius:0}
    #app-workspace[data-preset="rule"] .preview-device .card-title {padding-bottom:6px}
    #app-workspace[data-preset="soft"] .preview-device .card-gallery article {background:var(--preset-surface) !important;color:var(--preset-ink) !important}
    #app-workspace[data-preset="cushion"] .preview-device .card-art {border-radius:28px 12px 22px 8px}
    #app-workspace[data-preset="glass"] .preview-story h4 {margin-top:0}
    @media(prefers-reduced-motion:reduce) {#app-workspace[data-preset] :is(.preview-button,.button-sample) {transition:none}}
  `;
  presetStyles.textContent = presetStyles.textContent
    .replaceAll('#app-workspace', ':is(#app-workspace,.published-workspace)')
    .replaceAll('.button-sample):hover', '.button-sample):is(:hover,[data-export-state="Hover"])')
    .replaceAll('.button-sample):active', '.button-sample):is(:active,[data-export-state="Pressed"])')
    .replaceAll('.button-sample):focus-visible', '.button-sample):is(:focus-visible,[data-export-state="Focus"])');
  document.head.append(presetStyles);

  const fontPicker = document.createElement('details');
  fontPicker.className = 'font-picker';
  const fontLabel = document.createElement('summary');
  const fontSearch = document.createElement('input');
  fontSearch.type = 'search';
  fontSearch.className = 'text-input';
  fontSearch.placeholder = 'Search fonts';
  fontSearch.setAttribute('aria-label', 'Search fonts');
  const fontOptions = document.createElement('div');
  fontOptions.style.cssText = 'max-height:16rem;overflow:auto;display:grid;gap:4px';
  fontPicker.append(fontLabel, fontSearch, fontOptions);
  const typeNote = workspace.querySelector('.type-demo + small');
  const typeDemo = workspace.querySelector('.type-demo');
  typeDemo.replaceChildren(...[16, 24, 32].map(size => {
    const sample = document.createElement('div');
    sample.style.cssText = 'font-size:' + size + 'px;letter-spacing:normal';
    sample.textContent = 'Aa · ' + size + ' px';
    return sample;
  }));
  typeNote.replaceWith(fontPicker);
  const loadedFonts = new Set();
  function paintFont(target, requestedFont) {
    const font = presets.hasFont(requestedFont) ? requestedFont : 'Inter';
    if (presets.googleFonts.includes(font) && !loadedFonts.has(font)) {
      loadedFonts.add(font);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?' + new URLSearchParams({ family: font, display: 'swap' });
      document.head.append(link);
    }
    target.style.setProperty('--system-font', JSON.stringify(font));
    target.style.setProperty('--system-font-fallback', presets.fonts[font] || 'sans-serif');
  }

  function applyFont() {
    const font = presets.hasFont(state.fontFamily) ? state.fontFamily : 'Inter';
    paintFont(workspace, font);
    fontLabel.textContent = font + ' ▾';
  }

  let suggestedFonts = [];
  function refreshFonts(style) {
    suggestedFonts = presets.suggestedFonts(style);
    fontPicker.open = false;
    applyFont();
  }
  function drawFontOptions() {
    fontOptions.replaceChildren();
    const query = fontSearch.value.trim().toLowerCase();
    const all = new Set([...presets.googleFonts, ...Object.keys(presets.fonts)]);
    for (const [label, families] of [['Suggested for this style', suggestedFonts], ['All fonts', [...all].sort((a,b) => a.localeCompare(b)).filter(font => !suggestedFonts.includes(font))]]) {
      const matches = families.filter(font => font.toLowerCase().includes(query));
      if (!matches.length) continue;
      const heading = document.createElement('strong');
      heading.textContent = label;
      fontOptions.append(heading);
      for (const font of matches) {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'app-button ghost';
        option.textContent = font;
        option.setAttribute('aria-pressed', String(font === state.fontFamily));
        option.onclick = () => {
          state.fontFamily = font;
          applyFont();
          fontPicker.open = false;
          fontLabel.focus();
        };
        fontOptions.append(option);
      }
    }
    if (!fontOptions.children.length) fontOptions.textContent = 'No matching fonts.';
  }
  fontPicker.addEventListener('toggle', () => {
    if (!fontPicker.open) return;
    fontSearch.value = '';
    drawFontOptions();
    fontSearch.focus();
  });
  fontSearch.addEventListener('input', drawFontOptions);
  fontPicker.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !fontPicker.open) return;
    fontPicker.open = false;
    fontLabel.focus();
  });

  const [buttonRow, cardRow] = workspace.querySelectorAll('.component-row');
  for (const sample of buttonRow.children) {
    sample.classList.add('button-sample');
  }
  cardRow.classList.add('card-gallery');
  const samples = [
    ['Summary card · Default', 'Project progress', 'Three of four milestones are complete.', 'Use for metrics and status at a glance.', '3 of 4'],
    ['Feature card · Featured', 'Release highlights', 'See what’s new in the latest release.', 'Use to spotlight an update or resource.'],
  ];
  cardRow.replaceChildren(...samples.map(([variant, title, description, usage, metric]) => {
    const card = document.createElement('article');
    card.className = 'component-pill card-sample';
    if (!metric) {
      const art = document.createElement('div');
      art.className = 'card-art';
      card.append(art);
    }
    const label = document.createElement('small');
    label.textContent = variant;
    const heading = document.createElement('h4');
    heading.className = 'card-title';
    heading.textContent = title;
    const body = document.createElement('p');
    body.className = 'card-body';
    body.textContent = description;
    card.append(label, heading);
    if (metric) {
      const value = document.createElement('div');
      value.className = 'card-metric';
      value.textContent = metric;
      card.append(value);
    }
    const use = document.createElement('small');
    use.className = 'card-use';
    use.textContent = usage;
    card.append(body, use);
    return card;
  }));
  const devicePreview = workspace.querySelector('#preview-device');
  const story = document.createElement('div');
  story.className = 'preview-story';
  story.append(...devicePreview.querySelectorAll('h4,p,.preview-button'));
  devicePreview.append(story);
  devicePreview.tabIndex = 0;
  devicePreview.setAttribute('aria-label', 'Scrollable device preview');
  const previewCards = document.createElement('section');
  previewCards.className = 'preview-cards';
  const previewTitle = document.createElement('h5');
  previewTitle.textContent = 'Project workspace';
  const previewGallery = cardRow.cloneNode(true);
  previewGallery.querySelectorAll('.card-use, article > small:first-of-type').forEach(note => note.remove());
  previewCards.append(previewTitle, previewGallery);
  devicePreview.append(previewCards);
  function toggleButtonSamples(enabled) {
    for (const sample of Array.from(buttonRow.children)) {
      if ((sample.tagName === 'BUTTON') === enabled) continue;
      const replacement = document.createElement(enabled ? 'button' : 'span');
      if (enabled) replacement.type = 'button';
      for (const attribute of sample.attributes) replacement.setAttribute(attribute.name, attribute.value);
      replacement.textContent = sample.textContent;
      sample.replaceWith(replacement);
    }
  }

  function updatePresetColors(target = workspace) {
    if (!target.dataset.preset) return;
    const read = (role) => target.querySelector(`[data-token="${role}"]`).value;
    const primary = read('primary');
    const accent = read('accent');
    const surface = read('surface');
    const candidate = presets.mix(read('secondary'), surface, 0.08);
    const ink = presets.ink(surface);
    const values = {
      primary, secondary: read('secondary'), accent, surface, ink,
      tint: presets.ink(candidate) === ink ? candidate : surface,
      line: ink,
      'on-primary': presets.ink(primary),
      'on-accent': presets.ink(accent),
    };
    for (const [role, value] of Object.entries(values)) target.style.setProperty('--preset-' + role, value);
  }

  function applyPreset() {
    const preset = presets.get(state.presetId);
    refreshFonts(preset?.style);
    toggleButtonSamples(Boolean(preset));
    paintPreset(workspace, preset);
  }

  function paintPreset(target, preset) {
    if (!preset) {
      delete target.dataset.preset;
      delete target.dataset.family;
      return;
    }
    target.dataset.preset = preset.treatment;
    target.dataset.family = preset.style;
    target.dataset.composition = preset.composition;
    target.style.setProperty('--card-inset', preset.padding + 5 + 'px');
    target.style.setProperty('--preset-radius', preset.radius + 'px');
    target.style.setProperty('--preset-padding', Math.max(6, preset.padding - 4) + 'px ' + preset.padding + 'px');
    target.style.setProperty('--preset-border', preset.border + 'px');
    updatePresetColors(target);
  }
  workspace.addEventListener('input', (event) => {
    if (event.target.matches('[data-token]')) updatePresetColors();
  });

  function startNew() {
    delete state.presetId;
    delete state.fontFamily;
    Object.assign(state, newWizardState());
    showView('new');
    renderStep();
  }

  async function generateWorkspace() {
    await analysisPending;
    if (!root.querySelector('#app-loading').classList.contains('active')) return;
    state.presetId = presets.select({ ...state, description: enrichedBrief() })?.id;
    const selected = presets.get(state.presetId);
    state.fontFamily = selected ? presets.suggestedFonts(selected.style)[0] : 'Inter';
    const surface = state.presetId ? presets.mix(state.colors[1], '#ffffff', 0.1) : '#eef0f7';
    const colors = [...state.colors, surface];
    root.querySelectorAll('#app-workspace [data-token]').forEach((input, index) => {
      input.value = colors[index];
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    applyPreset();
    root.querySelector('#app-workspace [data-device="phone"]').click();
    showView('workspace');
  }
  const steps = [
    { title: 'What are you designing for?', copy: 'Choose the platform you’re targeting.', html: () => `<div class="option-grid">${[['mobile','Mobile app'],['web','Website'],['both','Mobile & web']].map(x => `<button class="option-card ${state.platform===x[0]?'selected':''}" aria-pressed="${state.platform===x[0]}" data-platform="${x[0]}"><span class="check">✓</span><div class="option-icon" aria-hidden="true"></div><div class="option-name">${x[1]}</div></button>`).join('')}</div>` },
    { title: 'Choose your visual direction', copy: 'Pick one style that matches your vision.', html: () => { const opts=['Minimalist','Modern','Brutalist','Neo-Brutalist','Neumorphic','Glassmorphism','Material Design','Editorial','Playful','Corporate','Flat Design']; return `<div class="option-grid style-grid">${opts.map(x => `<button class="option-card ${state.styles.includes(x)?'selected':''}" data-style="${x}" aria-pressed="${state.styles.includes(x)}"><span class="check">✓</span><div class="option-icon" aria-hidden="true">Aa</div><div class="option-name">${x}</div></button>`).join('')}</div>`; } },
    { title: 'Tell us about your project', copy: 'Give us a little context so we can build a design system that fits your product.', html: () => `<label class="field-label">Project description</label><div class="textarea-wrap"><textarea class="text-input textarea" id="project-description" maxlength="300" placeholder="I’m building a fitness app for beginners that focuses on making workouts simple and accessible..."></textarea><span class="char-count" id="char-count">${state.description.length}/300</span></div><p style="font-size:12px;color:#888;margin-top:10px">Include what your product does, who it’s for and the experience you want to create.</p>` },
    { title: 'Choose your colours', copy: 'Select three colours that represent your brand.', html: () => `<div class="palette-row">${['Primary Colour','Secondary Colour','Accent Colour'].map((x,i)=>`<label class="color-field"><span class="field-label">${x}</span><div class="color-picker"><input type="color" value="${state.colors[i]}" data-color-index="${i}"><strong>${state.colors[i].toUpperCase()}</strong></div><input class="color-hex" value="${state.colors[i]}" maxlength="7" data-hex-index="${i}"></label>`).join('')}</div><button class="app-button ghost suggest-palette" id="suggest-palette">✦ Suggest a palette</button>` }
  ];
  const content = root.querySelector('#wizard-content');
  const briefAnalyses = new Map();
  let keywords = [];
  let analysisPending = Promise.resolve();
  function enrichedBrief() {
    return state.description + ' ' + keywords.join(' ');
  }
  function analyzeBrief() {
    const description = state.description.trim();
    keywords = [];
    if (!briefAnalyses.has(description)) briefAnalyses.set(description, (async () => {
      if (!description) return [];
      const headers = { 'Content-Type': 'application/json' };
      if (!localWorkspace) headers.Authorization = 'Bearer ' + await firebaseAuth.currentUser.getIdToken();
      const result = await fetch('/api/project-keywords', {
        method: 'POST', headers, body: JSON.stringify({ description }), signal: AbortSignal.timeout(6500),
      });
      if (!result.ok) return [];
      const data = await result.json();
      return Array.isArray(data.keywords) ? data.keywords : [];
    })().catch(() => []));
    analysisPending = briefAnalyses.get(description).then(result => {
      if (state.description.trim() === description) keywords = result;
    });
  }
  function paletteHue() {
    const brief = state.description.toLowerCase();
    const moods = [
      [/\b(calm|mindful|relaxing|wellness|nature|meditation|yoga|pilates)\b/, 162],
      [/\b(energetic|fitness|sport|workout|food|restaurant)\b/, 17],
      [/\b(luxury|elegant|premium)\b/, 36],
      [/\b(fun|playful|kids|social|music|gaming)\b/, 285],
      [/\b(trust|finance|banking|medical|health|enterprise)\b/, 215],
    ];
    return moods.find(([pattern]) => pattern.test(brief))?.[1] ?? 215;
  }
  function suggestedPalettes() {
    if (/\b(plants?|houseplants?|succulents?|gardens?|gardening|seedlings?|botan(?:y|ical)|horticulture)\b/i.test(state.description)) {
      return [
        ['Fern & sage', ['#284B39', '#DCE8D7', '#74965E']],
        ['Olive & clay', ['#414C30', '#EEE6D4', '#B46143']],
        ['Forest & marigold', ['#1D493D', '#DDEBE3', '#D29A31']],
      ];
    }
    const hue = paletteHue();
    return [['Tonal', 20], ['Analogous', 55], ['Contrasting', 165]].map(([name, offset]) => [
      name, [paletteColor(hue, .58, .34), paletteColor(hue + 18, .38, .8), paletteColor(hue + offset, .76, .52)],
    ]);
  }
  function paletteColor(hue, saturation, lightness) {
    const a = saturation * Math.min(lightness, 1 - lightness);
    return '#' + [0, 8, 4].map(offset => {
      const k = (offset + (hue + 360) / 30) % 12;
      const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(255 * value).toString(16).padStart(2, '0');
    }).join('');
  }
  function drawPalettes() {
    const box = content.querySelector('#palette-options');
    box.replaceChildren();
    for (const [name, colors] of suggestedPalettes()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'app-button ghost';
      button.style.cssText = 'display:inline-flex;align-items:center;gap:4px;margin:4px;padding:8px';
      button.textContent = name;
      button.title = colors.join(' · ');
      for (const color of colors) {
        const chip = document.createElement('span');
        chip.style.cssText = 'width:15px;height:15px;border-radius:50%;background:' + color;
        button.append(chip);
      }
      button.onclick = () => applyPalette(colors);
      box.append(button);
    }
  }
  function applyPalette(colors) {
    content.querySelectorAll('[data-color-index]').forEach((picker, i) => {
      picker.value = colors[i];
      picker.dispatchEvent(new Event('input'));
    });
  }
  let explorationHue = Math.random() * 360;
  function bindPaletteSuggestions(button) {
    const box = document.createElement('div');
    box.id = 'palette-options';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Suggested palettes');
    button.after(box);
    analyzeBrief();
    drawPalettes();
    button.onclick = () => {
      explorationHue = (explorationHue + 137.508) % 360;
      const h = explorationHue;
      const [secondary, accent] = [[120, 240], [150, 210], [80, 195], [50, 185]][Math.floor(Math.random() * 4)];
      applyPalette([paletteColor(h, .62, .34), paletteColor(h + secondary, .43, .76), paletteColor(h + accent, .73, .51)]);
    };
  }
  function renderStep(){ const s=steps[state.step-1]; root.querySelector('#step-label').textContent=`Step ${state.step} of ${steps.length}`;root.querySelector('#progress-bar').style.width=`${state.step / steps.length * 100}%`;content.innerHTML=`<div class="app-kicker">Design direction</div><h2>${s.title}</h2><p class="wizard-copy">${s.copy}</p>${s.html()}`;
    const description = content.querySelector('#project-description');
    if (description) description.value = state.description;
    bindStep();root.querySelector('#wizard-back').disabled=state.step===1;root.querySelector('#wizard-next').disabled=state.step===2 && state.styles.length!==1;root.querySelector('#wizard-next').textContent=state.step===steps.length?'Generate my design system →':'Next →';}
  function bindColorPickers() {
    for (const picker of content.querySelectorAll('[data-color-index]')) {
      const index = picker.dataset.colorIndex;
      const field = picker.closest('.color-field');
      const label = field.querySelector('strong');
      const hex = field.querySelector('[data-hex-index]');
      const sync = () => {
        state.colors[index] = picker.value;
        label.textContent = picker.value.toUpperCase();
        hex.value = label.textContent;
      };
      picker.oninput = sync;
      picker.onchange = sync;
    }
  }
  function bindStep(){content.querySelectorAll('[data-platform]').forEach(b=>b.onclick=()=>{state.platform=b.dataset.platform;renderStep()});content.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{state.styles=[b.dataset.style];renderStep()});const desc=content.querySelector('#project-description');if(desc)desc.oninput=()=>{state.description=desc.value;content.querySelector('#char-count').textContent=`${desc.value.length}/300`};bindColorPickers();content.querySelectorAll('[data-hex-index]').forEach(i=>i.onchange=()=>{if(/^#[0-9a-f]{6}$/i.test(i.value)){state.colors[i.dataset.hexIndex]=i.value;renderStep()}else{i.value=state.colors[i.dataset.hexIndex]}});const suggest=content.querySelector('#suggest-palette');if(suggest)bindPaletteSuggestions(suggest);}
  window.DSGenDashboard = {
    renderPublishedWorkspace(system) {
      const layout = workspace.querySelector('.workspace-layout').cloneNode(true);
      layout.classList.add('published-workspace');
      const device = layout.querySelector('#preview-device');
      device.removeAttribute('id');
      device.removeAttribute('style');
      const previewDevice = layout.querySelector('[data-device="phone"]');
      const setDevice = size => {
        device.className = 'preview-device ' + size;
        layout.querySelectorAll('[data-device]').forEach(button => {
          const selected = button.dataset.device === size;
          button.classList.toggle('active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
      };
      setDevice(previewDevice.dataset.device);
      layout.querySelectorAll('[data-device]').forEach(button => {
        button.onclick = () => setDevice(button.dataset.device);
      });
      const defaults = { primary: '#3854ef', secondary: '#70a4ff', accent: '#12a4a7', surface: '#eef0f7' };
      layout.querySelectorAll('[data-token]').forEach(input => {
        const role = input.dataset.token;
        input.value = system.tokens?.colors?.[role] || defaults[role];
        input.nextElementSibling.style.background = input.value;
        input.parentElement.title = role + ' ' + input.value;
        device.style.setProperty('--preview-' + role, input.value);
      });
      const font = system.tokens?.typography?.fontFamily || 'Inter';
      paintFont(layout, font);
      const fontName = document.createElement('small');
      fontName.textContent = font;
      layout.querySelector('.font-picker').replaceWith(fontName);
      const preset = presets.get(system.wizard?.presetId) || presets.select({
        styles: system.wizard?.styles || [], description: system.description || '',
      });
      paintPreset(layout, preset);
      layout.querySelectorAll('[data-token]').forEach(input => input.remove());
      return layout;
    },
    root,
    showView,
    startNew,
    registerView(view) { views.push(view); },
    getWizardState() { return JSON.parse(JSON.stringify(state)); },
    setWizardState(values) {
      Object.assign(state, values);
      state.step = 1;
      renderStep();
      applyPreset();
    },
  };
  root.querySelector('#wizard-next').onclick=()=>{if(state.step<steps.length){state.step++;renderStep()}else{
    const print = root.querySelector('.loading-print');
    state.colors.slice(0, 3).forEach((color, index) => print.style.setProperty('--print-' + (index + 1), color));
    showView('loading');setTimeout(() => { if (root.querySelector('#app-loading').classList.contains('active')) generateWorkspace(); }, localWorkspace ? 250 : 10000 + Math.random() * 5000)}};root.querySelector('#wizard-back').onclick=()=>{if(state.step>1){state.step--;renderStep()}};
  root.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-device]').forEach(x=>x.classList.remove('active'));b.classList.add('active');root.querySelector('#preview-device').className=`preview-device ${b.dataset.device}`});
  root.querySelectorAll('[data-token]').forEach(i=>i.oninput=()=>{const color=i.value;root.querySelector(`.swatch-edit input[data-token="${i.dataset.token}"] + span`).style.background=color;root.querySelector('#preview-device').style.setProperty(`--preview-${i.dataset.token}`,color)});
  function updateLayout(user) {
    const browsingCommunity = location.pathname === '/community';
    const previewLanding = localWorkspace && location.pathname === '/landing';
    const workspace = (localWorkspace && !previewLanding && !browsingCommunity) || Boolean(user);
    if (previewLanding) {
      document.querySelectorAll('[data-auth-trigger]').forEach(button => {
        button.addEventListener('click', event => {
          event.stopImmediatePropagation();
          location.assign('/');
        }, { capture: true });
      });
    }
    root.classList.toggle('public-community', browsingCommunity && !workspace);
    root.style.display = workspace || browsingCommunity ? 'block' : 'none';
    document.querySelector('header').style.display = workspace && !browsingCommunity ? 'none' : '';
    document.querySelector('main#top').style.display = workspace || browsingCommunity ? 'none' : '';
    document.querySelector('body > footer').style.display = workspace && !browsingCommunity ? 'none' : '';

    const name = (user?.displayName || '').split(' ')[0];
    root.querySelector('#user-name').textContent = name ? `, ${name}` : '';
    if (!workspace && !browsingCommunity) showView('home');
  }
  if (localWorkspace) updateLayout(null);
  else firebaseAuth.onAuthStateChanged(updateLayout);
})();
