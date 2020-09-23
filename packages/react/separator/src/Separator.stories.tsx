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

export const HorizontalOrientation = () => {
  return (
    <div>
      <div>
        <p>The following separator is horizontal and has semantic meaning.</p>
      </div>
      <Separator as={Root} orientation="horizontal" />
      <div>
        <p>
          The following separator is horizontal and is purely decorative. Assistive technology will
          ignore this element.
        </p>
      </div>
      <Separator as={Root} orientation="horizontal" decorative />
    </div>
  );
};

export const VerticalOrientation = () => {
  return (
    <VerticalSeparatorBox>
      <VerticalSeparatorInner>
        <p>The following separator is vertical and has semantic meaning.</p>
      </VerticalSeparatorInner>
      <Separator as={Root} orientation="vertical" />
      <VerticalSeparatorInner>
        <p>
          The following separator is vertical and is purely decorative. Assistive technology will
          ignore this element.
        </p>
      </VerticalSeparatorInner>
      <Separator as={Root} orientation="vertical" decorative />
    </VerticalSeparatorBox>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

function VerticalSeparatorBox({ children }: any) {
  return (
    <div
      style={{
        height: '200px',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {children}
    </div>
  );
}

function VerticalSeparatorInner({ children }: any) {
  return <div style={{ width: '200px', margin: '0 20px' }}>{children}</div>;
}

const Root = styled('hr', {
  ...(styles.root as any),
  height: '1px',
  width: '100%',
  border: 'none',
  backgroundColor: '$gray300',
  '&[data-orientation="vertical"]': {
    height: '100%',
    width: '1px',
  },
});
