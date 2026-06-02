---
'@radix-ui/react-slider': minor
'radix-ui': minor
---

Add an unstable `BubbleInput` part to Slider. This exposes the previously internal per-thumb hidden form input that mirrors each thumb's value for form submission, so consumers can access and recompose it. `SliderThumb` continues to render it by default.
