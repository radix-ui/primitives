import * as React from 'react';

let id = 0;

const makeId = () => {
  id = id + 1;
  return id;
};

export const useId = () => {
  const [id] = React.useState(() => makeId());
  return id;
};
