import * as React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
} from './ContextMenu';
import { css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { classes, TickIcon } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, labelClass, separatorClass } = classes;

export default { title: 'Components/ContextMenu' };

export const Styled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200vw',
        height: '200vh',
        gap: 20,
      }}
    >
      <ContextMenu onOpenChange={setOpen}>
        <ContextMenuTrigger
          className={triggerClass}
          style={{ background: open ? 'lightblue' : undefined }}
        />
        <ContextMenuContent className={contentClass} offset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          <ContextMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const WithLabels = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass} />
      <ContextMenuContent className={contentClass} offset={-5}>
        {foodGroups.map((foodGroup, index) => (
          <ContextMenuGroup key={index}>
            {foodGroup.label && (
              <ContextMenuLabel className={labelClass} key={foodGroup.label}>
                {foodGroup.label}
              </ContextMenuLabel>
            )}
            {foodGroup.foods.map((food) => (
              <ContextMenuItem
                key={food.value}
                className={itemClass}
                disabled={food.disabled}
                onSelect={() => console.log(food.label)}
              >
                {food.label}
              </ContextMenuItem>
            ))}
            {index < foodGroups.length - 1 && <ContextMenuSeparator className={separatorClass} />}
          </ContextMenuGroup>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

export const CheckboxItems = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger className={triggerClass} />
        <ContextMenuContent className={contentClass} offset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('show')}>
            Show fonts
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('bigger')}>
            Bigger
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <ContextMenuCheckboxItem
              key={label}
              className={itemClass}
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            >
              {label}
              <ContextMenuItemIndicator>
                <TickIcon />
              </ContextMenuItemIndicator>
            </ContextMenuCheckboxItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger className={triggerClass} />
        <ContextMenuContent className={contentClass} offset={-5}>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('minimize')}>
            Minimize window
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('zoom')}>
            Zoom
          </ContextMenuItem>
          <ContextMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator className={separatorClass} />
          <ContextMenuRadioGroup value={file} onValueChange={setFile}>
            {files.map((file) => (
              <ContextMenuRadioItem key={file} className={itemClass} value={file}>
                {file}
                <ContextMenuItemIndicator>
                  <TickIcon />
                </ContextMenuItemIndicator>
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass} />
      <ContextMenuContent className={contentClass} offset={-5}>
        <ContextMenuItem className={itemClass} onSelect={() => window.alert('action 1')}>
          I will close
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          onSelect={(event) => {
            event.preventDefault();
            window.alert('action 1');
          }}
        >
          I won't close
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

export const Multiple = () => {
  const [customColors, setCustomColors] = React.useState<{ [index: number]: string }>({});
  const [fadedIndexes, setFadedIndexes] = React.useState<number[]>([]);
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const customColor = customColors[i];
        return (
          <ContextMenu key={i}>
            <ContextMenuContent className={animatedContentClass} offset={-5}>
              <ContextMenuLabel className={labelClass}>Color</ContextMenuLabel>
              <ContextMenuRadioGroup
                value={customColor}
                onValueChange={(color) => setCustomColors((colors) => ({ ...colors, [i]: color }))}
              >
                <ContextMenuRadioItem className={itemClass} value="royalblue">
                  Blue
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem className={itemClass} value="tomato">
                  Red
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
              <ContextMenuSeparator className={separatorClass} />
              <ContextMenuCheckboxItem
                className={itemClass}
                checked={fadedIndexes.includes(i)}
                onCheckedChange={(faded) =>
                  setFadedIndexes((indexes) =>
                    faded ? [...indexes, i] : indexes.filter((index) => index !== i)
                  )
                }
              >
                Fade
                <ContextMenuItemIndicator>
                  <TickIcon />
                </ContextMenuItemIndicator>
              </ContextMenuCheckboxItem>
            </ContextMenuContent>
            <ContextMenuTrigger>
              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: customColor ? customColor : '#eeeef0',
                  color: customColor ? 'white' : '#666670',
                  fontSize: 32,
                  borderRadius: 5,
                  cursor: 'default',
                  userSelect: 'none',
                  opacity: fadedIndexes.includes(i) ? 0.5 : 1,
                }}
              >
                {i + 1}
              </div>
            </ContextMenuTrigger>
          </ContextMenu>
        );
      })}
    </div>
  );
};

export const Nested = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ContextMenu>
      <ContextMenuTrigger
        className={triggerClass}
        style={{ padding: 100, backgroundColor: 'royalblue' }}
      >
        <ContextMenu>
          <ContextMenuTrigger className={triggerClass} style={{ backgroundColor: 'tomato' }} />{' '}
          <ContextMenuContent className={contentClass} offset={-5}>
            <ContextMenuLabel className={labelClass}>Red box menu</ContextMenuLabel>
            <ContextMenuSeparator className={separatorClass} />
            <ContextMenuItem className={itemClass} onSelect={() => console.log('red action1')}>
              Red action 1
            </ContextMenuItem>
            <ContextMenuItem className={itemClass} onSelect={() => console.log('red action2')}>
              Red action 2
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ContextMenuTrigger>
      <ContextMenuContent className={contentClass} offset={-5}>
        <ContextMenuLabel className={labelClass}>Blue box menu</ContextMenuLabel>
        <ContextMenuSeparator className={separatorClass} />
        <ContextMenuItem className={itemClass} onSelect={() => console.log('blue action1')}>
          Blue action 1
        </ContextMenuItem>
        <ContextMenuItem className={itemClass} onSelect={() => console.log('blue action2')}>
          Blue action 2
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
);

const triggerClass = css({
  display: 'block',
  width: 100,
  height: 100,
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: '$gray100',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },
});

const scaleIn = css.keyframes({
  '0%': { transform: 'scale(0) rotateZ(-10deg)' },
  '20%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

const animatedContentClass = css(contentClass, {
  transformOrigin: 'var(--radix-context-menu-content-transform-origin)',
  '&[data-state="open"]': { animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)` },
});
