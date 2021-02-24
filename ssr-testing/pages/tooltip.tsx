import * as React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from '@radix-ui/react-tooltip';

export default function TooltipPage() {
  return (
    <Tooltip>
      <TooltipTrigger>Hover or Focus me</TooltipTrigger>
      <TooltipContent sideOffset={5}>
        Nicely done!
        <TooltipArrow offset={10} />
      </TooltipContent>
    </Tooltip>
  );
}
