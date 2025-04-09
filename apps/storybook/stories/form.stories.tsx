import * as React from 'react';
import { Form } from 'radix-ui';
import styles from './form.stories.module.css';

export default { title: 'Components/Form' };

export const Basic = () => {
  const [loading, setLoading] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<{ email?: boolean; password?: boolean }>(
    {}
  );

  return (
    <>
      <Form.Root
        className={styles.form}
        onClearServerErrors={() => setServerErrors({})}
        onSubmit={async (event) => {
          const form = event.currentTarget;
          event.preventDefault();

          const formData = new FormData(form);

          setLoading(true);
          await wait(500);
          setLoading(false);

          const errors = new Set();
          if (!(formData.get('email') as string).includes('@gmail.com')) errors.add('email');
          if (!(formData.get('password') as string).includes('#')) errors.add('password');

          if (errors.size > 0) {
            setServerErrors(Object.fromEntries([...errors].map((name) => [name, true])));
            return;
          }

          window.alert(JSON.stringify(Object.fromEntries(formData), null, 2));
        }}
      >
        <Form.Field name="email" serverInvalid={serverErrors.email}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={() => setServerErrors((prev) => ({ ...prev, email: false }))}
          />
          <Form.Message match="valueMissing" />
          <Form.Message match="typeMismatch" forceMatch={serverErrors.email}>
            Email is invalid
          </Form.Message>
        </Form.Field>

        <Form.Field name="password" serverInvalid={serverErrors.password}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={() => setServerErrors((prev) => ({ ...prev, password: false }))}
          />
          <Form.Message match="valueMissing">Password is required</Form.Message>
          <Form.Message
            match={(value) => value.match(/.*[0-9]+.*/) === null}
            forceMatch={serverErrors.password}
          >
            Password is not complex enough
          </Form.Message>
          {serverErrors.password && <Form.Message>Woops</Form.Message>}
        </Form.Field>

        <Form.Submit disabled={loading}>Submit</Form.Submit>
        <button type="reset">Reset</button>
      </Form.Root>
    </>
  );
};

export const Cypress = () => {
  const [data, setData] = React.useState({});
  const [simulateServerErrors, setSimulateServerErrors] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<{
    email?: boolean;
    pin?: boolean;
    global?: boolean;
  }>({});

  return (
    <>
      <Form.Root
        className={styles.form}
        onClearServerErrors={() => setServerErrors({})}
        onSubmit={async (event) => {
          event.preventDefault();

          setData({});

          const data = Object.fromEntries(new FormData(event.currentTarget));

          if (simulateServerErrors) {
            await wait(100);
            setServerErrors({ email: !data.email, pin: String(data.pin)[3] !== '9', global: true });
          }

          setData(data);
        }}
        onReset={() => setData({})}
      >
        <Form.Field name="name">
          <Form.Label>Name (required)</Form.Label>
          <Form.Control type="text" required />
          <Form.Message match="valueMissing" />
          <Form.Message match="valid">valid!</Form.Message>
        </Form.Field>

        <Form.Field name="age">
          <Form.Label>Age (0-99)</Form.Label>
          <Form.Control type="number" min="0" max="99" step="1" />
          <Form.Message match="rangeOverflow" />
          <Form.Message match="rangeUnderflow" />
          <Form.Message match="stepMismatch" />
        </Form.Field>

        <Form.Field name="email" serverInvalid={serverErrors.email}>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" />
          <Form.Message match="typeMismatch" />
          {serverErrors.email ? (
            <Form.Message>Email is actually required server side!</Form.Message>
          ) : null}
        </Form.Field>

        <Form.Field name="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" minLength={8} maxLength={16} />
          <Form.Message match="tooShort" />
          <Form.Message match="tooLong" />
        </Form.Field>

        <Form.Field name="pin" serverInvalid={serverErrors.pin}>
          <Form.Label>Pin (4 digits)</Form.Label>
          <Form.Control type="text" pattern="\d{4,4}" />
          <Form.Message match="patternMismatch" forceMatch={serverErrors.pin} />
        </Form.Field>

        <Form.Field name="secret">
          <Form.Label>Secret 1</Form.Label>
          <Form.Control type="text" />
          <Form.Message match={(value) => value !== 'shush'} />
        </Form.Field>

        <Form.Field name="asyncSecret">
          <Form.Label>Secret 2</Form.Label>
          <Form.Control type="text" />
          <Form.Message
            match={async (value) => {
              await wait(100);
              return value !== 'shush';
            }}
          />
        </Form.Field>

        <Form.Field name="country">
          <Form.Label htmlFor="my-country">Country</Form.Label>
          <Form.Control id="my-country" type="text" pattern="France|Spain" />
          <Form.Message match="patternMismatch">Country should be "France" or "Spain"</Form.Message>
        </Form.Field>

        <Form.Submit>submit</Form.Submit>
        <button type="reset">reset</button>
      </Form.Root>
      <pre>Data: {JSON.stringify(data, null, 2)}</pre>

      <label>
        <input
          type="checkbox"
          checked={simulateServerErrors}
          onChange={(event) => setSimulateServerErrors(event.target.checked)}
        />{' '}
        Simulate server errors?
      </label>
    </>
  );
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
