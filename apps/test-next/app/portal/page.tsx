import * as Portal from '@repo/test-registry/components/portal';

export default function Page() {
  return (
    <div>
      <Portal.Basic />
      <br />
      <Portal.Custom />
      <br />
      <Portal.Conditional />
    </div>
  );
}
