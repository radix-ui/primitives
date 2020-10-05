import * as React from 'react';
import { Select, styles } from './Select';

export default { title: 'Select' };

export const Basic = () => (
  <div style={{ textAlign: 'center' }}>
    <Select defaultValue="option-2">
      <Select.Button
        style={{
          ...styles.button,
          backgroundColor: 'white',
          fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
          fontSize: 13,
          border: '2px solid black',
          borderRadius: 3,
          height: 25,
          padding: '0 10px',
          lineHeight: 1,
        }}
      />
      <Select.Position style={styles.position} sideOffset={5}>
        <Select.Options
          style={{
            ...styles.options,
            padding: '5px 0',
            backgroundColor: 'white',
            border: '2px solid black',
            boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: 5,
          }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <Select.Option
              key={i}
              value={`option-${i + 1}`}
              label={`Option ${i + 1}`}
              style={optionStyles}
            />
          ))}
          <Select.Option value="something-longer" label="Something longer" style={optionStyles} />
        </Select.Options>
        <Select.Arrow style={styles.arrow} />
      </Select.Position>
    </Select>
  </div>
);

const optionStyles = {
  ...styles.option,
  fontFamily: 'apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif',
  fontSize: 13,
  height: 25,
  padding: '0 30px',
  color: 'black',
};
