import * as React from 'react';

type TableDOMProps = React.ComponentPropsWithoutRef<'div'>;
type TableOwnProps = {};
type TableProps = TableDOMProps & TableOwnProps;

const Table = React.forwardRef<HTMLDivElement, TableProps>(function Table(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Table.displayName = 'Table';

export { Table };
export type { TableProps };
