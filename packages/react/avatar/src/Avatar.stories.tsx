import * as React from 'react';
import { Avatar, styles } from './Avatar';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

export const Basic = () => (
  <>
    <h1>With image & fallback</h1>
    <Avatar as={BasicStyledRoot}>
      <Avatar.Image as={BasicStyledImage} alt="John Smith" src={src} />
      <Avatar.Fallback as={BasicStyledFallback}>JS</Avatar.Fallback>
    </Avatar>

    <h1>With image & fallback (but broken src, shows once loading failed)</h1>
    <Avatar as={BasicStyledRoot}>
      <Avatar.Image
        as={BasicStyledImage}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback as={BasicStyledFallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar>
  </>
);

export const Styled = () => (
  <>
    <h1>With image & fallback</h1>
    <Avatar as={StyledRoot}>
      <Avatar.Image as={StyledImage} alt="John Smith" src={src} />
      <Avatar.Fallback as={StyledFallback}>JS</Avatar.Fallback>
    </Avatar>

    <h1>With image & fallback (but broken src, shows once loading failed)</h1>
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

    <h1>With own content (no image, no fallback, shows instantly)</h1>
    <Avatar as={StyledRoot}>
      <LetterAvatar>JS</LetterAvatar>
    </Avatar>
  </>
);

const BasicStyledRoot = styled('span', styles.root);
const BasicStyledImage = styled('img', styles.image);
const BasicStyledFallback = styled('span', styles.fallback);

const StyledRoot = styled(BasicStyledRoot, {
  borderRadius: 9999,
  width: 48,
  height: 48,
});

const StyledImage = styled(BasicStyledImage, {});

const StyledFallback = styled(BasicStyledFallback, {
  width: '100%',
  height: '100%',
  backgroundColor: '$black',
  color: '$white',
});

const LetterAvatar = styled('span', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: '$red',
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
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
