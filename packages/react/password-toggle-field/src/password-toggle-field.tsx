import * as React from 'react';
import { flushSync } from 'react-dom';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useId } from '@radix-ui/react-id';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';

interface PasswordToggleFieldContextValue {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  syncInputId: (providedId: string | number | undefined) => void;
}

const PasswordToggleFieldContext = React.createContext<null | PasswordToggleFieldContextValue>(
  null
);
PasswordToggleFieldContext.displayName = 'PasswordToggleFieldContext';

function usePasswordToggleFieldContext() {
  const context = React.useContext(PasswordToggleFieldContext);
  if (!context) {
    throw new Error(
      'A PasswordToggleField cannot be rendered outside the PasswordToggleField component'
    );
  }
  return context;
}

type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PasswordToggleFieldProps extends PrimitiveDivProps {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisiblityChange?: (visible: boolean) => void;
}

const PasswordToggleField = React.forwardRef<HTMLDivElement, PasswordToggleFieldProps>(
  function PasswordToggleField(props, forwardedRef) {
    const baseId = useId(props.id);
    const defaultInputId = `${baseId}-input`;
    const [inputIdState, setInputIdState] = React.useState<null | string>(defaultInputId);
    const inputId = inputIdState ?? defaultInputId;
    const syncInputId = React.useCallback(
      (providedId: string | number | undefined) =>
        setInputIdState(providedId != null ? String(providedId) : null),
      []
    );

    const { visible: visibleProp, defaultVisible, onVisiblityChange, ...fieldProps } = props;
    const [visible = false, setVisible] = useControllableState({
      prop: visibleProp,
      defaultProp: defaultVisible,
      onChange: onVisiblityChange,
    });

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    return (
      <PasswordToggleFieldContext.Provider
        value={{
          inputId,
          inputRef,
          setVisible,
          syncInputId,
          visible,
        }}
      >
        <Primitive.div
          data-password-visible={visible || undefined}
          {...fieldProps}
          ref={forwardedRef}
        />
      </PasswordToggleFieldContext.Provider>
    );
  }
);

type PrimitiveInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.input>,
  'type' | 'autoComplete'
>;
interface PasswordToggleFieldInputProps extends PrimitiveInputProps {
  autoComplete?: 'current-password' | 'new-password';
}

const PasswordToggleFieldInput = React.forwardRef<HTMLInputElement, PasswordToggleFieldInputProps>(
  function PasswordToggleFieldInput(
    {
      autoComplete = 'current-password',
      autoCapitalize = 'off',
      spellCheck = false,
      id: idProp,
      ...props
    },
    forwardedRef
  ) {
    const { visible, inputRef, inputId, syncInputId } = usePasswordToggleFieldContext();
    React.useEffect(() => {
      syncInputId(idProp);
    }, [idProp, syncInputId]);
    return (
      <Primitive.input
        {...props}
        id={idProp ?? inputId}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        ref={useComposedRefs(forwardedRef, inputRef)}
        spellCheck={spellCheck}
        type={visible ? 'text' : 'password'}
      />
    );
  }
);

type PrimitiveButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.button>,
  'type' | 'children'
>;
interface PasswordToggleFieldToggleProps extends PrimitiveButtonProps {
  children?: React.ReactNode | ((args: { visible: boolean }) => React.ReactNode);
}

const PasswordToggleFieldToggle = React.forwardRef<
  HTMLButtonElement,
  PasswordToggleFieldToggleProps
>(function PasswordToggleFieldToggle(
  {
    onClick,
    onPointerDown,
    onPointerCancel,
    onFocus,
    children,
    'aria-label': ariaLabelProp,
    'aria-controls': ariaControls,
    'aria-hidden': ariaHidden,
    tabIndex,
    ...props
  },
  forwardedRef
) {
  const { setVisible, visible, inputRef, inputId } = usePasswordToggleFieldContext();
  const [internalAriaLabel, setInternalAriaLabel] = React.useState<string | undefined>(undefined);
  const elementRef = React.useRef<HTMLButtonElement>(null);
  const ref = useComposedRefs(forwardedRef, elementRef);
  const isHydrated = useIsHydrated();

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || ariaLabelProp) {
      setInternalAriaLabel(undefined);
      return;
    }

    const DEFAULT_ARIA_LABEL = visible ? 'Hide password' : 'Show password';

    function checkForInnerTextLabel(elementInnerText: string | undefined) {
      const innerText = elementInnerText ? elementInnerText : undefined;
      // If the element has inner text, no need to force an aria-label.
      setInternalAriaLabel(innerText ? undefined : DEFAULT_ARIA_LABEL);
    }

    checkForInnerTextLabel(element.innerText);

    const observer = new MutationObserver((entries) => {
      let innerText: string | undefined;
      for (const entry of entries) {
        if (entry.type === 'characterData') {
          if (element.innerText) {
            innerText = element.innerText;
          }
        }
      }
      checkForInnerTextLabel(innerText);
    });
    observer.observe(element, { characterData: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [visible, ariaLabelProp]);

  const ariaLabel = ariaLabelProp || internalAriaLabel;

  // Before hydration the button will not work, but we want to render it
  // regardless to prevent potential layout shift. Hide it from assistive tech
  // by default. Post-hydration it will be visible, focusable and associated
  // with the input via aria-controls.
  if (!isHydrated) {
    ariaHidden ??= true;
    tabIndex ??= -1;
  } else {
    ariaControls ??= inputId;
  }

  const clickTriggeredFocus = React.useRef(false);

  React.useEffect(() => {
    let cleanup = () => {};
    const ownerWindow = elementRef.current?.ownerDocument?.defaultView || window;
    const reset = () => (clickTriggeredFocus.current = false);
    const handlePointerUp = () => (cleanup = requestIdleCallback(ownerWindow, reset));
    ownerWindow.addEventListener('pointerup', handlePointerUp);
    return () => {
      cleanup();
      ownerWindow.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <Primitive.button
      aria-controls={ariaControls}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      ref={ref}
      id={inputId}
      onPointerDown={composeEventHandlers(onPointerDown, () => {
        clickTriggeredFocus.current = true;
      })}
      onPointerCancel={(event) => {
        // do not use `composeEventHandlers` here because we always want to
        // reset the ref on cancellation, regardless of whether the user has
        // called preventDefault on the event
        onPointerCancel?.(event);
        clickTriggeredFocus.current = false;
      }}
      onClick={composeEventHandlers(onClick, () => {
        flushSync(() => {
          setVisible((s) => !s);
        });
        if (clickTriggeredFocus.current) {
          clickTriggeredFocus.current = false;
          inputRef.current?.focus();
        }
      })}
      {...props}
      type="button"
    >
      {typeof children === 'function' ? children({ visible }) : children}
    </Primitive.button>
  );
});

const Root = PasswordToggleField;
const Input = PasswordToggleFieldInput;
const Toggle = PasswordToggleFieldToggle;

export {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
  //
  Root,
  Input,
  Toggle,
};
export type {
  PasswordToggleFieldProps,
  PasswordToggleFieldInputProps,
  PasswordToggleFieldToggleProps,
};

function requestIdleCallback(
  window: Window,
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): () => void {
  if ((window as any).requestIdleCallback) {
    const id = window.requestIdleCallback(callback, options);
    return () => {
      window.cancelIdleCallback(id);
    };
  }
  const start = Date.now();
  const id = window.setTimeout(() => {
    const timeRemaining = () => Math.max(0, 50 - (Date.now() - start));
    callback({ didTimeout: false, timeRemaining });
  }, 1);
  return () => {
    window.clearTimeout(id);
  };
}

type Booleanish = boolean | 'true' | 'false';
