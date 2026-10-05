import Logo from '../assets/AgrigrowLogo.png';

const Footer = ({ onNavigate }) => {
  return (
    <footer id="about" className="scroll-mt-24 border-t border-emerald-900/10 bg-emerald-950 px-5 py-12 text-right text-emerald-50 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-emerald-900/40">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="AgriGrow" className="h-12 w-12 object-contain brightness-110" />
              <span className="text-xl font-extrabold tracking-wide text-white">أجري جرو</span>
            </div>
            <p className="text-sm leading-7 text-emerald-100/80">
              أجري جرو منصة إرشاد مهني زراعي بالذكاء الاصطناعي تساعدك على اكتشاف التخصص المناسب، ومتابعة الأبحاث، وبناء مهارات السوق بخطوات عملية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-lime-300">روابط سريعة</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <a href="#home" onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition">الرئيسية</a>
              </li>
              <li>
                <a href="#specialties" onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition">التخصصات والمسارات</a>
              </li>
              <li>
                <a href="#research" onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition">أحدث الأبحاث والدراسات</a>
              </li>
              <li>
                <a href="#roadmap" onClick={() => onNavigate && onNavigate('roadmap')} className="hover:text-white transition">خريطة الطريق (Roadmap)</a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-lime-300">أهم المسارات</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('roadmap', 'الزراعة الرقمية')} className="hover:text-white transition text-right">
                  الزراعة الرقمية والاستشعار
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('roadmap', 'الزراعة المائية')} className="hover:text-white transition text-right">
                  الزراعة المائية (Hydroponics)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('roadmap', 'الأراضي والمياه')} className="hover:text-white transition text-right">
                  إدارة الأراضي والمياه
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Vision */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-lime-300">رؤيتنا</h3>
            <p className="mt-4 text-sm leading-6 text-emerald-200/80">
              تمكين الجيل القادم من المهندسين والباحثين الزراعيين بأحدث المهارات العملية وأدوات التحليل الرقمي لدعم الأمن الغذائي والاستدامة.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© {new Date().getFullYear()} AgriGrow - جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <a href="#home" onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition">الرئيسية</a>
            <span>•</span>
            <a href="#roadmap" onClick={() => onNavigate && onNavigate('roadmap')} className="hover:text-white transition">خريطة الطريق</a>
            <span>•</span>
            <a href="#login" onClick={() => onNavigate && onNavigate('login')} className="hover:text-white transition">تسجيل الدخول</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
