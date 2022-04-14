import * as React from 'react';
import { css } from '../../../../stitches.config';
import * as Select from '@radix-ui/react-select';
import { Label } from '@radix-ui/react-label';
import * as Dialog from '@radix-ui/react-dialog';
import { foodGroups } from '../../../../test-data/foods';

export default { title: 'Components/Select' };

export const Styled = () => (
  <div style={{ padding: 50 }}>
    <Label>
      Choose a number:
      <Select.Root defaultValue="two">
        <Select.Trigger className={triggerClass()}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={contentClass()}>
          <Select.Viewport className={viewportClass()}>
            <Select.Item className={itemClass()} value="one">
              <Select.ItemText>
                One<span aria-hidden> 👍</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={itemClass()} value="two">
              <Select.ItemText>
                Two<span aria-hidden> 👌</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={itemClass()} value="three">
              <Select.ItemText>
                Three<span aria-hidden> 🤘</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </Label>
  </div>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('uk');
  return (
    <div style={{ padding: 50 }}>
      <Label>
        Choose a country:
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Trigger className={triggerClass()}>
            <Select.Value
              aria-label={
                value === 'fr'
                  ? 'France'
                  : value === 'uk'
                  ? 'United Kingdom'
                  : value === 'es'
                  ? 'Spain'
                  : undefined
              }
            >
              {value === 'fr' ? '🇫🇷' : value === 'uk' ? '🇬🇧' : value === 'es' ? '🇪🇸' : null}
            </Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Content className={contentClass()}>
            <Select.Viewport className={viewportClass()}>
              <Select.Item className={itemClass()} value="fr">
                <Select.ItemText>
                  France<span aria-hidden> 🇫🇷</span>
                </Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={itemClass()} value="uk">
                <Select.ItemText>
                  United Kingdom<span aria-hidden> 🇬🇧</span>
                </Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={itemClass()} value="es">
                <Select.ItemText>
                  Spain<span aria-hidden> 🇪🇸</span>
                </Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </Label>
    </div>
  );
};

export const Position = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '300vw',
      height: '300vh',
    }}
  >
    <Label>
      Choose an item:
      <Select.Root defaultValue="item-25">
        <Select.Trigger className={triggerClass()}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={contentClass()}>
          <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton>
          <Select.Viewport className={viewportClass()}>
            {Array.from({ length: 50 }, (_, i) => {
              const value = `item-${i + 1}`;
              return (
                <Select.Item
                  key={value}
                  className={itemClass()}
                  value={value}
                  disabled={i > 5 && i < 9}
                >
                  <Select.ItemText>item {i + 1}</Select.ItemText>
                  <Select.ItemIndicator className={indicatorClass()}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </Label>
  </div>
);

export const Typeahead = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300vh' }}>
    <Label>
      Favourite food:
      <Select.Root defaultValue="banana">
        <Select.Trigger className={triggerClass()}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={contentClass()}>
          <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton>
          <Select.Viewport className={viewportClass()}>
            {foodGroups.map((foodGroup) =>
              foodGroup.foods.map((food) => (
                <Select.Item key={food.value} className={itemClass()} value={food.value}>
                  <Select.ItemText>{food.label}</Select.ItemText>
                  <Select.ItemIndicator className={indicatorClass()}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))
            )}
          </Select.Viewport>
          <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </Label>
  </div>
);

export const WithGroups = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300vh' }}>
    <Label>
      Favourite food:
      <Select.Root defaultValue="banana">
        <Select.Trigger className={triggerClass()}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={contentClass()}>
          <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton>
          <Select.Viewport className={viewportClass()}>
            {foodGroups.map((foodGroup, index) => {
              const hasLabel = foodGroup.label !== undefined;
              return (
                <React.Fragment key={index}>
                  <Select.Group className={groupStyles()}>
                    {hasLabel && (
                      <Select.Label className={labelClass()} key={foodGroup.label}>
                        {foodGroup.label}
                      </Select.Label>
                    )}
                    {foodGroup.foods.map((food) => (
                      <Select.Item
                        key={food.value}
                        className={hasLabel ? itemInGroupClass() : itemClass()}
                        value={food.value}
                      >
                        <Select.ItemText>{food.label}</Select.ItemText>
                        <Select.ItemIndicator className={indicatorClass()}>
                          <TickIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                  {index < foodGroups.length - 1 && (
                    <Select.Separator className={separatorClass()} />
                  )}
                </React.Fragment>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </Label>
  </div>
);

export const Labelling = () => {
  const content = (
    <Select.Content className={contentClass()}>
      <Select.Viewport className={viewportClass()}>
        <Select.Item className={itemClass()} value="0-18">
          <Select.ItemText>0 to 18</Select.ItemText>
          <Select.ItemIndicator className={indicatorClass()}>
            <TickIcon />
          </Select.ItemIndicator>
        </Select.Item>
        <Select.Item className={itemClass()} value="18-40">
          <Select.ItemText>18 to 40</Select.ItemText>
          <Select.ItemIndicator className={indicatorClass()}>
            <TickIcon />
          </Select.ItemIndicator>
        </Select.Item>
        <Select.Item className={itemClass()} value="40+">
          <Select.ItemText>Over 40</Select.ItemText>
          <Select.ItemIndicator className={indicatorClass()}>
            <TickIcon />
          </Select.ItemIndicator>
        </Select.Item>
      </Select.Viewport>
    </Select.Content>
  );
  return (
    <div style={{ padding: 50 }}>
      <h1>`Label` wrapping</h1>
      <Label>
        What is your age?
        <Select.Root defaultValue="18-40">
          <Select.Trigger className={triggerClass()}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          {content}
        </Select.Root>
      </Label>

      <h1>`Label` with `htmlFor`</h1>
      <Label htmlFor="age-Label">What is your age?</Label>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={triggerClass()} id="age-Label">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>

      <h1>`aria-labelledby`</h1>
      <div id="age-aria-labelledby">What is your age?</div>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={triggerClass()} aria-labelledby="age-aria-labelledby">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>

      <h1>`aria-label`</h1>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={triggerClass()} aria-label="What is your age?">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>
    </div>
  );
};

export const RightToLeft = () => (
  <div style={{ padding: 50 }} dir="rtl">
    <Label>
      اختر فاكهة:
      <Select.Root defaultValue="two" dir="rtl">
        <Select.Trigger className={triggerClass()}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={contentClass()}>
          <Select.Viewport className={viewportClass()}>
            <Select.Item className={itemClass()} value="one">
              <Select.ItemText>
                تفاح<span aria-hidden> 🍎</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={itemClass()} value="two">
              <Select.ItemText>
                حفنة من الموز<span aria-hidden> 🍌</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item className={itemClass()} value="three">
              <Select.ItemText>
                الفراولة<span aria-hidden> 🍓</span>
              </Select.ItemText>
              <Select.ItemIndicator className={indicatorClass()}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </Label>
  </div>
);

export const WithinForm = () => {
  const [data, setData] = React.useState({});
  return (
    <form
      style={{ padding: 50 }}
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const formData = new FormData(event.currentTarget);
        setData(Object.fromEntries((formData as any).entries()));
      }}
    >
      <Label style={{ display: 'block' }}>
        Name
        <input name="name" autoComplete="name" style={{ display: 'block' }} />
      </Label>
      <br />
      <Label style={{ display: 'block' }}>
        Country
        <Select.Root name="country" autoComplete="country" defaultValue="fr">
          <Select.Trigger className={triggerClass()}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content className={contentClass()}>
            <Select.Viewport className={viewportClass()}>
              <Select.Item className={itemClass()} value="fr">
                <Select.ItemText>France</Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={itemClass()} value="uk">
                <Select.ItemText>United Kingdom</Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={itemClass()} value="es">
                <Select.ItemText>Spain</Select.ItemText>
                <Select.ItemIndicator className={indicatorClass()}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
};

export const WithinDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger>Open Dialog</Dialog.Trigger>
    <Dialog.Content aria-describedby={undefined}>
      <Dialog.Title>A select in a dialog</Dialog.Title>
      <Label>
        Choose a number:
        <Select.Root defaultValue="2">
          <Select.Trigger className={triggerClass()}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content className={contentClass()}>
            <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton>
            <Select.Viewport className={viewportClass()}>
              {Array.from({ length: 30 }, (_, i) => (
                <Select.Item key={i} className={itemClass()} value={String(i)}>
                  <Select.ItemText>Item {i}</Select.ItemText>
                  <Select.ItemIndicator className={indicatorClass()}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton>
          </Select.Content>
        </Select.Root>
      </Label>
      <Dialog.Close>Close Dialog</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

const triggerClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  border: '1px solid $black',
  borderRadius: 6,
  backgroundColor: 'transparent',
  height: 50,
  padding: '5px 15px',
  fontFamily: '-apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
  lineHeight: 1,

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.5)',
  },
});

const contentClass = css({
  backgroundColor: '$white',
  border: '1px solid $gray100',
  borderRadius: 6,
  boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&:focus-within': { borderColor: '$black' },
});

const viewportClass = css({
  padding: 5,
});

const groupStyles = css({});

const itemStyles: any = {
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  cursor: 'default',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  height: 25,
  padding: '0 25px',
  fontFamily: '-apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
  color: '$black',
  borderRadius: 3,
};

const labelClass = css({
  ...itemStyles,
  color: '$gray300',
  fontWeight: 500,
});

const itemClass = css({
  ...itemStyles,
  position: 'relative',

  '&:focus': {
    outline: 'none',
    backgroundColor: '$black',
    color: 'white',
  },
  '&[data-disabled]': { color: '$gray100' },
  '[dir="rtl"] &': { fontSize: 16, fontWeight: 'bold' },
});

const itemInGroupClass = css(itemClass, {
  paddingLeft: 35,
});

const indicatorClass = css({
  position: 'absolute',
  left: 6,
  top: 6,
  '& svg': { display: 'block' },
  '[dir="rtl"] &': { left: 'auto', right: 6 },
});

const scrollButtonClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  height: 25,
  backgroundColor: '$white',
  color: '$black',
  cursor: 'default',
});

const scrollUpButtonClass = css(scrollButtonClass, {
  borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
});

const scrollDownButtonClass = css(scrollButtonClass, {
  borderTop: '1px solid rgba(0, 0, 0, 0.2)',
});

const separatorClass = css({
  height: 1,
  margin: '5px -5px',
  backgroundColor: '$gray100',
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
