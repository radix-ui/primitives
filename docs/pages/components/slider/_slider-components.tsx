/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { Code, KeyboardInteractionTable } from '../../../components/pageComponents';
import { PropsTable, PropDef } from '../../../components/PropsTable';
import { Details, Summary } from '../../../components/Details';
import SliderPropsDefaultValue from './_slider-props-default-value.mdx';
import SliderPropsDir from './_slider-props-dir.mdx';
import SliderPropsDisabled from './_slider-props-disabled.mdx';
import SliderPropsMax from './_slider-props-max.mdx';
import SliderPropsMin from './_slider-props-min.mdx';
import SliderPropsName from './_slider-props-name.mdx';
import SliderPropsOrientation from './_slider-props-orientation.mdx';
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
  {
    name: 'name',
    isRequired: false,
    type: 'string',
    sectionContent: <SliderPropsName />,
  },
  {
    name: 'disabled',
    isRequired: false,
    type: 'boolean',
    defaultValue: 'false',
    sectionContent: <SliderPropsDisabled />,
  },
  {
    name: 'orientation',
    isRequired: false,
    type: '"horizontal" | "vertical"',
    typeSimple: 'enum',
    defaultValue: '"horizontal"',
    sectionContent: <SliderPropsOrientation />,
  },
  {
    name: 'dir',
    isRequired: false,
    type: '"ltr" | "rtl"',
    typeSimple: 'enum',
    defaultValue: '"ltr"',
    sectionContent: <SliderPropsDir />,
  },
  {
    name: 'min',
    isRequired: false,
    type: 'number',
    defaultValue: '0',
    sectionContent: <SliderPropsMin />,
  },
  {
    name: 'max',
    isRequired: false,
    type: 'number',
    defaultValue: '100',
    sectionContent: <SliderPropsMax />,
  },
];

export const sliderTrackProps: PropDef[] = [
  // {
  //   name: 'defaultValue',
  //   isRequired: false,
  //   type: 'number',
  //   sectionContent: <SliderPropsDefaultValue />,
  // },
];

export const sliderRangeProps: PropDef[] = [
  // {
  //   name: 'defaultValue',
  //   isRequired: false,
  //   type: 'number',
  //   sectionContent: <SliderPropsDefaultValue />,
  // },
];

export const sliderThumbProps: PropDef[] = [
  // {
  //   name: 'defaultValue',
  //   isRequired: false,
  //   type: 'number',
  //   sectionContent: <SliderPropsDefaultValue />,
  // },
];

export function PropDefSections(props: { propDefs: PropDef[]; componentName: string }) {
  const { propDefs, componentName } = props;
  return (
    <React.Fragment>
      {propDefs.map((propDef) => (
        <Details key={propDef.name}>
          <Summary>
            <Code>
              {componentName} {propDef.name}
            </Code>
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

export function SliderTrackProps() {
  return <PropsTable componentName="SliderTrack" propDefs={sliderTrackProps} />;
}

export function SliderRangeProps() {
  return <PropsTable componentName="SliderRange" propDefs={sliderRangeProps} />;
}

export function SliderThumbProps() {
  return <PropsTable componentName="SliderThumb" propDefs={sliderThumbProps} />;
}
