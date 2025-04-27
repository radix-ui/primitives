import * as React from 'react';

type Direction = 'ltr' | 'rtl';
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
  return localDir || globalDir || 'ltr';
}

const Provider = DirectionProvider;

export {
  useDirection,
  //
  Provider,
  //
  DirectionProvider,
};
