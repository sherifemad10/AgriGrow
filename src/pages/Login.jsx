import { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import SignImage from '../assets/sign.jpeg';
import { useAuth } from '../context/AuthContext';

const Login = ({ onNavigate, redirectNotice }) => {
  const { login, register, loading, authError, setAuthError } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          onNavigate && onNavigate('admin');
        } else {
          onNavigate && onNavigate('roadmap');
        }
      }
    } else {
      // Register Mode
      if (!formData.name.trim()) {
        setAuthError('يرجى إدخال اسمك الكامل.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setAuthError('كلمتا المرور غير متطابقتين.');
        return;
      }
      if (formData.password.length < 6) {
        setAuthError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
        return;
      }

      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          onNavigate && onNavigate('admin');
        } else {
          onNavigate && onNavigate('roadmap');
        }
      }
    }
  };

  return (
    <main className="backgroundImage min-h-screen px-4 pb-10 pt-28 sm:px-8 lg:px-10 lg:pt-32" dir="rtl">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(20,83,45,0.16)] backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left Side Graphic */}
        <section className="relative hidden min-h-[620px] overflow-hidden lg:block">
          <img
            src={SignImage}
            alt="مزرعة ذكية تستخدم تقنيات الزراعة الحديثة"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/20 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-lime-200">
              AgriGrow Ecosystem
            </p>
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              نزرع المعرفة لننمي مستقبلًا زراعيًا أفضل
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              منصة واحدة متكاملة للوصول إلى أحدث خرائط الطريق التعليمية والتخصصات الزراعية التطبيقية.
            </p>
          </div>
        </section>

        {/* Right Side Form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-12 lg:px-16">
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            {/* Top Bar */}
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
                <span>العودة للرئيسية</span>
              </button>

              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {mode === 'login' ? 'مرحبًا بك مجددًا' : 'عضوية جديدة'}
              </span>
            </div>

            {/* Redirect Notice Banner */}
            {redirectNotice && (
              <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-bold text-amber-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-700 shrink-0" />
                <span>{redirectNotice}</span>
              </div>
            )}

            {/* Form Title & Subtitle */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {mode === 'login'
                  ? 'أدخل بياناتك للوصول إلى حسابك ومتابعة رحلتك الزراعية.'
                  : 'أنشئ حسابك الآن مجاناً واستكشف أحدث التخصصات وخرائط الطريق.'}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-bold text-red-700">
                {authError}
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="د. أحمد علي"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    تأكيد كلمة المرور *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-700 focus:ring-emerald-600"
                    />
                    <span>تذكرني على هذا الجهاز</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>جاري المعالجة...</span>
                ) : mode === 'login' ? (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>تسجيل الدخول</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>إنشاء الحساب الآن</span>
                  </span>
                )}
              </button>
            </div>

            {/* Mode Switch Footer */}
            <div className="mt-8 text-center text-sm text-slate-500">
              {mode === 'login' ? (
                <p>
                  ليس لديك حساب؟{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthError(null);
                    }}
                    className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer underline"
                  >
                    إنشاء حساب جديد
                  </button>
                </p>
              ) : (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthError(null);
                    }}
                    className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer underline"
                  >
                    تسجيل الدخول مباشرة
                  </button>
                </p>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
