document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Page Loading Screen Animation
     ------------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (loader) {
      loader.classList.add('hidden');
    }
  });
  // Fallback timeout to hide loader if load event takes too long
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 1500);

  /* ------------------------------------------------------------------------
     2. Scroll Progress Bar & Sticky Header
     ------------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (header) {
      if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
      } else {
        header.classList.remove('scroll-header');
      }
    }

    if (backToTop) {
      if (window.scrollY >= 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Trigger skills bar animation & stats counter on scroll
    checkSkillAnimation();
    checkStatsCounter();
    highlightActiveNavLink();
  });

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     ------------------------------------------------------------------------ */
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Close menu when clicking any nav item
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });

  /* ------------------------------------------------------------------------
     4. Active Nav Link Scroll Indicator
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active-link');
        } else {
          activeLink.classList.remove('active-link');
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Stats Counter Animation
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let counterStarted = false;

  function checkStatsCounter() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection || counterStarted) return;

    const sectionPos = aboutSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos) {
      statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let count = 0;
        const speed = target / 30; // duration control

        const updateCount = () => {
          count += speed;
          if (count < target) {
            stat.innerText = Math.ceil(count);
            setTimeout(updateCount, 40);
          } else {
            stat.innerText = target;
          }
        };

        updateCount();
      });
      counterStarted = true;
    }
  }

  /* ------------------------------------------------------------------------
     6. Skill Progress Bar Trigger
     ------------------------------------------------------------------------ */
  const skillCards = document.querySelectorAll('.skill-card');

  function checkSkillAnimation() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if (sectionPos < screenPos) {
      skillCards.forEach(card => {
        card.classList.add('animate');
      });
    }
  }

  /* ------------------------------------------------------------------------
     7. Projects Category Filtering
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     8. Contact Form JavaScript Validation
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Validate Name
      if (fullName.value.trim() === '') {
        showError(fullName, 'nameError');
        isValid = false;
      } else {
        clearError(fullName, 'nameError');
      }

      // Validate Email
      if (!isValidEmail(email.value.trim())) {
        showError(email, 'emailError');
        isValid = false;
      } else {
        clearError(email, 'emailError');
      }

      // Validate Subject
      if (subject.value.trim() === '') {
        showError(subject, 'subjectError');
        isValid = false;
      } else {
        clearError(subject, 'subjectError');
      }

      // Validate Message
      if (message.value.trim().length < 10) {
        showError(message, 'messageError');
        isValid = false;
      } else {
        clearError(message, 'messageError');
      }

      // If form is valid
      if (isValid) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'form-status success';
        contactForm.reset();

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      }
    });
  }

  function showError(inputElement, errorId) {
    const parent = inputElement.parentElement;
    parent.classList.add('error');
  }

  function clearError(inputElement, errorId) {
    const parent = inputElement.parentElement;
    parent.classList.remove('error');
  }

  function isValidEmail(emailStr) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  }

});