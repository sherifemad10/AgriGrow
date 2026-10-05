import AboutImg from '../../assets/sign.jpeg'
import Wave from '../../UI/Wave'
import { ArrowLeft, BookOpen, CheckCircle2, FlaskConical, Leaf } from 'lucide-react'

const AboutUs = () => {
  return (
    <section
      id="about"
      dir="rtl"
      className="
        relative scroll-mt-24 overflow-hidden
        bg-[#f5f8f1]
        pt-24 sm:pt-28 lg:pt-32
        pb-20 lg:pb-28
      "
    >
      {/* Background Wave */}
      <div className="absolute inset-x-0 top-0 z-0">
        <Wave fill="#eef4e8" />
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute right-[-100px] top-40 h-72 w-72 rounded-full bg-[#dcebd7] opacity-60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-[-120px] h-80 w-80 rounded-full bg-[#dcebd7] opacity-50 blur-3xl" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Grid Background */}
        <div
          className="
            pointer-events-none absolute inset-0 -z-10 opacity-60
            [background-image:linear-gradient(rgba(20,83,45,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.045)_1px,transparent_1px)]
            [background-size:42px_42px]
          "
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ================= IMAGE ================= */}
          <div className="relative order-1 lg:order-1">

            {/* Decorative Circle */}
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border-[10px] border-[#dcebd7] sm:h-28 sm:w-28" />

            {/* Image Container */}
            <div
              className="
                group relative overflow-hidden
                rounded-[2rem]
                border border-white/70
                bg-white
                p-2
                shadow-[0_25px_70px_rgba(20,83,45,0.12)]
              "
            >
              <div className="relative overflow-hidden rounded-[1.6rem]">
                <img
                  src={AboutImg}
                  alt="منصة جَرِي جرو لمساعدة المهندسين والطلاب الزراعيين"
                  className="
                    h-[380px] w-full object-cover
                    transition duration-700
                    group-hover:scale-105
                    sm:h-[480px]
                    lg:h-[560px]
                  "
                />

                {/* Image Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-[#14532d]/70
                    via-transparent
                    to-transparent
                  "
                />

                {/* Bottom Badge */}
                <div
                  className="
                    absolute bottom-5 right-5 left-5
                    flex items-center gap-3
                    rounded-2xl
                    border border-white/20
                    bg-white/15
                    p-4
                    text-white
                    backdrop-blur-md
                  "
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Leaf size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/80">
                      مستقبل الزراعة يبدأ بالمعرفة
                    </p>

                    <p className="text-base font-bold">
                      تعلّم • تطوّر • تقدّم
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div
              className="
                absolute -bottom-7 -left-3
                hidden
                items-center gap-3
                rounded-2xl
                border border-[#e3eee0]
                bg-white
                px-5 py-4
                shadow-xl
                sm:flex
                lg:-left-8
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f3e5] text-[#176b43]">
                <BookOpen size={22} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  خريطة تعلم منظمة
                </p>

                <p className="font-bold text-[#14532d]">
                  من البداية إلى سوق العمل
                </p>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="order-2 text-right">

            {/* Section Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7e7d2] bg-white/80 px-4 py-2 text-sm font-semibold text-[#176b43] shadow-sm">
              <Leaf size={17} />

              <span>من نحن</span>
            </div>

            {/* Heading */}
            <h2
              className="
                max-w-2xl
                text-3xl
                font-extrabold
                leading-[1.35]
                tracking-tight
                text-[#123c29]
                sm:text-4xl
                lg:text-[46px]
              "
            >
              نساعدك على اكتشاف
              <span className="text-[#20804f]"> طريقك </span>
              في المجال الزراعي
            </h2>

            {/* Accent Line */}
            <div className="my-6 flex items-center justify-end gap-2">
              <span className="h-1 w-16 rounded-full bg-[#20804f]" />
              <span className="h-1 w-3 rounded-full bg-[#b8d6ae]" />
            </div>

            {/* Description */}
            <div className="space-y-5 text-base leading-8 text-[#52645a] sm:text-lg">

              <p>
                <strong className="font-bold text-[#174f32]">
                  جَرِي جرو
                </strong>{' '}
                هي منصة صُممت خصيصًا لمساعدة المهندسين والطلاب الزراعيين
                على اكتشاف التخصصات والمسارات المختلفة في المجال الزراعي،
                والتعرف على طبيعة كل تخصص والمهارات التي يحتاجها سوق العمل.
              </p>

              <p>
                ولأننا نؤمن بأن التعلم الحقيقي يبدأ من التنظيم ويبتعد عن
                التشتت، قمنا بتوفير خريطة تعلم واضحة لكل تخصص، تبدأ من
                الأساسيات وتنتقل بك خطوة بخطوة حتى الوصول إلى مستوى يؤهلك
                لسوق العمل.
              </p>

              <p>
                من خلال خريطة التعلم، يمكنك معرفة ما تحتاج إلى دراسته في
                كل مرحلة، ومتابعة ما تم إنجازه، وتسجيل المهارات والموضوعات
                التي تعلمتها، بالإضافة إلى متابعة تقدمك بشكل مستمر داخل
                المسار الذي اخترته.
              </p>

              <p>
                كما توفر المنصة قسمًا خاصًا بـ
                <span className="font-bold text-[#176b43]">
                  {' '}أحدث الأبحاث والتطورات في المجال الزراعي
                </span>
                ، حتى تظل على اطلاع دائم بأحدث المعارف والدراسات
                والتوجهات التي تساعدك على تطوير مهاراتك وفهمك للمجال.
              </p>

            </div>

            {/* Features */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              {/* Feature */}
              <div
                className="
                  rounded-2xl
                  border border-[#e1ebe0]
                  bg-white/80
                  p-4
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#176b43]">
                  <BookOpen size={20} />
                </div>

                <h3 className="font-bold text-[#174f32]">
                  خرائط تعلم
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  مسارات منظمة لكل تخصص
                </p>
              </div>

              {/* Feature */}
              <div
                className="
                  rounded-2xl
                  border border-[#e1ebe0]
                  bg-white/80
                  p-4
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#176b43]">
                  <CheckCircle2 size={20} />
                </div>

                <h3 className="font-bold text-[#174f32]">
                  متابعة التقدم
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  اعرف ما أنجزته وما تبقى
                </p>
              </div>

              {/* Feature */}
              <div
                className="
                  rounded-2xl
                  border border-[#e1ebe0]
                  bg-white/80
                  p-4
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4e7] text-[#176b43]">
                  <FlaskConical size={20} />
                </div>

                <h3 className="font-bold text-[#174f32]">
                  أحدث الأبحاث
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  تابع تطورات المجال الزراعي
                </p>
              </div>

            </div>

            {/* Closing Quote */}
            <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[#dcebd7] bg-[#edf5e9] p-5">

              <div>
                <p className="text-sm font-medium text-[#52705e]">
                  رؤيتنا
                </p>

                <p className="mt-1 text-lg font-bold text-[#14532d]">
                  بالعلم والمعرفة ترتقي الأمم
                </p>
              </div>

              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#176b43] shadow-sm sm:flex">
                <ArrowLeft size={20} />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs