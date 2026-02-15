import * as Popper from '@repo/test-registry/components/popper';

export default function Page() {
  return (
    <div>
      <Popper.Basic />
      <hr />
      <Popper.WithCustomArrow />
      <hr />
      <Popper.WithPortal />
      <hr />
      <Popper.WithUpdatePositionStrategyAlways />
    </div>
  );
}
