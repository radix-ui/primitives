import * as React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@interop-ui/react-collapsible';

export default function CollapsiblePage() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Trigger</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
