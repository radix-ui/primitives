import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Textarea';
const DEFAULT_TAG = 'textarea';

type TextareaDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type TextareaOwnProps = {};
type TextareaProps = TextareaDOMProps & TextareaOwnProps;

const Textarea = forwardRef<typeof DEFAULT_TAG, TextareaProps>(function Textarea(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...boxProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...boxProps} />;
});

Textarea.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
    width: '100%',
    resize: 'vertical',
  },
});

export { Textarea, styles };
export type { TextareaProps };
