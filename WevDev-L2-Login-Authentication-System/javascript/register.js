/**
 * ====================================================================
 * TASK 4: Professional Login Authentication System
 * OASIS INFOBYTE - Web Development Internship (Level 2 Task 4)
 * ====================================================================
 * File: register.js
 * Description: Client-side registration controller with real-time validation,
 *              password strength meter, accessibility, and error clearing.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper to determine relative links whether inside /html/ or at root
  const isInHtmlFolder = window.location.pathname.replace(/\\/g, '/').includes('/html/');
  const loginUrl = isInHtmlFolder ? 'index.html' : 'index.html';
  const dashboardUrl = isInHtmlFolder ? 'dashboard.html' : 'dashboard.html';

  // 1. Redirect if already authenticated
  window.AuthApp.redirectIfAuthenticated(dashboardUrl);

  // 2. DOM Elements
  const form = document.getElementById('register-form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const submitBtn = document.getElementById('register-submit-btn');

  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

  const strengthBar = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');

  // Setup password toggles
  window.AuthApp.setupPasswordToggle(passwordInput, togglePasswordBtn);
  window.AuthApp.setupPasswordToggle(confirmPasswordInput, toggleConfirmPasswordBtn);

  /**
   * Inline Field Error Display Helpers
   */
  function setFieldError(inputEl, message) {
    const group = inputEl.closest('.form-group');
    if (!group) return;

    group.classList.add('has-error');
    group.classList.remove('has-success');
    inputEl.setAttribute('aria-invalid', 'true');

    let errorEl = group.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      errorEl.setAttribute('role', 'alert');
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(inputEl) {
    const group = inputEl.closest('.form-group');
    if (!group) return;

    group.classList.remove('has-error');
    inputEl.removeAttribute('aria-invalid');

    const errorEl = group.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  function setFieldSuccess(inputEl) {
    const group = inputEl.closest('.form-group');
    if (!group) return;

    group.classList.remove('has-error');
    group.classList.add('has-success');
    inputEl.removeAttribute('aria-invalid');

    const errorEl = group.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /**
   * Password Strength Meter Updater
   */
  function updatePasswordStrength() {
    const val = passwordInput.value;
    if (!val) {
      strengthBar.className = 'strength-bar strength-none';
      strengthBar.style.width = '0%';
      strengthText.textContent = '';
      return;
    }

    const { score, label } = window.AuthApp.Validator.evaluateStrength(val);
    const widths = ['20%', '40%', '65%', '85%', '100%'];
    const classNames = ['weak', 'fair', 'good', 'strong', 'verystrong'];

    strengthBar.className = `strength-bar strength-${classNames[score]}`;
    strengthBar.style.width = widths[score];
    strengthText.textContent = `Strength: ${label}`;
    strengthText.className = `strength-text text-${classNames[score]}`;
  }

  // Real-time error clearing and validation feedback
  usernameInput.addEventListener('input', () => {
    clearFieldError(usernameInput);
    window.AuthApp.Alert.clear('alert-container');
  });

  emailInput.addEventListener('input', () => {
    clearFieldError(emailInput);
    window.AuthApp.Alert.clear('alert-container');
  });

  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordInput);
    updatePasswordStrength();
    if (confirmPasswordInput.value) {
      if (confirmPasswordInput.value !== passwordInput.value) {
        setFieldError(confirmPasswordInput, 'Passwords do not match.');
      } else {
        setFieldSuccess(confirmPasswordInput);
      }
    }
  });

  confirmPasswordInput.addEventListener('input', () => {
    clearFieldError(confirmPasswordInput);
    if (confirmPasswordInput.value && confirmPasswordInput.value === passwordInput.value) {
      setFieldSuccess(confirmPasswordInput);
    }
  });

  /**
   * Form Submission Handler
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous banners & errors
    window.AuthApp.Alert.clear('alert-container');
    let hasError = false;
    let firstErrorField = null;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 1. Validate Username
    if (!username) {
      setFieldError(usernameInput, 'Username is required.');
      hasError = true;
      if (!firstErrorField) firstErrorField = usernameInput;
    } else if (username.length < 3) {
      setFieldError(usernameInput, 'Username must be at least 3 characters.');
      hasError = true;
      if (!firstErrorField) firstErrorField = usernameInput;
    } else if (!window.AuthApp.Validator.isValidUsername(username)) {
      setFieldError(usernameInput, 'Username can only contain letters, numbers, hyphens, and underscores.');
      hasError = true;
      if (!firstErrorField) firstErrorField = usernameInput;
    } else {
      setFieldSuccess(usernameInput);
    }

    // 2. Validate Email
    if (!email) {
      setFieldError(emailInput, 'Email address is required.');
      hasError = true;
      if (!firstErrorField) firstErrorField = emailInput;
    } else if (!window.AuthApp.Validator.isValidEmail(email)) {
      setFieldError(emailInput, 'Please enter a valid email address (e.g. name@domain.com).');
      hasError = true;
      if (!firstErrorField) firstErrorField = emailInput;
    } else {
      setFieldSuccess(emailInput);
    }

    // 3. Validate Password
    const passwordCheck = window.AuthApp.Validator.checkPassword(password);
    if (!password) {
      setFieldError(passwordInput, 'Password is required.');
      hasError = true;
      if (!firstErrorField) firstErrorField = passwordInput;
    } else if (!passwordCheck.isValid) {
      setFieldError(passwordInput, passwordCheck.errors.join(' '));
      hasError = true;
      if (!firstErrorField) firstErrorField = passwordInput;
    } else {
      setFieldSuccess(passwordInput);
    }

    // 4. Validate Confirm Password
    if (!confirmPassword) {
      setFieldError(confirmPasswordInput, 'Please confirm your password.');
      hasError = true;
      if (!firstErrorField) firstErrorField = confirmPasswordInput;
    } else if (confirmPassword !== password) {
      setFieldError(confirmPasswordInput, 'Passwords do not match.');
      hasError = true;
      if (!firstErrorField) firstErrorField = confirmPasswordInput;
    } else {
      setFieldSuccess(confirmPasswordInput);
    }

    if (hasError) {
      window.AuthApp.Alert.show('Please fix the errors in the form before submitting.', 'error');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Disable button to prevent duplicate submissions
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="spinner" aria-hidden="true"></span>
      <span>Creating Account...</span>
    `;

    try {
      // Register with cryptographic salt & SHA-256 hash
      const result = await window.AuthApp.registerUser({
        username,
        email,
        password
      });

      if (!result.success) {
        window.AuthApp.Alert.show(result.message, 'error');
        // Highlight field if duplicate
        if (result.message.toLowerCase().includes('username')) {
          setFieldError(usernameInput, result.message);
          usernameInput.focus();
        } else if (result.message.toLowerCase().includes('email')) {
          setFieldError(emailInput, result.message);
          emailInput.focus();
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }

      // Success
      window.AuthApp.Alert.show('Account created successfully! Redirecting to login...', 'success');
      form.reset();
      updatePasswordStrength();

      // Clear success classes
      [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearFieldError);

      setTimeout(() => {
        window.location.href = loginUrl;
      }, 1500);

    } catch (err) {
      console.error('[Registration Error]', err);
      window.AuthApp.Alert.show(
        err.message || 'An unexpected error occurred during registration. Please try again.',
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
