/**
 * ==========================================================================
 * MUHAMMAD SHOAIB — PORTFOLIO JAVASCRIPT ARCHITECTURE
 * Microsoft-level enterprise interactivity:
 * - Dynamic project modals with detailed architecture breakdowns
 * - Honest link configuration & graceful placeholder handling
 * - Client-side form validation with transparent mailto integration
 * - Keyboard & screen-reader accessibility (WCAG AA compliant)
 * - Intelligent CV download verification & print handling
 * - Category filtering for projects and skills
 * ==========================================================================
 */

'use strict';

/* --------------------------------------------------------------------------
   1. PROJECT DATA REPOSITORY (AUTHENTIC CREDENTIALS ONLY)
   -------------------------------------------------------------------------- */
const PROJECT_REGISTRY = {
  'notes-converter': {
    id: 'notes-converter',
    title: 'Digital Notes Converter',
    category: 'AI Application & OCR',
    categoryGroup: 'ai-rag edtech',
    summary: 'Developed an AI-powered application that converts handwritten and voice notes into digital text using OCR and speech recognition technologies. Built using Python and deployed with Streamlit.',
    techStack: ['Python', 'Streamlit', 'OCR (Optical Character Recognition)', 'Speech Recognition', 'NLP Fundamentals'],
    architecture: 'Python pipeline coordinating optical character recognition algorithms with audio transcription modules, exposed through a responsive Streamlit web dashboard.',
    highlights: [
      'Multi-modal input support: processes image-based handwritten notes and spoken voice audio recordings.',
      'Text extraction pipeline with character segmentation and noise-reduction preprocessing.',
      'Speech-to-text integration converting verbal lecture recordings into editable digital study notes.',
      'Exportable digital format allowing students to save structured textual study notes instantly.'
    ],
    // Placeholders: To activate, replace empty strings with your GitHub / deployment URLs
    repoUrl: '', 
    demoUrl: ''
  },

  'rag-assistant': {
    id: 'rag-assistant',
    title: 'RAG-Based AI Assistant',
    category: 'LLM & Retrieval System',
    categoryGroup: 'ai-rag',
    summary: 'Developed a Retrieval-Augmented Generation (RAG) based AI system for intelligent document retrieval and context-aware response generation.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'RAG Architecture', 'Groq API', 'Context Retrieval'],
    architecture: 'Front-end client interacting with high-throughput Groq API endpoints, combining document context augmentation with low-latency LLM inference.',
    highlights: [
      'Retrieval-Augmented Generation pipeline injecting relevant reference context directly into LLM prompt envelopes.',
      'Context-aware answer generation preventing model hallucinations by grounding answers in supplied documents.',
      'Ultra-fast inference enabled by Groq cloud accelerator infrastructure.',
      'Clean modern chat interface featuring real-time state feedback and responsive message bubbles.'
    ],
    repoUrl: '',
    demoUrl: ''
  },

  'eight-queen': {
    id: 'eight-queen',
    title: '8-Queen Problem Simulator',
    category: 'Algorithmic Problem Solver',
    categoryGroup: 'simulators',
    summary: 'Designed and implemented an intelligent graphical simulator for solving the 8-Queen problem using backtracking algorithms and visualization techniques.',
    techStack: ['Algorithms', 'Backtracking', 'Problem Solving', 'Interactive Visualization', 'JavaScript/Canvas'],
    architecture: 'State-space tree exploration implementing recursive backtracking with step-by-step visual animation of row/column constraint checks.',
    highlights: [
      'Visualizes classic algorithmic backtracking: systematically places queens and retreats upon collision.',
      'Dynamic collision detection verifying row, column, and positive/negative diagonal constraints.',
      'Interactive controls allowing step-by-step stepping, automated solution discovery, and board reset.',
      'Educational telemetry highlighting recursive call depth and explored branch count.'
    ],
    repoUrl: '',
    demoUrl: ''
  },

  'map-coloring': {
    id: 'map-coloring',
    title: 'Map Coloring Problem Simulator',
    category: 'Graph AI & Constraint Satisfaction',
    categoryGroup: 'simulators',
    summary: 'Created a graphical simulator demonstrating map coloring using graph coloring algorithms and constraint satisfaction techniques.',
    techStack: ['Graph Algorithms', 'Constraint Satisfaction (CSP)', 'Heuristics', 'Visualization', 'Adjacency Graphs'],
    architecture: 'Adjacency graph representation with CSP backtracking, domain pruning (forward checking), and chromatic number optimization.',
    highlights: [
      'Models geographical regions as planar graph vertices linked by shared boundary edges.',
      'Enforces strict constraint satisfaction: no two adjacent vertices share the same color hue.',
      'Demonstrates chromatic number bounds and heuristic ordering (MRV - Minimum Remaining Values).',
      'Interactive visual canvas illustrating valid state transitions and backtrack steps.'
    ],
    repoUrl: '',
    demoUrl: ''
  },

  'mentor-ai': {
    id: 'mentor-ai',
    title: 'Mentor AI — Personalized Learning Assistant',
    category: 'Educational Technology & LLM',
    categoryGroup: 'ai-rag edtech',
    summary: 'Designed an AI-powered educational assistant that helps students learn programming and database concepts through personalized guidance.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Groq API', 'AI Assistant', 'Prompt Engineering'],
    architecture: 'Targeted pedagogical system prompt framework integrated with Groq API to deliver personalized tutoring, code explanations, and SQL debugging assistance.',
    highlights: [
      'Personalized learning pathways tailored to students mastering Python, Java, and SQL databases.',
      'Socratic dialogue mode encouraging students to think through syntax and logic errors before revealing solutions.',
      'Structured code snippet analysis explaining algorithm time and space complexities.',
      'Lightweight, responsive web portal accessible across student smartphones and laptops.'
    ],
    repoUrl: '',
    demoUrl: ''
  },

  'classroom-assistant': {
    id: 'classroom-assistant',
    title: 'AI-Powered Classroom Assistant',
    category: 'Smart Classroom & Automation',
    categoryGroup: 'edtech',
    summary: 'Created a smart classroom assistant that integrates attendance management, voice note generation, and downloadable study material features.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'AI Integration', 'Automation', 'Voice Processing'],
    architecture: 'Integrated classroom productivity suite combining automated student attendance rosters, lecture audio note generation, and study material distribution.',
    highlights: [
      'Streamlined digital attendance roster tracking student presence and class participation.',
      'Voice note generation capturing audio snippets and organizing key classroom lecture takeaways.',
      'One-click downloadable study material portal providing immediate access to shared academic documents.',
      'Automated session summaries improving retention and classroom efficiency.'
    ],
    repoUrl: '',
    demoUrl: ''
  }
};

/* --------------------------------------------------------------------------
   2. DOM ELEMENTS CACHE
   -------------------------------------------------------------------------- */
const DOM = {
  header: document.getElementById('header'),
  navLinks: document.querySelectorAll('.desktop-nav .nav-link'),
  mobileLinks: document.querySelectorAll('.mobile-nav-link'),
  mobileToggle: document.getElementById('mobileMenuBtn'),
  mobileDrawer: document.getElementById('mobileMenu'),
  mobileCloseBtn: document.getElementById('mobileCloseBtn'),
  cvDownloadBtn: document.getElementById('cvDownloadBtn'),
  mobileCvBtn: document.getElementById('mobileCvBtn'),
  cvNoticeModal: document.getElementById('cvNoticeModal'),
  cvModalCloseBtn: document.getElementById('cvModalCloseBtn'),
  cvModalBackdrop: document.getElementById('cvModalBackdrop'),
  tryDirectDownloadBtn: document.getElementById('tryDirectDownloadBtn'),
  printCvViewBtn: document.getElementById('printCvViewBtn'),
  
  // Modals
  projectModal: document.getElementById('projectModal'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalProjectCategory: document.getElementById('modalProjectCategory'),
  modalProjectTitle: document.getElementById('modalProjectTitle'),
  modalBody: document.getElementById('modalBody'),
  modalFooter: document.getElementById('modalFooter'),

  // Filters & Grids
  projectFilterBtns: document.querySelectorAll('.project-filter-btn'),
  projectCards: document.querySelectorAll('.project-card'),
  skillsTabBtns: document.querySelectorAll('.skills-tab-btn'),
  skillCategoryBlocks: document.querySelectorAll('.skill-category-block'),

  // Contact Form
  contactForm: document.getElementById('portfolioContactForm'),
  nameInput: document.getElementById('senderName'),
  emailInput: document.getElementById('senderEmail'),
  subjectInput: document.getElementById('senderSubject'),
  messageInput: document.getElementById('senderMessage'),
  nameError: document.getElementById('nameError'),
  emailError: document.getElementById('emailError'),
  subjectError: document.getElementById('subjectError'),
  messageError: document.getElementById('messageError'),
  formStatusNotice: document.getElementById('formStatusNotice'),
  mailClientFallbackBtn: document.getElementById('mailClientFallbackBtn'),
  copyEmailBtn: document.getElementById('copyEmailBtn'),

  // Footer & Misc
  currentYear: document.getElementById('currentYear'),
  scrollTopBtn: document.getElementById('scrollTopBtn'),
  toastContainer: document.getElementById('toastContainer'),
  profileVisualSlot: document.getElementById('profileVisualSlot')
};

/* --------------------------------------------------------------------------
   3. INITIALIZATION CONTROLLER
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initHeaderScrollSpy();
  initMobileNavigation();
  initCvDownloadHandler();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initContactForm();
  initScrollTopButton();
  initKeyboardAccessibility();
  checkCustomProfilePhoto();
});

/* --------------------------------------------------------------------------
   4. DYNAMIC YEAR
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  if (DOM.currentYear) {
    DOM.currentYear.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   5. NAVIGATION SCROLL & ACTIVE LINK SPY
   -------------------------------------------------------------------------- */
function initHeaderScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id="home"]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header blur/shadow intensity on scroll
    if (scrollPos > 30) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollPos > 400) {
      DOM.scrollTopBtn.classList.add('visible');
    } else {
      DOM.scrollTopBtn.classList.remove('visible');
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      DOM.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      DOM.mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   6. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  // Create backdrop element dynamically
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  document.body.appendChild(backdrop);

  function openMobileNav() {
    DOM.mobileDrawer.classList.add('open');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'false');
    DOM.mobileToggle.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    DOM.mobileCloseBtn.focus();
  }

  function closeMobileNav() {
    DOM.mobileDrawer.classList.remove('open');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
    DOM.mobileToggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (DOM.mobileToggle) {
    DOM.mobileToggle.addEventListener('click', () => {
      const isExpanded = DOM.mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (DOM.mobileCloseBtn) {
    DOM.mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  backdrop.addEventListener('click', closeMobileNav);

  // Close when clicking any nav link
  DOM.mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

/* --------------------------------------------------------------------------
   7. CV DOWNLOAD & VERIFICATION HANDLER
   -------------------------------------------------------------------------- */
function initCvDownloadHandler() {
  const cvPath = 'assets/Muhammad_Shoaib_CV.pdf';

  function handleCvRequest(e) {
    if (e) e.preventDefault();

    // Check if the file is reachable
    fetch(cvPath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          // File exists: trigger real direct download
          const downloadLink = document.createElement('a');
          downloadLink.href = cvPath;
          downloadLink.download = 'Muhammad_Shoaib_CV.pdf';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          showToast('Downloading Muhammad Shoaib\'s CV...');
        } else {
          // File is not present: open informative notice modal
          openCvNoticeModal();
        }
      })
      .catch(() => {
        // Fallback to notice modal
        openCvNoticeModal();
      });
  }

  function openCvNoticeModal() {
    DOM.cvNoticeModal.classList.add('open');
    DOM.cvNoticeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    DOM.cvModalCloseBtn.focus();
  }

  function closeCvNoticeModal() {
    DOM.cvNoticeModal.classList.remove('open');
    DOM.cvNoticeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (DOM.cvDownloadBtn) DOM.cvDownloadBtn.addEventListener('click', handleCvRequest);
  if (DOM.mobileCvBtn) DOM.mobileCvBtn.addEventListener('click', handleCvRequest);
  if (DOM.cvModalCloseBtn) DOM.cvModalCloseBtn.addEventListener('click', closeCvNoticeModal);
  if (DOM.cvModalBackdrop) DOM.cvModalBackdrop.addEventListener('click', closeCvNoticeModal);

  if (DOM.tryDirectDownloadBtn) {
    DOM.tryDirectDownloadBtn.addEventListener('click', () => {
      window.open(cvPath, '_blank');
      showToast('Opening CV file path...');
    });
  }

  if (DOM.printCvViewBtn) {
    DOM.printCvViewBtn.addEventListener('click', () => {
      closeCvNoticeModal();
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   8. SKILLS TAB FILTERING
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  DOM.skillsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      DOM.skillsTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.getAttribute('data-category');

      DOM.skillCategoryBlocks.forEach(block => {
        const group = block.getAttribute('data-category-group');
        if (category === 'all' || category === group) {
          block.style.display = 'block';
          block.style.opacity = '1';
        } else {
          block.style.display = 'none';
          block.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. FEATURED PROJECTS FILTERING
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  DOM.projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.projectFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      DOM.projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. PROJECT DETAILS MODAL & ACTION HANDLERS
   -------------------------------------------------------------------------- */
function initProjectModals() {
  // Delegate "View Details" clicks
  document.addEventListener('click', e => {
    const detailsBtn = e.target.closest('.open-details-btn');
    if (detailsBtn) {
      const projectId = detailsBtn.getAttribute('data-project');
      openProjectModal(projectId);
      return;
    }

    const repoAction = e.target.closest('.repo-action');
    if (repoAction) {
      const projectId = repoAction.getAttribute('data-project');
      handleRepoAction(projectId);
      return;
    }

    const demoAction = e.target.closest('.demo-action');
    if (demoAction) {
      const projectId = demoAction.getAttribute('data-project');
      handleDemoAction(projectId);
      return;
    }
  });

  if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener('click', closeProjectModal);
  if (DOM.modalBackdrop) DOM.modalBackdrop.addEventListener('click', closeProjectModal);

  function openProjectModal(projectId) {
    const project = PROJECT_REGISTRY[projectId];
    if (!project) return;

    DOM.modalProjectCategory.textContent = project.category;
    DOM.modalProjectTitle.textContent = project.title;

    // Build rich modal body
    DOM.modalBody.innerHTML = `
      <div class="modal-deep-dive">
        <div class="modal-section-block">
          <h4>Project Summary</h4>
          <p>${project.summary}</p>
        </div>

        <div class="modal-section-block">
          <h4>Architecture &amp; System Design</h4>
          <p>${project.architecture}</p>
        </div>

        <div class="modal-section-block">
          <h4>Key Engineering Highlights</h4>
          <ul class="modal-feature-list">
            ${project.highlights.map(item => `
              <li>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="modal-section-block">
          <h4>Verified Technologies</h4>
          <div class="project-tech-tags">
            ${project.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    // Build modal footer buttons
    const repoBtnText = project.repoUrl ? 'Open Repository' : 'GitHub Repository';
    const demoBtnText = project.demoUrl ? 'Launch Live Demo' : 'Live Application Demo';

    DOM.modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="modalRepoBtn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span>${repoBtnText}</span>
      </button>

      <button class="btn btn-primary btn-sm" id="modalDemoBtn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        <span>${demoBtnText}</span>
      </button>
    `;

    document.getElementById('modalRepoBtn').addEventListener('click', () => handleRepoAction(projectId));
    document.getElementById('modalDemoBtn').addEventListener('click', () => handleDemoAction(projectId));

    DOM.projectModal.classList.add('open');
    DOM.projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    DOM.modalCloseBtn.focus();
  }

  function closeProjectModal() {
    DOM.projectModal.classList.remove('open');
    DOM.projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function handleRepoAction(projectId) {
    const project = PROJECT_REGISTRY[projectId];
    if (project && project.repoUrl && project.repoUrl.trim() !== '') {
      window.open(project.repoUrl, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`Repository link: Placeholder configured. Muhammad's public repository for "${project.title}" can be linked in script.js.`);
    }
  }

  function handleDemoAction(projectId) {
    const project = PROJECT_REGISTRY[projectId];
    if (project && project.demoUrl && project.demoUrl.trim() !== '') {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`Live Demo link: Ready for deployment URL. Configure demoUrl in script.js to launch online.`);
    }
  }
}

/* --------------------------------------------------------------------------
   11. CLIENT-SIDE CONTACT FORM & EMAIL INTEGRATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  if (!DOM.contactForm) return;

  // Clear errors when typing
  [DOM.nameInput, DOM.emailInput, DOM.subjectInput, DOM.messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errEl = document.getElementById(`${input.name}Error`);
      if (errEl) errEl.textContent = '';
      if (DOM.formStatusNotice) DOM.formStatusNotice.style.display = 'none';
    });
  });

  // Copy email button
  if (DOM.copyEmailBtn) {
    DOM.copyEmailBtn.addEventListener('click', () => {
      const email = 'shoaibbhatti1838@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`Copied to clipboard: ${email}`))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied: ${text}`);
  }

  // Handle Form Submission
  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = DOM.nameInput.value.trim();
    const emailVal = DOM.emailInput.value.trim();
    const subjectVal = DOM.subjectInput.value.trim();
    const messageVal = DOM.messageInput.value.trim();

    // Validate Name
    if (nameVal.length < 2) {
      setError(DOM.nameInput, DOM.nameError, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setError(DOM.emailInput, DOM.emailError, 'Please provide a valid email address (e.g. name@domain.com).');
      isValid = false;
    }

    // Validate Subject
    if (subjectVal.length < 3) {
      setError(DOM.subjectInput, DOM.subjectError, 'Please enter a clear subject (at least 3 characters).');
      isValid = false;
    }

    // Validate Message
    if (messageVal.length < 10) {
      setError(DOM.messageInput, DOM.messageError, 'Please enter a message with at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Display transparent validation confirmation
    DOM.formStatusNotice.className = 'form-status-notice success';
    DOM.formStatusNotice.style.display = 'block';
    DOM.formStatusNotice.innerHTML = `
      <strong>Message Validated!</strong> Thank you, <strong>${escapeHtml(nameVal)}</strong>. Since this is a client-side portfolio without a remote database server, click the button below to launch your email client with your message pre-formatted for <strong>shoaibbhatti1838@gmail.com</strong>.
    `;

    showToast('Form validated! Click "Open in Email App" to dispatch directly.');
  });

  // Mail Client Fallback Button (mailto)
  if (DOM.mailClientFallbackBtn) {
    DOM.mailClientFallbackBtn.addEventListener('click', () => {
      const name = DOM.nameInput.value.trim() || 'Portfolio Visitor';
      const subject = DOM.subjectInput.value.trim() || 'Inquiry regarding Machine Learning / BSCS Portfolio';
      const message = DOM.messageInput.value.trim() || 'Hello Muhammad Shoaib,\n\nI reviewed your portfolio and would like to discuss...';

      const mailtoUrl = `mailto:shoaibbhatti1838@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`;
      window.location.href = mailtoUrl;
    });
  }

  function setError(input, errorEl, message) {
    input.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
    input.focus();
  }
}

/* --------------------------------------------------------------------------
   12. SCROLL TO TOP FLOATING BUTTON
   -------------------------------------------------------------------------- */
function initScrollTopButton() {
  if (DOM.scrollTopBtn) {
    DOM.scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   13. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3800) {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (DOM.toastContainer.contains(toast)) {
        DOM.toastContainer.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/* --------------------------------------------------------------------------
   14. KEYBOARD & ACCESSIBILITY CONTROLS
   -------------------------------------------------------------------------- */
function initKeyboardAccessibility() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close open modals
      if (DOM.projectModal && DOM.projectModal.classList.contains('open')) {
        DOM.projectModal.classList.remove('open');
        DOM.projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (DOM.cvNoticeModal && DOM.cvNoticeModal.classList.contains('open')) {
        DOM.cvNoticeModal.classList.remove('open');
        DOM.cvNoticeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (DOM.mobileDrawer && DOM.mobileDrawer.classList.contains('open')) {
        DOM.mobileDrawer.classList.remove('open');
        DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
        DOM.mobileToggle.setAttribute('aria-expanded', 'false');
        document.querySelector('.drawer-backdrop')?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   15. OPTIONAL CUSTOM PROFILE PHOTO DETECTION
   -------------------------------------------------------------------------- */
function checkCustomProfilePhoto() {
  if (!DOM.profileVisualSlot) return;
  const existingImg = DOM.profileVisualSlot.querySelector('img');
  if (existingImg) {
    existingImg.onerror = () => {
      DOM.profileVisualSlot.innerHTML = `
        <div class="monogram-badge" aria-label="Muhammad Shoaib Monogram">
          <span class="monogram-letters">MS</span>
          <span class="monogram-glow" aria-hidden="true"></span>
        </div>
      `;
    };
  }
}

/* --------------------------------------------------------------------------
   16. HTML ESCAPE UTILITY
   -------------------------------------------------------------------------- */
function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}
