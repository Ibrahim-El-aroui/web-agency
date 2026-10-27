/**
 * VALENCE STUDIO - MAIN INTERACTIVE LOGIC
 * Handles navigation, mobile drawer, scroll animations, portfolio filtering,
 * service pills, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNavigation();
  initActiveNavLink();
  initPortfolioFilters();
  initServicePills();
  initBudgetPills();
  initFaqAccordions();
  initContactForm();
  handleUrlParameters();
});

/* 1. Header scroll state */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile navigation drawer */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* 3. Active Nav Link Detection */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* 4. Portfolio Category Filtering */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (targetCategory === 'all' || categories.includes(targetCategory)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. Service Choice Pills in Forms */
function initServicePills() {
  const servicePills = document.querySelectorAll('.service-pill-btn');
  const hiddenInput = document.getElementById('selected-service');

  if (!servicePills.length) return;

  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-value');
      if (hiddenInput) {
        hiddenInput.value = val;
      }
    });
  });
}

/* 6. Budget Pills in Forms */
function initBudgetPills() {
  const budgetPills = document.querySelectorAll('.budget-pill-btn');
  const hiddenBudgetInput = document.getElementById('selected-budget');

  if (!budgetPills.length) return;

  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-value');
      if (hiddenBudgetInput) {
        hiddenBudgetInput.value = val;
      }
    });
  });
}

/* 7. FAQ Accordions */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = item.classList.contains('active');

      // Close other accordions in the same group
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = (answer.scrollHeight + 30) + 'px';
      }
    });
  });
}

/* 8. Contact & Project Inquiry Form */
function initContactForm() {
  const form = document.getElementById('agency-inquiry-form');
  if (!form) return;

  const feedbackSuccess = document.getElementById('form-feedback-success');
  const feedbackError = document.getElementById('form-feedback-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset feedback
    if (feedbackSuccess) feedbackSuccess.style.display = 'none';
    if (feedbackError) feedbackError.style.display = 'none';

    // Validation
    const nameInput = form.querySelector('[name="client_name"]');
    const emailInput = form.querySelector('[name="client_email"]');
    const messageInput = form.querySelector('[name="project_desc"]');

    let isValid = true;
    let errorMessage = '';

    if (!nameInput || !nameInput.value.trim()) {
      isValid = false;
      errorMessage = 'Please provide your full name.';
      nameInput.focus();
    } else if (!emailInput || !validateEmail(emailInput.value.trim())) {
      isValid = false;
      errorMessage = 'Please enter a valid work email address.';
      emailInput.focus();
    } else if (!messageInput || messageInput.value.trim().length < 15) {
      isValid = false;
      errorMessage = 'Please share a brief description of your project requirements (at least 15 characters).';
      messageInput.focus();
    }

    if (!isValid) {
      if (feedbackError) {
        feedbackError.querySelector('.feedback-text').textContent = errorMessage;
        feedbackError.style.display = 'flex';
      }
      return;
    }

    // Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Transmitting Inquiry...';

    // Simulated reliable submission
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      if (feedbackSuccess) {
        feedbackSuccess.style.display = 'flex';
        form.reset();

        // Reset pill states
        document.querySelectorAll('.service-pill-btn').forEach((p, idx) => {
          if (idx === 0) p.classList.add('active');
          else p.classList.remove('active');
        });

        // Scroll feedback into view smoothly
        feedbackSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1100);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* 9. Handle URL Parameters for dynamic links */
function handleUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');

  if (serviceParam) {
    const matchingPill = document.querySelector(`.service-pill-btn[data-value="${serviceParam}"]`);
    if (matchingPill) {
      matchingPill.click();
    }
  }

  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    const matchingFilter = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
    if (matchingFilter) {
      matchingFilter.click();
    }
  }
}
