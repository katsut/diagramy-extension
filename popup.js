const API = 'http://localhost:8147';

// --- Constants (from config.js) ---

const DIAGRAM_CATEGORIES = {
  matrix_2x2:        { category: 'Comparison',  label: '2軸マトリクス' },
  quadrant:          { category: 'Comparison',   label: '4象限分類' },
  comparison_table:  { category: 'Comparison',   label: '比較テーブル' },
  process:           { category: 'Process',      label: 'フロー図' },
  timeline:          { category: 'Sequence',     label: 'タイムライン' },
  hierarchy:         { category: 'Structure',    label: '階層ツリー' },
  block_list:        { category: 'Listing',      label: 'ブロックリスト' },
  funnel:            { category: 'Process',      label: 'ファネル' },
  cycle:             { category: 'Process',      label: 'サイクル' },
  roadmap:           { category: 'Sequence',     label: 'ロードマップ' },
  mind_map:          { category: 'Structure',    label: 'マインドマップ' },
  ranking:           { category: 'Listing',      label: 'ランキング' },
  venn:              { category: 'Structure',     label: 'ベン図' },
  pyramid:           { category: 'Structure',     label: 'ピラミッド' },
  bar_chart:         { category: 'Comparison',   label: '棒グラフ' },
  radar_chart:       { category: 'Comparison',   label: 'レーダーチャート' },
  pie_chart:         { category: 'Composition',  label: '円グラフ' },
  concentric_circles:{ category: 'Structure',     label: '同心円' },
  gantt:             { category: 'Sequence',     label: 'ガントチャート' },
  swimlane:          { category: 'Process',      label: 'スイムレーン' },
  decision_tree:     { category: 'Structure',     label: '決定木' },
  treemap:           { category: 'Composition',  label: 'ツリーマップ' },
  network_graph:     { category: 'Structure',     label: 'ネットワーク図' },
  sankey:            { category: 'Composition',  label: 'サンキー図' },
  stacked_bar:       { category: 'Comparison',   label: '積み上げ棒グラフ' },
  composite_flow:    { category: 'Process',      label: '複合フロー' },
  kpi_card:          { category: 'Listing',       label: 'KPIカード' },
  layer_stack:       { category: 'Framework',     label: 'レイヤー図' },
  business_framework:{ category: 'Framework',     label: 'フレームワーク' },
  sequence_diagram:  { category: 'Sequence',     label: 'シーケンス図' },
  none:              { category: '—',             label: 'none' },
};

const CATEGORY_FORMATS = {
  Comparison:  ['comparison_table', 'matrix_2x2', 'bar_chart', 'radar_chart', 'stacked_bar', 'quadrant'],
  Composition: ['pie_chart', 'treemap', 'sankey'],
  Process:     ['process', 'cycle', 'swimlane', 'composite_flow', 'funnel'],
  Sequence:    ['timeline', 'roadmap', 'gantt', 'sequence_diagram'],
  Structure:   ['hierarchy', 'mind_map', 'venn', 'network_graph', 'pyramid', 'concentric_circles', 'decision_tree'],
  Listing:     ['block_list', 'ranking', 'kpi_card'],
  Framework:   ['business_framework', 'layer_stack'],
};

const LAYOUT_STYLES = {
  process:          [{ value: '', label: 'Horizontal' }, { value: 'chevron', label: 'Chevron' }, { value: 'vertical', label: 'Vertical' }, { value: 'serpentine', label: 'Serpentine' }, { value: 'staircase', label: 'Staircase' }, { value: 'numbered', label: 'Numbered' }, { value: 'pipeline', label: 'Pipeline' }, { value: 'escalation', label: 'Escalation' }],
  timeline:         [{ value: '', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }, { value: 'serpentine', label: 'Serpentine' }, { value: 'alternating', label: 'Alternating' }, { value: 'grouped', label: 'Grouped' }, { value: 'nested', label: 'Nested' }],
  hierarchy:        [{ value: '', label: 'Tree' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'radial', label: 'Radial' }, { value: 'bracket', label: 'Bracket' }],
  block_list:       [{ value: '', label: 'Horizontal' }, { value: 'simple', label: 'Simple' }, { value: 'inline', label: 'Inline' }, { value: 'grid', label: 'Grid' }, { value: 'pillars', label: 'Pillars' }, { value: 'numbered', label: 'Numbered' }, { value: 'cards', label: 'Cards' }, { value: 'icons', label: 'Icons' }, { value: 'stripe', label: 'Stripe' }, { value: 'zigzag', label: 'Zigzag' }, { value: 'timeline', label: 'Timeline' }, { value: 'warning', label: 'Warning' }, { value: 'catalog', label: 'Catalog' }],
  cycle:            [{ value: '', label: 'Circle' }, { value: 'flywheel', label: 'Flywheel' }, { value: 'gear', label: 'Gear' }, { value: 'feedback-loop', label: 'Feedback Loop' }],
  funnel:           [{ value: '', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'pipeline', label: 'Pipeline' }],
  comparison_table: [{ value: '', label: 'Table' }, { value: 'cards', label: 'Cards' }, { value: 'minimal', label: 'Minimal' }, { value: 'before-after', label: 'Before/After' }, { value: 'highlight', label: 'Highlight' }, { value: 'checklist', label: 'Checklist' }, { value: 'spec_card', label: 'Spec Card' }, { value: 'matrix', label: 'Matrix' }, { value: 'pricing', label: 'Pricing' }, { value: 'scorecard', label: 'Scorecard' }, { value: 'versus', label: 'VS' }, { value: 'feature_matrix', label: 'Feature Matrix' }, { value: 'timeline_compare', label: 'Timeline' }],
  swimlane:         [{ value: '', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }, { value: 'kanban', label: 'Kanban' }],
  mind_map:         [{ value: '', label: 'Radial' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'org_chart', label: 'Org Chart' }],
  roadmap:          [{ value: '', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }, { value: 'timeline_cards', label: 'Cards' }],
  bar_chart:        [{ value: '', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'lollipop', label: 'Lollipop' }],
  pie_chart:        [{ value: '', label: 'Pie' }, { value: 'donut', label: 'Donut' }, { value: 'waffle', label: 'Waffle' }],
  stacked_bar:      [{ value: '', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'percentage', label: '100%' }],
  ranking:          [{ value: '', label: 'List' }, { value: 'vertical', label: 'Podium' }, { value: 'horizontal', label: 'Bars' }, { value: 'roi-bar', label: 'ROI Bar' }],
  pyramid:          [{ value: '', label: 'Triangle' }, { value: 'blocks', label: 'Blocks' }, { value: 'horizontal', label: 'Horizontal' }],
  decision_tree:    [{ value: '', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }, { value: 'flowchart', label: 'Flowchart' }],
  quadrant:         [{ value: '', label: 'Grid' }, { value: 'color_block', label: 'Color Block' }, { value: 'bubble', label: 'Bubble' }],
  network_graph:    [{ value: '', label: 'Circle' }, { value: 'card_flow', label: 'Card Flow' }, { value: 'arc', label: 'Arc' }, { value: 'matrix', label: 'Matrix' }],
  business_framework: [{ value: '', label: 'Auto' }, { value: 'bmc', label: 'BMC' }, { value: 'lean', label: 'Lean Canvas' }, { value: 'vpc', label: 'VPC' }, { value: 'swot', label: 'SWOT' }, { value: '3c', label: '3C' }, { value: '4p', label: '4P' }, { value: '4c', label: '4C' }, { value: '5forces', label: '5 Forces' }, { value: 'pest', label: 'PEST' }, { value: 'pestel', label: 'PESTEL' }, { value: 'bsc', label: 'BSC' }],
  kpi_card:         [{ value: '', label: 'Horizontal' }, { value: 'grid', label: 'Grid' }, { value: 'dashboard', label: 'Dashboard' }],
  venn:             [{ value: '', label: 'Classic' }, { value: 'distinction', label: 'Distinction' }],
  sequence_diagram: [{ value: '', label: 'Default' }],
  layer_stack:      [{ value: '', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }],
};

const DESIGN_PRESETS = [
  { value: 'clean', label: 'Clean', icon: '✨' },
  { value: 'sketch', label: 'Sketch', icon: '✏️' },
  { value: 'pixel', label: 'Pixel', icon: '👾' },
  { value: 'bold', label: 'Bold', icon: '💥' },
  { value: 'minimal', label: 'Minimal', icon: '✦' },
  { value: 'glass', label: 'Glass', icon: '🪟' },
  { value: 'neon', label: 'Neon', icon: '⚡' },
  { value: 'watercolor', label: 'Watercolor', icon: '🎨' },
];

// --- Mutable state ---

let accessToken = null;
let userPlan = null;
let currentDesign = 'clean';
let categoryRankings = [];
let lastSuggestions = [];
let suggestSvgs = [];
let pendingText = '';
let pendingContext = '';
let activeConceptIdx = 0;
let editPanelOpen = false;
let colorPanelOpen = false;
let customColors = null;

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
      <p>ログインしてFigneyを利用</p>
      <button class="btn-login" onclick="login()">ログイン</button>
    </div>
  `;
  document.getElementById('header-right').innerHTML = '';
}

// --- Authenticated fetch ---

async function apiFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (accessToken) headers['Authorization'] = 'Bearer ' + accessToken;
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
    ${planLabel ? `<span class="plan-badge">${planLabel}</span>` : ''}
    <button class="btn-icon" onclick="logout()" title="Logout">✕</button>
  `;
}

// --- Render helper ---

async function callRender(diagramType, data, title, format, style, layoutStyle) {
  const body = {
    diagram_type: diagramType,
    data,
    title,
    format: format || 'svg',
    style: style || currentDesign,
  };
  if (layoutStyle) body.layout_style = layoutStyle;
  if (customColors) body.custom_colors = customColors;
  return apiFetch(`${API}/api/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// --- Concept blocks ---

function buildConceptBlocksHtml(rankings, activeIdx) {
  return `<div class="concept-blocks">${rankings.map((r, i) => {
    const formatInfo = DIAGRAM_CATEGORIES[r.format] || { label: r.format };
    const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : 'r3';
    const activeClass = i === activeIdx ? ' active' : '';
    return `<div class="concept-block${activeClass}" onclick="selectConcept(${i})">
      <div class="cb-body">
        <span class="cb-rank ${rankClass}">${i + 1}</span>
        <span class="cb-cat">${r.category}</span>
        <span class="cb-format">${formatInfo.label}</span>
        <span class="cb-conf">${Math.round(r.confidence * 100)}%</span>
      </div>
    </div>`;
  }).join('')}</div>`;
}

// --- Suggest card ---

function buildSuggestCard(s, idx) {
  const cat = DIAGRAM_CATEGORIES[s.diagram_type] || { category: '?', label: s.diagram_type };
  if (s.diagram_type === 'none') {
    return `<div class="suggest-card">
      <div class="sr-header"><span class="sr-title">none</span></div>
      <div class="sr-body" style="opacity:0.5;padding:16px;"><span>${s.reasoning || '図式化不要'}</span></div>
    </div>`;
  }

  const allowed = new Set(getAllowedDesigns());

  // Format select
  const alts = CATEGORY_FORMATS[cat.category] || [];
  let formatSelect = '';
  if (alts.length > 1) {
    const opts = alts.map(tp => {
      const tc = DIAGRAM_CATEGORIES[tp] || { label: tp };
      const sel = tp === s.diagram_type ? ' selected' : '';
      return `<option value="${tp}"${sel}>${tc.label}</option>`;
    }).join('');
    formatSelect = `<select onchange="switchFormat(${idx}, this.value)">${opts}</select>`;
  }

  // Layout select
  const layouts = LAYOUT_STYLES[s.diagram_type] || [];
  let layoutSelect = '';
  if (layouts.length > 1) {
    const lopts = layouts.map(l => `<option value="${l.value}">${l.label}</option>`).join('');
    layoutSelect = `<select id="sr-layout-${idx}" onchange="switchLayout(${idx})">${lopts}</select>`;
  }

  // Style select
  let styleSelect = '';
  if (DESIGN_PRESETS.length > 1) {
    const sopts = DESIGN_PRESETS.map(st => {
      const locked = !allowed.has(st.value);
      const sel = st.value === currentDesign ? ' selected' : '';
      const dis = locked ? ' disabled' : '';
      const label = locked ? `${st.label} ���` : st.label;
      return `<option value="${st.value}"${sel}${dis}>${label}</option>`;
    }).join('');
    styleSelect = `<select id="sr-style-${idx}" onchange="switchStyle(${idx})">${sopts}</select>`;
  }

  return `<div class="suggest-card" id="sr-card-${idx}">
    <div class="sr-header">
      <span class="sr-title">${escapeHtml(s.title || cat.label)}</span>
      <span class="sr-conf">${Math.round((s.confidence || 0) * 100)}%</span>
    </div>
    <div class="sr-controls">
      <div class="sr-control-group">
        <label>Concept</label>
        <span style="font-size:10px;font-weight:500;color:var(--text-secondary);">${cat.category}</span>
      </div>
      <div class="sr-control-group">
        <label>Format</label>
        ${formatSelect || `<span style="font-size:10px;font-weight:500;">${cat.label}</span>`}
      </div>
      ${layoutSelect ? `<div class="sr-control-group"><label>Layout</label>${layoutSelect}</div>` : ''}
      ${styleSelect ? `<div class="sr-control-group"><label>Theme</label>${styleSelect}</div>` : ''}
    </div>
    <div class="sr-body" id="sr-body-${idx}"><div class="spinner"></div></div>
    <div class="sr-toolbar" id="sr-actions-${idx}" hidden>
      <button class="sr-primary-action" onclick="toggleEditPanel(${idx})" id="sr-edit-btn-${idx}">✏️ Edit</button>
      <div style="position:relative;display:inline-block;">
        <button onclick="toggleMenu(this)">⬇ Download</button>
        <div class="action-menu" hidden>
          <button onclick="downloadSvg(${idx});hideMenus()">SVG</button>
          <button onclick="downloadPng(${idx});hideMenus()">PNG</button>
        </div>
      </div>
      <div style="position:relative;display:inline-block;">
        <button onclick="toggleMenu(this)">📋 Copy</button>
        <div class="action-menu" hidden>
          <button onclick="copySvg(${idx});hideMenus()">SVG</button>
          <button onclick="copyPng(${idx});hideMenus()">PNG</button>
        </div>
      </div>
      <button onclick="embedSvg(${idx})">🔗 Embed</button>
      <button onclick="toggleColorPanel(${idx})">🎨</button>
    </div>
    <div id="sr-edit-${idx}" hidden></div>
    <div id="sr-color-${idx}" hidden></div>
  </div>`;
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

  await chrome.storage.local.set({ pendingRequest: { ...pendingRequest, status: 'processing' } });

  pendingText = pendingRequest.selected_text;
  pendingContext = pendingRequest.context || '';

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="selected-text">${escapeHtml(pendingText)}</div>
    <div class="status"><div class="spinner"></div>分析中...</div>
  `;

  try {
    // Step 1: Categorize
    const catRes = await apiFetch(`${API}/api/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: pendingContext, selected_text: pendingText }),
    });

    if (catRes.status === 401) {
      await chrome.storage.local.remove('auth');
      accessToken = null;
      showLoginPrompt();
      return;
    }
    if (catRes.status === 429) {
      const err = await catRes.json();
      content.innerHTML = `
        <div class="selected-text">${escapeHtml(pendingText)}</div>
        <div class="status" style="color:var(--error);">${err.error}</div>
      `;
      return;
    }
    if (!catRes.ok) {
      const err = await catRes.json().catch(() => ({ error: catRes.statusText }));
      throw new Error(err.error || `HTTP ${catRes.status}`);
    }

    const catData = await catRes.json();
    categoryRankings = (catData.rankings || []).filter(r => r.category !== 'None');

    if (userPlan) userPlan.monthly_used++;
    showUserHeader();

    // No visualization needed
    if (categoryRankings.length === 0) {
      content.innerHTML = `
        <div class="selected-text">${escapeHtml(pendingText)}</div>
        <div class="none-result">このテキストは図式化不要と判断されました。</div>
      `;
      return;
    }

    // Initialize suggestion arrays
    lastSuggestions = new Array(categoryRankings.length).fill(null);
    suggestSvgs = new Array(categoryRankings.length).fill(null);

    // Show concept blocks + loading
    content.innerHTML = `
      <div class="selected-text">${escapeHtml(pendingText)}</div>
      ${buildConceptBlocksHtml(categoryRankings, 0)}
      <div class="status"><div class="spinner"></div>図を生成中...</div>
    `;

    // Step 2: Generate first concept
    await generateConcept(0);
    showConceptView(0);

  } catch (e) {
    content.innerHTML = `
      <div class="selected-text">${escapeHtml(pendingText)}</div>
      <div class="status" style="color:var(--error);">${e.message}</div>
    `;
  }
}

// --- Concept generation ---

async function generateConcept(idx) {
  if (lastSuggestions[idx] && suggestSvgs[idx]) return;
  const r = categoryRankings[idx];
  const scopeContext = r.scope
    ? `${pendingContext}\n\n[FOCUS: Extract only the "${r.category}" concept from the part about "${r.scope}". Ignore other sections.]`
    : pendingContext;

  if (idx === 0) {
    // First concept: use diagramize (combined analyze+render)
    const res = await apiFetch(`${API}/api/diagramize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: scopeContext, selected_text: pendingText, force_type: r.format, style: currentDesign }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const result = await res.json();
    lastSuggestions[idx] = {
      diagram_type: result.diagram_type, data: result.data, title: result.title,
      confidence: result.confidence, style: result.style, reasoning: result.reasoning,
    };
    suggestSvgs[idx] = result.svg;
  } else {
    // Subsequent: analyze + render separately
    const aRes = await apiFetch(`${API}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: scopeContext, selected_text: pendingText, force_type: r.format }),
    });
    if (!aRes.ok) throw new Error('Analyze failed');
    const analysis = await aRes.json();
    lastSuggestions[idx] = analysis;

    const rRes = await callRender(analysis.diagram_type, analysis.data, analysis.title || analysis.data?.title, 'svg');
    if (rRes.ok) suggestSvgs[idx] = await rRes.text();
  }
}

function showConceptView(idx) {
  activeConceptIdx = idx;
  const s = lastSuggestions[idx];
  const content = document.getElementById('content');

  let html = `<div class="selected-text">${escapeHtml(pendingText)}</div>`;
  html += buildConceptBlocksHtml(categoryRankings, idx);

  if (s) {
    html += buildSuggestCard(s, idx);
  } else {
    html += '<div class="status" style="color:var(--error);">生成に失敗しました</div>';
  }

  content.innerHTML = html;

  // Inject SVG if available
  if (s && suggestSvgs[idx]) {
    const body = document.getElementById(`sr-body-${idx}`);
    if (body) { body.className = 'sr-body has-content'; body.innerHTML = suggestSvgs[idx]; }
    const actions = document.getElementById(`sr-actions-${idx}`);
    if (actions) actions.hidden = false;
  }
}

async function selectConcept(idx) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="selected-text">${escapeHtml(pendingText)}</div>
    ${buildConceptBlocksHtml(categoryRankings, idx)}
    <div class="status"><div class="spinner"></div>図を生成中...</div>
  `;
  try {
    await generateConcept(idx);
    showConceptView(idx);
  } catch (e) {
    lastSuggestions[idx] = {
      diagram_type: categoryRankings[idx].format, data: {}, title: '',
      confidence: 0, reasoning: e.message,
    };
    showConceptView(idx);
  }
}

// --- Format / Style / Layout switching ---

async function switchFormat(idx, newType) {
  const body = document.getElementById(`sr-body-${idx}`);
  const actions = document.getElementById(`sr-actions-${idx}`);
  if (body) { body.className = 'sr-body'; body.innerHTML = '<div class="spinner"></div>'; }
  if (actions) actions.hidden = true;

  try {
    const res = await apiFetch(`${API}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: pendingContext, selected_text: pendingText, force_type: newType }),
    });
    if (!res.ok) throw new Error('Analyze failed');
    const analysis = await res.json();
    lastSuggestions[idx] = analysis;

    // Re-render card with new type
    const rRes = await callRender(analysis.diagram_type, analysis.data, analysis.title || analysis.data?.title, 'svg');
    if (rRes.ok) suggestSvgs[idx] = await rRes.text();

    showConceptView(activeConceptIdx);
  } catch (e) {
    if (body) body.innerHTML = `<span style="color:var(--error);font-size:11px;">${e.message}</span>`;
  }
}

async function switchStyle(idx) {
  const styleSel = document.getElementById(`sr-style-${idx}`);
  if (styleSel) currentDesign = styleSel.value;
  await reRenderCard(idx);
}

async function switchLayout(idx) {
  await reRenderCard(idx);
}

async function reRenderCard(idx) {
  const s = lastSuggestions[idx];
  if (!s || s.diagram_type === 'none') return;

  const body = document.getElementById(`sr-body-${idx}`);
  const actions = document.getElementById(`sr-actions-${idx}`);
  if (body) body.innerHTML = '<div class="spinner"></div>';
  if (actions) actions.hidden = true;

  const styleSel = document.getElementById(`sr-style-${idx}`);
  const style = styleSel ? styleSel.value : currentDesign;
  const layoutSel = document.getElementById(`sr-layout-${idx}`);
  const layoutStyle = layoutSel ? layoutSel.value : '';

  try {
    const res = await callRender(s.diagram_type, s.data, s.title || s.data?.title, 'svg', style, layoutStyle);
    if (!res.ok) throw new Error(`Render failed: ${res.status}`);
    const svg = await res.text();
    suggestSvgs[idx] = svg;
    if (body) { body.className = 'sr-body has-content'; body.innerHTML = svg; }
    if (actions) actions.hidden = false;
  } catch (e) {
    if (body) body.innerHTML = `<span style="color:var(--error);font-size:11px;">${e.message}</span>`;
  }
}

// --- Edit panel ---

function getEditableItems(s) {
  const dt = s.diagram_type;
  const d = s.data || {};
  if (['process', 'composite_flow'].includes(dt) && d.nodes) return { key: 'nodes', items: d.nodes, labelField: 'label', descField: 'description' };
  if (dt === 'cycle' && d.steps) return { key: 'steps', items: d.steps, labelField: 'label', descField: 'description' };
  if (dt === 'timeline' && d.events) return { key: 'events', items: d.events, labelField: 'event', descField: 'details', extraField: 'time' };
  if (dt === 'block_list' && d.items) return { key: 'items', items: d.items, labelField: 'label', descField: 'description' };
  if (dt === 'ranking' && d.items) return { key: 'items', items: d.items, labelField: 'label', descField: 'description', extraField: 'value' };
  if (dt === 'funnel' && d.stages) return { key: 'stages', items: d.stages, labelField: 'label', descField: 'description' };
  if (['bar_chart'].includes(dt) && d.items) return { key: 'items', items: d.items, labelField: 'label', extraField: 'value' };
  if (dt === 'pie_chart' && d.segments) return { key: 'segments', items: d.segments, labelField: 'label', extraField: 'value' };
  if (dt === 'concentric_circles' && d.rings) return { key: 'rings', items: d.rings, labelField: 'label', descField: 'description' };
  if (dt === 'gantt' && d.tasks) return { key: 'tasks', items: d.tasks, labelField: 'label', extraField: 'group' };
  if (dt === 'pyramid' && d.layers) return { key: 'layers', items: d.layers, labelField: 'label', descField: 'description' };
  if (dt === 'roadmap' && d.phases) return { key: 'phases', items: d.phases, labelField: 'label' };
  if (dt === 'swimlane' && d.lanes) return { key: 'lanes', items: d.lanes, labelField: 'actor' };
  if (dt === 'mind_map' && d.branches) return { key: 'branches', items: d.branches, labelField: 'label' };
  if (dt === 'comparison_table') return { key: '_table', headers: d.headers || [], rows: d.rows || [] };
  if (dt === 'quadrant') return { key: '_quadrant', labels: d.labels || [], quadrants: d.quadrants || [] };
  if (dt === 'matrix_2x2' && d.items) return { key: 'items', items: d.items, labelField: 'name' };
  if (dt === 'venn' && d.sets) return { key: 'sets', items: d.sets, labelField: 'label' };
  if (dt === 'radar_chart' && d.items) return { key: 'items', items: d.items, labelField: 'label' };
  if (dt === 'stacked_bar' && d.items) return { key: 'items', items: d.items, labelField: 'label' };
  if (dt === 'treemap' && d.items) return { key: 'items', items: d.items, labelField: 'label', extraField: 'value' };
  if (dt === 'network_graph' && d.nodes) return { key: 'nodes', items: d.nodes, labelField: 'label' };
  if (dt === 'sankey' && d.nodes) return { key: 'nodes', items: d.nodes, labelField: 'label' };
  if (dt === 'sequence_diagram' && d.messages) return { key: 'messages', items: d.messages, labelField: 'label' };
  if (dt === 'kpi_card' && d.cards) return { key: 'cards', items: d.cards, labelField: 'label', descField: 'description', extraField: 'value' };
  if (dt === 'kpi_card' && d.items) return { key: 'items', items: d.items, labelField: 'label', descField: 'description', extraField: 'value' };
  if (dt === 'layer_stack' && d.layers) return { key: 'layers', items: d.layers, labelField: 'label', descField: 'description' };
  if (dt === 'decision_tree' && d.nodes) return { key: 'nodes', items: d.nodes, labelField: 'label' };
  if (dt === 'business_framework') {
    for (const k of ['blocks', 'sections', 'items']) {
      if (Array.isArray(d[k]) && d[k].length > 0) return { key: k, items: d[k], labelField: 'label', descField: 'description' };
    }
  }
  // Generic fallback
  for (const k of Object.keys(d)) {
    const v = d[k];
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
      const sample = v[0];
      const labelField = ['label', 'name', 'title', 'event', 'actor', 'key'].find(f => f in sample) || Object.keys(sample)[0];
      const descField = ['description', 'details', 'desc', 'content'].find(f => f in sample);
      const extraField = ['value', 'score', 'count', 'time', 'group'].find(f => f in sample && f !== labelField);
      return { key: k, items: v, labelField, descField, extraField };
    }
  }
  return null;
}

function buildItemRowHtml(item, editable) {
  const label = item[editable.labelField] || '';
  const desc = editable.descField ? (item[editable.descField] || '') : null;
  const extra = editable.extraField ? (item[editable.extraField] || '') : null;
  let html = '<div class="edit-item">';
  if (extra !== null) html += `<input type="text" class="edit-extra" value="${String(extra).replace(/"/g, '&quot;')}" placeholder="${editable.extraField}" style="max-width:55px;">`;
  html += `<input type="text" class="edit-label" value="${label.replace(/"/g, '&quot;')}" placeholder="label">`;
  if (desc !== null) html += `<input type="text" class="edit-desc" value="${desc.replace(/"/g, '&quot;')}" placeholder="description" style="flex:0.7;">`;
  html += `<button onclick="removeEditItem(this)" title="Remove">✕</button>`;
  html += '</div>';
  return html;
}

function buildEditPanel(idx) {
  const s = lastSuggestions[idx];
  if (!s || s.diagram_type === 'none') return '';

  const editable = getEditableItems(s);
  let html = '<div class="sr-edit-panel">';

  // Title
  html += `<div class="edit-title-row">
    <label>Title</label>
    <input type="text" id="edit-title-${idx}" value="${(s.title || '').replace(/"/g, '&quot;')}" maxlength="50">
    <span class="char-count">${(s.title || '').length}/30</span>
  </div>`;

  if (!editable) {
    html += `<div class="edit-apply-row"><button class="edit-apply-btn" onclick="applyEdits(${idx})">Apply</button></div></div>`;
    return html;
  }

  if (editable.key === '_table') {
    html += '<div style="overflow-x:auto;">';
    html += '<div class="edit-item" style="margin-bottom:6px;">';
    html += '<span style="font-weight:600;font-size:9px;min-width:40px;">Headers</span>';
    editable.headers.forEach(h => {
      html += `<input type="text" class="edit-header" value="${h.replace(/"/g, '&quot;')}" style="max-width:70px;">`;
    });
    html += '</div>';
    html += `<div class="edit-items" id="edit-items-${idx}">`;
    editable.rows.forEach(row => {
      html += '<div class="edit-item">';
      html += `<input type="text" class="edit-label" value="${(row.label || '').replace(/"/g, '&quot;')}" style="max-width:70px;" placeholder="label">`;
      (row.values || []).forEach((v, j) => {
        html += `<input type="text" class="edit-value" data-col="${j}" value="${String(v).replace(/"/g, '&quot;')}" style="max-width:70px;">`;
      });
      html += '<button onclick="removeEditItem(this)">✕</button></div>';
    });
    html += '</div>';
    html += `<button class="edit-add-btn" onclick="addEditTableRow(${idx})">+ Add row</button></div>`;
  } else if (editable.key === '_quadrant') {
    const names = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'];
    html += `<div class="edit-items" id="edit-items-${idx}">`;
    editable.labels.forEach((lbl, i) => {
      html += `<div class="edit-item">`;
      html += `<span style="font-size:9px;min-width:50px;color:var(--text-secondary);">${names[i]}</span>`;
      html += `<input type="text" class="edit-label" value="${lbl.replace(/"/g, '&quot;')}" placeholder="label">`;
      const items = (editable.quadrants[i] || []).join(', ');
      html += `<input type="text" class="edit-desc" value="${items.replace(/"/g, '&quot;')}" placeholder="items (comma)" style="flex:1;">`;
      html += '</div>';
    });
    html += '</div>';
  } else {
    html += `<div class="edit-items" id="edit-items-${idx}">`;
    editable.items.forEach(item => { html += buildItemRowHtml(item, editable); });
    html += '</div>';
    html += `<button class="edit-add-btn" onclick="addEditItem(${idx})">+ Add item</button>`;
  }

  html += `<div class="edit-apply-row"><button class="edit-apply-btn" onclick="applyEdits(${idx})">Apply</button></div></div>`;
  return html;
}

function toggleEditPanel(idx) {
  const panel = document.getElementById(`sr-edit-${idx}`);
  if (!panel) return;
  if (panel.hidden) {
    panel.hidden = false;
    panel.innerHTML = buildEditPanel(idx);
    // Close color panel if open
    const colorPanel = document.getElementById(`sr-color-${idx}`);
    if (colorPanel) { colorPanel.hidden = true; colorPanel.innerHTML = ''; }
  } else {
    panel.hidden = true;
    panel.innerHTML = '';
  }
}

function addEditItem(idx) {
  const s = lastSuggestions[idx];
  const editable = getEditableItems(s);
  if (!editable || editable.key.startsWith('_')) return;
  const container = document.getElementById(`edit-items-${idx}`);
  if (!container) return;
  const newItem = {};
  newItem[editable.labelField] = '';
  if (editable.descField) newItem[editable.descField] = '';
  if (editable.extraField) newItem[editable.extraField] = '';
  const div = document.createElement('div');
  div.innerHTML = buildItemRowHtml(newItem, editable);
  container.appendChild(div.firstElementChild);
}

function addEditTableRow(idx) {
  const s = lastSuggestions[idx];
  if (!s || s.diagram_type !== 'comparison_table') return;
  const container = document.getElementById(`edit-items-${idx}`);
  const panel = document.getElementById(`sr-edit-${idx}`);
  if (!container || !panel) return;
  const colCount = panel.querySelectorAll('.edit-header').length;
  let html = '<div class="edit-item">';
  html += '<input type="text" class="edit-label" value="" style="max-width:70px;" placeholder="label">';
  for (let j = 0; j < Math.max(1, colCount - 1); j++) {
    html += `<input type="text" class="edit-value" data-col="${j}" value="" style="max-width:70px;">`;
  }
  html += '<button onclick="removeEditItem(this)">✕</button></div>';
  const div = document.createElement('div');
  div.innerHTML = html;
  container.appendChild(div.firstElementChild);
}

function removeEditItem(btn) {
  const row = btn.closest('.edit-item');
  if (row) row.remove();
}

async function applyEdits(idx) {
  const s = lastSuggestions[idx];
  if (!s) return;

  const titleInput = document.getElementById(`edit-title-${idx}`);
  if (titleInput) s.title = titleInput.value;

  const editable = getEditableItems(s);
  if (editable) {
    if (editable.key === '_table') {
      applyTableEdits(idx, s);
    } else if (editable.key === '_quadrant') {
      applyQuadrantEdits(idx, s);
    } else {
      applyListEdits(idx, s, editable);
    }
  }

  await reRenderCard(idx);
}

function applyListEdits(idx, s, editable) {
  const container = document.getElementById(`edit-items-${idx}`);
  if (!container) return;
  const rows = container.querySelectorAll('.edit-item');
  const origItems = editable.items;
  const newItems = [];
  let origI = 0;
  rows.forEach(row => {
    const labelInput = row.querySelector('.edit-label');
    const descInput = row.querySelector('.edit-desc');
    const extraInput = row.querySelector('.edit-extra');
    const item = {};
    item[editable.labelField] = labelInput ? labelInput.value : '';
    if (editable.descField && descInput) item[editable.descField] = descInput.value;
    if (editable.extraField && extraInput) {
      const v = extraInput.value;
      item[editable.extraField] = isNaN(v) || v === '' ? v : Number(v);
    }
    if (origI < origItems.length) {
      const orig = origItems[origI];
      for (const k of Object.keys(orig)) {
        if (!(k in item)) item[k] = orig[k];
      }
      origI++;
    }
    newItems.push(item);
  });
  s.data[editable.key] = newItems;
}

function applyTableEdits(idx, s) {
  const panel = document.getElementById(`sr-edit-${idx}`);
  if (!panel) return;
  s.data.headers = Array.from(panel.querySelectorAll('.edit-header')).map(i => i.value);
  const container = document.getElementById(`edit-items-${idx}`);
  if (!container) return;
  const newRows = [];
  container.querySelectorAll('.edit-item').forEach(row => {
    const labelInput = row.querySelector('.edit-label');
    const valueInputs = row.querySelectorAll('.edit-value');
    newRows.push({ label: labelInput ? labelInput.value : '', values: Array.from(valueInputs).map(i => i.value) });
  });
  s.data.rows = newRows;
}

function applyQuadrantEdits(idx, s) {
  const container = document.getElementById(`edit-items-${idx}`);
  if (!container) return;
  const labels = [];
  const quadrants = [];
  container.querySelectorAll('.edit-item').forEach(row => {
    const labelInput = row.querySelector('.edit-label');
    const descInput = row.querySelector('.edit-desc');
    labels.push(labelInput ? labelInput.value : '');
    quadrants.push(descInput ? descInput.value.split(',').map(s => s.trim()).filter(Boolean) : []);
  });
  s.data.labels = labels;
  s.data.quadrants = quadrants;
}

// --- Color panel ---

function toggleColorPanel(idx) {
  const panel = document.getElementById(`sr-color-${idx}`);
  if (!panel) return;
  if (panel.hidden) {
    panel.hidden = false;
    panel.innerHTML = buildColorPanel(idx);
    // Close edit panel if open
    const editPanel = document.getElementById(`sr-edit-${idx}`);
    if (editPanel) { editPanel.hidden = true; editPanel.innerHTML = ''; }
  } else {
    panel.hidden = true;
    panel.innerHTML = '';
  }
}

function buildColorPanel(idx) {
  const colors = customColors || { primary: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', accent1: '#60A5FA', accent2: '#34D399', accent3: '#FBBF24', accent4: '#F87171' };
  return `<div class="color-panel">
    <div class="color-grid">
      <div class="color-row"><label>Primary</label><input type="color" id="cc-primary" value="${colors.primary}"></div>
      <div class="color-row"><label>BG</label><input type="color" id="cc-bg" value="${colors.bg}"></div>
      <div class="color-row"><label>Text</label><input type="color" id="cc-text" value="${colors.text}"></div>
      <div class="color-row"><label>Accent 1</label><input type="color" id="cc-accent1" value="${colors.accent1}"></div>
      <div class="color-row"><label>Accent 2</label><input type="color" id="cc-accent2" value="${colors.accent2}"></div>
      <div class="color-row"><label>Accent 3</label><input type="color" id="cc-accent3" value="${colors.accent3}"></div>
      <div class="color-row"><label>Accent 4</label><input type="color" id="cc-accent4" value="${colors.accent4}"></div>
    </div>
    <div class="color-actions">
      <button class="edit-apply-btn" onclick="applyColors(${idx})">Apply</button>
      <button class="edit-add-btn" onclick="resetColors(${idx})">Reset</button>
    </div>
  </div>`;
}

async function applyColors(idx) {
  customColors = {
    primary: document.getElementById('cc-primary').value,
    bg: document.getElementById('cc-bg').value,
    text: document.getElementById('cc-text').value,
    accent1: document.getElementById('cc-accent1').value,
    accent2: document.getElementById('cc-accent2').value,
    accent3: document.getElementById('cc-accent3').value,
    accent4: document.getElementById('cc-accent4').value,
  };
  await reRenderCard(idx);
}

async function resetColors(idx) {
  customColors = null;
  await reRenderCard(idx);
  const panel = document.getElementById(`sr-color-${idx}`);
  if (panel && !panel.hidden) {
    panel.innerHTML = buildColorPanel(idx);
  }
}

// --- Download / Copy / Embed ---

function downloadSvg(idx) {
  const svg = suggestSvgs[idx];
  if (!svg) return;
  const s = lastSuggestions[idx];
  const filename = (s?.title || 'diagram').replace(/[^a-zA-Z0-9\u3000-\u9FFF\uF900-\uFAFF]/g, '_');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function downloadPng(idx) {
  const s = lastSuggestions[idx];
  if (!s || s.diagram_type === 'none') return;
  try {
    const styleSel = document.getElementById(`sr-style-${idx}`);
    const style = styleSel ? styleSel.value : currentDesign;
    const layoutSel = document.getElementById(`sr-layout-${idx}`);
    const layoutStyle = layoutSel ? layoutSel.value : '';
    const res = await callRender(s.diagram_type, s.data, s.title || s.data?.title, 'png', style, layoutStyle);
    if (!res.ok) throw new Error(`PNG render failed: ${res.status}`);
    const blob = await res.blob();
    const filename = (s.title || 'diagram').replace(/[^a-zA-Z0-9\u3000-\u9FFF\uF900-\uFAFF]/g, '_');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${filename}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error('PNG download failed:', e);
  }
}

async function copySvg(idx) {
  const svg = suggestSvgs[idx];
  if (!svg) return;
  try {
    await navigator.clipboard.writeText(svg);
    flashButton(idx, 'Copied!');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = svg;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

async function copyPng(idx) {
  const s = lastSuggestions[idx];
  if (!s || s.diagram_type === 'none') return;
  try {
    const styleSel = document.getElementById(`sr-style-${idx}`);
    const style = styleSel ? styleSel.value : currentDesign;
    const layoutSel = document.getElementById(`sr-layout-${idx}`);
    const layoutStyle = layoutSel ? layoutSel.value : '';
    const res = await callRender(s.diagram_type, s.data, s.title || s.data?.title, 'png', style, layoutStyle);
    if (!res.ok) throw new Error(`PNG render failed: ${res.status}`);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    flashButton(idx, 'Copied!');
  } catch (e) {
    console.error('PNG copy failed:', e);
  }
}

function embedSvg(idx) {
  const svg = suggestSvgs[idx];
  if (!svg) return;
  const encoded = btoa(unescape(encodeURIComponent(svg)));
  const code = `<img src="data:image/svg+xml;base64,${encoded}" alt="Figney diagram" style="max-width:100%;height:auto;">`;
  navigator.clipboard.writeText(code).then(() => flashButton(idx, 'Copied!')).catch(() => {});
}

function flashButton(idx, text) {
  const toolbar = document.getElementById(`sr-actions-${idx}`);
  if (!toolbar) return;
  const btn = toolbar.querySelector('button:last-of-type') || toolbar.querySelector('button');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = orig; }, 1500);
  }
}

// --- Dropdown menu ---

function toggleMenu(btn) {
  const menu = btn.parentElement.querySelector('.action-menu');
  if (!menu) return;
  hideMenus();
  menu.hidden = !menu.hidden;
  if (!menu.hidden) {
    setTimeout(() => document.addEventListener('click', hideMenus, { once: true }), 0);
  }
}

function hideMenus() {
  document.querySelectorAll('.action-menu').forEach(m => m.hidden = true);
}

// --- Util ---

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Start ---

init();
