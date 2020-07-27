import * as React from 'react';
import { Alert } from './Alert';

export default { title: 'Alert' };

export const Basic = () => {
  const [count, setCount] = React.useState(1);

  return (
    <>
      {count > 0 && <button onClick={() => setCount((count) => count - 1)}>remove</button>}
      <button onClick={() => setCount((count) => count + 1)}>add</button>

      {[...Array(count)].map((_, index) => (
        <Alert key={index} type="assertive">
          Message {index}
        </Alert>
      ))}
    </>
  );
};
