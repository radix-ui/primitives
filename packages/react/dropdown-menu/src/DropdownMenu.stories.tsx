import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTriggerItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuArrow,
} from './DropdownMenu';
import { SIDE_OPTIONS, ALIGN_OPTIONS } from '@radix-ui/popper';
import { css } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';
import { classes, TickIcon } from '../../menu/src/Menu.stories';

const { contentClass, itemClass, labelClass, separatorClass, subTriggerClass } = classes;

export default { title: 'Components/DropdownMenu' };

export const Styled = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}>
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClass} sideOffset={5}>
        <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
          Undo
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
          Redo
        </DropdownMenuItem>
        <DropdownMenuSeparator className={separatorClass} />
        <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
          Cut
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
          Paste
        </DropdownMenuItem>
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const Submenus = () => {
  const [rtl, setRtl] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <label style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
        <DropdownMenu dir={rtl ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
          <DropdownMenuContent className={contentClass} sideOffset={5}>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator className={separatorClass} />
            <DropdownMenu>
              <DropdownMenuTriggerItem className={subTriggerClass}>
                Submenu →
              </DropdownMenuTriggerItem>
              <DropdownMenuContent className={contentClass} sideOffset={12}>
                <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                  One
                </DropdownMenuItem>

                <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                  Two
                </DropdownMenuItem>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenu>
                  <DropdownMenuTriggerItem className={subTriggerClass}>
                    Submenu →
                  </DropdownMenuTriggerItem>
                  <DropdownMenuContent className={contentClass} sideOffset={12}>
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                      One
                    </DropdownMenuItem>
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                      Two
                    </DropdownMenuItem>
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                      Three
                    </DropdownMenuItem>
                    <DropdownMenuArrow offset={8} />
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                  Three
                </DropdownMenuItem>
                <DropdownMenuArrow offset={8} />
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator className={separatorClass} />
            <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenuItem>
            <DropdownMenuArrow />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const WithLabels = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClass} sideOffset={5}>
        {foodGroups.map((foodGroup, index) => (
          <DropdownMenuGroup key={index}>
            {foodGroup.label && (
              <DropdownMenuLabel className={labelClass} key={foodGroup.label}>
                {foodGroup.label}
              </DropdownMenuLabel>
            )}
            {foodGroup.foods.map((food) => (
              <DropdownMenuItem
                key={food.value}
                className={itemClass}
                disabled={food.disabled}
                onSelect={() => console.log(food.label)}
              >
                {food.label}
              </DropdownMenuItem>
            ))}
            {index < foodGroups.length - 1 && <DropdownMenuSeparator className={separatorClass} />}
          </DropdownMenuGroup>
        ))}
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
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
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent className={contentClass} sideOffset={5}>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('show')}>
            Show fonts
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('bigger')}>
            Bigger
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <DropdownMenuCheckboxItem
              key={label}
              className={itemClass}
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
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const RadioItems = () => {
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent className={contentClass} sideOffset={5}>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('minimize')}>
            Minimize window
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('zoom')}>
            Zoom
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuRadioGroup value={file} onValueChange={setFile}>
            {files.map((file) => (
              <DropdownMenuRadioItem key={file} className={itemClass} value={file}>
                {file}
                <DropdownMenuItemIndicator>
                  <TickIcon />
                </DropdownMenuItemIndicator>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>
      <p>Selected file: {file}</p>
    </div>
  );
};

export const PreventClosing = () => (
  <div style={{ textAlign: 'center', padding: 50 }}>
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClass} sideOffset={5}>
        <DropdownMenuItem className={itemClass} onSelect={() => window.alert('action 1')}>
          I will close
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onSelect={(event) => {
            event.preventDefault();
            window.alert('action 1');
          }}
        >
          I won't close
        </DropdownMenuItem>
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

// change order slightly for more pleasing visual
const SIDES = SIDE_OPTIONS.filter((side) => side !== 'bottom').concat(['bottom']);

export const Chromatic = () => {
  const checkboxItems = [
    { label: 'Bold', state: React.useState(false) },
    { label: 'Italic', state: React.useState(true) },
    { label: 'Underline', state: React.useState(false) },
    { label: 'Strikethrough', state: React.useState(false), disabled: true },
  ];
  const files = ['README.md', 'index.js', 'page.css'];
  const [file, setFile] = React.useState(files[1]);

  return (
    <div style={{ padding: 200, paddingBottom: 800 }}>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h2>Open</h2>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
      <DropdownMenu defaultOpen>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      </DropdownMenu>

      <h1 style={{ marginTop: 200 }}>Controlled</h1>
      <h2>Closed</h2>
      <DropdownMenu open={false}>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h2>Open</h2>
      <DropdownMenu open>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
      <DropdownMenu open>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      </DropdownMenu>

      <h1 style={{ marginTop: 200 }}>Submenus</h1>
      <h2>Open</h2>
      <DropdownMenu open>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenu open>
            <DropdownMenuTriggerItem className={subTriggerClass}>Submenu →</DropdownMenuTriggerItem>
            <DropdownMenuContent className={contentClass} sideOffset={12} avoidCollisions={false}>
              <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                One
              </DropdownMenuItem>

              <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                Two
              </DropdownMenuItem>
              <DropdownMenuSeparator className={separatorClass} />
              <DropdownMenu open>
                <DropdownMenuTriggerItem className={subTriggerClass}>
                  Submenu →
                </DropdownMenuTriggerItem>
                <DropdownMenuContent
                  className={contentClass}
                  sideOffset={12}
                  avoidCollisions={false}
                >
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                    One
                  </DropdownMenuItem>
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                    Two
                  </DropdownMenuItem>
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                    Three
                  </DropdownMenuItem>
                  <DropdownMenuArrow offset={8} />
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenuSeparator className={separatorClass} />
              <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                Three
              </DropdownMenuItem>
              <DropdownMenuArrow offset={8} />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      </DropdownMenu>

      <h2 style={{ marginTop: 275 }}>With custom alignment</h2>
      <DropdownMenu open>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
            Undo
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
            Redo
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenu open>
            <DropdownMenuTriggerItem className={subTriggerClass}>Submenu →</DropdownMenuTriggerItem>
            <DropdownMenuContent
              className={contentClass}
              sideOffset={12}
              avoidCollisions={false}
              align="center"
            >
              <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                One
              </DropdownMenuItem>

              <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                Two
              </DropdownMenuItem>
              <DropdownMenuSeparator className={separatorClass} />
              <DropdownMenu open>
                <DropdownMenuTriggerItem className={subTriggerClass}>
                  Submenu →
                </DropdownMenuTriggerItem>
                <DropdownMenuContent
                  className={contentClass}
                  sideOffset={12}
                  avoidCollisions={false}
                  align="end"
                  alignOffset={-16}
                >
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                    One
                  </DropdownMenuItem>
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                    Two
                  </DropdownMenuItem>
                  <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                    Three
                  </DropdownMenuItem>
                  <DropdownMenuArrow offset={24} />
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenuSeparator className={separatorClass} />
              <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                Three
              </DropdownMenuItem>
              <DropdownMenuArrow offset={8} />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
            Paste
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
      </DropdownMenu>

      <h2 style={{ marginTop: 275 }}>RTL</h2>
      <div dir="rtl">
        <DropdownMenu open dir="rtl">
          <DropdownMenuContent
            className={contentClass}
            sideOffset={5}
            avoidCollisions={false}
            disableOutsideScroll={false}
          >
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('undo')}>
              Undo
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('redo')}>
              Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator className={separatorClass} />
            <DropdownMenu open>
              <DropdownMenuTriggerItem className={subTriggerClass}>
                Submenu →
              </DropdownMenuTriggerItem>
              <DropdownMenuContent className={contentClass} sideOffset={12} avoidCollisions={false}>
                <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                  One
                </DropdownMenuItem>

                <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                  Two
                </DropdownMenuItem>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenu open>
                  <DropdownMenuTriggerItem className={subTriggerClass}>
                    Submenu →
                  </DropdownMenuTriggerItem>
                  <DropdownMenuContent
                    className={contentClass}
                    sideOffset={12}
                    avoidCollisions={false}
                  >
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('one')}>
                      One
                    </DropdownMenuItem>
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('two')}>
                      Two
                    </DropdownMenuItem>
                    <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                      Three
                    </DropdownMenuItem>
                    <DropdownMenuArrow offset={8} />
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenuItem className={itemClass} onSelect={() => console.log('three')}>
                  Three
                </DropdownMenuItem>
                <DropdownMenuArrow offset={8} />
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator className={separatorClass} />
            <DropdownMenuItem className={itemClass} disabled onSelect={() => console.log('cut')}>
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('copy')}>
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass} onSelect={() => console.log('paste')}>
              Paste
            </DropdownMenuItem>
            <DropdownMenuArrow />
          </DropdownMenuContent>
          <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      <h1 style={{ marginTop: 275 }}>Positioning</h1>
      <h2>No collisions</h2>
      <h3>Side & Align</h3>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                align={align}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>

      <h3>Arrow offset</h3>
      <h4>Positive</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                align={align}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow
                  className={chromaticArrowClass}
                  width={20}
                  height={10}
                  offset={5}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                align={align}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow
                  className={chromaticArrowClass}
                  width={20}
                  height={10}
                  offset={-10}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>

      <h3>Side offset</h3>
      <h4>Positive</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                sideOffset={5}
                align={align}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                sideOffset={-10}
                align={align}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>

      <h3>Align offset</h3>
      <h4>Positive</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                align={align}
                alignOffset={20}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>
      <h4>Negative</h4>
      <div className={gridClass}>
        {SIDES.map((side) =>
          ALIGN_OPTIONS.map((align) => (
            <DropdownMenu key={`${side}-${align}`} open>
              <DropdownMenuTrigger className={chromaticTriggerClass} />
              <DropdownMenuContent
                className={chromaticContentClass}
                side={side}
                align={align}
                alignOffset={-10}
                avoidCollisions={false}
                disableOutsideScroll={false}
              >
                <p style={{ textAlign: 'center' }}>
                  {side}
                  <br />
                  {align}
                </p>
                <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
              </DropdownMenuContent>
            </DropdownMenu>
          ))
        )}
      </div>

      <h2>Collisions</h2>
      <p>See instances on the periphery of the page.</p>
      {SIDES.map((side) =>
        ALIGN_OPTIONS.map((align) => (
          <DropdownMenu key={`${side}-${align}`} open>
            <DropdownMenuTrigger
              className={chromaticTriggerClass}
              style={{
                position: 'absolute',
                [side]: 10,
                ...((side === 'right' || side === 'left') &&
                  (align === 'start'
                    ? { bottom: 10 }
                    : align === 'center'
                    ? { top: 'calc(50% - 15px)' }
                    : { top: 10 })),
                ...((side === 'top' || side === 'bottom') &&
                  (align === 'start'
                    ? { right: 10 }
                    : align === 'center'
                    ? { left: 'calc(50% - 15px)' }
                    : { left: 10 })),
              }}
            />
            <DropdownMenuContent
              className={chromaticContentClass}
              side={side}
              align={align}
              disableOutsideScroll={false}
            >
              <p style={{ textAlign: 'center' }}>
                {side}
                <br />
                {align}
              </p>
              <DropdownMenuArrow className={chromaticArrowClass} width={20} height={10} />
            </DropdownMenuContent>
          </DropdownMenu>
        ))
      )}

      <h1>With labels</h1>
      <DropdownMenu open>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          {foodGroups.map((foodGroup, index) => (
            <DropdownMenuGroup key={index}>
              {foodGroup.label && (
                <DropdownMenuLabel className={labelClass} key={foodGroup.label}>
                  {foodGroup.label}
                </DropdownMenuLabel>
              )}
              {foodGroup.foods.map((food) => (
                <DropdownMenuItem
                  key={food.value}
                  className={itemClass}
                  disabled={food.disabled}
                  onSelect={() => console.log(food.label)}
                >
                  {food.label}
                </DropdownMenuItem>
              ))}
              {index < foodGroups.length - 1 && (
                <DropdownMenuSeparator className={separatorClass} />
              )}
            </DropdownMenuGroup>
          ))}
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 style={{ marginTop: 600 }}>With checkbox and radio items</h1>
      <DropdownMenu open>
        <DropdownMenuTrigger className={triggerClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('show')}>
            Show fonts
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('bigger')}>
            Bigger
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClass} onSelect={() => console.log('smaller')}>
            Smaller
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorClass} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <DropdownMenuCheckboxItem
              key={label}
              className={itemClass}
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
          <DropdownMenuSeparator className={separatorClass} />
          <DropdownMenuRadioGroup value={file} onValueChange={setFile}>
            {files.map((file) => (
              <DropdownMenuRadioItem key={file} className={itemClass} value={file}>
                {file}
                <DropdownMenuItemIndicator>
                  <TickIcon />
                </DropdownMenuItemIndicator>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu>

      <h1 style={{ marginTop: 500 }}>State attributes</h1>
      <h2>Closed</h2>
      <DropdownMenu open={false}>
        <DropdownMenuTrigger className={triggerAttrClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentAttrClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        />
      </DropdownMenu>

      <h2>Open</h2>
      <DropdownMenu open>
        <DropdownMenuTrigger className={triggerAttrClass}>Open</DropdownMenuTrigger>
        <DropdownMenuContent
          className={contentAttrClass}
          sideOffset={5}
          avoidCollisions={false}
          disableOutsideScroll={false}
        >
          <DropdownMenuItem className={itemAttrClass} onSelect={() => console.log('show')}>
            Show fonts
          </DropdownMenuItem>
          <DropdownMenuItem className={itemAttrClass} onSelect={() => console.log('bigger')}>
            Bigger
          </DropdownMenuItem>
          <DropdownMenuItem className={itemAttrClass} onSelect={() => console.log('smaller')}>
            Smaller
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorAttrClass} />
          {checkboxItems.map(({ label, state: [checked, setChecked], disabled }) => (
            <DropdownMenuCheckboxItem
              key={label}
              className={checkboxItemAttrClass}
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            >
              {label}
              <DropdownMenuItemIndicator className={itemIndicatorAttrClass}>
                <TickIcon />
              </DropdownMenuItemIndicator>
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator className={separatorAttrClass} />
          <DropdownMenuRadioGroup
            className={radioGroupAttrClass}
            value={file}
            onValueChange={setFile}
          >
            {files.map((file) => (
              <DropdownMenuRadioItem key={file} className={radioItemAttrClass} value={file}>
                {file}
                <DropdownMenuItemIndicator className={itemIndicatorAttrClass}>
                  <TickIcon />
                </DropdownMenuItemIndicator>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuArrow className={arrowAttrClass} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({
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

const gridClass = css({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(3, 50px)',
  columnGap: 150,
  rowGap: 100,
  padding: 100,
  border: '1px solid black',
});

const chromaticTriggerClass = css({
  boxSizing: 'border-box',
  width: 30,
  height: 30,
  backgroundColor: 'tomato',
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticContentClass = css({
  boxSizing: 'border-box',
  display: 'grid',
  placeContent: 'center',
  width: 60,
  height: 60,
  backgroundColor: 'royalblue',
  color: 'white',
  fontSize: 10,
  border: '1px solid rgba(0, 0, 0, 0.3)',
});
const chromaticArrowClass = css({
  fill: 'black',
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '[data-disabled]': { borderStyle: 'dashed' },

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
};
const triggerAttrClass = css(styles);
const contentAttrClass = css(styles);
const itemAttrClass = css(styles);
const itemIndicatorAttrClass = css(styles);
const checkboxItemAttrClass = css(styles);
const radioGroupAttrClass = css(styles);
const radioItemAttrClass = css(styles);
const separatorAttrClass = css(styles);
const arrowAttrClass = css(styles);
