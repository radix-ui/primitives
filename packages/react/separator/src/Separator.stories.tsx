import * as React from 'react';
import { Separator, styles } from './Separator';
import { createStyled } from '@stitches/react';

export default { title: 'Separator' };

const { styled } = createStyled({
  tokens: {
    colors: {
      $gray300: '#aaa',
    },
  },
});

export const Basic = () => <Separator />;

export const ToggleOrientation = () => {
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
  return (
    <div>
      <OuterBox orientation={orientation}>
        <InnerBox orientation={orientation}>
          <p>The following separator is {orientation} and has semantic meaning.</p>
        </InnerBox>
        <Separator as={Root} orientation={orientation} />
        <InnerBox orientation={orientation}>
          <p>
            The following separator is {orientation} and is purely decorative. Assistive technology
            will ignore this element.
          </p>
        </InnerBox>
        <Separator as={Root} orientation={orientation} decorative />
      </OuterBox>
      <fieldset>
        <legend>Select orientation:</legend>
        {['vertical', 'horizontal'].map((o) => (
          <div key={o}>
            <label>
              <input
                type="radio"
                name="orientation"
                value={o}
                checked={orientation === o}
                onChange={(e) => setOrientation(e.target.value as any)}
              />
              {o}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
};

function OuterBox({ children, orientation }: any) {
  return (
    <div
      style={{
        marginBottom: 20,
        height: '200px',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
      }}
    >
      {children}
    </div>
  );
}

function InnerBox({ children, orientation }: any) {
  return (
    <div
      style={
        orientation === 'vertical' ? { width: '200px', margin: '0 20px' } : { margin: '20px 0' }
      }
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const Root = styled('hr', {
  ...(styles.root as any),
  height: `1px`,
  width: `100%`,
  border: `none`,
  backgroundColor: '$gray300',
  '&[data-orientation="vertical"]': {
    height: `100%`,
    width: `1px`,
  },
});
