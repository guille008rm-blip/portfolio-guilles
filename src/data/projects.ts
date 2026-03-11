export interface Project {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  featured?: boolean;
}

export interface AreaProjects {
  slug: string;
  label: string;
  projects: Project[];
}

export const grafismoProjects: Project[] = [
  {
    title: 'En Boca de Todos',
    description:
      'Grafismo en directo para el programa diario de actualidad de Cuatro (Mediaset). Diseño de piezas gráficas, rótulos, cortinillas y elementos de emisión bajo la presión del directo.',
    tags: ['Directo', 'Cuatro', 'Mediaset', 'After Effects'],
    featured: true,
  },
  {
    title: 'Especial Ana Obregón — Telecinco',
    description:
      'Diseño y producción de la gráfica completa para el especial en prime time de Telecinco. Identidad visual del programa, cabecera, transiciones y motion graphics.',
    tags: ['Prime Time', 'Telecinco', 'Mediaset', 'Motion Graphics'],
    featured: true,
  },
  {
    title: 'Infinity — Cabecera Podcast',
    description:
      'Cabecera audiovisual para el podcast de la plataforma de contenido de Mediaset. Concepto visual, animación y producción completa del opening.',
    tags: ['Podcast', 'Mediaset', 'Branding', 'Motion'],
    featured: true,
  },
];

export const automatizacionProjects: Project[] = [
  {
    title: 'Pipeline de generación visual con IA',
    description:
      'Workflow completo de producción visual: ideación con ChatGPT, generación de imagen con Nano Banana 2, vídeo con Kling, y postproducción final en After Effects.',
    tags: ['ChatGPT', 'Nano Banana 2', 'Kling', 'After Effects'],
    featured: true,
  },
  {
    title: 'Automatización de procesos gráficos',
    description:
      'Optimización de flujos de trabajo en producción gráfica televisiva mediante herramientas de IA generativa para acelerar la creación de assets.',
    tags: ['IA Generativa', 'Productividad', 'Workflow'],
    featured: true,
  },
];

export const desarrolloProjects: Project[] = [
  {
    title: 'Fratelli Pazzi — Web de pizzería',
    description:
      'Diseño y desarrollo de la web completa para Fratelli Pazzi: menú interactivo, sistema de pedidos, gestión de ofertas y plataforma de fidelización de clientes.',
    tags: ['E-commerce', 'Diseño UI', 'Desarrollo Web'],
    link: 'https://www.fratellipazzi.es',
    featured: true,
  },
  {
    title: 'Web productora audiovisual',
    description:
      'Plataforma web para productora audiovisual con secciones de paquetes de redes sociales, portfolio de trabajos, sistema de alquiler de equipo y gestión de servicios.',
    tags: ['Plataforma', 'Audiovisual', 'Desarrollo Web'],
    featured: true,
  },
];

export const fratelliProjects: Project[] = [
  {
    title: 'Identidad de marca',
    description:
      'Creación integral de la identidad visual de Fratelli Pazzi: logotipo, paleta cromática, tipografías, y sistema visual completo para todos los puntos de contacto.',
    tags: ['Branding', 'Identidad Visual', 'Logo'],
    featured: true,
  },
  {
    title: 'Plataforma digital',
    description:
      'Web con menú interactivo, sistema de pedidos online, programa de puntos y fidelización, y gestión integral del negocio digital.',
    tags: ['Web', 'E-commerce', 'Fidelización'],
    link: 'https://www.fratellipazzi.es',
    featured: true,
  },
  {
    title: 'Experiencia de producto',
    description:
      'Auténtica pizzería napolitana en Las Rozas (Madrid). Ingredientes importados de Italia, masa fermentada 48h, horno de leña a 450°C. 4.7 estrellas en Google con +300 clientes.',
    tags: ['Producto Real', 'Gastronomía', 'Las Rozas'],
    featured: true,
  },
];
