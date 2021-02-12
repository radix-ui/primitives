import * as React from 'react';
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from '@radix-ui/react-radio-group';

export default function RadioGroupPage() {
  return (
    <RadioGroup defaultValue="1">
      <RadioGroupItem value="1">
        <RadioGroupIndicator>x</RadioGroupIndicator>
      </RadioGroupItem>
      <RadioGroupItem value="2">
        <RadioGroupIndicator>x</RadioGroupIndicator>
      </RadioGroupItem>
      <RadioGroupItem value="3">
        <RadioGroupIndicator>x</RadioGroupIndicator>
      </RadioGroupItem>
    </RadioGroup>
  );
}
