# Temperature Converter

A responsive temperature converter built with HTML5, CSS3 and vanilla JavaScript. Enter a value, pick its unit, and see Celsius, Fahrenheit and Kelvin at the same time. No frameworks, no build step, no dependencies.

## Features

- Numeric input with a unit dropdown (Celsius, Fahrenheit, Kelvin)
- **Convert** and **Reset** buttons; Enter also converts
- Three labelled result cards, always shown together
- No page reload (form `submit` is handled with `preventDefault()`)
- Handles negative, fractional and zero values; accepts `36,6` (decimal comma) and `−5` (Unicode minus)
- Validation with a visible, accessible message (`role="alert"`, `aria-invalid`, `aria-describedby`)
- Rejects empty input, non-numeric text (`abc`, `12abc`, `Infinity`), numbers too large to convert, and values below absolute zero
- Absolute-zero boundaries are accepted exactly: −273.15 °C, −459.67 °F, 0 K
- Results are cleared whenever input is invalid or edited, so stale results are never shown
- The error clears as soon as the user edits the input
- Results display up to 2 decimals (trailing zeros trimmed); calculations use full JavaScript precision
- Responsive layout (three cards on desktop, stacked on mobile), visible keyboard focus, reduced-motion support
- Uses `addEventListener` only: no inline `onclick`, no `eval()`

## Formulas

| Conversion | Formula |
|---|---|
| Celsius → Fahrenheit | F = (C × 9/5) + 32 |
| Fahrenheit → Celsius | C = (F − 32) × 5/9 |
| Celsius → Kelvin | K = C + 273.15 |
| Kelvin → Celsius | C = K − 273.15 |

The input is first converted to Celsius, then Celsius is converted to the other two units. The unit the user typed is returned unchanged (no round-trip error). Floating-point dust smaller than 1e-9 (e.g. −459.67 °F → 0 K) is snapped to 0.

## File structure

```
WebDev-L1-TemperatureConverter/
├── index.html      # Markup: form, error area, result cards
├── style.css       # Layout, theme, responsive rules
├── script.js       # Parsing, validation, conversion, DOM events
├── README.md
└── screenshots/    # Place your screenshots here
```

## Run locally

1. Download or clone the folder.
2. Open `index.html` in any modern browser (double-click it), **or** serve it:
   ```bash
   cd WebDev-L1-TemperatureConverter
   python3 -m http.server 8000
   ```
   then visit http://localhost:8000.

## Test cases

| Input | °C | °F | K |
|---|---|---|---|
| 0 °C | 0 | 32 | 273.15 |
| 100 °C | 100 | 212 | 373.15 |
| 32 °F | 0 | 32 | 273.15 |
| 273.15 K | 0 | 32 | 273.15 |
| −40 °C | −40 | −40 | 233.15 |
| 36.6 °C | 36.6 | 97.88 | 309.75 |
| −273.15 °C | −273.15 | −459.67 | 0 |
| −459.67 °F | −273.15 | −459.67 | 0 |
| 0 K | −273.15 | −459.67 | 0 |

Rejected: empty, `abc`, `12abc`, `1e999`, −273.16 °C, −459.68 °F, −0.01 K.

`script.js` exports its pure functions when loaded in Node (`parseTemperature`, `validateRange`, `convertAll`, `formatNumber`), so you can unit-test them without a browser.
