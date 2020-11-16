import * as React from 'react';
import { Avatar } from './Avatar';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

export const Styled = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar as={StyledRoot}>
      <Avatar.Fallback as={StyledFallback}>JS</Avatar.Fallback>
    </Avatar>

    <h1>With image & with fallback</h1>
    <Avatar as={StyledRoot}>
      <Avatar.Image as={StyledImage} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} as={StyledFallback}>
        JS
      </Avatar.Fallback>
    </Avatar>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar as={StyledRoot}>
      <Avatar.Image
        as={StyledImage}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback as={StyledFallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar>
  </>
);

const RECOMMENDED_CSS__AVATAR__ROOT: any = {
  // ensures image/fallback is centered
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  // ensures image doesn't bleed out
  overflow: 'hidden',
  // ensures no selection is possible
  userSelect: 'none',
};

const StyledRoot = styled('span', {
  ...RECOMMENDED_CSS__AVATAR__ROOT,
  borderRadius: 9999,
  width: 48,
  height: 48,
});

const RECOMMENDED_CSS__AVATAR__IMAGE: any = {
  // ensures image is full size and not distorted
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const StyledImage = styled('img', RECOMMENDED_CSS__AVATAR__IMAGE);

const RECOMMENDED_CSS__AVATAR__FALLBACK: any = {
  // ensures content inside the fallback is centered
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const StyledFallback = styled('span', {
  ...RECOMMENDED_CSS__AVATAR__FALLBACK,
  backgroundColor: '$black',
  color: '$white',
});

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
    <path
      d="M50 51.7a22.1 22.1 0 100-44.2 22.1 22.1 0 000 44.2zM87.9 69.3a27.8 27.8 0 00-21.2-16.1 4 4 0 00-2.8.7 23.5 23.5 0 01-27.6 0 4 4 0 00-2.8-.7 27.5 27.5 0 00-21.2 16.1c-.3.6-.2 1.3.1 1.8a52.8 52.8 0 007 8.9 43.4 43.4 0 0056.9 3.8 56.3 56.3 0 008.9-8.8c.9-1.2 1.8-2.5 2.6-3.9.3-.6.3-1.2.1-1.8z"
      fill="currentColor"
    />
  </svg>
);
