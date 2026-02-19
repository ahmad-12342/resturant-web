/* =============================================
   LA MAISON RESTAURANT — MAIN JAVASCRIPT
   ============================================= */

'use strict';

/* ─────────────────────────────────
   1. PRELOADER
   ───────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 900);
    }
  }, 2400);
});

/* ─────────────────────────────────
   2. CUSTOM CURSOR
   ───────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const animateCursor = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .menu-card, .gallery-item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });
}

/* ─────────────────────────────────
   3. NAVBAR — SCROLL EFFECT
   ───────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ─────────────────────────────────
   4. MOBILE MENU
   ───────────────────────────────── */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

window.closeMobileMenu = () => {
  menuBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};

/* ─────────────────────────────────
   5. HERO PARTICLES
   ───────────────────────────────── */
const particlesContainer = document.querySelector('.particles-container');

if (particlesContainer) {
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 3;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
    `;
    particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), (duration + delay) * 1000);
  };

  setInterval(createParticle, 600);
  for (let i = 0; i < 8; i++) createParticle();
}

/* ─────────────────────────────────
   6. ANIMATED COUNTER (STATS)
   ───────────────────────────────── */
const animateCounter = (el, target, duration = 1800) => {
  let start = 0;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

// Trigger counters when stats are visible
const statEls = document.querySelectorAll('[data-count]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statEls.forEach(el => {
  el.textContent = '0+';
  statsObserver.observe(el);
});

/* ─────────────────────────────────
   7. MENU CATEGORY FILTER
   ───────────────────────────────── */
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const category = tab.dataset.category;

    menuCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ─────────────────────────────────
   8. TESTIMONIALS SLIDER
   ───────────────────────────────── */
const track = document.getElementById('testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testimonial-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (track && testimonialCards.length) {
  let currentIndex = 0;
  let autoSlideInterval;
  const isDesktop = () => window.innerWidth >= 1024;

  // Create dots
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.testimonial-dot');

  const goTo = (index) => {
    const total = isDesktop() ? testimonialCards.length - 1 : testimonialCards.length - 1;
    currentIndex = (index + testimonialCards.length) % testimonialCards.length;
    const slideWidth = isDesktop() ? 50 : 100;
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => goTo(currentIndex + 1), 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoSlide(); });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      resetAutoSlide();
    }
  });

  startAutoSlide();
}

/* ─────────────────────────────────
   9. SCROLL REVEAL ANIMATION
   ───────────────────────────────── */
const addRevealClasses = () => {
  // Sections
  document.querySelectorAll('section').forEach(section => {
    const children = section.querySelectorAll('h2, h3, p, .about-feature, .menu-card, .gallery-item, .contact-info-card, .reservation-hours');
    children.forEach((child, i) => {
      if (!child.classList.contains('reveal')) {
        child.classList.add('reveal');
        child.style.transitionDelay = `${i * 0.07}s`;
      }
    });
  });
};

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────
   10. GALLERY LIGHTBOX
   ───────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const galleryImages = document.querySelectorAll('.gallery-item img');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  });
}

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }
});

/* ─────────────────────────────────
   11. RESERVATION FORM
   ───────────────────────────────── */
const reservationForm = document.getElementById('reservation-form');
const resSuccess = document.getElementById('res-success');
const resBtnText = document.getElementById('res-btn-text');
const resBtnIcon = document.getElementById('res-btn-icon');

if (reservationForm) {
  // Set min date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('res-btn');
    btn.disabled = true;
    resBtnText.textContent = 'Processing...';
    resBtnIcon.className = 'fa-solid fa-spinner fa-spin';

    const formData = {
      firstName: document.getElementById('res-fname').value,
      lastName: document.getElementById('res-lname').value,
      email: document.getElementById('res-email').value,
      phone: document.getElementById('res-phone').value,
      date: document.getElementById('res-date').value,
      time: document.getElementById('res-time').value,
      guests: document.getElementById('res-guests').value,
      notes: document.getElementById('res-notes').value,
      timestamp: new Date().toISOString()
    };

    console.log('Reservation submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    reservationForm.style.display = 'none';
    resSuccess.classList.remove('hidden');
    resSuccess.style.animation = 'slideUp 0.5s ease forwards';

    // Reset after 8 seconds
    setTimeout(() => {
      reservationForm.reset();
      reservationForm.style.display = '';
      resSuccess.classList.add('hidden');
      btn.disabled = false;
      resBtnText.textContent = 'Confirm Reservation';
      resBtnIcon.className = 'fa-solid fa-arrow-right';
    }, 8000);
  });
}

/* ─────────────────────────────────
   12. CONTACT FORM
   ───────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const cfSuccess = document.getElementById('cf-success');
const cfBtnText = document.getElementById('cf-btn-text');
const cfBtnIcon = document.getElementById('cf-btn-icon');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('cf-btn');
    btn.disabled = true;
    cfBtnText.textContent = 'Sending...';
    cfBtnIcon.className = 'fa-solid fa-spinner fa-spin';

    const formData = {
      name: document.getElementById('cf-name').value,
      email: document.getElementById('cf-email').value,
      phone: document.getElementById('cf-phone').value,
      subject: document.getElementById('cf-subject').value,
      message: document.getElementById('cf-message').value,
      timestamp: new Date().toISOString()
    };

    console.log('Contact message submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    contactForm.style.display = 'none';
    cfSuccess.classList.remove('hidden');
    cfSuccess.style.animation = 'slideUp 0.5s ease forwards';

    // Reset after 8 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = '';
      cfSuccess.classList.add('hidden');
      btn.disabled = false;
      cfBtnText.textContent = 'Send Message';
      cfBtnIcon.className = 'fa-solid fa-paper-plane';
    }, 8000);
  });
}

/* ─────────────────────────────────
   13. NEWSLETTER FORM
   ───────────────────────────────── */
const newsletterForm = document.getElementById('newsletter-form');
const nlSuccess = document.getElementById('nl-success');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('nl-email').value;
    const btn = newsletterForm.querySelector('button');
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    console.log('Newsletter subscription:', email);
    await new Promise(resolve => setTimeout(resolve, 1200));

    newsletterForm.style.display = 'none';
    nlSuccess.classList.remove('hidden');
  });
}

/* ─────────────────────────────────
   14. BACK TO TOP BUTTON
   ───────────────────────────────── */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────
   15. SMOOTH ANCHOR SCROLL
   ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

/* ─────────────────────────────────
   16. ACTIVE NAV LINK (SCROLL SPY)
   ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const scrollSpy = () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${sectionId}` ? 'var(--gold)' : '';
      });
    }
  });
};

window.addEventListener('scroll', scrollSpy);

/* ─────────────────────────────────
   17. PARALLAX EFFECT (HERO BG)
   ───────────────────────────────── */
const heroBg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

console.log('%cLa Maison Restaurant', 'color: #C9A84C; font-size: 24px; font-family: serif;');
console.log('%cFine Dining Experience | Code crafted with ❤️', 'color: #888; font-size: 12px;');
