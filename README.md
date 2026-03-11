# Portfolio — Guillermo López del Castillo-Olivares

Portfolio/CV digital premium construido con Astro. Grafismo en TV, automatización con IA, desarrollo web y gestión de marca real.

## Stack

- **Astro** — Framework SSG
- **GSAP + ScrollTrigger** — Animaciones avanzadas
- **CSS puro** con custom properties — Sin frameworks CSS
- **@fontsource** — Tipografías self-hosted (Syne, Inter, JetBrains Mono)

## Requisitos

- Node.js >= 20.19.1 (recomendado: 22+)
- npm >= 9

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# Abrir en http://localhost:4321
```

## Build

```bash
# Generar build de producción
npm run build

# Preview del build
npm run preview
```

## Estructura del proyecto

```
src/
├── components/
│   ├── global/       # Header, Footer, Button, SectionHeading
│   ├── home/         # Hero, ValueProposition, AreasGrid, About, Contact
│   ├── grafismo/     # ProjectCard para TV
│   ├── automatizacion/
│   ├── desarrollo/
│   └── fratelli/
├── data/             # Datos centralizados (site, projects, experience)
├── layouts/          # BaseLayout, SectionLayout
├── pages/            # index, grafismo, automatizacion, desarrollo, fratelli-pazzi
└── styles/           # tokens.css, global.css, animations.css
```

## Añadir proyectos

Editar `src/data/projects.ts` y añadir objetos al array correspondiente:

```ts
{
  title: 'Nombre del proyecto',
  description: 'Descripción breve.',
  tags: ['Tag1', 'Tag2'],
  image: '/images/carpeta/imagen.jpg',
  link: 'https://...',
  featured: true,
}
```

## Añadir imágenes

Colocar en `public/images/` dentro de la carpeta correspondiente:
- `hero/` — Imágenes del hero principal
- `grafismo/` — Stills y capturas de TV
- `automatizacion/` — Diagramas, capturas IA
- `desarrollo/` — Mockups y screenshots web
- `fratelli/` — Fotos de producto, packaging, marca

## Deploy en Vercel

### Opción A: Desde GitHub (recomendado)

1. Crear repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: portfolio premium Astro"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/portfolio-guilles.git
   git push -u origin main
   ```

2. En [vercel.com](https://vercel.com):
   - "Add New Project"
   - Importar el repositorio desde GitHub
   - Vercel detecta automáticamente Astro
   - Click "Deploy"

3. (Opcional) Conectar dominio custom en Settings > Domains

### Opción B: Desde terminal

```bash
npx vercel
```

## Personalizar

- **Colores**: `src/styles/tokens.css` — Todas las paletas de color por sección
- **Tipografías**: `src/styles/global.css` — Font family declarations
- **Datos personales**: `src/data/site.ts` — Nombre, links, meta
- **Experiencia**: `src/data/experience.ts` — Trayectoria y skills
- **CV en PDF**: Colocar en `public/cv/guillermo-lopez-cv.pdf`

## Licencia

Proyecto personal. Todos los derechos reservados.

