const signInButton = document.querySelector('.sign-in');

const avatarStyles = document.createElement('style');
avatarStyles.textContent = '.nav .user-avatar{width:44px;height:44px;padding:0;display:grid;place-items:center;border-radius:50%;font-size:18px;font-weight:600;background:#000;color:#fff}';
document.head.appendChild(avatarStyles);

const faqStyles = document.createElement('style');
faqStyles.textContent = '.faq{background-image:linear-gradient(90deg,transparent 0%,transparent 28%,rgba(255,255,255,.22) 38%,#fff 57%,#fff 100%),linear-gradient(#0000000b 1px,transparent 1px),linear-gradient(90deg,#0000000b 1px,transparent 1px)!important;background-size:100% 100%,100px 100px,100px 100px!important}';
document.head.appendChild(faqStyles);

const authStyles = document.createElement('style');
authStyles.textContent = `
  .auth-dialog {
    width: min(460px, calc(100vw - 32px));
    max-width: none;
    padding: 0;
    overflow: hidden;
    border: 1px solid #000;
    border-radius: 24px;
    background: #fff;
    color: #000;
    box-shadow: 0 28px 90px rgba(0,0,0,.24);
  }
  .auth-dialog::backdrop { background: rgba(0,0,0,.62); backdrop-filter: blur(5px); }
  .auth-dialog-head { padding: 30px 32px 0; }
  .auth-dialog-head > div > div:first-child { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: rgba(0,0,0,.52); }
  .auth-dialog h2 { margin: 10px 0 0; font-size: 32px; line-height: 1.05; letter-spacing: -.06em; }
  .auth-close { width: 36px; height: 36px; display: grid; place-items: center; margin: -5px -6px 0 0; border: 1px solid #000; border-radius: 50%; background: #fff; font-size: 23px; line-height: 1; transition: background .16s, color .16s; }
  .auth-close:hover { background: #000; color: #fff; }
  .auth-dialog-copy { margin: 24px 32px 0; color: rgba(0,0,0,.58); font-size: 15px; line-height: 1.55; }
  #google-button-container, .account-panel { margin: 28px 32px 0; padding-top: 24px; border-top: 1px solid rgba(0,0,0,.14); }
  #google-sign-in, .account-panel > button { width: 100%; min-height: 54px; border-radius: 12px !important; font-size: 15px; font-weight: 500; }
  .account-panel { position: relative; padding-left: 62px; }
  .account-panel::before { content: attr(data-initial); position: absolute; left: 0; top: 24px; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; background: #000; color: #fff; font-size: 18px; font-weight: 600; }
  .account-label { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: rgba(0,0,0,.5); }
  .account-name { margin: 6px 0 20px; font-size: 19px; letter-spacing: -.03em; }
  .account-panel > button { background: #fff !important; color: #000 !important; border: 1px solid #000 !important; }
  .account-panel > button:hover { background: #000 !important; color: #fff !important; }
  .auth-feedback { min-height: 20px; margin: 18px 32px 28px; font-size: 13px; color: rgba(0,0,0,.55); }
`;
document.head.appendChild(authStyles);

function getInitial(user) {
  return (user?.displayName?.trim()?.[0] || user?.email?.trim()?.[0] || '?').toUpperCase();
}

function updateHeaderAuth(user) {
  if (!signInButton) return;
  if (user) {
    signInButton.textContent = getInitial(user);
    signInButton.classList.add('user-avatar');
    signInButton.setAttribute('aria-label', `Signed in as ${user.displayName || user.email || 'Google account'}`);
  } else {
    signInButton.textContent = 'Sign in';
    signInButton.classList.remove('user-avatar');
    signInButton.setAttribute('aria-label', 'Sign in');
  }
}

const accountPanel = document.querySelector('#account-panel');
const originalShowAccount = window.showAccount;
if (accountPanel) {
  const observer = new MutationObserver(() => {
    const name = document.querySelector('#account-name')?.textContent?.trim() || '?';
    accountPanel.dataset.initial = name[0].toUpperCase();
  });
  observer.observe(accountPanel, { subtree: true, childList: true, characterData: true });
  const initialName = document.querySelector('#account-name')?.textContent?.trim() || '?';
  accountPanel.dataset.initial = initialName[0].toUpperCase();
}

firebaseAuth.onAuthStateChanged(updateHeaderAuth);
