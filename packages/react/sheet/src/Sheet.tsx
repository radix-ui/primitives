import * as React from 'react';
import { createContext, createStyleObj, forwardRef } from '@interop-ui/react-utils';
import { Dialog, styles as dialogStyles } from '@interop-ui/react-dialog';

/* -------------------------------------------------------------------------------------------------
 * Sheet
 * -----------------------------------------------------------------------------------------------*/

const SHEET_NAME = 'Sheet';

type SheetOwnProps = {
  /** The side where the Sheet should open */
  side?: 'left' | 'right';
};
type SheetProps = React.ComponentProps<typeof Dialog> & SheetOwnProps;

const [SheetContext, useSheetContext] = createContext<Required<SheetOwnProps>['side']>(
  'SheetContext',
  SHEET_NAME
);

const Sheet = forwardRef<
  // This silences type errors for now but will change
  // when the `PrimitiveComponent` type for consumers is added
  React.ElementType<React.ComponentPropsWithRef<typeof Dialog>>,
  SheetProps,
  SheetStaticProps
>(function Sheet(props, forwardedRef) {
  const {
    side = 'left',
    shouldCloseOnEscape = true,
    shouldCloseOnOutsideClick = true,
    ...dialogProps
  } = props;

  return (
    <SheetContext.Provider value={side}>
      <Dialog
        {...dialogProps}
        shouldCloseOnEscape={shouldCloseOnEscape}
        shouldCloseOnOutsideClick={shouldCloseOnOutsideClick}
        ref={forwardedRef}
      />
    </SheetContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SheetContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Sheet.Content';

type SheetContentProps = React.ComponentProps<typeof Dialog.Content>;

const SheetContent = forwardRef<typeof Dialog.Content, SheetContentProps>(function SheetContent(
  props,
  forwardedRef
) {
  let { style, ...contentProps } = props;
  let side = useSheetContext(CONTENT_NAME);
  return (
    <Dialog.Content
      {...contentProps}
      {...interopDataAttrObj('content')}
      ref={forwardedRef}
      style={{
        [side]: 0,
        ...style,
      }}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

Sheet.Content = SheetContent;

Sheet.displayName = SHEET_NAME;
Sheet.Content.displayName = CONTENT_NAME;

interface SheetStaticProps {
  Content: typeof SheetContent;
}

const [styles, interopDataAttrObj] = createStyleObj(SHEET_NAME, {
  root: dialogStyles.root,
  content: {
    ...dialogStyles.content,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

export { Sheet, styles };
export type { SheetProps, SheetContentProps };
