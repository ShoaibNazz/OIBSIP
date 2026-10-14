/**
 * ====================================================================
 * TASK 4: Professional Login Authentication System
 * OASIS INFOBYTE - Web Development Internship (Level 2 Task 4)
 * ====================================================================
 * File: login.js
 * Description: Client-side login controller with generic error responses,
 *              session initialization, loading state, and redirection.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper to determine relative links whether inside /html/ or at root
  const isInHtmlFolder = window.location.pathname.replace(/\\/g, '/').includes('/html/');
  const dashboardUrl = isInHtmlFolder ? 'dashboard.html' : 'dashboard.html';

  // 1. Redirect if already authenticated
  window.AuthApp.redirectIfAuthenticated(dashboardUrl);

  // 2. DOM Elements
  const form = document.getElementById('login-form');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('login-submit-btn');
  const togglePasswordBtn = document.getElementById('toggle-password');

  // Setup password toggle
  window.AuthApp.setupPasswordToggle(passwordInput, togglePasswordBtn);

  /**
   * Inline Field Error Display Helpers
   */
  function setFieldError(inputEl, message) {
    const group = inputEl.closest('.form-group');
    if (!group) return;

    group.classList.add('has-error');
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

  // Clear errors when typing
  identifierInput.addEventListener('input', () => {
    clearFieldError(identifierInput);
    window.AuthApp.Alert.clear('alert-container');
  });

  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordInput);
    window.AuthApp.Alert.clear('alert-container');
  });

  /**
   * Form Submission
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    window.AuthApp.Alert.clear('alert-container');
    let hasError = false;
    let firstErrorField = null;

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    if (!identifier) {
      setFieldError(identifierInput, 'Please enter your username or email address.');
      hasError = true;
      if (!firstErrorField) firstErrorField = identifierInput;
    } else {
      clearFieldError(identifierInput);
    }

    if (!password) {
      setFieldError(passwordInput, 'Please enter your password.');
      hasError = true;
      if (!firstErrorField) firstErrorField = passwordInput;
    } else {
      clearFieldError(passwordInput);
    }

    if (hasError) {
      window.AuthApp.Alert.show('Please complete all required fields.', 'error');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Disable button to prevent duplicate submissions
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="spinner" aria-hidden="true"></span>
      <span>Authenticating...</span>
    `;

    try {
      // Authenticate via Web Crypto API hash comparison
      const result = await window.AuthApp.authenticate(identifier, password);

      if (!result.success) {
        // Requirement: Always show generic error message
        window.AuthApp.Alert.show(result.message, 'error');
        passwordInput.value = '';
        passwordInput.focus();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }

      // Success: session is set in sessionStorage
      window.AuthApp.Alert.show('Authentication successful! Loading dashboard...', 'success');

      setTimeout(() => {
        window.location.replace(dashboardUrl);
      }, 800);

    } catch (err) {
      console.error('[Login Error]', err);
      window.AuthApp.Alert.show(
        'An error occurred during authentication. Please check your browser compatibility.',
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
