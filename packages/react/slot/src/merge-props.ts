const mergeProps = (<
  SlotProps extends AnyProps = AnyProps,
  ChildProps extends AnyProps = SlotProps,
  ReturnProps extends AnyProps = SlotProps & ChildProps,
>(
  slotProps: SlotProps,
  childProps: ChildProps,
): ReturnProps => {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        const slotIsFunction = typeof slotPropValue === 'function';
        const childIsFunction = typeof childPropValue === 'function';
        if (process.env.NODE_ENV === 'development') {
          if (!slotIsFunction || !childIsFunction) {
            console.warn(
              `Slot: Expected a function for ${propName}, but received ${[typeof slotPropValue, typeof childPropValue].filter((v) => v !== 'function').join(' and ')}.`,
            );
          }
        }

        // @ts-expect-error - we don't know the type of the function. This
        // technically makes the return signature a lie, not sure if it's worth
        // handling.
        overrideProps[propName] = (...args: unknown[]) => {
          const result = childIsFunction ? childPropValue(...args) : undefined;
          if (slotIsFunction) {
            slotPropValue(...args);
          }
          return result;
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }

    // if it's `style`, we merge them
    else if (propName === 'style') {
      // @ts-expect-error
      overrideProps[propName] = {
        ...(typeof slotPropValue === 'object' ? slotPropValue : null),
        ...(typeof childPropValue === 'object' ? childPropValue : null),
      };
    } else if (propName === 'className') {
      // @ts-expect-error
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps } as ReturnProps;
}) satisfies MergePropsFunction;

interface MergePropsFunction<
  SlotProps extends AnyProps = UnknownProps,
  ChildProps extends AnyProps = SlotProps,
  ReturnProps extends AnyProps = SlotProps & ChildProps,
> {
  (slotProps: SlotProps, childProps: ChildProps): ReturnProps;
}

type AnyProps = Record<string, any>;
type UnknownProps = Record<string, unknown>;

export { mergeProps };
export type { MergePropsFunction, AnyProps, UnknownProps };
