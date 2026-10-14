/**
 * NovaTech Enterprise Landing Page - Interactive Module
 * High performance Vanilla JavaScript:
 * - Responsive mobile navigation menu
 * - Hero live telemetry benchmark simulator
 * - Solutions category tab filtering
 * - Consultation demo request form handling
 * - Scrollspy active navigation & back to top button
 */

'use strict';

(function () {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (menuToggle && primaryNav) {
    function toggleMenu() {
      const isOpen = primaryNav.classList.contains('is-open');
      menuToggle.classList.toggle('is-active', !isOpen);
      primaryNav.classList.toggle('is-open', !isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    function closeMenu() {
      menuToggle.classList.remove('is-active');
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close on navigation link click
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // 2. Interactive Telemetry Benchmark Simulator
  const simulateBtn = document.getElementById('btn-simulate');
  const bars = document.querySelectorAll('#telemetry-bars i');
  const latencyEl = document.getElementById('metric-latency');
  const uptimeEl = document.getElementById('metric-uptime');
  const spendEl = document.getElementById('metric-spend');

  if (simulateBtn && bars.length > 0) {
    let isOptimized = false;

    simulateBtn.addEventListener('click', () => {
      isOptimized = !isOptimized;

      if (isOptimized) {
        // Set optimal bars
        const optimalHeights = ['75%', '88%', '92%', '96%', '94%', '98%', '99%'];
        bars.forEach((bar, idx) => {
          bar.style.height = optimalHeights[idx] || '90%';
        });
        if (latencyEl) latencyEl.textContent = '0.38 s';
        if (uptimeEl) uptimeEl.textContent = '99.999%';
        if (spendEl) spendEl.textContent = '−28%';
        simulateBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Cluster Optimized</span>
        `;
      } else {
        // Reset to original state
        const originalHeights = ['45%', '62%', '50%', '78%', '65%', '88%', '95%'];
        bars.forEach((bar, idx) => {
          bar.style.height = originalHeights[idx] || '60%';
        });
        if (latencyEl) latencyEl.textContent = '1.2 s';
        if (uptimeEl) uptimeEl.textContent = '99.99%';
        if (spendEl) spendEl.textContent = '−18%';
        simulateBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          <span>Simulate Optimization</span>
        `;
      }
    });
  }

  // 3. Solutions Domain Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const solutionCards = document.querySelectorAll('.solution-card');

  if (filterBtns.length > 0 && solutionCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        solutionCards.forEach((card) => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // 4. Demo Consultation Request Form Handling
  const demoForm = document.getElementById('demo-form');
  const nameInput = document.getElementById('demo-name');
  const emailInput = document.getElementById('demo-email');
  const feedbackEl = document.getElementById('demo-feedback');

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';

      if (!nameVal) {
        showFormMessage('Please enter your full name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        showFormMessage('Please enter a valid work email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      // Valid submission simulation
      showFormMessage(`Thank you, ${nameVal}! Your consultation request has been received. Our solutions team will reach out to ${emailVal} within one business day.`, 'success');
      demoForm.reset();
    });

    function showFormMessage(msg, type) {
      if (!feedbackEl) return;
      feedbackEl.textContent = msg;
      feedbackEl.className = `form-feedback ${type}`;
      feedbackEl.hidden = false;
    }
  }

  // 5. Scrollspy Navigation & Back to Top Floating Button
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('main section[id]');
  const mainNavAnchors = document.querySelectorAll('.nav-list a[href^="#"]');

  let isTicking = false;
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;

        // Toggle back to top
        if (backToTopBtn) {
          if (scrollPos > 400) {
            backToTopBtn.classList.add('is-visible');
          } else {
            backToTopBtn.classList.remove('is-visible');
          }
        }

        // Active link scrollspy
        let currentSectionId = '';
        sections.forEach((sec) => {
          const top = sec.offsetTop - 120;
          const height = sec.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSectionId = sec.getAttribute('id');
          }
        });

        if (currentSectionId) {
          mainNavAnchors.forEach((a) => {
            if (a.getAttribute('href') === `#${currentSectionId}`) {
              a.classList.add('is-active');
            } else {
              a.classList.remove('is-active');
            }
          });
        }

        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

