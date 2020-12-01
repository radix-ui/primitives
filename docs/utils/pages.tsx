import { frontMatter as componentsFrontMatter } from '../pages/components/**/*.mdx';
import * as path from 'path';

export const overviewPages: Page[] = [
  { id: 'overview/introduction', label: 'Introduction' },
  { id: 'overview/installation', label: 'Installation' },
  { id: 'overview/styling', label: 'Styling' },
  { id: 'overview/animation', label: 'Animation' },
  { id: 'overview/roadmap', label: 'Roadmap' },
];

export const componentsPages: ComponentPage[] = (componentsFrontMatter || []).reduce<
  ComponentPage[]
>((allPages, frontMatter) => {
  const slug = path.basename(frontMatter.__resourcePath).startsWith('index')
    ? path.dirname(frontMatter.__resourcePath).split(path.sep).pop()
    : path.basename(frontMatter.__resourcePath).split('.').shift();

  // Ignore invalid slugs or private pages whose filenames start with `_`
  return !slug || slug.startsWith('_')
    ? allPages
    : [
        ...allPages,
        {
          id: `components/${slug}`,
          label: frontMatter.title,
          description: frontMatter.description || '',
        },
      ];
}, []);

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
