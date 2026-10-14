'use strict';

/* =====================================================================
   1. ARITHMETIC ENGINE (pure functions, no DOM access)
   ===================================================================== */
const OPERATORS = ['+', '-', '*', '/'];
const MAX_DIGITS = 15;
const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

class DivisionByZeroError extends Error {}

/** Split an expression string into number and operator tokens. */
function tokenize(expr) {
  const tokens = [];
  const numberRe = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i;
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    // Ignore any whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (OPERATORS.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    const m = numberRe.exec(expr.slice(i));
    if (!m) throw new SyntaxError('Unexpected character "' + ch + '"');
    tokens.push({ type: 'num', value: parseFloat(m[0]) });
    i += m[0].length;
  }
  return tokens;
}

/**
 * Recursive-descent evaluator:
 *   sum    := term (('+' | '-') term)*     lowest precedence, left to right
 *   term   := factor (('*' | '/') factor)* higher precedence, left to right
 *   factor := '-' factor | number
 */
function evaluate(expr) {
  const tokens = tokenize(expr);
  let pos = 0;
  const peekIs = (...ops) => pos < tokens.length && tokens[pos].type === 'op' && ops.includes(tokens[pos].value);

  function factor() {
    const t = tokens[pos++];
    if (!t) throw new SyntaxError('Unexpected end of expression');
    if (t.type === 'num') return t.value;
    if (t.value === '-') return -factor();
    throw new SyntaxError('Unexpected operator');
  }
  function term() {
    let value = factor();
    while (peekIs('*', '/')) {
      const op = tokens[pos++].value;
      const right = factor();
      if (op === '/') {
        if (right === 0) throw new DivisionByZeroError('Division by zero');
        value /= right;
      } else {
        value *= right;
      }
    }
    return value;
  }
  function sum() {
    let value = term();
    while (peekIs('+', '-')) {
      const op = tokens[pos++].value;
      const right = term();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  const result = sum();
  if (pos < tokens.length) throw new SyntaxError('Unexpected token');
  if (!Number.isFinite(result)) throw new RangeError('Result out of range');
  return result;
}

/** Trim floating-point noise: 0.1 + 0.2 -> "0.3". */
function formatNumber(n) {
  return Number(n.toPrecision(12)).toString();
}

/* =====================================================================
   2. CALCULATOR STATE (pure reducer: state in, new state out)
   state = { expr, result, error, evaluated }
   ===================================================================== */
const initialState = () => ({ expr: '', result: null, error: null, evaluated: false });
const fresh = (expr) => ({ expr, result: null, error: null, evaluated: false });
const isOperator = (c) => OPERATORS.includes(c);
const currentNumber = (expr) => /[\d.]*$/.exec(expr)[0];

function reduce(state, type, value) {
  // After an error only clear/backspace do anything.
  if (state.error && type !== 'clear' && type !== 'backspace') return state;

  switch (type) {
    case 'digit': {
      const expr = state.evaluated ? '' : state.expr;
      const num = currentNumber(expr);
      if (num.replace('.', '').length >= MAX_DIGITS) return state;
      return fresh((num === '0' ? expr.slice(0, -1) : expr) + value); // no leading zeros
    }
    case 'decimal': {
      const expr = state.evaluated ? '' : state.expr;
      const num = currentNumber(expr);
      if (num.includes('.')) return state;
      return fresh(expr + (num === '' ? '0.' : '.'));
    }
    case 'operator': {
      let expr = state.evaluated ? state.result : state.expr;
      if (expr === '') return value === '-' ? fresh('-') : state; // only a leading minus is allowed
      if (expr === '-') return state;
      const last = expr.slice(-1);
      if (isOperator(last) || last === '.') expr = expr.slice(0, -1); // replace operator / drop dangling dot
      return fresh(expr + value);
    }
    case 'percent': {
      let expr = state.evaluated ? state.result : state.expr;
      if (!expr || expr === '-' || isOperator(expr.slice(-1))) return state;
      const match = /(-?\d+\.?\d*|\.\d+)$/.exec(expr);
      if (!match) return state;
      const num = parseFloat(match[0]);
      const percentVal = formatNumber(num / 100);
      return fresh(expr.slice(0, -match[0].length) + percentVal);
    }
    case 'negate': {
      let expr = state.evaluated ? state.result : state.expr;
      if (!expr || expr === '0') return state;
      if (expr.startsWith('-') && !/[+\-*/]/.test(expr.slice(1))) {
        return fresh(expr.slice(1));
      }
      if (!/[+\-*/]/.test(expr)) {
        return fresh('-' + expr);
      }
      if (isOperator(expr.slice(-1))) return state;
      const match = /([+\-*/])(-?\d+\.?\d*|\.\d+)$/.exec(expr);
      if (match) {
        const op = match[1];
        const num = match[2];
        if (op === '+') {
          return fresh(expr.slice(0, match.index) + '-' + num);
        } else if (op === '-') {
          return fresh(expr.slice(0, match.index) + '+' + num);
        } else {
          if (num.startsWith('-')) {
            return fresh(expr.slice(0, match.index + 1) + num.slice(1));
          } else {
            return fresh(expr.slice(0, match.index + 1) + '-' + num);
          }
        }
      }
      return state;
    }
    case 'equals': {
      if (state.evaluated || state.expr === '') return state;
      const expr = state.expr.replace(/[+\-*/.]+$/, '');
      if (expr === '') return state;
      try {
        return { expr, result: formatNumber(evaluate(expr)), error: null, evaluated: true };
      } catch (err) {
        const message = err instanceof DivisionByZeroError ? 'Cannot divide by zero' : 'Invalid expression';
        return { expr, result: null, error: message, evaluated: false };
      }
    }
    case 'backspace': {
      if (state.error) return initialState();
      return fresh((state.evaluated ? state.result : state.expr).slice(0, -1));
    }
    case 'clear':
      return initialState();
    default:
      return state;
  }
}

/* =====================================================================
   3. VIEW MODEL (state -> display strings)
   ===================================================================== */
function formatExpression(expr) {
  return expr
    .replace(/(?<=[\d.])([+\-*/])/g, (m) => ' ' + SYMBOLS[m] + ' ')
    .replace(/^-/, '−')
    .trim();
}

function livePreview(expr) {
  try {
    return formatNumber(evaluate(expr.replace(/[+\-*/.]+$/, '')));
  } catch (err) {
    return null;
  }
}

function getView(state) {
  const expression = formatExpression(state.expr);
  if (state.error) return { expression, result: state.error, isError: true };
  if (state.evaluated) return { expression: expression + ' =', result: state.result, isError: false };
  const isSingleNumber = !/[+\-*/]/.test(state.expr.replace(/^-/, ''));
  if (isSingleNumber) return { expression, result: state.expr || '0', isError: false };
  const preview = livePreview(state.expr);
  return { expression, result: preview !== null ? preview : (currentNumber(state.expr) || '0'), isError: false };
}

/* =====================================================================
   4. UI / EVENT HANDLING & PROFESSIONAL ENHANCEMENTS
   ===================================================================== */
function initUI() {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const keypad = document.querySelector('.keypad');
  const historyToggleBtn = document.getElementById('history-toggle-btn');
  const historyPanel = document.getElementById('history-panel');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const copyResultBtn = document.getElementById('copy-result-btn');

  let state = initialState();
  let history = [];
  let isSoundEnabled = false;
  let audioCtx = null;

  // Sound Synthesizer (Zero-dependency Web Audio API)
  function playClickSound() {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.015);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  function renderHistory() {
    if (!historyList) return;
    if (history.length === 0) {
      historyList.innerHTML = '<li class="history-empty">No calculations yet</li>';
      return;
    }
    historyList.innerHTML = history
      .map(
        (item, index) => `
        <li class="history-item" data-index="${index}" title="Click to recall this result">
          <span class="history-item-expr">${formatExpression(item.expr)} =</span>
          <span class="history-item-res">${item.result}</span>
        </li>
      `
      )
      .join('');
  }

  function render() {
    const view = getView(state);
    expressionEl.textContent = view.expression || '\u00A0';
    resultEl.textContent = view.result;
    resultEl.classList.toggle('is-error', view.isError);
    const len = view.result.length;
    resultEl.dataset.size = view.isError ? '' : len > 14 ? 'xs' : len > 10 ? 'sm' : '';
  }

  function press(type, value) {
    playClickSound();
    const prevEvaluated = state.evaluated;
    state = reduce(state, type, value);

    // If a calculation was successfully evaluated, store in history
    if (!prevEvaluated && state.evaluated && state.result && !state.error) {
      history.unshift({ expr: state.expr, result: state.result });
      if (history.length > 20) history.pop();
      renderHistory();
    }

    render();
  }

  // Keypad Click Delegation
  keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.digit !== undefined) press('digit', button.dataset.digit);
    else if (button.dataset.operator) press('operator', button.dataset.operator);
    else if (button.dataset.action) press(button.dataset.action);
  });

  // History Panel Toggle & Interactions
  if (historyToggleBtn && historyPanel) {
    historyToggleBtn.addEventListener('click', () => {
      const isHidden = historyPanel.hidden;
      historyPanel.hidden = !isHidden;
      historyToggleBtn.classList.toggle('is-active', !historyPanel.hidden);
    });

    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        history = [];
        renderHistory();
      });
    }

    if (historyList) {
      historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) return;
        const index = parseInt(item.dataset.index, 10);
        if (!isNaN(index) && history[index]) {
          state = fresh(history[index].result);
          render();
          historyPanel.hidden = true;
          historyToggleBtn.classList.remove('is-active');
        }
      });
    }
  }

  // Sound Feedback Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (soundIconOn && soundIconOff) {
        soundIconOn.hidden = !isSoundEnabled;
        soundIconOff.hidden = isSoundEnabled;
      }
      soundToggleBtn.classList.toggle('is-active', isSoundEnabled);
      if (isSoundEnabled) playClickSound();
    });
  }

  // Copy Result to Clipboard
  if (copyResultBtn) {
    copyResultBtn.addEventListener('click', async () => {
      const view = getView(state);
      const textToCopy = view.result;
      if (!textToCopy || view.isError) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const ta = document.createElement('textarea');
          ta.value = textToCopy;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        copyResultBtn.classList.add('copied');
        copyResultBtn.title = 'Result copied!';
        setTimeout(() => {
          copyResultBtn.classList.remove('copied');
          copyResultBtn.title = 'Copy result';
        }, 1800);
      } catch (err) {
        console.warn('Could not copy result', err);
      }
    });
  }

  // Keyboard Mapping
  function keyToAction(key) {
    if (/^\d$/.test(key)) return ['digit', key];
    if (key === '.' || key === ',') return ['decimal'];
    if (key === '+' || key === '-' || key === '/') return ['operator', key];
    if (key === '*' || key === 'x' || key === 'X') return ['operator', '*'];
    if (key === '%') return ['percent'];
    if (key === 'n' || key === 'N') return ['negate'];
    if (key === 'Enter' || key === '=') return ['equals'];
    if (key === 'Backspace') return ['backspace'];
    if (key === 'Escape' || key === 'Delete') return ['clear'];
    return null;
  }

  function buttonFor(type, value) {
    const selector = type === 'digit' ? '[data-digit="' + value + '"]'
      : type === 'operator' ? '[data-operator="' + value + '"]'
      : '[data-action="' + type + '"]';
    return keypad.querySelector(selector);
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const action = keyToAction(event.key);
    if (!action) return;
    event.preventDefault();
    press(action[0], action[1]);
    const button = buttonFor(action[0], action[1]);
    if (button) {
      button.classList.add('is-active');
      setTimeout(() => button.classList.remove('is-active'), 120);
    }
  });

  render();
}

if (typeof document !== 'undefined') initUI();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluate, tokenize, reduce, initialState, getView, formatNumber, DivisionByZeroError };
}
