# Oasis Infobyte Web Development Internship (OIBSIP)
## Level 2 &mdash; Task 4: Professional Login Authentication System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Web_Crypto_API](https://img.shields.io/badge/Web_Crypto_API-SHA--256-0ea5e9)

---

## 📋 Project Overview

This project is a modern, responsive, client-side **Login Authentication System** designed for **Oasis Infobyte Web Development Internship (Task 4 - Level 2)**. It features an executive Microsoft-inspired interface with a dark navy aesthetic, crisp typography, electric-blue accents, and fluid responsiveness.

The application implements a full authentication workflow including **new user registration**, **real-time input validation**, **password strength evaluation**, **Web Crypto API SHA-256 hashing with cryptographic salting**, **session validation via sessionStorage**, **protected route enforcement for the dashboard**, and **instant session termination (logout)**.

---

## ✨ Key Features

- **Executive Microsoft-Inspired Design**: Clean dark navy palette (`#070d18` / `#0e1726`), electric-blue accents (`#2563eb`, `#38bdf8`), subtle tech background, and crisp Segoe UI typography.
- **Client-Side Hashing & Salting**:
  - Web Crypto API (`crypto.subtle.digest`) SHA-256 hashing.
  - 128-bit random cryptographic salt per user (`crypto.getRandomValues`) preventing rainbow table attacks.
  - **Zero plain-text passwords stored** anywhere in the browser.
- **Robust Real-Time Form Validation**:
  - Trims white-space from username and email.
  - RFC 5322 compliant email regex validation.
  - Password length enforcement (&ge; 8 characters) and numeric requirement (&ge; 1 digit).
  - Dynamic password strength meter (Weak, Fair, Good, Strong, Very Strong).
  - Case-insensitive duplicate checking for usernames and emails.
  - Real-time error clearance as the user types.
- **Unified Security & Generic Error Responses**:
  - Never reveals whether username or password was incorrect during login, mitigating user enumeration / credential harvesting.
- **Password Visibility Toggles**: Accessible, SVG-driven show/hide controls for password and confirmation fields.
- **Guarded Protected Dashboard**:
  - Intercepts unauthenticated page loads and immediately redirects to login.
  - Validates session integrity against the user database in `localStorage`.
  - Displays user profile, registration timestamp, active session duration counter, and storage statistics.
- **Interactive Security Audit Log**:
  - Built-in modal allowing developers and evaluators to inspect stored salts and SHA-256 hashes without revealing plain-text credentials.
- **Fully Responsive**: Optimized for mobile (320px+), tablet, and desktop viewports.
- **Zero External Dependencies**: Pure HTML5, CSS3, and vanilla ES6+ JavaScript. No React, Bootstrap, or jQuery.

---

## 📁 Folder Structure

```
WevDev-L2-Login-Authentication-System/
├── index.html                   # Primary Login entry page (root)
├── register.html                # User Registration page (root)
├── dashboard.html               # Protected Dashboard page (root)
├── html/                        # Dedicated HTML directory
│   ├── index.html               # Login page inside html folder
│   ├── login.html               # Explicit login alias
│   ├── register.html            # Registration page
│   └── dashboard.html           # Protected Dashboard page
├── css/
│   └── style.css                # Microsoft-inspired styles & responsive media queries
├── javascript/                  # Dedicated JavaScript directory
│   ├── auth.js                  # Cryptography, storage, validation, session utilities
│   ├── login.js                 # Login controller & generic error handler
│   ├── register.js              # Registration controller & live validation
│   └── dashboard.js             # Route protection guard & session inspector
├── js/                          # Synced js directory mirror
│   ├── auth.js
│   ├── login.js
│   ├── register.js
│   └── dashboard.js
├── screenshots/
│   └── add-project-screenshots-here.txt
└── README.md                    # Project documentation
```

---

## 🚀 How to Run the Project

The Web Crypto API requires a **Secure Context** (`https://`, `localhost`, `127.0.0.1`, or supported modern browser `file://` protocols). To guarantee complete functionality across all browser security models, we recommend running with a local development server:

### Option 1: VS Code Live Server (Recommended)
1. Open the `WevDev-L2-Login-Authentication-System` directory in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The application will open at `http://127.0.0.1:5500/index.html`.

### Option 2: Python Built-in HTTP Server
If Python is installed on your computer:
```bash
# Navigate to the project directory
cd WevDev-L2-Login-Authentication-System

# Start local server (Python 3)
python -m http.server 8000
```
Open your browser and navigate to: `http://localhost:8000`

### Option 3: Direct Browser File Launch
Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, or Mozilla Firefox. Modern versions of Chromium support `crypto.subtle` on `file:///` URLs as well.

---

## 🔐 Deep Dive: Cryptography & Session Management

### 1. Cryptographic Salting & SHA-256 Hashing
A major security flaw in naive authentication demonstrations is storing passwords in plain text or using unsalted SHA-256 hashes (which are vulnerable to precomputed rainbow table lookups). 

In this application:
1. When a user registers, `crypto.getRandomValues(new Uint8Array(16))` generates a **128-bit cryptographically secure pseudorandom salt**.
2. The salt and password are concatenated (`${salt}:${password}`) and converted to an `ArrayBuffer` via `TextEncoder`.
3. The browser's native `crypto.subtle.digest('SHA-256', buffer)` computes the cryptographic digest.
4. The resulting 64-character hexadecimal string is stored alongside the salt in `localStorage`.
5. When authenticating, the system retrieves the specific user's salt, recomputes the hash of the input, and verifies equality.
6. Neither passwords nor password hashes are ever logged to the browser developer console.

### 2. Session Management
- **Storage Scope**: The active login state is stored in `sessionStorage` under the key `oibsip_auth_session`.
- **Tab Isolation**: `sessionStorage` is isolated to the current tab, meaning closing the tab terminates the active session.
- **Route Guard**: When `dashboard.html` loads, `AuthApp.requireAuth()` executes synchronously before user content renders. If the session key is missing, or if the stored user ID no longer exists in `localStorage`, the user is immediately redirected to `index.html` using `window.location.replace()` so that the back-button cannot navigate to private views.

---

## ⚠️ Architectural Security Limitations (Front-End Notice)

> [!IMPORTANT]
> **Client-Side vs. Production Security**
> This application is an educational demonstration designed to showcase front-end authentication architecture, DOM manipulation, state management, and modern Web Crypto API usage.
>
> In real-world enterprise applications:
> 1. **Client-Side Route Protection is Bypassable**: Any user who has access to browser DevTools can manipulate JavaScript memory or bypass client-side guards.
> 2. **LocalStorage is Accessible to Scripts**: Data in `localStorage` can be accessed by scripts running on the same origin (XSS vulnerability).
> 3. **Password Hashing Belongs on the Server**: Production systems must transmit passwords over HTTPS to an authenticated server backend and hash them using slow, memory-hard key-derivation functions such as **Argon2id**, **bcrypt**, or **scrypt** with work factors tuned to resist GPU-based brute-force attacks.
> 4. **HttpOnly Cookies**: Production sessions should be managed via server-issued `HttpOnly`, `Secure`, `SameSite=Strict` session cookies that cannot be read or stolen by front-end JavaScript.

---

## ✅ Comprehensive Testing Checklist

All requirements have been rigorously tested:

| # | Test Scenario | Expected Outcome | Result |
|---|---|---|---|
| 1 | Register new user with valid details | Account created, redirected to login | **PASS** |
| 2 | Reject empty registration fields | Inline validation errors with aria alerts | **PASS** |
| 3 | Reject passwords shorter than 8 characters | Warning shown: "Password must be at least 8 characters long." | **PASS** |
| 4 | Reject passwords without a number | Warning shown: "Password must contain at least one number." | **PASS** |
| 5 | Reject mismatched confirmation passwords | Field marked invalid: "Passwords do not match." | **PASS** |
| 6 | Reject duplicate usernames & emails | Case-insensitive rejection with error banner | **PASS** |
| 7 | Confirm stored user records contain hashes | Verified in LocalStorage Audit: 128-bit salt & SHA-256 hash | **PASS** |
| 8 | Log in successfully using username | Authenticated & redirected to dashboard | **PASS** |
| 9 | Log in successfully using email | Authenticated & redirected to dashboard | **PASS** |
| 10 | Reject incorrect credentials | Generic message: "Invalid username/email or password." | **PASS** |
| 11 | Direct navigation to `dashboard.html` without session | Intercepted & immediately redirected to `index.html` | **PASS** |
| 12 | Display correct username on dashboard | Dynamic header & profile cards show logged-in user | **PASS** |
| 13 | Log out & clear current session | `sessionStorage` cleared, redirected to login | **PASS** |
| 14 | Post-logout browser back button test | Back navigation cannot re-enter protected dashboard | **PASS** |
| 15 | Responsive layout test | Tested on Mobile (375px), Tablet (768px), Desktop (1280px+) | **PASS** |

---

## 📸 Screenshots

To showcase your project submission, place your screenshots in the `screenshots/` directory:
- `screenshots/01-login-page.png`
- `screenshots/02-registration-page.png`
- `screenshots/03-protected-dashboard.png`
- `screenshots/04-audit-log-modal.png`

---

## 👨‍💻 Submission Details
- **Organization**: Oasis Infobyte
- **Program**: Web Development Internship (OIBSIP)
- **Track**: Level 2
- **Task**: Task 4 &mdash; Login Authentication System
- **Repository Folder**: `OIBSIP/Web Development-Level 2-Task 4-Login Authentication System/`
