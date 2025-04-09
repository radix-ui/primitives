import * as React from 'react';
import { Direction } from 'radix-ui';
import { Menu } from 'radix-ui/internal';
import { foodGroups } from '@repo/test-data/foods';
import styles from './menu.stories.module.css';

export default {
  title: 'Utilities/Menu',
  excludeStories: ['TickIcon', 'classes'],
};

export const Styled = () => (
  <MenuWithAnchor>
    <Menu.Item className={styles.item} onSelect={() => window.alert('undo')}>
      Undo
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert('redo')}>
      Redo
    </Menu.Item>
    <Menu.Separator className={styles.separator} />
    <Menu.Item className={styles.item} disabled onSelect={() => window.alert('cut')}>
      Cut
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert('copy')}>
      Copy
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert('paste')}>
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
        <Menu.Item className={styles.item} onSelect={() => window.alert('undo')}>
          Undo
        </Menu.Item>
        <Submenu open={open1} onOpenChange={setOpen1} animated={animated}>
          <Menu.Item className={styles.item} disabled>
            Disabled
          </Menu.Item>
          <Menu.Item className={styles.item} onSelect={() => window.alert('one')}>
            One
          </Menu.Item>
          <Submenu open={open2} onOpenChange={setOpen2} animated={animated}>
            <Menu.Item className={styles.item} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('four')}>
              Four
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('five')}>
              Five
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('six')}>
              Six
            </Menu.Item>
          </Submenu>
          <Submenu heading="Sub Menu" open={open3} onOpenChange={setOpen3} animated={animated}>
            <Menu.Item className={styles.item} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={styles.item} onSelect={() => window.alert('two')}>
            Two
          </Menu.Item>
          <Submenu open={open4} onOpenChange={setOpen4} animated={animated} disabled>
            <Menu.Item className={styles.item} onSelect={() => window.alert('one')}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('two')}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert('three')}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={styles.item} onSelect={() => window.alert('three')}>
            Three
          </Menu.Item>
        </Submenu>

        <Menu.Separator className={styles.separator} />
        <Menu.Item className={styles.item} disabled onSelect={() => window.alert('cut')}>
          Cut
        </Menu.Item>
        <Menu.Item className={styles.item} onSelect={() => window.alert('copy')}>
          Copy
        </Menu.Item>
        <Menu.Item className={styles.item} onSelect={() => window.alert('paste')}>
          Paste
        </Menu.Item>
      </MenuWithAnchor>
    </Direction.Provider>
  );
};

export const WithLabels = () => (
  <MenuWithAnchor>
    {foodGroups.map((foodGroup, index) => (
      <Menu.Group key={index}>
        {foodGroup.label && (
          <Menu.Label className={styles.label} key={foodGroup.label}>
            {foodGroup.label}
          </Menu.Label>
        )}
        {foodGroup.foods.map((food) => (
          <Menu.Item
            key={food.value}
            className={styles.item}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </Menu.Item>
        ))}
        {index < foodGroups.length - 1 && <Menu.Separator className={styles.separator} />}
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
            <Menu.Item key={suit.emoji} className={styles.item}>
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
            <Menu.Item key={suit.emoji} className={styles.item} textValue={suit.label}>
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
  const options = ['Crows', 'Ravens', 'Magpies', 'Jackdaws'];

  const [selection, setSelection] = React.useState<string[]>([]);

  const handleSelectAll = () => {
    setSelection((currentSelection) => (currentSelection.length === options.length ? [] : options));
  };

  return (
    <MenuWithAnchor>
      <Menu.CheckboxItem
        className={styles.item}
        checked={
          selection.length === options.length ? true : selection.length ? 'indeterminate' : false
        }
        onCheckedChange={handleSelectAll}
      >
        Select all
        <Menu.ItemIndicator>
          {selection.length === options.length ? <TickIcon /> : '—'}
        </Menu.ItemIndicator>
      </Menu.CheckboxItem>
      <Menu.Separator className={styles.separator} />
      {options.map((option) => (
        <Menu.CheckboxItem
          key={option}
          className={styles.item}
          checked={selection.includes(option)}
          onCheckedChange={() =>
            setSelection((current) =>
              current.includes(option)
                ? current.filter((el) => el !== option)
                : current.concat(option)
            )
          }
        >
          {option}
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
      <Menu.Item className={styles.item} onSelect={() => window.alert('minimize')}>
        Minimize window
      </Menu.Item>
      <Menu.Item className={styles.item} onSelect={() => window.alert('zoom')}>
        Zoom
      </Menu.Item>
      <Menu.Item className={styles.item} onSelect={() => window.alert('smaller')}>
        Smaller
      </Menu.Item>
      <Menu.Separator className={styles.separator} />
      <Menu.RadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <Menu.RadioItem key={file} className={styles.item} value={file}>
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
      <MenuWithAnchor className={styles.animatedContent} open={open}>
        {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
          <Menu.CheckboxItem
            key={label}
            className={styles.item}
            checked={checked}
            onCheckedChange={setChecked}
            disabled={disabled}
          >
            {label}
            <Menu.ItemIndicator className={styles.animatedItemIndicator}>
              <TickIcon />
            </Menu.ItemIndicator>
          </Menu.CheckboxItem>
        ))}
        <Menu.RadioGroup value={file} onValueChange={setFile}>
          {files.map((file) => (
            <Menu.RadioItem key={file} className={styles.item} value={file}>
              {file}
              <Menu.ItemIndicator className={styles.animatedItemIndicator}>
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
          className={styles.content}
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
      <Menu.SubTrigger className={[styles.item, styles.subTrigger].join(' ')} disabled={disabled}>
        {heading} →
      </Menu.SubTrigger>
      <Menu.Portal>
        <Menu.SubContent
          className={[animated && styles.animatedContent, styles.content].filter(Boolean).join(' ')}
          {...contentProps}
        >
          {children}
        </Menu.SubContent>
      </Menu.Portal>
    </Menu.Sub>
  );
};

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
