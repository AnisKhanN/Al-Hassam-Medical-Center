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
        <div className="flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
            <FiCheck size={14} /> {value.name}{" "}
            <span className="text-blue-500 dark:text-blue-400 text-xs font-mono">({value.medicineId})</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <FiSearch className="text-slate-400 dark:text-slate-500 shrink-0" size={14} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search medicine by name or ID..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
          />
        </div>
      )}

      {open && !value && (query || loading) && (
        <div className="absolute z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-md">
          {loading && (
            <p className="px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500">Searching formulary...</p>
          )}
          {!loading && results.length === 0 && query && (
            <p className="px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500">
              No medicines found matching query.
            </p>
          )}
          {results.map((m) => (
            <button
              key={m._id}
              type="button"
              onClick={() => select(m)}
              disabled={m.totalStock === 0}
              className="flex w-full flex-col items-start px-3.5 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/60 last:border-0 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                {m.medicineId} · Rs. {m.unitPrice} ·{" "}
                <span className={m.totalStock === 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400 font-semibold"}>
                  {m.totalStock === 0 ? "Out of stock" : `${m.totalStock} in stock`}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineSearchSelect;
