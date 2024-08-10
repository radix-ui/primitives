import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Label } from '@radix-ui/react-label';

export default function Page() {
  return (
    <Label>
      Favourite pet
      <RadioGroup.Root defaultValue="1">
        <Label>
          <RadioGroup.Item value="1">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Cat
        </Label>
        <br />

        <Label>
          <RadioGroup.Item value="2">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Dog
        </Label>
        <br />

        <Label>
          <RadioGroup.Item value="3">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Rabbit
        </Label>
        <br />
      </RadioGroup.Root>
    </Label>
  );
}
