/* =========================================
   SALROO SPORTS — JavaScript
   ========================================= */

(function () {
  'use strict';

  /* --- [#1] Dark mode toggle --- */
  var themeToggle = document.getElementById('themeToggle');
  var savedTheme = localStorage.getItem('ss-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ss-theme', next);
    });
  }

  /* --- Page Loader --- */
  var pageLoader = document.getElementById('pageLoader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      pageLoader.classList.add('loaded');
    }, 300);
  });

  /* --- DOM References --- */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var mobileOverlay = document.getElementById('mobileOverlay');

  /* --- Navbar scroll effect + smart hide/show --- */
  var lastScrollY = 0;
  var scrollThreshold = 5;

  function handleNavbarScroll() {
    var currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.remove('navbar--hidden');
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) return;

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* --- Mobile menu toggle --- */
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* --- [#3] Swipe-right-to-close mobile menu --- */
  var touchStartX = 0;
  var touchCurrentX = 0;
  var isSwiping = false;

  navLinks.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  navLinks.addEventListener('touchmove', function (e) {
    if (!isSwiping) return;
    touchCurrentX = e.touches[0].clientX;
    var diff = touchCurrentX - touchStartX;
    if (diff > 0) {
      navLinks.style.transform = 'translateX(' + diff + 'px)';
    }
  }, { passive: true });

  navLinks.addEventListener('touchend', function () {
    if (!isSwiping) return;
    isSwiping = false;
    var diff = touchCurrentX - touchStartX;
    if (diff > 80) {
      closeMobileMenu();
    }
    navLinks.style.transform = '';
    touchCurrentX = 0;
    touchStartX = 0;
  });

  /* --- [4] Hero cursor spotlight --- */
  var hero = document.querySelector('.hero');

  if (hero && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', x + 'px');
      hero.style.setProperty('--mouse-y', y + 'px');
    });
  }

  /* --- Hero parallax fade on scroll --- */
  var heroContent = document.querySelector('.hero__content');

  function handleParallax() {
    var scrollY = window.scrollY;
    var vh = window.innerHeight;
    if (scrollY < vh && heroContent) {
      var progress = Math.min(scrollY / (vh * 0.6), 1);
      heroContent.style.opacity = 1 - progress;
      heroContent.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = navLinks.querySelectorAll('a');

  function highlightActiveLink() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink();

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Scroll reveal with IntersectionObserver --- */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Animated stat counters --- */
  var statNumbers = document.querySelectorAll('.stat__number[data-count]');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.add('counted');
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(function (el) {
      statObserver.observe(el);
    });
  } else {
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* --- [#6] Animated process progress line on scroll --- */
  var processFill = document.getElementById('processFill');
  var processSection = document.querySelector('.process');

  if (processFill && processSection) {
    window.addEventListener('scroll', function () {
      var rect = processSection.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        var total = rect.height + vh;
        var scrolled = vh - rect.top;
        var progress = Math.min(Math.max(scrolled / total, 0), 1) * 100;
        processFill.style.width = progress + '%';
      }
    }, { passive: true });
  }

  /* --- Back to top button --- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Heritage image slideshow --- */
  var heritageSlides = document.querySelectorAll('.heritage__slide');
  if (heritageSlides.length > 1) {
    var currentSlide = 0;
    setInterval(function () {
      heritageSlides[currentSlide].classList.remove('heritage__slide--active');
      currentSlide = (currentSlide + 1) % heritageSlides.length;
      heritageSlides[currentSlide].classList.add('heritage__slide--active');
    }, 2000);
  }

  /* --- [#5] Sticky mobile CTA bar — show after scrolling past hero --- */
  var mobileCta = document.getElementById('mobileCta');
  if (mobileCta) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > window.innerHeight * 0.8) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* --- [#9] Testimonial scroll dot indicators --- */
  var testimonialsGrid = document.querySelector('.testimonials__grid');
  var dots = document.querySelectorAll('.testimonials__dot');

  if (testimonialsGrid && dots.length > 0) {
    function updateDots() {
      var scrollLeft = testimonialsGrid.scrollLeft;
      var cardWidth = testimonialsGrid.querySelector('.testimonial-card').offsetWidth;
      var gap = 16;
      var index = Math.round(scrollLeft / (cardWidth + gap));
      dots.forEach(function (dot, i) {
        dot.classList.toggle('testimonials__dot--active', i === index);
      });
    }

    testimonialsGrid.addEventListener('scroll', updateDots, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var card = testimonialsGrid.querySelector('.testimonial-card');
        var cardWidth = card.offsetWidth;
        var gap = 16;
        testimonialsGrid.scrollTo({
          left: i * (cardWidth + gap),
          behavior: 'smooth'
        });
      });
    });
  }

  /* --- [#5] WhatsApp chat widget --- */
  var waFab = document.getElementById('waFab');
  var waClose = document.getElementById('waClose');
  var waWidget = document.getElementById('waWidget');

  if (waFab && waWidget) {
    waFab.addEventListener('click', function () {
      waWidget.classList.toggle('open');
    });

    if (waClose) {
      waClose.addEventListener('click', function () {
        waWidget.classList.remove('open');
      });
    }

    document.addEventListener('click', function (e) {
      if (!waWidget.contains(e.target)) {
        waWidget.classList.remove('open');
      }
    });
  }

  /* --- [#6] Image blur-up on load --- */
  var slideImages = document.querySelectorAll('.heritage__slide');
  slideImages.forEach(function (img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () {
        img.classList.add('loaded');
      });
    }
  });

  /* --- Contact form → WhatsApp --- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var message = document.getElementById('contactMessage').value.trim();

      var text = 'Hi, I\'m reaching out from your website.\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Message: ' + message;

      window.open('https://wa.me/919797919846?text=' + encodeURIComponent(text), '_blank');
      contactForm.reset();
    });
  }

})();
