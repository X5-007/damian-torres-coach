/* =========================================================================
   CONTENIDO DEL SITIO — edita solo este archivo
   =========================================================================
   Aquí vive TODO el texto, precios y contactos de la página.
   No necesitas tocar index.html, style.css ni script.js para actualizar
   información: cambia los valores de este archivo, guarda, y listo.

   Reglas rápidas:
   - Todo lo que está entre comillas " " es texto que se ve en la página.
   - No borres las comas "," al final de cada línea.
   - Para "apagar" una sección (ej. si aún no tienes suplementos) usa
     enabled: false y esa sección no se mostrará.
   ========================================================================= */

const SITE_DATA = {

  // ---------------------------------------------------------------------
  // MARCA / IDENTIDAD
  // ---------------------------------------------------------------------
  brand: {
    name: "DAMIAN TORRES",
    role: "Coach de entrenamiento",
    initials: "DT",
  },

  // ---------------------------------------------------------------------
  // HERO (primer bloque que se ve al entrar)
  // ---------------------------------------------------------------------
  hero: {
    eyebrow: "Entrenamiento personal · presencial y a distancia",
    headline: "Tu cuerpo cambia cuando tu entrenamiento tiene un plan.",
    subheadline:
      "Rutinas hechas a tu medida, seguimiento real y corrección de técnica. Nada genérico, nada improvisado.",
    ctaPrimary: "Escríbeme por WhatsApp",
    ctaSecondary: "Ver paquetes",
    stats: [
      { number: "1 a 1", label: "Enfoque personalizado" },
      { number: "24/7", label: "Atención por línea" },
      { number: "100%", label: "Rutinas a tu medida" },
    ],
  },

  // ---------------------------------------------------------------------
  // SOBRE MÍ / POR QUÉ ENTRENAR CONMIGO
  // ---------------------------------------------------------------------
  about: {
    title: "Entrenamiento serio, resultados reales.",
    text:
      "No entreno a 5 personas a la vez ni te doy una rutina de internet. Diseño cada plan según tu objetivo, tu nivel y tu progreso, y le doy seguimiento de cerca para que cada sesión valga la pena.",
    pillars: [
      {
        icon: "target",
        title: "Rutinas a tu medida",
        text: "Cada plan se construye según tu objetivo: bajar grasa, ganar músculo o ambos.",
      },
      {
        icon: "chart",
        title: "Seguimiento de progreso",
        text: "Medición de peso, grasa y medidas para saber que el plan está funcionando.",
      },
      {
        icon: "headset",
        title: "Atención constante",
        text: "Dudas, ajustes y corrección de técnica sin dejarte solo entre sesiones.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // PAQUETES DE ENTRENAMIENTO
  // ---------------------------------------------------------------------
  // showPrices: true  -> se muestran los precios (como en tus diseños)
  // showPrices: false -> se ocultan los precios y solo se muestra
  //                      "Cotiza por WhatsApp" (por si cambias de opinión)
  showPrices: true,

  packages: [
    {
      tag: "Rutina personalizada",
      title: "Rutina Enfocada",
      subtitle: "Tus objetivos, tu transformación.",
      price: "$349 MXN",
      priceUnit: "Único pago",
      accent: "red",
      features: [
        "Asesoramiento inicial",
        "Rutina personal (bajar grasa / aumentar músculo)",
        "Entrenamiento dinámico",
        "Atención 24/7 por línea (primera semana con la rutina)",
        "Corrección de técnica",
      ],
    },
    {
      tag: "Entrenamiento a distancia",
      title: "A Distancia",
      subtitle: "Totalmente enfocado, estés donde estés.",
      price: "$1,199 MXN",
      priceUnit: "2 meses",
      accent: "gold",
      features: [
        "Asesoramiento inicial",
        "Rutina personalizada",
        "Revisión cada 2 semanas (cambio de rutina)",
        "Atención por línea durante los 2 meses",
        "Entrenamiento dinámico",
        "Seguimiento de progreso",
        "Corrección de técnica",
        "Recomendación suplementaria",
      ],
    },
    {
      tag: "Exclusividad y enfoque en ti",
      title: "Entrenamiento Personal",
      subtitle: "5 días a la semana, enfoque 1 a 1.",
      price: "$799 MXN",
      priceUnit: "Semanal",
      accent: "red",
      features: [
        "Asesoramiento inicial",
        "Enfoque individual, no grupal",
        "5 días a la semana · 2 hrs por sesión",
        "Voy a tu gimnasio más cercano",
        "Rutina personalizada",
        "Entrenamiento y corrección presencial",
        "Atención en línea 24/7",
        "Medición semanal de grasa, peso y medidas",
      ],
    },
    {
      tag: "VIP · el máximo enfoque",
      title: "Atención VIP Exclusiva",
      subtitle: "Prioridad, seguimiento y resultados trimestrales.",
      price: "$1,199 MXN",
      priceUnit: "Semanal",
      accent: "gold",
      highlight: true,
      features: [
        "Asesoramiento inicial",
        "Atención prioritaria",
        "5 días a la semana · 2 hrs por sesión",
        "Voy a tu gimnasio más cercano",
        "Rutina personalizada",
        "Entrenamiento y corrección presencial",
        "Atención en línea 24/7",
        "Medición semanal de grasa, peso y medidas",
        "+ Seguimiento de progreso durante 3 meses",
        "+ Sugerencias alimenticias (no dieta)",
      ],
    },
  ],

  // ---------------------------------------------------------------------
  // VISTA PREVIA DE UNA RUTINA (para generar confianza)
  // ---------------------------------------------------------------------
  routinePreview: {
    title: "Así se ve una rutina real.",
    text:
      "Cada plan se entrega organizado por día, grupo muscular y series, para que sepas exactamente qué hacer en cada sesión.",
    sampleDay: {
      label: "Día 1 / 6 · Ejemplo",
      dayName: "Lunes",
      focus: "Pecho alto / hombro / tríceps",
      blocks: [
        {
          group: "Pecho",
          exercises: [
            { name: "Press banca en máquina", sets: "3×8-10" },
            { name: "Press inclinado en máquina", sets: "3×10-12" },
          ],
        },
        {
          group: "Hombro",
          exercises: [
            { name: "Press militar en Smith", sets: "2×8-10" },
            { name: "Laterales con mancuernas", sets: "3×10-15" },
          ],
        },
        {
          group: "Tríceps",
          exercises: [
            { name: "Press francés", sets: "3×8-12" },
            { name: "Jalón de polea para tríceps", sets: "2×10-15" },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------
  // CATÁLOGO DE SUPLEMENTOS (apaga con enabled: false hasta que lo tengas)
  // ---------------------------------------------------------------------
  supplements: {
    enabled: true,
    title: "Catálogo de suplementos",
    text: "Muy pronto. Estoy armando mi catálogo de suplementos recomendados para complementar tu entrenamiento.",
  },

  // ---------------------------------------------------------------------
  // CONTACTO
  // ---------------------------------------------------------------------
  contact: {
    title: "Empecemos.",
    text: "Escríbeme por WhatsApp para resolver tus dudas o elegir tu paquete.",
    whatsappNumber: "3131536627",   // solo dígitos, sin espacios ni guiones (10 dígitos, MX)
    whatsappDisplay: "313 - 153 - 6627",
    tiktok: "damian.torres2008",
    instagram: "damian.torres2008",
    facebook: "Damian Torres",
    facebookUrl: "https://www.facebook.com/", // agrega el link exacto de tu página cuando lo tengas
  },

  footer: {
    text: "Entrenamiento personalizado, presencial y a distancia.",
  },
};
