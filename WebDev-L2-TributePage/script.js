/**
 * Tribute to Abdul Sattar Edhi - Interactive Enhancements
 * High-performance, lightweight Vanilla JavaScript for:
 * - Reading progress indicator
 * - Active scrollspy navigation
 * - Back to top floating button
 * - Quote copy to clipboard
 */

'use strict';

(function () {
  const progressBar = document.getElementById('reading-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');
  const quoteText = document.getElementById('tribute-quote');
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = document.querySelectorAll('main section[id]');

  let ticking = false;

  // 1. Reading Progress & Back to Top Toggle
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
          progressBar.style.width = `${progress}%`;
          progressBar.setAttribute('aria-valuenow', Math.round(progress));
        }

        if (backToTopBtn) {
          if (scrollTop > 450) {
            backToTopBtn.classList.add('is-visible');
          } else {
            backToTopBtn.classList.remove('is-visible');
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check

  // 2. Smooth Scroll to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Scrollspy: Active Navigation Links
  if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // 4. Quote Copying
  if (copyQuoteBtn && quoteText) {
    copyQuoteBtn.addEventListener('click', async () => {
      const textToCopy = quoteText.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        const originalHtml = copyQuoteBtn.innerHTML;
        copyQuoteBtn.classList.add('copied');
        copyQuoteBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied!</span>
        `;

        setTimeout(() => {
          copyQuoteBtn.classList.remove('copied');
          copyQuoteBtn.innerHTML = originalHtml;
        }, 2200);
      } catch (err) {
        console.warn('Could not copy quote:', err);
      }
    });
  }

  // 5. Image Fallback Handling
  const heroImg = document.querySelector('.hero__figure img');
  if (heroImg) {
    heroImg.addEventListener('error', function () {
      this.style.background = '#1b5240';
      this.alt = 'Portrait of Abdul Sattar Edhi (Image temporarily unavailable offline)';
    });
  }
})();

