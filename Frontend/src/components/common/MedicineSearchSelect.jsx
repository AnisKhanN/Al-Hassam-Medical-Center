import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";
import api from "../../api/axios";

const MedicineSearchSelect = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    api
      .get("/medicines", { params: { search: q, limit: 8 } })
      .then(({ data }) => setResults(data.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const select = (medicine) => {
    onChange(medicine);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      {value ? (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 text-blue-700">
            <FiCheck size={14} /> {value.name}{" "}
            <span className="text-blue-400">({value.medicineId})</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-blue-500 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
          <FiSearch className="text-slate-400" size={14} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search medicine by name or ID..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      )}

      {open && !value && (query || loading) && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-100 bg-white shadow-lg">
          {loading && (
            <p className="px-3 py-2 text-xs text-slate-400">Searching...</p>
          )}
          {!loading && results.length === 0 && query && (
            <p className="px-3 py-2 text-xs text-slate-400">
              No medicines found.
            </p>
          )}
          {results.map((m) => (
            <button
              key={m._id}
              type="button"
              onClick={() => select(m)}
              disabled={m.totalStock === 0}
              className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="font-medium text-slate-700">{m.name}</span>
              <span className="text-xs text-slate-400">
                {m.medicineId} · Rs. {m.unitPrice} ·{" "}
                {m.totalStock === 0
                  ? "Out of stock"
                  : `${m.totalStock} in stock`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineSearchSelect;
