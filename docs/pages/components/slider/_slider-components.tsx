/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { Code, KeyboardInteractionTable } from '../../../components/pageComponents';
import { PropsTable, PropDef } from '../../../components/PropsTable';
import { Details, Summary } from '../../../components/Details';
import SliderPropsDefaultValue from './_slider-props-default-value.mdx';
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDesc,
  RadioLabel,
  Radio,
} from '../../../components/RadioGroup';
import { Flex, Text, Divider } from '@modulz/radix';
import { Kbd } from '../../../components/Kbd';

export function KeyboardInteractions() {
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
  return (
    <div>
      <RadioGroup name="orientation" mb={3}>
        <RadioGroupLabel as="h4">Slider Orientation</RadioGroupLabel>
        <RadioGroupDesc mb={2}>
          Keyboard interactions may differ slightly when a Slider is in vertical or horizontal
          orientations.
        </RadioGroupDesc>
        <Flex sx={{ alignItems: 'center' }}>
          <RadioLabel mr={4}>
            <Radio
              value="horizontal"
              checked={orientation === 'horizontal'}
              onChange={(event) => {
                if (event.target.checked) {
                  setOrientation('horizontal');
                }
              }}
              mr={1}
            />
            Horizontal
          </RadioLabel>
          <RadioLabel>
            <Radio
              value="vertical"
              checked={orientation === 'vertical'}
              onChange={(event) => {
                if (event.target.checked) {
                  setOrientation('vertical');
                }
              }}
              mr={1}
            />
            Vertical
          </RadioLabel>
        </Flex>
      </RadioGroup>
      <KeyboardInteractionTable
        interactions={[
          {
            keys: ['ArrowRight'],
            description:
              orientation === 'vertical'
                ? 'Increases the value by the step amount'
                : 'Updates the value in the direction indicated by the right side of the slider by the step amount',
          },
          {
            keys: ['ArrowLeft'],
            description:
              orientation === 'vertical'
                ? 'Decreases the value by the step amount'
                : 'Updates the value in the direction indicated by the left side of the slider by the step amount',
          },
          {
            keys: ['ArrowUp'],
            description: 'Increases the value by the step amount',
          },
          {
            keys: ['ArrowDown'],
            description: 'Decreases the value by the step amount',
          },
          {
            keys: ['PageUp'],
            description: (
              <>
                Increases the value by a larger step than <Kbd>ArrowUp</Kbd>
              </>
            ),
          },
          {
            keys: ['PageDown'],
            description: (
              <>
                Descreases the value by a larger step than <Kbd>ArrowDown</Kbd>
              </>
            ),
          },
          {
            keys: ['Home'],
            description: 'Sets the value to its minimum',
          },
          {
            keys: ['End'],
            description: 'Sets the value to its maximum',
          },
          {
            keys: ['Enter'],
            description:
              'If the Slider is in a form context, simulates a click on the associated form submit button',
          },
        ]}
      />
    </div>
  );
}

export const sliderProps: PropDef[] = [
  {
    name: 'defaultValue',
    isRequired: false,
    type: 'number',
    sectionContent: <SliderPropsDefaultValue />,
  },
];

export function SliderPropsSections() {
  return (
    <React.Fragment>
      {sliderProps.map((propDef) => (
        <Details key={propDef.name}>
          <Summary>
            <Code>Slider {propDef.name}</Code>
          </Summary>
          <p>
            <Text size={3} weight="medium" as="span">
              Type:{' '}
            </Text>
            <Code>{propDef.type}</Code>
          </p>
          <Divider />
          {propDef.sectionContent}
        </Details>
      ))}
    </React.Fragment>
  );
}

export function SliderProps() {
  return <PropsTable componentName="Slider" propDefs={sliderProps} />;
}
