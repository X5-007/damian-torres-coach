/* =========================================================================
   ARMADOR DE RUTINAS
   =========================================================================
   Panel interno. Arma la rutina, la previsualiza y exporta los dos archivos
   que hay que subir a GitHub: index.html (lo que ve el alumno, con las
   etiquetas de WhatsApp ya escritas dentro) y rutina.json (para volver a
   editarla después).

   Tus datos de coach se leen de content.js, así que si cambias tu WhatsApp
   ahí, las rutinas nuevas lo toman solo.
   ========================================================================= */

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const LS = 'dt_rutina_borrador';
  const SITIO_DEF = 'https://x5-007.github.io/damian-torres-coach';

  const COACH = (() => {
    const d = (typeof SITE_DATA !== 'undefined' && SITE_DATA) || {};
    return {
      nombre: (d.brand && d.brand.name) || 'DAMIAN TORRES',
      rol: (d.brand && d.brand.role) || 'Coach de entrenamiento',
      iniciales: (d.brand && d.brand.initials) || 'DT',
      whatsapp: (d.contact && d.contact.whatsappNumber) || '',
    };
  })();

  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const hoy = () => new Date().toISOString().slice(0, 10);

  /* =====================================================================
     ESTADO
     ===================================================================== */
  const vacio = () => ({
    version: 1,
    alumno: '', slug: '', objetivo: '', paquete: '', vigencia: '',
    actualizado: hoy(), nota: '', sitio: SITIO_DEF,
    dias: [],
  });

  let R = vacio();
  let diaActivo = 0;
  let filtroGrupo = '';
  let busqueda = '';
  let slugTocado = false;

  /* =====================================================================
     UTILIDADES
     ===================================================================== */
  function slugificar(txt) {
    return String(txt).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  }
  function codigo() {
    const abc = 'abcdefghijkmnpqrstuvwxyz23456789';
    let s = '';
    for (let i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  }
  function slugAuto(nombre) {
    const p = slugificar(nombre).split('-').filter(Boolean);
    const base = p.length > 1 ? p[0] + '-' + p[1][0] : (p[0] || 'alumno');
    return base + '-' + codigo();
  }
  function fechaLarga(iso) {
    const p = String(iso || '').split('-');
    if (p.length !== 3) return iso || '';
    const m = ['enero','febrero','marzo','abril','mayo','junio','julio',
               'agosto','septiembre','octubre','noviembre','diciembre'][Number(p[1]) - 1];
    return m ? `${Number(p[2])} de ${m} de ${p[0]}` : iso;
  }
  function porId(id) { return EJERCICIOS.find((e) => e.id === id); }
  function urlRutina() {
    const base = (R.sitio || SITIO_DEF).replace(/\/+$/, '');
    return `${base}/rutinas/${R.slug || 'alumno'}/`;
  }

  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function guardar() {
    try { localStorage.setItem(LS, JSON.stringify(R)); } catch (e) {}
  }
  function cargar() {
    try {
      const v = localStorage.getItem(LS);
      if (v) { R = Object.assign(vacio(), JSON.parse(v)); slugTocado = !!R.slug; }
    } catch (e) {}
  }

  /* =====================================================================
     BIBLIOTECA
     ===================================================================== */
  function renderFiltros() {
    $('#filtros').innerHTML =
      `<button class="filtro${filtroGrupo === '' ? ' is-on' : ''}" data-g="">Todos</button>` +
      GRUPOS.map((g) => `<button class="filtro${filtroGrupo === g ? ' is-on' : ''}" data-g="${esc(g)}">${esc(g)}</button>`).join('');
  }

  function renderBiblio() {
    const q = busqueda.toLowerCase();
    const lista = EJERCICIOS.filter((e) =>
      (!filtroGrupo || e.grupo === filtroGrupo) &&
      (!q || e.nombre.toLowerCase().includes(q) || e.grupo.toLowerCase().includes(q)));

    $('#biblioDestino').textContent = R.dias.length
      ? `Se agrega a: ${R.dias[diaActivo] ? (R.dias[diaActivo].nombre || 'Día ' + (diaActivo + 1)) : '—'}`
      : 'Primero agrega un día';

    $('#biblioList').innerHTML = lista.length
      ? lista.map((e) => `
          <button class="bib-item" data-add="${esc(e.id)}" type="button">
            ${e.poster
              ? `<img class="bib-item__mini" src="../clips/${esc(e.poster)}" alt="" loading="lazy">`
              : `<span class="bib-item__mini"></span>`}
            <span class="bib-item__txt">
              <b>${esc(e.nombre)}</b>
              <span>${esc(e.grupo)}${e.clip ? '' : ' · <i class="bib-item__sin">sin clip</i>'}</span>
            </span>
            <span class="bib-item__add">+</span>
          </button>`).join('')
      : '<p class="vacio">Ningún ejercicio coincide.<br>Agrégalo en <code>ejercicios.js</code>.</p>';
  }

  /* =====================================================================
     DÍAS
     ===================================================================== */
  function renderDias() {
    const cont = $('#dias');
    if (!R.dias.length) {
      cont.innerHTML = '<p class="vacio">Todavía no hay días. Agrega el primero abajo.</p>';
      return;
    }
    cont.innerHTML = R.dias.map((dia, i) => {
      const bloques = agrupar(dia.ejercicios || []);
      const cuerpo = bloques.length
        ? bloques.map((bl) => `
            <div class="bloque-ed">
              <p class="bloque-ed__t">${esc(bl.grupo)}</p>
              ${bl.ejercicios.map((ej) => filaEjercicio(ej, i, (dia.ejercicios || []).indexOf(ej))).join('')}
            </div>`).join('')
        : '<p class="dia-vacio">Elige ejercicios de la biblioteca para este día.</p>';

      return `
        <article class="dia-card${i === diaActivo ? ' is-activo' : ''}" data-dia="${i}">
          <header class="dia-card__head" data-activar="${i}">
            <span class="dia-card__n">${i + 1}</span>
            <span class="dia-card__inputs">
              <input class="input" data-campo="nombre" data-dia="${i}" value="${esc(dia.nombre || '')}" placeholder="Lunes">
              <input class="input" data-campo="enfoque" data-dia="${i}" value="${esc(dia.enfoque || '')}" placeholder="Pecho / Tríceps">
            </span>
            <span class="dia-card__tools">
              <button class="icon-btn" data-mover-dia="${i}" data-dir="-1" title="Subir" type="button">↑</button>
              <button class="icon-btn" data-mover-dia="${i}" data-dir="1" title="Bajar" type="button">↓</button>
              <button class="icon-btn icon-btn--del" data-borrar-dia="${i}" title="Eliminar día" type="button">✕</button>
            </span>
          </header>
          <div class="dia-card__body">${cuerpo}</div>
        </article>`;
    }).join('');
  }

  function filaEjercicio(ej, di, ei) {
    return `
      <div class="ej-row">
        ${ej.poster
          ? `<img class="ej-row__mini" src="../clips/${esc(ej.poster)}" alt="" loading="lazy">`
          : `<span class="ej-row__mini"></span>`}
        <div class="ej-row__main">
          <div class="ej-row__name">${esc(ej.nombre)}</div>
          <div class="ej-row__campos">
            <input class="input" data-ej="${di}:${ei}" data-campo="series"   value="${esc(ej.series || '')}"   placeholder="3" aria-label="Series">
            <input class="input" data-ej="${di}:${ei}" data-campo="reps"     value="${esc(ej.reps || '')}"     placeholder="10-12" aria-label="Repeticiones">
            <input class="input" data-ej="${di}:${ei}" data-campo="descanso" value="${esc(ej.descanso || '')}" placeholder="60 s" aria-label="Descanso">
            <input class="input" data-ej="${di}:${ei}" data-campo="nota"     value="${esc(ej.nota || '')}"     placeholder="Nota de técnica" aria-label="Nota">
          </div>
        </div>
        <div class="ej-row__tools">
          <button class="icon-btn" data-mover-ej="${di}:${ei}" data-dir="-1" title="Subir" type="button">↑</button>
          <button class="icon-btn" data-mover-ej="${di}:${ei}" data-dir="1" title="Bajar" type="button">↓</button>
          <button class="icon-btn icon-btn--del" data-borrar-ej="${di}:${ei}" title="Quitar" type="button">✕</button>
        </div>
      </div>`;
  }

  // Agrupa los ejercicios de un día por grupo muscular,
  // en el orden en que aparece cada grupo por primera vez.
  function agrupar(ejercicios) {
    const orden = [];
    const mapa = new Map();
    ejercicios.forEach((ej) => {
      if (!mapa.has(ej.grupo)) { mapa.set(ej.grupo, []); orden.push(ej.grupo); }
      mapa.get(ej.grupo).push(ej);
    });
    return orden.map((g) => ({ grupo: g, ejercicios: mapa.get(g) }));
  }

  /* =====================================================================
     PUBLICAR
     ===================================================================== */
  function renderPublicar() {
    $('#linkFinal').textContent = urlRutina();
    $('#slugAviso').textContent = R.slug ? '' : 'se genera solo';
  }

  function datosExport() {
    return {
      version: 1,
      alumno: R.alumno.trim(),
      slug: R.slug.trim(),
      objetivo: R.objetivo.trim(),
      paquete: R.paquete.trim(),
      vigencia: R.vigencia.trim(),
      actualizado: R.actualizado,
      nota: R.nota.trim(),
      sitio: (R.sitio || SITIO_DEF).replace(/\/+$/, ''),
      coach: COACH,
      dias: R.dias.map((dia) => ({
        nombre: dia.nombre || '',
        enfoque: dia.enfoque || '',
        bloques: agrupar(dia.ejercicios || []).map((bl) => ({
          grupo: bl.grupo,
          ejercicios: bl.ejercicios.map((ej) => ({
            id: ej.id, nombre: ej.nombre, grupo: ej.grupo,
            clip: ej.clip || '', poster: ej.poster || '',
            series: ej.series || '', reps: ej.reps || '',
            descanso: ej.descanso || '', nota: ej.nota || '',
          })),
        })),
      })),
    };
  }

  /* ---------------------------------------------------------------------
     PLANTILLA DE LA PÁGINA DEL ALUMNO
     Aquí se escriben las etiquetas Open Graph con los datos de este alumno,
     para que el link se vea bien al mandarlo por WhatsApp.
     --------------------------------------------------------------------- */
  function plantilla(datos, extraHead) {
    const url = `${datos.sitio}/rutinas/${datos.slug}/`;
    const nDias = datos.dias.length;
    const enfoques = datos.dias.map((d) => d.enfoque || d.nombre).filter(Boolean).join(' · ');

    const titulo = `Rutina de ${datos.alumno || 'entrenamiento'} — ${datos.coach.nombre}`;
    let desc = `${nDias} ${nDias === 1 ? 'día' : 'días'} de entrenamiento`;
    if (enfoques) desc += `: ${enfoques}`;
    desc += `. Con video de cada ejercicio. Actualizada el ${fechaLarga(datos.actualizado)}.`;
    if (desc.length > 200) desc = desc.slice(0, 197) + '…';

    const json = JSON.stringify(datos, null, 2).replace(/</g, '\\u003c');

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#171512">
<meta name="robots" content="noindex, nofollow">

<!-- Vista previa al compartir por WhatsApp -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(datos.coach.nombre)} — ${esc(datos.coach.rol)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(datos.sitio)}/rutinas/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Rutina personalizada de ${esc(datos.coach.nombre)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(datos.sitio)}/rutinas/og.jpg">
${extraHead || ''}
<link rel="icon" href="../../img/perfil.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../base/rutina.css">
</head>
<body>

<header class="topbar" id="topbar">
  <div class="wrap topbar__inner">
    <img class="topbar__avatar" src="../../img/perfil.png" alt="">
    <div>
      <div class="topbar__name" id="topName"></div>
      <div class="topbar__role" id="topRole"></div>
    </div>
  </div>
</header>

<section class="ficha">
  <div class="wrap ficha__inner">
    <p class="eyebrow">Plan de entrenamiento</p>
    <h1 id="alumno"></h1>
    <p class="ficha__sub" id="resumen"></p>
    <div class="ficha__chips" id="chips"></div>
    <div class="nota-coach" id="notaCoach"></div>
  </div>
</section>

<nav class="dias" id="dias" aria-label="Días de entrenamiento">
  <div class="wrap dias__scroll" id="diasTabs"></div>
</nav>

<div id="diasPanels"></div>

<footer class="pie">
  <div class="wrap">
    <span class="pie__mark" id="pieMark"></span>
    <strong id="pieName"></strong>
    <p id="pieText"></p>
  </div>
</footer>

<a class="wa-fab" id="waFab" href="#"></a>

<script type="application/json" id="datos">
${json}
</script>
<script src="../base/rutina.js"></script>
</body>
</html>
`;
  }

  /* =====================================================================
     DESCARGAS Y VISTA PREVIA
     ===================================================================== */
  function descargar(nombre, texto, tipo) {
    const blob = new Blob([texto], { type: tipo + ';charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function vistaPrevia() {
    if (!validar()) return;
    // <base> apunta a una carpeta hermana dentro de /rutinas/ para que las
    // rutas relativas (../base/, ../clips/) resuelvan igual que en la real.
    const base = new URL('../vista-previa/', location.href).href;
    const html = plantilla(datosExport(), `<base href="${base}">`);
    const w = window.open('', '_blank');
    if (!w) { toast('Tu navegador bloqueó la ventana emergente'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function validar() {
    if (!R.alumno.trim()) { toast('Ponle el nombre del alumno'); $('#fAlumno').focus(); return false; }
    if (!R.slug.trim()) { R.slug = slugAuto(R.alumno); $('#fSlug').value = R.slug; }
    if (!R.dias.length) { toast('Agrega al menos un día'); return false; }
    return true;
  }

  /* =====================================================================
     EVENTOS
     ===================================================================== */
  // --- campos del alumno ---
  const campos = {
    fAlumno: 'alumno', fSlug: 'slug', fObjetivo: 'objetivo', fPaquete: 'paquete',
    fVigencia: 'vigencia', fFecha: 'actualizado', fNota: 'nota', fSitio: 'sitio',
  };
  Object.keys(campos).forEach((id) => {
    $('#' + id).addEventListener('input', (e) => {
      R[campos[id]] = e.target.value;
      if (id === 'fSlug') slugTocado = true;
      if (id === 'fAlumno' && !slugTocado) {
        R.slug = slugAuto(R.alumno);
        $('#fSlug').value = R.slug;
      }
      renderPublicar();
      guardar();
    });
  });

  $('#btnSlug').addEventListener('click', () => {
    R.slug = slugAuto(R.alumno || 'alumno');
    slugTocado = true;
    $('#fSlug').value = R.slug;
    renderPublicar();
    guardar();
  });

  // --- biblioteca ---
  $('#buscar').addEventListener('input', (e) => { busqueda = e.target.value; renderBiblio(); });
  $('#filtros').addEventListener('click', (e) => {
    const b = e.target.closest('.filtro');
    if (!b) return;
    filtroGrupo = b.dataset.g;
    renderFiltros();
    renderBiblio();
  });
  $('#biblioList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    if (!R.dias.length) { toast('Primero agrega un día'); return; }
    const base = porId(b.dataset.add);
    if (!base) return;
    R.dias[diaActivo].ejercicios.push({
      id: base.id, nombre: base.nombre, grupo: base.grupo,
      clip: base.clip || '', poster: base.poster || '',
      series: '3', reps: '10-12', descanso: '60 s', nota: '',
    });
    renderDias(); guardar();
    toast(`${base.nombre} → ${R.dias[diaActivo].nombre || 'Día ' + (diaActivo + 1)}`);
  });

  // --- días ---
  $('#btnDia').addEventListener('click', () => {
    const nombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    R.dias.push({ nombre: nombres[R.dias.length] || 'Día ' + (R.dias.length + 1), enfoque: '', ejercicios: [] });
    diaActivo = R.dias.length - 1;
    renderDias(); renderBiblio(); guardar();
  });

  $('#dias').addEventListener('click', (e) => {
    const act = e.target.closest('[data-activar]');
    const movD = e.target.closest('[data-mover-dia]');
    const delD = e.target.closest('[data-borrar-dia]');
    const movE = e.target.closest('[data-mover-ej]');
    const delE = e.target.closest('[data-borrar-ej]');

    if (movD) {
      const i = +movD.dataset.moverDia, j = i + Number(movD.dataset.dir);
      if (j < 0 || j >= R.dias.length) return;
      [R.dias[i], R.dias[j]] = [R.dias[j], R.dias[i]];
      if (diaActivo === i) diaActivo = j; else if (diaActivo === j) diaActivo = i;
      renderDias(); renderBiblio(); guardar(); return;
    }
    if (delD) {
      const i = +delD.dataset.borrarDia;
      if (!confirm(`¿Eliminar ${R.dias[i].nombre || 'este día'} y sus ejercicios?`)) return;
      R.dias.splice(i, 1);
      diaActivo = Math.max(0, Math.min(diaActivo, R.dias.length - 1));
      renderDias(); renderBiblio(); guardar(); return;
    }
    if (movE) {
      const [di, ei] = movE.dataset.moverEj.split(':').map(Number);
      const lista = R.dias[di].ejercicios, ej = lista[ei];
      const dir = Number(movE.dataset.dir);
      // se mueve dentro de su propio grupo muscular
      const mismos = lista.map((x, k) => (x.grupo === ej.grupo ? k : -1)).filter((k) => k >= 0);
      const pos = mismos.indexOf(ei), destino = mismos[pos + dir];
      if (destino === undefined) return;
      [lista[ei], lista[destino]] = [lista[destino], lista[ei]];
      renderDias(); guardar(); return;
    }
    if (delE) {
      const [di, ei] = delE.dataset.borrarEj.split(':').map(Number);
      R.dias[di].ejercicios.splice(ei, 1);
      renderDias(); guardar(); return;
    }
    if (act) {
      diaActivo = +act.dataset.activar;
      renderDias(); renderBiblio();
    }
  });

  $('#dias').addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.ej) {
      const [di, ei] = t.dataset.ej.split(':').map(Number);
      R.dias[di].ejercicios[ei][t.dataset.campo] = t.value;
      guardar();
    } else if (t.dataset.dia !== undefined && t.dataset.campo) {
      R.dias[+t.dataset.dia][t.dataset.campo] = t.value;
      guardar();
      if (t.dataset.campo === 'nombre') renderBiblio();
    }
  });

  // --- acciones ---
  $('#btnVista').addEventListener('click', vistaPrevia);

  $('#btnExportar').addEventListener('click', () => {
    if (!validar()) return;
    $('#mCarpeta').textContent = `rutinas/${R.slug}/`;
    $('#mRuta').textContent = `rutinas/${R.slug}/`;
    $('#modal').hidden = false;
    renderPublicar();
  });

  $('#btnFileHtml').addEventListener('click', () =>
    descargar('index.html', plantilla(datosExport()), 'text/html'));
  $('#btnFileJson').addEventListener('click', () =>
    descargar('rutina.json', JSON.stringify(datosExport(), null, 2), 'application/json'));

  $('#modalX').addEventListener('click', () => { $('#modal').hidden = true; });
  $('#modal').addEventListener('click', (e) => { if (e.target === $('#modal')) $('#modal').hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('#modal').hidden = true; });

  async function copiar(texto, ok) {
    try {
      await navigator.clipboard.writeText(texto);
      toast(ok);
    } catch (e) {
      prompt('Copia este texto:', texto);
    }
  }
  $('#btnCopiarLink').addEventListener('click', () => copiar(urlRutina(), 'Link copiado'));
  $('#btnWa').addEventListener('click', () => {
    const nombre = (R.alumno || '').trim().split(' ')[0] || 'crack';
    const msg = `Hola ${nombre}, aquí está tu rutina 💪\n` +
      `Está dividida por días y cada ejercicio trae su video.\n\n${urlRutina()}\n\n` +
      `Cualquier duda me escribes.`;
    copiar(msg, 'Mensaje copiado, pégalo en WhatsApp');
  });

  // --- importar / limpiar ---
  $('#btnImportar').addEventListener('click', () => $('#fileImport').click());
  $('#fileImport').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const d = JSON.parse(fr.result);
        R = Object.assign(vacio(), {
          alumno: d.alumno || '', slug: d.slug || '', objetivo: d.objetivo || '',
          paquete: d.paquete || '', vigencia: d.vigencia || '',
          actualizado: d.actualizado || hoy(), nota: d.nota || '',
          sitio: d.sitio || SITIO_DEF,
          // vuelve de bloques a lista plana para poder editar
          dias: (d.dias || []).map((dia) => ({
            nombre: dia.nombre || '', enfoque: dia.enfoque || '',
            ejercicios: (dia.bloques || []).reduce((a, bl) => a.concat(bl.ejercicios || []), []),
          })),
        });
        slugTocado = true;
        diaActivo = 0;
        pintarTodo();
        guardar();
        toast(`Rutina de ${R.alumno || 'alumno'} cargada`);
      } catch (err) {
        toast('Ese archivo no es un rutina.json válido');
      }
      e.target.value = '';
    };
    fr.readAsText(f);
  });

  $('#btnLimpiar').addEventListener('click', () => {
    if (!confirm('¿Vaciar el armador y empezar de cero? Se pierde el borrador actual.')) return;
    R = vacio();
    diaActivo = 0;
    slugTocado = false;
    try { localStorage.removeItem(LS); } catch (e) {}
    pintarTodo();
  });

  /* =====================================================================
     ARRANQUE
     ===================================================================== */
  function pintarTodo() {
    $('#fAlumno').value = R.alumno;
    $('#fSlug').value = R.slug;
    $('#fObjetivo').value = R.objetivo;
    $('#fPaquete').value = R.paquete;
    $('#fVigencia').value = R.vigencia;
    $('#fFecha').value = R.actualizado;
    $('#fNota').value = R.nota;
    $('#fSitio').value = R.sitio;
    renderFiltros();
    renderBiblio();
    renderDias();
    renderPublicar();
  }

  cargar();
  pintarTodo();
})();
