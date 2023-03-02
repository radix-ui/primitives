import * as React from 'react';
import { css } from '../../../../stitches.config';
import * as Form from '@radix-ui/react-form';

export default { title: 'Components/Form' };

export const Basic = () => {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: boolean; password?: boolean }>({});

  return (
    <>
      <Form.Root
        className={formClass()}
        onSubmit={async (event) => {
          const form = event.currentTarget;
          event.preventDefault();
          setErrors({});

          const formData = new FormData(form);

          setLoading(true);
          await wait(500);
          setLoading(false);

          const errors = new Set();
          if (!(formData.get('email') as string).includes('@gmail.com')) errors.add('email');
          if (!(formData.get('password') as string).includes('#')) errors.add('password');

          if (errors.size > 0) {
            setErrors(Object.fromEntries([...errors].map((name) => [name, true])));
            focusFirstInvalidControl(form);
            return;
          }

          window.alert(JSON.stringify(Object.fromEntries(formData), null, 2));
        }}
      >
        <Form.Field name="email" serverInvalid={errors.email}>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required />
          <Form.Message match="valueMissing" />
          <Form.Message match="typeMismatch" forceMatch={errors.email}>
            Email is invalid
          </Form.Message>
        </Form.Field>

        <Form.Field name="password" serverInvalid={errors.password}>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required />
          <Form.Message match="valueMissing">Password is required</Form.Message>
          <Form.Message
            match={(value) => value?.match(/.*[0-9]+.*/) === null}
            forceMatch={errors.password}
          >
            Password is not complex enough
          </Form.Message>
          {errors.password && <Form.Message>Woops</Form.Message>}
        </Form.Field>

        <Form.Submit disabled={loading}>Submit</Form.Submit>
      </Form.Root>
    </>
  );
};

// export const Cypress = () => {
//   const [data, setData] = React.useState({});
//   const [simulateServerErrors, setSimulateServerErrors] = React.useState(false);
//   const [serverErrors, setServerErrors] = React.useState<Form.ServerErrors | undefined>(undefined);

//   return (
//     <>
//       <Form.Root
//         onSubmit={async (event) => {
//           event.preventDefault();

//           const data = Object.fromEntries(new FormData(event.currentTarget));
//           setData(data);

//           if (simulateServerErrors) {
//             await wait(100);
//             const errors: Form.ServerErrors = {};

//             if (!data.age) {
//               errors.age = [{ code: 'required', message: 'Age is required server side!' }];
//             }
//             if (!data.email) {
//               errors.email = [{ code: 'required', message: 'Email is required server side!' }];
//             }
//             if (!data.pin) {
//               errors.pin = [
//                 { code: 'required', message: 'Pin is required server side!' },
//                 { code: '4-digits', message: 'Pin should be 4 digits!' },
//               ];
//             }
//             if (!data.country) {
//               errors.country = [{ code: 'required', message: 'Country is required server side!' }];
//             }
//             errors.global = [{ code: 'bad', message: 'Something bad happened!' }];

//             setServerErrors(errors);
//           }
//         }}
//         onReset={() => setData({})}
//         serverErrors={serverErrors}
//         onServerErrorsChange={setServerErrors}
//       >
//         <Form.Field name="name">
//           <Form.Label>Name (required)</Form.Label>
//           <Form.Control type="text" required />
//           <Form.ClientMessage type="valueMissing" />
//           <Form.ClientMessage type="valid">valid!</Form.ClientMessage>
//         </Form.Field>

//         <Form.Field name="age">
//           <Form.Label>Age (0-99)</Form.Label>
//           <Form.Control type="number" min="0" max="99" step="1" />
//           <Form.ClientMessage type="rangeOverflow" />
//           <Form.ClientMessage type="rangeUnderflow" />
//           <Form.ClientMessage type="stepMismatch" />
//           <Form.ServerMessage />
//         </Form.Field>

//         <Form.Field name="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control type="email" />
//           <Form.ClientMessage type="typeMismatch" />
//           <Form.ServerMessage>Yo, give us an email will ya!</Form.ServerMessage>
//         </Form.Field>

//         <Form.Field name="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control type="password" minLength={8} maxLength={16} />
//           <Form.ClientMessage type="tooShort" />
//           <Form.ClientMessage type="tooLong" />
//         </Form.Field>

//         <Form.Field name="pin">
//           <Form.Label>Pin (4 digits)</Form.Label>
//           <Form.Control type="text" pattern="\d{4,4}" />
//           <Form.ClientMessage type="patternMismatch" />
//           <Form.ServerMessage />
//         </Form.Field>

//         <Form.Field name="secret">
//           <Form.Label>Secret 1</Form.Label>
//           <Form.Control type="text" />
//           <Form.ClientMessage type="customError" isValid={(value) => value === 'shush'} />
//         </Form.Field>

//         <Form.Field name="asyncSecret">
//           <Form.Label>Secret 2</Form.Label>
//           <Form.Control type="text" />
//           <Form.ClientMessage
//             type="customError"
//             isValid={async (value) => {
//               await wait(100);
//               return value === 'shush';
//             }}
//           />
//         </Form.Field>

//         <Form.Field name="country">
//           <Form.Label htmlFor="my-country">Country</Form.Label>
//           <Form.Control id="my-country" type="text" pattern="France|Spain" />
//           <Form.ClientMessage type="patternMismatch">
//             Country should be "France" or "Spain"
//           </Form.ClientMessage>
//           <Form.ServerMessage>{(errors) => JSON.stringify(errors)}</Form.ServerMessage>
//         </Form.Field>

//         <Form.Submit>submit</Form.Submit>
//         <button type="reset">reset</button>

//         <Form.ServerMessage />
//       </Form.Root>
//       <pre>Data: {JSON.stringify(data, null, 2)}</pre>

//       <label>
//         <input
//           type="checkbox"
//           checked={simulateServerErrors}
//           onChange={(event) => setSimulateServerErrors(event.target.checked)}
//         />{' '}
//         Simulate server errors?
//       </label>
//     </>
//   );
// };

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const formClass = css({
  '& *[data-invalid]': { color: 'red', outlineColor: 'CurrentColor' },
  '& *[data-valid]': { color: 'green', outlineColor: 'CurrentColor' },
});

function focusFirstInvalidControl(form: HTMLFormElement) {
  setTimeout(() => {
    // focus first invalid control
    const elements = form.elements;
    const [firstInvalidControl] = Array.from(elements).filter(
      (el) => el.dataset.invalid === 'true'
    );
    firstInvalidControl?.focus();
  }, 0);
}
