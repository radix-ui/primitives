import React from 'react';
import { MdxLayoutProps } from './DefaultLayout';
import { MetaTags } from '../components/MetaTags';
import { Title, Description } from '../components/pageComponents';

export default function DocsLayout({ children: content, frontMatter }: MdxLayoutProps) {
  return (
    <main>
      <article>
        <header>
          <MetaTags title={frontMatter.title} description={frontMatter.description!} />
          <Title>{frontMatter.title}</Title>
          {frontMatter.description && <Description>{frontMatter.description}</Description>}
        </header>

        <div>{content}</div>
      </article>
    </main>
  );
}
