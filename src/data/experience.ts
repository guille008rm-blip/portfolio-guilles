export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
}

export const experience: Experience[] = [
  {
    company: 'Mediaset España',
    role: 'Grafista — En Boca de Todos (Cuatro)',
    period: 'Actualidad',
    description:
      'Grafismo en directo para el programa diario de actualidad. Diseño y ejecución de piezas gráficas, rótulos y elementos de emisión bajo la presión del directo.',
    tags: ['Directo', 'After Effects', 'Photoshop'],
  },
  {
    company: 'Mediaset España',
    role: 'Grafista — Proyectos Especiales',
    period: '2021 – Actualidad',
    description:
      'Gráfica para especial de Telecinco "Ana Obregón" en prime time. Cabecera del podcast "Infinity" para la plataforma de contenido de Mediaset.',
    tags: ['Prime Time', 'Motion Graphics', 'Branding'],
  },
  {
    company: 'RTVE',
    role: 'Grafista',
    period: 'Anterior',
    description:
      'Diseño y producción gráfica para la televisión pública española.',
    tags: ['Broadcast', 'Diseño Gráfico', 'TV'],
  },
  {
    company: 'Movistar+',
    role: 'Grafista',
    period: 'Anterior',
    description:
      'Producción gráfica y motion design para la plataforma audiovisual de Movistar.',
    tags: ['Plataforma', 'Motion Design', 'Post-producción'],
  },
  {
    company: 'Fratelli Pazzi',
    role: 'Fundador / Director de Marca',
    period: '2022 – Actualidad',
    description:
      'Creación integral del negocio: identidad de marca, plataforma digital con pedidos online, programa de fidelización, y gestión operativa. Pizzería napolitana real en Las Rozas (Madrid).',
    tags: ['Emprendimiento', 'Branding', 'Desarrollo Web', 'Negocio'],
  },
];

export const skills = {
  design: ['After Effects', 'Photoshop', 'Illustrator', 'Motion Graphics', 'Grafismo TV', 'Dirección de Arte'],
  ai: ['ChatGPT', 'Nano Banana 2', 'Kling', 'IA Generativa', 'Prompt Engineering'],
  dev: ['HTML/CSS', 'JavaScript', 'Astro', 'Diseño Web', 'UI/UX'],
  business: ['Gestión de Marca', 'E-commerce', 'Marketing Digital', 'Operaciones'],
} as const;
