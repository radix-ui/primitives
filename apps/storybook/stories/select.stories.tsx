import * as React from 'react';
import { Dialog, Select, Label as LabelPrimitive } from 'radix-ui';
import { foodGroups } from '@repo/test-data/foods';
import styles from './select.stories.module.css';

const Label = LabelPrimitive.Root;

export default { title: 'Components/Select' };

const scrollUpButtonClass = [styles.scrollUpButton, styles.scrollButton].join(' ');
const scrollDownButtonClass = [styles.scrollDownButton, styles.scrollButton].join(' ');

const POSITIONS = ['item-aligned', 'popper'] as const;

export const Styled = () => (
  <div style={{ display: 'flex', gap: 20, padding: 50 }}>
    {POSITIONS.map((position) => (
      <Label key={position}>
        Choose a number:
        <Select.Root defaultValue="two">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="one">
                  <Select.ItemText>
                    One<span aria-hidden> 👍</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="two">
                  <Select.ItemText>
                    Two<span aria-hidden> 👌</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="three">
                  <Select.ItemText>
                    Three<span aria-hidden> 🤘</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('uk');
  return (
    <div style={{ display: 'flex', gap: 20, padding: 50 }}>
      {POSITIONS.map((position) => (
        <Label key={position}>
          Choose a country:
          <Select.Root value={value} onValueChange={setValue}>
            <Select.Trigger className={styles.trigger}>
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
            <Select.Portal>
              <Select.Content className={styles.content} position={position} sideOffset={5}>
                <Select.Viewport className={styles.viewport}>
                  <Select.Item className={styles.item} value="fr">
                    <Select.ItemText>
                      France<span aria-hidden> 🇫🇷</span>
                    </Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="uk">
                    <Select.ItemText>
                      United Kingdom<span aria-hidden> 🇬🇧</span>
                    </Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="es">
                    <Select.ItemText>
                      Spain<span aria-hidden> 🇪🇸</span>
                    </Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
                <Select.Arrow />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Label>
      ))}
    </div>
  );
};

export const Position = () => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '300vw',
      height: '300vh',
    }}
  >
    {POSITIONS.map((position) => (
      <Label key={position}>
        Choose an item:
        <Select.Root defaultValue="item-25">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
              <Select.Viewport className={styles.viewport}>
                {Array.from({ length: 50 }, (_, i) => {
                  const value = `item-${i + 1}`;
                  return (
                    <Select.Item
                      key={value}
                      className={styles.item}
                      value={value}
                      disabled={i > 5 && i < 9}
                    >
                      <Select.ItemText>item {i + 1}</Select.ItemText>
                      <Select.ItemIndicator className={styles.indicator}>
                        <TickIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Viewport>
              <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const NoDefaultValue = () => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    {POSITIONS.map((position) => (
      <Label key={position}>
        Choose a number:
        <Select.Root>
          <Select.Trigger className={styles.trigger}>
            <Select.Value placeholder="Pick an option" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="one" disabled>
                  <Select.ItemText>One</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="two">
                  <Select.ItemText>Two</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="three">
                  <Select.ItemText>Three</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const Typeahead = () => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: '300vh',
    }}
  >
    {POSITIONS.map((position) => (
      <Label key={position}>
        Favourite food:
        <Select.Root defaultValue="banana">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
              <Select.Viewport className={styles.viewport}>
                {foodGroups.map((foodGroup) =>
                  foodGroup.foods.map((food) => (
                    <Select.Item key={food.value} className={styles.item} value={food.value}>
                      <Select.ItemText>{food.label}</Select.ItemText>
                      <Select.ItemIndicator className={styles.indicator}>
                        <TickIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                )}
              </Select.Viewport>
              <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const WithGroups = () => (
  <div
    style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: '300vh',
    }}
  >
    {POSITIONS.map((position) => (
      <Label key={position}>
        Favourite food:
        <Select.Root defaultValue="banana">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
              <Select.Viewport className={styles.viewport}>
                {foodGroups.map((foodGroup, index) => {
                  const hasLabel = foodGroup.label !== undefined;
                  return (
                    <React.Fragment key={index}>
                      <Select.Group className={styles.group}>
                        {hasLabel && (
                          <Select.Label className={styles.label} key={foodGroup.label}>
                            {foodGroup.label}
                          </Select.Label>
                        )}
                        {foodGroup.foods.map((food) => (
                          <Select.Item
                            key={food.value}
                            className={[hasLabel && styles.itemInGroup, styles.item]
                              .filter(Boolean)
                              .join(' ')}
                            value={food.value}
                          >
                            <Select.ItemText>{food.label}</Select.ItemText>
                            <Select.ItemIndicator className={styles.indicator}>
                              <TickIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      {index < foodGroups.length - 1 && (
                        <Select.Separator className={styles.separator} />
                      )}
                    </React.Fragment>
                  );
                })}
              </Select.Viewport>
              <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const Labelling = () => {
  const content = (
    <Select.Portal>
      <Select.Content className={styles.content}>
        <Select.Viewport className={styles.viewport}>
          <Select.Item className={styles.item} value="0-18">
            <Select.ItemText>0 to 18</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item className={styles.item} value="18-40">
            <Select.ItemText>18 to 40</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item className={styles.item} value="40+">
            <Select.ItemText>Over 40</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
  return (
    <div style={{ padding: 50 }}>
      <h1>`Label` wrapping</h1>
      <Label>
        What is your age?
        <Select.Root defaultValue="18-40">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          {content}
        </Select.Root>
      </Label>

      <h1>`Label` with `htmlFor`</h1>
      <Label htmlFor="age-Label">What is your age?</Label>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={styles.trigger} id="age-Label">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>

      <h1>`aria-labelledby`</h1>
      <div id="age-aria-labelledby">What is your age?</div>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={styles.trigger} aria-labelledby="age-aria-labelledby">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>

      <h1>`aria-label`</h1>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={styles.trigger} aria-label="What is your age?">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>
    </div>
  );
};

export const RightToLeft = () => (
  <div style={{ display: 'flex', gap: 20, padding: 50 }} dir="rtl">
    {POSITIONS.map((position) => (
      <Label key={position}>
        اختر فاكهة:
        <Select.Root defaultValue="two" dir="rtl">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position={position} sideOffset={5}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="one">
                  <Select.ItemText>
                    تفاح<span aria-hidden> 🍎</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="two">
                  <Select.ItemText>
                    حفنة من الموز<span aria-hidden> 🍌</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="three">
                  <Select.ItemText>
                    الفراولة<span aria-hidden> 🍓</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    ))}
  </div>
);

export const WithinForm = () => {
  const [data, setData] = React.useState({});

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setData(Object.fromEntries((formData as any).entries()));
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={(event) => {
        handleChange(event);
        event.preventDefault();
      }}
      onChange={handleChange}
    >
      <Label style={{ display: 'block' }}>
        Name
        <input name="name" autoComplete="name" style={{ display: 'block' }} />
      </Label>
      <br />
      <Label style={{ display: 'block' }}>
        Country
        <Select.Root name="country" autoComplete="country" defaultValue="fr">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
};

export const DisabledWithinForm = () => {
  const [data, setData] = React.useState({});

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setData(Object.fromEntries((formData as any).entries()));
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={(event) => {
        handleChange(event);
        event.preventDefault();
      }}
      onChange={handleChange}
    >
      <Label style={{ display: 'block' }}>
        Name
        <input name="name" autoComplete="name" style={{ display: 'block' }} />
      </Label>
      <br />
      <Label style={{ display: 'block' }}>
        Country
        <Select.Root name="country" autoComplete="country" defaultValue="fr" disabled>
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
};

export const RequiredWithinForm = () => {
  const [data, setData] = React.useState({});

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setData(Object.fromEntries((formData as any).entries()));
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={(event) => {
        handleChange(event);
        event.preventDefault();
      }}
      onChange={handleChange}
    >
      <Label style={{ display: 'block' }}>
        Name
        <input name="name" autoComplete="name" style={{ display: 'block' }} />
      </Label>
      <br />
      <Label style={{ display: 'block' }}>
        Country
        <Select.Root required name="country" autoComplete="country">
          <Select.Trigger className={styles.trigger}>
            <Select.Value placeholder="Pick an option" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
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
  <div style={{ height: '120vh' }}>
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content aria-describedby={undefined} style={{ position: 'fixed', top: 100 }}>
          <Dialog.Title>A select in a dialog</Dialog.Title>
          <Label>
            Choose a number:
            <Select.Root defaultValue="2">
              <Select.Trigger className={styles.trigger}>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.content}>
                  <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
                  <Select.Viewport className={styles.viewport}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <Select.Item key={i} className={styles.item} value={String(i)}>
                        <Select.ItemText>Item {i}</Select.ItemText>
                        <Select.ItemIndicator className={styles.indicator}>
                          <TickIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className={scrollDownButtonClass}>
                    ▼
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Label>
          <Dialog.Close>Close Dialog</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
);

export const WithVeryLongSelectItems = () => (
  <div style={{ paddingLeft: 300 }}>
    <Label>
      What is the meaning of life?
      <Select.Root defaultValue="1">
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content}>
            <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
            <Select.Viewport className={styles.viewport}>
              {[
                'The meaning of life is a complex topic that has been the subject of much philosophical, scientific, and theological speculation, with no definitive answer. The meaning of life can be interpreted in many different ways, depending on individual beliefs, values, and experiences.',
                '42',
              ].map((opt, i) => (
                <Select.Item
                  key={opt}
                  className={styles.item}
                  value={String(i)}
                  // style={{ maxWidth: 500 }}
                >
                  <Select.ItemText>{opt}</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Label>
  </div>
);

export const ChromaticShortOptionsPaddedContent = () => (
  <ChromaticStoryShortOptions paddedElement="content" />
);
ChromaticShortOptionsPaddedContent.parameters = { chromatic: { disable: false } };

export const ChromaticShortOptionsPaddedViewport = () => (
  <ChromaticStoryShortOptions paddedElement="viewport" />
);
ChromaticShortOptionsPaddedViewport.parameters = { chromatic: { disable: false } };

export const ChromaticLongOptionsPaddedContent = () => (
  <ChromaticStoryLongOptions paddedElement="content" />
);
ChromaticLongOptionsPaddedContent.parameters = { chromatic: { disable: false } };

export const ChromaticLongOptionsPaddedViewport = () => (
  <ChromaticStoryLongOptions paddedElement="viewport" />
);
ChromaticLongOptionsPaddedViewport.parameters = { chromatic: { disable: false } };

export const ChromaticTopFirstPaddedContent = () => (
  <ChromaticStoryTopFirst paddedElement="content" />
);
ChromaticTopFirstPaddedContent.parameters = { chromatic: { disable: false } };

export const ChromaticTopFirstPaddedViewport = () => (
  <ChromaticStoryTopFirst paddedElement="viewport" />
);
ChromaticTopFirstPaddedViewport.parameters = { chromatic: { disable: false } };

export const ChromaticBottomLastPaddedContent = () => (
  <ChromaticStoryBottomLast paddedElement="content" />
);
ChromaticBottomLastPaddedContent.parameters = { chromatic: { disable: false } };

export const ChromaticBottomLastPaddedViewport = () => (
  <ChromaticStoryBottomLast paddedElement="viewport" />
);
ChromaticBottomLastPaddedViewport.parameters = { chromatic: { disable: false } };

export const ChromaticNoDefaultValue = () => (
  <div
    style={{
      display: 'grid',
      height: '100vh',
      placeItems: 'center',
      gridTemplateColumns: 'repeat(2, 1fr)',
    }}
  >
    <Select.Root open>
      <Select.Trigger className={styles.trigger}>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content} style={{ opacity: 0.7 }}>
          <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            {Array.from({ length: 10 }, (_, i) => (
              <Select.Item key={i} className={styles.item} value={String(i)} disabled={i < 5}>
                <Select.ItemText>{String(i)}</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>

    <Select.Root open>
      <Select.Trigger className={styles.trigger}>
        <Select.Value placeholder="Pick an option" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content} style={{ opacity: 0.7 }}>
          <Select.ScrollUpButton className={scrollUpButtonClass}>▲</Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            {Array.from({ length: 10 }, (_, i) => (
              <Select.Item key={i} className={styles.item} value={String(i)} disabled={i < 5}>
                <Select.ItemText>{String(i)}</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={scrollDownButtonClass}>▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
);
ChromaticNoDefaultValue.parameters = { chromatic: { disable: false } };

export const Cypress = () => {
  const [data, setData] = React.useState<{ size?: 'S' | 'M' | 'L' }>({});
  const [model, setModel] = React.useState<string | undefined>('');

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    setData(Object.fromEntries((formData as any).entries()));
  }

  return (
    <>
      <form
        style={{ padding: 50 }}
        onSubmit={(event) => {
          handleChange(event);
          event.preventDefault();
        }}
        onChange={handleChange}
      >
        <Label>
          choose a size:
          <Select.Root defaultValue="M" name="size">
            <Select.Trigger className={styles.trigger}>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className={styles.content}>
                <Select.Viewport className={styles.viewport}>
                  <Select.Item className={styles.item} value="S">
                    <Select.ItemText>Small</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="M">
                    <Select.ItemText>Medium</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="L">
                    <Select.ItemText>Large</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Label>
        <button type="submit" style={{ width: 100, height: 50 }}>
          buy
        </button>
        {data.size ? <p>You picked t-shirt size {data.size}</p> : null}
      </form>

      <hr />

      <div style={{ padding: 50 }}>
        <Label>
          choose a model
          <Select.Root name="model" value={model} onValueChange={setModel}>
            <Select.Trigger className={styles.trigger}>
              <Select.Value placeholder="…" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className={styles.content}>
                <Select.Viewport className={styles.viewport}>
                  <Select.Item className={styles.item} value="S">
                    <Select.ItemText>Model S</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="3">
                    <Select.ItemText>Modal 3</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="X">
                    <Select.ItemText>Model X</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item className={styles.item} value="Y">
                    <Select.ItemText>Model Y</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Label>

        <button type="button" style={{ width: 100, height: 50 }} onClick={() => setModel('')}>
          unset
        </button>
      </div>
    </>
  );
};

type PaddedElement = 'content' | 'viewport';

interface ChromaticSelectProps extends React.ComponentProps<typeof Select.Trigger> {
  count?: number;
  paddedElement?: PaddedElement;
  selected: number;
}

const ChromaticSelect = ({
  count = 5,
  paddedElement = 'content',
  selected,
  ...props
}: ChromaticSelectProps) => (
  <Select.Root defaultValue={String(selected)} open>
    <Select.Trigger className={styles.trigger} {...props}>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        className={[paddedElement === 'content' && styles.contentWithPadding, styles.contentClass]
          .filter(Boolean)
          .join(' ')}
        style={{ opacity: 0.7 }}
      >
        <Select.ScrollUpButton
          className={scrollUpButtonClass}
          style={paddedElement === 'content' ? { marginTop: -5 } : undefined}
        >
          ▲
        </Select.ScrollUpButton>
        <Select.Viewport className={paddedElement === 'viewport' ? styles.viewport : undefined}>
          {Array.from({ length: count }, (_, i) => (
            <Select.Item key={i} className={styles.item} value={String(i)}>
              <Select.ItemText>{String(i)}</Select.ItemText>
              <Select.ItemIndicator className={styles.indicator}>
                <TickIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton
          className={scrollDownButtonClass}
          style={paddedElement === 'content' ? { marginBottom: -5 } : undefined}
        >
          ▼
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectShort = React.forwardRef<
  React.ElementRef<typeof ChromaticSelect>,
  React.ComponentProps<typeof ChromaticSelect>
>(({ count = 9, ...props }, forwardedRef) => (
  <ChromaticSelect count={count} {...props} ref={forwardedRef} />
));

const SelectLong = React.forwardRef<
  React.ElementRef<typeof ChromaticSelect>,
  React.ComponentProps<typeof ChromaticSelect>
>(({ count = 50, ...props }, forwardedRef) => (
  <ChromaticSelect count={count} {...props} ref={forwardedRef} />
));

const ChromaticStoryShortOptions = ({ paddedElement }: { paddedElement: PaddedElement }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      height: '100vh',
      placeItems: 'center',
    }}
  >
    <SelectShort paddedElement={paddedElement} selected={0} style={{ alignSelf: 'start' }} />
    <SelectShort paddedElement={paddedElement} selected={2} style={{ alignSelf: 'start' }} />
    <SelectShort paddedElement={paddedElement} selected={4} style={{ alignSelf: 'start' }} />
    <SelectShort paddedElement={paddedElement} selected={6} style={{ alignSelf: 'start' }} />
    <SelectShort paddedElement={paddedElement} selected={8} style={{ alignSelf: 'start' }} />

    <SelectShort paddedElement={paddedElement} selected={0} />
    <SelectShort paddedElement={paddedElement} selected={2} />
    <SelectShort paddedElement={paddedElement} selected={4} />
    <SelectShort paddedElement={paddedElement} selected={6} />
    <SelectShort paddedElement={paddedElement} selected={8} />

    <SelectShort paddedElement={paddedElement} selected={0} style={{ alignSelf: 'end' }} />
    <SelectShort paddedElement={paddedElement} selected={2} style={{ alignSelf: 'end' }} />
    <SelectShort paddedElement={paddedElement} selected={4} style={{ alignSelf: 'end' }} />
    <SelectShort paddedElement={paddedElement} selected={6} style={{ alignSelf: 'end' }} />
    <SelectShort paddedElement={paddedElement} selected={8} style={{ alignSelf: 'end' }} />
  </div>
);

const ChromaticStoryLongOptions = ({ paddedElement }: { paddedElement: PaddedElement }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(15, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      height: '100vh',
      placeItems: 'center',
    }}
  >
    <SelectLong paddedElement={paddedElement} selected={0} style={{ alignSelf: 'start' }} />
    <SelectLong paddedElement={paddedElement} selected={25} style={{ alignSelf: 'start' }} />
    <SelectLong paddedElement={paddedElement} selected={49} style={{ alignSelf: 'start' }} />

    <SelectLong paddedElement={paddedElement} selected={0} style={{ gridRow: 1, gridColumn: 4 }} />
    <SelectLong paddedElement={paddedElement} selected={25} style={{ gridRow: 1, gridColumn: 5 }} />
    <SelectLong paddedElement={paddedElement} selected={49} style={{ gridRow: 1, gridColumn: 6 }} />

    <SelectLong paddedElement={paddedElement} selected={0} style={{ gridRow: 2, gridColumn: 7 }} />
    <SelectLong paddedElement={paddedElement} selected={25} style={{ gridRow: 2, gridColumn: 8 }} />
    <SelectLong paddedElement={paddedElement} selected={49} style={{ gridRow: 2, gridColumn: 9 }} />

    <SelectLong paddedElement={paddedElement} selected={0} style={{ gridRow: 3, gridColumn: 10 }} />
    <SelectLong
      paddedElement={paddedElement}
      selected={25}
      style={{ gridRow: 3, gridColumn: 11 }}
    />
    <SelectLong
      paddedElement={paddedElement}
      selected={49}
      style={{ gridRow: 3, gridColumn: 12 }}
    />

    <SelectLong
      paddedElement={paddedElement}
      selected={0}
      style={{ gridRow: 3, gridColumn: 13, alignSelf: 'end' }}
    />
    <SelectLong
      paddedElement={paddedElement}
      selected={25}
      style={{ gridRow: 3, gridColumn: 14, alignSelf: 'end' }}
    />
    <SelectLong
      paddedElement={paddedElement}
      selected={49}
      style={{ gridRow: 3, gridColumn: 15, alignSelf: 'end' }}
    />
  </div>
);

const ChromaticStoryTopFirst = ({ paddedElement }: { paddedElement: PaddedElement }) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <SelectShort paddedElement={paddedElement} selected={0} />
  </div>
);

const ChromaticStoryBottomLast = ({ paddedElement }: { paddedElement: PaddedElement }) => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'flex-end' }}>
    <SelectShort paddedElement={paddedElement} selected={8} />
  </div>
);

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
