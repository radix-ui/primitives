---
"@radix-ui/react-focus-guards": patch
"radix-ui": patch
---

Fixed a performance bottleneck where opening an overlay re-scanned the document and re-inserted the focus guards on every mount, forcing a synchronous reflow. The shared guard pair is now cached and only written to the DOM when their edge position actually changes.
