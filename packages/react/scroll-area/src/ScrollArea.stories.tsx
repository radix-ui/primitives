import * as React from 'react';
import { createStyled } from '@stitches/react';
import { ScrollArea, styles } from './ScrollArea';
import './ScrollArea.stories.css';

export default { title: 'ScrollArea' };

const { styled } = createStyled({
  tokens: {
    colors: {
      //
    },
  },
});

export function Basic() {
  const [usesNative, setNative] = React.useState(false);
  return (
    <div>
      <button onClick={() => setNative(!usesNative)}>Toggle Native</button>
      <hr />
      <ScrollArea as={Root} unstable_forceNative={usesNative}>
        <ScrollArea.ScrollbarY as={ScrollbarY}>
          <ScrollArea.ButtonStart as={ScrollButtonStart}>
            <Arrow direction="up" />
          </ScrollArea.ButtonStart>

          <ScrollArea.Track as={ScrollTrack}>
            <ScrollArea.Thumb as={ScrollThumb} />
          </ScrollArea.Track>
          <ScrollArea.ButtonEnd as={ScrollButtonEnd}>
            <Arrow direction="down" />
          </ScrollArea.ButtonEnd>
        </ScrollArea.ScrollbarY>

        <ScrollArea.Position as={ScrollPosition}>
          <ScrollArea.ContentArea as={ScrollContent}>
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
            <LongContent />
          </ScrollArea.ContentArea>
        </ScrollArea.Position>
      </ScrollArea>
    </div>
  );
}

export function StitchesStyle() {
  return <div></div>;
}

/* -------------------------------------------------------------------------------------------------
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

const Root = styled('div', {
  ...styles.root,
  width: '100%',
  height: '100%',
  maxWidth: '450px',
  maxHeight: '400px',
  border: '6px solid crimson',
});

const ScrollbarY = styled('div', {
  ...styles.scrollBarY,
});

const ScrollButtonStart = styled('div', {
  ...styles.buttonStart,
  position: 'relative',
  backgroundColor: '#c0c0c0',
  border: '2px solid white',
  borderTopColor: 'white',
  borderLeftColor: 'white',
  borderRightColor: '#858585',
  borderBottomColor: '#858585',
  padding: 3,
});

const ScrollButtonEnd = styled('div', {
  ...styles.buttonEnd,
  position: 'relative',
  backgroundColor: '#c0c0c0',
  border: '2px solid white',
  borderTopColor: 'white',
  borderLeftColor: 'white',
  borderRightColor: '#858585',
  borderBottomColor: '#858585',
  padding: 3,
});

const ScrollThumb = styled('div', {
  ...styles.thumb,
  backgroundColor: '#c0c0c0',
  border: '2px solid white',
  borderTopColor: 'white',
  borderLeftColor: 'white',
  borderRightColor: '#858585',
  borderBottomColor: '#858585',
});

const ScrollTrack = styled('div', {
  ...styles.track,
  background: 'rgba(65, 105, 225, 0.3)',
});

const ScrollPosition = styled('div', {
  ...styles.position,
});

const ScrollContent = styled('div', {
  ...styles.contentArea,
});

const Arrow = React.forwardRef<SVGSVGElement, any>(function Arrow(
  { direction, ...props },
  forwardedRef
) {
  const transform =
    direction === 'down'
      ? undefined
      : `rotate(${
          direction === 'left'
            ? '-90deg'
            : direction === 'right'
            ? '90deg'
            : direction === 'up'
            ? '180deg'
            : '0'
        })`;

  return (
    <svg
      {...props}
      ref={forwardedRef}
      viewBox="0 0 20 10"
      preserveAspectRatio="none"
      style={{
        ...props.style,
        flexGrow: 1,
        transform,
      }}
    >
      <polygon points="0,0 20,0 10,10" />
    </svg>
  );
});

function LongContent() {
  return (
    <div>
      <p>
        Llacinia hendrerit auctor nam quisque augue suscipit feugiat, sit at imperdiet vitae lacus.
        Dolor sit dui posuere faucibus non pharetra laoreet conubia, augue rhoncus cras nisl sodales
        proin hac ipsum, per hendrerit sed volutpat natoque curae consectetur. Curae blandit neque
        vehicula vel mauris vulputate per felis sociosqu, sodales integer sollicitudin id litora
        accumsan viverra pulvinar, mus non adipiscing dolor facilisis habitasse mi leo. Litora
        faucibus eu pulvinar tempus gravida iaculis consectetur risus euismod fringilla, dui posuere
        viverra sapien tortor mattis et dolor tempor sem conubia, taciti sociis mus rhoncus cubilia
        praesent dapibus aliquet quis. Diam hendrerit aliquam metus dolor fusce lorem, non gravida
        arcu primis posuere ipsum adipiscing, mus sollicitudin eros lacinia mollis.
      </p>
      <p>
        Habitant fames mi massa mollis fusce congue nascetur magna bibendum inceptos accumsan,
        potenti ipsum ac sollicitudin taciti dis rhoncus lacinia fermentum placerat. Himenaeos
        taciti egestas lacinia maecenas ornare ultricies, auctor vitae nulla mi posuere leo mollis,
        eleifend lacus rutrum ante curabitur. Nullam mi quisque nulla enim pretium facilisi interdum
        morbi, himenaeos velit fames pellentesque eget nascetur laoreet vel rutrum, malesuada risus
        ad netus dolor et scelerisque.
      </p>
      <ul>
        <li>Dis cubilia aenean tortor iaculis fames duis aliquet</li>
        <li>Erat non lacinia, tempor molestie fringilla</li>
        <li>Porttitor litora praesent placerat pulvinar</li>
        <li>Arcu curabitur fermentum felis sollicitudin varius nec cras</li>
      </ul>
      <p>
        Habitasse tristique hac ligula in metus blandit lobortis leo nullam litora, tempus fusce
        tincidunt phasellus urna est rhoncus pretium etiam eu, fames neque faucibus sociis primis
        felis dui vitae odio. Egestas purus morbi pulvinar luctus adipiscing rutrum ultrices hac,
        vehicula odio ridiculus cubilia vivamus blandit faucibus, dapibus velit sociis metus
        ultricies amet scelerisque.
      </p>
      <p>
        Scelerisque commodo nam cras litora lacinia primis fames morbi natoque, quisque ante duis
        phasellus pharetra convallis montes felis. Consectetur leo suspendisse fringilla elementum
        maecenas massa urna malesuada auctor senectus, pretium turpis nisi orci ipsum vulputate
        cubilia sociis adipiscing. Vulputate ridiculus amet dis accumsan non ultrices fames mattis
        hendrerit, ornare elementum sociosqu eget consectetur duis viverra vivamus tincidunt,
        blandit nulla porta semper dolor pharetra nisi scelerisque. Consequat conubia porta cras et
        ac auctor pellentesque luctus morbi potenti, viverra varius commodo venenatis vestibulum
        erat sagittis laoreet.
      </p>
    </div>
  );
}
