import * as React from 'react';
import {
  Menu as MenuPrimitive,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuItemIndicator,
  MenuSeparator,
} from './Menu';
import { styled, css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';

export default { title: 'Components/Menu', excludeStories: ['styledComponents'] };

export const Styled = () => (
  <Menu>
    <MenuItem as={StyledItem} onSelect={() => window.alert('undo')}>
      Undo
    </MenuItem>
    <MenuItem as={StyledItem} onSelect={() => window.alert('redo')}>
      Redo
    </MenuItem>
    <MenuSeparator as={StyledSeparator} />
    <MenuItem as={StyledItem} disabled onSelect={() => window.alert('cut')}>
      Cut
    </MenuItem>
    <MenuItem as={StyledItem} onSelect={() => window.alert('copy')}>
      Copy
    </MenuItem>
    <MenuItem as={StyledItem} onSelect={() => window.alert('paste')}>
      Paste
    </MenuItem>
  </Menu>
);

export const WithLabels = () => (
  <Menu>
    {foodGroups.map((foodGroup, index) => (
      <MenuGroup key={index}>
        {foodGroup.label && (
          <MenuLabel as={StyledLabel} key={foodGroup.label}>
            {foodGroup.label}
          </MenuLabel>
        )}
        {foodGroup.foods.map((food) => (
          <MenuItem
            key={food.value}
            as={StyledItem}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </MenuItem>
        ))}
        {index < foodGroups.length - 1 && <MenuSeparator as={StyledSeparator} />}
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
            <MenuItem key={suit.emoji} as={StyledItem}>
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
            <MenuItem key={suit.emoji} as={StyledItem} textValue={suit.label}>
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
      <MenuItem as={StyledItem} onSelect={() => window.alert('show')}>
        Show fonts
      </MenuItem>
      <MenuItem as={StyledItem} onSelect={() => window.alert('bigger')}>
        Bigger
      </MenuItem>
      <MenuItem as={StyledItem} onSelect={() => window.alert('smaller')}>
        Smaller
      </MenuItem>
      <MenuSeparator as={StyledSeparator} />
      {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
        <MenuCheckboxItem
          key={label}
          as={StyledItem}
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
      <MenuItem as={StyledItem} onSelect={() => window.alert('minimize')}>
        Minimize window
      </MenuItem>
      <MenuItem as={StyledItem} onSelect={() => window.alert('zoom')}>
        Zoom
      </MenuItem>
      <MenuItem as={StyledItem} onSelect={() => window.alert('smaller')}>
        Smaller
      </MenuItem>
      <MenuSeparator as={StyledSeparator} />
      <MenuRadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <MenuRadioItem key={file} as={StyledItem} value={file}>
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
        isOpen
      </label>
      <br />
      <br />
      <AnimatedMenu isOpen={open}>
        {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
          <MenuCheckboxItem
            key={label}
            as={StyledItem}
            checked={checked}
            onCheckedChange={setChecked}
            disabled={disabled}
          >
            {label}
            <AnimatedMenuItemIndicator>
              <TickIcon />
            </AnimatedMenuItemIndicator>
          </MenuCheckboxItem>
        ))}
        <MenuRadioGroup value={file} onValueChange={setFile}>
          {files.map((file) => (
            <MenuRadioItem key={file} as={StyledItem} value={file}>
              {file}
              <AnimatedMenuItemIndicator>
                <TickIcon />
              </AnimatedMenuItemIndicator>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </AnimatedMenu>
    </>
  );
};

type MenuOwnProps = {
  onIsOpenChange: never;
  anchorRef: never;
  shouldPortal: never;
  trapFocus: never;
  onOpenAutoFocus: never;
  onCloseAutoFocus: never;
  disableOutsidePointerEvents: never;
  disableOutsideScroll: never;
};

const Menu = forwardRefWithAs<typeof MenuPrimitive, MenuOwnProps>((props, forwardedRef) => {
  const { isOpen = true } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} />
      <MenuPrimitive
        {...props}
        as={StyledRoot}
        ref={forwardedRef}
        isOpen={isOpen}
        onIsOpenChange={() => {}}
        anchorRef={ref}
        shouldPortal={true}
        trapFocus={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        align="start"
      />
    </>
  );
});

const StyledRoot = styled('div', {
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

const itemCss: any = {
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

const StyledLabel = styled('div', {
  ...itemCss,
  color: '$gray100',
});

const StyledItem = styled('div', {
  ...itemCss,

  '&:focus': {
    outline: 'none',
    backgroundColor: '$black',
    color: 'white',
  },

  '&[data-disabled]': {
    color: '$gray100',
  },
});

const StyledSeparator = styled('div', {
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

const AnimatedMenu = styled(Menu, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const AnimatedMenuItemIndicator = styled(MenuItemIndicator, {
  '&[data-state="checked"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="unchecked"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const TickIcon = () => (
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

export const styledComponents = {
  StyledRoot,
  StyledLabel,
  StyledItem,
  StyledSeparator,
  TickIcon,
};
