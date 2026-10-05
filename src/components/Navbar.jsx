import { useState } from 'react';
import Logo from '../assets/AgrigrowLogo.png';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

const baseNavigationLinks = [
  { id: 'home', label: 'الرئيسية', href: '#home' },
  { id: 'specialties', label: 'التخصصات', href: '#specialties' },
  { id: 'research', label: 'أحدث الأبحاث', href: '#research' },
  { id: 'roadmap', label: 'خريطة الطريق 🔒', href: '#roadmap' },
  { id: 'about', label: 'من نحن', href: '#about' },
];

const Navbar = ({ currentPage = 'home', onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigationLinks = isAdmin
    ? [...baseNavigationLinks, { id: 'admin', label: 'لوحة التحكم ⚙️', href: '#admin' }]
    : baseNavigationLinks;

  const handleLinkClick = (e, link) => {
    setIsMenuOpen(false);

    if (link.id === 'roadmap') {
      e.preventDefault();
      if (onNavigate) onNavigate('roadmap');
      return;
    }

    if (link.id === 'admin') {
      e.preventDefault();
      if (onNavigate) onNavigate('admin');
      return;
    }

    if (link.id === 'home') {
      e.preventDefault();
      if (onNavigate) onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Anchor links on Home page
    if (currentPage !== 'home') {
      e.preventDefault();
      if (onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const target = document.querySelector(link.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-900/10 bg-[#f8faf5]/95 shadow-[0_4px_20px_rgba(20,83,45,0.08)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-[76px] sm:gap-4 sm:px-8 lg:px-10">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={handleLogoClick}
          className="flex shrink-0 items-center gap-2 rounded-lg text-emerald-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
          aria-label="AgriGrow - الصفحة الرئيسية"
        >
          <img src={Logo} alt="AgriGrow" className="h-12 w-12 object-contain sm:h-16 sm:w-16" />
          <span className="hidden border-r border-emerald-900/20 pr-3 text-xl font-bold tracking-wide sm:block">
            أجري جرو
          </span>
        </a>

        {/* Navigation Links */}
        <nav
          id="main-navigation"
          className={`${
            isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 lg:visible lg:opacity-100'
          } absolute inset-x-3 top-[calc(100%+0.5rem)] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-emerald-900/10 bg-[#f8faf5] p-3 shadow-xl transition-all sm:inset-x-8 lg:static lg:flex lg:flex-1 lg:items-center lg:justify-center lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          aria-label="التنقل الرئيسي"
        >
          <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1.5">
            {navigationLinks.map((link) => {
              const isActive =
                (link.id === 'roadmap' && currentPage === 'roadmap') ||
                (link.id === 'admin' && currentPage === 'admin') ||
                (link.id === 'home' &&
                  currentPage === 'home' &&
                  !window.location.hash.includes('#specialties') &&
                  !window.location.hash.includes('#research'));

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`block rounded-xl px-4 py-2 text-sm font-semibold transition lg:whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : link.id === 'admin'
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-bold'
                        : 'text-slate-700 hover:bg-emerald-700/10 hover:text-emerald-800'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Dark Mode Toggle */}
          <label className="relative inline-flex cursor-pointer items-center" title="تبديل المظهر">
            <span className="sr-only">تبديل المظهر الداكن</span>
            <input
              className="peer sr-only"
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode((darkMode) => !darkMode)}
            />
            <span className="relative h-7 w-11 rounded-full bg-emerald-100 shadow-inner ring-1 ring-inset ring-emerald-900/15 transition peer-checked:bg-slate-700 after:absolute after:right-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-amber-400 after:shadow-sm after:transition-transform peer-checked:after:-translate-x-4 peer-checked:after:bg-slate-100 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-700 sm:w-12 sm:peer-checked:after:-translate-x-5" />
          </label>

          {/* User Auth Info / Login / Logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-2 bg-emerald-100/70 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold"
                title={user.email}
              >
                {isAdmin ? (
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                ) : (
                  <UserIcon className="h-4 w-4 text-emerald-700 shrink-0" />
                )}
                <span className="max-w-[120px] truncate">{user.name}</span>
                {isAdmin && (
                  <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                    Admin
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onNavigate) onNavigate('home');
                }}
                className="rounded-xl bg-slate-100 p-2 text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <a
              href="#login"
              onClick={handleLoginClick}
              className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:px-5 sm:text-sm cursor-pointer"
            >
              <span className="sm:hidden">دخول</span>
              <span className="hidden sm:inline">تسجيل الدخول</span>
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="rounded-lg p-2 text-emerald-950 transition hover:bg-emerald-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 lg:hidden cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="my-1.5 block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;