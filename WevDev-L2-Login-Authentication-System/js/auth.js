/**
 * ====================================================================
 * TASK 4: Professional Login Authentication System
 * OASIS INFOBYTE - Web Development Internship (Level 2 Task 4)
 * ====================================================================
 * File: auth.js
 * Description: Core authentication, cryptography (Web Crypto API SHA-256),
 *              session state, validation helpers, and storage management.
 * ====================================================================
 */

(function (window) {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_USERS = 'oibsip_auth_users';
  const STORAGE_KEY_SESSION = 'oibsip_auth_session';

  /**
   * Helper: Convert ArrayBuffer to Hex String
   * @param {ArrayBuffer} buffer
   * @returns {string}
   */
  function bufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
      hexString += byteArray[i].toString(16).padStart(2, '0');
    }
    return hexString;
  }

  /**
   * Cryptographic Salt Generator
   * Generates a cryptographically strong 128-bit (16 bytes) random salt.
   * @param {number} [byteLength=16]
   * @returns {string} Hex representation of the salt
   */
  function generateSalt(byteLength = 16) {
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw new Error('Web Crypto API (getRandomValues) is required but not supported.');
    }
    const saltBytes = new Uint8Array(byteLength);
    window.crypto.getRandomValues(saltBytes);
    return bufferToHex(saltBytes);
  }

  /**
   * SHA-256 Password Hash with Salt
   * Uses the native browser Web Crypto API (crypto.subtle.digest).
   * Note: We hash (salt + ":" + password) using SHA-256.
   * 
   * @param {string} password - Raw password entered by user
   * @param {string} salt - Cryptographic salt (hex string)
   * @returns {Promise<string>} Hex representation of SHA-256 hash
   */
  async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error(
        'Web Crypto API (subtle.digest) is unavailable. ' +
        'Please run via localhost or HTTPS to ensure a secure browser context.'
      );
    }
    const encoder = new TextEncoder();
    const dataToHash = encoder.encode(`${salt}:${password}`);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataToHash);
    return bufferToHex(hashBuffer);
  }

  /**
   * Safe localStorage Reader
   * Gracefully parses JSON without throwing errors if data is corrupted.
   * @returns {Array<Object>} List of registered users
   */
  function getUsers() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_USERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[Auth] Corrupted users data detected in localStorage. Resetting.', err);
      try {
        window.localStorage.removeItem(STORAGE_KEY_USERS);
      } catch (e) { /* ignore */ }
      return [];
    }
  }

  /**
   * Safe localStorage Writer
   * @param {Array<Object>} users
   */
  function saveUsers(users) {
    try {
      window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (err) {
      console.error('[Auth] Failed to save users to localStorage:', err);
      throw new Error('Storage limit exceeded or write error occurred.');
    }
  }

  /**
   * Check if a username is already taken (case-insensitive)
   * @param {string} username
   * @returns {boolean}
   */
  function isUsernameTaken(username) {
    const clean = (username || '').trim().toLowerCase();
    if (!clean) return false;
    const users = getUsers();
    return users.some(u => (u.username || '').toLowerCase() === clean);
  }

  /**
   * Check if an email address is already taken (case-insensitive)
   * @param {string} email
   * @returns {boolean}
   */
  function isEmailTaken(email) {
    const clean = (email || '').trim().toLowerCase();
    if (!clean) return false;
    const users = getUsers();
    return users.some(u => (u.email || '').toLowerCase() === clean);
  }

  /**
   * Find a user by either username or email (case-insensitive)
   * @param {string} identifier - Username or Email
   * @returns {Object|null}
   */
  function findUserByIdentifier(identifier) {
    const clean = (identifier || '').trim().toLowerCase();
    if (!clean) return null;
    const users = getUsers();
    return users.find(u => 
      (u.username || '').toLowerCase() === clean || 
      (u.email || '').toLowerCase() === clean
    ) || null;
  }

  /**
   * Register a new user
   * @param {Object} params
   * @param {string} params.username
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{success: boolean, message: string, user?: Object}>}
   */
  async function registerUser({ username, email, password }) {
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check duplicate username
    if (isUsernameTaken(cleanUsername)) {
      return { success: false, message: 'This username is already taken. Please choose another.' };
    }

    // Check duplicate email
    if (isEmailTaken(cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Generate unique salt and compute SHA-256 hash
    const salt = generateSalt(16);
    const passwordHash = await hashPassword(password, salt);

    // Create new user record
    const newUser = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: passwordHash,
      salt: salt,
      createdAt: new Date().toISOString()
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    };
  }

  /**
   * Authenticate a user with username/email and password
   * @param {string} identifier - Username or Email
   * @param {string} password - Raw password
   * @returns {Promise<{success: boolean, message: string, session?: Object}>}
   */
  async function authenticate(identifier, password) {
    const user = findUserByIdentifier(identifier);

    // Security practice: Constant generic failure to avoid user enumeration
    const genericErrorMsg = 'Invalid username/email or password.';

    if (!user || !user.passwordHash || !user.salt) {
      // Run dummy hash calculation to balance response timing
      try {
        await hashPassword(password || 'dummy', '00000000000000000000000000000000');
      } catch (e) { /* ignore */ }
      return { success: false, message: genericErrorMsg };
    }

    // Hash the entered password with the user's specific salt
    const computedHash = await hashPassword(password, user.salt);

    // Compare computed hash with stored hash
    if (computedHash !== user.passwordHash) {
      return { success: false, message: genericErrorMsg };
    }

    // Create session in sessionStorage
    const sessionData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      loginTime: new Date().toISOString()
    };

    setSession(sessionData);

    return {
      success: true,
      message: 'Login successful. Redirecting to dashboard...',
      session: sessionData
    };
  }

  /**
   * Session Management: Get Current Active Session
   * @returns {Object|null}
   */
  function getSession() {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userId && parsed.username) {
        return parsed;
      }
      return null;
    } catch (err) {
      console.warn('[Auth] Corrupted session detected. Clearing.', err);
      clearSession();
      return null;
    }
  }

  /**
   * Session Management: Store Session
   * @param {Object} sessionData
   */
  function setSession(sessionData) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    } catch (err) {
      console.error('[Auth] Failed to set session in sessionStorage:', err);
    }
  }

  /**
   * Session Management: Clear / Destroy Session
   */
  function clearSession() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (err) {
      console.error('[Auth] Failed to clear session:', err);
    }
  }

  /**
   * Verify session integrity: checks if the session exists AND corresponds
   * to a real, valid user registered in localStorage.
   * @returns {Object|null} The verified user profile or null
   */
  function getVerifiedUser() {
    const session = getSession();
    if (!session) return null;

    const users = getUsers();
    const matchedUser = users.find(u => u.id === session.userId);

    if (!matchedUser) {
      // User was deleted or modified in localStorage; invalidate session
      clearSession();
      return null;
    }

    return {
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
      createdAt: matchedUser.createdAt,
      loginTime: session.loginTime
    };
  }

  /**
   * Route Guard: Protects private pages like dashboard.html.
   * If user has no valid session, redirects to login.
   * @param {string} [redirectTarget='index.html']
   * @returns {Object|null} verified user
   */
  function requireAuth(redirectTarget = 'index.html') {
    const user = getVerifiedUser();
    if (!user) {
      // Use replace so browser back-button doesn't trap the user
      window.location.replace(redirectTarget);
      return null;
    }
    return user;
  }

  /**
   * Route Guard: Prevents logged-in users from accessing Login / Register.
   * If already logged in, redirects directly to dashboard.
   * @param {string} [redirectTarget='dashboard.html']
   */
  function redirectIfAuthenticated(redirectTarget = 'dashboard.html') {
    const user = getVerifiedUser();
    if (user) {
      window.location.replace(redirectTarget);
    }
  }

  /**
   * Input Validation Helpers
   */
  const Validator = {
    /**
     * Standard RFC 5322 compatible email pattern
     */
    isValidEmail(email) {
      if (!email || typeof email !== 'string') return false;
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return re.test(email.trim());
    },

    /**
     * Username format rules: 3-20 characters, alphanumeric, underscores, hyphens
     */
    isValidUsername(username) {
      if (!username || typeof username !== 'string') return false;
      const clean = username.trim();
      const re = /^[a-zA-Z0-9_-]{3,20}$/;
      return re.test(clean);
    },

    /**
     * Password requirements:
     * - Minimum 8 characters
     * - Must contain at least one number
     */
    checkPassword(password) {
      if (!password || typeof password !== 'string') {
        return {
          isValid: false,
          hasLength: false,
          hasNumber: false,
          errors: ['Password is required.']
        };
      }

      const hasLength = password.length >= 8;
      const hasNumber = /\d/.test(password);
      const errors = [];

      if (!hasLength) {
        errors.push('Password must be at least 8 characters long.');
      }
      if (!hasNumber) {
        errors.push('Password must contain at least one number (0-9).');
      }

      return {
        isValid: hasLength && hasNumber,
        hasLength,
        hasNumber,
        errors
      };
    },

    /**
     * Compute password strength score (0 to 4) for UI meter
     */
    evaluateStrength(password) {
      if (!password) return { score: 0, label: 'None', colorClass: 'strength-none' };
      let score = 0;
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/\d/.test(password)) score++;
      if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      // Cap at 4
      const finalScore = Math.min(score, 4);
      const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
      const classes = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong', 'strength-verystrong'];

      return {
        score: finalScore,
        label: labels[finalScore] || 'Weak',
        colorClass: classes[finalScore] || 'strength-weak'
      };
    }
  };

  /**
   * Password Visibility Toggle Helper
   * Toggles an input between 'password' and 'text' and updates SVG icon
   * @param {HTMLInputElement} inputEl
   * @param {HTMLButtonElement} toggleBtn
   */
  function setupPasswordToggle(inputEl, toggleBtn) {
    if (!inputEl || !toggleBtn) return;

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const isPassword = inputEl.type === 'password';
      inputEl.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      toggleBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

      // Update icon SVG
      const eyeOpenSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-eye">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      `;
      const eyeSlashSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-eye-slash">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
      `;

      toggleBtn.innerHTML = isPassword ? eyeSlashSvg : eyeOpenSvg;
    });
  }

  /**
   * UI Toast / Banner Alert System
   * Displays non-blocking, accessible alerts with modern slide animation.
   */
  const Alert = {
    show(message, type = 'info', containerId = 'alert-container', autoDismissMs = 6000) {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = ''; // Clear previous

      const alertEl = document.createElement('div');
      alertEl.className = `alert-box alert-${type}`;
      alertEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
      alertEl.setAttribute('aria-live', 'polite');

      const icons = {
        success: `<svg class="alert-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        error: `<svg class="alert-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        info: `<svg class="alert-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
      };

      alertEl.innerHTML = `
        <div class="alert-content">
          ${icons[type] || icons.info}
          <span class="alert-message">${message}</span>
        </div>
        <button type="button" class="alert-close-btn" aria-label="Dismiss message">&times;</button>
      `;

      container.appendChild(alertEl);

      const closeBtn = alertEl.querySelector('.alert-close-btn');
      closeBtn.addEventListener('click', () => {
        alertEl.classList.add('alert-fade-out');
        setTimeout(() => alertEl.remove(), 250);
      });

      if (autoDismissMs > 0) {
        setTimeout(() => {
          if (alertEl.parentNode) {
            alertEl.classList.add('alert-fade-out');
            setTimeout(() => alertEl.remove(), 250);
          }
        }, autoDismissMs);
      }
    },

    clear(containerId = 'alert-container') {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
    }
  };

  // Expose Auth module on global window
  window.AuthApp = {
    STORAGE_KEY_USERS,
    STORAGE_KEY_SESSION,
    generateSalt,
    hashPassword,
    getUsers,
    saveUsers,
    isUsernameTaken,
    isEmailTaken,
    findUserByIdentifier,
    registerUser,
    authenticate,
    getSession,
    setSession,
    clearSession,
    getVerifiedUser,
    requireAuth,
    redirectIfAuthenticated,
    Validator,
    setupPasswordToggle,
    Alert
  };

})(window);
