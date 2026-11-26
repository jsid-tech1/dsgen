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
    .app-nav button,.app-signout,.mockup-toolbar [data-device]{display:inline-flex;align-items:center;gap:10px;min-height:44px}
    .app-nav button{color:#c6c6bd}.app-nav button.active{background:var(--accent);color:var(--ink);font-weight:600}
    .app-signout{margin-top:16px;padding:10px 12px;border:1px solid #58594f;border-radius:10px;background:transparent;color:white}
    .app-topline,.workspace-header{gap:20px;flex-wrap:wrap}.app-topline>div:first-child,.workspace-header>div:first-child{flex:1 1 270px;min-width:0}
    #app-dashboard .app-title,.wizard h2,.loading-card h2{font-size:clamp(32px,3.7vw,58px);font-weight:550;letter-spacing:-.06em;line-height:1.04}
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
    .loading-orbit{border:8px solid #d9ceff;border-top-color:#5b46b8;background:var(--theme-wash)}.game-board{border-radius:12px;background:var(--theme-wash)}
    @media(hover:hover){
      #app-dashboard .app-button:not(:disabled):hover{background:var(--theme-dark);border-color:var(--theme-dark);color:white}
      #app-dashboard .app-button.ghost:not(:disabled):hover,.app-nav button:not(.active):hover{background:var(--theme-wash);color:var(--ink)}
      .option-card:hover{border-color:var(--theme-dark)}
    }
    .community-toolbar{margin-top:0}.community-filter.active{background:#29251e}.community-review-dialog{background:#ffffff}
    .system-title-icon{display:inline-flex;align-items:center;color:#55564e}.workspace-header{padding-bottom:20px;border-bottom:1px solid var(--line)}
    #app-dashboard :is(button,input,select,textarea):focus-visible{outline:3px solid #6654cf;outline-offset:2px}
    @media(max-width:1000px){.app-sidebar{display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;gap:12px}.public-community .app-sidebar{display:none}.app-brand,.app-signout{margin:0}.app-nav{display:flex;flex-wrap:wrap;gap:4px}}
    @media(max-width:650px){.app-sidebar{padding:14px 16px}.app-nav{order:3;width:100%;justify-content:space-between}.app-nav button{gap:4px;flex-direction:column;justify-content:center;flex:1;padding:6px 2px}.app-signout{margin-left:auto}.app-topline .app-button{margin-right:6px}.wizard-footer{gap:8px;flex-wrap:wrap}.wizard-footer .right-actions{flex-wrap:wrap}.style-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.app-main{padding:24px 16px}.community-dialog-actions{flex-wrap:wrap}}
  `;
  document.head.appendChild(style);

  if (localWorkspace) return;

  const signOut = document.createElement('button');
  signOut.className = 'app-signout';
  signOut.type = 'button';
  signOut.textContent = 'Sign out';
  signOut.addEventListener('click', () => document.querySelector('#sign-out')?.click());
  dashboard.querySelector('.app-sidebar')?.appendChild(signOut);
})();
