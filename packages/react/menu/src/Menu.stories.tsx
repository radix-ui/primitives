import * as React from 'react';
import {
  Menu,
  MenuSub,
  MenuAnchor,
  MenuSubTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
} from './Menu';
import { css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';

export default {
  title: 'Components/Menu',
  excludeStories: ['TickIcon', 'styledComponents', 'classes'],
};

export const Styled = () => (
  <MenuWithAnchor>
    <MenuItem className={itemClass} onSelect={() => window.alert('undo')}>
      Undo
    </MenuItem>
    <MenuItem className={itemClass} onSelect={() => window.alert('redo')}>
      Redo
    </MenuItem>
    <MenuSeparator className={separatorClass} />
    <MenuItem className={itemClass} disabled onSelect={() => window.alert('cut')}>
      Cut
    </MenuItem>
    <MenuItem className={itemClass} onSelect={() => window.alert('copy')}>
      Copy
    </MenuItem>
    <MenuItem className={itemClass} onSelect={() => window.alert('paste')}>
      Paste
    </MenuItem>
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
    <>
      <div style={{ marginBottom: 8, display: 'grid', gridAutoFlow: 'row', gridGap: 4 }}>
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
        <MenuItem className={itemClass} onSelect={() => window.alert('undo')}>
          Undo
        </MenuItem>
        <Submenu open={open1} onOpenChange={setOpen1} animated={animated}>
          <MenuItem className={itemClass} disabled>
            Disabled
          </MenuItem>
          <MenuItem className={itemClass} onSelect={() => window.alert('one')}>
            One
          </MenuItem>
          <Submenu open={open2} onOpenChange={setOpen2} animated={animated}>
            <MenuItem className={itemClass} onSelect={() => window.alert('one')}>
              One
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('two')}>
              Two
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('three')}>
              Three
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('four')}>
              Four
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('five')}>
              Five
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('six')}>
              Six
            </MenuItem>
          </Submenu>
          <Submenu heading="Sub Menu" open={open3} onOpenChange={setOpen3} animated={animated}>
            <MenuItem className={itemClass} onSelect={() => window.alert('one')}>
              One
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('two')}>
              Two
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('three')}>
              Three
            </MenuItem>
          </Submenu>
          <MenuItem className={itemClass} onSelect={() => window.alert('two')}>
            Two
          </MenuItem>
          <Submenu open={open4} onOpenChange={setOpen4} animated={animated} disabled>
            <MenuItem className={itemClass} onSelect={() => window.alert('one')}>
              One
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('two')}>
              Two
            </MenuItem>
            <MenuItem className={itemClass} onSelect={() => window.alert('three')}>
              Three
            </MenuItem>
          </Submenu>
          <MenuItem className={itemClass} onSelect={() => window.alert('three')}>
            Three
          </MenuItem>
        </Submenu>

        <MenuSeparator className={separatorClass} />
        <MenuItem className={itemClass} disabled onSelect={() => window.alert('cut')}>
          Cut
        </MenuItem>
        <MenuItem className={itemClass} onSelect={() => window.alert('copy')}>
          Copy
        </MenuItem>
        <MenuItem className={itemClass} onSelect={() => window.alert('paste')}>
          Paste
        </MenuItem>
      </MenuWithAnchor>
    </>
  );
};

export const WithLabels = () => (
  <MenuWithAnchor>
    {foodGroups.map((foodGroup, index) => (
      <MenuGroup key={index}>
        {foodGroup.label && (
          <MenuLabel className={labelClass} key={foodGroup.label}>
            {foodGroup.label}
          </MenuLabel>
        )}
        {foodGroup.foods.map((food) => (
          <MenuItem
            key={food.value}
            className={itemClass}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </MenuItem>
        ))}
        {index < foodGroups.length - 1 && <MenuSeparator className={separatorClass} />}
      </MenuGroup>
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
            <MenuItem key={suit.emoji} className={itemClass}>
              {suit.label}
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
            </MenuItem>
          ))}
        </MenuWithAnchor>
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(with explicit `textValue` prop)</p>
        <MenuWithAnchor>
          {suits.map((suit) => (
            <MenuItem key={suit.emoji} className={itemClass} textValue={suit.label}>
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
              {suit.label}
            </MenuItem>
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
      <MenuItem className={itemClass} onSelect={() => window.alert('show')}>
        Show fonts
      </MenuItem>
      <MenuItem className={itemClass} onSelect={() => window.alert('bigger')}>
        Bigger
      </MenuItem>
      <MenuItem className={itemClass} onSelect={() => window.alert('smaller')}>
        Smaller
      </MenuItem>
      <MenuSeparator className={separatorClass} />
      {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
        <MenuCheckboxItem
          key={label}
          className={itemClass}
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
        >
          {label}
          <MenuItemIndicator>
            <TickIcon />
          </MenuItemIndicator>
        </MenuCheckboxItem>
      ))}
    </MenuWithAnchor>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <MenuWithAnchor>
      <MenuItem className={itemClass} onSelect={() => window.alert('minimize')}>
        Minimize window
      </MenuItem>
      <MenuItem className={itemClass} onSelect={() => window.alert('zoom')}>
        Zoom
      </MenuItem>
      <MenuItem className={itemClass} onSelect={() => window.alert('smaller')}>
        Smaller
      </MenuItem>
      <MenuSeparator className={separatorClass} />
      <MenuRadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <MenuRadioItem key={file} className={itemClass} value={file}>
            {file}
            <MenuItemIndicator>
              <TickIcon />
            </MenuItemIndicator>
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
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
      <MenuWithAnchor className={animatedContentClass} open={open}>
        {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
          <MenuCheckboxItem
            key={label}
            className={itemClass}
            checked={checked}
            onCheckedChange={setChecked}
            disabled={disabled}
          >
            {label}
            <MenuItemIndicator className={animatedItemIndicatorClass}>
              <TickIcon />
            </MenuItemIndicator>
          </MenuCheckboxItem>
        ))}
        <MenuRadioGroup value={file} onValueChange={setFile}>
          {files.map((file) => (
            <MenuRadioItem key={file} className={itemClass} value={file}>
              {file}
              <MenuItemIndicator className={animatedItemIndicatorClass}>
                <TickIcon />
              </MenuItemIndicator>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuWithAnchor>
    </>
  );
};

type MenuOwnProps = Omit<
  React.ComponentProps<typeof Menu> & React.ComponentProps<typeof MenuContent>,
  | 'portalled'
  | 'trapFocus'
  | 'onCloseAutoFocus'
  | 'disableOutsidePointerEvents'
  | 'disableOutsideScroll'
>;

const MenuWithAnchor: React.FC<MenuOwnProps> = (props) => {
  const { open = true, children, ...contentProps } = props;
  return (
    <Menu open={open} onOpenChange={() => {}}>
      {/* inline-block allows anchor to move when rtl changes on document */}
      <MenuAnchor style={{ display: 'inline-block' }} />
      <MenuContent
        className={contentClass}
        portalled
        trapFocus={false}
        onCloseAutoFocus={(event) => event.preventDefault()}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        align="start"
        {...contentProps}
      >
        {children}
      </MenuContent>
    </Menu>
  );
};

const Submenu: React.FC<
  MenuOwnProps & { animated: boolean; disabled?: boolean; heading?: string }
> = (props) => {
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
    <MenuSub open={open} onOpenChange={onOpenChange}>
      <MenuSubTrigger className={subTriggerClass} disabled={disabled}>
        {heading} →
      </MenuSubTrigger>
      <MenuContent className={animated ? animatedContentClass : contentClass} {...contentProps}>
        {children}
      </MenuContent>
    </MenuSub>
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

  '&:focus': {
    outline: 'none',
    backgroundColor: '$black',
    color: 'white',
  },

  '&[data-disabled]': {
    color: '$gray100',
  },
});

const subTriggerClass = css(itemClass, {
  '&[data-state="open"]': {
    backgroundColor: '$gray100',
    color: '$black',
  },
});

const separatorClass = css({
  height: 1,
  margin: '5px 10px',
  backgroundColor: '$gray100',
});

const animateIn = css.keyframes({
  from: { transform: 'scale(0.95)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const animateOut = css.keyframes({
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
