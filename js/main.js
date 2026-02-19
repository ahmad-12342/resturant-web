/* =============================================
   ROYAL BITES RESTAURANT — MAIN JAVASCRIPT
   ============================================= */

'use strict';

import { db, collection, addDoc, auth, signInWithEmailAndPassword } from './firebase-config.js';

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

  // 1a. LIVE STATUS LOGIC
  updateRestaurantStatus();

  // 1d. HERO PARTICLES
  initHeroParticles();
});

/* ─────────────────────────────────
   1d. HERO PARTICLES
   ───────────────────────────────── */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  };
  animate();
}

/* ─────────────────────────────────
   1b. RESTAURANT STATUS
   ───────────────────────────────── */
function updateRestaurantStatus() {
  const statusPulse = document.getElementById('status-pulse');
  const statusText = document.getElementById('status-text');
  if (!statusPulse || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday...
  const hour = now.getHours();

  // Closed on Mondays (1)
  // Open Tue-Sun (2-0), 6 PM (18) to 11 PM (23)
  const isOpen = day !== 1 && hour >= 18 && hour < 23;

  if (isOpen) {
    statusPulse.className = 'w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]';
    statusText.textContent = 'Open for Dinner';
  } else {
    statusPulse.className = 'w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    statusText.textContent = 'Closed · Opens at 6 PM';
  }
}

/* ─────────────────────────────────
   1c. BACKGROUND MUSIC
   ───────────────────────────────── */
const audioBtn = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

if (audioBtn && bgMusic) {
  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      audioBtn.querySelector('i').className = 'fa-solid fa-music';
    } else {
      bgMusic.play();
      audioBtn.querySelector('i').className = 'fa-solid fa-volume-high';
    }
    isPlaying = !isPlaying;
  });
}

/* ─────────────────────────────────
   2. CUSTOM CURSOR & ELITE EFFECTS
   ───────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const followerText = cursorFollower ? cursorFollower.querySelector('span') : null;
const progressBar = document.getElementById('scroll-progress');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // 2a. PARALLAX HERO TEXT
    if (heroTitle && heroSubtitle) {
      const xPos = (window.innerWidth / 2 - mouseX) / 50;
      const yPos = (window.innerHeight / 2 - mouseY) / 50;
      heroTitle.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      heroSubtitle.style.transform = `translate3d(${xPos * 0.5}px, ${yPos * 0.5}px, 0)`;
    }
  });

  const animateCursor = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Scroll Progress Tracker
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";
  });

  // 2b. MAGNETIC BUTTONS & HOVER EFFECTS
  const hoverEls = document.querySelectorAll('a, button, .menu-card, .gallery-item, .chef-card, .wine-card');

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.style.width = '80px';
      cursorFollower.style.height = '80px';
      cursorFollower.style.backgroundColor = 'var(--gold)';
      cursorFollower.style.mixBlendMode = 'normal';

      if (el.classList.contains('gallery-item') || el.classList.contains('menu-card')) {
        if (followerText) followerText.style.opacity = '1';
      }
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.backgroundColor = 'transparent';
      cursorFollower.style.mixBlendMode = 'difference';
      if (followerText) followerText.style.opacity = '0';

      // Reset Tilt/Magnetic
      if (el.classList.contains('gallery-item') || el.classList.contains('menu-card')) {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      }
      if (el.tagName === 'BUTTON' || el.classList.contains('btn-primary')) {
        el.style.transform = `translate3d(0, 0, 0)`;
      }
    });

    // MAGNETIC EFFECT for Buttons
    if (el.tagName === 'BUTTON' || el.classList.contains('btn-primary') || el.classList.contains('btn-secondary')) {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
      });
    }

    // 3D TILT LOGIC
    if (el.classList.contains('gallery-item') || el.classList.contains('menu-card')) {
      el.style.transition = "transform 0.1s ease-out";
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
    }
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

document.querySelectorAll('.reveal, .reveal-curtain').forEach(el => revealObserver.observe(el));

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

    try {
      // Save to Firestore
      await addDoc(collection(db, 'reservations'), formData);

      reservationForm.style.display = 'none';
      resSuccess.classList.remove('hidden');
      resSuccess.style.animation = 'slideUp 0.5s ease forwards';
    } catch (error) {
      console.error('Error adding reservation: ', error);
      alert('Something went wrong. Please try again.');
      btn.disabled = false;
      resBtnText.textContent = 'Confirm Reservation';
      resBtnIcon.className = 'fa-solid fa-arrow-right';
      return;
    }

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

    try {
      // Save to Firestore
      await addDoc(collection(db, 'contacts'), formData);

      contactForm.style.display = 'none';
      cfSuccess.classList.remove('hidden');
      cfSuccess.style.animation = 'slideUp 0.5s ease forwards';
    } catch (error) {
      console.error('Error adding contact message: ', error);
      alert('Something went wrong. Please try again.');
      btn.disabled = false;
      cfBtnText.textContent = 'Send Message';
      cfBtnIcon.className = 'fa-solid fa-paper-plane';
      return;
    }

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

    try {
      await addDoc(collection(db, 'newsletter'), {
        email: email,
        timestamp: new Date().toISOString()
      });
      newsletterForm.style.display = 'none';
      nlSuccess.classList.remove('hidden');
    } catch (error) {
      console.error('Error subscribing to newsletter: ', error);
      btn.textContent = 'ERROR';
      btn.disabled = false;
    }
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

/* ─────────────────────────────────
   18. VIP LOGIN MODAL LOGIC
   ───────────────────────────────── */
const loginModal = document.getElementById('login-modal');
const loginOpen = document.getElementById('login-open');
const loginClose = document.getElementById('login-close');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtnText = document.getElementById('login-btn-text');
const loginBtnIcon = document.getElementById('login-btn-icon');

if (loginOpen && loginModal) {
  loginOpen.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
}

if (loginClose && loginModal) {
  loginClose.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
    document.body.style.overflow = '';
    loginError.classList.add('hidden');
    loginForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit-btn');

    // Loading State
    submitBtn.disabled = true;
    loginBtnText.textContent = 'LOGGING IN...';
    loginBtnIcon.className = 'fa-solid fa-spinner fa-spin';
    loginError.classList.add('hidden');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginBtnText.textContent = 'ACCESS GRANTED';
      loginBtnIcon.className = 'fa-solid fa-check';

      // Redirect or show success
      setTimeout(() => {
        window.location.reload(); // Simple reload for now
      }, 1500);

    } catch (error) {
      console.error('Login Error:', error);
      let errorMessage = 'INVALID CREDENTIALS';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'INVALID EMAIL OR PASSWORD';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'INVALID EMAIL FORMAT';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'TOO MANY ATTEMPTS. TRY LATER';
      } else {
        errorMessage = error.message.toUpperCase();
      }

      loginError.textContent = errorMessage;
      loginError.classList.remove('hidden');
      submitBtn.disabled = false;
      loginBtnText.textContent = 'LOGIN';
      loginBtnIcon.className = 'fa-solid fa-arrow-right-to-bracket';
    }
  });
}

console.log('%cRoyal Bites Restaurant', 'color: #C9A84C; font-size: 24px; font-family: serif;');
console.log('%cFine Dining Experience | Code crafted with ❤️', 'color: #888; font-size: 12px;');
