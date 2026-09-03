/* =========================================================================
   RENDERIZADO DE LA PÁGINA A PARTIR DE content.js
   No necesitas editar este archivo para cambiar textos o precios:
   todo eso vive en content.js
   ========================================================================= */

(function () {
  const d = SITE_DATA;

  const waLink = (customText) => {
    const text = encodeURIComponent(customText || `Hola ${d.brand.name}, quiero información sobre tus paquetes de entrenamiento.`);
    return `https://wa.me/52${d.contact.whatsappNumber}?text=${text}`;
  };

  const icons = {
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3M4 18v-5h3v6H5a1 1 0 0 1-1-1z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.4a6 6 0 0 1-3.5-1.1v6.4a4.9 4.9 0 1 1-4.2-4.9v2.5a2.5 2.5 0 1 0 1.7 2.4V3h2.5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h2.5V6h-2.5c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6h2.3l.4-3h-2.7V9.6c0-.4.3-.6.5-.6z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.3A9 9 0 1 0 12 3zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.2 7.2 0 1 1 12 19.2zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.9-.3.2-.5.1a5.9 5.9 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.4a.4.4 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.6s-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.6 2.6 0 0 0-.8 2c0 1.2.9 2.3 1 2.5s1.7 2.6 4.2 3.6a5.4 5.4 0 0 0 3.2.2 2.4 2.4 0 0 0 1.5-1.1c.2-.4.2-.7.1-.8s-.2-.1-.4-.2z"/></svg>',
  };

  // ---- Nav / brand ----
  document.getElementById('navBrand').textContent = d.brand.name;
  document.getElementById('footerBrand').textContent = d.brand.name;
  document.getElementById('footerText').textContent = d.footer.text;

  const navCta = document.getElementById('navCta');
  navCta.href = waLink();
  document.getElementById('whatsappFab').href = waLink();

  // ---- Hero ----
  document.getElementById('heroEyebrow').textContent = d.hero.eyebrow;
  document.getElementById('heroHeadline').textContent = d.hero.headline;
  document.getElementById('heroSub').textContent = d.hero.subheadline;

  const ctaPrimary = document.getElementById('heroCtaPrimary');
  ctaPrimary.textContent = d.hero.ctaPrimary;
  ctaPrimary.href = waLink();

  document.getElementById('heroCtaSecondary').textContent = d.hero.ctaSecondary;

  const statsWrap = document.getElementById('heroStats');
  d.hero.stats.forEach((s) => {
    const el = document.createElement('div');
    el.innerHTML = `<span class="hero__stat-num">${s.number}</span><span class="hero__stat-label">${s.label}</span>`;
    statsWrap.appendChild(el);
  });

  // ---- About ----
  document.getElementById('aboutTitle').textContent = d.about.title;
  document.getElementById('aboutText').textContent = d.about.text;

  const pillarsWrap = document.getElementById('aboutPillars');
  d.about.pillars.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'pillar';
    el.innerHTML = `
      <div class="pillar__icon">${icons[p.icon] || ''}</div>
      <h3>${p.title}</h3>
      <p>${p.text}</p>
    `;
    pillarsWrap.appendChild(el);
  });

  // ---- Packages ----
  const packagesWrap = document.getElementById('packagesGrid');
  d.packages.forEach((pkg) => {
    const el = document.createElement('article');
    el.className = 'package' + (pkg.accent === 'gold' ? ' package--gold' : '') + (pkg.highlight ? ' package--highlight' : '');

    const priceBlock = d.showPrices
      ? `<div class="package__price-block">
          <div class="package__price">${pkg.price}</div>
          <div class="package__price-unit">${pkg.priceUnit}</div>
        </div>`
      : `<div class="package__price-block">
          <div class="package__price" style="font-size:1.2rem;">Cotiza por WhatsApp</div>
        </div>`;

    el.innerHTML = `
      <div class="package__tag">${pkg.tag}</div>
      <h3 class="package__title">${pkg.title}</h3>
      <p class="package__subtitle">${pkg.subtitle}</p>
      ${priceBlock}
      <ul class="package__features">
        ${pkg.features.map((f) => `<li>${f}</li>`).join('')}
      </ul>
      <a class="btn btn--primary" href="${waLink(`Hola ${d.brand.name}, me interesa el paquete "${pkg.title}".`)}">Elegir este plan</a>
    `;
    packagesWrap.appendChild(el);
  });

  // ---- Routine preview ----
  document.getElementById('routineTitle').textContent = d.routinePreview.title;
  document.getElementById('routineText').textContent = d.routinePreview.text;

  const rp = d.routinePreview.sampleDay;
  const routineCard = document.getElementById('routineCard');
  routineCard.innerHTML = `
    <div class="routine__card-head">
      <div class="routine__card-label">${rp.label}</div>
      <div class="routine__card-day">${rp.dayName}</div>
      <div class="routine__card-focus">${rp.focus}</div>
    </div>
    ${rp.blocks.map((b) => `
      <div class="routine__block">
        <div class="routine__block-title">${b.group}</div>
        ${b.exercises.map((e) => `
          <div class="routine__exercise"><span>${e.name}</span><span>${e.sets}</span></div>
        `).join('')}
      </div>
    `).join('')}
  `;

  // ---- Supplements ----
  const supSection = document.getElementById('suplementos');
  if (!d.supplements.enabled) {
    supSection.remove();
  } else {
    document.getElementById('supplementsTitle').textContent = d.supplements.title;
    document.getElementById('supplementsText').textContent = d.supplements.text;
  }

  // ---- Contact ----
  document.getElementById('contactTitle').textContent = d.contact.title;
  document.getElementById('contactText').textContent = d.contact.text;

  const contactWa = document.getElementById('contactWhatsapp');
  contactWa.href = waLink();
  contactWa.innerHTML = `${icons.whatsapp} WhatsApp: ${d.contact.whatsappDisplay}`;

  const socialsWrap = document.getElementById('contactSocials');
  const socials = [
    { icon: 'tiktok', label: `TikTok · @${d.contact.tiktok}`, href: `https://www.tiktok.com/@${d.contact.tiktok}` },
    { icon: 'instagram', label: `Instagram · @${d.contact.instagram}`, href: `https://www.instagram.com/${d.contact.instagram}` },
    { icon: 'facebook', label: `Facebook · ${d.contact.facebook}`, href: d.contact.facebookUrl },
  ];
  socials.forEach((s) => {
    const a = document.createElement('a');
    a.className = 'social-link';
    a.href = s.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `${icons[s.icon]}<span>${s.label}</span>`;
    socialsWrap.appendChild(a);
  });

  // ---- Mobile nav toggle ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => nav.classList.toggle('nav--open'));
  document.getElementById('navLinks').querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => nav.classList.remove('nav--open'));
  });
})();
