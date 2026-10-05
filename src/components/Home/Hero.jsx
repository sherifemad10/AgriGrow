import Wave from '../../UI/Wave';

const Hero = ({ onSelectSpecialty }) => {
  const pathways = [
    {
      id: 1,
      title: 'الزراعة الرقمية',
      description: 'بيانات وأقمار صناعية لقرار حقلي دقيق',
      completed: 80,
    },
    {
      id: 2,
      title: 'الزراعة المائية',
      description: 'محاليل مغذية وأنظمة وتشخيص سريع',
      completed: 100,
    },
    {
      id: 3,
      title: 'الأراضي والمياه',
      description: 'تحليل التربة واستصلاح الأرض وتغذية النبات',
      completed: 100,
    },
  ];

  return (
    <section id='home' className='relative scroll-mt-24 overflow-hidden bg-[#f5f8f1] pt-28 text-right sm:pt-32 lg:min-h-[calc(100vh-76px)] lg:pt-36'>
      <div className='pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(20,83,45,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.05)_1px,transparent_1px)] [background-size:42px_42px]' />

      <div className='relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:pb-24'>
        <div className='max-w-2xl'>
          <span className='inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/70 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm'>
            <span className='h-2 w-2 rounded-full bg-lime-500' />
            مرشدك المهني بالذكاء الاصطناعي
          </span>

          <h1 className='mt-6 text-4xl font-bold leading-[1.2] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl'>
            ابنِ مستقبلك الزراعي، <span className='text-emerald-700'>مهارة تلو الأخرى.</span>
          </h1>
          <p className='mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg'>
            مرشدك المدعوم بالذكاء الاصطناعي لاكتشاف الوظائف الزراعية، واتباع خرائط طريق عملية، وتعلّم مهارات السوق للوصول إلى الجاهزية الوظيفية.
          </p>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start'>
            <a href='#specialties' className='rounded-xl bg-emerald-700 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20'>
              اكتشف المسارات المهنية
            </a>
            <a href='#research' className='rounded-xl border border-emerald-700/20 bg-white/70 px-6 py-3.5 text-center text-sm font-bold text-emerald-800 transition hover:border-emerald-700 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20'>
              أحدث الأبحاث
            </a>
          </div>

          <div className='mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-emerald-900/10 pt-5 text-sm text-slate-500'>
            <span><strong className='text-xl text-emerald-800'>+120</strong> مسارًا تعليميًا</span>
            <span><strong className='text-xl text-emerald-800'>24/7</strong> إرشادًا ذكيًا</span>
          </div>
        </div>

        <div id='pathways' className='relative mx-auto w-full max-w-xl scroll-mt-28'>
          <div className='rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.14)] backdrop-blur sm:p-7'>
            <div className='mb-6 flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.16em] text-emerald-700'>لوحة التقدم</p>
                <h2 className='mt-2 text-2xl font-bold text-emerald-950'>المسارات المطلوبة الآن</h2>
              </div>
              <span className='rounded-lg bg-lime-100 px-3 py-2 text-xs font-bold text-lime-800'>محدّث اليوم</span>
            </div>

            <div className='space-y-3'>
              {pathways.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectSpecialty && onSelectSpecialty(item.title)}
                  className='rounded-2xl border border-slate-100 bg-[#fbfcf9] p-4 transition hover:border-emerald-300 hover:shadow-md cursor-pointer'
                  title="انقر لفتح خريطة طريق هذا المسار"
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-bold text-slate-800 hover:text-emerald-700 transition'>{item.title}</h3>
                      <p className='mt-1 text-xs leading-5 text-slate-500'>{item.description}</p>
                    </div>
                    <span className='shrink-0 text-sm font-bold text-emerald-700'>{item.completed}%</span>
                  </div>
                  <div className='mt-4 h-2 overflow-hidden rounded-full bg-emerald-100'>
                    <div className='h-full rounded-full bg-emerald-600 transition-all' style={{ width: `${item.completed}%` }} />
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSelectSpecialty && onSelectSpecialty('الزراعة الرقمية')}
              className='mt-5 flex w-full items-center gap-3 rounded-xl bg-emerald-950 px-4 py-3 text-white transition hover:bg-emerald-900 cursor-pointer text-right'
            >
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-400 text-emerald-950'>✓</span>
              <p className='text-sm leading-6'><strong>خطوتك التالية جاهزة.</strong><br />انقر لبدء خريطة طريقك اليوم.</p>
            </button>
          </div>
        </div>
      </div>
      <Wave fill='#eef4e8' />
    </section>
  );
};

export default Hero;
