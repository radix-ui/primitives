import * as React from 'react';
import { Table, TableProps, Th, Td, Tbody, Thead, Tr } from './Table';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { Code } from '@modulz/radix';

export function PropsTable({
  componentName,
  propDefs = [],
  ...tableProps
}: TableProps & {
  componentName: string;
  propDefs: PropDef[];
}) {
  const propDefsSorted = propDefs.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  });

  const hasDefaultValueColumn = propDefs.some((def) => !!def.defaultValue);

  return (
    <Table {...tableProps} aria-label={`Component props for ${componentName}`}>
      <Thead>
        <Tr>
          <Th>Prop</Th>
          <Th>Type</Th>
          <Th>Required</Th>
          {hasDefaultValueColumn ? <Th>Default Value</Th> : null}
        </Tr>
      </Thead>
      <Tbody>
        {propDefsSorted.map((prop) => {
          return (
            <Tr key={prop.name}>
              <Td>
                <Code>{prop.name}</Code>
              </Td>
              <Td>
                {toArray(prop.typeSimple || prop.type).map((type, i, src) => (
                  <React.Fragment key={type}>
                    <Code key={type}>{type}</Code>
                    {i !== src.length - 1 ? <span aria-hidden>|</span> : null}
                  </React.Fragment>
                ))}
              </Td>
              <Td>
                <Code>{prop.isRequired.toString()}</Code>
              </Td>
              {hasDefaultValueColumn ? (
                <Td>
                  {prop.defaultValue != null ? (
                    <Code>{prop.defaultValue}</Code>
                  ) : (
                    <VisuallyHidden>No default value</VisuallyHidden>
                  )}
                </Td>
              ) : null}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export type PropDef = {
  name: string;
  type: string | string[];
  typeSimple?: string | string[];
  isRequired: boolean;
  defaultValue?: string;
  sectionContent: React.ReactNode;
};

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
