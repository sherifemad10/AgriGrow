import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Satellite, 
  Droplets, 
  MapPinned, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  Layers, 
  Search,
  Sparkles,
  LogOut,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ICON_OPTIONS = [
  { label: 'Satellite (أقمار صناعية)', value: 'Satellite', icon: Satellite },
  { label: 'Droplets (زراعة مائية)', value: 'Droplets', icon: Droplets },
  { label: 'MapPinned (أراضي ومياه)', value: 'MapPinned', icon: MapPinned },
  { label: 'ShieldCheck (وقاية نبات)', value: 'ShieldCheck', icon: ShieldCheck },
  { label: 'BookOpen (مسار تعليمي)', value: 'BookOpen', icon: BookOpen },
];

const API_BASE_URL = 'http://localhost:5000/api';

const AdminDashboard = ({ onNavigate }) => {
  const { user, token, logout, isAdmin } = useAuth();
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    level: 'مبتدئ إلى متقدم (Zero to Hero)',
    description: '',
    marketDemand: 'مطلوب بشدة في سوق العمل',
    rating: 5,
    progress: 0,
    icon: 'Satellite',
    color: 'emerald',
    skills: '',
    modules: [],
  });

  // Dynamic Module input inside modal
  const [moduleInput, setModuleInput] = useState({
    title: '',
    desc: '',
    duration: '3 أسابيع',
    skills: '',
    completed: false,
  });

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/majors`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMajors(data.data);
      }
    } catch (err) {
      showStatus('حدث خطأ أثناء تحميل البيانات من السيرفر', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage({ text: '', type: '' });
    }, 4000);
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8f1] px-4 pt-28 pb-12" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">منطقة محمية - الأدمن فقط</h2>
          <p className="text-sm text-slate-600 mb-6">
            عذراً، هذه اللوحة مخصصة لإدارة منصة أجري جرو فقط وليست مفرودة للعامة.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full bg-emerald-700 text-white font-bold py-3 rounded-xl hover:bg-emerald-800 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingMajor(null);
    setFormData({
      title: '',
      shortTitle: '',
      level: 'مبتدئ إلى متقدم (Zero to Hero)',
      description: '',
      marketDemand: 'مطلوب بشدة في سوق العمل',
      rating: 5,
      progress: 0,
      icon: 'Satellite',
      color: 'emerald',
      skills: '',
      modules: [
        {
          id: 'mod-1',
          title: 'أساسيات وتطبيقات التخصص (المرحلة الأولى)',
          desc: 'المفاهيم الأولى والأدوات المطلوبة للبدء من الصفر.',
          duration: '3 أسابيع',
          skills: ['أساسيات', 'أدوات عمل'],
          completed: false,
        },
      ],
    });
    setModuleInput({ title: '', desc: '', duration: '3 أسابيع', skills: '', completed: false });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (major) => {
    setEditingMajor(major);
    setFormData({
      title: major.title || '',
      shortTitle: major.shortTitle || '',
      level: major.level || 'مبتدئ إلى متقدم (Zero to Hero)',
      description: major.description || '',
      marketDemand: major.marketDemand || 'مطلوب بشدة',
      rating: major.rating || 5,
      progress: major.progress || 0,
      icon: major.icon || 'Satellite',
      color: major.color || 'emerald',
      skills: Array.isArray(major.skills) ? major.skills.join(', ') : major.skills || '',
      modules: major.modules ? [...major.modules] : [],
    });
    setModuleInput({ title: '', desc: '', duration: '3 أسابيع', skills: '', completed: false });
    setIsModalOpen(true);
  };

  const handleAddModule = () => {
    if (!moduleInput.title.trim()) return;

    const newMod = {
      id: `mod-${Date.now()}`,
      title: moduleInput.title.trim(),
      desc: moduleInput.desc.trim() || 'وصف المرحلة التعليمية وتطبيقاتها.',
      duration: moduleInput.duration || '3 أسابيع',
      skills: moduleInput.skills ? moduleInput.skills.split(',').map((s) => s.trim()) : [],
      completed: moduleInput.completed,
    };

    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, newMod],
    }));

    setModuleInput({ title: '', desc: '', duration: '3 أسابيع', skills: '', completed: false });
  };

  const handleRemoveModule = (modId) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== modId),
    }));
  };

  const handleSaveMajor = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shortTitle.trim()) {
      showStatus('يرجى ملء الحقول الإجبارية (عنوان المسار والاسم المختصر)', 'error');
      return;
    }

    const payload = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()) : [],
    };

    try {
      const url = editingMajor
        ? `${API_BASE_URL}/majors/${editingMajor.id}`
        : `${API_BASE_URL}/majors`;
      const method = editingMajor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showStatus(
          editingMajor ? 'تم تحديث المسار وخريطة الطريق بنجاح! ✨' : 'تم إضافة التخصص الجديد بنجاح! 🚀',
          'success'
        );
        setIsModalOpen(false);
        fetchMajors();
      } else {
        showStatus(data.message || 'حدث خطأ أثناء حفظ التخصص', 'error');
      }
    } catch (err) {
      showStatus('فشل الاتصال بالسيرفر أثناء عملية الحفظ', 'error');
    }
  };

  const handleDeleteMajor = async (majorId, majorTitle) => {
    if (!window.confirm(`هل أنت تأكد من رغبتك في حذف تخصص "${majorTitle}" وخريطة الطريق الخاصة به؟`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/majors/${majorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        showStatus('تم حذف التخصص وخريطة الطريق بنجاح', 'success');
        fetchMajors();
      } else {
        showStatus(data.message || 'فشل حذف التخصص', 'error');
      }
    } catch (err) {
      showStatus('خطأ بالاتصال بالسيرفر', 'error');
    }
  };

  const filteredMajors = majors.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalModulesCount = majors.reduce((acc, curr) => acc + (curr.modules?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f8f1] pt-24 pb-16 px-4 sm:px-8 lg:px-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        {/* Status Toast */}
        {statusMessage.text && (
          <div
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3 font-bold text-sm shadow-2xl transition-all border ${
              statusMessage.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-emerald-800 text-white border-emerald-900'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-lime-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Control Center
              </span>
              <span className="text-xs text-emerald-200">مرحباً بك، د. شريف 👋</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">لوحة التحكم في التخصصات وخرائط الطريق</h1>
            <p className="text-sm text-emerald-200/80 mt-1">
              إدارة التخصصات الزراعية، تعديل مراحل التعلم (Zero to Hero)، وإضافة المسارات الجديدة ديناميكياً.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer border border-white/15"
            >
              <ArrowRight className="h-4 w-4" />
              <span>الموقع الرئيسي</span>
            </button>

            <button
              onClick={() => {
                logout();
                if (onNavigate) onNavigate('home');
              }}
              className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer border border-red-400/20"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">إجمالي التخصصات المتاحة</p>
              <h3 className="text-3xl font-black text-emerald-950 mt-1">{majors.length} تخصصات</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">مراحل التعلم (Zero to Hero)</p>
              <h3 className="text-3xl font-black text-emerald-950 mt-1">{totalModulesCount} مرحلة عملة</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">حالة سيرفر API</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                نشط وديناميكي
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-lime-50 text-emerald-800 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Action & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-900/10 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في التخصصات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة تخصص جديد وخريطة طريق</span>
          </button>
        </div>

        {/* Majors List */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">جاري تحميل المسارات والتخصصات...</div>
        ) : filteredMajors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-600 font-bold">لا يوجد تخصصات مطابقة للبحث.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredMajors.map((major) => {
              const IconComp =
                ICON_OPTIONS.find((i) => i.value === major.icon)?.icon || Satellite;

              return (
                <div
                  key={major.id}
                  className="bg-white rounded-3xl border border-emerald-900/10 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <IconComp className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                            {major.shortTitle}
                          </span>
                          <h3 className="text-xl font-black text-slate-900 mt-1">{major.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(major)}
                          title="تعديل المسار"
                          className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteMajor(major.id, major.title)}
                          title="حذف المسار"
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-6 mb-4">{major.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {major.skills &&
                        (Array.isArray(major.skills) ? major.skills : major.skills.split(',')).map(
                          (sk) => (
                            <span
                              key={sk}
                              className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                            >
                              {sk}
                            </span>
                          )
                        )}
                    </div>

                    {/* Modules Summary */}
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center justify-between">
                        <span>مراحل خريطة الطريق (Zero to Hero)</span>
                        <span className="text-emerald-700 font-extrabold">
                          {major.modules?.length || 0} مراحل
                        </span>
                      </h4>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {major.modules && major.modules.length > 0 ? (
                          major.modules.map((mod, idx) => (
                            <div
                              key={mod.id || idx}
                              className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs"
                            >
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span>
                                  {idx + 1}. {mod.title}
                                </span>
                                <span className="text-slate-500 font-normal">{mod.duration}</span>
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-1">{mod.desc}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">لا يوجد مراحل مضافة بعد.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>المستوى: {major.level}</span>
                    <button
                      onClick={() => onNavigate && onNavigate('roadmap')}
                      className="font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      معاينة في الموقع ←
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Major Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl border border-white/40 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" dir="rtl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {editingMajor ? 'تعديل التخصص وخريطة الطريق' : 'إضافة تخصص جديد وخريطة طريق (Zero to Hero)'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    قم بإدخال بيانات التخصص والمراحل التعليمية المؤهلة لسوق العمل.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveMajor} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      عنوان المسار والتخصص الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مسار الزراعة الرقمية والاستشعار عن بعد"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم المختصر (للتبويبات) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الزراعة الرقمية"
                      value={formData.shortTitle}
                      onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف التخصص *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="شرح مختصر لمجال التخصص وأهميته العملية..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">المستوى التعليمي</label>
                    <input
                      type="text"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الطلب في سوق العمل</label>
                    <input
                      type="text"
                      value={formData.marketDemand}
                      onChange={(e) => setFormData({ ...formData, marketDemand: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الأيقونة</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition bg-white"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المهارات المكتسبة (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: GIS, QGIS, NDVI, IoT Sensors"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 transition"
                  />
                </div>

                {/* Modules Editor Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                    <span>مراحل خريطة الطريق (Zero to Hero Curriculum)</span>
                    <span className="text-xs text-slate-500 font-normal">
                      عدد المراحل حالياً: {formData.modules.length}
                    </span>
                  </h4>

                  {/* Add module mini-form */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 mb-4 space-y-3">
                    <p className="text-xs font-bold text-emerald-900">إضافة مرحلة جديدة إلى المسار:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="عنوان المرحلة (مثال: أساسيات التسميد والمحيط المائي)"
                          value={moduleInput.title}
                          onChange={(e) => setModuleInput({ ...moduleInput, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-emerald-200 outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="المدة (مثال: 3 أسابيع)"
                          value={moduleInput.duration}
                          onChange={(e) => setModuleInput({ ...moduleInput, duration: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-emerald-200 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="وصف مختصر لمحتوى المرحلة ومخرجاتها العملة"
                        value={moduleInput.desc}
                        onChange={(e) => setModuleInput({ ...moduleInput, desc: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-emerald-200 outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        placeholder="المهارات الخاصة بالمرحلة (مفصولة بفاصلة)"
                        value={moduleInput.skills}
                        onChange={(e) => setModuleInput({ ...moduleInput, skills: e.target.value })}
                        className="w-[70%] px-3.5 py-2 text-xs rounded-xl bg-white border border-emerald-200 outline-none focus:border-emerald-600"
                      />

                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        + إضافة المرحلة
                      </button>
                    </div>
                  </div>

                  {/* List of current modules */}
                  <div className="space-y-3">
                    {formData.modules.map((mod, index) => (
                      <div
                        key={mod.id || index}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                              مرحلة {index + 1}
                            </span>
                            <span>{mod.title}</span>
                            <span className="text-slate-400 font-normal">({mod.duration})</span>
                          </div>
                          <p className="text-slate-600 mt-1">{mod.desc}</p>
                          {mod.skills && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {mod.skills.map((sk) => (
                                <span key={sk} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveModule(mod.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md transition cursor-pointer"
                  >
                    حفظ التخصص وخريطة الطريق ✨
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
