import * as React from 'react';
import { Slot as SlotPrimitive } from 'radix-ui';

const Slot = SlotPrimitive.Root;
const Slottable = SlotPrimitive.Slottable;

export default { title: 'Utilities/Slot' };

export const WithoutSlottable = () => (
  <SlotWithoutSlottable>
    <b data-slot-element>hello</b>
  </SlotWithoutSlottable>
);

export const WithSlottable = () => (
  <SlotWithSlottable>
    <b data-slot-element>hello</b>
  </SlotWithSlottable>
);

export const WithComposedEvents = () => (
  <>
    <h1>Should log both</h1>
    <SlotWithPreventableEvent>
      <button onClick={() => console.log('button click')}>Slot event not prevented</button>
    </SlotWithPreventableEvent>

    <h1>Should log "button click"</h1>
    <SlotWithPreventableEvent>
      <button
        onClick={(event) => {
          console.log('button click');
          event.preventDefault();
        }}
      >
        Slot event prevented
      </button>
    </SlotWithPreventableEvent>

    <h1>Should log both</h1>
    <SlotWithoutPreventableEvent>
      <button onClick={() => console.log('button click')}>Slot event not prevented</button>
    </SlotWithoutPreventableEvent>

    <h1>Should log both</h1>
    <SlotWithoutPreventableEvent>
      <button
        onClick={(event) => {
          console.log('button click');
          event.preventDefault();
        }}
      >
        Slot event prevented
      </button>
    </SlotWithoutPreventableEvent>
  </>
);

export const ButtonAsLink = () => (
  <>
    <h1>Button with left/right icons</h1>
    <Button
      iconLeft={<MockIcon color="tomato" />}
      iconRight={<MockIcon color="royalblue" />}
      ref={console.log}
    >
      Button <em>text</em>
    </Button>

    <h1>Button with left/right icons as link (asChild)</h1>
    <Button
      asChild
      iconLeft={<MockIcon color="tomato" />}
      iconRight={<MockIcon color="royalblue" />}
      ref={console.log}
    >
      <a href="https://radix-ui.com">
        Button <em>text</em>
      </a>
    </Button>
  </>
);

export const Chromatic = () => (
  <>
    <h1>Without Slottable</h1>

    <h2>
      One consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Multiple consumer child - <span aria-hidden>🔴</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Null consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{null}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Empty consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable></SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      False consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{false}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      False internal child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithFalseInternalChild>
        <b data-slot-element>hello</b>
      </SlotWithFalseInternalChild>
    </ErrorBoundary>

    <h2>
      Null internal child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithNullInternalChild>
        <b data-slot-element>hello</b>
      </SlotWithNullInternalChild>
    </ErrorBoundary>

    <h2>
      String consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>test</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Number consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{1}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h1>With Slottable</h1>

    <h2>
      One consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Multiple consumer child - <span aria-hidden>🔴</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Null consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{null}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      String consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>test</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Number consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{1}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Empty consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable></SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      False consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{false}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>Button with left/right icons</h2>
    <Button iconLeft={<MockIcon color="tomato" />} iconRight={<MockIcon color="royalblue" />}>
      Button <em>text</em>
    </Button>

    <h2>Button with left/right icons as link (asChild)</h2>
    <Button
      asChild
      iconLeft={<MockIcon color="tomato" />}
      iconRight={<MockIcon color="royalblue" />}
    >
      <a href="https://radix-ui.com">
        Button <em>text</em>
      </a>
    </Button>

    <h1>With callback-dependent rendering</h1>
    <h2>Component not passing callback</h2>
    <p>Should NOT have delete button next to component</p>
    <Slot>
      <MockTag>Component</MockTag>
    </Slot>
    <h2>Component passing `undefined` callback</h2>
    <p>Should NOT have delete button next to component</p>
    <Slot>
      <MockTag onDelete={undefined}>Component</MockTag>
    </Slot>
    <h2>Component passing callback</h2>
    <p>Should have delete button next to component</p>
    <Slot>
      <MockTag onDelete={() => alert('Delete')}>Component</MockTag>
    </Slot>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

/* ---------------------------------------------------------------------------------------------- */

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ background: 'red', color: 'white', padding: 10 }}>Error</div>;
    }
    return this.props.children;
  }
}

/* Also verifying that props and ref types don't error */
const SlotWithoutSlottable = (props: React.ComponentPropsWithRef<'div'>) => (
  <Slot {...props} className="test" />
);

const SlotWithSlottable = ({ children, ...props }: any) => (
  <Slot {...props}>
    <Slottable>{children}</Slottable>
    <span>world</span>
  </Slot>
);

const SlotWithFalseInternalChild = ({ children, ...props }: any) => (
  <Slot {...props}>{false && children}</Slot>
);

const SlotWithNullInternalChild = ({ children, ...props }: any) => (
  <Slot {...props}>{false ? children : null}</Slot>
);

const SlotWithPreventableEvent = (props: any) => (
  <Slot
    {...props}
    onClick={(event) => {
      props.onClick?.(event);
      if (!event.defaultPrevented) {
        console.log(event.target);
      }
    }}
  />
);

const SlotWithoutPreventableEvent = (props: any) => (
  <Slot
    {...props}
    onClick={(event) => {
      props.onClick?.(event);
      console.log(event.target);
    }}
  />
);

const Button = ({
  children,
  asChild = false,
  iconLeft,
  iconRight,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        border: '1px solid black',
        padding: 10,
        backgroundColor: 'white',
        fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
        fontSize: 14,
        borderRadius: 3,
        ...props.style,
      }}
    >
      {iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight}
    </Comp>
  );
};

const MockIcon = ({ color = 'tomato', ...props }: React.ComponentProps<'span'>) => (
  <span
    {...props}
    style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      backgroundColor: color,
      ...props.style,
    }}
  />
);

const MockTag = ({
  onDelete,
  ...props
}: React.ComponentProps<'div'> & {
  onDelete?: () => void;
}) => {
  return (
    <div {...props}>
      {props.children} {onDelete ? <button onClick={onDelete}>delete</button> : null}
    </div>
  );
};
