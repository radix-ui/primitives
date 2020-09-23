import React from 'react';
import { FocusTrap } from './FocusTrap';

export default { title: 'Modular Lock (temp)/FocusTrap' };

export const Basic = () => {
  const [isTrappingFocus, setIsTrappingFocus] = React.useState(false);

  const FocusTrapWrapper = isTrappingFocus ? FocusTrap : React.Fragment;

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>FocusTrap</h1>
      <label style={{ display: 'block' }}>
        <input
          type="checkbox"
          checked={isTrappingFocus}
          onChange={(event) => setIsTrappingFocus(event.target.checked)}
        />{' '}
        Trap focus within form
      </label>

      <button type="button">before</button>

      <FocusTrapWrapper>
        <form
          onSubmit={(event) => event.preventDefault()}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 20,
            padding: 20,
            margin: 50,
            maxWidth: 500,
            border: '2px solid',
          }}
        >
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
          <input type="number" placeholder="Age" />
          <button type="submit">Submit</button>
        </form>
      </FocusTrapWrapper>

      <button type="button">after</button>
    </div>
  );
};
