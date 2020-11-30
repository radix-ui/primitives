import * as React from 'react';
import { Menu, MenuItem, MenuGroup, MenuLabel, MenuSeparator } from './Menu';
import { styled } from '../../../../stitches.config';
import { foodGroups } from '../../../../test-data/foods';

export default { title: 'Components/Menu' };

export const Styled = () => (
  <Menu as={StyledRoot}>
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
  <Menu as={StyledRoot}>
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
    <p style={{ maxWidth: 400, marginBottom: 30 }}>
      I recommend opening this story frame in it's own window (outside of the storybook frame)
      because Storybook has a bunch of shortcuts on certain keys (A, D, F, S, T) which get triggered
      all the time whilst testing the typeahead.
    </p>

    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 100 }}>
      <div>
        <h2>Text labels</h2>
        <WithLabels />
        <div style={{ marginTop: 20 }}>
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
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(relying on `.textContent` — default)</p>
        <Menu as={StyledRoot}>
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
        <Menu as={StyledRoot}>
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
    borderColor: 'black',
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
  color: 'black',
  borderRadius: 3,
};

const StyledItem = styled('div', {
  ...itemCss,

  '&:focus': {
    outline: 'none',
    backgroundColor: 'black',
    color: 'white',
  },

  '&[data-disabled]': {
    color: '$gray100',
  },
});

const StyledLabel = styled('div', {
  ...itemCss,
  color: '$gray100',
});

const StyledSeparator = styled('div', {
  height: 1,
  margin: '5px 10px',
  backgroundColor: '$gray100',
});
