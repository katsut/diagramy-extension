const API = 'http://localhost:8147';

const DESIGN_PRESETS = [
  { value: 'clean', label: 'Clean', icon: '✨' },
  { value: 'sketch', label: 'Sketch', icon: '✏️' },
  { value: 'pixel', label: 'Pixel', icon: '👾' },
  { value: 'bold', label: 'Bold', icon: '💥' },
  { value: 'flat', label: 'Flat', icon: '📄' },
  { value: 'glass', label: 'Glass', icon: '🪟' },
  { value: 'neon', label: 'Neon', icon: '⚡' },
  { value: 'watercolor', label: 'Watercolor', icon: '🎨' },
];

let suggestions = [];
let currentSvg = null;
let lastRender = null;
let accessToken = null;
let userPlan = null;
let currentDesign = 'clean';

// --- Auth ---

async function getStoredToken() {
  const { auth } = await chrome.storage.local.get('auth');
  if (auth && auth.access_token) {
    accessToken = auth.access_token;
    return true;
  }
  return false;
}

async function login() {
  const redirectUrl = chrome.identity.getRedirectURL();
  const authUrl = `${API}/ext-auth.html?redirect_url=${encodeURIComponent(redirectUrl)}`;
  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    });
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

async function logout() {
  accessToken = null;
  userPlan = null;
  await chrome.storage.local.remove('auth');
  showLoginPrompt();
}

function showLoginPrompt() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="login-prompt">
      <p>ログインしてDiagramyを利用</p>
      <button class="btn-login" onclick="login()">ログイン</button>
    </div>
  `;
  document.getElementById('header-right').innerHTML = '';
}

// --- Authenticated fetch ---

async function apiFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken;
  }
  return fetch(url, { ...options, headers });
}

// --- Plan ---

async function loadPlan() {
  try {
    const res = await apiFetch(`${API}/api/plan`);
    if (res.ok) userPlan = await res.json();
  } catch (e) {
    console.warn('Failed to load plan:', e);
  }
}

function getAllowedDesigns() {
  if (!userPlan) return DESIGN_PRESETS.map(d => d.value);
  return userPlan.allowed_designs || ['clean', 'neon'];
}

// --- Header UI ---

function showUserHeader() {
  const right = document.getElementById('header-right');
  const remaining = userPlan ? Math.max(0, userPlan.monthly_limit - userPlan.monthly_used) : '';
  const planLabel = userPlan ? (userPlan.plan === 'basic' ? 'Basic' : 'Free') : '';
  right.innerHTML = `
    ${remaining !== '' ? `<span class="usage-badge" title="${userPlan.monthly_used}/${userPlan.monthly_limit} used">${remaining}</span>` : ''}
    ${planLabel ? `<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:var(--border);color:var(--text-secondary);">${planLabel}</span>` : ''}
    <button class="btn-icon" onclick="logout()" title="Logout">✕</button>
  `;
}

// --- Main init ---

async function init() {
  const hasToken = await getStoredToken();
  if (!hasToken) {
    showLoginPrompt();
    return;
  }

  await loadPlan();
  showUserHeader();

  const { pendingRequest } = await chrome.storage.local.get('pendingRequest');
  if (!pendingRequest || pendingRequest.status !== 'pending') return;

  await chrome.storage.local.set({
    pendingRequest: { ...pendingRequest, status: 'processing' },
  });

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="selected-text">${escapeHtml(pendingRequest.selected_text)}</div>
    <div class="status"><div class="spinner"></div>図式候補を生成中...</div>
  `;

  try {
    const res = await apiFetch(`${API}/api/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: pendingRequest.context,
        selected_text: pendingRequest.selected_text,
      }),
    });

    if (res.status === 401) {
      await chrome.storage.local.remove('auth');
      accessToken = null;
      showLoginPrompt();
      return;
    }

    if (res.status === 429) {
      const err = await res.json();
      content.innerHTML = `
        <div class="selected-text">${escapeHtml(pendingRequest.selected_text)}</div>
        <div class="status" style="color:var(--error);">${err.error}</div>
      `;
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    suggestions = data.suggestions || [];
    if (userPlan) userPlan.monthly_used++;
    showUserHeader();
    showSuggestions(pendingRequest.selected_text);
  } catch (e) {
    content.innerHTML = `
      <div class="selected-text">${escapeHtml(pendingRequest.selected_text)}</div>
      <div class="status" style="color:var(--error);">${e.message}</div>
    `;
  }
}

function showSuggestions(selectedText) {
  const content = document.getElementById('content');
  const allowed = new Set(getAllowedDesigns());
  let html = `<div class="selected-text">${escapeHtml(selectedText)}</div>`;
  html += '<div class="suggestions">';
  suggestions.forEach((s, i) => {
    if (s.diagram_type === 'none') {
      html += `<div class="suggest-card" style="opacity:0.5;cursor:default;">
        <div class="sc-top"><span class="sc-type">none</span><span class="sc-conf">${s.confidence}</span></div>
        <div class="sc-title">${escapeHtml(s.reasoning.slice(0, 60))}</div>
      </div>`;
    } else {
      html += `<div class="suggest-card" onclick="renderSuggestion(${i})" id="card-${i}">
        <div class="sc-top"><span class="sc-type">${s.diagram_type}</span><span class="sc-conf">${s.confidence}</span></div>
        <div class="sc-title">${escapeHtml(s.title || '')}</div>
      </div>`;
    }
  });
  html += '</div>';
  html += '<div class="result" id="result" hidden></div>';
  html += '<div class="controls" id="controls" hidden>';
  html += '<select id="design-select" onchange="changeDesign()">';
  DESIGN_PRESETS.forEach(d => {
    const disabled = !allowed.has(d.value) ? ' disabled' : '';
    const lock = !allowed.has(d.value) ? ' 🔒' : '';
    html += `<option value="${d.value}"${disabled}>${d.icon} ${d.label}${lock}</option>`;
  });
  html += '</select></div>';
  html += '<div class="actions" id="actions" hidden>';
  html += '<button class="btn-dl" onclick="downloadSvg()">Download SVG</button>';
  html += '<button class="btn-copy" onclick="copySvg()">Copy SVG</button>';
  html += '</div>';
  content.innerHTML = html;
}

async function renderSuggestion(idx) {
  const s = suggestions[idx];
  if (!s || s.diagram_type === 'none') return;

  document.querySelectorAll('.suggest-card').forEach((c, i) => {
    c.className = 'suggest-card' + (i === idx ? ' selected' : '');
  });

  const result = document.getElementById('result');
  const actions = document.getElementById('actions');
  const controls = document.getElementById('controls');
  result.hidden = false;
  result.innerHTML = '<div class="spinner"></div>';
  actions.hidden = true;

  try {
    const res = await apiFetch(`${API}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagram_type: s.diagram_type,
        data: s.data,
        title: s.title,
        format: 'svg',
        style: currentDesign,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Render failed' }));
      throw new Error(err.error || 'Render failed');
    }

    currentSvg = await res.text();
    lastRender = { diagram_type: s.diagram_type, data: s.data, title: s.title };
    result.innerHTML = currentSvg;
    actions.hidden = false;
    controls.hidden = false;
  } catch (e) {
    result.innerHTML = `<span style="color:var(--error);font-size:12px;">${e.message}</span>`;
  }
}

async function changeDesign() {
  currentDesign = document.getElementById('design-select').value;
  if (!lastRender) return;
  const result = document.getElementById('result');
  result.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await apiFetch(`${API}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagram_type: lastRender.diagram_type,
        data: lastRender.data,
        title: lastRender.title,
        format: 'svg',
        style: currentDesign,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Render failed' }));
      throw new Error(err.error || 'Render failed');
    }
    currentSvg = await res.text();
    result.innerHTML = currentSvg;
  } catch (e) {
    result.innerHTML = `<span style="color:var(--error);font-size:12px;">${e.message}</span>`;
  }
}

function downloadSvg() {
  if (!currentSvg) return;
  const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diagramy.svg';
  a.click();
  URL.revokeObjectURL(url);
}

async function copySvg() {
  if (!currentSvg) return;
  try {
    await navigator.clipboard.writeText(currentSvg);
    const btn = document.querySelector('.btn-copy');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy SVG'; }, 1500);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = currentSvg;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

init();
