import * as React from 'react';

type TextareaDOMProps = React.ComponentProps<'div'>;
type TextareaOwnProps = {};
type TextareaProps = TextareaDOMProps & TextareaOwnProps;

const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(function Textarea(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
