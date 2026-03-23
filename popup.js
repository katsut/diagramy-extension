const API = 'http://localhost:3000';

let suggestions = [];
let currentSvg = null;
let lastRender = null; // { diagram_type, data, title } for re-render on theme change

async function init() {
  const { pendingRequest } = await chrome.storage.local.get('pendingRequest');
  if (!pendingRequest || pendingRequest.status !== 'pending') return;

  // Mark as processing
  await chrome.storage.local.set({
    pendingRequest: { ...pendingRequest, status: 'processing' },
  });

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="selected-text">${escapeHtml(pendingRequest.selected_text)}</div>
    <div class="status"><div class="spinner"></div>図式候補を生成中...</div>
  `;

  try {
    const res = await fetch(`${API}/api/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: pendingRequest.context,
        selected_text: pendingRequest.selected_text,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    suggestions = data.suggestions || [];
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
  html += '<div class="theme-switcher" id="theme-switcher" hidden style="display:flex;gap:4px;margin-top:8px;">';
  html += '<select id="theme-select" onchange="changeTheme()" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:11px;background:var(--surface);color:var(--text);">';
  html += '<option value="simple">Simple</option><option value="pastel">Pastel</option><option value="neon">Neon</option><option value="monochrome">Mono</option><option value="earth">Earth</option>';
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

  // Highlight
  document.querySelectorAll('.suggest-card').forEach((c, i) => {
    c.className = 'suggest-card' + (i === idx ? ' selected' : '');
  });

  const result = document.getElementById('result');
  const actions = document.getElementById('actions');
  result.hidden = false;
  result.innerHTML = '<div class="spinner"></div>';
  actions.hidden = true;

  try {
    const res = await fetch(`${API}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagram_type: s.diagram_type,
        data: s.data,
        title: s.title,
        format: 'svg',
      }),
    });
    if (!res.ok) throw new Error('Render failed');

    currentSvg = await res.text();
    lastRender = { diagram_type: s.diagram_type, data: s.data, title: s.title };
    result.innerHTML = currentSvg;
    actions.hidden = false;
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) { themeSwitcher.hidden = false; themeSwitcher.style.display = 'flex'; }
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
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = currentSvg;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

async function changeTheme() {
  const theme = document.getElementById('theme-select').value;
  await fetch(`${API}/api/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  if (!lastRender) return;
  const result = document.getElementById('result');
  result.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await fetch(`${API}/api/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagram_type: lastRender.diagram_type, data: lastRender.data, title: lastRender.title, format: 'svg' }),
    });
    if (!res.ok) throw new Error('Render failed');
    currentSvg = await res.text();
    result.innerHTML = currentSvg;
  } catch (e) {
    result.innerHTML = `<span style="color:var(--error);font-size:12px;">${e.message}</span>`;
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

init();
