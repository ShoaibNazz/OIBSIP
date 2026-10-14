(function () {
  'use strict';

  var ABSOLUTE_ZERO = { celsius: -273.15, fahrenheit: -459.67, kelvin: 0 };
  var UNIT_NAMES = { celsius: 'Celsius (°C)', fahrenheit: 'Fahrenheit (°F)', kelvin: 'Kelvin (K)' };
  var NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

  /* ---------- Pure logic (also exported for tests) ---------- */

  function parseTemperature(raw) {
    var text = String(raw == null ? '' : raw).trim().replace(/\u2212/g, '-');
    if (text === '') {
      return { ok: false, error: 'Enter a temperature to convert.' };
    }
    // Accept a single decimal comma ("36,6") when no decimal point is used.
    if (text.indexOf('.') === -1 && (text.match(/,/g) || []).length === 1) {
      text = text.replace(',', '.');
    }
    if (!NUMBER_PATTERN.test(text)) {
      return { ok: false, error: '"' + String(raw).trim() + '" is not a number. Use digits only, for example 25, -4.5 or 0.' };
    }
    var value = Number(text);
    if (!isFinite(value)) {
      return { ok: false, error: 'That number is too large. Enter a smaller value.' };
    }
    return { ok: true, value: value };
  }

  function validateRange(value, unit) {
    if (value < ABSOLUTE_ZERO[unit]) {
      return {
        ok: false,
        error: 'Temperature cannot be below absolute zero (' + formatNumber(ABSOLUTE_ZERO[unit]) +
          ' ' + symbol(unit) + ') in ' + UNIT_NAMES[unit] + '.'
      };
    }
    return { ok: true };
  }

  function symbol(unit) {
    return unit === 'kelvin' ? 'K' : unit === 'celsius' ? '°C' : '°F';
  }

  function toCelsius(value, unit) {
    if (unit === 'fahrenheit') return (value - 32) * 5 / 9;
    if (unit === 'kelvin') return value - 273.15;
    return value;
  }

  function snap(n) {
    // Removes floating-point dust such as -2.8e-14 (e.g. -459.67 °F -> 0 K).
    return Math.abs(n) < 1e-9 ? 0 : n;
  }

  function convertAll(value, unit) {
    var c = toCelsius(value, unit);
    var result = {
      celsius: unit === 'celsius' ? value : snap(c),
      fahrenheit: unit === 'fahrenheit' ? value : snap(c * 9 / 5 + 32),
      kelvin: unit === 'kelvin' ? value : snap(c + 273.15)
    };
    return result;
  }

  function formatNumber(n) {
    var rounded = Number(n.toFixed(2));
    if (rounded === 0) rounded = 0; // turns -0 into 0
    return rounded.toLocaleString('en-US', { maximumFractionDigits: 2, useGrouping: false });
  }

  /* ---------- DOM wiring & Interactive Enhancements ---------- */

  function init() {
    var form = document.getElementById('converter-form');
    var input = document.getElementById('temperature');
    var unitSelect = document.getElementById('unit');
    var resetBtn = document.getElementById('reset-btn');
    var errorBox = document.getElementById('error-message');
    var swapBtn = document.getElementById('swap-unit-btn');
    var tempIndicator = document.getElementById('temp-indicator');
    var tempIndicatorFill = document.getElementById('temp-indicator-fill');
    var tempIndicatorLabel = document.getElementById('temp-indicator-label');

    var outputs = {
      celsius: document.getElementById('result-celsius'),
      fahrenheit: document.getElementById('result-fahrenheit'),
      kelvin: document.getElementById('result-kelvin')
    };

    var formulas = {
      celsius: document.getElementById('formula-celsius'),
      fahrenheit: document.getElementById('formula-fahrenheit'),
      kelvin: document.getElementById('formula-kelvin')
    };

    var presets = document.querySelectorAll('.preset-btn');
    var copyButtons = document.querySelectorAll('.btn-copy-card');

    function updateFormulas(unit) {
      if (unit === 'celsius') {
        if (formulas.celsius) formulas.celsius.textContent = 'Input value';
        if (formulas.fahrenheit) formulas.fahrenheit.textContent = '(°C × 9/5) + 32';
        if (formulas.kelvin) formulas.kelvin.textContent = '°C + 273.15';
      } else if (unit === 'fahrenheit') {
        if (formulas.celsius) formulas.celsius.textContent = '(°F − 32) × 5/9';
        if (formulas.fahrenheit) formulas.fahrenheit.textContent = 'Input value';
        if (formulas.kelvin) formulas.kelvin.textContent = '((°F − 32) × 5/9) + 273.15';
      } else {
        if (formulas.celsius) formulas.celsius.textContent = 'K − 273.15';
        if (formulas.fahrenheit) formulas.fahrenheit.textContent = '((K − 273.15) × 9/5) + 32';
        if (formulas.kelvin) formulas.kelvin.textContent = 'Input value';
      }
    }

    function updateIndicator(celsiusVal) {
      if (!tempIndicator) return;
      tempIndicator.hidden = false;

      // Map -20°C to 100°C onto 0% to 100%
      var clamped = Math.max(-20, Math.min(100, celsiusVal));
      var pct = ((clamped - (-20)) / (100 - (-20))) * 100;
      if (tempIndicatorFill) {
        tempIndicatorFill.style.width = pct + '%';
      }

      var desc = '';
      if (celsiusVal < 0) {
        desc = 'Freezing / Sub-zero (' + formatNumber(celsiusVal) + '°C)';
      } else if (celsiusVal < 18) {
        desc = 'Cool temperature (' + formatNumber(celsiusVal) + '°C)';
      } else if (celsiusVal <= 26) {
        desc = 'Comfortable room temperature (' + formatNumber(celsiusVal) + '°C)';
      } else if (celsiusVal <= 42) {
        desc = 'Warm / Human body temperature range (' + formatNumber(celsiusVal) + '°C)';
      } else {
        desc = 'High temperature / Boiling range (' + formatNumber(celsiusVal) + '°C)';
      }

      if (tempIndicatorLabel) {
        tempIndicatorLabel.textContent = desc;
      }
    }

    function clearResults() {
      Object.keys(outputs).forEach(function (k) {
        if (outputs[k]) outputs[k].textContent = '—';
      });
      if (tempIndicator) tempIndicator.hidden = true;
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.hidden = true;
      input.setAttribute('aria-invalid', 'false');
    }

    function showError(message) {
      clearResults();
      errorBox.textContent = message;
      errorBox.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    }

    function performConversion(isLive) {
      var raw = input.value;
      if (isLive && raw.trim() === '') {
        clearError();
        clearResults();
        return;
      }

      var unit = unitSelect.value;
      updateFormulas(unit);

      var parsed = parseTemperature(raw);
      if (!parsed.ok) {
        if (!isLive) {
          showError(parsed.error);
          input.focus();
        } else {
          clearResults();
        }
        return;
      }

      var range = validateRange(parsed.value, unit);
      if (!range.ok) {
        showError(range.error);
        if (!isLive) input.focus();
        return;
      }

      var results = convertAll(parsed.value, unit);
      var keys = Object.keys(results);
      for (var i = 0; i < keys.length; i++) {
        if (!isFinite(results[keys[i]])) {
          showError('That number is too large to convert. Enter a smaller value.');
          if (!isLive) input.focus();
          return;
        }
      }

      clearError();
      keys.forEach(function (k) {
        if (outputs[k]) outputs[k].textContent = formatNumber(results[k]);
      });

      updateIndicator(results.celsius);
    }

    function handleConvert(event) {
      event.preventDefault();
      performConversion(false);
    }

    function handleReset() {
      form.reset();
      unitSelect.value = 'celsius';
      updateFormulas('celsius');
      clearError();
      clearResults();
      input.focus();
    }

    var debounceTimer = null;
    function handleLiveInput() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        performConversion(true);
      }, 70);
    }

    form.addEventListener('submit', handleConvert);
    resetBtn.addEventListener('click', handleReset);
    input.addEventListener('input', handleLiveInput);
    unitSelect.addEventListener('change', function () {
      updateFormulas(unitSelect.value);
      if (input.value.trim() !== '') {
        performConversion(true);
      }
    });

    // Preset buttons
    presets.forEach(function (btn) {
      btn.addEventListener('click', function () {
        input.value = btn.dataset.val;
        unitSelect.value = btn.dataset.unit;
        performConversion(false);
      });
    });

    // Swap unit button (°C <-> °F)
    if (swapBtn) {
      swapBtn.addEventListener('click', function () {
        if (unitSelect.value === 'celsius') {
          unitSelect.value = 'fahrenheit';
        } else if (unitSelect.value === 'fahrenheit') {
          unitSelect.value = 'celsius';
        } else {
          unitSelect.value = 'celsius';
        }
        updateFormulas(unitSelect.value);
        if (input.value.trim() !== '') {
          performConversion(false);
        }
      });
    }

    // Copy result buttons
    copyButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.dataset.target;
        var targetEl = document.getElementById(targetId);
        if (!targetEl || targetEl.textContent === '—') return;

        var text = targetEl.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }

        btn.classList.add('copied');
        btn.title = 'Copied!';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.title = 'Copy value';
        }, 1800);
      });
    });

    // Initialize formulas
    updateFormulas(unitSelect.value);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      parseTemperature: parseTemperature,
      validateRange: validateRange,
      convertAll: convertAll,
      formatNumber: formatNumber
    };
  }
})();
