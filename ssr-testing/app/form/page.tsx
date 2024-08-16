import * as React from 'react';
import * as Form from '@radix-ui/react-form';

export default function Page() {
  return (
    <Form.Root>
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" required />
        <Form.Message match="valueMissing">Value is missing</Form.Message>
        <Form.Message match="typeMismatch">Email is invalid</Form.Message>
      </Form.Field>
    </Form.Root>
  );
}
