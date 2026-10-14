/**
 * ====================================================================
 * TASK 4: Professional Login Authentication System
 * OASIS INFOBYTE - Web Development Internship (Level 2 Task 4)
 * ====================================================================
 * File: dashboard.js
 * Description: Protected route guard, user profile renderer, active session
 *              timer, account stats, and secure logout controller.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Determine correct paths based on directory depth
  const isInHtmlFolder = window.location.pathname.replace(/\\/g, '/').includes('/html/');
  const loginUrl = isInHtmlFolder ? 'index.html' : 'index.html';

  // 1. Enforce Protected Route: Verify session and user existence
  const currentUser = window.AuthApp.requireAuth(loginUrl);
  if (!currentUser) {
    // If not authenticated, requireAuth already redirected to login
    return;
  }

  // 2. DOM Elements
  const welcomeUsernameEl = document.getElementById('welcome-username');
  const userGreetingEl = document.getElementById('user-greeting');
  const profileUserIdEl = document.getElementById('profile-user-id');
  const profileUsernameEl = document.getElementById('profile-username');
  const profileEmailEl = document.getElementById('profile-email');
  const profileCreatedEl = document.getElementById('profile-created');
  const sessionLoginTimeEl = document.getElementById('session-login-time');
  const sessionDurationEl = document.getElementById('session-duration');
  const totalUsersCountEl = document.getElementById('total-users-count');

  const logoutBtns = document.querySelectorAll('.action-logout-btn');
  const viewAuditBtn = document.getElementById('view-audit-btn');
  const auditModal = document.getElementById('audit-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const auditTableBody = document.getElementById('audit-table-body');
  const clearUsersDemoBtn = document.getElementById('clear-demo-btn');

  // Format Dates nicely
  function formatDate(isoString) {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  }

  // Populate User Information
  const welcomeHeroEl = document.getElementById('welcome-username-hero');
  if (welcomeHeroEl) welcomeHeroEl.textContent = currentUser.username;
  if (welcomeUsernameEl) welcomeUsernameEl.textContent = currentUser.username;
  if (userGreetingEl) {
    userGreetingEl.textContent = (currentUser.username || 'U').charAt(0).toUpperCase();
  }
  if (profileUserIdEl) profileUserIdEl.textContent = currentUser.id;
  if (profileUsernameEl) profileUsernameEl.textContent = currentUser.username;
  if (profileEmailEl) profileEmailEl.textContent = currentUser.email;
  if (profileCreatedEl) profileCreatedEl.textContent = formatDate(currentUser.createdAt);
  if (sessionLoginTimeEl) sessionLoginTimeEl.textContent = formatDate(currentUser.loginTime);

  // Update total registered users count
  const allUsers = window.AuthApp.getUsers();
  if (totalUsersCountEl) {
    totalUsersCountEl.textContent = allUsers.length.toString();
  }

  // Live Session Duration Timer
  const loginTimestamp = new Date(currentUser.loginTime).getTime();
  function updateSessionTimer() {
    if (!sessionDurationEl) return;
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - loginTimestamp) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    sessionDurationEl.textContent = `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }
  updateSessionTimer();
  const sessionTimerInterval = setInterval(updateSessionTimer, 1000);

  /**
   * Secure Logout Function
   * Clears sessionStorage and replaces browser history so user cannot navigate back
   */
  function handleLogout() {
    clearInterval(sessionTimerInterval);
    window.AuthApp.clearSession();
    window.location.replace(loginUrl);
  }

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  });

  /**
   * Security Audit Inspector (Demonstrates hashed passwords & salting)
   */
  if (viewAuditBtn && auditModal) {
    viewAuditBtn.addEventListener('click', () => {
      renderAuditTable();
      auditModal.classList.add('is-active');
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        auditModal.classList.remove('is-active');
      });
    }

    auditModal.addEventListener('click', (e) => {
      if (e.target === auditModal) {
        auditModal.classList.remove('is-active');
      }
    });
  }

  function renderAuditTable() {
    if (!auditTableBody) return;
    const users = window.AuthApp.getUsers();
    auditTableBody.innerHTML = '';

    if (users.length === 0) {
      auditTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No registered accounts found.</td></tr>`;
      return;
    }

    users.forEach((u, idx) => {
      const row = document.createElement('tr');
      const isCurrent = u.id === currentUser.id;
      row.className = isCurrent ? 'table-row-current' : '';

      // Truncate salt and hash for neat display while proving hashing
      const shortSalt = u.salt ? u.salt.substring(0, 10) + '...' : 'None';
      const shortHash = u.passwordHash ? u.passwordHash.substring(0, 16) + '...' : 'None';

      row.innerHTML = `
        <td><strong>#${idx + 1}</strong> ${isCurrent ? '<span class="badge-current">You</span>' : ''}</td>
        <td><code>${escapeHtml(u.username)}</code></td>
        <td><code>${escapeHtml(u.email)}</code></td>
        <td title="${u.salt}"><code>${shortSalt}</code></td>
        <td title="${u.passwordHash}"><code class="hash-tag">${shortHash}</code></td>
      `;
      auditTableBody.appendChild(row);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Clear demo data
  if (clearUsersDemoBtn) {
    clearUsersDemoBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all registered test accounts? You will be logged out.')) {
        localStorage.removeItem(window.AuthApp.STORAGE_KEY_USERS);
        handleLogout();
      }
    });
  }

});
