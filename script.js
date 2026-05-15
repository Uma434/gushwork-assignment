(function initStickyHeader() {
  const stickyHeader = document.getElementById('sticky-header');
  const siteHeader   = document.getElementById('site-header');
  const THRESHOLD    = 80; 

  let lastScrollY = window.scrollY;

  function onScroll() {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY;

    if (currentY > THRESHOLD) {
      stickyHeader.classList.add('visible');
      stickyHeader.removeAttribute('aria-hidden');
      siteHeader.classList.add('pushed');
    } else {
      stickyHeader.classList.remove('visible');
      stickyHeader.setAttribute('aria-hidden', 'true');
      siteHeader.classList.remove('pushed');
    }


    if (!scrollingDown && currentY < THRESHOLD + 40) {
      stickyHeader.classList.remove('visible');
      stickyHeader.setAttribute('aria-hidden', 'true');
      siteHeader.classList.remove('pushed');
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();



(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();



(function initCarousel() {
  const track      = document.getElementById('carousel-track');
  const slides     = document.querySelectorAll('.carousel__slide');
  const thumbBtns  = document.querySelectorAll('.thumb');
  const prevBtn    = document.getElementById('prev-btn');
  const nextBtn    = document.getElementById('next-btn');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;


  function goTo(index) {

    index = (index + total) % total;

    track.style.transform = `translateX(-${index * 100}%)`;

    slides[current].classList.remove('active');
    slides[index].classList.add('active');

   
    thumbBtns[current].classList.remove('active');
    thumbBtns[index].classList.add('active');

    current = index;
  }


  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      goTo(idx);
    });
  });

 
  document.getElementById('carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });


  let autoTimer = setInterval(() => goTo(current + 1), 4500);
  const carouselEl = document.getElementById('carousel');
  carouselEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carouselEl.addEventListener('mouseleave', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  });


  let touchStartX = 0;
  carouselEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carouselEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  slides.forEach((slide) => {
    const zoomImg = slide.querySelector('.zoom-preview img');

    slide.addEventListener('mousemove', (e) => {
      if (!zoomImg) return;

      const rect = slide.getBoundingClientRect();
      const pctX = ((e.clientX - rect.left) / rect.width)  * 100;
      const pctY = ((e.clientY - rect.top)  / rect.height) * 100;

      
      zoomImg.style.setProperty('--zx', `${pctX}%`);
      zoomImg.style.setProperty('--zy', `${pctY}%`);
      zoomImg.style.transformOrigin = `${pctX}% ${pctY}%`;
    });
  });
})();



(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn    = item.querySelector('.faq-question');
    const icon   = item.querySelector('.faq-icon');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        el.querySelector('.faq-icon').textContent = '+';
      });

  
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        icon.textContent = '−';
      }
    });
  });
})();



(function initProcessTabs() {
  const tabs   = document.querySelectorAll('.process-tab');
  const panels = document.querySelectorAll('.process-panel');


  const tabData = {
    cooling:  { title: 'Controlled Cooling', desc: 'Freshly extruded pipes pass through a precision cooling tank to rapidly set their dimensions. Water temperature and flow rate are carefully calibrated to prevent warping and ensure dimensional stability.', checks: ['Vacuum sizing for tight tolerances', 'Water-bath temperature control'] },
    sizing:   { title: 'Precision Sizing & Calibration', desc: 'The pipe profile is drawn through calibration sleeves under vacuum, locking in the precise outer diameter specified by the relevant standards.', checks: ['OD tolerance ±0.5%', 'Roundness verification'] },
    qc:       { title: 'Rigorous Quality Control', desc: 'Each production batch undergoes hydrostatic pressure testing, tensile strength analysis, and dimensional inspection before leaving the line.', checks: ['Pressure test per ISO 1167', 'Batch-level traceability'] },
    marking:  { title: 'Laser Marking', desc: 'Every pipe is permanently marked with production date, SDR, nominal pressure, standard, and batch code for full traceability.', checks: ['Permanent ink or laser marking', 'QR code traceability (optional)'] },
    cutting:  { title: 'Automated Cutting', desc: 'Computer-controlled cutting saws produce pipes to customer-specified lengths with burr-free, square ends ready for immediate installation.', checks: ['± 5mm length tolerance', 'Deburring station'] },
    packaging:{ title: 'Protective Packaging', desc: 'Straight pipes are bundled with protective end caps and bundled safely; coils are wound on returnable reels and shrink-wrapped for transport.', checks: ['UV-stable wrapping for outdoor storage', 'Custom coil length up to 500m'] },
  };


  const processContent = document.querySelector('.process-content');
  Object.entries(tabData).forEach(([key, d]) => {
    if (!document.getElementById(`tab-${key}`)) {
      const panel = document.createElement('div');
      panel.className = 'process-panel';
      panel.id = `tab-${key}`;
      panel.innerHTML = `
        <div class="process-panel__text">
          <h3>${d.title}</h3>
          <p>${d.desc}</p>
          <ul class="process-checklist">
            ${d.checks.map(c => `<li><span>✓</span> ${c}</li>`).join('')}
          </ul>
        </div>
        <div class="process-panel__img">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" alt="${d.title}" loading="lazy" />
        </div>`;
      processContent.appendChild(panel);
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.process-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`tab-${key}`);
      if (target) target.classList.add('active');
    });
  });
})();



(function initIndustriesNav() {
  const grid    = document.getElementById('industries-grid');
  const prevBtn = document.getElementById('ind-prev');
  const nextBtn = document.getElementById('ind-next');
  if (!grid) return;

  const SCROLL_AMT = 260;

  prevBtn && prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' });
  });
  nextBtn && nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: SCROLL_AMT, behavior: 'smooth' });
  });
})();


(function initReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .specs-table, .industry-card, .testimonial-card, .portfolio-card, .resource-item, .faq-item'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


function handleCatalogueSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = 'Sent! ✓';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; e.target.reset(); }, 3000);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = 'Quote Requested ✓';
  btn.style.background = '#16a34a';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3500);
}


(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.style.color = '');
        const match = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (match) match.style.color = 'var(--clr-orange)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();