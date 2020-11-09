import React from 'react';

export default function DefaultLayout({ children: content, frontMatter }: MdxLayoutProps) {
  return <React.Fragment>{content}</React.Fragment>;
}

export type MdxLayoutProps = {
  children?: React.ReactNode;
  frontMatter: FrontMatter;
};
