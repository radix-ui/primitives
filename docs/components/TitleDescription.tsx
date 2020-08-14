import * as React from 'react';
import { useRouter } from 'next/router';
import { getPageIdFromUrl } from '../utils/getPageIdFromUrl';
import { componentsPagesById } from '../utils/pages';
import { Title, Description } from '../components/pageComponents';

export function TitleDescription() {
  const router = useRouter();
  const id = getPageIdFromUrl(router.pathname);
  const component = componentsPagesById[id];

  return (
    <>
      <Title>{component.label}</Title>
      <Description>{component.description}</Description>
    </>
  );
}
