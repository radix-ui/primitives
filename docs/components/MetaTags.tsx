import * as React from 'react';
import Head from 'next/head';

type MetaTagsProps = {
  title: string;
  description: string;
};

export function MetaTags({ title, description }: MetaTagsProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
