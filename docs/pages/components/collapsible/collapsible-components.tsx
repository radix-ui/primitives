import * as React from 'react';
import { Code, KeyboardInteractionTable } from '../../../components/pageComponents';
import { PropsTable, PropDef } from '../../../components/PropsTable';
import { Details, Summary } from '../../../components/Details';
import CollapsiblePropsDefaultIsOpen from './_collapsible-props-default-is-open.mdx';
import { Text, Divider } from '@modulz/radix';

export function KeyboardInteractions() {
  return (
    <KeyboardInteractionTable
      interactions={[
        {
          keys: ['Tab'],
          description: 'Moves keyboard focus to the disclosure button.',
        },
        {
          keys: ['Space', 'Enter'],
          description: (
            <>
              Activates the disclosure button, which toggles the visibility of{' '}
              <Code>CollapsibleContent</Code>.
            </>
          ),
        },
      ]}
    />
  );
}

// Eventually it'd be great to use the TS types to generate this data
export const collapsibleProps: PropDef[] = [
  {
    name: 'defaultIsOpen',
    isRequired: false,
    type: 'boolean',
    sectionContent: <CollapsiblePropsDefaultIsOpen />,
  },
  {
    name: 'isOpen',
    isRequired: false,
    type: 'boolean',
    sectionContent: <p>TODO</p>,
  },
  {
    name: 'disabled',
    isRequired: false,
    type: 'boolean',
    sectionContent: <p>TODO</p>,
  },
  {
    name: 'onToggle',
    isRequired: false,
    type: '(isOpen?: boolean): void',
    typeSimple: 'function',
    sectionContent: <p>TODO</p>,
  },
];

export function CollapsiblePropsSections() {
  return (
    <React.Fragment>
      {collapsibleProps.map((propDef) => (
        <Details key={propDef.name}>
          <Summary>
            <Code>Collapsible {propDef.name}</Code>
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

export function CollapsibleProps() {
  return <PropsTable componentName="Collapsible" propDefs={collapsibleProps} />;
}
