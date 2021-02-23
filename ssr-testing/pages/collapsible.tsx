import * as React from 'react';
import { Collapsible, CollapsibleButton, CollapsibleContent } from '@radix-ui/react-collapsible';

export default function CollapsiblePage() {
  return (
    <Collapsible>
      <CollapsibleButton>Button</CollapsibleButton>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
