import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  ArrowLeft, 
  Play, 
  Award, 
  Compass,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';

const Hero = ({
  level = "مبتدئ إلى متقدم",
  title = "الزراعة الرقمية",
  description = "تخصص يجمع بين الزراعة الدقيقة ونظم المعلومات الجغرافية والاستشعار عن بعد وتحليل البيانات لاتخاذ قرارات حقلية مبنية على أرقام حقيقية. من أسرع المجالات نموًا في شركات الزراعة الحديثة.",
  marketDemand = "عالي جداً",
  rating = 5,
  progress = 25,
  modules = [],
  onStartLearning,
}) => {
  const defaultStages = [
    { title: 'أساسيات الزراعة الدقيقة', desc: 'المفاهيم الميدانية وأجهزة الاستشعار IoT', active: true },
    { title: 'نظم المعلومات الجغرافية GIS', desc: 'تحليل الخرائط وتحديد الاحتياجات الحقلية', active: false },
    { title: 'الاستشعار عن بعد والأقمار', desc: 'مؤشرات NDVI والصحة النباتية المتقدمة', active: false },
    { title: 'تحليل البيانات والقرارات الذكية', desc: 'النماذج التنبؤية وإدارة المحاصيل بدقة', active: false },
  ];

  const displayStages = modules && modules.length > 0 
    ? modules.map((m, idx) => ({ title: m.title, desc: m.desc, active: m.completed || idx === 0 }))
    : defaultStages;

  return (
    <section className="relative overflow-hidden bg-[#f5f8f1] py-8 lg:py-12 text-right" dir="rtl">
      {/* Background Glow & Patterns */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 h-96 w-96 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(20,83,45,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>المستوى: {level}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-600/20 bg-lime-50/80 px-3 py-1.5 text-xs sm:text-sm font-semibold text-lime-900">
                <Sparkles className="h-3.5 w-3.5 text-lime-600" />
                <span>مسار تعليمي معتمد</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-emerald-950 leading-[1.25]">
              {title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl font-normal">
              {description}
            </p>

            {/* Market Demand & Ratings */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white/80 p-4 backdrop-blur-sm shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-500">الطلب فى السوق</span>
                  <span className="text-sm font-bold text-emerald-900">{marketDemand}</span>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">({rating}.0 / 5)</span>
              </div>
            </div>

            {/* Actions: Start & Continue */}
            <div className="roadmap-hero-bottom flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStartLearning}
                className="group inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:bg-emerald-800 hover:shadow-emerald-700/30 active:scale-[0.98] cursor-pointer"
              >
                <span>ابدأ الآن</span>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onStartLearning}
                className="group inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-emerald-700/20 bg-white/80 px-7 py-3.5 text-center text-sm font-bold text-emerald-900 backdrop-blur-sm transition-all hover:bg-white hover:border-emerald-700/40 active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-emerald-800 text-emerald-800" />
                <span>اكمل تعلم</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md rounded-2xl border border-emerald-900/10 bg-white/80 p-4 shadow-xs backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-700">معدل الإنجاز</span>
                <span className="text-emerald-700 font-extrabold">التقدم {progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100/70">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-emerald-600 to-lime-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progress, 0)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {progress === 0
                  ? 'لم تبدأ بعد، ابدأ أول خطوة لبناء مسارك الاحترافي!'
                  : `أحسنت! أنجزت ${progress}% من محتوى هذا المسار`}
              </p>
            </div>

          </div>

          {/* Side Visual Card / Highlights */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-base">نظرة عامة على الخريطة</h3>
                    <p className="text-xs text-slate-500">المحطات الرئيسية للمسار</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  {displayStages.length} مراحل
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {displayStages.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                      item.active
                        ? 'bg-emerald-50/80 border border-emerald-600/20'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        item.active
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-emerald-950">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-950 p-4 text-emerald-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-300 font-medium">شهادة إتمام معتمدة</p>
                  <p className="text-sm font-bold mt-0.5">جاهزية لسوق العمل الزراعي الحديث</p>
                </div>
                <Award className="h-8 w-8 text-lime-400 shrink-0 mr-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
