import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Table
 * -----------------------------------------------------------------------------------------------*/

const TABLE_DEFAULT_TAG = 'table';

type TableDOMProps = React.ComponentPropsWithoutRef<typeof TABLE_DEFAULT_TAG>;
type TableOwnProps = {};
type TableProps = TableDOMProps & TableOwnProps;

const Table = forwardRef<typeof TABLE_DEFAULT_TAG, TableProps, TableStaticProps>(function Table(
  props,
  forwardedRef
) {
  const { as: Comp = TABLE_DEFAULT_TAG, ...tableProps } = props;
  return <Comp {...interopDataAttrObj('Table')} ref={forwardedRef} {...tableProps} />;
});

Table.displayName = 'Table';

/* -------------------------------------------------------------------------------------------------
 * TableHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_DEFAULT_TAG = 'thead';

type TableHeaderDOMProps = React.ComponentPropsWithoutRef<typeof HEADER_DEFAULT_TAG>;
type TableHeaderOwnProps = {};
type TableHeaderProps = TableHeaderDOMProps & TableHeaderOwnProps;

const TableHeader = forwardRef<typeof HEADER_DEFAULT_TAG, TableHeaderProps>(function TableHeader(
  props,
  forwardedRef
) {
  const { as: Comp = HEADER_DEFAULT_TAG, ...headerProps } = props;
  return <Comp {...interopDataAttrObj('TableHeader')} ref={forwardedRef} {...headerProps} />;
});

TableHeader.displayName = 'Table.Header';

/* -------------------------------------------------------------------------------------------------
 * TableFooter
 * -----------------------------------------------------------------------------------------------*/

const FOOTER_DEFAULT_TAG = 'tfoot';

type TableFooterDOMProps = React.ComponentPropsWithoutRef<typeof FOOTER_DEFAULT_TAG>;
type TableFooterOwnProps = {};
type TableFooterProps = TableFooterDOMProps & TableFooterOwnProps;

const TableFooter = forwardRef<typeof FOOTER_DEFAULT_TAG, TableFooterProps>(function TableFooter(
  props,
  forwardedRef
) {
  const { as: Comp = FOOTER_DEFAULT_TAG, ...footerProps } = props;
  return <Comp {...interopDataAttrObj('TableFooter')} ref={forwardedRef} {...footerProps} />;
});

TableFooter.displayName = 'Table.Footer';

/* -------------------------------------------------------------------------------------------------
 * TableBody
 * -----------------------------------------------------------------------------------------------*/

const BODY_DEFAULT_TAG = 'tbody';

type TableBodyDOMProps = React.ComponentPropsWithoutRef<typeof BODY_DEFAULT_TAG>;
type TableBodyOwnProps = {};
type TableBodyProps = TableBodyDOMProps & TableBodyOwnProps;

const TableBody = forwardRef<typeof BODY_DEFAULT_TAG, TableBodyProps>(function TableBody(
  props,
  forwardedRef
) {
  const { as: Comp = BODY_DEFAULT_TAG, ...bodyProps } = props;
  return <Comp {...interopDataAttrObj('TableBody')} ref={forwardedRef} {...bodyProps} />;
});

TableBody.displayName = 'Table.Body';

/* -------------------------------------------------------------------------------------------------
 * TableRow
 * -----------------------------------------------------------------------------------------------*/

const ROW_DEFAULT_TAG = 'tr';

type TableRowDOMProps = React.ComponentPropsWithoutRef<typeof ROW_DEFAULT_TAG>;
type TableRowOwnProps = {};
type TableRowProps = TableRowDOMProps & TableRowOwnProps;

const TableRow = forwardRef<typeof ROW_DEFAULT_TAG, TableRowProps>(function TableRow(
  props,
  forwardedRef
) {
  const { as: Comp = ROW_DEFAULT_TAG, ...rowProps } = props;
  return <Comp {...interopDataAttrObj('TableRow')} ref={forwardedRef} {...rowProps} />;
});

TableRow.displayName = 'Table.Row';

/* -------------------------------------------------------------------------------------------------
 * TableSummaryCell
 * -----------------------------------------------------------------------------------------------*/

const SUMMARY_CELL_DEFAULT_TAG = 'th';

type TableSummaryCellDOMProps = React.ComponentPropsWithoutRef<typeof SUMMARY_CELL_DEFAULT_TAG>;
type TableSummaryCellOwnProps = {};
type TableSummaryCellProps = TableSummaryCellDOMProps & TableSummaryCellOwnProps;

const TableSummaryCell = forwardRef<typeof SUMMARY_CELL_DEFAULT_TAG, TableSummaryCellProps>(
  function TableSummaryCell(props, forwardedRef) {
    const { as: Comp = SUMMARY_CELL_DEFAULT_TAG, ...cellProps } = props;
    return <Comp {...interopDataAttrObj('TableSummaryCell')} ref={forwardedRef} {...cellProps} />;
  }
);

TableSummaryCell.displayName = 'Table.SummaryCell';

/* -------------------------------------------------------------------------------------------------
 * TableCell
 * -----------------------------------------------------------------------------------------------*/

const CELL_DEFAULT_TAG = 'td';

type TableCellDOMProps = React.ComponentPropsWithoutRef<typeof CELL_DEFAULT_TAG>;
type TableCellOwnProps = {};
type TableCellProps = TableCellDOMProps & TableCellOwnProps;

const TableCell = forwardRef<typeof CELL_DEFAULT_TAG, TableCellProps>(function TableCell(
  props,
  forwardedRef
) {
  const { as: Comp = CELL_DEFAULT_TAG, ...cellProps } = props;
  return <Comp {...interopDataAttrObj('TableCell')} ref={forwardedRef} {...cellProps} />;
});

TableCell.displayName = 'Table.Cell';

/* ---------------------------------------------------------------------------------------------- */

interface TableStaticProps {
  Header: typeof TableHeader;
  Footer: typeof TableFooter;
  Body: typeof TableBody;
  Row: typeof TableRow;
  SummaryCell: typeof TableSummaryCell;
  Cell: typeof TableCell;
}

Table.Header = TableHeader;
Table.Footer = TableFooter;
Table.Body = TableBody;
Table.Row = TableRow;
Table.SummaryCell = TableSummaryCell;
Table.Cell = TableCell;

const styles = {
  table: {
    ...cssReset(TABLE_DEFAULT_TAG),
    borderCollapse: 'collapse',
    width: '100%',
  },
  header: {
    ...cssReset(HEADER_DEFAULT_TAG),
  },
  footer: {
    ...cssReset(FOOTER_DEFAULT_TAG),
  },
  body: {
    ...cssReset(BODY_DEFAULT_TAG),
  },
  row: {
    ...cssReset(ROW_DEFAULT_TAG),
  },
  summaryCell: {
    ...cssReset(SUMMARY_CELL_DEFAULT_TAG),
  },
  cell: {
    ...cssReset(CELL_DEFAULT_TAG),
  },
};

export { Table, styles };
export type {
  TableProps,
  TableHeaderProps,
  TableFooterProps,
  TableBodyProps,
  TableRowProps,
  TableSummaryCellProps,
  TableCellProps,
};
