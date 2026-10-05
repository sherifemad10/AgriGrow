import { ExternalLink, BookOpen, GraduationCap, FileText } from "lucide-react";

const ResearchCard = ({
  title,
  year,
  dateFormatted,
  field,
  authors,
  journal,
  abstract,
  citedBy,
  googleScholarUrl,
  originalUrl,
  pdfUrl,
  onClick,
}) => {
  const shortAbstract =
    abstract && abstract.length > 170
      ? `${abstract.slice(0, 170)}...`
      : abstract;

  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl cursor-pointer"
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
            {field || "علوم زراعية"}
          </span>

          <span className="text-xs font-bold text-slate-400">
            {dateFormatted || year}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-7 text-emerald-950 transition-colors group-hover:text-emerald-700">
          {title}
        </h3>

        {/* Journal */}
        {journal && (
          <p className="mt-2 text-xs font-semibold text-slate-400 line-clamp-1 flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{journal}</span>
          </p>
        )}

        {/* Abstract snippet */}
        <p className="mt-3.5 line-clamp-3 text-sm leading-6 text-slate-600">
          {shortAbstract || "لا يوجد ملخص نصي مطول متاح لهذا البحث."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
        {/* Authors & Citations */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[170px] font-medium">
            {authors && authors.length > 0
              ? `${authors[0]}${authors.length > 1 ? " وآخرون" : ""}`
              : "باحثون زراعيون"}
          </span>

          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            {citedBy || 0} استشهاد
          </span>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition group-hover:text-emerald-800"
          >
            <span>الملخص والنتائج</span>
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
          </button>

          <div className="flex items-center gap-2">
            {googleScholarUrl && (
              <a
                href={googleScholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="فتح في Google Scholar"
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition"
              >
                <GraduationCap className="h-4 w-4" />
              </a>
            )}

            {originalUrl && (
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="فتح المصدر الأصلي"
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResearchCard;