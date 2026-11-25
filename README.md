# Portafolio de Mario

Web personal bilingüe (español / inglés) hecha con [Astro](https://astro.build).

## Ver la web en tu ordenador

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:4321
```

Los cambios se ven al momento al guardar cualquier archivo.

## Dónde está cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, email, LinkedIn, GitHub, foto, texto "Sobre mí" | `src/data/perfil.json` |
| Experiencia | `src/data/experiencia.json` |
| Formación | `src/data/formacion.json` |
| Habilidades | `src/data/habilidades.json` |
| Proyectos | `src/content/proyectos/es/` y `src/content/proyectos/en/` |
| Textos fijos (menú, botones) | `src/i18n/es.json` y `src/i18n/en.json` |
| Colores y fuentes | arriba del todo en `src/styles/global.css` |
| CV en PDF | `public/cv/CV_Mario_ES.pdf` y `public/cv/CV_Mario_EN.pdf` |

En los `.json`, los campos con `"es"` y `"en"` llevan el texto en cada idioma.

## Dónde van las fotos

```
fotos-originales/              ← tus fotos tal cual, a máxima calidad (no se publican)
  perfil/
  proyectos/<proyecto>/
public/img/                    ← las versiones que usa la web (ligeras)
  perfil/foto.jpg
  proyectos/<proyecto>/portada.jpg
  proyectos/<proyecto>/foto-1.jpg, foto-2.jpg…
```

Hay una carpeta por proyecto, con el mismo nombre que su archivo `.md`
(`contador-geiger`, `abridor-botellas-ansys`, `tirador-alarma-metro`,
`linea-fabricacion-moneda`, `concurso-sne-almaraz`). Deja las fotos nuevas en
`fotos-originales/proyectos/<proyecto>/` y se preparan desde ahí.
`public/img/proyectos/ejemplos/` son las portadas provisionales.

## Añadir un proyecto (sin tocar código)

1. **Imágenes:** crea una carpeta en `public/img/proyectos/<nombre-del-proyecto>/` y pon dentro la portada y las fotos. Usa `.jpg` o `.webp` de menos de 300 KB para que cargue rápido. La portada se ve cuadrada en el carrusel.
2. **Texto en español:** copia un proyecto de `src/content/proyectos/es/`, cámbiale el nombre (p. ej. `brazo-robotico.md`, que será su dirección web) y rellena los campos.
3. **Texto en inglés:** haz lo mismo en `src/content/proyectos/en/` **con el mismo nombre de archivo**.

Campos que acepta cada proyecto (los marcados con * son obligatorios):

```yaml
titulo: "…"            # *
resumen: "…"           # * una frase
fecha: "2025-06"       # * año-mes
portada: /img/proyectos/mi-proyecto/portada.jpg   # *
tecnologias: [SolidWorks, Python]
rol: "…"
duracion: "3 meses"
orden: 1               # posición en la lista (1 = primero)
video: https://www.youtube.com/watch?v=…   # YouTube, Vimeo o /video/archivo.mp4
enlaces:
  github: https://github.com/…
  demo: https://…
  documento: /docs/memoria.pdf
resultados:            # cifras grandes animadas
  - valor: "−30 %"
    etiqueta: "piezas rechazadas"
galeria:
  - src: /img/proyectos/mi-proyecto/foto1.jpg
    alt: "Descripción de la foto"
borrador: true         # para ocultarlo mientras lo escribes
```

Debajo de los campos va el texto en Markdown: `## El problema`, `## Cómo lo hice`, `## Resultados` y `## Qué aprendí`.

**Para quitar los proyectos de ejemplo**, borra los archivos `proyecto-ejemplo-*.md` de las dos carpetas y `public/img/proyectos/ejemplos/`.

## Publicarla gratis en GitHub Pages

1. Crea una cuenta en [github.com](https://github.com) si no la tienes. Tu nombre de usuario formará la dirección: `tuusuario.github.io`.
2. Crea un repositorio nuevo llamado **exactamente** `tuusuario.github.io` (público).
3. En `astro.config.mjs`, cambia `site` por `https://tuusuario.github.io`.
4. Sube el proyecto desde esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Primera versión de la web"
   git branch -M main
   git remote add origin https://github.com/tuusuario/tuusuario.github.io.git
   git push -u origin main
   ```
5. En GitHub, en el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
6. Espera 1–2 minutos (pestaña **Actions**) y entra en `https://tuusuario.github.io`.

A partir de ahí, cada vez que hagas `git add .`, `git commit -m "…"` y `git push`, la web se actualiza sola.

> Si prefieres que el repositorio se llame de otra forma (p. ej. `portfolio`), la web quedará en `tuusuario.github.io/portfolio` y hay que añadir `base: '/portfolio'` en `astro.config.mjs`.

**Alternativas:** en [Netlify](https://netlify.com) o [Vercel](https://vercel.com), "Import from GitHub", elige el repositorio y pulsa Deploy: detectan Astro solos.
