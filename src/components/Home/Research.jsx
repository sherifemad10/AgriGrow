import { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, GraduationCap, Filter, AlertCircle, Sparkles, BookOpen } from "lucide-react";

import ResearchCard from "../../UI/ResearchCard";
import ResearchModal from "../../UI/ResearchModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fields = [
  "all",
  "أراضي ومياه",
  "زراعة رقمية",
  "زراعة مائية",
  "إنتاج نباتي",
  "وقاية وأمراض نبات",
  "هندسة زراعية",
  "اقتصاد وإدارة زراعية",
];

const yearOptions = [
  { label: "آخر 3 سنوات (2024 - 2026)", value: "3" },
  { label: "آخر سنتين (2025 - 2026)", value: "2" },
  { label: "السنة الحالية (2026)", value: "1" },
];

const Research = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedYear, setSelectedYear] = useState("3");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  const fetchResearch = useCallback(
    async (currentPage = 1, field = selectedField, year = selectedYear, query = activeQuery) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          year,
          field,
          query,
          page: currentPage.toString(),
          perPage: "12",
        });

        const response = await fetch(`${API_URL}/research?${params}`);

        if (!response.ok) {
          throw new Error("فشل الاتصال بخادم الأبحاث.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "تعذر تحميل البيانات.");
        }

        if (currentPage === 1) {
          setPapers(result.data);
        } else {
          setPapers((previous) => [...previous, ...result.data]);
        }

        setHasMore(result.pagination.hasMore);
        setTotalFound(result.pagination.total || result.data.length);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("حدث خطأ أثناء تحميل الأبحاث. تأكد من تشغيل خادم الـ Backend على المنفذ 5000.");
      } finally {
        setLoading(false);
      }
    },
    [selectedField, selectedYear, activeQuery]
  );

  useEffect(() => {
    setPage(1);
    fetchResearch(1, selectedField, selectedYear, activeQuery);
  }, [selectedField, selectedYear, activeQuery, fetchResearch]);

  const handleFieldChange = (field) => {
    setSelectedField(field);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
    setPage(1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchResearch(1, selectedField, selectedYear, activeQuery);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResearch(nextPage, selectedField, selectedYear, activeQuery);
  };

  return (
    <>
      <section
        id="research"
        className="relative scroll-mt-24 overflow-hidden bg-[#f5f8f1] py-16 text-right sm:py-24"
      >
        {/* Subtle decorative background circles */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent blur-3xl opacity-70" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-800 shadow-sm border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>مُحدث حي ومباشر من Google Scholar & OpenAlex</span>
            </span>

            <h2 className="mt-4 text-3xl font-black text-emerald-950 sm:text-4xl lg:text-5xl">
              أحدث الأبحاث والدراسات الزراعية
            </h2>

            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              اكتشف وتصفح أحدث الأبحاث العلمية الزراعية المنشورة خلال آخر 3 سنوات أولاً بأول، مع ملخصات ذكية بالعربية، أهم النتائج العملية، وروابط مباشرة للبحث الأصلي على Google Scholar.
            </p>
          </div>

          {/* Search & Filter Controls Card */}
          <div className="mb-10 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <div className="relative flex items-center">
                  <Search className="absolute right-4 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالكلمات المفتاحية (مثال: الري الحديث، القمح، Soil, Hydroponics)..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-11 pl-24 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                  <div className="absolute left-2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="rounded-lg p-1.5 text-xs font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      >
                        إلغاء
                      </button>
                    )}
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      بحث
                    </button>
                  </div>
                </div>
              </form>

              {/* Year Dropdown & Refresh */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2">
                  <Filter className="h-4 w-4 text-emerald-700" />
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    {yearOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                  title="تحديث الأبحاث الآن"
                >
                  <RefreshCw className={`h-4 w-4 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">تحديث</span>
                </button>
              </div>
            </div>

            {/* Field Category Pills */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="mb-3 text-xs font-extrabold text-slate-500">التخصصات الزراعية:</p>
              <div className="flex flex-wrap gap-2">
                {fields.map((field) => {
                  const active = selectedField === field;
                  return (
                    <button
                      key={field}
                      onClick={() => handleFieldChange(field)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                        active
                          ? "bg-emerald-700 text-white shadow-md scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {field === "all" ? "كل التخصصات" : field}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Metadata Bar */}
          {!loading && !error && papers.length > 0 && (
            <div className="mb-6 flex items-center justify-between text-xs font-bold text-slate-500 px-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-700" />
                <span>تم إدراج {papers.length} من أصل {totalFound} بحثًا علميًا حديثًا</span>
              </span>

              <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <GraduationCap className="h-4 w-4" />
                <span>مصنفة ومفهرسة من Google Scholar</span>
              </span>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="mb-8 flex items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-600 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Initial Loading Skeletons */}
          {loading && papers.length === 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[320px] animate-pulse rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm"
                >
                  <div className="h-5 w-24 rounded-full bg-slate-200" />
                  <div className="mt-4 h-6 w-5/6 rounded-lg bg-slate-200" />
                  <div className="mt-2 h-6 w-3/4 rounded-lg bg-slate-200" />
                  <div className="mt-6 h-16 w-full rounded-xl bg-slate-100" />
                  <div className="mt-6 h-4 w-1/2 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && papers.length === 0 && !error && (
            <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                🔎
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-emerald-950">
                لم نجد أبحاثًا مطابقة للتصفية الحالية
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                جرب البحث بكلمات مفتاحية أخرى أو اختيار تخصص آخر.
              </p>
              <button
                onClick={() => {
                  setSelectedField("all");
                  setSearchQuery("");
                  setActiveQuery("");
                }}
                className="mt-6 rounded-2xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
              >
                إعادة ضبط التصفية
              </button>
            </div>
          )}

          {/* Research Papers Grid */}
          {papers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {papers.map((paper) => (
                <ResearchCard
                  key={paper.id}
                  {...paper}
                  onClick={() => setSelectedResearch(paper)}
                />
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && papers.length > 0 && (
            <div className="mt-10 text-center text-sm font-bold text-emerald-700 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />
              <span>جاري تحميل الأبحاث التالية من Google Scholar...</span>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl active:scale-95"
              >
                <span>تحميل المزيد من الأبحاث</span>
                <span>↓</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Paper Modal */}
      <ResearchModal
        research={selectedResearch}
        onClose={() => setSelectedResearch(null)}
      />
    </>
  );
};

export default Research;