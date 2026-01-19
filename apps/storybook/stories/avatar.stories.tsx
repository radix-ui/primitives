import { Avatar } from 'radix-ui';
import styles from './avatar.stories.module.css';
import React from 'react';

export default { title: 'Components/Avatar' };

const src = 'https://picsum.photos/id/1005/400/400';
const srcAlternative = 'https://picsum.photos/id/1006/400/400';
const srcBroken = 'https://broken.link.com/broken-pic.jpg';

export const Styled = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Fallback className={styles.fallback}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image
        className={styles.image}
        alt="John Smith"
        src={srcBroken}
        onLoadingStatusChange={console.log}
      />
      <Avatar.Fallback className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>Changing image src</h1>
    <SourceChanger sources={[src, srcAlternative, srcBroken]}>
      {(src) => (
        <Avatar.Root className={styles.root}>
          <Avatar.Image className={styles.image} alt="John Smith" src={src} />
          <Avatar.Fallback delayMs={300} className={styles.fallback}>
            JS
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </SourceChanger>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Without image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Fallback className={styles.fallback}>JS</Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={src} />
      <Avatar.Fallback delayMs={300} className={styles.fallback}>
        JS
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>With image & with fallback (but broken src)</h1>
    <Avatar.Root className={styles.root}>
      <Avatar.Image className={styles.image} alt="John Smith" src={srcBroken} />
      <Avatar.Fallback className={styles.fallback}>
        <AvatarIcon />
      </Avatar.Fallback>
    </Avatar.Root>

    <h1>Changing image src</h1>
    <SourceChanger sources={[src, srcAlternative, srcBroken]}>
      {(src) => (
        <Avatar.Root className={styles.root}>
          <Avatar.Image className={styles.image} alt="John Smith" src={src} />
          <Avatar.Fallback delayMs={300} className={styles.fallback}>
            JS
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </SourceChanger>
  </>
);
Chromatic.parameters = { chromatic: { disable: false, delay: 1000 } };

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
    <path
      d="M50 51.7a22.1 22.1 0 100-44.2 22.1 22.1 0 000 44.2zM87.9 69.3a27.8 27.8 0 00-21.2-16.1 4 4 0 00-2.8.7 23.5 23.5 0 01-27.6 0 4 4 0 00-2.8-.7 27.5 27.5 0 00-21.2 16.1c-.3.6-.2 1.3.1 1.8a52.8 52.8 0 007 8.9 43.4 43.4 0 0056.9 3.8 56.3 56.3 0 008.9-8.8c.9-1.2 1.8-2.5 2.6-3.9.3-.6.3-1.2.1-1.8z"
      fill="currentColor"
    />
  </svg>
);

function SourceChanger({
  sources,
  children,
}: {
  sources: [string, ...string[]];
  children: (src: string) => React.ReactElement;
}) {
  const [src, setSrc] = React.useState(sources[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (sources.indexOf(src) + 1) % sources.length;
      setSrc(sources[nextIndex]!);
    }, 1000);
    return () => clearInterval(interval);
  }, [sources, src]);
  return children(src);
}
