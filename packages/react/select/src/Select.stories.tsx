import * as React from 'react';
import { Select } from './Select';
import './test.css';

export default { title: 'Select' };

export const Basic = () => (
  <Select>
    <Select.Option value="1">Option 1</Select.Option>
    <Select.Option value="2">Option 2</Select.Option>
    <Select.Option value="3">Option 3</Select.Option>
  </Select>
);
