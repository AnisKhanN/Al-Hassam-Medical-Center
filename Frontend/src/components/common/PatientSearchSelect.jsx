import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";
import api from "../../api/axios";

const PatientSearchSelect = ({ value, onChange }) => {
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
      .get("/patients", { params: { search: q, limit: 8 } })
      .then(({ data }) => setResults(data.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300); // debounced — no query per keystroke
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const select = (patient) => {
    onChange(patient);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
            <FiCheck size={14} /> {value.fullName}{" "}
            <span className="text-blue-500 dark:text-blue-400 text-xs font-mono">({value.patientId})</span>
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
            placeholder="Search patient by name, phone, or ID..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
          />
        </div>
      )}

      {open && !value && (query || loading) && (
        <div className="absolute z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-md">
          {loading && (
            <p className="px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500">Searching directory...</p>
          )}
          {!loading && results.length === 0 && query && (
            <p className="px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500">
              No patients found matching query.
            </p>
          )}
          {results.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => select(p)}
              className="flex w-full flex-col items-start px-3.5 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/60 last:border-0 transition-colors cursor-pointer"
            >
              <span className="font-semibold text-slate-800 dark:text-slate-200">{p.fullName}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                {p.patientId} · {p.phone || "No phone"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearchSelect;
