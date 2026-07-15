import { AccessibleIcon } from 'radix-ui';

export default { title: 'Utilities/AccessibleIcon' };

export const Styled = () => (
  <button type="button">
    <AccessibleIcon.Root label="Close">
      <CrossIcon />
    </AccessibleIcon.Root>
  </button>
);

export const Chromatic = () => (
  <p>
    Some text with an inline accessible icon{' '}
    <AccessibleIcon.Root label="Close">
      <CrossIcon />
    </AccessibleIcon.Root>
  </p>
);

Chromatic.parameters = { chromatic: { disable: false } };

const CrossIcon = () => (
  <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
    <path d="M2 30 L30 2 M30 30 L2 2" />
  </svg>
);
