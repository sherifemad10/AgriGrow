const Wave = ({ fill = '#eef4e8', className = '' }) => {
  return (
    <div className={`pointer-events-none overflow-hidden leading-none ${className}`} aria-hidden='true'>
      <svg viewBox='0 0 1440 120' className='block h-[72px] w-full sm:h-[96px]' preserveAspectRatio='none'>
        <path
          fill={fill}
          d='M0,72 C180,120 360,16 540,56 C720,96 900,24 1080,64 C1260,104 1350,88 1440,48 L1440,120 L0,120 Z'
        />
      </svg>
    </div>
  )
}

export default Wave
