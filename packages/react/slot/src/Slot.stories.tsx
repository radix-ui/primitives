import * as React from 'react';
import { Slot, Slottable } from './Slot';

export default { title: 'Components/Slot' };

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

const SlotWithoutSlottable = (props: any) => <Slot {...props} />;
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
