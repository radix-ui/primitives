import * as React from 'react';

const Direction = {
  LTR: 'ltr',
  RTL: 'rtl',
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];

const DirectionContext = React.createContext<Direction | undefined>(undefined);

/* -------------------------------------------------------------------------------------------------
 * Direction
 * -----------------------------------------------------------------------------------------------*/

interface DirectionProviderProps {
  children?: React.ReactNode;
  dir: Direction;
}
const DirectionProvider: React.FC<DirectionProviderProps> = (props) => {
  const { dir, children } = props;
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>;
};

/* -----------------------------------------------------------------------------------------------*/

function useDirection(localDir?: Direction) {
  const globalDir = React.useContext(DirectionContext);
  return localDir || globalDir || Direction.LTR;
}

export {
  useDirection,
  //
  DirectionProvider as Provider,
  //
  DirectionProvider,
};
