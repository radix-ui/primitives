import { Separator } from 'radix-ui';
import styles from './separator.stories.module.css';

export default { title: 'Components/Separator' };

export const Styled = () => (
  <>
    <h1>Horizontal</h1>
    <p>The following separator is horizontal and has semantic meaning.</p>
    <Separator.Root className={styles.root} orientation="horizontal" />
    <p>
      The following separator is horizontal and is purely decorative. Assistive technology will
      ignore this element.
    </p>
    <Separator.Root className={styles.root} orientation="horizontal" decorative />

    <h1>Vertical</h1>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>The following separator is vertical and has semantic meaning.</p>
      <Separator.Root className={styles.root} orientation="vertical" />
      <p>
        The following separator is vertical and is purely decorative. Assistive technology will
        ignore this element.
      </p>
      <Separator.Root className={styles.root} orientation="vertical" decorative />
    </div>
  </>
);
