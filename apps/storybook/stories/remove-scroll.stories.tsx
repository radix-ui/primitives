import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RemoveScroll } from 'radix-ui/internal';
import styles from './remove-scroll.stories.module.css';
import cx from 'clsx';

export default { title: 'Lock' };

export const Vertical = () => <VScroll />;
export const Horizontal = () => <HScroll />;
export const RTLHorizontal = () => <RTLHScroll />;
export const VH = () => <HVScroll />;
export const VHBlocked = () => <HVScrollBlocked />;
export const PortalsShards = () => <PortalBox />;
export const PortalsShardsBlocked = () => <PortalBox options={{ inert: true }} />;
export const SpecialRange = () => <RangeInput />;

const HScroll = () => <XYBox axis="h">{filler(1)}</XYBox>;

const VScroll = () => <XYBox axis="v">{filler(1)}</XYBox>;

const HVScroll = () => <XYBox axis="h">{filler(3)}</XYBox>;

const HVScrollBlocked = () => (
  <XYBox axis="h" options={{ inert: true }}>
    {filler(3)}
  </XYBox>
);

const RangeInput = () => (
  <XYBox axis="h" options={{ inert: true }}>
    {filler(1)}
    <div style={{ display: 'flex' }}>
      <input type="range" />
    </div>
    {filler(1)}
  </XYBox>
);

const RTLHScroll = () => (
  <div style={{ direction: 'rtl' }}>
    <XYBox axis="h">{filler(1)}</XYBox>
  </div>
);

function XYBox({
  axis,
  children,
  options = {},
}: {
  axis: 'h' | 'v';
  children: React.ReactNode;
  options?: { inert?: boolean };
}) {
  const outerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (outerRef.current) {
      outerRef.current.scrollTop = 50;
      outerRef.current.scrollLeft = 50;
    }
  }, []);

  return (
    <div className={styles.App}>
      <div className={styles.SubOuter} ref={outerRef}>
        <div className={styles.SubParent}>
          <RemoveScroll.Root enabled={true} {...options}>
            <div className={styles.Sub}>
              <div
                className={cx(
                  styles.Container,
                  axis === 'h' && styles.ContainerH,
                  axis === 'v' && styles.ContainerV,
                )}
              >
                {children}
              </div>
            </div>
          </RemoveScroll.Root>
        </div>
      </div>
    </div>
  );
}

function filler(repeat: number) {
  return Array(repeat).fill(
    <ul className={styles.FlexContainer}>
      <li className={styles.FlexItem}>*1</li>
      <li className={styles.FlexItem}>2</li>
      <li className={styles.FlexItem}>3</li>
      <li className={styles.FlexItem}>4</li>
      <li className={styles.FlexItem}>5</li>
      <li className={styles.FlexItem}>6</li>
      <li className={styles.FlexItem}>7</li>
      <li className={styles.FlexItem}>8</li>
    </ul>,
  );
}

const fill = (x: number, y: number) => {
  const a: number[] = [];

  for (let i = 0; i < x; ++i) {
    a.push(y);
  }

  return a;
};

const PDiv = ({
  top,
  children,
  forwardRef,
}: {
  top: number;
  children: React.ReactNode;
  forwardRef?: React.Ref<HTMLDivElement>;
}) => (
  <div
    ref={forwardRef}
    style={{
      position: 'absolute',
      overflow: 'scroll',
      left: 50,
      right: 0,
      top: top,
      //width: '100%',
      height: '50px',
      backgroundColor: 'rgba(0,100,100,0.5)',
      zIndex: 10,
    }}
    // className={zeroRightClassName}
  >
    <button onClick={() => alert('xxx')}>click me</button>
    {children} SCROLLABLE
    {fill(20, 1).map((x) => (
      <p key={x}>{x}****</p>
    ))}
  </div>
);

const Portal = () => {
  const [, setState] = React.useState<any>(null);
  React.useEffect(() => {
    setState({});
  }, []);
  if (document.getElementById('portal')) {
    return ReactDOM.createPortal(<PDiv top={200}>Portal</PDiv>, document.getElementById('portal')!);
  } else {
    return null;
  }
};

export function PortalBox({ axis, repeat, options = {} }: any) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className={styles.App}>
      <div className={styles.SubOuter} ref={outerRef}>
        <div className={styles.SubParent}>
          <div id="portal">portal</div>
          <RemoveScroll.Root enabled={true} {...options} shards={[ref]}>
            <div className={styles.Sub}>
              <div
                className={cx(
                  styles.Container,
                  axis === 'h' && styles.ContainerH,
                  axis === 'v' && styles.ContainerV,
                )}
              >
                {Array(repeat).fill(
                  <ul className={styles.FlexContainer}>
                    <li className={styles.FlexItem}>*1</li>
                    <li className={styles.FlexItem}>2</li>
                    <li className={styles.FlexItem}>3</li>
                    <li className={styles.FlexItem}>4</li>
                    <li className={styles.FlexItem}>5</li>
                    <li className={styles.FlexItem}>6</li>
                    <li className={styles.FlexItem}>7</li>
                    <li className={styles.FlexItem}>8</li>
                  </ul>,
                )}
              </div>
            </div>
            <Portal />
          </RemoveScroll.Root>
          <PDiv top={100} forwardRef={ref}>
            shard
          </PDiv>
        </div>
      </div>
    </div>
  );
}

export const PinchZoomNoOverflow = () => (
  <div className="App">
    <RemoveScroll.Root allowPinchZoom style={{ height: '5000px' }}>
      <div
        style={{
          border: '1px solid black',
          padding: '20px',
          height: '300px',
          overflow: 'auto',
          background: 'black',
          color: 'white',
        }}
      >
        <div>Content</div>
      </div>
    </RemoveScroll.Root>
  </div>
);

export const PinchZoomOverflow = () => (
  <div className="App">
    <RemoveScroll.Root allowPinchZoom style={{ height: '5000px' }}>
      <div
        style={{
          border: '1px solid black',
          padding: '20px',
          height: '300px',
          overflow: 'auto',
          background: 'black',
          color: 'white',
        }}
      >
        <div style={{ height: '1000px' }}>Content</div>
      </div>
    </RemoveScroll.Root>
  </div>
);

export const ControlPinchZoomDisabled = () => (
  <div className="App">
    <RemoveScroll.Root style={{ height: '5000px' }}>
      <div
        style={{
          border: '1px solid black',
          padding: '20px',
          height: '300px',
          overflow: 'auto',
          background: 'black',
          color: 'white',
        }}
      >
        <div style={{ height: '1000px' }}>Content</div>
      </div>
    </RemoveScroll.Root>
  </div>
);

function LongList() {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <RemoveScroll.Root>
        <div style={{ overflow: 'auto', height: '100vh' }}>
          {new Array(100).fill(0).map((_, idx) => (
            <div key={idx}>Inside {idx}</div>
          ))}
        </div>
      </RemoveScroll.Root>

      {new Array(100).fill(0).map((_, idx) => (
        <div key={idx}>Outside {idx}</div>
      ))}
    </div>
  );
}

export function ScrollInShadowDom() {
  const [portal, setPortal] = React.useState<any>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const shadowRoot = node.attachShadow({ mode: 'open' });
      setPortal(ReactDOM.createPortal(<LongList />, shadowRoot));
    }
  }, []);

  return (
    <div style={{ height: 300, overflow: 'scroll', padding: 50, backgroundColor: 'yellow' }}>
      <div ref={setRef} />
      {portal}
    </div>
  );
}

export const TextAreaOverflow = () => (
  <RemoveScroll.Root>
    <div>
      <textarea>{'hello'.repeat(500)}</textarea>
    </div>
  </RemoveScroll.Root>
);
