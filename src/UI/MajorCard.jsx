const MajorCard = ({ title, description, skills, icon: Icon, href, onExplore }) => {
  const handleClick = (e) => {
    if (onExplore) {
      e.preventDefault();
      onExplore();
    }
  };

  return (
    <article className='group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white text-right shadow-[0_12px_30px_rgba(20,83,45,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,83,45,0.14)]'>
      <div className='h-1.5 bg-emerald-600' />

      <div className='flex flex-1 flex-col p-5 sm:p-6'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div>
            <span className='text-xs font-bold tracking-[0.16em] text-emerald-700'>مسار تخصصي</span>
            <h3 className='mt-2 text-2xl font-bold text-emerald-950'>{title}</h3>
          </div>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700' aria-hidden='true'>
            {Icon ? <Icon className='h-5 w-5' /> : null}
          </span>
        </div>

        <p className='text-sm leading-7 text-slate-600'>{description}</p>

        <ul className='mt-6 flex flex-wrap gap-2' aria-label='المهارات الرئيسية'>
          {skills.map((skill) => (
            <li key={skill} className='rounded-full border border-emerald-700/15 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800'>
              {skill}
            </li>
          ))}
        </ul>

        <a
          href={href || '#roadmap'}
          onClick={handleClick}
          className='mt-auto inline-flex items-center gap-2 self-start pt-7 text-sm font-bold text-emerald-700 transition group-hover:gap-3 hover:text-emerald-900 focus:outline-none focus-visible:underline cursor-pointer'
        >
          استكشف خريطة الطريق
          <span aria-hidden='true'>←</span>
        </a>
      </div>
    </article>
  );
};

export default MajorCard;
