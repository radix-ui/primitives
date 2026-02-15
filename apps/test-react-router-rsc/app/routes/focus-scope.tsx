import * as FocusScope from '@repo/test-registry/components/focus-scope';

export async function ServerComponent() {
  return (
    <div>
      <FocusScope.Basic />
      <hr />
      <FocusScope.Multiple />
    </div>
  );
}
