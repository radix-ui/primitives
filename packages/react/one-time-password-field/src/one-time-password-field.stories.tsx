/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import * as OneTimePasswordField from '@radix-ui/react-one-time-password-field';
import styles from './one-time-password-field.stories.module.css';

export default {
  title: 'Components/OneTimePasswordField',
};

export const Styled = () => {
  return <div className={styles.root}></div>;
};
