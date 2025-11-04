'use client';
import * as React from 'react';
import { Direction } from 'radix-ui';
import { Menu } from 'radix-ui/internal';
import { foodGroups } from '@repo/test-data/foods';

export function Basic() {
  const [animated, setAnimated] = React.useState(false);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={animated}
          onChange={(event) => setAnimated(event.currentTarget.checked)}
        />
        Animated
      </label>
      <hr />
      <MenuWithAnchor animated={animated}>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('undo')}>
          Undo
        </Menu.Item>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('redo')}>
          Redo
        </Menu.Item>
        <Menu.Separator className="MenuSeparator" />
        <Menu.Item className="MenuItem" disabled onSelect={() => window.alert('cut')}>
          Cut
        </Menu.Item>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('copy')}>
          Copy
        </Menu.Item>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('paste')}>
          Paste
        </Menu.Item>
      </MenuWithAnchor>
    </div>
  );
}

export function Submenus() {
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
    <Direction.Provider dir={rtl ? 'rtl' : 'ltr'}>
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
        <Menu.Item className="MenuItem" onSelect={() => window.alert('undo')}>
          Undo
        </Menu.Item>
        <Submenu open={open1} onOpenChange={setOpen1} animated={animated}>
          <Menu.Item className="MenuItem" disabled>
            Disabled
          </Menu.Item>
          <Menu.Item className="MenuItem" onSelect={() => window.alert('one')}>
            One
          </Menu.Item>
          <Submenu open={open2} onOpenChange={setOpen2} animated={animated}>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('four')}>
              Four
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('five')}>
              Five
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('six')}>
              Six
            </Menu.Item>
          </Submenu>
          <Submenu heading="Sub Menu" open={open3} onOpenChange={setOpen3} animated={animated}>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item onSelect={() => window.alert('two')}>Two</Menu.Item>
          <Submenu open={open4} onOpenChange={setOpen4} animated={animated} disabled>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className="MenuItem" onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className="MenuItem" onSelect={() => window.alert('three')}>
            Three
          </Menu.Item>
        </Submenu>

        <Menu.Separator className="MenuSeparator" />
        <Menu.Item className="MenuItem" disabled onSelect={() => window.alert('cut')}>
          Cut
        </Menu.Item>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('copy')}>
          Copy
        </Menu.Item>
        <Menu.Item className="MenuItem" onSelect={() => window.alert('paste')}>
          Paste
        </Menu.Item>
      </MenuWithAnchor>
    </Direction.Provider>
  );
}

export function WithLabels() {
  return (
    <MenuWithAnchor>
      {foodGroups.map((foodGroup, index) => (
        <Menu.Group className="MenuGroup" key={index}>
          {foodGroup.label && (
            <Menu.Label className="MenuLabel" key={foodGroup.label}>
              {foodGroup.label}
            </Menu.Label>
          )}
          {foodGroup.foods.map((food) => (
            <Menu.Item
              key={food.value}
              disabled={food.disabled}
              onSelect={() => window.alert(food.label)}
              className="MenuItem"
            >
              {food.label}
            </Menu.Item>
          ))}
          {index < foodGroups.length - 1 && <Menu.Separator className="MenuSeparator" />}
        </Menu.Group>
      ))}
    </MenuWithAnchor>
  );
}

const suits = [
  { emoji: '♥️', label: 'Hearts' },
  { emoji: '♠️', label: 'Spades' },
  { emoji: '♦️', label: 'Diamonds' },
  { emoji: '♣️', label: 'Clubs' },
];

export function Typeahead() {
  return (
    <>
      <h1>Testing ground for typeahead behavior</h1>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 100 }}>
        <div>
          <h2>Text labels</h2>
          <div style={{ marginBottom: 20 }}>
            <p>For comparison try the closed select below</p>
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
              <Menu.Item className="MenuItem" key={suit.emoji}>
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
              <Menu.Item className="MenuItem" key={suit.emoji} textValue={suit.label}>
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
}

export function CheckboxItems() {
  const options = ['Crows', 'Ravens', 'Magpies', 'Jackdaws'];

  const [selection, setSelection] = React.useState<string[]>([]);

  const handleSelectAll = () => {
    setSelection((currentSelection) => (currentSelection.length === options.length ? [] : options));
  };

  return (
    <MenuWithAnchor>
      <Menu.CheckboxItem
        className="MenuItem"
        checked={
          selection.length === options.length ? true : selection.length ? 'indeterminate' : false
        }
        onCheckedChange={handleSelectAll}
      >
        Select all
        <Menu.ItemIndicator className="MenuItemIndicator">
          {selection.length === options.length ? <TickIcon /> : '—'}
        </Menu.ItemIndicator>
      </Menu.CheckboxItem>
      <Menu.Separator className="MenuSeparator" />
      {options.map((option) => (
        <Menu.CheckboxItem
          key={option}
          className="MenuItem"
          checked={selection.includes(option)}
          onCheckedChange={() =>
            setSelection((current) =>
              current.includes(option)
                ? current.filter((el) => el !== option)
                : current.concat(option),
            )
          }
        >
          {option}
          <Menu.ItemIndicator className="MenuItemIndicator">
            <TickIcon />
          </Menu.ItemIndicator>
        </Menu.CheckboxItem>
      ))}
    </MenuWithAnchor>
  );
}

export function RadioItems() {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <MenuWithAnchor>
      <Menu.Item className="MenuItem" onSelect={() => window.alert('minimize')}>
        Minimize window
      </Menu.Item>
      <Menu.Item className="MenuItem" onSelect={() => window.alert('zoom')}>
        Zoom
      </Menu.Item>
      <Menu.Item className="MenuItem" onSelect={() => window.alert('smaller')}>
        Smaller
      </Menu.Item>
      <Menu.Separator className="MenuSeparator" />
      <Menu.RadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <Menu.RadioItem className="MenuItem" key={file} value={file}>
            {file}
            <Menu.ItemIndicator className="MenuItemIndicator">
              <TickIcon />
            </Menu.ItemIndicator>
          </Menu.RadioItem>
        ))}
      </Menu.RadioGroup>
    </MenuWithAnchor>
  );
}

type MenuProps = Omit<
  React.ComponentProps<typeof Menu.Root> &
    React.ComponentProps<typeof Menu.Content> & { animated?: boolean },
  'trapFocus' | 'onCloseAutoFocus' | 'disableOutsidePointerEvents' | 'disableOutsideScroll'
>;

function MenuWithAnchor(props: MenuProps) {
  const { open = true, children, animated, ...contentProps } = props;
  return (
    <Menu.Root open={open} onOpenChange={() => {}} modal={false}>
      {/* inline-block allows anchor to move when rtl changes on document */}
      <Menu.Anchor className="MenuAnchor" style={{ display: 'inline-block' }} />
      <Menu.Portal>
        <Menu.Content
          onCloseAutoFocus={(event) => event.preventDefault()}
          align="start"
          data-animated={animated || undefined}
          {...contentProps}
          className={['MenuContent', contentProps.className].filter(Boolean).join(' ')}
        >
          {children}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function Submenu(props: MenuProps & { animated: boolean; disabled?: boolean; heading?: string }) {
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
      <Menu.SubTrigger className="MenuItem MenuSubTrigger" disabled={disabled}>
        {heading} →
      </Menu.SubTrigger>
      <Menu.Portal>
        <Menu.SubContent
          data-animated={animated || undefined}
          {...contentProps}
          className={['MenuContent MenuSubContent', contentProps.className]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </Menu.SubContent>
      </Menu.Portal>
    </Menu.Sub>
  );
}

function TickIcon() {
  return (
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
}
