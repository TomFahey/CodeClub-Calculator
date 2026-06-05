/* ════════════════════════════════════════════════════════════════════
   Calculator Simulator widget — logic
   - Replicates the M5Stack Tab5 calculator UI exactly (4×5 key grid,
     device colours, two-line display).
   - Loads Pyodide lazily; shims calculator_ui so show_input() /
     show_result() update the on-screen display.
   - when_key_pressed() stores the student's callback; clicking a
     button calls it, exactly as tapping a key on the real device.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const PYODIDE_VERSION = '0.29.4';
  const PYODIDE_INDEX   = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

  // ── Key layout — matches KEYS array in calculator_ui.py exactly ───────────
  const KEYS = [
    'C',   'DEL', '%',  '/',
    '7',   '8',   '9',  'x',
    '4',   '5',   '6',  '-',
    '1',   '2',   '3',  '+',
    '+/-', '0',   '.',  '=',
  ];

  const OPERATOR_KEYS = new Set(['+', '-', 'x', '/']);
  const FUNCTION_KEYS = new Set(['C', 'DEL', '%', '+/-']);

  // Colour scheme matches _key_colours() in calculator_ui.py
  function keyColours(key) {
    if (key === '=')             return ['#1a73e8', '#ffffff'];
    if (OPERATOR_KEYS.has(key)) return ['#ff9500', '#ffffff'];
    if (FUNCTION_KEYS.has(key)) return ['#d4d4d4', '#212121'];
    return ['#ffffff', '#212121'];
  }

  let pyodide   = null;
  let pyReady   = false;
  let pyLoading = false;
  let panelOpen = false;
  let editorOpen = true;

  // ── Build widget DOM ───────────────────────────────────────────────────────
  function buildWidget() {
    const keysHtml = KEYS.map(k => {
      const [bg, fg] = keyColours(k);
      return `<button class="calc-key" data-key="${k}" ` +
             `style="background:${bg};color:${fg}">${k}</button>`;
    }).join('');

    const w = document.createElement('div');
    w.id = 'repl-widget';
    w.innerHTML = `
<button id="repl-fab" title="Open Calculator Simulator">
  <span>🧮</span><span>Simulator</span>
</button>
<div id="repl-panel" aria-hidden="true" aria-label="Calculator Simulator">
  <div id="repl-header">
    <span>🧮 Calculator Simulator</span>
    <button id="repl-close" title="Minimise" aria-label="Close">✕</button>
  </div>

  <div id="calc-display">
    <div id="sim-top"    class="calc-display-input"></div>
    <div id="sim-bottom" class="calc-display-result">0</div>
  </div>

  <div id="calc-keys">${keysHtml}</div>

  <div id="repl-editor-section">
    <button id="repl-editor-toggle" title="Show / hide code editor">
      <span>📝 Code editor</span>
      <span id="toggle-arrow">▲</span>
    </button>
    <div id="repl-editor-body">
      <textarea id="repl-code"
                spellcheck="false"
                autocorrect="off"
                autocapitalize="off"
                placeholder="Write Python here, then press Run…&#10;&#10;Tip: after running, click the calculator buttons to test your handle_key!"></textarea>
      <div id="repl-toolbar">
        <button id="repl-run" disabled>▶ Run</button>
        <button id="repl-reset">↺ Reset</button>
        <span class="repl-hint">Ctrl+Enter to run</span>
      </div>
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
      s.src     = PYODIDE_INDEX + 'pyodide.js';
      s.onload  = resolve;
      s.onerror = () => reject(new Error('Failed to load Pyodide'));
      document.head.appendChild(s);
    });
  }

  async function initPyodide() {
    if (pyReady || pyLoading) return;
    pyLoading = true;
    setStatus('Loading Python… (first time ~5 s)');
    try {
      await loadPyodideScript();
      pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX });

      // Install calculator_ui shim.
      // _key_cb persists across runPythonAsync calls — JS reads it to fire
      // the student's callback when a calculator button is clicked.
      await pyodide.runPythonAsync(`
import sys, types

_key_cb = None          # set by when_key_pressed(); called by JS on key click

_mod = types.ModuleType('calculator_ui')

def _show_input(text):
    from js import document
    el = document.getElementById('sim-top')
    if el:
        el.textContent = str(text)

def _show_result(value):
    from js import document
    el = document.getElementById('sim-bottom')
    if el:
        el.textContent = str(value)

def _setup_screen():
    pass

def _when_key_pressed(fn):
    global _key_cb
    _key_cb = fn

def _run():
    pass

_mod.show_input       = _show_input
_mod.show_result      = _show_result
_mod.setup_screen     = _setup_screen
_mod.when_key_pressed = _when_key_pressed
_mod.run              = _run

sys.modules['calculator_ui'] = _mod

# Top-level aliases so snippets that skip the import line still work
show_input       = _show_input
show_result      = _show_result
setup_screen     = _setup_screen
when_key_pressed = _when_key_pressed
run              = _run
`);
      pyReady   = true;
      pyLoading = false;
      setStatus('');
      document.getElementById('repl-run').disabled = false;
      document.getElementById('repl-code').focus();
    } catch (err) {
      pyLoading = false;
      setStatus('⚠ Could not load Python — check your connection.');
      console.error('Pyodide load error:', err);
    }
  }

  // ── Run student code ───────────────────────────────────────────────────────
  async function runCode() {
    if (!pyReady) return;
    const codeEl = document.getElementById('repl-code');
    const outEl  = document.getElementById('repl-output');
    const runBtn = document.getElementById('repl-run');
    const code   = codeEl.value;
    if (!code.trim()) return;

    outEl.textContent = '';
    outEl.className   = '';
    runBtn.disabled   = true;

    let stdout = '';
    pyodide.setStdout({ batched: s => { stdout += s + '\n'; } });
    pyodide.setStderr({ batched: s => { stdout += s + '\n'; } });

    try {
      await pyodide.runPythonAsync(code);
      if (stdout.trim()) {
        outEl.textContent = stdout.trimEnd();
        outEl.className   = 'has-output';
      }
    } catch (err) {
      outEl.textContent = friendlyError(err);
      outEl.className   = 'has-output repl-err';
    } finally {
      runBtn.disabled = false;
    }
  }

  // ── Fire a key press (called when a calculator button is clicked) ──────────
  // Calls the student's registered _key_cb, captures any print() output,
  // and appends errors — so multiple key presses accumulate in the output box.
  async function triggerKey(key) {
    if (!pyReady) return;
    const outEl = document.getElementById('repl-output');

    let stdout = '';
    pyodide.setStdout({ batched: s => { stdout += s + '\n'; } });
    pyodide.setStderr({ batched: s => { stdout += s + '\n'; } });

    try {
      await pyodide.runPythonAsync(
        `if _key_cb is not None:\n    _key_cb(${JSON.stringify(key)})`
      );
      if (stdout.trim()) {
        outEl.textContent = (outEl.textContent + stdout).trimEnd();
        outEl.className   = 'has-output';
      }
    } catch (err) {
      const msg = friendlyError(err);
      outEl.textContent = (outEl.textContent ? outEl.textContent + '\n' : '') + msg;
      outEl.className   = 'has-output repl-err';
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function friendlyError(err) {
    const msg    = err.message || String(err);
    const lines  = msg.split('\n');
    const keep   = lines.filter(l =>
      !l.includes('/lib/python') &&
      !l.includes('pyodide-') &&
      !l.trim().startsWith('at ')
    );
    return keep.join('\n').trim();
  }

  function setStatus(msg) {
    const el = document.getElementById('repl-status');
    if (el) el.textContent = msg;
  }

  // Reset the calculator display and output (does NOT clear code or callback).
  function resetSim() {
    const top = document.getElementById('sim-top');
    if (top) top.textContent = '';

    const bot = document.getElementById('sim-bottom');
    if (bot) bot.textContent = '0';

    const out = document.getElementById('repl-output');
    if (out) { out.textContent = ''; out.className = ''; }

    setStatus(pyReady ? '' : 'Loading Python…');
  }

  // ── Editor collapse / expand ───────────────────────────────────────────────
  function setEditorOpen(open) {
    editorOpen = open;
    const body  = document.getElementById('repl-editor-body');
    const arrow = document.getElementById('toggle-arrow');
    if (!body) return;
    if (open) {
      // scrollHeight is the true content height regardless of max-height
      body.style.maxHeight = Math.max(body.scrollHeight, 160) + 'px';
      arrow.textContent    = '▲';
    } else {
      body.style.maxHeight = '0';
      arrow.textContent    = '▼';
    }
  }

  // ── Panel open / close ─────────────────────────────────────────────────────
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

  // ── "Try it" buttons below code blocks ────────────────────────────────────
  function addTryButtons() {
    document.querySelectorAll('pre > code.language-python').forEach(codeEl => {
      const pre  = codeEl.parentElement;
      const wrap = document.createElement('div');
      wrap.className = 'repl-try-wrap';

      const btn = document.createElement('button');
      btn.className   = 'repl-try-btn';
      btn.textContent = '▶ Try it in Python';
      btn.title       = 'Copy this snippet to the simulator and run it';

      btn.addEventListener('click', () => {
        document.getElementById('repl-code').value = codeEl.innerText || codeEl.textContent;
        resetSim();
        if (!panelOpen) openPanel();
        setEditorOpen(true);
        if (pyReady) runCode();
      });

      wrap.appendChild(btn);
      pre.insertAdjacentElement('afterend', wrap);
    });
  }

  // ── Wire events ────────────────────────────────────────────────────────────
  function wireEvents() {
    document.getElementById('repl-fab')
      .addEventListener('click', () => panelOpen ? closePanel() : openPanel());

    document.getElementById('repl-close')
      .addEventListener('click', closePanel);

    document.getElementById('repl-run')
      .addEventListener('click', runCode);

    document.getElementById('repl-reset')
      .addEventListener('click', resetSim);

    document.getElementById('repl-editor-toggle')
      .addEventListener('click', () => setEditorOpen(!editorOpen));

    document.getElementById('repl-code')
      .addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); runCode(); }
        if (e.key === 'Tab') {
          e.preventDefault();
          const ta = e.target, s = ta.selectionStart, en = ta.selectionEnd;
          ta.value = ta.value.substring(0, s) + '    ' + ta.value.substring(en);
          ta.selectionStart = ta.selectionEnd = s + 4;
        }
      });

    // Single delegated listener on the key grid for all 20 buttons
    document.getElementById('calc-keys')
      .addEventListener('click', e => {
        const btn = e.target.closest('.calc-key');
        if (!btn) return;
        const key = btn.dataset.key;
        btn.classList.add('calc-key-active');
        setTimeout(() => btn.classList.remove('calc-key-active'), 150);
        triggerKey(key);
      });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildWidget();
    wireEvents();
    // Defer "Try it" injection one tick so highlight.js finishes first
    setTimeout(addTryButtons, 0);
  });

})();
