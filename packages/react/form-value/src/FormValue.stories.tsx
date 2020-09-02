import * as React from 'react';
import { FormValue } from './FormValue';

export default { title: 'FormValue' };

export const Basic = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(event.target.form);
    console.log(formData.get('input'));
  }

  return (
    <form onChange={handleChange}>
      <FormValue name="input" value={value} />
      <button type="button" onClick={() => setValue((prevValue) => prevValue + 1)}>
        update value
      </button>
    </form>
  );
};
