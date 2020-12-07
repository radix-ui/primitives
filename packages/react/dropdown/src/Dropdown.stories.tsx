import * as React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownPopper,
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownArrow,
} from './Dropdown';
import { styled } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { styledComponents } from '../../menu/src/Menu.stories';

const { StyledRoot, StyledItem, StyledLabel, StyledSeparator, TickIcon } = styledComponents;

export default { title: 'Components/Dropdown' };

export const Styled = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}>
    <Dropdown>
      <DropdownTrigger as={StyledTrigger}>Open</DropdownTrigger>
      <DropdownPopper sideOffset={5}>
        <DropdownMenu as={StyledRoot}>
          <DropdownMenuItem as={StyledItem} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem as={StyledItem} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator as={StyledSeparator} />
          <DropdownMenuItem as={StyledItem} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem as={StyledItem} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem as={StyledItem} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
        </DropdownMenu>
        <DropdownArrow />
      </DropdownPopper>
    </Dropdown>
  </div>
);

export const WithLabels = () => (
  <div style={{ textAlign: 'center', margin: 50 }}>
    <Dropdown>
      <DropdownTrigger as={StyledTrigger}>Open</DropdownTrigger>
      <DropdownPopper sideOffset={5}>
        <DropdownMenu as={StyledRoot}>
          {foodGroups.map((foodGroup, index) => (
            <DropdownMenuGroup key={index}>
              {foodGroup.label && (
                <DropdownMenuLabel as={StyledLabel} key={foodGroup.label}>
                  {foodGroup.label}
                </DropdownMenuLabel>
              )}
              {foodGroup.foods.map((food) => (
                <DropdownMenuItem
                  key={food.value}
                  as={StyledItem}
                  disabled={food.disabled}
                  onSelect={() => console.log(food.label)}
                >
                  {food.label}
                </DropdownMenuItem>
              ))}
              {index < foodGroups.length - 1 && <DropdownMenuSeparator as={StyledSeparator} />}
            </DropdownMenuGroup>
          ))}
        </DropdownMenu>
        <DropdownArrow />
      </DropdownPopper>
    </Dropdown>
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
      <Dropdown>
        <DropdownTrigger as={StyledTrigger}>Open</DropdownTrigger>
        <DropdownPopper sideOffset={5}>
          <DropdownMenu as={StyledRoot}>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('show')}>
              Show fonts
            </DropdownMenuItem>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('bigger')}>
              Bigger
            </DropdownMenuItem>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenuItem>
            <DropdownMenuSeparator as={StyledSeparator} />
            {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
              <DropdownMenuCheckboxItem
                key={label}
                as={StyledItem}
                checked={checked}
                onCheckedChange={setChecked}
                disabled={disabled}
              >
                {label}
                <DropdownMenuItemIndicator>
                  <TickIcon />
                </DropdownMenuItemIndicator>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenu>
          <DropdownArrow />
        </DropdownPopper>
      </Dropdown>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', margin: 50 }}>
      <Dropdown>
        <DropdownTrigger as={StyledTrigger}>Open</DropdownTrigger>
        <DropdownPopper sideOffset={5}>
          <DropdownMenu as={StyledRoot}>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('minimize')}>
              Minimize window
            </DropdownMenuItem>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('zoom')}>
              Zoom
            </DropdownMenuItem>
            <DropdownMenuItem as={StyledItem} onSelect={() => console.log('smaller')}>
              Smaller
            </DropdownMenuItem>
            <DropdownMenuSeparator as={StyledSeparator} />
            <DropdownMenuRadioGroup value={file} onValueChange={setFile}>
              {files.map((file) => (
                <DropdownMenuRadioItem key={file} as={StyledItem} value={file}>
                  {file}
                  <DropdownMenuItemIndicator>
                    <TickIcon />
                  </DropdownMenuItemIndicator>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenu>
          <DropdownArrow />
        </DropdownPopper>
      </Dropdown>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', margin: 50 }}>
    <Dropdown>
      <DropdownTrigger as={StyledTrigger}>Open</DropdownTrigger>
      <DropdownPopper sideOffset={5}>
        <DropdownMenu as={StyledRoot}>
          <DropdownMenuItem as={StyledItem} onSelect={() => window.alert('action 1')}>
            I will close
          </DropdownMenuItem>
          <DropdownMenuItem
            as={StyledItem}
            onSelect={(event) => {
              console.log(event.target, event.currentTarget);
              event.preventDefault();
              window.alert('action 1');
            }}
          >
            I won't close
          </DropdownMenuItem>
        </DropdownMenu>
        <DropdownArrow />
      </DropdownPopper>
    </Dropdown>
  </div>
);

const StyledTrigger = styled('button', {
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: 'transparent',
  padding: '5px 10px',
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },
});
