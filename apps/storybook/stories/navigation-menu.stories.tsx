import * as React from 'react';
import { NavigationMenu, Direction } from 'radix-ui';
import styles from './navigation-menu.stories.module.css';

export default { title: 'Components/NavigationMenu' };

export const Basic = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={styles.mainList}>
          <NavigationMenu.Item className={styles.expandableItem}>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content className={styles.basicContent}>
              <LinkGroup
                bordered={false}
                items={[
                  'Fusce pellentesque',
                  'Aliquam porttitor',
                  'Pellentesque',
                  'Fusce pellentesque',
                  'Aliquam porttitor',
                  'Pellentesque',
                ]}
              />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className={styles.expandableItem}>
            <TriggerWithIndicator>Company</TriggerWithIndicator>
            <NavigationMenu.Content className={styles.basicContent}>
              <LinkGroup
                bordered={false}
                items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
              />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className={styles.expandableItem}>
            <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
            <NavigationMenu.Content className={styles.basicContent}>
              <LinkGroup bordered={false} items={['Aliquam porttitor', 'Pellentesque']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#example" className={styles.link}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

export const CustomDurations = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e5e8eb',
        paddingBottom: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Delay duration</h1>
      <h2>Default (200ms)</h2>
      <DurationNavigation />

      <h2>Custom (0ms = instant open)</h2>
      <DurationNavigation delayDuration={0} />

      <h2>Custom (700ms)</h2>
      <DurationNavigation delayDuration={700} />

      <h1 style={{ marginTop: 50 }}>Skip delay duration</h1>
      <h2>Default (300ms to move from one trigger to another)</h2>
      <DurationNavigation />

      <h2>Custom (0ms to move from one trigger to another = never skip)</h2>
      <DurationNavigation skipDelayDuration={0} />

      <h2>Custom (2000ms to move from one trigger to another)</h2>
      <DurationNavigation delayDuration={500} skipDelayDuration={2000} />
    </div>
  );
};

export const Viewport = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={styles.mainList}>
          <NavigationMenu.Item>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content
              className={styles.viewportContent}
              style={{
                gridTemplateColumns: '1fr 2fr',
                width: 600,
              }}
            >
              <LinkGroup
                items={[
                  'Fusce pellentesque',
                  'Aliquam porttitor',
                  'Pellentesque',
                  'Fusce pellentesque',
                  'Aliquam porttitor',
                  'Pellentesque',
                ]}
              />

              <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator>Company</TriggerWithIndicator>
            <NavigationMenu.Content
              className={styles.viewportContent}
              style={{
                gridTemplateColumns: '1fr 1fr',
                width: 450,
              }}
            >
              <LinkGroup
                items={[
                  'Fusce pellentesque',
                  'Aliquam porttitor',
                  'Pellentesque',
                  'Aliquam porttitor',
                ]}
              />

              <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
            <NavigationMenu.Content
              className={styles.viewportContent}
              style={{
                gridTemplateColumns: '1.6fr 1fr',
                width: 650,
              }}
            >
              <LinkGroup items={['Donec quis dui', 'Vestibulum']} />
              <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#example" className={styles.link}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator className={styles.viewportIndicator}>
            <div className={styles.viewportInnerIndicator} />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <div
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            top: '100%',
            left: 0,
          }}
        >
          <NavigationMenu.Viewport className={styles.viewportViewport} />
        </div>
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

export const Submenus = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={styles.mainList}>
          <NavigationMenu.Item>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content className={styles.submenusContent}>
              <NavigationMenu.Sub className={styles.submenusRoot} defaultValue="extensibility">
                <NavigationMenu.List className={styles.mainList}>
                  <NavigationMenu.Item value="extensibility">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Extensibility
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                      }}
                    >
                      <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Item value="security">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Security
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1fr 1fr 1fr',
                      }}
                    >
                      <LinkGroup
                        items={[
                          'Fusce pellentesque',
                          'Aliquam porttitor',
                          'Pellentesque',
                          'Vestibulum',
                        ]}
                      />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                      <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Item value="authentication">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Authentication
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                      }}
                    >
                      <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Indicator className={styles.submenusSubIndicator} />
                </NavigationMenu.List>

                <NavigationMenu.Viewport className={styles.submenusSubViewport} />
              </NavigationMenu.Sub>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator>Company</TriggerWithIndicator>
            <NavigationMenu.Content className={styles.submenusContent}>
              <NavigationMenu.Sub
                className={styles.submenusRoot}
                orientation="vertical"
                defaultValue="customers"
              >
                <NavigationMenu.List className={styles.mainList}>
                  <NavigationMenu.Item value="customers">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Customers
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1.5fr 1fr',
                      }}
                    >
                      <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Item value="partners">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Partners
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1fr 1fr',
                      }}
                    >
                      <LinkGroup
                        items={[
                          'Fusce pellentesque',
                          'Aliquam porttitor',
                          'Pellentesque',
                          'Vestibulum',
                        ]}
                      />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Item value="enterprise">
                    <NavigationMenu.Trigger className={styles.submenusSubTrigger}>
                      Enterprise
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={styles.submenusSubContent}
                      style={{
                        gridTemplateColumns: '1.5fr 1fr',
                      }}
                    >
                      <LinkGroup items={['Donec quis dui', 'Vestibulum', 'Nunc dignissim']} />
                      <LinkGroup
                        items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
                      />
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>

                  <NavigationMenu.Indicator className={styles.submenusSubIndicator} />
                </NavigationMenu.List>

                <NavigationMenu.Viewport className={styles.submenusSubViewport} />
              </NavigationMenu.Sub>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
            <NavigationMenu.Content
              className={styles.submenusSubContent}
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              <LinkGroup items={['Donec quis dui', 'Vestibulum']} />
              <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="#example" className={styles.link}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Viewport className={styles.submenusViewport} />
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const StoryFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rtl, setRtl] = React.useState(false);

  return (
    <div style={{ height: '100vh', backgroundColor: '#e5e8eb' }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20, paddingBottom: 30 }}>
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
      </div>
      <Direction.Provider dir={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              boxSizing: 'border-box',
              alignItems: 'center',
              padding: '15px 20px',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: 'white',
              boxShadow: '0 50px 100px -20px rgba(50,50,93,0.1),0 30px 60px -30px rgba(0,0,0,0.2)',
            }}
          >
            <button>Logo</button>
            {children}
            <button>Login</button>
          </div>
          <div style={{ maxWidth: 800, margin: 'auto', lineHeight: 1.5, paddingTop: 25 }}>
            <h2>Test page content</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam purus odio, vestibulum
              in dictum et, <a href="#example">sagittis vel nibh</a>. Fusce placerat arcu lorem, a
              scelerisque odio fringilla sit amet. Suspendisse volutpat sed diam ut cursus. Nulla
              facilisi. Ut at volutpat nibh. Nullam justo mi, elementum vitae ex eu,{' '}
              <a href="#example">gravida dictum metus</a>. Morbi vulputate consectetur cursus. Fusce
              vitae nisi nunc. Suspendisse pellentesque aliquet tincidunt. Aenean molestie pulvinar
              ipsum.
            </p>

            <button>Button</button>
          </div>
        </div>
      </Direction.Provider>
    </div>
  );
};

const DurationNavigation = (props: React.ComponentProps<typeof NavigationMenu.Root>) => {
  return (
    <NavigationMenu.Root
      {...props}
      style={{ backgroundColor: 'white', borderRadius: 500, padding: '2px 12px', ...props.style }}
    >
      <NavigationMenu.List className={styles.mainList}>
        <NavigationMenu.Item className={styles.expandableItem}>
          <TriggerWithIndicator>Products</TriggerWithIndicator>
          <NavigationMenu.Content className={styles.basicContent}>
            <LinkGroup
              bordered={false}
              items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className={styles.expandableItem}>
          <TriggerWithIndicator>Company</TriggerWithIndicator>
          <NavigationMenu.Content className={styles.basicContent}>
            <LinkGroup
              bordered={false}
              items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className={styles.expandableItem}>
          <TriggerWithIndicator>Developers</TriggerWithIndicator>
          <NavigationMenu.Content className={styles.basicContent}>
            <LinkGroup
              bordered={false}
              items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className={styles.expandableItem}>
          <TriggerWithIndicator>About</TriggerWithIndicator>
          <NavigationMenu.Content className={styles.basicContent}>
            <LinkGroup
              bordered={false}
              items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

const TriggerWithIndicator: React.FC<{ children?: React.ReactNode; disabled?: boolean }> = ({
  children,
  disabled,
}) => {
  return (
    <NavigationMenu.Trigger className={styles.trigger} disabled={disabled}>
      {children}
      <CaretDownIcon />
    </NavigationMenu.Trigger>
  );
};

const CaretDownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const LinkGroup: React.FC<{ items: string[]; bordered?: boolean }> = ({
  items,
  bordered = true,
}) => {
  return (
    <ul className={[bordered && styles.borderdList, styles.list].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <li key={i}>
          <NavigationMenu.Link
            href="#example"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'black',
            }}
          >
            {item}
          </NavigationMenu.Link>
        </li>
      ))}
    </ul>
  );
};
