import * as React from 'react';
import * as NavigationMenu from './NavigationMenu';
import { css } from '../../../../stitches.config';

export default { title: 'Components/NavigationMenu' };

export const Basic = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={mainListClass}>
          <NavigationMenu.Item className={expandableItemClass}>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content className={basicContentClass}>
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

          <NavigationMenu.Item className={expandableItemClass}>
            <TriggerWithIndicator>Company</TriggerWithIndicator>
            <NavigationMenu.Content className={basicContentClass}>
              <LinkGroup
                bordered={false}
                items={['Fusce pellentesque', 'Aliquam porttitor', 'Pellentesque']}
              />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className={expandableItemClass}>
            <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
            <NavigationMenu.Content className={basicContentClass}>
              <LinkGroup bordered={false} items={['Aliquam porttitor', 'Pellentesque']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/" className={linkClass}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

export const Viewport = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={mainListClass}>
          <NavigationMenu.Item>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content
              className={viewportContentClass}
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
              className={viewportContentClass}
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
              className={viewportContentClass}
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
            <NavigationMenu.Link href="/" className={linkClass}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator className={viewportIndicatorClass}>
            <div className={viewportInnerIndicatorClass} />
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
          <NavigationMenu.Viewport className={viewportViewportClass} />
        </div>
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

export const Submenus = () => {
  return (
    <StoryFrame>
      <NavigationMenu.Root>
        <NavigationMenu.List className={mainListClass}>
          <NavigationMenu.Item>
            <TriggerWithIndicator>Products</TriggerWithIndicator>
            <NavigationMenu.Content className={submenusContentClass}>
              <NavigationMenu.Sub className={submenusRootClass} defaultValue="extensibility">
                <NavigationMenu.List className={mainListClass}>
                  <NavigationMenu.Item value="extensibility">
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Extensibility
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Security
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Authentication
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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

                  <NavigationMenu.Indicator className={submenusSubIndicatorClass} />
                </NavigationMenu.List>

                <NavigationMenu.Viewport className={submenusSubViewportClass} />
              </NavigationMenu.Sub>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator>Company</TriggerWithIndicator>
            <NavigationMenu.Content className={submenusContentClass}>
              <NavigationMenu.Sub
                className={submenusRootClass}
                orientation="vertical"
                defaultValue="customers"
              >
                <NavigationMenu.List className={mainListClass}>
                  <NavigationMenu.Item value="customers">
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Customers
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Partners
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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
                    <NavigationMenu.Trigger className={submenusSubTriggerClass}>
                      Enterprise
                    </NavigationMenu.Trigger>

                    <NavigationMenu.Content
                      className={submenusSubContentClass}
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

                  <NavigationMenu.Indicator className={submenusSubIndicatorClass} />
                </NavigationMenu.List>

                <NavigationMenu.Viewport className={submenusSubViewportClass} />
              </NavigationMenu.Sub>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <TriggerWithIndicator disabled>Developers</TriggerWithIndicator>
            <NavigationMenu.Content
              className={submenusSubContentClass}
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              <LinkGroup items={['Donec quis dui', 'Vestibulum']} />
              <LinkGroup items={['Fusce pellentesque', 'Aliquam porttitor']} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/" className={linkClass}>
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Viewport className={submenusViewportClass} />
      </NavigationMenu.Root>
    </StoryFrame>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const StoryFrame: React.FC = ({ children }) => {
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
            in dictum et, <a href="/">sagittis vel nibh</a>. Fusce placerat arcu lorem, a
            scelerisque odio fringilla sit amet. Suspendisse volutpat sed diam ut cursus. Nulla
            facilisi. Ut at volutpat nibh. Nullam justo mi, elementum vitae ex eu,{' '}
            <a href="/">gravida dictum metus</a>. Morbi vulputate consectetur cursus. Fusce vitae
            nisi nunc. Suspendisse pellentesque aliquet tincidunt. Aenean molestie pulvinar ipsum.
          </p>

          <button>Button</button>
        </div>
      </div>
    </div>
  );
};

const TriggerWithIndicator: React.FC<{ disabled?: boolean }> = ({ children, disabled }) => {
  return (
    <NavigationMenu.Trigger className={triggerClass} disabled={disabled}>
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
    <ul className={bordered ? borderdListClass : listClass}>
      {items.map((item, i) => (
        <li key={i}>
          <NavigationMenu.Link
            href="/"
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

const listStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  margin: 0,
  padding: 0,
  listStyle: 'none',
} as const;

const listClass = css(listStyles);

const borderdListClass = css({
  ...listStyles,
  backgroundColor: '#f3f4f5',
  border: '1px solid #d4d6d8',
  padding: 25,
  borderRadius: 8,
});

/* -----------------------------------------------------------------------------------------------*/

const fadeIn = css.keyframes({
  from: {
    opacity: 0,
  },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const scaleIn = css.keyframes({
  from: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
  to: { transform: 'scale(1)', opacity: 1 },
});

const scaleOut = css.keyframes({
  from: {
    transform: 'scale(1)',
    opacity: 1,
  },
  to: {
    transform: 'scale(0.95)',
    opacity: 0,
  },
});

const enterFromRight = css.keyframes({
  from: { transform: 'translate3d(200px,0,0)', opacity: 0 },
  to: { transform: 'translate3d(0,0,0)', opacity: 1 },
});

const enterFromLeft = css.keyframes({
  from: { transform: 'translate3d(-200px,0,0)', opacity: 0 },
  to: { transform: 'translate3d(0,0,0)', opacity: 1 },
});

const exitToRight = css.keyframes({
  from: { transform: 'translate3d(0,0,0)', opacity: 1 },
  to: { transform: 'translate3d(200px,0,0)', opacity: 0 },
});

const exitToLeft = css.keyframes({
  from: { transform: 'translate3d(0,0,0)', opacity: 1 },
  to: { transform: 'translate3d(-200px,0,0)', opacity: 0 },
});

/* -----------------------------------------------------------------------------------------------*/

const mainListClass = css({
  all: 'unset',
  listStyle: 'none',
  display: 'flex',

  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
  },
});

const expandableItemClass = css({
  position: 'relative',
});

const itemStyles = {
  padding: '10px 16px',
  fontWeight: 'bold',
};

const triggerClass = css({
  ...itemStyles,
  display: 'flex',
  alignItems: 'center',
  border: 0,
  background: 'transparent',
  fontSize: 'inherit',
  gap: 4,

  '> svg': {
    transition: 'transform 200ms ease',
  },

  '&[data-state="open"] > svg': {
    transform: 'rotate(-180deg)',
  },
});

const linkClass = css({
  ...itemStyles,
  color: 'inherit',
  textDecoration: 'none',
  display: 'block',
});

/* -----------------------------------------------------------------------------------------------*/

const basicContentClass = css({
  position: 'absolute',
  top: '100%',
  width: 'max-content',
  left: 0,
  marginTop: 5,
  gridGap: 20,
  borderRadius: 10,
  backgroundColor: 'white',
  padding: 20,
  transformOrigin: 'top left',
  boxShadow: '0 10px 100px -20px rgba(50,50,93,0.25),0 30px 60px -30px rgba(0,0,0,0.3);',

  '[dir="rtl"] &': {
    left: 'unset',
    right: 0,
    transformOrigin: 'top right',
  },

  '&[data-state="open"]': {
    animation: `${scaleIn} 250ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${scaleOut} 250ms ease`,
  },
});

/* -----------------------------------------------------------------------------------------------*/

const viewportIndicatorClass = css({
  display: 'flex',
  justifyContent: 'center',
  height: 10,
  bottom: -30,
  zIndex: 1,
  transition: 'transform, width 250ms ease',
  overflow: 'hidden',

  '&[data-state="visible"]': {
    animation: `${fadeIn} 250ms ease`,
  },
  '&[data-state="hidden"]': {
    animation: `${fadeOut} 250ms ease`,
  },
});

const viewportInnerIndicatorClass = css({
  position: 'relative',
  top: 4,
  width: 20,
  height: 20,
  backgroundColor: 'white',
  transform: 'rotate(45deg)',
  borderRadius: 3,
});

const viewportViewportClass = css({
  position: 'relative',
  backgroundColor: 'white',
  transition: 'width, height 300ms ease',
  width: 'var(--radix-navigation-menu-viewport-width)',
  height: 'var(--radix-navigation-menu-viewport-height)',
  transformOrigin: 'top center',
  overflow: 'hidden',
  marginTop: 15,
  borderRadius: 8,
  boxShadow: '0 50px 100px -20px rgba(50,50,93,0.25),0 30px 60px -30px rgba(0,0,0,0.3);',
  '&[data-state="open"]': {
    animation: `${scaleIn} 300ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${scaleOut} 300ms ease`,
  },
});

const viewportContentClass = css({
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'grid',
  gridGap: 20,
  padding: 40,

  '&[data-motion="from-start"]': {
    animation: `${enterFromLeft} 250ms ease`,
  },
  '&[data-motion="from-end"]': {
    animation: `${enterFromRight} 250ms ease`,
  },
  '&[data-motion="to-start"]': {
    animation: `${exitToLeft} 250ms ease`,
  },
  '&[data-motion="to-end"]': {
    animation: `${exitToRight} 250ms ease`,
  },
});

/* -----------------------------------------------------------------------------------------------*/

const submenusRootClass = css({
  display: 'grid',
  width: '100%',
  maxWidth: 800,
  gap: 20,

  "&[data-orientation='vertical']": {
    gridTemplateColumns: '0.3fr 1fr',
  },

  "&[data-orientation='horizontal']": {
    justifyItems: 'center',
    marginTop: -10,
  },
});

const submenusViewportClass = css({
  position: 'absolute',
  left: 0,
  top: '100%',
  borderTop: '1px solid #dcdfe3',
  transformOrigin: 'top center',
  width: '100vw',
  backgroundColor: 'white',
  height: 'var(--radix-navigation-menu-viewport-height)',
  transition: 'height 300ms ease',
  overflow: 'hidden',
  boxShadow: '0 50px 100px -20px rgba(50,50,93,0.1),0 30px 60px -30px rgba(0,0,0,0.2)',

  '&[data-state="open"]': {
    animation: `${fadeIn} 250ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 250ms ease`,
  },
});

const submenusContentClass = css({
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',

  paddingTop: 35,
  paddingBottom: 35,

  '&[data-motion="from-start"]': {
    animation: `${enterFromLeft} 250ms ease`,
  },
  '&[data-motion="from-end"]': {
    animation: `${enterFromRight} 250ms ease`,
  },
  '&[data-motion="to-start"]': {
    animation: `${exitToLeft} 250ms ease`,
  },
  '&[data-motion="to-end"]': {
    animation: `${exitToRight} 250ms ease`,
  },
});

const submenusSubContentClass = css({
  display: 'grid',
  gridGap: 20,
  width: '100%',
});

const submenusSubViewportClass = css({
  width: '100%',
});

const submenusSubTriggerClass = css({
  ...itemStyles,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  border: 0,
  background: 'transparent',
  fontSize: 'inherit',
  width: '100%',
  borderRadius: 4,

  '&[data-state="open"]': {
    backgroundColor: '#f3f4f5',
  },
});

const submenusSubIndicatorClass = css({
  backgroundColor: 'black',
  borderRadius: 4,

  '&[data-orientation="vertical"]': {
    width: 3,
    transition: 'transform, height 250ms ease',

    "[dir='ltr'] &": {
      right: 0,
    },
    "[dir='rtl'] &": {
      left: 0,
    },
  },

  '&[data-orientation="horizontal"]': {
    height: 3,
    bottom: 0,
    transition: 'transform, width 250ms ease',
  },
});
