import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";

const SmoothScrollContext = createContext({
  scrollTo: () => {},
  scrollY: 0,
  progress: 0,
  isScrolling: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Sheryians-grade Momentum Smooth Scroll Provider
 * Implements Lenis-style inertial dampening and lerp interpolation
 * without external dependencies, with zero layout shift and 0% idle CPU.
 */
export const SmoothScrollProvider = ({
  children,
  ease = 0.085, // Sheryians / Lenis signature weighty glide ease
  friction = 0.92,
}) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [scrollYState, setScrollYState] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Physics state refs to avoid React render cycle overhead in RAF
  const targetY = useRef(0);
  const currentY = useRef(0);
  const isRunning = useRef(false);
  const rafId = useRef(null);
  const isTouchDevice = useRef(false);

  // Clamp helper
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const getMaxScroll = () => {
    return Math.max(
      0,
      (document.documentElement.scrollHeight || document.body.scrollHeight) -
        window.innerHeight,
    );
  };

  const updateScrollRef = useRef();

  // Main animation frame loop
  const updateScroll = useCallback(() => {
    const maxScroll = getMaxScroll();
    targetY.current = clamp(targetY.current, 0, maxScroll);

    const diff = targetY.current - currentY.current;

    // Check if we have arrived close enough to target
    if (Math.abs(diff) > 0.4) {
      currentY.current += diff * ease;
      window.scrollTo(0, currentY.current);

      const calculatedProgress =
        maxScroll > 0 ? clamp(currentY.current / maxScroll, 0, 1) : 0;
      setProgress(calculatedProgress);
      setScrollYState(currentY.current);

      rafId.current = requestAnimationFrame(() => {
        if (updateScrollRef.current) updateScrollRef.current();
      });
    } else {
      // Settle precisely on target
      currentY.current = targetY.current;
      window.scrollTo(0, currentY.current);
      const calculatedProgress =
        maxScroll > 0 ? clamp(currentY.current / maxScroll, 0, 1) : 0;
      setProgress(calculatedProgress);
      setScrollYState(currentY.current);
      isRunning.current = false;
      setIsScrolling(false);
    }
  }, [ease]);

  useEffect(() => {
    updateScrollRef.current = updateScroll;
  }, [updateScroll]);

  const startLoop = useCallback(() => {
    if (!isRunning.current) {
      isRunning.current = true;
      setIsScrolling(true);
      rafId.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  // Programmatic smooth scroll to a target element or offset
  const scrollTo = useCallback(
    (target, { offset = -75, duration = 800 } = {}) => {
      let targetPosition = 0;

      if (typeof target === "number") {
        targetPosition = target;
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const rect = el.getBoundingClientRect();
          targetPosition = rect.top + window.scrollY + offset;
        } else {
          return;
        }
      } else if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        targetPosition = rect.top + window.scrollY + offset;
      }

      const maxScroll = getMaxScroll();
      targetY.current = clamp(targetPosition, 0, maxScroll);
      startLoop();
    },
    [startLoop],
  );

  // Wheel event interceptor
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Initialize positions with current window scroll
    currentY.current = window.scrollY;
    targetY.current = window.scrollY;

    const onWheel = (e) => {
      // Allow internal scrolling elements (e.g. modals, codeblocks, dropdowns, tables)
      const target = e.target;
      if (
        target.closest(
          '[data-lenis-prevent], [data-scroll-prevent], .overflow-y-auto, .overflow-y-scroll, textarea, select, pre',
        )
      ) {
        // If element can scroll internally, don't intercept
        const scrollable = target.closest(
          '.overflow-y-auto, .overflow-y-scroll, textarea, [data-scroll-prevent]',
        );
        if (
          scrollable &&
          scrollable.scrollHeight > scrollable.clientHeight &&
          scrollable !== document.documentElement &&
          scrollable !== document.body
        ) {
          return;
        }
      }

      e.preventDefault();

      // Normalize delta
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        deltaY *= 38; // Line mode (Firefox)
      } else if (e.deltaMode === 2) {
        deltaY *= window.innerHeight; // Page mode
      }

      // Distinguish trackpads from notched mouse wheels
      // Trackpads typically produce small continuous deltas, notched wheels send ~100px
      const isMouseWheel = Math.abs(deltaY) >= 50;
      const multiplier = isMouseWheel ? 1.15 : 0.85;

      targetY.current += deltaY * multiplier;
      const maxScroll = getMaxScroll();
      targetY.current = clamp(targetY.current, 0, maxScroll);

      startLoop();
    };

    // Keyboard navigation support (ArrowUp, ArrowDown, PageUp, PageDown, Space, Home, End)
    const onKeyDown = (e) => {
      // Don't hijack if user is typing in an input or textarea
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) ||
        e.target.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      let scrollIncrement;

      if (key === "ArrowDown") scrollIncrement = 120;
      else if (key === "ArrowUp") scrollIncrement = -120;
      else if (key === "PageDown" || (key === " " && !e.shiftKey))
        scrollIncrement = window.innerHeight * 0.85;
      else if (key === "PageUp" || (key === " " && e.shiftKey))
        scrollIncrement = -window.innerHeight * 0.85;
      else if (key === "Home") {
        e.preventDefault();
        targetY.current = 0;
        startLoop();
        return;
      } else if (key === "End") {
        e.preventDefault();
        targetY.current = getMaxScroll();
        startLoop();
        return;
      } else {
        return;
      }

      e.preventDefault();
      targetY.current += scrollIncrement;
      targetY.current = clamp(targetY.current, 0, getMaxScroll());
      startLoop();
    };

    // Native scroll sync (e.g. if user drags scrollbar directly)
    const onScroll = () => {
      if (!isRunning.current) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
        const maxScroll = getMaxScroll();
        const calculatedProgress =
          maxScroll > 0 ? clamp(currentY.current / maxScroll, 0, 1) : 0;
        setProgress(calculatedProgress);
        setScrollYState(currentY.current);
      }
    };

    // Touch event handling for mobile devices
    let touchStartY = 0;
    const onTouchStart = (e) => {
      isTouchDevice.current = true;
      touchStartY = e.touches[0].clientY;
      currentY.current = window.scrollY;
      targetY.current = window.scrollY;
    };

    const onTouchMove = (e) => {
      // Let native touch scroll take over for mobile devices with hardware acceleration
      currentY.current = window.scrollY;
      targetY.current = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [startLoop]);

  // Reset scroll to top on route navigation
  useEffect(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isRunning.current = false;
    currentY.current = 0;
    targetY.current = 0;
    window.scrollTo(0, 0);
    setProgress(0);
    setScrollYState(0);
    setIsScrolling(false);
  }, [location.pathname]);

  return (
    <SmoothScrollContext.Provider
      value={{
        scrollTo,
        scrollY: scrollYState,
        progress,
        isScrolling,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
