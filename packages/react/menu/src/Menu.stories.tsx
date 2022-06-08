import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as Menu from '@radix-ui/react-menu';
import { foodGroups } from '../../../../test-data/foods';
import { DirectionProvider } from '@radix-ui/react-direction';

export default {
  title: 'Components/Menu',
  excludeStories: ['TickIcon', 'classes'],
};

export const Styled = () => (
  <MenuWithAnchor>
    <Menu.Item className={itemClass()} onSelect={() => window.alert('undo')}>
      Undo
    </Menu.Item>
    <Menu.Item className={itemClass()} onSelect={() => window.alert('redo')}>
      Redo
    </Menu.Item>
    <Menu.Separator className={separatorClass()} />
    <Menu.Item className={itemClass()} disabled onSelect={() => window.alert('cut')}>
      Cut
    </Menu.Item>
    <Menu.Item className={itemClass()} onSelect={() => window.alert('copy')}>
      Copy
    </Menu.Item>
    <Menu.Item className={itemClass()} onSelect={() => window.alert('paste')}>
      Paste
    </Menu.Item>
  </MenuWithAnchor>
);

export const Submenus = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    if (rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      return () => document.documentElement.removeAttribute('dir');
    }
  }, [rtl]);

  return (
    <DirectionProvider dir={rtl ? 'rtl' : 'ltr'}>
      <div style={{ marginBottom: 8, display: 'grid', gridAutoFlow: 'row', gap: 4 }}>
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
        <label>
          <input
            type="checkbox"
            checked={animated}
            onChange={(event) => setAnimated(event.currentTarget.checked)}
          />
          Animated
        </label>
      </div>
      <MenuWithAnchor>
        <Menu.Item className={itemClass()} onSelect={() => window.alert('undo')}>
          Undo
        </Menu.Item>
        <Submenu open={open1} onOpenChange={setOpen1} animated={animated}>
          <Menu.Item className={itemClass()} disabled>
            Disabled
          </Menu.Item>
          <Menu.Item className={itemClass()} onSelect={() => window.alert('one')}>
            One
          </Menu.Item>
          <Submenu open={open2} onOpenChange={setOpen2} animated={animated}>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('four')}>
              Four
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('five')}>
              Five
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('six')}>
              Six
            </Menu.Item>
          </Submenu>
          <Submenu heading="Sub Menu" open={open3} onOpenChange={setOpen3} animated={animated}>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={itemClass()} onSelect={() => window.alert('two')}>
            Two
          </Menu.Item>
          <Submenu open={open4} onOpenChange={setOpen4} animated={animated} disabled>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={itemClass()} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={itemClass()} onSelect={() => window.alert('three')}>
            Three
          </Menu.Item>
        </Submenu>

        <Menu.Separator className={separatorClass()} />
        <Menu.Item className={itemClass()} disabled onSelect={() => window.alert('cut')}>
          Cut
        </Menu.Item>
        <Menu.Item className={itemClass()} onSelect={() => window.alert('copy')}>
          Copy
        </Menu.Item>
        <Menu.Item className={itemClass()} onSelect={() => window.alert('paste')}>
          Paste
        </Menu.Item>
      </MenuWithAnchor>
    </DirectionProvider>
  );
};

export const WithLabels = () => (
  <MenuWithAnchor>
    {foodGroups.map((foodGroup, index) => (
      <Menu.Group key={index}>
        {foodGroup.label && (
          <Menu.Label className={labelClass()} key={foodGroup.label}>
            {foodGroup.label}
          </Menu.Label>
        )}
        {foodGroup.foods.map((food) => (
          <Menu.Item
            key={food.value}
            className={itemClass()}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </Menu.Item>
        ))}
        {index < foodGroups.length - 1 && <Menu.Separator className={separatorClass()} />}
      </Menu.Group>
    ))}
  </MenuWithAnchor>
);

const suits = [
  { emoji: '♥️', label: 'Hearts' },
  { emoji: '♠️', label: 'Spades' },
  { emoji: '♦️', label: 'Diamonds' },
  { emoji: '♣️', label: 'Clubs' },
];

export const Typeahead = () => (
  <>
    <h1>Testing ground for typeahead behaviour</h1>

    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 100 }}>
      <div>
        <h2>Text labels</h2>
        <div style={{ marginBottom: 20 }}>
          <p>
            For comparison
            <br />
            try the closed select below
          </p>
          <select>
            {foodGroups.map((foodGroup, index) => (
              <React.Fragment key={index}>
                {foodGroup.foods.map((food) => (
                  <option key={food.value} value={food.value} disabled={food.disabled}>
                    {food.label}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </select>
        </div>
        <WithLabels />
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(relying on `.textContent` — default)</p>
        <MenuWithAnchor>
          {suits.map((suit) => (
            <Menu.Item key={suit.emoji} className={itemClass()}>
              {suit.label}
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
            </Menu.Item>
          ))}
        </MenuWithAnchor>
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(with explicit `textValue` prop)</p>
        <MenuWithAnchor>
          {suits.map((suit) => (
            <Menu.Item key={suit.emoji} className={itemClass()} textValue={suit.label}>
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
              {suit.label}
            </Menu.Item>
          ))}
        </MenuWithAnchor>
      </div>
    </div>
  </>
);

export const CheckboxItems = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];

  return (
    <MenuWithAnchor>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('show')}>
        Show fonts
      </Menu.Item>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('bigger')}>
        Bigger
      </Menu.Item>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('smaller')}>
        Smaller
      </Menu.Item>
      <Menu.Separator className={separatorClass()} />
      {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
        <Menu.CheckboxItem
          key={label}
          className={itemClass()}
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
        >
          {label}
          <Menu.ItemIndicator>
            <TickIcon />
          </Menu.ItemIndicator>
        </Menu.CheckboxItem>
      ))}
    </MenuWithAnchor>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <MenuWithAnchor>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('minimize')}>
        Minimize window
      </Menu.Item>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('zoom')}>
        Zoom
      </Menu.Item>
      <Menu.Item className={itemClass()} onSelect={() => window.alert('smaller')}>
        Smaller
      </Menu.Item>
      <Menu.Separator className={separatorClass()} />
      <Menu.RadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <Menu.RadioItem key={file} className={itemClass()} value={file}>
            {file}
            <Menu.ItemIndicator>
              <TickIcon />
            </Menu.ItemIndicator>
          </Menu.RadioItem>
        ))}
      </Menu.RadioGroup>
    </MenuWithAnchor>
  );
};

export const Animated = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);
  const [open, setOpen] = React.useState(true);
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];

  return (
    <>
      <label>
        <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />{' '}
        open
      </label>
      <br />
      <br />
      <MenuWithAnchor className={animatedContentClass()} open={open}>
        {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
          <Menu.CheckboxItem
            key={label}
            className={itemClass()}
            checked={checked}
            onCheckedChange={setChecked}
            disabled={disabled}
          >
            {label}
            <Menu.ItemIndicator className={animatedItemIndicatorClass()}>
              <TickIcon />
            </Menu.ItemIndicator>
          </Menu.CheckboxItem>
        ))}
        <Menu.RadioGroup value={file} onValueChange={setFile}>
          {files.map((file) => (
            <Menu.RadioItem key={file} className={itemClass()} value={file}>
              {file}
              <Menu.ItemIndicator className={animatedItemIndicatorClass()}>
                <TickIcon />
              </Menu.ItemIndicator>
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </MenuWithAnchor>
    </>
  );
};

type MenuProps = Omit<
  React.ComponentProps<typeof Menu.Root> & React.ComponentProps<typeof Menu.Content>,
  'trapFocus' | 'onCloseAutoFocus' | 'disableOutsidePointerEvents' | 'disableOutsideScroll'
>;

const MenuWithAnchor: React.FC<MenuProps> = (props) => {
  const { open = true, children, ...contentProps } = props;
  return (
    <Menu.Root open={open} onOpenChange={() => {}} modal={false}>
      {/* inline-block allows anchor to move when rtl changes on document */}
      <Menu.Anchor style={{ display: 'inline-block' }} />
      <Menu.Portal>
        <Menu.Content
          className={contentClass()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          align="start"
          {...contentProps}
        >
          {children}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
};

const Submenu: React.FC<MenuProps & { animated: boolean; disabled?: boolean; heading?: string }> = (
  props
) => {
  const {
    heading = 'Submenu',
    open = true,
    onOpenChange,
    children,
    animated,
    disabled,
    ...contentProps
  } = props;
  return (
    <Menu.Sub open={open} onOpenChange={onOpenChange}>
      <Menu.SubTrigger className={subTriggerClass()} disabled={disabled}>
        {heading} →
      </Menu.SubTrigger>
      <Menu.Portal>
        <Menu.SubContent
          className={animated ? animatedContentClass() : contentClass()}
          {...contentProps}
        >
          {children}
        </Menu.SubContent>
      </Menu.Portal>
    </Menu.Sub>
  );
};

const contentClass = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  minWidth: 130,
  backgroundColor: '$white',
  border: '1px solid $gray100',
  borderRadius: 6,
  padding: 5,
  boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.1)',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
  '&:focus-within': {
    borderColor: '$black',
  },
});

const itemStyles: any = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: '1',
  cursor: 'default',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  height: 25,
  padding: '0 10px',
  color: '$black',
  borderRadius: 3,
};

const labelClass = css({
  ...itemStyles,
  color: '$gray100',
});

const itemClass = css({
  ...itemStyles,
  outline: 'none',

  '&[data-highlighted]': {
    backgroundColor: '$black',
    color: 'white',
  },

  '&[data-disabled]': {
    color: '$gray100',
  },
});

const subTriggerClass = css(itemClass, {
  '&:not([data-highlighted])[data-state="open"]': {
    backgroundColor: '$gray100',
    color: '$black',
  },
});

const separatorClass = css({
  height: 1,
  margin: '5px 10px',
  backgroundColor: '$gray100',
});

const animateIn = keyframes({
  from: { transform: 'scale(0.95)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const animateOut = keyframes({
  from: { transform: 'scale(1)', opacity: 1 },
  to: { transform: 'scale(0.95)', opacity: 0 },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${animateIn} 300ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${animateOut} 300ms ease`,
  },
});

const animatedItemIndicatorClass = css({
  '&[data-state="checked"]': {
    animation: `${animateIn} 300ms ease`,
  },
  '&[data-state="unchecked"]': {
    animation: `${animateOut} 300ms ease`,
  },
});

export const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M2 20 L12 28 30 4" />
  </svg>
);

export const classes = {
  contentClass,
  labelClass,
  itemClass,
  separatorClass,
  subTriggerClass,
};
