import * as React from 'react';
import * as List from '@radix-ui/react-list';
import styles from './list.stories.module.css';

export default { title: 'Components/List' };

export const Styled = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <List.Root>
        <List.Item className={styles.item} id="A">
          Option A
        </List.Item>
        <List.Item className={styles.item} id="B">
          Option B
        </List.Item>
        <List.Item className={styles.item} id="C">
          Option C
        </List.Item>
        <List.Item className={styles.item} id="D">
          Option D
        </List.Item>
      </List.Root>
    </div>
  );
};
