const signInButton = document.querySelector('.sign-in');

const avatarStyles = document.createElement('style');
avatarStyles.textContent = '.nav .user-avatar{width:44px;height:44px;padding:0;display:grid;place-items:center;border-radius:50%;font-size:18px;font-weight:600;background:#000;color:#fff}';
document.head.appendChild(avatarStyles);

const faqStyles = document.createElement('style');
faqStyles.textContent = '.faq{background-image:linear-gradient(90deg,transparent 0%,transparent 28%,rgba(255,255,255,.22) 38%,#fff 57%,#fff 100%),linear-gradient(#0000000b 1px,transparent 1px),linear-gradient(90deg,#0000000b 1px,transparent 1px)!important;background-size:100% 100%,100px 100px,100px 100px!important}';
document.head.appendChild(faqStyles);

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

firebaseAuth.onAuthStateChanged(updateHeaderAuth);
