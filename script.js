/* =========================================================================
   RENDERIZADO DE LA PÁGINA A PARTIR DE content.js
   No necesitas editar este archivo para cambiar textos o precios:
   todo eso vive en content.js
   ========================================================================= */

(function () {
  'use strict';

  const d = SITE_DATA;
  const $ = (id) => document.getElementById(id);

  /* --------------------------------------------------------------------
     Utilidades
     -------------------------------------------------------------------- */
  const esc = (str) =>
    String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const waLink = (customText) => {
    const text = encodeURIComponent(
      customText || `Hola ${d.brand.name}, quiero información sobre tus paquetes de entrenamiento.`
    );
    return `https://wa.me/52${d.contact.whatsappNumber}?text=${text}`;
  };

  /* Resalta en cursiva las últimas palabras de un titular (detalle editorial) */
  const emphasizeTail = (headline, tailWords) => {
    const words = String(headline).trim().split(/\s+/);
    if (words.length <= tailWords + 1) return esc(headline);
    const head = words.slice(0, words.length - tailWords).join(' ');
    const tail = words.slice(words.length - tailWords).join(' ');
    return `${esc(head)} <em>${esc(tail)}</em>`;
  };

  /* --------------------------------------------------------------------
     Iconografía
     -------------------------------------------------------------------- */
  const icons = {
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 20V11M10 20V5M16 20v-6M22 20H2"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3M4 18v-5h3v6H5a1 1 0 0 1-1-1z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.6 6.1 6.6.6-5 4.3 1.5 6.4L12 16.6 6.3 20l1.5-6.4-5-4.3 6.6-.6z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.4a6 6 0 0 1-3.5-1.1v6.4a4.9 4.9 0 1 1-4.2-4.9v2.5a2.5 2.5 0 1 0 1.7 2.4V3h2.5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h2.5V6h-2.5c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6h2.3l.4-3h-2.7V9.6c0-.4.3-.6.5-.6z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.3A9 9 0 1 0 12 3zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.2 7.2 0 1 1 12 19.2zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.9-.3.2-.5.1a5.9 5.9 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.4a.4.4 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.6s-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.6 2.6 0 0 0-.8 2c0 1.2.9 2.3 1 2.5s1.7 2.6 4.2 3.6a5.4 5.4 0 0 0 3.2.2 2.4 2.4 0 0 0 1.5-1.1c.2-.4.2-.7.1-.8s-.2-.1-.4-.2z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3s-5 4.5-5 9.5a5 5 0 0 0 10 0c0-1.6-.7-2.7-1.4-3.7.1 1.4-.6 2.3-1.3 2.3-1 0-1-1-1-1.8 0-1.4-1-2.9-1.3-6.3z"/><path d="M9.5 15.5a2.5 2.5 0 0 0 5 0"/></svg>',
    dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 10v4M2.5 9v6M7 8v8M17 8v8M21.5 9v6M20 10v4M7 12h10"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/></svg>',
    heartpulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 20s-7.5-4.7-9.6-9.4C1.2 7.4 3 4.3 6.2 4c2-.2 3.4 1 4.4 2.3M12 20s7.5-4.7 9.6-9.4C22.8 7.4 21 4.3 17.8 4c-1.6-.1-2.9.6-3.9 1.6"/><path d="M3 12h4l1.5-3L11 15l1.8-4.5L14 12h7"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
  };

  /* --------------------------------------------------------------------
     MARCA / NAV
     -------------------------------------------------------------------- */
  $('navBrand').textContent = d.brand.name;
  $('navRole').textContent = d.brand.role;
  $('navCta').href = waLink();
  $('whatsappFab').href = waLink();

  /* --------------------------------------------------------------------
     HERO
     -------------------------------------------------------------------- */
  $('heroEyebrow').textContent = d.hero.eyebrow;
  $('heroHeadline').innerHTML = emphasizeTail(d.hero.headline, 3);
  $('heroSub').textContent = d.hero.subheadline;

  const ctaPrimary = $('heroCtaPrimary');
  ctaPrimary.textContent = d.hero.ctaPrimary;
  ctaPrimary.href = waLink();
  $('heroCtaSecondary').textContent = d.hero.ctaSecondary;

  $('heroBadgeName').textContent = d.brand.name;
  $('heroBadgeRole').textContent = d.brand.role;

  $('heroStats').innerHTML = d.hero.stats
    .map(
      (s) => `<li>
        <span class="hero__stat-num">${esc(s.number)}</span>
        <span class="hero__stat-label">${esc(s.label)}</span>
      </li>`
    )
    .join('');

  /* --------------------------------------------------------------------
     TIRA DE VALORES (usa los pilares y los tipos de paquete)
     -------------------------------------------------------------------- */
  const stripTrack = $('stripTrack');
  if (stripTrack) {
    const phrases = []
      .concat(d.about.pillars.map((p) => p.title))
      .concat(d.packages.map((p) => p.tag));
    const run = phrases
      .map((t) => `<span class="strip__item">${esc(t)}<span class="strip__dot"></span></span>`)
      .join('');
    stripTrack.innerHTML = run + run; // duplicado para un desplazamiento continuo
  }

  /* --------------------------------------------------------------------
     SOBRE MÍ
     -------------------------------------------------------------------- */
  $('aboutTitle').textContent = d.about.title;
  $('aboutText').textContent = d.about.text;

  $('aboutPillars').innerHTML = d.about.pillars
    .map(
      (p, i) => `<article class="pillar">
        <span class="pillar__num">${String(i + 1).padStart(2, '0')}</span>
        <div class="pillar__icon">${icons[p.icon] || icons.spark}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </article>`
    )
    .join('');

  /* --------------------------------------------------------------------
     PAQUETES
     -------------------------------------------------------------------- */
  $('packagesGrid').innerHTML = d.packages
    .map((pkg) => {
      const classes = [
        'package',
        pkg.accent === 'gold' ? 'package--gold' : '',
        pkg.highlight ? 'package--highlight' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const priceBlock = d.showPrices
        ? `<div class="package__price-block">
             <span class="package__price">${esc(pkg.price)}</span>
             <span class="package__price-unit">${esc(pkg.priceUnit)}</span>
           </div>`
        : `<div class="package__price-block">
             <span class="package__price package__price--quote">Cotiza por WhatsApp</span>
           </div>`;

      // En la tarjeta destacada la etiqueta se muestra como distintivo,
      // así que no se repite abajo.
      const tagBlock = pkg.highlight
        ? `<span class="package__ribbon">${icons.star}${esc(pkg.tag)}</span>`
        : `<p class="package__tag">${esc(pkg.tag)}</p>`;

      return `<article class="${classes}">
        ${tagBlock}
        <h3 class="package__title">${esc(pkg.title)}</h3>
        <p class="package__subtitle">${esc(pkg.subtitle)}</p>
        ${priceBlock}
        <ul class="package__features">
          ${pkg.features.map((f) => `<li>${icons.check}<span>${esc(f)}</span></li>`).join('')}
        </ul>
        <a class="btn btn--primary" href="${waLink(
          `Hola ${d.brand.name}, me interesa el paquete "${pkg.title}".`
        )}">Elegir este plan</a>
      </article>`;
    })
    .join('');

  /* --------------------------------------------------------------------
     RUTINA / MÉTODO
     -------------------------------------------------------------------- */
  $('routineTitle').textContent = d.routinePreview.title;
  $('routineText').textContent = d.routinePreview.text;

  const rp = d.routinePreview.sampleDay;
  $('routineCard').innerHTML = `
    <header class="routine__card-head">
      <p class="routine__card-label">${esc(rp.label)}</p>
      <p class="routine__card-day">${esc(rp.dayName)}</p>
      <p class="routine__card-focus">${esc(rp.focus)}</p>
    </header>
    ${rp.blocks
      .map(
        (b) => `<section class="routine__block">
          <h3 class="routine__block-title">${esc(b.group)}</h3>
          ${b.exercises
            .map(
              (e) => `<div class="routine__exercise"><span>${esc(e.name)}</span><span>${esc(e.sets)}</span></div>`
            )
            .join('')}
        </section>`
      )
      .join('')}
  `;

  /* --------------------------------------------------------------------
     SUPLEMENTOS
     -------------------------------------------------------------------- */
  if (!d.supplements || !d.supplements.enabled) {
    const sup = $('suplementos');
    if (sup) sup.remove();
    document.querySelectorAll('a[href="#suplementos"]').forEach((a) => a.remove());
  } else {
    $('supplementsTitle').textContent = d.supplements.title;
    $('supplementsText').textContent = d.supplements.text;
    if (d.supplements.badge) $('supplementsBadge').textContent = d.supplements.badge;

    /* Si hay catálogo publicado se muestra el botón; si no, sigue el aviso */
    const supCta = $('supplementsCta');
    if (d.supplements.ctaUrl) {
      supCta.href = d.supplements.ctaUrl;
      supCta.textContent = d.supplements.ctaText || 'Ver catálogo';
      supCta.hidden = false;
    }
  }

  /* --------------------------------------------------------------------
     CONTACTO
     -------------------------------------------------------------------- */
  $('contactTitle').textContent = d.contact.title;
  $('contactText').textContent = d.contact.text;

  const contactWa = $('contactWhatsapp');
  contactWa.href = waLink();
  contactWa.innerHTML = `${icons.whatsapp}<span>WhatsApp ${esc(d.contact.whatsappDisplay)}</span>`;

  $('contactSocials').innerHTML = [
    { icon: 'tiktok', label: `TikTok · @${d.contact.tiktok}`, href: `https://www.tiktok.com/@${d.contact.tiktok}` },
    { icon: 'instagram', label: `Instagram · @${d.contact.instagram}`, href: `https://www.instagram.com/${d.contact.instagram}` },
    { icon: 'facebook', label: `Facebook · ${d.contact.facebook}`, href: d.contact.facebookUrl },
  ]
    .map(
      (s) => `<a class="social-link" href="${esc(s.href)}" target="_blank" rel="noopener">
        ${icons[s.icon]}<span>${esc(s.label)}</span>
        <span class="social-link__arrow">${icons.arrow}</span>
      </a>`
    )
    .join('');

  /* --------------------------------------------------------------------
     FOOTER
     -------------------------------------------------------------------- */
  $('footerInitials').textContent = d.brand.initials;
  $('footerBrand').textContent = d.brand.name;
  $('footerText').textContent = d.footer.text;
  $('footerCopy').textContent = `© ${new Date().getFullYear()} ${d.brand.name}`;
  $('footerPhone').textContent = d.contact.whatsappDisplay;

  /* --------------------------------------------------------------------
     NAV: menú móvil, estado al hacer scroll y enlace activo
     -------------------------------------------------------------------- */
  const nav = $('nav');
  const navToggle = $('navToggle');
  const navLinks = $('navLinks');

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const watched = sectionLinks
    .map((a) => ({ link: a, section: document.querySelector(a.getAttribute('href')) }))
    .filter((x) => x.section);

  if ('IntersectionObserver' in window && watched.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((l) => l.classList.remove('is-active'));
          const match = watched.find((w) => w.section === entry.target);
          if (match) match.link.classList.add('is-active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    watched.forEach((w) => spy.observe(w.section));
  }

  /* --------------------------------------------------------------------
     APARICIÓN AL HACER SCROLL
     -------------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* =====================================================================
     JUEGO: "DESCUBRE TU PLAN" (swipe de objetivos)
     ===================================================================== */
  const gameFab = $('gameFab');
  const gameSection = $('juego');

  if (!d.game || !d.game.enabled) {
    if (gameSection) gameSection.remove();
    if (gameFab) gameFab.remove();
    document.querySelectorAll('a[href="#juego"]').forEach((a) => a.remove());
  } else {
    if (!d.gameFab || !d.gameFab.enabled) {
      if (gameFab) gameFab.remove();
    } else {
      $('gameFabText').textContent = d.gameFab.text;
    }

    $('gameTitle').textContent = d.game.title;
    $('gameIntro').textContent = d.game.intro;

    const stack = $('swipeStack');
    const cardsData = d.game.cards.slice();
    let index = 0;
    const likes = [];

    function sendToSheets(payload) {
      if (!d.game.sheetsWebhookUrl) return;
      fetch(d.game.sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    function pickPackage() {
      const count = likes.length;
      const tier = d.game.resultMapping.find((r) => count >= r.minLikes && count <= r.maxLikes);
      const title = tier ? tier.packageTitle : d.game.resultMapping[0].packageTitle;
      return d.packages.find((p) => p.title === title) || d.packages[0];
    }

    function dotsMarkup() {
      return `<div class="swipe__dots" aria-hidden="true">${cardsData
        .map((_, i) => {
          const state = i < index ? ' is-done' : i === index ? ' is-current' : '';
          return `<span class="swipe__dot${state}"></span>`;
        })
        .join('')}</div>`;
    }

    function renderCard() {
      if (index >= cardsData.length) {
        renderGymStep();
        return;
      }

      const card = cardsData[index];
      stack.innerHTML = `
        <article class="swipe__card" id="activeCard">
          <span class="swipe__stamp swipe__stamp--yes" id="stampYes">Me interesa</span>
          <span class="swipe__stamp swipe__stamp--no" id="stampNo">Paso</span>
          <div class="swipe__card-icon">${icons[card.icon] || icons.spark}</div>
          <p class="swipe__card-label">${esc(card.label)}</p>
          <p class="swipe__card-hint">Desliza o usa los botones</p>
        </article>
        <div class="swipe__controls">
          <button class="swipe__btn swipe__btn--no" id="btnNo" aria-label="No me interesa">${icons.close}</button>
          ${dotsMarkup()}
          <button class="swipe__btn swipe__btn--yes" id="btnYes" aria-label="Me interesa">${icons.heart}</button>
        </div>
      `;

      const el = $('activeCard');
      const stampYes = $('stampYes');
      const stampNo = $('stampNo');

      let startX = 0;
      let currentX = 0;
      let dragging = false;
      let settled = false;

      function onDown(clientX) {
        dragging = true;
        startX = clientX;
        el.classList.add('is-dragging');
      }

      function onMove(clientX) {
        if (!dragging) return;
        currentX = clientX - startX;
        el.style.transform = `translateX(${currentX}px) rotate(${currentX / 20}deg)`;
        stampYes.style.opacity = currentX > 24 ? Math.min(currentX / 100, 1) : 0;
        stampNo.style.opacity = currentX < -24 ? Math.min(-currentX / 100, 1) : 0;
      }

      function onUp() {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('is-dragging');
        if (currentX > 100) {
          resolveCard(true);
        } else if (currentX < -100) {
          resolveCard(false);
        } else {
          el.style.transform = '';
          stampYes.style.opacity = 0;
          stampNo.style.opacity = 0;
        }
        currentX = 0;
      }

      el.addEventListener('pointerdown', (e) => {
        el.setPointerCapture(e.pointerId);
        onDown(e.clientX);
      });
      el.addEventListener('pointermove', (e) => onMove(e.clientX));
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);

      $('btnYes').addEventListener('click', () => resolveCard(true));
      $('btnNo').addEventListener('click', () => resolveCard(false));

      function resolveCard(liked) {
        if (settled) return;
        settled = true;
        el.classList.add(liked ? 'swipe__card--out-right' : 'swipe__card--out-left');
        if (liked) likes.push(cardsData[index]);
        index += 1;
        setTimeout(renderCard, 230);
      }
    }

    function renderGymStep() {
      stack.innerHTML = `
        <div class="swipe__panel">
          <h3>${esc(d.game.gymQuestion)}</h3>
          <p class="swipe__panel-help">${esc(d.game.gymHelper)}</p>
          <input type="text" class="swipe__input" id="gymInput" placeholder="${esc(d.game.gymPlaceholder)}" autocomplete="off">
          <button class="btn btn--primary btn--block" id="gymSubmit">Ver mi resultado</button>
        </div>
      `;
      const input = $('gymInput');
      const go = () => renderResult(input.value.trim());
      $('gymSubmit').addEventListener('click', go);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') go();
      });
      input.focus({ preventScroll: true });
    }

    function renderResult(gym) {
      const pkg = pickPackage();
      const objetivos = likes.map((l) => l.label).join(', ') || 'sin preferencia específica';

      sendToSheets({
        timestamp: new Date().toISOString(),
        objetivos: objetivos,
        paquete_sugerido: pkg.title,
        gimnasio: gym || 'no especificado',
      });

      stack.innerHTML = `
        <div class="swipe__panel">
          <span class="swipe__result-tag">Tu plan recomendado</span>
          <p class="swipe__result-package">${esc(pkg.title)}</p>
          <p class="swipe__result-list">Basado en: ${esc(objetivos)}</p>
          <a class="btn btn--primary btn--block" href="${waLink(
            `Hola ${d.brand.name}, hice el test de la página y me recomendó el paquete "${pkg.title}". Quiero más información.`
          )}">Quiero este plan</a>
          <button class="swipe__restart" id="restartGame">Volver a jugar</button>
        </div>
      `;
      $('restartGame').addEventListener('click', () => {
        index = 0;
        likes.length = 0;
        renderCard();
      });
    }

    renderCard();
  }
})();
