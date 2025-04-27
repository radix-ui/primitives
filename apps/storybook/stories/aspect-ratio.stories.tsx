import { AspectRatio } from 'radix-ui';
import styles from './aspect-ratio.stories.module.css';

export default { title: 'Components/AspectRatio' };

const image = (
  <img
    src="https://images.unsplash.com/photo-1605030753481-bb38b08c384a?&auto=format&fit=crop&w=400&q=80"
    alt="A house in a forest"
    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
  />
);

export const Styled = () => (
  <div style={{ width: 500 }}>
    <AspectRatio.Root className={styles.root}>
      <h1>Default ratio (1/1)</h1>
    </AspectRatio.Root>
  </div>
);

export const CustomRatios = () => {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={1 / 2}>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={16 / 9}>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={2 / 1}>{image}</AspectRatio.Root>
      </div>
    </div>
  );
};

export const Chromatic = () => (
  <>
    <h1>Default ratio</h1>
    <div style={{ width: 300 }}>
      <AspectRatio.Root className={styles.root}>
        <p>Default ratio (1/1)</p>
      </AspectRatio.Root>
    </div>

    <h1>Custom ratios</h1>
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={1 / 2}>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={16 / 9}>{image}</AspectRatio.Root>
      </div>
      <div style={{ width: 200 }}>
        <AspectRatio.Root ratio={2 / 1}>{image}</AspectRatio.Root>
      </div>
    </div>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
