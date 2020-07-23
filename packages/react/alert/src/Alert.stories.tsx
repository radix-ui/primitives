import * as React from 'react';
import { Alert } from './Alert';

export default { title: 'Alert' };

export const Basic = () => {
  const [count, setCount] = React.useState(1);

  return (
    <>
      <button onClick={() => setCount((count) => (count > 0 ? count - 1 : count))}>remove</button>
      <button onClick={() => setCount((count) => count + 1)}>add</button>
      {[...Array(count)].map((_, index) => (
        <Alert key={index} type="assertive">
          the quick brown fox {index} jumped over the lazy dogs
          <button onClick={() => alert('test')}>test</button>
        </Alert>
      ))}
    </>
  );
};
