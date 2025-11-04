import * as Portal from '@repo/test-registry/components/portal';

export async function ServerComponent() {
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
