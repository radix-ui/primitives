import { css } from '../../../../stitches.config';
import * as Avatar from '@radix-ui/react-avatar';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const otherSrc = 'https://picsum.photos/id/1006/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

const FakeFrameworkImage = (props: any) => {
  console.log(props);

  return (
    <div>
      <img {...props} alt="framework test" data-testid="framework-image-component" />
    </div>
  );
};

export const Styled = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Fallback className={fallbackClass()}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={fallbackClass()}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image
        className={imageClass()}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image framework component</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image
        className={imageClass()}
        alt="John Smith"
        onLoadingStatusChange={console.log}
        asChild
      >
        <FakeFrameworkImage src={otherSrc} />
      </Avatar.Image>
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image framework component & with fallback (but broken src)</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" onLoadingStatusChange={console.log}>
        <FakeFrameworkImage src={srcBroken} />
      </Avatar.Image>
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Fallback className={fallbackClass()}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={fallbackClass()}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" src={srcBroken} />
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image framework component</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" onLoadingStatusChange={console.log}>
        <FakeFrameworkImage src={otherSrc} />
      </Avatar.Image>
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image framework component & with fallback (but broken src)</h1>
    <Avatar.Root className={rootClass()}>
      <Avatar.Image className={imageClass()} alt="John Smith" onLoadingStatusChange={console.log}>
        <FakeFrameworkImage src={srcBroken} />
      </Avatar.Image>
      <Avatar.Fallback className={fallbackClass()}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>
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

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
    <path
      d="M50 51.7a22.1 22.1 0 100-44.2 22.1 22.1 0 000 44.2zM87.9 69.3a27.8 27.8 0 00-21.2-16.1 4 4 0 00-2.8.7 23.5 23.5 0 01-27.6 0 4 4 0 00-2.8-.7 27.5 27.5 0 00-21.2 16.1c-.3.6-.2 1.3.1 1.8a52.8 52.8 0 007 8.9 43.4 43.4 0 0056.9 3.8 56.3 56.3 0 008.9-8.8c.9-1.2 1.8-2.5 2.6-3.9.3-.6.3-1.2.1-1.8z"
      fill="currentColor"
    />
  </svg>
);
