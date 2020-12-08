import * as React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopper,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
} from './ContextMenu';
import { styled, css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { styledComponents } from '../../menu/src/Menu.stories';

const { StyledRoot, StyledItem, StyledLabel, StyledSeparator, TickIcon } = styledComponents;

export default { title: 'Components/ContextMenu' };

export const Styled = () => (
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
    <ContextMenu>
      <ContextMenuTrigger as={StyledTrigger} />
      <ContextMenuTrigger as={StyledTrigger} />
      <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('undo')}>
          Undo
        </ContextMenuItem>
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('redo')}>
          Redo
        </ContextMenuItem>
        <ContextMenuSeparator as={StyledSeparator} />
        <ContextMenuItem as={StyledItem} disabled onSelect={() => console.log('cut')}>
          Cut
        </ContextMenuItem>
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('copy')}>
          Copy
        </ContextMenuItem>
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('paste')}>
          Paste
        </ContextMenuItem>
      </ContextMenuPopper>
    </ContextMenu>
  </div>
);

export const WithLabels = () => (
  <div style={{ textAlign: 'center', margin: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger as={StyledTrigger} />
      <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
        {foodGroups.map((foodGroup, index) => (
          <ContextMenuGroup key={index}>
            {foodGroup.label && (
              <ContextMenuLabel as={StyledLabel} key={foodGroup.label}>
                {foodGroup.label}
              </ContextMenuLabel>
            )}
            {foodGroup.foods.map((food) => (
              <ContextMenuItem
                key={food.value}
                as={StyledItem}
                disabled={food.disabled}
                onSelect={() => console.log(food.label)}
              >
                {food.label}
              </ContextMenuItem>
            ))}
            {index < foodGroups.length - 1 && <ContextMenuSeparator as={StyledSeparator} />}
          </ContextMenuGroup>
        ))}
      </ContextMenuPopper>
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
    <div style={{ textAlign: 'center', margin: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger as={StyledTrigger} />
        <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('show')}>
            Show fonts
          </ContextMenuItem>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('bigger')}>
            Bigger
          </ContextMenuItem>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator as={StyledSeparator} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <ContextMenuCheckboxItem
              key={label}
              as={StyledItem}
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
        </ContextMenuPopper>
      </ContextMenu>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', margin: 50 }}>
      <ContextMenu>
        <ContextMenuTrigger as={StyledTrigger} />
        <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('minimize')}>
            Minimize window
          </ContextMenuItem>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('zoom')}>
            Zoom
          </ContextMenuItem>
          <ContextMenuItem as={StyledItem} onSelect={() => console.log('smaller')}>
            Smaller
          </ContextMenuItem>
          <ContextMenuSeparator as={StyledSeparator} />
          <ContextMenuRadioGroup value={file} onValueChange={setFile}>
            {files.map((file) => (
              <ContextMenuRadioItem key={file} as={StyledItem} value={file}>
                {file}
                <ContextMenuItemIndicator>
                  <TickIcon />
                </ContextMenuItemIndicator>
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        </ContextMenuPopper>
      </ContextMenu>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', margin: 50 }}>
    <ContextMenu>
      <ContextMenuTrigger as={StyledTrigger} />
      <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
        <ContextMenuItem as={StyledItem} onSelect={() => window.alert('action 1')}>
          I will close
        </ContextMenuItem>
        <ContextMenuItem
          as={StyledItem}
          onSelect={(event) => {
            event.preventDefault();
            window.alert('action 1');
          }}
        >
          I won't close
        </ContextMenuItem>
      </ContextMenuPopper>
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
            <ContextMenuPopper as={AnimatedPopper}>
              <ContextMenuLabel as={StyledLabel}>Color</ContextMenuLabel>
              <ContextMenuRadioGroup
                value={customColor}
                onValueChange={(color) => setCustomColors((colors) => ({ ...colors, [i]: color }))}
              >
                <ContextMenuRadioItem as={StyledItem} value="royalblue">
                  Blue
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem as={StyledItem} value="tomato">
                  Red
                  <ContextMenuItemIndicator>
                    <TickIcon />
                  </ContextMenuItemIndicator>
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
              <ContextMenuSeparator as={StyledSeparator} />
              <ContextMenuCheckboxItem
                as={StyledItem}
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
            </ContextMenuPopper>
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
      <ContextMenuTrigger as={StyledTrigger} style={{ padding: 100, backgroundColor: 'royalblue' }}>
        <ContextMenu>
          <ContextMenuTrigger as={StyledTrigger} style={{ backgroundColor: 'tomato' }} />{' '}
          <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
            <ContextMenuLabel as={StyledLabel}>Red box menu</ContextMenuLabel>
            <ContextMenuSeparator as={StyledSeparator} />
            <ContextMenuItem as={StyledItem} onSelect={() => console.log('red action1')}>
              Red action 1
            </ContextMenuItem>
            <ContextMenuItem as={StyledItem} onSelect={() => console.log('red action2')}>
              Red action 2
            </ContextMenuItem>
          </ContextMenuPopper>
        </ContextMenu>
      </ContextMenuTrigger>
      <ContextMenuPopper as={StyledRoot} sideOffset={-5}>
        <ContextMenuLabel as={StyledLabel}>Blue box menu</ContextMenuLabel>
        <ContextMenuSeparator as={StyledSeparator} />
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('blue action1')}>
          Blue action 1
        </ContextMenuItem>
        <ContextMenuItem as={StyledItem} onSelect={() => console.log('blue action2')}>
          Blue action 2
        </ContextMenuItem>
      </ContextMenuPopper>
    </ContextMenu>
  </div>
);

const StyledTrigger = styled('div', {
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

const AnimatedPopper = styled(StyledRoot, {
  transformOrigin: 'var(--interop-ui-context-menu-popper-transform-origin)',
  animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
});
