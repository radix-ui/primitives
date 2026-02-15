import * as React from 'react';
import { Label, RadioGroup } from 'radix-ui';

export function Basic() {
  return (
    <Label.Root>
      Favourite pet
      <RadioGroup.Root defaultValue="1">
        <Label.Root>
          <RadioGroup.Item value="1">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Cat
        </Label.Root>
        <br />

        <Label.Root>
          <RadioGroup.Item value="2">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Dog
        </Label.Root>
        <br />

        <Label.Root>
          <RadioGroup.Item value="3">
            [ <RadioGroup.Indicator>X</RadioGroup.Indicator> ]
          </RadioGroup.Item>
          Rabbit
        </Label.Root>
        <br />
      </RadioGroup.Root>
    </Label.Root>
  );
}
