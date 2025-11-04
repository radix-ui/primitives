import * as Direction from '@repo/test-registry/components/direction';

export default function Page() {
  return (
    <div style={{ width: '400px', maxWidth: '100%' }}>
      <Direction.Basic dir="ltr" />
      <Direction.Basic dir="rtl" />
    </div>
  );
}
