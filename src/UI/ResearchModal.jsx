import { useEffect, useState } from "react";
import { GraduationCap, ExternalLink, Download, Sparkles, CheckCircle2, BookOpen, X, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ResearchModal = ({ research, onClose }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!research) return;

    const generateSummary = async () => {
      setLoading(true);
      setError("");
      setSummaryData(null);

      try {
        const response = await fetch(`${API_URL}/research/summarize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: research.title,
            abstract: research.abstract,
            field: research.field,
          }),
        });

        if (!response.ok) {
          throw new Error("تعذر جلب ملخص البحث من الخادم.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "فشل إنشاء ملخص البحث.");
        }

        setSummaryData(result.data);
      } catch (err) {
        console.error("Summary error:", err);
        setError("تعذر إنشاء الملخص الالي. يمكنك الاطلاع على الملخص الأصلي بالأسفل.");
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [research]);

  if (!research) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 text-right border border-emerald-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition shadow-sm"
          title="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-2">
          <span className="rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            {research.field || "علوم زراعية"}
          </span>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            تاريخ النشر: {research.dateFormatted || research.year}
          </span>

          {research.citedBy > 0 && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              {research.citedBy} استشهاد علمي
            </span>
          )}
        </div>

        {/* Paper Title */}
        <h2 className="mt-4 text-xl font-black leading-8 text-emerald-950 sm:text-2xl">
          {research.title}
        </h2>

        {/* Journal & Authors */}
        <div className="mt-4 space-y-1.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm">
          {research.journal && (
            <p className="font-semibold text-emerald-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>المجلة / الناشر: {research.journal}</span>
            </p>
          )}

          {research.authors && research.authors.length > 0 && (
            <p className="text-slate-600 font-medium">
              <strong className="text-slate-700">الباحثون:</strong> {research.authors.join("، ")}
            </p>
          )}
        </div>

        {/* Arabic Summary & Key Findings Box */}
        <div className="mt-6 rounded-3xl border border-emerald-200/90 bg-[#f4f8f1] p-5 sm:p-7 shadow-inner">
          <div className="flex items-center gap-3 border-b border-emerald-200/60 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-emerald-950">
                ملخص البحث وأهم النتائج بالعربية
              </h3>
              <p className="text-xs text-slate-500">
                مبسط وآلي للأبحاث الحديثة من Google Scholar
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mt-6 space-y-3 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />
                <span>جاري تحليل البحث وتوليد الملخص والنتائج...</span>
              </div>
              <div className="h-4 animate-pulse rounded-full bg-emerald-200/60" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-emerald-200/60" />
              <div className="h-4 w-4/6 animate-pulse rounded-full bg-emerald-200/60" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Summary Content */}
          {!loading && !error && summaryData && (
            <div className="mt-5 space-y-6">
              {/* Summary paragraph */}
              <div>
                <h4 className="text-sm font-bold text-emerald-900 mb-2">
                  📌 ملخص الدراسة:
                </h4>
                <p className="text-sm leading-7 text-slate-700 font-medium">
                  {summaryData.summary}
                </p>
              </div>

              {/* Key Findings List */}
              {summaryData.keyFindings && summaryData.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 mb-3">
                    🎯 أهم النتائج والمخرجات العملية:
                  </h4>
                  <ul className="space-y-2.5">
                    {summaryData.keyFindings.map((finding, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm leading-6 text-slate-800 bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-sm"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Significance */}
              {summaryData.significance && (
                <div className="rounded-2xl bg-emerald-100/60 p-4 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-semibold">
                  💡 <strong>الأهمية التطبيقية:</strong> {summaryData.significance}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Original Abstract Collapsible */}
        {research.abstract && (
          <details className="group mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-right transition">
            <summary className="cursor-pointer text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>عرض الملخص الأصلي (Original Abstract)</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-slate-600 border-t border-slate-200 pt-3 dir-ltr text-left font-mono">
              {research.abstract}
            </p>
          </details>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start pt-4 border-t border-slate-100">
          {/* Google Scholar Button */}
          {research.googleScholarUrl && (
            <a
              href={research.googleScholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-800 hover:shadow-xl active:scale-98"
            >
              <GraduationCap className="h-5 w-5" />
              <span>فتح في Google Scholar ↗</span>
            </a>
          )}

          {/* Original DOI / Publisher Link */}
          {research.originalUrl && (
            <a
              href={research.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-700 text-emerald-800 bg-emerald-50/50 px-5 py-3.5 text-sm font-bold transition hover:bg-emerald-100"
            >
              <ExternalLink className="h-4 w-4" />
              <span>البحث الأصلي (DOI) ↗</span>
            </a>
          )}

          {/* PDF Download if available */}
          {research.pdfUrl && (
            <a
              href={research.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 text-slate-700 px-4 py-3.5 text-sm font-bold transition hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              <span>تحميل PDF</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:mr-auto"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchModal;