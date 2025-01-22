export const foodGroups: Array<{
  label?: string;
  foods: Array<{ value: string; label: string; disabled?: boolean }>;
}> = [
  {
    label: 'Fruits',
    foods: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'grapes', label: 'Grapes' },
      { value: 'pineapple', label: 'Pineapple' },
    ],
  },
  {
    label: 'Vegetables',
    foods: [
      { value: 'aubergine', label: 'Aubergine' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'carrot', label: 'Carrot', disabled: true },
      { value: 'courgette', label: 'Courgette' },
      { value: 'leek', label: 'Leek' },
    ],
  },
  {
    label: 'Meat',
    foods: [
      { value: 'beef', label: 'Beef' },
      { value: 'beef-with-sauce', label: 'Beef with sauce' },
      { value: 'chicken', label: 'Chicken' },
      { value: 'lamb', label: 'Lamb' },
      { value: 'pork', label: 'Pork' },
    ],
  },
  {
    foods: [
      { value: 'candies', label: 'Candies' },
      { value: 'chocolates', label: 'Chocolates' },
    ],
  },
];
