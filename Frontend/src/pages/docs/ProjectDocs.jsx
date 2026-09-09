import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiShield,
  FiDownload,
  FiCopy,
  FiCheck,
  FiPrinter,
  FiSearch,
  FiActivity,
  FiArrowLeft,
  FiExternalLink,
  FiBookOpen,
  FiCode,
  FiServer,
  FiCpu,
  FiDatabase,
  FiCheckCircle,
} from "react-icons/fi";
import ThemeToggle from "../../components/common/ThemeToggle";
import useSEO from "../../hooks/useSEO";

const REPORTS = {
  project: {
    id: "project",
    title: "FYP Technical Report",
    filename: "PROJECT_REPORT.md",
    badge: "BSIT Final Year Project",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: FiFileText,
    url: "/PROJECT_REPORT.md",
    apiUrl: "/api/reports/docs/project-report?download=true",
    description:
      "Comprehensive 10-section technical specification covering EHR, FEFO inventory, Gemini AI, WebRTC, database architecture, and viva defense talking points.",
  },
  rbac: {
    id: "rbac",
    title: "RBAC Security Audit Report",
    filename: "RBAC_AUDIT_REPORT.md",
    badge: "Security & Authorization Audit",
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    icon: FiShield,
    url: "/RBAC_AUDIT_REPORT.md",
    apiUrl: "/api/reports/docs/rbac-audit?download=true",
    description:
      "Comprehensive role-based access control audit covering all 4 tiers (Admin, Doctor, Receptionist, Pharmacist), HTTP 200/403 matrices, and live test logs.",
  },
};

export default function ProjectDocs() {
  const [activeReportKey, setActiveReportKey] = useState("project");
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const activeReport = REPORTS[activeReportKey] || REPORTS.project;

  useSEO({
    title: `${activeReport.title} — SmartClinic FYP Documentation`,
    description: activeReport.description,
  });

  // Fetch report markdown content
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchReport = async () => {
      try {
        // Attempt fast static public fetch first, fallback to backend API
        let text = "";
        try {
          const res = await fetch(activeReport.url);
          if (res.ok) {
            text = await res.text();
          }
        } catch {
          // Fall back to backend API if static fetch fails
        }

        if (!text) {
          const apiRes = await fetch(
            activeReport.apiUrl.replace("?download=true", ""),
          );
          if (apiRes.ok) {
            const data = await apiRes.json();
            text = data.data?.content || "";
          }
        }

        if (!text) {
          throw new Error(
            "Unable to load documentation content. Please try downloading directly.",
          );
        }

        if (isMounted) {
          setMarkdownContent(text);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [activeReportKey]);

  // Copy raw markdown to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  // Direct download handler
  const handleDownload = (report) => {
    const link = document.createElement("a");
    link.href = report.url;
    link.download = report.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extract table of contents headings (H2 & H3)
  const headings = useMemo(() => {
    if (!markdownContent) return [];
    const lines = markdownContent.split("\n");
    const result = [];
    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const text = h2Match[1].replace(/[#*`]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        result.push({ level: 2, text, id });
      } else if (h3Match) {
        const text = h3Match[1].replace(/[#*`]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        result.push({ level: 3, text, id });
      }
    });
    return result;
  }, [markdownContent]);

  // Filter content based on search query
  const displayLines = useMemo(() => {
    if (!markdownContent) return [];
    const lines = markdownContent.split("\n");
    if (!searchQuery.trim()) return lines;

    const query = searchQuery.toLowerCase();
    // Return all lines with context around matches, or highlight
    return lines;
  }, [markdownContent, searchQuery]);

  // Lightweight custom markdown parser for responsive visual reading
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = "";
    let inTable = false;
    let tableRows = [];

    const flushTable = (key) => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(2); // Skip separator row

        elements.push(
          <div
            key={`table-${key}`}
            className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900/80 font-bold text-slate-800 dark:text-slate-200">
                <tr>
                  {headerRow.map((cell, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-bold tracking-wider"
                    >
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {renderInlineMarkdown(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        tableRows = [];
        inTable = false;
      }
    };

    const flushCodeBlock = (key) => {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${key}`}
            className="my-5 rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-md"
          >
            {codeLanguage && (
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider">
                  {codeLanguage}
                </span>
                <span>Code Block</span>
              </div>
            )}
            <pre className="leading-relaxed">
              <code>{codeContent.join("\n")}</code>
            </pre>
          </div>,
        );
        inCodeBlock = false;
        codeContent = [];
        codeLanguage = "";
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks ```
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock(i);
        } else {
          flushTable(i);
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Tables
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        inTable = true;
        continue;
      } else if (inTable) {
        flushTable(i);
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={i}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3"
          >
            {renderInlineMarkdown(line.slice(2))}
          </h1>,
        );
        continue;
      }
      if (line.startsWith("## ")) {
        const title = line.slice(3);
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        elements.push(
          <h2
            key={i}
            id={id}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-7 mb-3 scroll-mt-24 flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
            <span>{renderInlineMarkdown(title)}</span>
          </h2>,
        );
        continue;
      }
      if (line.startsWith("### ")) {
        const title = line.slice(4);
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        elements.push(
          <h3
            key={i}
            id={id}
            className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2 scroll-mt-24"
          >
            {renderInlineMarkdown(title)}
          </h3>,
        );
        continue;
      }

      // Horizontal rule
      if (line.trim() === "---" || line.trim() === "***") {
        elements.push(
          <hr
            key={i}
            className="my-8 border-slate-200 dark:border-slate-800"
          />,
        );
        continue;
      }

      // Blockquote / Alerts
      if (line.startsWith("> ")) {
        elements.push(
          <div
            key={i}
            className="my-3 pl-4 py-2 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 rounded-r-xl text-slate-700 dark:text-slate-300 italic text-sm"
          >
            {renderInlineMarkdown(line.slice(2))}
          </div>,
        );
        continue;
      }

      // Checklists
      if (line.trim().startsWith("- [x]") || line.trim().startsWith("- [ ]")) {
        const checked = line.includes("- [x]");
        const text = line.replace(/-\s+\[[ x]\]/, "").trim();
        elements.push(
          <div key={i} className="flex items-start gap-2.5 my-1.5 text-sm">
            {checked ? (
              <FiCheckCircle
                className="text-emerald-500 mt-0.5 shrink-0"
                size={16}
              />
            ) : (
              <span className="h-4 w-4 rounded border border-slate-300 dark:border-slate-700 mt-0.5 shrink-0 inline-block" />
            )}
            <span
              className={
                checked
                  ? "text-slate-800 dark:text-slate-200 font-medium"
                  : "text-slate-500"
              }
            >
              {renderInlineMarkdown(text)}
            </span>
          </div>,
        );
        continue;
      }

      // Unordered list
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        elements.push(
          <li
            key={i}
            className="ml-5 list-disc text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed"
          >
            {renderInlineMarkdown(line.trim().slice(2))}
          </li>,
        );
        continue;
      }

      // Numbered list
      const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numMatch) {
        elements.push(
          <div
            key={i}
            className="flex items-start gap-2.5 my-1.5 text-sm text-slate-700 dark:text-slate-300"
          >
            <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
              {numMatch[1]}.
            </span>
            <span>{renderInlineMarkdown(numMatch[2])}</span>
          </div>,
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        continue;
      }

      // Standard paragraph
      elements.push(
        <p
          key={i}
          className="text-sm text-slate-700 dark:text-slate-300 my-2.5 leading-relaxed"
        >
          {renderInlineMarkdown(line)}
        </p>,
      );
    }

    flushTable(lines.length);
    flushCodeBlock(lines.length);

    return elements;
  };

  // Inline formatting helper (bold, code, links)
  const renderInlineMarkdown = (content) => {
    if (!content) return "";

    // Highlight search match
    if (
      searchQuery.trim() &&
      content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      const parts = content.split(new RegExp(`(${searchQuery})`, "gi"));
      return parts.map((part, idx) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark
            key={idx}
            className="bg-amber-200 dark:bg-amber-900/80 text-slate-900 dark:text-amber-100 rounded px-1"
          >
            {part}
          </mark>
        ) : (
          renderFormatting(part)
        ),
      );
    }

    return renderFormatting(content);
  };

  const renderFormatting = (text) => {
    // Basic bold **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 font-mono text-[12px] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <FiArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-sm">
                <FiActivity size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                  SmartClinic
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 ml-2 uppercase tracking-wider hidden sm:inline">
                  Documentation Hub
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Theme */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 text-xs shadow-sm transition-all"
            >
              <span>Staff Login</span>
              <FiExternalLink size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  BSIT Final Year Project (FYP)
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-[11px] font-bold">
                  🟢 100% Operational &amp; Passing
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                SmartClinic Technical Reports &amp; Documentation Center
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Authored by{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  Anis Khan Niazi
                </strong>
                . Dedicated to outpatient clinics, community healthcare
                facilities, and pharmacies in Sanghar &amp; Interior Sindh,
                Pakistan.
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3 shadow-xs text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  Codebase
                </p>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  21.9k LOC
                </p>
                <p className="text-[9px] text-slate-500">171 Total Files</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3 shadow-xs text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  Automated Tests
                </p>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  12 / 12 (100%)
                </p>
                <p className="text-[9px] text-slate-500">Passing Suites</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3 shadow-xs text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  RBAC Tiers
                </p>
                <p className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                  4 Staff Roles
                </p>
                <p className="text-[9px] text-slate-500">Zero Leakage</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3 shadow-xs text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  AI Model
                </p>
                <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                  Gemini 1.5
                </p>
                <p className="text-[9px] text-slate-500">Trilingual Slips</p>
              </div>
            </div>
          </div>

          {/* Tab Selector & Action Toolbar */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
            {/* Report Tabs */}
            <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              {Object.values(REPORTS).map((report) => {
                const Icon = report.icon;
                const isActive = activeReportKey === report.id;
                return (
                  <button
                    key={report.id}
                    onClick={() => setActiveReportKey(report.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{report.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleDownload(activeReport)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 text-xs shadow-sm transition-all"
                title={`Download ${activeReport.filename}`}
              >
                <FiDownload size={14} />
                <span>Download .md</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="Copy markdown text to clipboard"
              >
                {copied ? (
                  <FiCheck className="text-emerald-500" size={14} />
                ) : (
                  <FiCopy size={14} />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="Print or Save as PDF"
              >
                <FiPrinter size={14} />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar / Table of Contents (Sticky on Desktop) */}
          <aside className="lg:col-span-1 space-y-6 print:hidden">
            {/* Search Filter */}
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search in report..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Document Info Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${activeReport.badgeColor}`}
                >
                  {activeReport.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {activeReport.filename}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeReport.description}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>File Format:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  Markdown (.md)
                </span>
              </div>
            </div>

            {/* Table of Contents Navigation */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5 shadow-xs max-h-[60vh] overflow-y-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Table of Contents
              </p>
              <nav className="space-y-1 text-xs">
                {headings.map((h, i) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    className={`block truncate py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                      h.level === 3
                        ? "pl-3 text-[11px] text-slate-500 dark:text-slate-500"
                        : "font-semibold"
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Main Viewer (Markdown Article) */}
          <article
            ref={contentRef}
            className="lg:col-span-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0"
          >
            {loading ? (
              <div className="py-24 text-center space-y-3">
                <div className="h-8 w-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-500">
                  Loading documentation report...
                </p>
              </div>
            ) : error ? (
              <div className="p-8 text-center space-y-4">
                <p className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                  {error}
                </p>
                <button
                  onClick={() => handleDownload(activeReport)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-bold px-4 py-2 text-xs"
                >
                  <FiDownload size={14} />
                  <span>Download {activeReport.filename} directly</span>
                </button>
              </div>
            ) : (
              <div className="markdown-body">
                {renderMarkdown(markdownContent)}
              </div>
            )}
          </article>
        </div>
      </main>

      {/* Floating Back to Top or Quick Download Bar for Mobile */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center gap-2 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-xl">
        <button
          onClick={() => handleDownload(activeReport)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold py-2.5 text-xs"
        >
          <FiDownload size={14} />
          <span>Download {activeReport.filename}</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-xl bg-slate-800 text-slate-200 p-2.5 text-xs font-bold"
          title="Scroll to Top"
        >
          Top ↑
        </button>
      </div>
    </div>
  );
}
