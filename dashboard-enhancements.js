(() => {
  const dashboard = document.querySelector('#app-dashboard');
  if (!dashboard) return;

  const style = document.createElement('style');
  style.textContent = `
    .app-sidebar { border-right: 1px solid #242424; }
    .app-brand { font-size: 22px; }
    .app-nav button { font-family: Inter, Arial, sans-serif; transition: background .16s, color .16s; }
    .app-signout { margin-top: 18px; padding: 12px; border: 1px solid #444; border-radius: 9px; background: transparent; color: #aaa; text-align: left; font-size: 14px; cursor: pointer; transition: background .16s, color .16s, border-color .16s; }
    .app-signout:hover { background: #fff; border-color: #fff; color: #000; }
    .app-signout::before { content: '↪'; display: inline-block; margin-right: 9px; font-size: 16px; }
    .app-main { background: #f7f7f5; }
    .system-card, .token-panel, .mockup-panel { box-shadow: 0 1px 0 rgba(0,0,0,.03); }
    .app-button { transition: transform .16s, background .16s; }
    .app-button:hover { transform: translateY(-2px); }
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
