(() => {
  const dashboard = document.querySelector('#app-dashboard');
  if (!dashboard) return;

  // Each mask inherits the control's foreground color, including its selected state.
  const symbols = [
    ['.app-nav [data-app-view="home"]', 'M3 10l9-7 9 7v10h-6v-7H9v7H3z'],
    ['.app-nav [data-app-view="systems"]', 'M3 6h7l2 3h9v11H3z'],
    ['.app-nav [data-app-view="new"]', 'M12 4v16M4 12h16'],
    ['.app-nav [data-app-view="community"]', 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-2a7 7 0 0 1 14 0v2M16 5a3.5 3.5 0 0 1 0 7m2 3a5 5 0 0 1 4 5'],
    ['.app-signout', 'M10 4H4v16h6m-1-8h12m-5-5 5 5-5 5'],
    ['[data-platform="mobile"] .option-icon, [data-device="phone"]', 'M7 2h10v20H7zM11 18h2'],
    ['[data-platform="web"] .option-icon', 'M2 4h20v16H2zM2 9h20M5 6.5h1'],
    ['[data-platform="both"] .option-icon', 'M11 16H2V4h18v5M5 20h6m-3-4v4m6-10h8v12h-8z'],
    ['[data-device="tablet"]', 'M4 3h16v18H4zM11 18h2'],
    ['[data-device="laptop"]', 'M4 5h16v12H4zM1 20h22l-3-3H4z'],
    ['.system-title-icon', 'M4 16 16 4l4 4L8 20l-5 1zM14 6l4 4']
  ];
  const iconRules = symbols.map(([selectors, path]) => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="' + path + '" fill="none" stroke="black" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const rule = selectors.split(', ').map(selector => '#app-dashboard ' + selector + '::before').join(',');
    return rule + '{content:"";display:inline-block;vertical-align:middle;width:var(--icon-size,19px);height:var(--icon-size,19px);flex:none;background:currentColor;mask:url("data:image/svg+xml,' + encodeURIComponent(svg) + '") center/contain no-repeat}';
  }).join('');
  const style = document.createElement('style');
  style.textContent = `
    ${iconRules}
    #app-dashboard{--canvas:#ffffff;--ink:#181915;--accent:var(--theme-accent);--line:#d9d8cd;background:var(--canvas);color:var(--ink)}
    .app-main{background:var(--canvas);min-width:0}.app-sidebar{background:#141512}.app-brand{font-size:28px;color:var(--accent)}
    .sidebar-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:36px;margin-bottom:60px}
    .sidebar-heading .app-brand{margin:0 0 0 12px}
    @media(max-width:1000px){.sidebar-heading{margin-bottom:0}.sidebar-heading .app-brand{margin:0}}
    .app-nav button,.app-signout,.mockup-toolbar [data-device]{display:inline-flex;align-items:center;gap:10px;min-height:44px}
    .app-nav button{color:#c6c6bd}.app-nav button.active{background:var(--accent);color:var(--ink);font-weight:600}
    @media(min-width:1001px){
      #app-dashboard.sidebar-collapsed .app-shell{grid-template-columns:76px minmax(0,1fr)}
      #app-dashboard.sidebar-collapsed .app-sidebar{padding-inline:12px}
      #app-dashboard.sidebar-collapsed .sidebar-heading{justify-content:center;gap:0}
      #app-dashboard.sidebar-collapsed .app-brand{display:none}
      #app-dashboard.sidebar-collapsed .app-nav button,#app-dashboard.sidebar-collapsed .app-signout{justify-content:center;font-size:0;gap:0}
      #app-dashboard.sidebar-collapsed .app-nav button::before,#app-dashboard.sidebar-collapsed .app-signout::before{--icon-size:22px}
      #app-dashboard.sidebar-collapsed .app-side-note{display:none}
      #app-dashboard.sidebar-collapsed .sidebar-toggle{margin-inline:auto}
      #app-dashboard.sidebar-collapsed .sidebar-profile{justify-content:center;padding:9px 0}
      #app-dashboard.sidebar-collapsed .sidebar-account-name{display:none}
      #app-dashboard.sidebar-collapsed .sidebar-account-menu{width:150px}
    }
    .sidebar-toggle{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;margin:0;padding:0;border:0;border-radius:9px;background:transparent;color:#aaa;cursor:pointer}
    .sidebar-toggle svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .sidebar-toggle:hover{background:#292a26}.sidebar-toggle:focus-visible{outline:3px solid #a797cf;outline-offset:2px}
    .app-signout{margin-top:16px;padding:10px 12px;border:1px solid #58594f;border-radius:10px;background:transparent;color:white}
    .sidebar-account{position:relative;margin-top:16px}.sidebar-account[hidden]{display:none}.sidebar-profile{width:100%;display:flex;align-items:center;gap:10px;padding:9px;border:1px solid #58594f;border-radius:10px;background:transparent;color:white;text-align:left;cursor:pointer}
    .sidebar-avatar{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:50%;background:var(--accent);color:#141512;font-weight:650;overflow:hidden}.sidebar-avatar img{width:100%;height:100%;object-fit:cover}
    .sidebar-account-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.sidebar-account-menu{position:absolute;bottom:calc(100% + 8px);left:0;width:100%;padding:5px;background:#252621;border:1px solid #58594f;border-radius:10px;z-index:5}.sidebar-account-menu[hidden]{display:none}.sidebar-account-menu button{width:100%;padding:10px;border:0;border-radius:7px;background:transparent;color:#fff;text-align:left;cursor:pointer}.sidebar-account-menu button:hover{background:#393a34}
    #app-workspace .swatches{gap:10px;flex-wrap:wrap}#app-workspace .swatch-edit{width:52px;height:auto;overflow:visible;border:0;display:flex;flex-direction:column;gap:6px;cursor:pointer}
    #app-workspace .swatch-edit input{height:42px;bottom:auto;z-index:1}#app-workspace .swatch-edit span:first-of-type{height:42px;border:1px solid var(--line);border-radius:8px}
    #app-workspace .swatch-hex{width:100%;font:500 10px/1.3 ui-monospace,SFMono-Regular,monospace;color:#56574e;text-align:center;text-transform:uppercase}
    #app-workspace .font-picker{position:relative;padding:0;border:0;background:transparent}#app-workspace .font-picker summary{list-style:none;display:flex;align-items:center;justify-content:space-between;min-height:42px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:13px;font-weight:550}
    #app-workspace .font-picker summary::-webkit-details-marker{display:none}#app-workspace .font-picker summary::after{content:'⌄';color:#56574e;font-size:18px;line-height:1}#app-workspace .font-picker[open] summary{border-color:var(--theme-dark)}
    #app-workspace .font-picker>input,#app-workspace .font-picker>div{position:relative;z-index:2}#app-workspace .font-picker>input{margin:8px 0 0;border-radius:9px}#app-workspace .font-picker>div{padding:8px;border:1px solid var(--line);border-radius:10px;background:#fff;box-shadow:0 8px 24px #00000012}#app-workspace .font-picker>div button{font-size:12px;padding:8px 10px;min-height:34px}
    .app-topline,.workspace-header{gap:20px;flex-wrap:wrap}.app-topline>div:first-child,.workspace-header>div:first-child{flex:1 1 270px;min-width:0}
    #app-dashboard .app-title,.wizard h2{font-size:clamp(32px,3.7vw,58px);font-weight:550;letter-spacing:-.06em;line-height:1.04}
    .app-kicker,.app-subtitle,.wizard-copy,.progress-row{color:#56574e}.app-kicker{font-weight:650}
    #app-home .app-topline,#app-systems .app-topline,#app-community .app-topline{padding:clamp(20px,3vw,44px);border-radius:18px;background:var(--accent);margin-bottom:32px}
    #app-systems .app-topline{background:var(--theme-wash)}#app-community .app-topline{background:var(--accent)}
    .system-card,.color-field,.option-card{border-color:var(--line)}.system-card.new{background:var(--theme-wash)}
    #app-dashboard .app-button{border-radius:11px;min-height:42px;font-weight:550}
    .wizard{padding:clamp(20px,3.5vw,48px);background:#fff;border:1px solid var(--line);border-radius:20px}
    .progress-bar{background:var(--theme-dark)}.progress-track{margin-bottom:clamp(26px,4vw,52px)}.wizard-copy{line-height:1.5}
    .option-card{text-align:left;color:var(--ink)}.option-card.selected{background:var(--theme-wash)}.option-icon{--icon-size:32px}
    .style-grid .option-icon{font-weight:650;color:#4c4188}.option-card[data-style="Editorial"] .option-icon{font-family:Georgia,serif;font-style:italic}
    .option-card[data-style*="Brutalist"] .option-icon{font-family:monospace;font-weight:900}.option-card[data-style="Playful"] .option-icon{transform:rotate(-8deg);transform-origin:left bottom;color:#a53372}

    /* Each specimen occupies the same area so labels and selection targets stay aligned. */
    .style-grid .option-card{min-width:0;isolation:isolate}
    .style-grid .option-card .option-icon{
      position:relative;display:flex;align-items:center;overflow:hidden;height:64px;
      margin:0 0 12px;padding:0 12px;border-radius:6px;background:#f5f4f0;
      color:#242329;font:500 26px/1 Arial,sans-serif;letter-spacing:-.06em;transform:none
    }
    .style-grid .option-icon::after{content:"";position:absolute;right:12px}
    .style-grid [data-style="Minimalist"] .option-icon{background:white;font-weight:400;border-bottom:1px solid #bdbdb9;border-radius:0}
    .style-grid [data-style="Modern"] .option-icon{background:linear-gradient(120deg,#192944,#445477);color:white}
    .style-grid [data-style="Modern"] .option-icon::after{width:28px;height:28px;border:1px solid #c0defe;border-radius:50%;box-shadow:7px -5px 0 -1px #92b5ef}
    .style-grid [data-style="Brutalist"] .option-icon{border:3px solid #171717;border-radius:0;background:#eeeae4;font:900 28px/1 monospace}
    .style-grid [data-style="Brutalist"] .option-icon::after{height:24px;width:18px;background:repeating-linear-gradient(90deg,#191919 0 3px,transparent 3px 5px)}
    .style-grid [data-style="Neo-Brutalist"] .option-icon{border:2px solid #222;border-radius:1px;background:#ffd2ba;box-shadow:3px 3px #222;font-weight:900}
    .style-grid [data-style="Neo-Brutalist"] .option-icon::after{width:19px;height:19px;background:#c4a7f6;border:2px solid;transform:rotate(10deg)}
    .style-grid [data-style="Neumorphic"] .option-icon{background:#e8ebef;color:#454d60}
    .style-grid [data-style="Neumorphic"] .option-icon::after{width:26px;height:26px;border-radius:50%;background:#e8ebef;box-shadow:4px 4px 7px #afb5c0,-4px -4px 7px white}
    .style-grid [data-style="Glassmorphism"] .option-icon{background:radial-gradient(circle at 70% 55%,#a880ee,transparent 35%),linear-gradient(125deg,#d2edf8,#e2c7fb)}
    .style-grid [data-style="Glassmorphism"] .option-icon::after{width:30px;height:28px;border:1px solid #fffd;border-radius:6px;background:#ffffff50;backdrop-filter:blur(4px);transform:rotate(-9deg)}
    .style-grid [data-style="Material Design"] .option-icon{background:#e8def8;color:#382957}
    .style-grid [data-style="Material Design"] .option-icon::after{width:28px;height:22px;border-radius:8px;background:#766098;box-shadow:0 3px 4px #38295755}
    .style-grid [data-style="Editorial"] .option-icon{background:#faf4e7;font:italic 36px/1 Georgia,serif;color:#572e38}
    .style-grid [data-style="Editorial"] .option-icon::after{width:24px;height:20px;background:repeating-linear-gradient(#765b50 0 1px,transparent 1px 5px)}
    .style-grid [data-style="Playful"] .option-icon{background:#ffe3ed;color:#ae2961;font:bold 29px/1 Georgia,serif}
    .style-grid [data-style="Playful"] .option-icon::after{width:22px;height:22px;border-radius:50% 50% 4px 50%;background:#ff995d;box-shadow:8px -6px #aa8fe7;transform:rotate(18deg)}
    .style-grid [data-style="Corporate"] .option-icon{background:#edf1f6;color:#203e62;font-weight:700}
    .style-grid [data-style="Corporate"] .option-icon::after{width:23px;height:20px;background:linear-gradient(to top,#365675 40%,transparent 40%) left/6px 100% no-repeat,linear-gradient(to top,#365675 68%,transparent 68%) center/6px 100% no-repeat,linear-gradient(#365675,#365675) right/6px 100% no-repeat}
    .style-grid [data-style="Flat Design"] .option-icon{background:#bfe9e1;color:#124c4c;border-radius:0}
    .style-grid [data-style="Flat Design"] .option-icon::after{width:23px;height:23px;background:#25796f;border-radius:50% 0 0 0}
    .style-grid .option-card.selected{border-color:var(--theme-dark);background:var(--theme-wash)}
    .style-grid .check{z-index:1;background:var(--theme-dark)}
    @media(hover:hover){
      #app-dashboard .app-button:not(:disabled):hover{background:var(--theme-dark);border-color:var(--theme-dark);color:white}
      #app-dashboard .app-button.ghost:not(:disabled):hover,.app-nav button:not(.active):hover{background:var(--theme-wash);color:var(--ink)}
      .option-card:hover{border-color:var(--theme-dark)}
    }
    .community-toolbar{margin-top:0}.community-filter.active{background:#29251e}.community-review-dialog{background:#ffffff}
    .system-title-icon{display:inline-flex;align-items:center;color:#55564e}.workspace-header{padding-bottom:20px;border-bottom:1px solid var(--line)}
    #app-dashboard :is(button,input,select,textarea):focus-visible{outline:3px solid #6654cf;outline-offset:2px}
    @media(max-width:1000px){.app-sidebar{display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;gap:12px}.public-community .app-sidebar{display:none}.app-brand,.sidebar-account{margin:0}.app-nav{display:flex;flex-wrap:wrap;gap:4px}.sidebar-toggle{display:none}}
    @media(max-width:650px){.app-sidebar{padding:14px 16px}.app-nav{order:3;width:100%;justify-content:space-between}.app-nav button{gap:4px;flex-direction:column;justify-content:center;flex:1;padding:6px 2px}.app-signout{margin-left:auto}.app-topline .app-button{margin-right:6px}.wizard-footer{gap:8px;flex-wrap:wrap}.wizard-footer .right-actions{flex-wrap:wrap}.style-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.app-main{padding:24px 16px}.community-dialog-actions{flex-wrap:wrap}}
  `;
  document.head.appendChild(style);

  const sidebar = dashboard.querySelector('.app-sidebar');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4"/><path d="M8.5 3v18"/></svg>';
  const setCollapsed = (collapsed) => {
    dashboard.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggle.setAttribute('title', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggle.setAttribute('aria-expanded', String(!collapsed));
  };
  const heading = document.createElement('div');
  heading.className = 'sidebar-heading';
  const brand = sidebar.querySelector('.app-brand');
  sidebar.insertBefore(heading, brand);
  heading.append(brand, toggle);
  setCollapsed(false);
  toggle.addEventListener('click', () => setCollapsed(!dashboard.classList.contains('sidebar-collapsed')));
  sidebar.querySelectorAll('.app-nav button').forEach(button => {
    button.title = button.textContent.trim();
    button.setAttribute('aria-label', button.textContent.trim());
  });

  dashboard.querySelectorAll('#app-workspace .swatch-edit').forEach(label => {
    const input = label.querySelector('input');
    const hex = document.createElement('span');
    hex.className = 'swatch-hex';
    const updateHex = () => { hex.textContent = input.value; };
    label.appendChild(hex);
    updateHex();
    input.addEventListener('input', updateHex);
  });

  if (localWorkspace) return;

  const account = document.createElement('div');
  account.className = 'sidebar-account';
  account.hidden = true;
  account.innerHTML = '<button type="button" class="sidebar-profile" aria-haspopup="menu" aria-expanded="false"><span class="sidebar-avatar"></span><span class="sidebar-account-name"></span></button><div class="sidebar-account-menu" role="menu" hidden><button type="button" role="menuitem">Sign out</button></div>';
  sidebar.appendChild(account);
  const profile = account.querySelector('.sidebar-profile');
  const menu = account.querySelector('.sidebar-account-menu');
  const closeMenu = () => { menu.hidden = true; profile.setAttribute('aria-expanded', 'false'); };
  profile.addEventListener('click', () => { menu.hidden = !menu.hidden; profile.setAttribute('aria-expanded', String(!menu.hidden)); });
  account.querySelector('[role="menuitem"]').addEventListener('click', () => { closeMenu(); document.querySelector('#sign-out')?.click(); });
  document.addEventListener('click', event => { if (!account.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  firebaseAuth.onAuthStateChanged(user => {
    if (!user) { account.hidden = true; closeMenu(); return; }
    account.hidden = false;
    const displayName = user.displayName || user.email || 'Google account';
    account.querySelector('.sidebar-account-name').textContent = displayName;
    profile.setAttribute('aria-label', `Account: ${displayName}`);
    profile.title = displayName;
    const avatar = account.querySelector('.sidebar-avatar');
    avatar.replaceChildren();
    if (user.photoURL) {
      const image = document.createElement('img');
      image.src = user.photoURL;
      image.alt = '';
      image.referrerPolicy = 'no-referrer';
      image.onerror = () => { avatar.textContent = displayName[0].toUpperCase(); };
      avatar.appendChild(image);
    } else avatar.textContent = displayName[0].toUpperCase();
  });
})();
