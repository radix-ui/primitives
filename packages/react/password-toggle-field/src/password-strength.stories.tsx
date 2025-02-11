import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as PasswordToggleField from '@radix-ui/react-password-toggle-field';
import styles from './password-toggle-field.stories.module.css';

export default {
  title: 'Components/PasswordStrength',
};

export const Styled = () => {
  return <div className={styles.viewport}></div>;
};
