---
'@radix-ui/react-slider': minor
'radix-ui': minor
---

Add unstable `ThumbProvider`, `ThumbTrigger`, and `BubbleInput` parts to Slider. `SliderThumb` was previously a single component that implicitly rendered a hidden native input for form submission. It is now composed from these new parts, which are exposed so consumers can decouple the bubble input from the thumb (for example, to render or customize it independently) instead of relying on `SliderThumb` to render it implicitly. `SliderThumb` continues to render all three by default, so existing usage is unaffected.
