import * as React from 'react';
import {
  Box,
  Table as RadixTable,
  TableProps,
  Tbody,
  Td,
  Text,
  TextProps,
  Th,
  Thead,
  Tfoot,
  Tr,
  theme as radixTheme,
} from '@modulz/radix';
import { useId } from '@interop-ui/react-utils';

const TableContext = React.createContext<TableContext>({
  tableId: '',
  captionId: undefined,
  setCaptionId: () => {},
});
TableContext.displayName = 'TableContext';

function Table({ sx, ...props }: TableProps) {
  // This table wrapper improves accessibility in a few ways:
  // - overflow: auto makes sure that the table is scrollable on the x axis to support small screens
  //   and zoom/magnification settings, while preventing the entire page from scrolling on the
  //   x-axis
  // - tabindex="0" makes the table focusable so that the user can scroll on the x axis via keyboard
  // - Anything that receives focus must have an accessible name and a role that can be
  //   programmatically determined, which should be provided by a visible `Caption` component or
  //   `aria-label` or `aria-labelledby`
  const generatedTableId = useId();
  const tableId = props.id || `table-${generatedTableId}`;
  const [captionId, setCaptionId] = React.useState<string | undefined>(undefined);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const { 'aria-labelledby': ariaLabelledBy, 'aria-label': ariaLabel, ...rest } = props;

  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);

  return (
    <TableContext.Provider value={{ tableId, setCaptionId, captionId }}>
      <Box
        as="div"
        ref={boxRef}
        role="region"
        aria-label={ariaLabel}
        aria-labelledby={hasAriaLabel ? (ariaLabel ? undefined : ariaLabelledBy) : captionId}
        tabIndex={0}
        sx={{
          overflow: 'auto',
          '&:focus': {
            outline: 0,
            boxShadow: `0 0 0 3px ${radixTheme.colors.blue400}`,
          },
        }}
      >
        <RadixTable {...rest} id={tableId} />
      </Box>
    </TableContext.Provider>
  );
}

function Caption(props: TextProps) {
  const { tableId, setCaptionId, captionId } = React.useContext(TableContext);
  const generatedCaptionId = `caption-${tableId}`;
  React.useEffect(() => {
    setCaptionId(props.id || generatedCaptionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, generatedCaptionId]);
  return <Text as="caption" size={1} {...props} id={captionId} />;
}

interface TableContext {
  tableId: string;
  captionId: string | undefined;
  setCaptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export { Table, Caption, Tbody, Thead, Th, Td, Tr, Tfoot };
export type { TableProps };
