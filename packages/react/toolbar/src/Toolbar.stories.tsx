import * as React from 'react';
import { Toolbar, ToolbarItem } from './Toolbar';
import { styled } from '../../../../stitches.config';
import { ToggleButton } from '@radix-ui/react-toggle-button';

export default { title: 'Components/Toolbar' };

export const Styled = () => {
  const [bold, toggleBold] = React.useState(false);
  const [italic, toggleItalic] = React.useState(false);
  const [underline, toggleUnderline] = React.useState(false);

  const [align, setAlign] = React.useState('left');

  return (
    <StyledContainer>
      <StyledToolbar label="format toolbar" loop={true}>
        <ToolbarItem
          as={ToggleButton}
          toggled={bold}
          onToggledChange={toggleBold}
          aria-label="bold"
        >
          B
        </ToolbarItem>
        <ToolbarItem
          as={ToggleButton}
          toggled={italic}
          onToggledChange={toggleItalic}
          aria-label="italic"
          style={{ fontFamily: 'serif', fontStyle: 'italic' }}
        >
          I
        </ToolbarItem>
        <ToolbarItem
          as={ToggleButton}
          toggled={underline}
          onToggledChange={toggleUnderline}
          aria-label="underline"
          style={{ textDecoration: 'underline' }}
        >
          U
        </ToolbarItem>
        {['left', 'center', 'right'].map((option) => (
          <ToolbarItem
            as={ToggleButton}
            toggled={align === option}
            onToggledChange={() => setAlign(option)}
            aria-label={`align ${option}`}
          >
            {option[0].toUpperCase()}
          </ToolbarItem>
        ))}
      </StyledToolbar>
      <textarea
        id="textarea1"
        rows={20}
        style={{
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecoration: underline ? 'underline' : 'normal',
          textAlign: align,
        }}
        defaultValue={TEXT_AREA_CONTENT}
      ></textarea>
    </StyledContainer>
  );
};

const TEXT_AREA_CONTENT = `An open-source UI component library for building high-quality, accessible design systems and web apps.

Radix Primitives is a low-level UI component library with a focus on accessibility, customization and developer experience. You can use these components either as the base layer of your design system, or adopt them incrementally.

Vision
Most of us share similar definitions for common UI patterns like accordion, checkbox, combobox, dialog, dropdown, select, slider, and tooltip. These UI patterns are documented by WAI-ARIA and generally understood by the community.

However, the implementations provided to us by the web platform are inadequate. They're either non-existent, lacking in functionality, or cannot be customized sufficiently.

So, developers are forced to build custom components; an incredibly difficult task. As a result, most components on the web are inaccessible, non-performant, and lacking important features.

Our goal is to create a well-funded, open-source component library that the community can use to build accessible design systems.`;

const StyledContainer = styled('div', {
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '1em',
  width: '600px',
});

const StyledToolbar = styled(Toolbar, {
  backgroundColor: '#ececea',
  padding: '6px',
  height: '30px',
  borderRadius: '5px',

  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'transparent',

  display: 'flex',
  gap: '8px',

  '&:focus-within': {
    borderColor: '#9c002f',
  },

  '& button': {
    outline: 'none',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    lineHeight: '1em',

    fontSize: '16px',

    background: 'rgb(255, 255, 255)',
    color: '#222428',
    height: '30px',
    width: '30px',
    padding: '6px',

    '&[aria-pressed=true]': {
      boxShadow: '0 0 0 1px black',
      fontWeight: '600',
    },

    '&:focus': {
      boxShadow: '0 0 0 2px #005a9c',
      background: 'rgb(226, 239, 255)',
    },

    '&:hover': {
      boxShadow: '0 0 0 1px #005a9c',
      background: 'rgb(226, 239, 255)',
    },
  },
});
