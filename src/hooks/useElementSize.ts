import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Hook for measuring the size of a DOM element and tracking its changes.
 * Needed for adaptive layout of the tree view.
 * @returns [ref, size] - Ref to attach to the element and current element size
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T>,
  ElementSize
] {
  const elementRef = useRef<T>(null) as RefObject<T>;
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, []);

  return [elementRef, size];
}
