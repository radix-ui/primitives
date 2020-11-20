import * as React from 'react';
import {
  AspectRatio,
  Box,
  Code,
  Divider as RadixDivider,
  Heading as RadixHeading,
  HeadingProps,
  Table as RadixTable,
  TableProps,
  Tbody,
  Td,
  Text,
  TextProps,
  Th,
  Thead,
  Tr,
  theme as radixTheme,
} from '@modulz/radix';
import { QuickNavItem } from './QuickNav';
import { useId } from '@interop-ui/react-utils';
import { Kbd } from './Kbd';

function Hero() {
  return (
    <AspectRatio ratio="2:1" sx={{ mt: 7, mb: 9 }}>
      <Box sx={{ bg: 'blue200', borderRadius: '2', height: '100%' }} />
    </AspectRatio>
  );
}

function Title({
  children,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h1" size={4} sx={{ lineHeight: 9 }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem label="Description">{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function Description(props: HeadingProps) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading
        as="h2"
        size={2}
        weight="normal"
        sx={{ mb: 6, lineHeight: 3, color: 'gray700' }}
        {...props}
      />
    </>
  );
}

function Heading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h3" size={3} sx={{ mt: 9, mb: 3, ...sx }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem>{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function SubHeading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h4" size={1} sx={{ lineHeight: 2, my: 4, ...sx }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem level={1}>{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function Paragraph({ sx, ...props }: TextProps) {
  return <Text as="p" size={4} sx={{ lineHeight: 3, my: 3, ...sx }} {...props} />;
}

function Divider() {
  return <RadixDivider size={2} sx={{ mx: 'auto', my: 8 }} aria-hidden />;
}

const SAFARI_FIX_TH_STYLES = {
  // Safari aligns th to the center when set to `unset`, other browsers align to the left. should be
  // fixed in Radix
  textAlign: 'left',
} as const;

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

function KeyboardInteractionTable({
  interactions,
}: {
  interactions: { keys: string[]; description: React.ReactNode }[];
}) {
  return (
    <React.Fragment>
      <Table aria-label="Keyboard interactions">
        <Thead>
          <Tr>
            <Th scope="col" sx={SAFARI_FIX_TH_STYLES}>
              Key
            </Th>
            <Th scope="col" sx={SAFARI_FIX_TH_STYLES}>
              Function
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {interactions.map(({ keys, description }, i) => (
            <Tr key={i}>
              <Td
                // Td doesn't support `as` prop, but this should be a `th` since it's really a
                // column heading. `as` still works but a) gives us a TS error, and b) breaks the
                // style a bit because of how radix uses `&:last-of-type` for the `Td` component. We
                // need to fix this in Radix, but I'm patching the styles for now.
                // @see https://github.com/modulz/radix/issues/285
                // @ts-ignore
                as="th"
                scope="row"
                sx={{
                  ...SAFARI_FIX_TH_STYLES,
                  pr: 2,
                  whiteSpace: 'nowrap',
                  '* + *': {
                    marginLeft: 2,
                  },
                  // See comment above
                  '&:last-of-type': {
                    pr: 2,
                  },
                }}
              >
                {keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </Td>
              <Td>
                <Text as="span" size={3}>
                  {description}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
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

export {
  Caption,
  Code,
  Description,
  Divider,
  Heading,
  Hero,
  KeyboardInteractionTable,
  Paragraph,
  SubHeading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Title,
  Tr,
};

interface TableContext {
  tableId: string;
  captionId: string | undefined;
  setCaptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
