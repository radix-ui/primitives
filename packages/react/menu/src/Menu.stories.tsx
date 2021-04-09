import * as React from 'react';
import {
  Menu as MenuPrimitive,
  MenuAnchor,
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
  <Menu>
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
  </Menu>
);

export const WithLabels = () => (
  <Menu>
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
  </Menu>
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
        <Menu>
          {suits.map((suit) => (
            <MenuItem key={suit.emoji} className={itemClass}>
              {suit.label}
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(with explicit `textValue` prop)</p>
        <Menu>
          {suits.map((suit) => (
            <MenuItem key={suit.emoji} className={itemClass} textValue={suit.label}>
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
              {suit.label}
            </MenuItem>
          ))}
        </Menu>
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
    <Menu>
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
    </Menu>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <Menu>
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
    </Menu>
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
      <Menu className={animatedRootClass} open={open}>
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
      </Menu>
    </>
  );
};

type MenuOwnProps = Omit<
  React.ComponentProps<typeof MenuPrimitive> & React.ComponentProps<typeof MenuContent>,
  | 'onOpenChange'
  | 'portalled'
  | 'trapFocus'
  | 'onOpenAutoFocus'
  | 'onCloseAutoFocus'
  | 'disableOutsidePointerEvents'
  | 'disableOutsideScroll'
>;

const Menu: React.FC<MenuOwnProps> = (props) => {
  const { open = true, children, ...contentProps } = props;
  return (
    <MenuPrimitive open={open} onOpenChange={() => {}}>
      <MenuAnchor />
      <MenuContent
        className={contentClass}
        portalled
        trapFocus={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        align="start"
        {...contentProps}
      >
        {children}
      </MenuContent>
    </MenuPrimitive>
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

const separatorClass = css({
  height: 1,
  margin: '5px 10px',
  backgroundColor: '$gray100',
});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const animatedRootClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const animatedItemIndicatorClass = css({
  '&[data-state="checked"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="unchecked"]': {
    animation: `${fadeOut} 300ms ease-in`,
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
};
