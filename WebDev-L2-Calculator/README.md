# Smart Calculator

A responsive calculator built with vanilla HTML5, CSS3 and JavaScript. No dependencies, no build step, no `eval()` or `new Function()`.

## Run locally
1. Download or clone the `WebDev-L2-Calculator` folder.
2. Open `index.html` in any modern browser (double-click it).
3. Optional local server: `python3 -m http.server 8000`, then visit http://localhost:8000.

## Features
- Digits 0–9, decimal point, `+ − × ÷`, equals, clear (C) and backspace (⌫).
- Correct precedence: `5 + 3 × 2 = 11`. Equal-precedence operators run left to right.
- Expression line plus a live result line; negative and decimal results (`0.1 + 0.2 = 0.3`).
- Input guards: one decimal point per number, no leading zeros, consecutive operators are replaced, a lone leading `−` is allowed.
- `Cannot divide by zero` / `Invalid expression` messages; press C (or ⌫) to recover.
- Keyboard: `0-9 . + - * / x Enter = Backspace Esc Delete`.
- Accessible: button labels, `aria-live` result, visible focus ring, reduced-motion support.

## How it works (`script.js`)
1. **Engine**: `tokenize` and `evaluate` (recursive descent: sum → term → factor).
2. **State**: `reduce(state, action, value)` is a pure function that returns the next state.
3. **View model**: `getView(state)` turns state into display strings.
4. **UI**: `initUI()` attaches listeners with `addEventListener` and renders.

## Testing
The engine can run in Node without a browser:

```bash
node -e "const c=require('./script.js'); console.log(c.evaluate('5+3*2'))"   # 11
```

Manual checks: `5+3×2=` → 11, `8÷0=` → error message, `C` → resets, `1.2.3` → `1.23`.
