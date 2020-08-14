import * as React from 'react';
import { useRouter } from 'next/router';
import { getPageIdFromUrl } from '../utils/getPageIdFromUrl';
import { componentsPagesById } from '../utils/pages';
import { MetaTags } from '../components/MetaTags';
import { Title, Description } from '../components/pageComponents';

export function TitleDescription() {
  const router = useRouter();
  const id = getPageIdFromUrl(router.pathname);
  const component = componentsPagesById[id];

  return (
    <>
      <MetaTags title={component.label} description={component.description} />
      <Title>{component.label}</Title>
      <Description>{component.description}</Description>
    </>
  );
}
