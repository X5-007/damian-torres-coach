/* =========================================================================
   VISTA DE RUTINA DEL ALUMNO — motor de render
   =========================================================================
   Lee los datos que están incrustados dentro del index.html de cada alumno
   (<script type="application/json" id="datos">) y dibuja la página.

   No necesitas tocar este archivo para cambiar una rutina.
   ========================================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const esc = (v) =>
    String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const ICONS = {
    objetivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
    calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
    paquete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
    nota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    pesa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 10v4M2.5 9v6M7 8v8M17 8v8M21.5 9v6M20 10v4M7 12h10"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.3A9 9 0 1 0 12 3zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.2 7.2 0 1 1 12 19.2zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.9-.3.2-.5.1a5.9 5.9 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.4a.4.4 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.6s-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.6 2.6 0 0 0-.8 2c0 1.2.9 2.3 1 2.5s1.7 2.6 4.2 3.6a5.4 5.4 0 0 0 3.2.2 2.4 2.4 0 0 0 1.5-1.1c.2-.4.2-.7.1-.8s-.2-.1-.4-.2z"/></svg>',
  };

  // ---- Datos -----------------------------------------------------------
  const raw = document.getElementById('datos');
  if (!raw) return;

  let d;
  try {
    d = JSON.parse(raw.textContent);
  } catch (e) {
    document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">No se pudieron leer los datos de esta rutina.</p>';
    return;
  }

  const coach = d.coach || {};
  const dias = Array.isArray(d.dias) ? d.dias : [];

  const fechaLarga = (iso) => {
    if (!iso) return '';
    const partes = String(iso).split('-');
    if (partes.length !== 3) return iso;
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const m = meses[Number(partes[1]) - 1];
    return m ? `${Number(partes[2])} de ${m} de ${partes[0]}` : iso;
  };

  const waLink = (texto) => {
    const num = String(coach.whatsapp || '').replace(/\D/g, '');
    if (!num) return '';
    return `https://wa.me/52${num}?text=${encodeURIComponent(texto)}`;
  };

  // ---- Barra de marca --------------------------------------------------
  $('#topName').textContent = coach.nombre || '';
  $('#topRole').textContent = coach.rol || '';

  const topbar = $('#topbar');
  const onScroll = () => topbar.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Ficha del alumno ------------------------------------------------
  $('#alumno').textContent = d.alumno || 'Tu rutina';
  document.title = `Rutina de ${d.alumno || 'entrenamiento'} — ${coach.nombre || 'Damian Torres'}`;

  const resumen = [];
  if (dias.length) resumen.push(`${dias.length} ${dias.length === 1 ? 'día' : 'días'} de entrenamiento`);
  const totalEj = dias.reduce(
    (a, dia) => a + (dia.bloques || []).reduce((b, bl) => b + (bl.ejercicios || []).length, 0), 0);
  if (totalEj) resumen.push(`${totalEj} ejercicios`);
  $('#resumen').textContent = resumen.join(' · ');

  const chips = [];
  if (d.objetivo) chips.push({ icon: 'objetivo', txt: d.objetivo, solid: true });
  if (d.paquete) chips.push({ icon: 'paquete', txt: d.paquete });
  if (d.vigencia) chips.push({ icon: 'calendario', txt: d.vigencia });
  if (d.actualizado) chips.push({ icon: 'nota', txt: 'Actualizada el ' + fechaLarga(d.actualizado) });

  $('#chips').innerHTML = chips
    .map((c) => `<span class="chip${c.solid ? ' chip--solid' : ''}">${ICONS[c.icon]}${esc(c.txt)}</span>`)
    .join('');

  if (d.nota) {
    $('#notaCoach').innerHTML = `${ICONS.nota}<p>${esc(d.nota)}</p>`;
  } else {
    $('#notaCoach').remove();
  }

  // ---- Días ------------------------------------------------------------
  const tabsWrap = $('#diasTabs');
  const panelsWrap = $('#diasPanels');

  if (!dias.length) {
    $('#dias').remove();
    panelsWrap.innerHTML = '<div class="wrap" style="padding-block:40px"><p>Esta rutina todavía no tiene días cargados.</p></div>';
  } else {
    tabsWrap.innerHTML = dias
      .map((dia, i) => `
        <button class="dia-tab${i === 0 ? ' is-active' : ''}" data-dia="${i}" type="button">
          <strong>${esc(dia.nombre || 'Día ' + (i + 1))}</strong>
          ${dia.enfoque ? `<span>${esc(dia.enfoque)}</span>` : ''}
        </button>`)
      .join('');

    panelsWrap.innerHTML = dias.map((dia, i) => renderDia(dia, i)).join('');

    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.dia-tab');
      if (!btn) return;
      const idx = btn.dataset.dia;
      tabsWrap.querySelectorAll('.dia-tab').forEach((b) => b.classList.toggle('is-active', b === btn));
      panelsWrap.querySelectorAll('.dia').forEach((p) => { p.hidden = p.dataset.dia !== idx; });
      btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      window.scrollTo({ top: panelsWrap.offsetTop - 110, behavior: 'smooth' });
      arrancarVisibles();
    });
  }

  function renderDia(dia, i) {
    const bloques = (dia.bloques || []).filter((b) => (b.ejercicios || []).length);
    let n = 0;

    const cuerpo = bloques.map((bl) => `
      <section class="bloque">
        <h3 class="bloque__title">${esc(bl.grupo || 'Ejercicios')}</h3>
        <div class="ejercicios">
          ${(bl.ejercicios || []).map((ej) => renderEjercicio(ej, ++n)).join('')}
        </div>
      </section>`).join('');

    return `
      <section class="dia" data-dia="${i}"${i === 0 ? '' : ' hidden'}>
        <div class="wrap">
          <header class="dia__head">
            <p class="eyebrow">Día ${i + 1} de ${dias.length}</p>
            <h2>${esc(dia.nombre || 'Día ' + (i + 1))}</h2>
            ${dia.enfoque ? `<p>${esc(dia.enfoque)}</p>` : ''}
          </header>
          ${cuerpo || '<p>Día de descanso.</p>'}
        </div>
      </section>`;
  }

  function renderEjercicio(ej, n) {
    const media = ej.clip
      ? `<video class="ej__video" muted loop playsinline preload="none" disablepictureinpicture
                ${ej.poster ? `poster="../clips/${esc(ej.poster)}"` : ''}
                data-src="../clips/${esc(ej.clip)}"></video>`
      : (ej.poster
          ? `<img src="../clips/${esc(ej.poster)}" alt="" loading="lazy">`
          : `<div class="ej__media--vacio" style="width:100%;height:100%">${ICONS.pesa}</div>`);

    const datos = [
      ej.series ? `<span class="dato dato--series"><b>${esc(ej.series)}</b><span>series</span></span>` : '',
      ej.reps ? `<span class="dato"><b>${esc(ej.reps)}</b><span>reps</span></span>` : '',
      ej.descanso ? `<span class="dato"><b>${esc(ej.descanso)}</b><span>descanso</span></span>` : '',
    ].filter(Boolean).join('');

    return `
      <article class="ej">
        <div class="ej__media">
          <span class="ej__num">${n}</span>
          ${media}
        </div>
        <div class="ej__body">
          <h4 class="ej__name">${esc(ej.nombre || 'Ejercicio')}</h4>
          ${datos ? `<div class="ej__datos">${datos}</div>` : ''}
          ${ej.nota ? `<div class="ej__nota">${ICONS.nota}<span>${esc(ej.nota)}</span></div>` : ''}
        </div>
      </article>`;
  }

  // ---- Videos: cargar y reproducir solo los que se ven ------------------
  // Así la rutina no consume datos móviles de más.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function activar(video) {
    if (!video.src) video.src = video.dataset.src;
    const p = video.play();
    if (p && p.then) {
      p.then(() => video.parentElement.classList.remove('is-bloqueado'))
       .catch(() => video.parentElement.classList.add('is-bloqueado'));
    }
  }

  // Un toque reproduce el clip cuando el navegador no lo dejó arrancar solo.
  document.addEventListener('click', (e) => {
    const media = e.target.closest('.ej__media.is-bloqueado');
    if (!media) return;
    const v = media.querySelector('video');
    if (v) activar(v);
  });

  let observer = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) activar(v);
        else if (!v.paused) v.pause();
      });
    }, { rootMargin: '120px 0px', threshold: 0.2 });
  }

  function arrancarVisibles() {
    document.querySelectorAll('.dia:not([hidden]) .ej__video').forEach((v) => {
      if (observer) observer.observe(v);
      else if (!reduceMotion) activar(v);
    });
  }
  arrancarVisibles();

  // ---- Botón de WhatsApp y pie -----------------------------------------
  const wa = $('#waFab');
  const link = waLink(`Hola ${coach.nombre || ''}, tengo una duda con mi rutina.`);
  if (link) {
    wa.href = link;
    wa.innerHTML = `${ICONS.whatsapp}<span>Dudas con tu rutina</span>`;
  } else {
    wa.remove();
  }

  $('#pieMark').textContent = coach.iniciales || 'DT';
  $('#pieName').textContent = coach.nombre || '';
  $('#pieText').textContent = coach.rol || '';
})();
