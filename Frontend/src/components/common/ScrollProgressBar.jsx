import { useSmoothScroll } from "../../hooks/useSmoothScroll";

/**
 * Sheryians-inspired Sleek Top Scroll Progress Bar
 * Displays real-time momentum progress with gradient glow and micro-animation.
 */
const ScrollProgressBar = () => {
  const { progress } = useSmoothScroll();

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] pointer-events-none origin-left"
      aria-hidden="true"
    >
      {/* Glow track */}
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
