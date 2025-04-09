import { ArrowPrimitive as Arrow } from 'radix-ui/internal';

export default { title: 'Utilities/Arrow' };

const RECOMMENDED_CSS__ARROW__ROOT = {
  // better default alignment
  verticalAlign: 'middle',
};

export const Styled = () => (
  <Arrow.Root style={{ ...RECOMMENDED_CSS__ARROW__ROOT, fill: 'crimson' }} width={20} height={10} />
);

export const CustomSizes = () => (
  <>
    <Arrow.Root style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={40} height={10} />
    <Arrow.Root style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={50} height={30} />
    <Arrow.Root style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={20} height={100} />
  </>
);

export const CustomArrow = () => (
  <Arrow.Root asChild>
    <div
      style={{
        width: 20,
        height: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'tomato',
      }}
    />
  </Arrow.Root>
);
