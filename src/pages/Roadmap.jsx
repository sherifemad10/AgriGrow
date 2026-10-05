import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Satellite, 
  Droplets, 
  MapPinned, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award,
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import Hero from '../components/Roadmap/Hero';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ICON_MAP = {
  Satellite: Satellite,
  Droplets: Droplets,
  MapPinned: MapPinned,
  ShieldCheck: ShieldCheck,
  BookOpen: BookOpen,
};

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_FALLBACK_MAJORS = [
  {
    id: "digital-agriculture",
    title: "مسار الزراعة الرقمية واستشعار الأقمار والدرونز",
    shortTitle: "الزراعة الرقمية",
    level: "مبتدئ إلى متقدم (Zero to Hero)",
    description: "تخصص يجمع بين الزراعة الدقيقة ونظم المعلومات الجغرافية (GIS) والاستشعار عن بعد عبر الأقمار والدرونز وتحليل البيانات لاتخاذ قرارات حقلية دقيقة مبنية على الأرقام. من أسرع المجالات نموًا في شركات الزراعة الحديثة.",
    marketDemand: "عالي جداً (مطلوب بشدة)",
    rating: 5,
    progress: 25,
    icon: "Satellite",
    color: "emerald",
    skills: ["GIS", "GPS", "الاستشعار عن بعد", "IoT Sensors", "QGIS", "Machine Learning"],
    modules: [
      {
        id: "m1",
        title: "أساسيات الزراعة الدقيقة وإنترنت الأشياء (IoT)",
        desc: "فهم المفاهيم الميدانية، أجهزة الاستشعار اللاسلكية وشبكات LoRaWAN لجمع بيانات التربة والمناخ.",
        duration: "3 أسابيع",
        completed: true,
        skills: ["IoT Sensors", "LoRaWAN", "حساسات الرطوبة"]
      },
      {
        id: "m2",
        title: "نظم المعلومات الجغرافية الزراعية (GIS & GPS)",
        desc: "تحليل الخرائط الرقمية وتحديد الاحتياجات المكانية للتربة والمحصول باستخدام برمجيات QGIS وبرمجيات التظليل.",
        duration: "4 أسابيع",
        completed: false,
        skills: ["QGIS", "خرائط الحقول", "إدارة المتغيرات"]
      },
      {
        id: "m3",
        title: "الاستشعار عن بعد وطائرات الدرونز",
        desc: "معالجة وتحليل صور الأقمار الصناعية Sentinel-2 وحساب مؤشرات صحة المحصول NDVI وSAVI وكشف الإجهاد المبكر.",
        duration: "4 أسابيع",
        completed: false,
        skills: ["Sentinel-2", "NDVI", "UAV Multispectral"]
      },
      {
        id: "m4",
        title: "تحليل البيانات الزراعية والنماذج التنبؤية الذكية",
        desc: "تطبيق خوارزميات التعلم الآلي لتوقع إنتاجية المحصول، ترشيد التسميد، وإدارة الإنذار المبكر للآفات.",
        duration: "3 أسابيع",
        completed: false,
        skills: ["Machine Learning", "تنبؤ المحصول", "لوحات البيانات"]
      }
    ]
  },
  {
    id: "hydroponics",
    title: "مسار الزراعة المائية والهيدروبونيك",
    shortTitle: "الزراعة المائية",
    level: "مبتدئ إلى محترف (Zero to Hero)",
    description: "مسار تطبيقي عملي لاحتراف تصميم وتشغيل أنظمة الزراعة بدون تربة (NFT، Dutch Bucket، Deep Water Culture، Aeroponics)، وإدارة المحاليل المغذية، ومراقبة الـ EC والـ pH لتسريع دورات الإنتاج بأعلى كفاءة مائية.",
    marketDemand: "مرتفع جداً في البيوت المحمية",
    rating: 5,
    progress: 15,
    icon: "Droplets",
    color: "sky",
    skills: ["الهيدروبونيك", "التغذية", "إدارة البيوت", "NFT", "EC/pH Control"],
    modules: [
      {
        id: "m1",
        title: "مبادئ وأنظمة الهيدروبونيك المختلفة",
        desc: "التعرف على ميكانيكية أنظمة NFT، الزراعة العائمة DWC، الزراعة الهوائية والبيئات الصلبة (بيرلايت، كوكوبيت).",
        duration: "2 أسابيع",
        completed: true,
        skills: ["أنظمة NFT", "Dutch Bucket", "البيئات الخاملة"]
      },
      {
        id: "m2",
        title: "كيمياء المحاليل المغذية وضبط EC وpH",
        desc: "تركيب خلطات عناصر الماكرو والميكرو، حساب نسب التسميد لكل مرحلة نمو، وحلول معادلة القلوية والملوحة.",
        duration: "4 أسابيع",
        completed: false,
        skills: ["حساب المحاليل", "أجهزة EC/pH", "تسميد الورقيات"]
      },
      {
        id: "m3",
        title: "إدارة المناخ والتهوية في البيوت المحمية",
        desc: "التحكم في الرطوبة النسبية وVPD والإضاءة التكميلية LED والتهوية الإيجابية لرفع كفاءة التمثيل الضوئي.",
        duration: "3 أسابيع",
        completed: false,
        skills: ["تحكم VPD", "إضاءة LED", "التبريد التبخيري"]
      },
      {
        id: "m4",
        title: "التشخيص والوقاية من أمراض الجذور",
        desc: "مراقبة أمراض تعفن الجذور مثل Pythium، تحسين الأكسجين الذائب في الماء، وتطبيق البكتيريا النافعة المقوية للجذور.",
        duration: "3 أسابيع",
        completed: false,
        skills: ["أمراض الجذور", "الأكسجة الذائبة", "المكافحة الحيوية"]
      }
    ]
  },
  {
    id: "soil-water",
    title: "مسار إدارة الأراضي والمياه والري الحديث",
    shortTitle: "الأراضي والمياه",
    level: "شامل ومتخصص (Zero to Hero)",
    description: "فهم متعمق لخواص التربة الكيميائية والفيزيائية واستصلاح الأراضي المتأثرة بالملوحة، مع تصميم وتشغيل نظم الري الحديث بالتنقيط وإدارة الموارد المائية لتعظيم إنتاجية المحاصيل الحقلية.",
    marketDemand: "أساسي في كبرى المشاريع الزراعية",
    rating: 5,
    progress: 10,
    icon: "MapPinned",
    color: "amber",
    skills: ["تحليل التربة", "الري الحديث", "تغذية النبات", "معالجة الملوحة", "Fertigation"],
    modules: [
      {
        id: "m1",
        title: "فيزياء وكيمياء التربة وتقييم الخصوبة",
        desc: "تحليل قوام وبناء التربة، السعة التبادلية الكاتيونية CEC، وتوافر العناصر الغذائية في الترب القلوية والجيرية.",
        duration: "3 أسابيع",
        completed: true,
        skills: ["تحليل التربة", "سعة التبادل CEC", "مادة عضوية"]
      },
      {
        id: "m2",
        title: "استصلاح الأراضي الملحية والصودية",
        desc: "إدارة شبكات الصرف الزراعي المغطى، استخدام الجبس الزراعي والمخصبات الحمضية، ومعالجة ملوحة مياه الآبار.",
        duration: "3 أسابيع",
        completed: false,
        skills: ["معالجة الملوحة", "الصرف الزراعي", "معايير ESP"]
      },
      {
        id: "m3",
        title: "هندسة وتصميم شبكات الري بالتنقيط والرش",
        desc: "حساب التصرفات المائية والضاغط الهيدروليكي، اختيار المنقطات، وتصميم وحدات الحقن السمادي الحقلي Fertigation.",
        duration: "4 أسابيع",
        completed: false,
        skills: ["هندسة الري", "حساب الضواغط", "نظم Fertigation"]
      },
      {
        id: "m4",
        title: "جدولة الري الذكية والحفاظ على المياه",
        desc: "استخدام حساسات التينشيوميتر وخرائط الرطوبة النسبية للري حسب الاحتياج الفعلي للنبات ومكافحة الهدر.",
        duration: "2 أسابيع",
        completed: false,
        skills: ["جدولة الري", "مجسات TDR", "حساب Evapotranspiration"]
      }
    ]
  }
];

const Roadmap = ({ 
  specialty = "الزراعة الرقمية", 
  onSelectSpecialty, 
  onBack,
  onNavigate 
}) => {
  const { user } = useAuth();
  const [majors, setMajors] = useState(DEFAULT_FALLBACK_MAJORS);
  const [selectedMajorId, setSelectedMajorId] = useState(null);

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/majors`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setMajors(data.data);
      }
    } catch {
      // Use initial fallback list gracefully
    }
  };

  // Match active major by passed specialty title or shortTitle or default to first
  const currentMajor = majors.find(
    (m) =>
      m.shortTitle === specialty ||
      m.title === specialty ||
      m.id === selectedMajorId
  ) || majors[0] || DEFAULT_FALLBACK_MAJORS[0];

  const handleTabChange = (major) => {
    setSelectedMajorId(major.id);
    if (onSelectSpecialty) {
      onSelectSpecialty(major.shortTitle);
    }
  };

  // Protected Access Check for Guests
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f8f1] pt-28 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-2xl p-8 sm:p-12 text-center relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 shadow-inner">
              <Lock className="h-10 w-10" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 mb-4">
              منطقة محمية للأعضاء المسجلين
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 leading-tight mb-4">
              يلزم تسجيل الدخول لرؤية خريطة الطريق
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-7 max-w-xl mx-auto mb-8">
              عذراً، لا يمكن للزوار غير المسجلين استعراض خرائط الطريق والمناهج العملية. يرجى تسجيل الدخول إذا كان لديك حساب بالفعل، أو إنشاء حساب جديد مجاناً للبدء.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-800 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>تسجيل الدخول إلى حسابك</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 border border-slate-200 px-6 py-3.5 text-sm font-extrabold text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              >
                <UserPlus className="h-4 w-4 text-emerald-700" />
                <span>إنشاء حساب جديد</span>
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
              >
                ← العودة إلى الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = ICON_MAP[currentMajor.icon] || Satellite;

  return (
    <div className="min-h-screen bg-[#f5f8f1] pt-24 sm:pt-28" dir="rtl">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-emerald-900/10 bg-white/70 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-emerald-700 transition cursor-pointer"
            >
              الرئيسية
            </button>
            <span>/</span>
            <span className="text-emerald-800 font-bold">خرائط الطريق</span>
            <span>/</span>
            <span className="text-slate-800">{currentMajor.shortTitle}</span>
          </div>

          {/* Back to Home Button */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer shadow-xs"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>

      {/* Specialty Selector Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white/80 p-2 shadow-xs border border-emerald-900/10 backdrop-blur-sm sm:inline-flex">
          {majors.map((major) => {
            const SpecIcon = ICON_MAP[major.icon] || Satellite;
            const isSelected = major.id === currentMajor.id;

            return (
              <button
                key={major.id}
                type="button"
                onClick={() => handleTabChange(major)}
                className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-md scale-102"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <SpecIcon className={`h-4 w-4 ${isSelected ? "text-lime-300" : "text-emerald-600"}`} />
                <span>{major.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roadmap Hero Section */}
      <Hero
        level={currentMajor.level || "Zero to Hero"}
        title={currentMajor.title}
        description={currentMajor.description}
        marketDemand={currentMajor.marketDemand}
        rating={currentMajor.rating || 5}
        progress={currentMajor.progress || 20}
        modules={currentMajor.modules || []}
        onStartLearning={() => {
          const el = document.getElementById("roadmap-curriculum");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Detailed Curriculum Section */}
      <section id="roadmap-curriculum" className="py-16 bg-[#eef4e8]/60 border-t border-emerald-900/10 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase">المنهج التطبيقي العملي</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-950">
              مراحل وخطوات إتقان {currentMajor.shortTitle} (من الصفر إلى الاحتراف)
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
              تم إعداد هذه المراحل بعناية وفقًا لمتطلبات كبرى الشركات والمشاريع الزراعية الحديثة لضمان الانتقال من الأساسيات النظرية إلى التطبيق الميداني المباشر.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {currentMajor.modules && currentMajor.modules.length > 0 ? (
              currentMajor.modules.map((module, index) => (
                <div
                  key={module.id || index}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-7 shadow-xs transition-all duration-300 hover:shadow-lg ${
                    module.completed
                      ? "bg-white border-emerald-200"
                      : "bg-white/90 border-slate-200/80"
                  }`}
                >
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                        <span>المرحلة {index + 1}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-emerald-700" />
                        <span>{module.duration}</span>
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg sm:text-xl font-bold text-emerald-950 leading-7">
                      {module.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {module.desc}
                    </p>
                  </div>

                  {/* Skills & Action */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-4">
                    {module.skills && Array.isArray(module.skills) && (
                      <div className="flex flex-wrap gap-2">
                        {module.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {module.completed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>مكتملة ومتاحة للمراجعة</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          قيد الإعداد والتعلم
                        </span>
                      )}

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                      >
                        <span>تفاصيل المرحلة</span>
                        <span>←</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-3xl p-8 text-center border border-slate-200">
                <p className="text-slate-600">لا يوجد مراحل تعليمية متوفرة لهذا التخصص حالياً.</p>
              </div>
            )}
          </div>

          {/* Certificate Banner */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/20 px-3 py-1 text-xs font-bold text-lime-300">
                <Award className="h-4 w-4" />
                <span>شهادة معتمدة عند إتمام المسار</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                جاهز لبدء أول خطوة في {currentMajor.shortTitle}؟
              </h3>
              <p className="text-sm text-emerald-200/80 max-w-xl">
                ابدأ باجتياز المرحلة الأولى وجمع النقاط لبناء ملفك المهني وربطك بشركات الزراعة الحديثة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`مبروك! بدأت الآن مسار ${currentMajor.shortTitle}. استمتع برحلتك التعليمية.`);
              }}
              className="shrink-0 rounded-2xl bg-lime-400 px-8 py-3.5 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:bg-lime-300 hover:shadow-xl active:scale-98 cursor-pointer"
            >
              ابدأ المرحلة الأولى الآن 🚀
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Roadmap;
