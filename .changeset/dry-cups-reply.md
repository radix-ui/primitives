---
"@radix-ui/react-avatar": minor
"radix-ui": minor
---

Added a new `mode` prop to `Avatar.Image` to allow for more control over the image rendering.

- `mode="default"` (default): Matches the existing behavior by rendering an `img` element conditionally based on the loading state of an `Image` object constructed after hydration.
- `mode="native"`: Renders an `img` element unconditionally using its event handlers to update loading state. In `native` mode, you can use CSS to target the image element and style it based on its loading state.
  ```tsx
  <Avatar.Root className="image-root">
    <Avatar.Image
      mode="native"
      className="image"
      alt="John Smith"
      src="./avatar.png"
    />
    <Avatar.Fallback className="fallback">
      <AvatarIcon />
    </Avatar.Fallback>
  </Avatar.Root>
  ```
  ```css
  .image-root {
    position: relative;
  }
  .image[data-radix-avatar-loading-status]:not(
      [data-radix-avatar-loading-status="loaded"]
    ) {
    /* hide the element visually until it's loaded to reveal the fallback */
    position: absolute;
    inset: 0;
    opacity: 0;
  }
  ```
- `mode="custom"`: Allows for more control over the image rendering. The `render` prop must be provided to render the image. This mode is useful when you want to use a custom image component, such as framework-specific image components or a design-system implementation that uses non-standard props.

  ```tsx
  <Avatar.Image
    mode="custom"
    className="image"
    alt="John Smith"
    src="./avatar.png"
    render={({ props, ref, context }) => (
      <CustomImage
        {...props}
        ref={ref}
        data-loading-status={context.loadingStatus}
        onLoadingComplete={({ naturalWidth, naturalHeight }) => {
          context.onLoadingStatusChange("loaded");
        }}
        onError={() => {
          context.onLoadingStatusChange("error");
        }}
      />
    )}
  />
  ```
