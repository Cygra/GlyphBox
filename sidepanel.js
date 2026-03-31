/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GlyphBox — Side Panel JavaScript
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

// ── Unicode Style Definitions ─────────────────────────────────────────────────
// Each style maps A-Z (uppercase) and a-z (lowercase) to their Unicode equivalents.
// Exceptions (characters that don't follow the simple block offset) are listed in `except`.

const STYLES = [
  {
    id: 'bold',
    name: 'Bold',
    capStart: 0x1D400,
    smStart: 0x1D41A,
    numStart: 0x1D7CE,
    except: {},
  },
  {
    id: 'italic',
    name: 'Italic',
    capStart: 0x1D434,
    smStart: 0x1D44E,
    numStart: null,
    except: { h: 0x210E }, // ℎ
  },
  {
    id: 'bold-italic',
    name: 'Bold Italic',
    capStart: 0x1D468,
    smStart: 0x1D482,
    numStart: null,
    except: {},
  },
  {
    id: 'script',
    name: 'Script',
    capStart: 0x1D49C,
    smStart: 0x1D4B6,
    numStart: null,
    except: {
      B: 0x212C, E: 0x2130, F: 0x2131, H: 0x210B, I: 0x2110,
      L: 0x2112, M: 0x2133, R: 0x211B,
      e: 0x212F, g: 0x210A, o: 0x2134,
    },
  },
  {
    id: 'bold-script',
    name: 'Bold Script',
    capStart: 0x1D4D0,
    smStart: 0x1D4EA,
    numStart: null,
    except: {},
  },
  {
    id: 'fraktur',
    name: 'Fraktur',
    capStart: 0x1D504,
    smStart: 0x1D51E,
    numStart: null,
    except: {
      C: 0x212D, H: 0x210C, I: 0x2111, R: 0x211C, Z: 0x2128,
    },
  },
  {
    id: 'double-struck',
    name: 'Double-Struck',
    capStart: 0x1D538,
    smStart: 0x1D552,
    numStart: 0x1D7D8,
    except: {
      C: 0x2102, H: 0x210D, N: 0x2115, P: 0x2119, Q: 0x211A,
      R: 0x211D, Z: 0x2124,
    },
  },
  {
    id: 'bold-fraktur',
    name: 'Bold Fraktur',
    capStart: 0x1D56C,
    smStart: 0x1D586,
    numStart: null,
    except: {},
  },
  {
    id: 'sans',
    name: 'Sans-Serif',
    capStart: 0x1D5A0,
    smStart: 0x1D5BA,
    numStart: 0x1D7E2,
    except: {},
  },
  {
    id: 'sans-bold',
    name: 'Sans-Serif Bold',
    capStart: 0x1D5D4,
    smStart: 0x1D5EE,
    numStart: 0x1D7EC,
    except: {},
  },
  {
    id: 'sans-italic',
    name: 'Sans-Serif Italic',
    capStart: 0x1D608,
    smStart: 0x1D622,
    numStart: null,
    except: {},
  },
  {
    id: 'monospace',
    name: 'Monospace',
    capStart: 0x1D670,
    smStart: 0x1D68A,
    numStart: 0x1D7F6,
    except: {},
  },
];

// Convert a single character with a given style definition
function convertChar(ch, style) {
  const code = ch.codePointAt(0);

  // Check explicit exceptions first
  if (style.except[ch] !== undefined) {
    return String.fromCodePoint(style.except[ch]);
  }

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(style.capStart + (code - 65));
  }

  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(style.smStart + (code - 97));
  }

  // Digits 0-9 (if style supports it)
  if (style.numStart !== null && code >= 48 && code <= 57) {
    return String.fromCodePoint(style.numStart + (code - 48));
  }

  // Pass-through for anything else (spaces, punctuation, emoji…)
  return ch;
}

// Convert a full string with a given style
function convertText(text, style) {
  if (!text) return '';
  // Iterate over Unicode code points (handles surrogate pairs correctly)
  return [...text].map((ch) => convertChar(ch, style)).join('');
}

// ── Storage Helpers ───────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  favorites: 'glyphbox_favorites',
  recent: 'glyphbox_recent',
  theme: 'glyphbox_theme',
};

// Maximum number of recent items to keep in history.
// 10 strikes a balance: enough to show useful history without cluttering the UI.
const MAX_RECENT = 10;

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favs));
}

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.recent) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(items) {
  localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(items));
}

function addToRecent(item) {
  let items = loadRecent();
  // Remove duplicates based on char
  items = items.filter((i) => i.char !== item.char);
  items.unshift(item);
  if (items.length > MAX_RECENT) items = items.slice(0, MAX_RECENT);
  saveRecent(items);
  renderRecent();
}

// ── Clipboard ────────────────────────────────────────────────────────────────

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for restricted contexts
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeToggle').querySelector('.theme-icon').textContent = dark ? '☀️' : '🌙';
  localStorage.setItem(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved) {
    applyTheme(saved === 'dark');
  } else {
    // Respect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }
}

// ── Tab Navigation ────────────────────────────────────────────────────────────

function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      btns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      panels.forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(`tab-${target}`).classList.add('active');

      if (target === 'favorites') renderFavorites();
    });
  });
}

// ── Recent History Rendering ─────────────────────────────────────────────────

function renderRecent() {
  const container = document.getElementById('recentItems');
  const items = loadRecent();

  if (items.length === 0) {
    container.innerHTML = '<span class="recent-empty">Nothing yet — use the converter or search!</span>';
    return;
  }

  container.innerHTML = '';
  items.forEach((item) => {
    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.setAttribute('role', 'listitem');
    chip.title = item.name || item.char;
    chip.innerHTML = `<span class="chip-glyph">${escHtml(item.char)}</span><span class="chip-label">${escHtml(shortenName(item.name || item.char))}</span>`;
    chip.addEventListener('click', async () => {
      await copyToClipboard(item.char);
      showToast(`Copied  ${item.char}`);
    });
    container.appendChild(chip);
  });
}

function shortenName(name) {
  if (!name) return '';
  const words = name.split(' ');
  return words.slice(0, 3).join(' ');
}

// ── Style Converter ───────────────────────────────────────────────────────────

let currentConverterText = '';

function buildStyleGrid() {
  const grid = document.getElementById('styleGrid');
  grid.innerHTML = '';

  STYLES.forEach((style, idx) => {
    const card = document.createElement('div');
    card.className = 'style-card';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${idx * 30}ms`;

    const header = document.createElement('div');
    header.className = 'style-card-header';

    const nameEl = document.createElement('span');
    nameEl.className = 'style-name';
    nameEl.textContent = style.name;

    const actions = document.createElement('div');
    actions.className = 'style-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '⎘ Copy';
    copyBtn.title = `Copy ${style.name} text`;

    const output = document.createElement('div');
    output.className = 'style-output placeholder-text';
    output.id = `output-${style.id}`;
    output.textContent = `𝒶𝒷𝒸 — type to convert`;

    copyBtn.addEventListener('click', async () => {
      const converted = convertText(currentConverterText, style);
      if (!converted) { showToast('Nothing to copy yet!'); return; }
      const ok = await copyToClipboard(converted);
      if (ok) {
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '⎘ Copy';
          copyBtn.classList.remove('copied');
        }, 1500);
        addToRecent({ char: converted.slice(0, 8), name: `${style.name}: ${currentConverterText.slice(0, 6)}` });
        showToast(`Copied ${style.name}!`);
      }
    });

    actions.appendChild(copyBtn);
    header.appendChild(nameEl);
    header.appendChild(actions);
    card.appendChild(header);
    card.appendChild(output);
    grid.appendChild(card);
  });
}

function updateStyleOutputs(text) {
  currentConverterText = text;
  STYLES.forEach((style) => {
    const el = document.getElementById(`output-${style.id}`);
    if (!el) return;
    if (!text) {
      el.className = 'style-output placeholder-text';
      el.textContent = samplePreview(style);
    } else {
      el.className = 'style-output';
      el.textContent = convertText(text, style);
    }
  });
}

function samplePreview(style) {
  return convertText('Hello', style);
}

function initConverter() {
  buildStyleGrid();
  const input = document.getElementById('converterInput');
  input.addEventListener('input', () => updateStyleOutputs(input.value));
  // Set initial placeholder previews
  updateStyleOutputs('');
}

// ── Unicode Search ────────────────────────────────────────────────────────────

let searchDebounce = null;

function searchUnicode(query) {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  const results = [];
  const seen = new Set();

  for (const entry of UNICODE_DATA) {
    if (seen.has(entry.char)) continue;

    const nameMatch = entry.name.toLowerCase().includes(q);
    const keywordMatch = entry.keywords.some((k) => k.toLowerCase().includes(q));

    if (nameMatch || keywordMatch) {
      results.push(entry);
      seen.add(entry.char);
    }

    if (results.length >= 80) break;
  }

  return results;
}

function buildGlyphCard(entry, isFav) {
  const card = document.createElement('button');
  card.className = `glyph-card${isFav ? ' is-fav' : ''}`;
  card.setAttribute('role', 'listitem');
  card.title = `${entry.name}\nU+${entry.char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}\nClick to copy`;
  card.setAttribute('aria-label', `${entry.name}, click to copy`);

  const glyphEl = document.createElement('span');
  glyphEl.className = 'glyph-char';
  glyphEl.setAttribute('aria-hidden', 'true');
  glyphEl.textContent = entry.char;

  const nameEl = document.createElement('span');
  nameEl.className = 'glyph-name';
  nameEl.textContent = abbreviateName(entry.name);

  const favBadge = document.createElement('span');
  favBadge.className = 'fav-badge';
  favBadge.setAttribute('aria-hidden', 'true');
  favBadge.textContent = '★';

  card.appendChild(favBadge);
  card.appendChild(glyphEl);
  card.appendChild(nameEl);

  // Click to copy
  card.addEventListener('click', async (e) => {
    // Right-click opens context menu (handled separately)
    if (e.button !== 0) return;
    const ok = await copyToClipboard(entry.char);
    if (ok) {
      showToast(`Copied  ${entry.char}`);
      addToRecent({ char: entry.char, name: entry.name });
      glyphEl.style.transform = 'scale(1.4)';
      glyphEl.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => { glyphEl.style.transform = ''; }, 300);
    }
  });

  // Long press / right-click → toggle favorite
  let pressTimer = null;
  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    toggleFavorite(entry, card);
  });
  card.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => toggleFavorite(entry, card), 500);
  });
  card.addEventListener('pointerup', () => clearTimeout(pressTimer));
  card.addEventListener('pointerleave', () => clearTimeout(pressTimer));

  return card;
}

function abbreviateName(name) {
  if (!name) return '';
  // Drop "Mathematical" prefix to save space
  return name
    .replace(/^Mathematical\s+/, '')
    .replace(/^(Double-Struck|Bold\s+Italic|Bold\s+Script|Bold\s+Fraktur|Sans-Serif\s+(Bold\s+)?Italic|Sans-Serif\s+Bold|Sans-Serif)\s+/, (m) => m.trim().split(/\s+/).map((w) => w[0]).join('') + ' ')
    .slice(0, 24);
}

function renderSearchResults(query) {
  const grid = document.getElementById('searchResults');
  const emptyMsg = document.getElementById('searchEmpty');
  const hintMsg = document.getElementById('searchHint');

  if (!query) {
    grid.innerHTML = '';
    emptyMsg.hidden = true;
    hintMsg.hidden = false;
    return;
  }

  hintMsg.hidden = true;
  const results = searchUnicode(query);
  const favs = loadFavorites();
  const favSet = new Set(favs.map((f) => f.char));

  grid.innerHTML = '';
  if (results.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    results.forEach((entry, idx) => {
      const card = buildGlyphCard(entry, favSet.has(entry.char));
      card.style.animationDelay = `${Math.min(idx, 20) * 20}ms`;
      grid.appendChild(card);
    });
  }
}

function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');

  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => renderSearchResults(input.value.trim()), 150);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    renderSearchResults('');
    input.focus();
  });
}

// ── Favorites ─────────────────────────────────────────────────────────────────

function toggleFavorite(entry, cardEl) {
  let favs = loadFavorites();
  const existing = favs.findIndex((f) => f.char === entry.char);

  if (existing >= 0) {
    favs.splice(existing, 1);
    cardEl.classList.remove('is-fav');
    showToast(`Removed from favorites`);
  } else {
    favs.unshift({ char: entry.char, name: entry.name });
    cardEl.classList.add('is-fav');
    showToast(`★ Added to favorites`);
  }

  saveFavorites(favs);

  // Refresh favorites tab if open
  const favPanel = document.getElementById('tab-favorites');
  if (favPanel.classList.contains('active')) renderFavorites();
}

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const emptyMsg = document.getElementById('favoritesEmpty');
  const favs = loadFavorites();

  if (favs.length === 0) {
    grid.innerHTML = '';
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;
  const favSet = new Set(favs.map((f) => f.char));

  grid.innerHTML = '';
  favs.forEach((entry, idx) => {
    const card = buildGlyphCard(entry, favSet.has(entry.char));
    card.style.animationDelay = `${Math.min(idx, 20) * 25}ms`;

    // In favorites view, clicking fav badge removes from list
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleFavorite(entry, card);
    });

    grid.appendChild(card);
  });
}

function initFavorites() {
  document.getElementById('clearFavorites').addEventListener('click', () => {
    if (confirm('Clear all favorites?')) {
      saveFavorites([]);
      renderFavorites();
      showToast('Favorites cleared');
    }
  });
}

// ── Recent section controls ───────────────────────────────────────────────────

function initRecent() {
  document.getElementById('clearRecent').addEventListener('click', () => {
    saveRecent([]);
    renderRecent();
    showToast('Recent history cleared');
  });
  renderRecent();
}

// ── Utility: HTML-escape ──────────────────────────────────────────────────────

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

function init() {
  initTheme();
  initTabs();
  initRecent();
  initConverter();
  initSearch();
  initFavorites();

  // Theme toggle button
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
  });

  // System theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEYS.theme)) {
      applyTheme(e.matches);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
