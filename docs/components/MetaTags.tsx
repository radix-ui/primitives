import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type MetaTagsProps = {
  title: string;
  description: string;
};

const baseUrl = 'https://radix.now.sh';

export function MetaTags({ title, description }: MetaTagsProps) {
  const router = useRouter();
  return (
    <Head>
      <title>Radix — {title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={`${baseUrl}${router.pathname}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={image} /> */}

      {/* <meta name="twitter:site" content="@modulz" />
      <meta name="twitter:card" content="summary" />
      {poster && <meta name="twitter:card" content="summary_large_image" /> */}
    </Head>
  );
}
