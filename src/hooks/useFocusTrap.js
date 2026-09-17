import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessibility helper for modal dialogs.
 *
 * While `isOpen` is true it:
 *  - remembers the element that had focus before the modal opened,
 *  - moves focus into the modal (its first focusable element),
 *  - traps Tab/Shift+Tab focus cycling within the modal,
 *  - closes the modal when Escape is pressed,
 *  - restores focus to the triggering element when the modal closes.
 *
 * Returns a ref that must be attached to the modal's outermost content
 * element (the element with role="dialog").
 */
export function useFocusTrap(isOpen, onClose) {
  const containerRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    const focusFirst = () => {
      const container = containerRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
      (focusable[0] || container).focus();
    };
    // Defer to the next tick so the (animated) dialog content has mounted.
    const focusTimer = setTimeout(focusFirst, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
}
