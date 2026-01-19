import * as React from 'react';
import { unstable_OneTimePasswordField as OneTimePasswordField } from 'radix-ui';

export default function Page() {
  return (
    <div>
      <OneTimePasswordField.Root placeholder="123456">
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.HiddenInput />
      </OneTimePasswordField.Root>
      <h2>With indices</h2>
      <OneTimePasswordField.Root placeholder="123456">
        <OneTimePasswordField.Input index={0} />
        <OneTimePasswordField.Input index={1} />
        <OneTimePasswordField.Input index={2} />
        <OneTimePasswordField.Input index={3} />
        <OneTimePasswordField.Input index={4} />
        <OneTimePasswordField.Input index={5} />
        <OneTimePasswordField.HiddenInput />
      </OneTimePasswordField.Root>
    </div>
  );
}
