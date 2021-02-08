import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

export const Styled = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar className={rootClass}>
      <AvatarFallback className={fallbackClass}>JS</AvatarFallback>
    </Avatar>

    <h1>With image & with fallback</h1>
    <Avatar className={rootClass}>
      <AvatarImage className={imageClass} alt="John Smith" src={src} />
      <AvatarFallback delayMs={300} className={fallbackClass}>
        JS
      </AvatarFallback>
    </Avatar>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar className={rootClass}>
      <AvatarImage
        className={imageClass}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <AvatarFallback className={fallbackClass}>
        <AvatarIcon />
      </AvatarFallback>
    </Avatar>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar className={rootClass}>
      <AvatarFallback className={fallbackClass}>JS</AvatarFallback>
    </Avatar>

    <h1>With image & with fallback</h1>
    <Avatar className={rootClass}>
      <AvatarImage className={imageClass} alt="John Smith" src={src} />
      <AvatarFallback delayMs={300} className={fallbackClass}>
        JS
      </AvatarFallback>
    </Avatar>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar className={rootClass}>
      <AvatarImage className={imageClass} alt="John Smith" src={srcBroken} />
      <AvatarFallback className={fallbackClass}>
        <AvatarIcon />
      </AvatarFallback>
    </Avatar>

    <h1>Data attribute selectors</h1>
    <h2>With image & with fallback</h2>
    <Avatar className={rootAttrClass}>
      <AvatarImage className={imageAttrClass} alt="John Smith" src={src} />
      <AvatarFallback delayMs={300} className={fallbackAttrClass}>
        JS
      </AvatarFallback>
    </Avatar>

    <h2>With image & with fallback (but broken src)</h2>
    <Avatar className={rootAttrClass}>
      <AvatarImage className={imageAttrClass} alt="John Smith" src={srcBroken} />
      <AvatarFallback className={fallbackAttrClass}>
        <AvatarIcon />
      </AvatarFallback>
    </Avatar>
  </>
);
Chromatic.parameters = { chromatic: { disable: false, delay: 1000 } };

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

const rootClass = css({
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

const imageClass = css(RECOMMENDED_CSS__AVATAR__IMAGE);

const RECOMMENDED_CSS__AVATAR__FALLBACK: any = {
  // ensures content inside the fallback is centered
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const fallbackClass = css({
  ...RECOMMENDED_CSS__AVATAR__FALLBACK,
  backgroundColor: '$black',
  color: '$white',
});

const styles = { backgroundColor: 'rgba(0, 0, 255, 0.3)', border: '2px solid blue', padding: 10 };
const rootAttrClass = css({ ...RECOMMENDED_CSS__AVATAR__ROOT, '&[data-radix-avatar]': styles });
const imageAttrClass = css({
  ...RECOMMENDED_CSS__AVATAR__IMAGE,
  '&[data-radix-avatar-image]': styles,
});
const fallbackAttrClass = css({
  ...RECOMMENDED_CSS__AVATAR__FALLBACK,
  '&[data-radix-avatar-fallback]': styles,
});

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
    <path
      d="M50 51.7a22.1 22.1 0 100-44.2 22.1 22.1 0 000 44.2zM87.9 69.3a27.8 27.8 0 00-21.2-16.1 4 4 0 00-2.8.7 23.5 23.5 0 01-27.6 0 4 4 0 00-2.8-.7 27.5 27.5 0 00-21.2 16.1c-.3.6-.2 1.3.1 1.8a52.8 52.8 0 007 8.9 43.4 43.4 0 0056.9 3.8 56.3 56.3 0 008.9-8.8c.9-1.2 1.8-2.5 2.6-3.9.3-.6.3-1.2.1-1.8z"
      fill="currentColor"
    />
  </svg>
);
