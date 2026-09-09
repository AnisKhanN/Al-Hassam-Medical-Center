import React from "react";

/**
 * RupeeIcon — Official Pakistani Rupee (PKR / ₨) Icon
 * Replaces dollar signs ($ / FiDollarSign) across SmartClinic with proper regional PKR currency representation.
 */
const RupeeIcon = ({ size = 20, className = "", ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 select-none align-middle ${className}`}
      aria-hidden="true"
      {...props}
    >
      <text
        x="50%"
        y="53%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Inter', sans-serif"
      >
        ₨
      </text>
    </svg>
  );
};

export default RupeeIcon;
export { RupeeIcon };
