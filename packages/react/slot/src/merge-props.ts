import { composeRefs } from '@radix-ui/react-compose-refs';

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
      (overrideProps as any)[propName] = {
        ...(typeof slotPropValue === 'object' ? slotPropValue : null),
        ...(typeof childPropValue === 'object' ? childPropValue : null),
      };
    } else if (propName === 'className') {
      (overrideProps as any)[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    } else if (propName === 'aria-describedby') {
      (overrideProps as any)[propName] = concatAriaDescribedby(childPropValue, slotPropValue);
    } else if (propName === 'ref') {
      (overrideProps as any)[propName] = slotPropValue
        ? composeRefs(slotPropValue, childPropValue)
        : childPropValue;
    }
  }

  return { ...slotProps, ...overrideProps } as ReturnProps;
}) satisfies MergePropsFunction;

// TODO: Move to primitive once that package exposed individual sub-modules
function concatAriaDescribedby(...values: unknown[]): string | undefined {
  const ids = new Set<string>();
  for (const value of values) {
    if (typeof value !== 'string') continue;
    for (const id of String(value).trim().split(/\s+/)) {
      if (id) ids.add(id);
    }
  }

  return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
}

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
