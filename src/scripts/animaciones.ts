// Animaciones de toda la web. Se vuelven a iniciar en cada cambio de página
// (la web navega sin recargar gracias a las View Transitions de Astro).

const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let limpiar: Array<() => void> = [];

export function iniciarAnimaciones() {
  limpiar.forEach((f) => f());
  limpiar = [];
  partirTitulos();
  revelarAlEntrar();
  barraDeProgreso();
  menuActivo();
  botonTema();
  botonIdioma();
  copiarEmail();
  contadores();
}

/** Parte los títulos .split en palabras para que suban una a una. */
function partirTitulos() {
  document.querySelectorAll<HTMLElement>('.split:not([data-partido])').forEach((el) => {
    const palabras = (el.textContent ?? '').trim().split(/\s+/);
    el.setAttribute('aria-label', palabras.join(' '));
    el.innerHTML = palabras
      .map((p, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${p}</span></span>`)
      .join(' ');
    el.dataset.partido = '';
  });
}

function revelarAlEntrar() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal], .split');
  if (sinMovimiento() || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  // Si se llega desde otra página (con la transición lateral), lo que ya está
  // en pantalla aparece directamente en su sitio: el único movimiento es el
  // deslizamiento, y el navegador no tiene que hacer dos cosas a la vez.
  if (document.documentElement.dataset.direccion) {
    const d = document.documentElement;
    d.classList.add('al-momento');
    els.forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) e.classList.add('is-in');
    });
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const en of entradas) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((e) => io.observe(e));
  limpiar.push(() => io.disconnect());
}

function barraDeProgreso() {
  const barra = document.querySelector<HTMLElement>('.progress');
  const topbar = document.querySelector<HTMLElement>('[data-topbar="auto"]');
  if (!barra) return;
  let pendiente = false;
  const pintar = () => {
    pendiente = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    topbar?.classList.toggle('is-visible', scrollY > innerHeight * 0.75);
  };
  const alScroll = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(pintar);
    }
  };
  pintar();
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', alScroll);
  limpiar.push(() => {
    removeEventListener('scroll', alScroll);
    removeEventListener('resize', alScroll);
  });
}

/** Subraya en el menú flotante la sección que se está viendo. */
function menuActivo() {
  const enlaces = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');
  const secciones = [...enlaces]
    .map((a) => document.getElementById(a.dataset.nav!))
    .filter((s): s is HTMLElement => !!s);
  if (!secciones.length) return;
  const io = new IntersectionObserver(
    (entradas) => {
      for (const en of entradas) {
        if (!en.isIntersecting) continue;
        enlaces.forEach((a) => a.setAttribute('aria-current', String(a.dataset.nav === en.target.id)));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  secciones.forEach((s) => io.observe(s));
  limpiar.push(() => io.disconnect());
}

function botonTema() {
  const btn = document.querySelector<HTMLButtonElement>('[data-tema]');
  if (!btn) return;
  const cambiar = () => {
    const d = document.documentElement;
    const nuevo = d.dataset.theme === 'dark' ? 'light' : 'dark';
    const aplicar = () => {
      d.dataset.theme = nuevo;
      try {
        localStorage.setItem('tema', nuevo);
      } catch {}
    };
    // Transición circular desde el botón, donde el navegador lo permite.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
    };
    if (!doc.startViewTransition || sinMovimiento()) return aplicar();
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    d.classList.add('cambiando-tema');
    const vt = doc.startViewTransition(aplicar);
    vt.ready.then(() => {
      d.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        {
          duration: 700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
    // La marca se quita cuando el navegador da la transición por acabada; si
    // se quita antes, en los últimos milisegundos entra la animación de cambio
    // de página y se ve un saltito.
    vt.finished.finally(() => d.classList.remove('cambiando-tema'));
  };
  btn.addEventListener('click', cambiar);
  limpiar.push(() => btn.removeEventListener('click', cambiar));
}

/** Al cambiar de idioma, conserva la sección en la que estabas. */
function botonIdioma() {
  const a = document.querySelector<HTMLAnchorElement>('[data-cambiar-idioma]');
  if (!a) return;
  const alPulsar = () => {
    const actual = document.querySelector<HTMLAnchorElement>('[data-nav][aria-current="true"]');
    const enInicio = document.body.hasAttribute('data-inicio');
    const hash = enInicio && actual && actual.dataset.nav !== 'inicio' ? '#' + actual.dataset.nav : '';
    a.href = a.href.split('#')[0] + hash;
    try {
      localStorage.setItem('idioma', a.hreflang);
    } catch {}
  };
  a.addEventListener('click', alPulsar);
  limpiar.push(() => a.removeEventListener('click', alPulsar));
}

function copiarEmail() {
  document.querySelectorAll<HTMLButtonElement>('[data-copiar]').forEach((btn) => {
    const etiqueta = btn.querySelector('span');
    const alPulsar = async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copiar!);
        if (!etiqueta) return;
        const antes = etiqueta.textContent;
        etiqueta.textContent = btn.dataset.copiado ?? '✓';
        setTimeout(() => (etiqueta.textContent = antes), 1800);
      } catch {}
    };
    btn.addEventListener('click', alPulsar);
    limpiar.push(() => btn.removeEventListener('click', alPulsar));
  });
}

/** Cifras que cuentan desde 0 al aparecer ("−30 %", "1.200", "x3"…). */
function contadores() {
  const els = document.querySelectorAll<HTMLElement>('[data-contador]');
  if (!els.length || sinMovimiento()) return;
  const io = new IntersectionObserver((entradas) => {
    for (const en of entradas) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target as HTMLElement;
      const texto = el.dataset.contador!;
      const m = texto.match(/\d+(?:[.,]\d+)*/);
      if (!m) continue;
      // "1.200" o "1,200" con 3 cifras detrás = separador de miles; si no, decimales
      const miles = /^\d{1,3}([.,]\d{3})+$/.test(m[0]);
      const sepMiles = miles ? m[0].replace(/\d/g, '')[0] : '';
      const partes = miles ? [m[0]] : m[0].split(/[.,]/);
      const decimales = partes.length > 1 ? partes[1].length : 0;
      const sep = m[0].includes(',') ? ',' : '.';
      const fin = parseFloat(miles ? m[0].replace(/[.,]/g, '') : m[0].replace(',', '.'));
      const formatear = (v: number) =>
        miles
          ? Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sepMiles)
          : v.toFixed(decimales).replace('.', sep);
      const t0 = performance.now();
      const paso = (ahora: number) => {
        const p = Math.min(1, (ahora - t0) / 1600);
        const v = fin * (1 - Math.pow(1 - p, 4));
        el.textContent = texto.replace(m[0], formatear(v));
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }
  });
  els.forEach((e) => io.observe(e));
  limpiar.push(() => io.disconnect());
}
