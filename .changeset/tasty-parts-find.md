---
"@radix-ui/react-scroll-area": minor
"radix-ui": minor
---

Added a `ScrollArea.Content` part so consumers can own the wrapper element implicitly rendered by `ScrollArea.Viewport`. This must be used with the viewport's `disableImplicitContentElement` prop.

```tsx
<ScrollArea.Root>
  <ScrollArea.Viewport disableImplicitContentElement>
    <ScrollArea.Content>{children}</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar>
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

In the next major release, the content element will no longer be implicitly rendered by the viewport. We recommend migrating to this API today for a smooth upgrade path.
