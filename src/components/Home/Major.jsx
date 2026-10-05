import { useState, useEffect } from 'react';
import { Droplets, MapPinned, Satellite, ShieldCheck, BookOpen } from 'lucide-react';
import MajorCard from '../../UI/MajorCard';

const ICON_MAP = {
  Satellite,
  Droplets,
  MapPinned,
  ShieldCheck,
  BookOpen,
};

const DEFAULT_MAJORS = [
  {
    title: 'الزراعة الرقمية',
    shortTitle: 'الزراعة الرقمية',
    description: 'تخصص يجمع بين الزراعة الدقيقة ونظم المعلومات الجغرافية والاستشعار عن بعد وتحليل البيانات لاتخاذ قرارات حقلية مبنية على الأرقام.',
    skills: ['GIS', 'GPS', 'الاستشعار عن بعد'],
    iconName: 'Satellite',
    href: '#roadmap',
  },
  {
    title: 'الزراعة المائية',
    shortTitle: 'الزراعة المائية',
    description: 'مسار عملي لتصميم أنظمة الزراعة بدون تربة، وإدارة المحاليل المغذية، وتشخيص اختلالات النمو بسرعة.',
    skills: ['الهيدروبونيك', 'التغذية', 'إدارة البيوت'],
    iconName: 'Droplets',
    href: '#roadmap',
  },
  {
    title: 'الأراضي والمياه',
    shortTitle: 'الأراضي والمياه',
    description: 'فهم خصائص التربة واستصلاح الأراضي وإدارة المياه لتحسين خصوبة الحقل وكفاءة الري.',
    skills: ['تحليل التربة', 'الري', 'تغذية النبات'],
    iconName: 'MapPinned',
    href: '#roadmap',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Major = ({ onSelectSpecialty }) => {
  const [majors, setMajors] = useState(DEFAULT_MAJORS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/majors`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map((m) => ({
            title: m.title,
            shortTitle: m.shortTitle || m.title,
            description: m.description,
            skills: Array.isArray(m.skills) ? m.skills : (m.skills ? m.skills.split(',') : []),
            iconName: m.icon || 'Satellite',
            href: '#roadmap',
          }));
          setMajors(formatted);
        }
      })
      .catch(() => {
        // Fallback to static majors
      });
  }, []);

  return (
    <section id="specialties" className="relative scroll-mt-24 bg-[#eef4e8] py-16 text-right sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold tracking-[0.16em] text-emerald-700">تخصصات المنصة</span>
          <h2 className="mt-3 text-3xl font-extrabold text-emerald-950 sm:text-4xl">المسارات التعليمية والمهنية</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            اختر مسارًا واضحًا واستكشف خريطة الطريق المعتمدة خطوة بخطوة للوصول للجاهزية الوظيفية (Zero to Hero).
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {majors.map((major, idx) => {
            const IconComp = ICON_MAP[major.iconName] || Satellite;
            return (
              <MajorCard
                key={major.title + idx}
                {...major}
                icon={IconComp}
                onExplore={() => onSelectSpecialty && onSelectSpecialty(major.shortTitle || major.title)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Major;
