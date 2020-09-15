export const overviewPages: Page[] = [
  { id: 'overview/introduction', label: 'Introduction' },
  { id: 'overview/installation', label: 'Installation' },
  { id: 'overview/styling', label: 'Styling' },
  { id: 'overview/animation', label: 'Animation' },
  { id: 'overview/roadmap', label: 'Roadmap' },
];

export const componentsPages: ComponentPage[] = [];

export const allPages = [...overviewPages, ...componentsPages];

export const componentsPagesById = componentsPages.reduce((acc, page) => {
  acc[page.id] = page;
  return acc;
}, {} as Record<string, ArrayType<typeof componentsPages>>);

type ArrayType<T> = T extends (infer U)[] ? U : T;

interface Page {
  /** @example 'components/button' */
  id: string;
  /** @example 'Button' */
  label: string;
  /** @example 'A button enables users to trigger an event...' */
  description?: string;
}

interface ComponentPage extends Page {
  description: string;
}
