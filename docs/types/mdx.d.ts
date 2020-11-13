// https://github.com/jescalan/babel-plugin-import-glob-array/issues/7#issuecomment-626936433
interface FrontMatter {
  __resourcePath: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  langs?: string[];
  keywords?: string[];
  cardSrc?: string;
  cardAlt?: string;

  // For docs instructions
  installCode?: string;
  importCode?: string;
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const frontMatter: FrontMatter[];
}
