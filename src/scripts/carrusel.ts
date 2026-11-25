// Carrusel en arco de la portada.
// Las tarjetas se colocan sobre una curva según su distancia al centro: la del
// centro, grande y recta; las de los lados, más pequeñas, más bajas e
// inclinadas. Se mueve arrastrando, con la rueda horizontal, con las flechas
// del teclado o solo (se para cuando el ratón está encima).

import { navigate } from 'astro:transitions/client';

const AJUSTE = {
  separacion: 1.1, // distancia entre tarjetas (en anchos de tarjeta)
  apriete: 0.11, // cuánto se juntan hacia los lados
  curva: 0.075, // cuánto bajan las tarjetas de los lados
  giro: 5, // grados de inclinación por posición
  giro3d: -9, // grados de giro en profundidad
  reduccion: 0.3, // cuánto se encogen hacia los lados
  suavidad: 0.085, // 0–1: más alto = más rápido
  autoplay: 4200, // ms entre giros automáticos (0 = sin giro automático)
  visibles: 3.2, // a partir de cuántas posiciones del centro se desvanecen
};

let parar: (() => void) | null = null;

export function iniciarCarrusel() {
  parar?.();
  parar = null;
  const raiz = document.querySelector<HTMLElement>('[data-carrusel]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!raiz || !hero) return;
  const cartas = [...raiz.querySelectorAll<HTMLAnchorElement>('.carta')];
  const n = cartas.length;
  if (!n) return;
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let pos = 0; // entra abriéndose en abanico desde el centro, igual hacia los dos lados
  let objetivo = 0;
  // Al volver de un proyecto no se repite la entrada: la rueda ya está abierta
  const volviendo = document.documentElement.dataset.direccion === 'atras';
  let entrada = sinMovimiento || volviendo ? 1 : 0; // 0 → 1 al cargar: las tarjetas se abren en abanico
  const t0 = performance.now();
  let ancho = cartas[0].offsetWidth;
  let centroActual = -1;
  let raf = 0;
  let ultimo = performance.now();
  let encima = false;
  let visible = true;
  let ultimoGesto = 0;

  // --- Arrastre ---
  let arrastre: {
    x: number; y: number; pos: number; t: number; v: number; movido: boolean; carta: HTMLAnchorElement | null;
  } | null = null;

  const envolver = (d: number) => {
    d = ((d % n) + n) % n;
    return d >= n / 2 ? d - n : d;
  };

  function colocar() {
    const e = 1 - Math.pow(1 - entrada, 3);
    for (let i = 0; i < n; i++) {
      const d = envolver(i - pos);
      const a = Math.abs(d);
      const s = Math.sign(d);
      const x = ancho * (d * AJUSTE.separacion - s * AJUSTE.apriete * Math.min(a, 4) * a) * e;
      const y = ancho * AJUSTE.curva * d * d * e + (1 - e) * 60;
      const escala = (1 / (1 + AJUSTE.reduccion * a)) * (0.7 + 0.3 * e);
      const giro = d * AJUSTE.giro * e;
      const giro3d = d * AJUSTE.giro3d * e;
      // Las de los extremos se desvanecen antes de llegar abajo, para que no se corten
      const limite = Math.min(n / 2 - 1.5, AJUSTE.visibles);
      const fuera = Math.max(0, (a - limite) / 0.8);
      // La del centro es opaca desde el primer momento; las demás aparecen al abrirse
      const aparece = a < 0.5 ? 1 : Math.min(1, e * 1.4);
      const opacidad = Math.max(0, Math.min(1, 1 - fuera)) * aparece;
      const c = cartas[i];
      c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${giro3d.toFixed(2)}deg) rotate(${giro.toFixed(2)}deg) scale(${escala.toFixed(4)})`;
      c.style.opacity = opacidad.toFixed(3);
      c.style.zIndex = String(1000 - Math.round(a * 10));
      c.style.setProperty('--luz', (1 - Math.min(a, 3) * 0.04).toFixed(3));
      c.classList.toggle('centro', a < 0.5);
      c.style.pointerEvents = opacidad < 0.2 ? 'none' : '';
    }
    const centro = ((Math.round(pos) % n) + n) % n;
    if (centro !== centroActual) {
      centroActual = centro;
      actualizarTextos(cartas[centro]);
    }
  }

  // --- Textos de arriba: cambian con un fundido al cambiar de proyecto ---
  const campos = [...hero.querySelectorAll<HTMLElement>('[data-campo]')];
  // Se funde el bloque entero (también el "/ 05" y el "·"), no cada texto por separado
  const bloque = hero.querySelector<HTMLElement>('.hero__info');
  let ultimoO = -1;
  let temporizadorTexto = 0;
  function actualizarTextos(carta: HTMLElement) {
    const o = Number(carta.dataset.o);
    if (o === ultimoO) return;
    const primeraVez = ultimoO === -1;
    ultimoO = o;
    const valores: Record<string, string> = {
      num: String(o + 1).padStart(2, '0'),
      titulo: carta.dataset.titulo ?? '',
      resumen: carta.dataset.resumen ?? '',
      anio: carta.dataset.anio ?? '',
      etiqueta: carta.dataset.etiqueta ?? '',
    };
    if (primeraVez) {
      campos.forEach((c) => (c.textContent = valores[c.dataset.campo!] ?? ''));
      return;
    }
    clearTimeout(temporizadorTexto);
    bloque?.classList.add('saliendo');
    temporizadorTexto = window.setTimeout(() => {
      campos.forEach((c) => (c.textContent = valores[c.dataset.campo!] ?? ''));
      bloque?.classList.remove('saliendo');
    }, 260);
  }

  function bucle(ahora: number) {
    const dt = Math.min(64, ahora - ultimo);
    ultimo = ahora;
    if (entrada < 1) entrada = Math.min(1, (ahora - t0) / 1400);
    if (!arrastre) {
      const k = 1 - Math.pow(1 - AJUSTE.suavidad, dt / 16.67);
      pos += (objetivo - pos) * k;
      if (Math.abs(objetivo - pos) < 0.0005) pos = objetivo;
    }
    colocar();
    raf = requestAnimationFrame(bucle);
  }

  // --- Eventos ---
  // Se puede arrastrar desde cualquier punto de la pantalla mientras la rueda
  // se vea, salvo encima de botones, enlaces o el menú.
  const esControl = (el: Element | null) =>
    !!el?.closest('a:not(.carta), button, input, textarea, select, label, .pill, [data-no-arrastrar]');

  const alBajar = (e: PointerEvent) => {
    if (e.button !== 0 || !visible || esControl(e.target as Element)) return;
    const carta = (e.target as Element).closest<HTMLAnchorElement>('.carta');
    arrastre = { x: e.clientX, y: e.clientY, pos, t: performance.now(), v: 0, movido: false, carta };
    if (e.pointerType === 'mouse') e.preventDefault(); // evita seleccionar texto o arrastrar la imagen
  };
  const alMover = (e: PointerEvent) => {
    if (!arrastre) return;
    const dx = e.clientX - arrastre.x;
    const dy = e.clientY - arrastre.y;
    if (!arrastre.movido) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        arrastre = null; // gesto vertical: es scroll, no arrastre
        return;
      }
      if (Math.abs(dx) < 6) return;
      arrastre.movido = true;
      document.documentElement.classList.add('arrastrando');
      getSelection()?.removeAllRanges();
    }
    const ahora = performance.now();
    const nueva = arrastre.pos - dx / (ancho * AJUSTE.separacion);
    arrastre.v = (nueva - pos) / Math.max(1, ahora - arrastre.t);
    arrastre.t = ahora;
    pos = objetivo = nueva;
    ultimoGesto = ahora;
  };
  const alSoltar = (e: PointerEvent) => {
    if (!arrastre) return;
    const { movido, carta, v } = arrastre;
    arrastre = null;
    document.documentElement.classList.remove('arrastrando');
    if (movido) {
      objetivo = Math.round(pos + v * 220);
      return;
    }
    if (carta && e.type === 'pointerup') pulsarCarta(carta);
  };

  /** Tarjeta de un lado → gira hasta ella. Tarjeta del centro → abre el proyecto. */
  function pulsarCarta(carta: HTMLAnchorElement) {
    const d = envolver(cartas.indexOf(carta) - pos);
    ultimoGesto = performance.now();
    if (Math.abs(d) >= 0.5) {
      objetivo = Math.round(pos + d);
      return;
    }
    abrir(carta);
  }

  function abrir(carta: HTMLAnchorElement) {
    navigate(carta.href);
  }

  // El clic del ratón ya lo gestiona alSoltar; aquí solo llega el del teclado
  const alClic = (e: MouseEvent) => {
    const carta = (e.target as Element).closest<HTMLAnchorElement>('.carta');
    if (!carta || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (e.detail === 0) pulsarCarta(carta);
  };
  let acumulado = 0;
  const alRueda = (e: WheelEvent) => {
    if (!visible || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // la rueda vertical sigue bajando la página
    e.preventDefault();
    acumulado += e.deltaX;
    if (Math.abs(acumulado) > 40) {
      objetivo = Math.round(objetivo) + Math.sign(acumulado);
      acumulado = 0;
      ultimoGesto = performance.now();
    }
  };
  const alTecla = (e: KeyboardEvent) => {
    // Flechas: si no hay nada enfocado o el foco está en la rueda
    const foco = document.activeElement;
    const enRueda = !foco || foco === document.body || raiz.contains(foco);
    if (!visible || !enRueda) return;
    if (e.key === 'ArrowRight') objetivo = Math.round(objetivo) + 1;
    else if (e.key === 'ArrowLeft') objetivo = Math.round(objetivo) - 1;
    else if (e.key === 'Enter' && document.activeElement === raiz) {
      abrir(cartas[centroActual]);
      return;
    } else return;
    e.preventDefault();
    ultimoGesto = performance.now();
  };
  // Halo: una banda de luz que pasa por el centro de las tarjetas. Se dibuja
  // una sola vez, ya desenfocada, en un lienzo pequeño que se amplía con CSS
  // (al estar borrosa no se nota). Así el navegador no recalcula un
  // desenfoque enorme cada vez que pinta la portada, y los cambios de página
  // van fluidos.
  const halo = hero.querySelector<HTMLCanvasElement>('[data-halo]');
  const REDUCCION = 4;
  function dibujarHalo() {
    if (!halo) return;
    const h = hero.getBoundingClientRect();
    const c = raiz.getBoundingClientRect();
    const ox = c.left - h.left + c.width / 2;
    const oy = c.top - h.top + c.height / 2;
    halo.width = Math.max(1, Math.round(h.width / REDUCCION));
    halo.height = Math.max(1, Math.round(h.height / REDUCCION));
    const ctx = halo.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1 / REDUCCION, 0, 0, 1 / REDUCCION, 0, 0);
    ctx.clearRect(0, 0, h.width, h.height);
    const color = getComputedStyle(halo).color;
    // Desenfoque con sombra (shadowBlur), que funciona en todos los navegadores,
    // también en iPhone (Safari no admite ctx.filter). Se dibuja la línea fuera
    // del lienzo y solo se ve su sombra borrosa, desplazada a su sitio.
    // Lo bastante lejos para que la línea original nunca caiga dentro del lienzo
    const fuera = h.width + ancho * 12;
    ctx.shadowColor = color;
    ctx.shadowBlur = ((ancho * 0.16) / REDUCCION) * 2;
    ctx.shadowOffsetX = fuera / REDUCCION;
    ctx.strokeStyle = color;
    ctx.lineWidth = ancho * 0.75;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let d = -4.5; d <= 4.51; d += 0.25) {
      const a = Math.abs(d);
      const x = ox + ancho * (d * AJUSTE.separacion - Math.sign(d) * AJUSTE.apriete * Math.min(a, 4) * a) - fuera;
      const y = oy + ancho * AJUSTE.curva * d * d;
      if (d === -4.5) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Se desvanece hacia los lados
    ctx.shadowColor = 'transparent';
    ctx.globalCompositeOperation = 'destination-in';
    const x0 = ox - ancho * 5, x1 = ox + ancho * 5;
    const grad = ctx.createLinearGradient(x0, 0, x1, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.3, 'rgba(0,0,0,0.7)');
    grad.addColorStop(0.5, 'rgba(0,0,0,1)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, h.width, h.height);
    ctx.globalCompositeOperation = 'source-over';
    halo.classList.add('listo');
  }
  // Al cambiar de tema cambia el color del halo
  const vigilaTema = new MutationObserver(() => dibujarHalo());
  vigilaTema.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  dibujarHalo();
  document.fonts?.ready.then(dibujarHalo); // al cargar las fuentes la rueda puede moverse un poco

  const alRedimensionar = () => {
    ancho = cartas[0].offsetWidth;
    dibujarHalo();
  };
  const alEntrar = () => (encima = true);
  const alSalir = () => (encima = false);

  addEventListener('pointerdown', alBajar);
  addEventListener('pointermove', alMover);
  addEventListener('pointerup', alSoltar);
  addEventListener('pointercancel', alSoltar);
  addEventListener('wheel', alRueda, { passive: false });
  addEventListener('keydown', alTecla);
  raiz.addEventListener('click', alClic);
  raiz.addEventListener('pointerenter', alEntrar);
  raiz.addEventListener('pointerleave', alSalir);
  raiz.addEventListener('focusin', alEntrar);
  raiz.addEventListener('focusout', alSalir);
  addEventListener('resize', alRedimensionar);

  // Solo se anima mientras la portada está a la vista (ahorra batería)
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) {
      ultimo = performance.now();
      raf = requestAnimationFrame(bucle);
    }
  });
  io.observe(raiz);

  // Giro automático
  const auto =
    AJUSTE.autoplay && !sinMovimiento
      ? window.setInterval(() => {
          if (!encima && visible && !arrastre && !document.hidden && performance.now() - ultimoGesto > 6000) {
            objetivo = Math.round(objetivo) + 1;
          }
        }, AJUSTE.autoplay)
      : 0;

  // Roles bajo el nombre: van cambiando
  const roles = hero.querySelector<HTMLElement>('[data-roles]');
  let rolTimer = 0;
  if (roles && !sinMovimiento) {
    const lista: string[] = JSON.parse(roles.dataset.roles || '[]');
    let k = 0;
    const span = roles.querySelector('span')!;
    rolTimer = window.setInterval(() => {
      span.classList.add('fuera');
      setTimeout(() => {
        k = (k + 1) % lista.length;
        span.textContent = lista[k];
        span.classList.remove('fuera');
        span.classList.add('entrando');
        void span.offsetWidth;
        span.classList.remove('entrando');
      }, 600);
    }, 2600);
  }

  colocar();
  raf = requestAnimationFrame(bucle);

  parar = () => {
    cancelAnimationFrame(raf);
    vigilaTema.disconnect();
    clearInterval(auto);
    clearInterval(rolTimer);
    clearTimeout(temporizadorTexto);
    io.disconnect();
    removeEventListener('resize', alRedimensionar);
    removeEventListener('pointerdown', alBajar);
    removeEventListener('pointermove', alMover);
    removeEventListener('pointerup', alSoltar);
    removeEventListener('pointercancel', alSoltar);
    removeEventListener('wheel', alRueda);
    removeEventListener('keydown', alTecla);
    document.documentElement.classList.remove('arrastrando');
  };
  document.addEventListener('astro:before-swap', () => parar?.(), { once: true });
}
