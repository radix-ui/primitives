export const overviewPages = [
  { id: 'overview/introduction', label: 'Introduction' },
  { id: 'overview/installation', label: 'Installation' },
  { id: 'overview/styling', label: 'Styling' },
  { id: 'overview/animation', label: 'Animation' },
  { id: 'overview/roadmap', label: 'Roadmap' },
];

export const componentsPages = [
  { id: 'components/input', label: 'Input', description: 'An input is a form control.' },
];

export const allPages = [...overviewPages, ...componentsPages];

export const componentsPagesById = componentsPages.reduce((acc, page) => {
  acc[page.id] = page;
  return acc;
}, {} as Record<string, ArrayType<typeof componentsPages>>);

type ArrayType<T> = T extends (infer U)[] ? U : T;
