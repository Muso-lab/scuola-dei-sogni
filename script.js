/* ========================================================
   Scuola dei Sogni - Modern & Accessible Interactive Logic
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle via CSS Class (No inline style bugs)
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mainNav');
    navLinks.id = 'mainNav';

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      }
    });
  }

  // 3. Smooth Anchor Scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 85;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
              menuToggle.innerHTML = '☰';
            }
          }
        }
      }
    });
  });

  // 4. Contact Form Handling (Accessible Inline Success State)
  const contactForm = document.getElementById('contactForm');
  const successCard = document.getElementById('formSuccessCard');

  if (contactForm && successCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const privacy = document.getElementById('privacyConsent');

      if (!name || !email || !phone) {
        return;
      }

      if (privacy && !privacy.checked) {
        alert('È necessario acconsentire al trattamento dei dati personali per inviare la richiesta.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Invio in corso...</span>';

      setTimeout(() => {
        contactForm.style.display = 'none';
        successCard.style.display = 'block';
        const successName = document.getElementById('successUserName');
        if (successName) {
          successName.textContent = name;
        }
      }, 700);
    });
  }
});
