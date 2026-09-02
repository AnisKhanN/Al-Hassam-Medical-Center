const StockBadge = ({ totalStock = 0, isLowStock = false }) => {
  if (totalStock <= 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
        Out of Stock (0)
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        Low Stock ({totalStock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      In Stock ({totalStock})
    </span>
  );
};

export default StockBadge;
