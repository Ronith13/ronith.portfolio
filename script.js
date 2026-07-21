// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  }

  // ---------- Count-up KPI numbers ----------
  const counters = document.querySelectorAll('[data-count-to]');
  const animateCount = (el) => {
    const to = parseFloat(el.getAttribute('data-count-to'));
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = to * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    if (prefersReduced) {
      el.textContent = prefix + to.toFixed(decimals) + suffix;
    } else {
      requestAnimationFrame(step);
    }
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ---------- Hero sparkline draw-in ----------
  const sparkline = document.querySelector('.hero-spark path');
  if (sparkline && !prefersReduced) {
    const length = sparkline.getTotalLength();
    sparkline.style.strokeDasharray = length;
    sparkline.style.strokeDashoffset = length;
    requestAnimationFrame(() => {
      sparkline.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.2,.7,.2,1)';
      sparkline.style.strokeDashoffset = '0';
    });
  }
});
