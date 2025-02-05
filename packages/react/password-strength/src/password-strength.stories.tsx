/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import * as PasswordStrength from '@radix-ui/react-password-strength';
import styles from './password-strength.stories.module.css';

export default {
  title: 'Components/PasswordStrength',
};

export const Styled = () => {
  return <div className={styles.root}></div>;
};
