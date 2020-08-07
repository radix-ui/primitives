import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Table
 * -----------------------------------------------------------------------------------------------*/

const TABLE_NAME = 'Table';
const TABLE_DEFAULT_TAG = 'table';

type TableDOMProps = React.ComponentPropsWithoutRef<typeof TABLE_DEFAULT_TAG>;
type TableOwnProps = {};
type TableProps = TableDOMProps & TableOwnProps;

const Table = forwardRef<typeof TABLE_DEFAULT_TAG, TableProps, TableStaticProps>(function Table(
  props,
  forwardedRef
) {
  const { as: Comp = TABLE_DEFAULT_TAG, ...tableProps } = props;
  return <Comp {...interopDataAttrObj(TABLE_NAME)} ref={forwardedRef} {...tableProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * TableHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'Table.Header';
const HEADER_DEFAULT_TAG = 'thead';

type TableHeaderDOMProps = React.ComponentPropsWithoutRef<typeof HEADER_DEFAULT_TAG>;
type TableHeaderOwnProps = {};
type TableHeaderProps = TableHeaderDOMProps & TableHeaderOwnProps;

const TableHeader = forwardRef<typeof HEADER_DEFAULT_TAG, TableHeaderProps>(function TableHeader(
  props,
  forwardedRef
) {
  const { as: Comp = HEADER_DEFAULT_TAG, ...headerProps } = props;
  return <Comp {...interopDataAttrObj(HEADER_NAME)} ref={forwardedRef} {...headerProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * TableFooter
 * -----------------------------------------------------------------------------------------------*/

const FOOTER_NAME = 'Table.Footer';
const FOOTER_DEFAULT_TAG = 'tfoot';

type TableFooterDOMProps = React.ComponentPropsWithoutRef<typeof FOOTER_DEFAULT_TAG>;
type TableFooterOwnProps = {};
type TableFooterProps = TableFooterDOMProps & TableFooterOwnProps;

const TableFooter = forwardRef<typeof FOOTER_DEFAULT_TAG, TableFooterProps>(function TableFooter(
  props,
  forwardedRef
) {
  const { as: Comp = FOOTER_DEFAULT_TAG, ...footerProps } = props;
  return <Comp {...interopDataAttrObj(FOOTER_NAME)} ref={forwardedRef} {...footerProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * TableBody
 * -----------------------------------------------------------------------------------------------*/

const BODY_NAME = 'Table.Body';
const BODY_DEFAULT_TAG = 'tbody';

type TableBodyDOMProps = React.ComponentPropsWithoutRef<typeof BODY_DEFAULT_TAG>;
type TableBodyOwnProps = {};
type TableBodyProps = TableBodyDOMProps & TableBodyOwnProps;

const TableBody = forwardRef<typeof BODY_DEFAULT_TAG, TableBodyProps>(function TableBody(
  props,
  forwardedRef
) {
  const { as: Comp = BODY_DEFAULT_TAG, ...bodyProps } = props;
  return <Comp {...interopDataAttrObj(BODY_NAME)} ref={forwardedRef} {...bodyProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * TableRow
 * -----------------------------------------------------------------------------------------------*/

const ROW_NAME = 'Table.Row';
const ROW_DEFAULT_TAG = 'tr';

type TableRowDOMProps = React.ComponentPropsWithoutRef<typeof ROW_DEFAULT_TAG>;
type TableRowOwnProps = {};
type TableRowProps = TableRowDOMProps & TableRowOwnProps;

const TableRow = forwardRef<typeof ROW_DEFAULT_TAG, TableRowProps>(function TableRow(
  props,
  forwardedRef
) {
  const { as: Comp = ROW_DEFAULT_TAG, ...rowProps } = props;
  return <Comp {...interopDataAttrObj(ROW_NAME)} ref={forwardedRef} {...rowProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * TableSummaryCell
 * -----------------------------------------------------------------------------------------------*/

const SUMMARY_CELL_NAME = 'Table.SummaryCell';
const SUMMARY_CELL_DEFAULT_TAG = 'th';

type TableSummaryCellDOMProps = React.ComponentPropsWithoutRef<typeof SUMMARY_CELL_DEFAULT_TAG>;
type TableSummaryCellOwnProps = {};
type TableSummaryCellProps = TableSummaryCellDOMProps & TableSummaryCellOwnProps;

const TableSummaryCell = forwardRef<typeof SUMMARY_CELL_DEFAULT_TAG, TableSummaryCellProps>(
  function TableSummaryCell(props, forwardedRef) {
    const { as: Comp = SUMMARY_CELL_DEFAULT_TAG, ...cellProps } = props;
    return <Comp {...interopDataAttrObj(SUMMARY_CELL_NAME)} ref={forwardedRef} {...cellProps} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * TableCell
 * -----------------------------------------------------------------------------------------------*/

const CELL_NAME = 'Table.Cell';
const CELL_DEFAULT_TAG = 'td';

type TableCellDOMProps = React.ComponentPropsWithoutRef<typeof CELL_DEFAULT_TAG>;
type TableCellOwnProps = {};
type TableCellProps = TableCellDOMProps & TableCellOwnProps;

const TableCell = forwardRef<typeof CELL_DEFAULT_TAG, TableCellProps>(function TableCell(
  props,
  forwardedRef
) {
  const { as: Comp = CELL_DEFAULT_TAG, ...cellProps } = props;
  return <Comp {...interopDataAttrObj(CELL_NAME)} ref={forwardedRef} {...cellProps} />;
});

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

Table.displayName = TABLE_NAME;
Table.Header.displayName = HEADER_NAME;
Table.Footer.displayName = FOOTER_NAME;
Table.Body.displayName = BODY_NAME;
Table.Row.displayName = ROW_NAME;
Table.SummaryCell.displayName = SUMMARY_CELL_NAME;
Table.Cell.displayName = CELL_NAME;

const styles: PrimitiveStyles = {
  [interopSelector(TABLE_NAME)]: {
    ...cssReset(TABLE_DEFAULT_TAG),
    borderCollapse: 'collapse',
    width: '100%',
  },
  [interopSelector(HEADER_NAME)]: {
    ...cssReset(HEADER_DEFAULT_TAG),
  },
  [interopSelector(FOOTER_NAME)]: {
    ...cssReset(FOOTER_DEFAULT_TAG),
  },
  [interopSelector(BODY_NAME)]: {
    ...cssReset(BODY_DEFAULT_TAG),
  },
  [interopSelector(ROW_NAME)]: {
    ...cssReset(ROW_DEFAULT_TAG),
  },
  [interopSelector(SUMMARY_CELL_NAME)]: {
    ...cssReset(SUMMARY_CELL_DEFAULT_TAG),
  },
  [interopSelector(CELL_NAME)]: {
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
