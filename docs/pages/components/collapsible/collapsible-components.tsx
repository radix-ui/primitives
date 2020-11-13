import * as React from 'react';
import { Code, KeyboardInteractionTable } from '../../../components/pageComponents';

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
