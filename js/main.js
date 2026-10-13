/**
 * CVCraft — Free CV & Resume Builder
 * Main shared scripts: navigation, mobile drawer, toasts, accessible components
 */

(function () {
  'use strict';

  // Mobile Navigation Drawer Toggle
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', function () {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close when clicking outside or clicking any nav link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Link Highlighter based on current pathname
  function setActiveNavLink() {
    const rawPath = (window.location && window.location.pathname) ? window.location.pathname : '';
    let currentPath = rawPath.split('/').pop() || 'index.html';
    if (!currentPath || currentPath === '') currentPath = 'index.html';
    if (!currentPath.includes('.')) currentPath += '.html';

    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href) {
        let cleanHref = href.split('?')[0].split('#')[0];
        if (!cleanHref.includes('.')) cleanHref += '.html';
        if (cleanHref === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });
  }

  // Toast Notification Engine
  window.showToast = function (message, type) {
    type = type || 'info'; // 'success', 'error', 'info'
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3500);
  };

  // Safe HTML Escaping Utility for XSS Prevention
  window.escapeHtml = function (str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Accessible Accordion Enhancement
  function initAccordions() {
    const detailsElements = document.querySelectorAll('.faq-item');
    detailsElements.forEach(function (detail) {
      detail.addEventListener('toggle', function () {
        if (detail.open) {
          detailsElements.forEach(function (other) {
            if (other !== detail && other.open) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    setActiveNavLink();
    initAccordions();
  });

})();
