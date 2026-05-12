/* ════════════════════════════════════════════════════════════════════
   Floating Python REPL widget — logic
   Loads Pyodide lazily on first open, shimming calculator_ui so
   show_input() and show_result() update a mini display in the panel.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const PYODIDE_VERSION = '0.29.4';
  const PYODIDE_INDEX   = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

  let pyodide      = null;
  let pyReady      = false;
  let pyLoading    = false;
  let panelOpen    = false;

  // ── Build widget DOM ───────────────────────────────────────────────────────
  function buildWidget() {
    const w = document.createElement('div');
    w.id = 'repl-widget';
    w.innerHTML = `
<button id="repl-fab" title="Open Python playground">
  <span>🐍</span><span>Python</span>
</button>
<div id="repl-panel" aria-hidden="true" aria-label="Python playground">
  <div id="repl-header">
    <span>🐍 Try it in Python</span>
    <button id="repl-close" title="Minimise" aria-label="Close">✕</button>
  </div>
  <div id="repl-display">
    <div class="repl-screen-row">
      <span class="repl-screen-label">Top display</span>
      <div id="sim-top" class="repl-screen repl-screen-default">—</div>
    </div>
    <div class="repl-screen-row">
      <span class="repl-screen-label">Bottom display</span>
      <div id="sim-bottom" class="repl-screen repl-screen-default">—</div>
    </div>
  </div>
  <div id="repl-editor">
    <textarea id="repl-code"
              spellcheck="false"
              autocorrect="off"
              autocapitalize="off"
              placeholder="Type Python here, then press Run (or Ctrl+Enter)…"></textarea>
    <div id="repl-toolbar">
      <button id="repl-run" disabled>▶ Run</button>
      <button id="repl-clear">Clear</button>
      <span class="repl-hint">Ctrl+Enter to run</span>
    </div>
  </div>
  <div id="repl-output-wrap">
    <div id="repl-status"></div>
    <pre id="repl-output"></pre>
  </div>
</div>`;
    document.body.appendChild(w);
  }

  // ── Pyodide loading ────────────────────────────────────────────────────────
  function loadPyodideScript() {
    return new Promise((resolve, reject) => {
      if (window.loadPyodide) { resolve(); return; }
      const s = document.createElement('script');
      s.src = PYODIDE_INDEX + 'pyodide.js';
      s.onload  = resolve;
      s.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(s);
    });
  }

  async function initPyodide() {
    if (pyReady || pyLoading) return;
    pyLoading = true;
    setStatus('Loading Python… (first time takes ~5 seconds)');
    try {
      await loadPyodideScript();
      pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX });

      // Install calculator_ui shim so `from calculator_ui import …` works,
      // and also expose all functions at top-level for snippets without an import.
      await pyodide.runPythonAsync(`
import sys, types

_mod = types.ModuleType('calculator_ui')

def _show_input(text):
    from js import document
    el = document.getElementById('sim-top')
    if el:
        el.className = 'repl-screen'
        el.textContent = str(text)

def _show_result(value):
    from js import document
    el = document.getElementById('sim-bottom')
    if el:
        el.className = 'repl-screen'
        el.textContent = str(value)

def _setup_screen():
    pass

def _when_key_pressed(fn):
    pass

def _run():
    pass

_mod.show_input       = _show_input
_mod.show_result      = _show_result
_mod.setup_screen     = _setup_screen
_mod.when_key_pressed = _when_key_pressed
_mod.run              = _run

sys.modules['calculator_ui'] = _mod

# Also expose at top-level for snippets that skip the import line
show_input       = _show_input
show_result      = _show_result
setup_screen     = _setup_screen
when_key_pressed = _when_key_pressed
run              = _run
`);
      pyReady  = true;
      pyLoading = false;
      setStatus('');
      document.getElementById('repl-run').disabled = false;
      document.getElementById('repl-code').focus();
    } catch (err) {
      pyLoading = false;
      setStatus('⚠ Could not load Python — check your internet connection.');
      console.error('Pyodide load error:', err);
    }
  }

  // ── Run code ───────────────────────────────────────────────────────────────
  async function runCode() {
    if (!pyReady) return;
    const codeEl  = document.getElementById('repl-code');
    const outEl   = document.getElementById('repl-output');
    const runBtn  = document.getElementById('repl-run');
    const code    = codeEl.value;
    if (!code.trim()) return;

    outEl.textContent = '';
    outEl.className   = '';
    runBtn.disabled   = true;

    let stdout = '';
    pyodide.setStdout({ batched: (s) => { stdout += s + '\n'; } });
    pyodide.setStderr({ batched: (s) => { stdout += s + '\n'; } });

    try {
      await pyodide.runPythonAsync(code);
      if (stdout.trim()) {
        outEl.textContent = stdout.trimEnd();
        outEl.className   = 'has-output repl-ok';
      }
    } catch (err) {
      outEl.textContent = friendlyError(err);
      outEl.className   = 'has-output repl-err';
    } finally {
      runBtn.disabled = false;
      codeEl.focus();
    }
  }

  // Strip Pyodide internal stack frames, keep just the useful Python traceback.
  function friendlyError(err) {
    const msg = err.message || String(err);
    const lines = msg.split('\n');
    // Drop lines that reference pyodide internal paths
    const filtered = lines.filter(l =>
      !l.includes('/lib/python') &&
      !l.includes('pyodide-') &&
      !l.trim().startsWith('at ')
    );
    return filtered.join('\n').trim();
  }

  // ── Panel open/close ───────────────────────────────────────────────────────
  function openPanel() {
    panelOpen = true;
    document.getElementById('repl-panel').classList.add('repl-open');
    document.getElementById('repl-panel').setAttribute('aria-hidden', 'false');
    document.getElementById('repl-fab').classList.add('repl-fab-open');
    initPyodide();
  }

  function closePanel() {
    panelOpen = false;
    document.getElementById('repl-panel').classList.remove('repl-open');
    document.getElementById('repl-panel').setAttribute('aria-hidden', 'true');
    document.getElementById('repl-fab').classList.remove('repl-fab-open');
  }

  function setStatus(msg) {
    const el = document.getElementById('repl-status');
    if (el) el.textContent = msg;
  }

  // ── "Try it" buttons on code blocks ───────────────────────────────────────
  function addTryButtons() {
    document.querySelectorAll('pre > code.language-python').forEach((codeEl) => {
      const pre  = codeEl.parentElement;
      const wrap = document.createElement('div');
      wrap.className = 'repl-try-wrap';
      const btn = document.createElement('button');
      btn.className   = 'repl-try-btn';
      btn.textContent = '▶ Try it in Python';
      btn.title       = 'Copy this code to the Python playground and run it';
      btn.addEventListener('click', () => {
        // Use the pre-highlight text if available, else textContent
        const rawCode = codeEl.dataset.highlighted
          ? codeEl.innerText   // highlight.js leaves innerText clean
          : codeEl.textContent;
        document.getElementById('repl-code').value = rawCode;
        // Clear previous output / displays
        const outEl = document.getElementById('repl-output');
        outEl.textContent = '';
        outEl.className   = '';
        ['sim-top', 'sim-bottom'].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.className = 'repl-screen repl-screen-default'; el.textContent = '—'; }
        });
        if (!panelOpen) openPanel();
        // Auto-run if Pyodide is already loaded
        if (pyReady) runCode();
      });
      wrap.appendChild(btn);
      pre.insertAdjacentElement('afterend', wrap);
    });
  }

  // ── Wire up events ─────────────────────────────────────────────────────────
  function wireEvents() {
    document.getElementById('repl-fab')
      .addEventListener('click', () => panelOpen ? closePanel() : openPanel());

    document.getElementById('repl-close')
      .addEventListener('click', closePanel);

    document.getElementById('repl-run')
      .addEventListener('click', runCode);

    document.getElementById('repl-clear')
      .addEventListener('click', () => {
        document.getElementById('repl-code').value = '';
        const outEl = document.getElementById('repl-output');
        outEl.textContent = '';
        outEl.className   = '';
        ['sim-top', 'sim-bottom'].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.className = 'repl-screen repl-screen-default'; el.textContent = '—'; }
        });
        setStatus(pyReady ? '' : 'Loading Python…');
        document.getElementById('repl-code').focus();
      });

    document.getElementById('repl-code')
      .addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
          e.preventDefault();
          runCode();
        }
        // Tab → 4 spaces
        if (e.key === 'Tab') {
          e.preventDefault();
          const ta    = e.target;
          const start = ta.selectionStart;
          const end   = ta.selectionEnd;
          ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
          ta.selectionStart = ta.selectionEnd = start + 4;
        }
      });
  }

  // ── Kick off after DOM ready ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildWidget();
    wireEvents();
    // Add "Try it" buttons after highlight.js has run (it runs at DOMContentLoaded too,
    // so we defer one tick to let it finish).
    setTimeout(addTryButtons, 0);
  });

})();
