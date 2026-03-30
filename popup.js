const API = 'http://localhost:8147';

let accessToken = null;
let userPlan = null;
let authMode = 'disabled';

// --- Auth ---

async function getStoredToken() {
  const { auth } = await chrome.storage.local.get('auth');
  if (auth && auth.access_token) {
    accessToken = auth.access_token;
    return true;
  }
  return false;
}

async function fetchAuthConfig() {
  try {
    const res = await fetch(`${API}/api/auth/config`);
    if (res.ok) {
      const cfg = await res.json();
      authMode = cfg.mode || 'disabled';
    }
  } catch (e) {
    console.warn('Failed to fetch auth config:', e);
  }
}

async function login() {
  if (authMode === 'mock' || authMode === 'disabled') {
    await mockLogin();
    return;
  }
  const redirectUrl = chrome.identity.getRedirectURL();
  const authUrl = `${API}/ext-auth.html?redirect_url=${encodeURIComponent(redirectUrl)}`;
  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true });
    const params = new URL(responseUrl).searchParams;
    const token = params.get('access_token');
    const refresh = params.get('refresh_token');
    if (token) {
      accessToken = token;
      await chrome.storage.local.set({ auth: { access_token: token, refresh_token: refresh } });
      init();
    }
  } catch (e) {
    console.warn('Auth flow cancelled or failed:', e);
  }
}

async function mockLogin() {
  try {
    const res = await fetch(`${API}/api/auth/mock/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dev User', email: 'dev@figney.local' }),
    });
    const data = await res.json();
    if (data.access_token) {
      accessToken = data.access_token;
      await chrome.storage.local.set({ auth: { access_token: data.access_token } });
      init();
    }
  } catch (e) {
    console.error('Mock login failed:', e);
  }
}

async function logout() {
  accessToken = null;
  userPlan = null;
  await chrome.storage.local.remove('auth');
  showLoginPrompt();
}

function showLoginPrompt() {
  const content = document.getElementById('content');
  const label = authMode === 'mock' || authMode === 'disabled' ? 'Dev Login' : 'ログイン';
  content.innerHTML = `
    <div class="login-prompt">
      <p>ログインしてFigneyを利用</p>
      <button class="btn-login" id="btn-login">${label}</button>
    </div>
  `;
  document.getElementById('btn-login').addEventListener('click', login);
  document.getElementById('header-right').innerHTML = '';
}

// --- Header ---

function showUserHeader() {
  const right = document.getElementById('header-right');
  const remaining = userPlan ? Math.max(0, userPlan.monthly_limit - userPlan.monthly_used) : '';
  const planLabel = userPlan ? (userPlan.plan === 'basic' ? 'Basic' : 'Free') : '';
  right.innerHTML = `
    ${remaining !== '' ? `<span class="usage-badge" title="${userPlan.monthly_used}/${userPlan.monthly_limit} used">${remaining}</span>` : ''}
    ${planLabel ? `<span class="plan-badge">${planLabel}</span>` : ''}
    <button class="btn-icon" id="btn-logout" title="Logout">✕</button>
  `;
  document.getElementById('btn-logout').addEventListener('click', logout);
}

// --- iframe communication ---

function createIframe(initMsg) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.id = 'app-frame';
  iframe.src = `${API}/app/extension.html`;
  iframe.allow = 'clipboard-write';
  content.appendChild(iframe);

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || !msg.type) return;

    if (msg.type === 'ready') {
      iframe.contentWindow.postMessage({
        ...initMsg,
        token: accessToken,
        authMode: authMode,
      }, '*');
    }

    if (msg.type === 'resize') {
      iframe.style.height = Math.min(msg.height, 550) + 'px';
    }

    if (msg.type === 'plan') {
      userPlan = msg.plan;
      showUserHeader();
    }

    // Cache results in session storage (cleared on browser close)
    if (msg.type === 'cache') {
      chrome.storage.session.set({ cachedResults: msg.data });
    }

    if (msg.type === 'auth-error') {
      chrome.storage.local.remove('auth');
      accessToken = null;
      showLoginPrompt();
    }

    // Handle clipboard operations delegated from iframe
    if (msg.type === 'copy') {
      handleCopy(msg.format, msg.data);
    }
  });
}

// --- Clipboard (delegated from iframe) ---

async function handleCopy(format, data) {
  try {
    if (format === 'png' && data) {
      // data is a data URL: "data:image/png;base64,..."
      const res = await fetch(data);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } else if (data) {
      await navigator.clipboard.writeText(data);
    }
  } catch (e) {
    console.error('Clipboard write failed:', e);
  }
}

// --- Init ---

async function init() {
  await fetchAuthConfig();

  const hasToken = await getStoredToken();
  if (!hasToken) {
    showLoginPrompt();
    return;
  }

  showUserHeader();

  // Check for new pending request
  const { pendingRequest } = await chrome.storage.session.get('pendingRequest');
  if (pendingRequest && pendingRequest.status === 'pending') {
    await chrome.storage.session.set({ pendingRequest: { ...pendingRequest, status: 'processing' } });
    createIframe({
      type: 'init',
      selectedText: pendingRequest.selected_text,
      context: pendingRequest.context || '',
    });
    return;
  }

  // No new request — try to restore cached results
  const { cachedResults } = await chrome.storage.session.get('cachedResults');
  if (cachedResults) {
    createIframe({
      type: 'restore',
      data: cachedResults,
    });
    return;
  }

  // Nothing to show
}

init();
