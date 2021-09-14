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
    <h1>
      One consumer child without internal slottable - <span aria-hidden>✅</span>
    </h1>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h1>
      One consumer child with internal slottable - <span aria-hidden>✅</span>
    </h1>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
    </ErrorBoundary>

    <h1>
      No consumer child without internal slottable - <span aria-hidden>🔴</span>
    </h1>
    <ErrorBoundary>
      <SlotWithoutSlottable></SlotWithoutSlottable>
    </ErrorBoundary>

    <h1>
      No consumer child with internal slottable - <span aria-hidden>🔴</span>
    </h1>
    <ErrorBoundary>
      <SlotWithSlottable></SlotWithSlottable>
    </ErrorBoundary>

    <h1>
      Multiple consumer children without internal slottable - <span aria-hidden>🔴</span>
    </h1>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h1>
      Multiple consumer children with internal slottable - <span aria-hidden>🔴</span>
    </h1>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
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
