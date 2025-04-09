import * as React from 'react';
import { Portal } from 'radix-ui';
import { Popper } from 'radix-ui/internal';
import styles from './popper.stories.module.css';

export default { title: 'Utilities/Popper' };

export const Styled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className={styles.content} sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <Popper.Arrow className={styles.arrow} width={20} height={10} />
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithCustomArrow = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className={styles.content} side="right" sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <Popper.Arrow asChild offset={20}>
              <CustomArrow width={20} height={10} />
            </Popper.Arrow>
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const Animated = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal.Root asChild>
            <Popper.Content
              className={[styles.content, styles.animatedContent].join(' ')}
              sideOffset={5}
            >
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className={styles.arrow} width={20} height={10} offset={25} />
            </Popper.Content>
          </Portal.Root>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithPortal = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal.Root asChild>
            <Popper.Content className={styles.content} sideOffset={5}>
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className={styles.arrow} width={20} height={10} />
            </Popper.Content>
          </Portal.Root>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const WithUpdatePositionStrategyAlways = () => {
  const [open, setOpen] = React.useState(false);
  const [left, setLeft] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setLeft((prev) => (prev + 50) % 300);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor
          className={styles.anchor}
          onClick={() => setOpen(true)}
          style={{ marginLeft: left }}
        >
          open
        </Popper.Anchor>

        {open && (
          <Portal.Root asChild>
            <Popper.Content
              className={styles.content}
              sideOffset={5}
              updatePositionStrategy="always"
            >
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className={styles.arrow} width={20} height={10} />
            </Popper.Content>
          </Portal.Root>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export const Chromatic = () => {
  const [scrollContainer1, setScrollContainer1] = React.useState<HTMLDivElement | null>(null);
  const [scrollContainer2, setScrollContainer2] = React.useState<HTMLDivElement | null>(null);

  return (
    <div style={{ paddingBottom: 500 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,

          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,

          backgroundColor: 'grey',
          border: '1px solid black',
        }}
      >
        <h1>In fixed header</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>1</Popper.Anchor>
          <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow} width={10} height={5} />1
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>2</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow} width={10} height={5} />2 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </header>

      <div
        style={{
          marginTop: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,
          border: '1px solid black',
        }}
      >
        <h1>In normal page flow</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>3</Popper.Anchor>
          <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow} width={10} height={5} />3
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>4</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow} width={10} height={5} />4 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,
          border: '1px solid black',
        }}
      >
        <h1>In relative parent</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>5</Popper.Anchor>
          <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow} width={10} height={5} />5
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>6</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow} width={10} height={5} />6 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </div>

      <div
        style={{
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,
          border: '1px solid black',
          transform: 'translate3d(100px, 0, 0)',
        }}
      >
        <h1>In translated parent</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>7</Popper.Anchor>
          <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow} width={10} height={5} />7
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>8</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content className={contentClass({ size: 'small' })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow} width={10} height={5} />8 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </div>

      <div style={{ display: 'flex', gap: 100 }}>
        <div>
          <h1>In scrolling container</h1>
          <div
            ref={setScrollContainer1}
            style={{ width: 400, height: 600, overflow: 'auto', border: '1px solid black' }}
          >
            <div style={{ height: 2000 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 150,
                    paddingBottom: 100,
                  }}
                >
                  <Popper.Root>
                    <Popper.Anchor className={anchorClass({ size: 'small' })}>
                      9.{i + 1}
                    </Popper.Anchor>
                    <Popper.Content
                      className={contentClass({ size: 'small' })}
                      sideOffset={5}
                      hideWhenDetached
                      collisionBoundary={scrollContainer1}
                    >
                      <Popper.Arrow className={styles.arrow} width={10} height={5} />
                      9.{i + 1}
                    </Popper.Content>
                  </Popper.Root>

                  <Popper.Root>
                    <Popper.Anchor className={anchorClass({ size: 'small' })}>
                      10.{i + 1}
                    </Popper.Anchor>
                    <Portal.Root asChild>
                      <Popper.Content
                        className={contentClass({ size: 'small' })}
                        sideOffset={5}
                        hideWhenDetached
                        collisionBoundary={scrollContainer1}
                      >
                        <Popper.Arrow className={styles.arrow} width={10} height={5} />
                        10.{i + 1} (portalled)
                      </Popper.Content>
                    </Portal.Root>
                  </Popper.Root>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1>With position sticky</h1>
          <div
            ref={setScrollContainer2}
            style={{ width: 400, height: 600, overflow: 'auto', border: '1px solid black' }}
          >
            <div style={{ height: 2000 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 150,
                    paddingBottom: 100,
                    position: 'sticky',
                    top: 0,
                  }}
                >
                  <Popper.Root>
                    <Popper.Anchor className={anchorClass({ size: 'small' })}>
                      9.{i + 1}
                    </Popper.Anchor>
                    <Popper.Content
                      className={contentClass({ size: 'small' })}
                      sideOffset={5}
                      hideWhenDetached
                      collisionBoundary={scrollContainer2}
                    >
                      <Popper.Arrow className={styles.arrow} width={10} height={5} />
                      9.{i + 1}
                    </Popper.Content>
                  </Popper.Root>

                  <Popper.Root>
                    <Popper.Anchor className={anchorClass({ size: 'small' })}>
                      10.{i + 1}
                    </Popper.Anchor>
                    <Portal.Root asChild>
                      <Popper.Content
                        className={contentClass({ size: 'small' })}
                        sideOffset={5}
                        hideWhenDetached
                        collisionBoundary={scrollContainer2}
                      >
                        <Popper.Arrow className={styles.arrow} width={10} height={5} />
                        10.{i + 1} (portalled)
                      </Popper.Content>
                    </Portal.Root>
                  </Popper.Root>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,
          border: '1px solid black',
        }}
      >
        <h1>Logical "start" alignment (LTR)</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>11</Popper.Anchor>
          <Popper.Content align="start" className={contentClass({ size: 'small' })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow} width={10} height={5} />
            11
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>12</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content
              align="start"
              className={contentClass({ size: 'small' })}
              sideOffset={5}
            >
              <Popper.Arrow className={styles.arrow} width={10} height={5} />
              12 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </div>
      <div
        style={{
          marginTop: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 150,
          border: '1px solid black',
        }}
      >
        <h1>Logical "start" alignment (RTL)</h1>
        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>13</Popper.Anchor>
          <Popper.Content
            align="start"
            className={contentClass({ size: 'small' })}
            sideOffset={5}
            dir="rtl"
          >
            <Popper.Arrow className={styles.arrow} width={10} height={5} />
            13
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={anchorClass({ size: 'small' })}>14</Popper.Anchor>
          <Portal.Root asChild>
            <Popper.Content
              align="start"
              className={contentClass({ size: 'small' })}
              sideOffset={5}
              dir="rtl"
            >
              <Popper.Arrow className={styles.arrow} width={10} height={5} />
              14 (portalled)
            </Popper.Content>
          </Portal.Root>
        </Popper.Root>
      </div>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const Scrollable = (props: any) => (
  <div
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    {...props}
  />
);

const CustomArrow = (props: any) => (
  <div
    {...props}
    style={{
      ...props.style,
      width: 20,
      height: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: 'tomato',
    }}
  />
);

function anchorClass(props: { size: 'small' | 'large' }) {
  return [
    styles.anchor,
    props.size === 'small' && styles.anchorSmall,
    props.size === 'large' && styles.anchorLarge,
  ]
    .filter(Boolean)
    .join(' ');
}

function contentClass(props: { size: 'small' | 'large' }) {
  return [
    styles.content,
    props.size === 'small' && styles.contentSmall,
    props.size === 'large' && styles.contentLarge,
  ]
    .filter(Boolean)
    .join(' ');
}
