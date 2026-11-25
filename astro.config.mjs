// @ts-check
import { defineConfig } from 'astro/config';

// Cuando publiques la web, cambia "site" por tu dirección real
// (p. ej. https://tuusuario.github.io).
export default defineConfig({
  site: 'https://mvaquero01.github.io',
  trailingSlash: 'ignore',
  // Sin la barra de herramientas de Astro que sale abajo al previsualizar
  devToolbar: { enabled: false },
  // Las páginas se descargan al pasar el ratón por un enlace, así al pulsar
  // la transición empieza al momento
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
