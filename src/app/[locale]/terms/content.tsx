import React from "react";

export type TermSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

// ==========================================
// 🇪🇬 القسم العربي (النص الكامل)
// ==========================================
export const arabicTerms: TermSection[] = [
  {
    id: "ar-1",
    title: "المادة 1: التعريفات والمصطلحات",
    content: (
      <ul className="space-y-3 list-none text-gray-700 leading-8">
        <li><strong>1.1 "المنصة":</strong> تعني النظام البرمجي المقدم كخدمة سحابية (SaaS) لإدارة العيادات الطبية والسجل المرضي الإلكتروني.</li>
        <li><strong>1.2 "المشترك" أو "الطبيب":</strong> يعني الطبيب أو المنشأة الطبية المرخصة قانوناً والتي قامت بالتسجيل والاشتراك في المنصة.</li>
        <li><strong>1.3 "المتحكم في البيانات" (Data Controller):</strong> الطبيب المشترك، بصفته المسؤول القانوني عن شرعية جمع ومعالجة البيانات الطبية وفقاً للقانون رقم 151 لسنة 2020.</li>
        <li><strong>1.4 "معالج البيانات" (Data Processor):</strong> الشركة المشغلة للمنصة، بصفتها المزود التقني للبنية التحتية فقط دون مسؤولية عن محتوى البيانات الطبية.</li>
        <li><strong>1.5 "السجل الطبي الموحد":</strong> قاعدة بيانات مشتركة تجمع التاريخ المرضي للمريض من مختلف الأطباء المشتركين، ويتم الوصول إليها عبر آلية الموافقة الإلكترونية (OTP).</li>
        <li><strong>1.6 "رمز التحقق الآمن" (OTP):</strong> رمز مؤقت يُرسل إلى هاتف المريض أو ولي أمره، يُستخدم كتوقيع إلكتروني للموافقة على الوصول للسجل الموحد.</li>
      </ul>
    ),
  },
  {
    id: "ar-2",
    title: "المادة 2: الإقرارات والضمانات",
    content: (
      <div className="space-y-5 text-gray-700 leading-8">
        <div>
          <h4 className="font-bold text-gray-900 mb-2">2.1 إقرار المسؤولية القانونية (Controller Liability):</h4>
          <p className="mb-2">يقر الطبيب المشترك صراحة ودون تحفظ بما يلي:</p>
          <ul className="list-disc pr-5 space-y-2 text-sm md:text-base">
            <li>أ) أنه "المتحكم الوحيد" في البيانات الطبية التي يقوم بتسجيلها، وأن المنصة مجرد "معالج تقني" وفقاً للمادة 1 من قانون حماية البيانات الشخصية رقم 151 لسنة 2020.</li>
            <li>ب) أن جميع البيانات الطبية المسجلة قد تم الحصول عليها في إطار ممارسة مهنة الطب المرخصة، وبموافقة صريحة أو ضمنية من المريض أو ولي أمره الشرعي.</li>
            <li>ج) أنه يتحمل كامل المسؤولية القانونية والجنائية والمدنية عن:
              <ul className="list-circle list-inside pr-4 mt-1 text-gray-600 font-medium">
                <li>صحة البيانات الطبية المسجلة ودقتها</li>
                <li>شرعية جمع هذه البيانات</li>
                <li>أي خطأ طبي أو تشخيصي يترتب على هذه البيانات</li>
                <li>أي انتهاك لخصوصية المريض ناتج عن سوء استخدامه للمنصة</li>
              </ul>
            </li>
            <li>د) أنه حاصل على التراخيص القانونية اللازمة لممارسة مهنة الطب في جمهورية مصر العربية، وأن هذه التراخيص سارية وغير موقوفة.</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-2">2.2 إقرار بشأن الملكية الفكرية:</h4>
          <p className="mb-2">يقر الطبيب بأن المنصة البرمجية (الكود المصدري، التصميم، قواعد البيانات، الخوارزميات) هي ملكية فكرية حصرية للشركة المشغلة. الاشتراك يمنح "رخصة استخدام مؤقتة وغير حصرية وغير قابلة للتحويل" فقط، وليس نقلاً للملكية.</p>
          <p className="font-bold text-red-700">يُحظر تماماً:</p>
          <ul className="list-disc pr-5 text-red-700 space-y-1 mt-1">
             <li>نسخ أو تقليد واجهة المستخدم</li>
             <li>محاولة الهندسة العكسية (Reverse Engineering) للكود</li>
             <li>استخراج قواعد البيانات أو الخوارزميات</li>
             <li>مشاركة بيانات الدخول مع أطراف ثالثة غير مصرح لها</li>
          </ul>
        </div>

        <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md">
           <h4 className="font-bold text-red-900 text-sm">⛔ العقوبة الاتفاقية:</h4>
           <p className="text-red-800 text-sm mt-1">
             أي خرق لهذا البند يعرض المشترك لتعويض اتفاقي فوري قدره 500,000 جنيه مصري بالإضافة للتعويض الفعلي عن الأضرار.
           </p>
        </div>
      </div>
    ),
  },
  {
    id: "ar-3",
    title: "المادة 3: الوصول المشروط للسجل الطبي الموحد",
    content: (
       <div className="space-y-5 text-gray-700 leading-8">
         <div>
           <h4 className="font-bold text-gray-900">3.1 آلية الوصول المعتمدة:</h4>
           <p>السجل الطبي الموحد مُؤمّن بنظام التحقق الثنائي (Two-Factor Authentication). لا يمكن للطبيب الوصول إليه إلا عبر:</p>
           <ul className="space-y-2 mt-2">
             <li>أ) إدخال رمز التحقق (OTP) الذي يرسله المريض أو ولي أمره للطبيب طواعية.</li>
             <li>ب) <strong>الأثر القانوني لإدخال الرمز:</strong> بمجرد إدخال الطبيب للرمز الصحيح في النظام، يُعتبر ذلك قانوناً:
               <ul className="list-disc pr-5 mt-1 text-sm text-gray-600">
                  <li>إقراراً من الطبيب بحصوله على موافقة المريض الصريحة والمستنيرة</li>
                  <li>توقيعاً إلكترونياً مُعتمداً وفقاً لقانون التوقيع الإلكتروني رقم 15 لسنة 2004</li>
                  <li>موافقة كتابية لأغراض المادة 12 من قانون 151/2020</li>
               </ul>
             </li>
           </ul>
         </div>

         <div className="bg-orange-50 p-4 rounded border border-orange-200">
           <h4 className="font-bold text-orange-900 mb-2">🚨 3.2 بروتوكول الطوارئ "Break-Glass Access":</h4>
           <p className="text-sm text-orange-800 mb-2">في حالات الطوارئ الطبية المهددة للحياة (غيبوبة، حوادث، توقف قلبي، نزيف حاد) حيث يكون المريض غير قادر على منح الموافقة والوقت حرج، يجوز للطبيب استخدام خاصية "الوصول الطارئ" وفقاً للشروط التالية:</p>
           <ul className="list-disc pr-5 text-sm text-orange-800 space-y-2">
             <li><strong>الشروط الإلزامية:</strong> يجب كتابة تبرير طبي تفصيلي، ويُسجل الدخول تلقائياً في Audit Log.</li>
             <li><strong>الإخطار الفوري:</strong> يُرسل إشعار (SMS) للمريض وولي أمره ورقم الطوارئ البديل.</li>
             <li><strong>المسؤولية:</strong> يتحمل الطبيب منفرداً عبء إثبات أن الحالة كانت طوارئ حقيقية. الشركة المشغلة غير مسؤولة عن أي استخدام تعسفي.</li>
           </ul>
         </div>
       </div>
    )
  },
  {
    id: "ar-4",
    title: "المادة 4: حظر الاستخدام غير المصرح به",
    content: (
       <div className="space-y-4 text-gray-700">
          <p className="text-red-700 font-bold">4.1 القيود على استخدام البيانات - يُحظر على الطبيب حظراً قاطعاً:</p>
          <ul className="list-disc pr-5 space-y-2">
            <li>نسخ أو تصوير أو حفظ أي جزء من السجل الموحد خارج المنصة.</li>
            <li>مشاركة بيانات السجل الموحد مع شركات تأمين، أو جهات تسويقية، أو أطباء آخرين بدون إذن.</li>
            <li>استخدام البيانات لأغراض البحث العلمي أو التسويق الدوائي دون موافقة.</li>
          </ul>
          <p className="font-bold mt-4">4.2 العقوبات:</p>
          <p>أي خرق لهذا البند يُعتبر انتهاكاً جسيماً للعقد، وجريمة جنائية وفقاً للمادة 31 من قانون 151 لسنة 2020.</p>
       </div>
    )
  },
  {
    id: "ar-5",
    title: "المادة 5: دور المنصة ومسؤولياتها",
    content: (
       <ul className="space-y-4 text-gray-700 leading-7">
         <li><strong>5.1 الدور التقني المحدود:</strong> المنصة هي "معالج بيانات" فقط (توفير البنية التحتية، التشفير، النسخ الاحتياطي).</li>
         <li><strong>5.2 ما لا تضمنه المنصة:</strong>
            <ul className="list-disc pr-5 mt-1 text-sm">
               <li>المحتوى الطبي (المسؤولية الكاملة على الطبيب).</li>
               <li>القرارات الطبية (الـ AI مجرد أداة مساعدة).</li>
               <li>الامتثال القانوني للطبيب.</li>
            </ul>
         </li>
         <li><strong>5.3 الالتزامات الأمنية:</strong> التشفير بمعيار AES-256، وعدم الوصول للسجلات إلا للصيانة، والإخطار في حال الاختراق خلال 72 ساعة.</li>
       </ul>
    )
  },
  {
    id: "ar-6",
    title: "المادة 6: الذكاء الاصطناعي والأدوات المساعدة",
    content: (
       <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 text-gray-800">
          <p className="mb-2"><strong>6.1 طبيعة الأدوات:</strong> تقدم المنصة تحليلات إحصائية وتنبيهات تعارض دوائي.</p>
          <h4 className="font-bold text-yellow-800 mt-2">⚠️ 6.2 إخلاء مسؤولية صريح:</h4>
          <p className="text-sm mt-1 leading-6">
            مخرجات الذكاء الاصطناعي قد تحتوي على أخطاء ("Hallucinations"). يجب على الطبيب التحقق يدوياً من كل نصيحة.
            <br/>
            <strong>المسؤولية النهائية:</strong> القرار الطبي ومسؤولية العلاج تقع بالكامل على عاتق الطبيب البشري.
          </p>
       </div>
    )
  },
  {
    id: "ar-7",
    title: "المادة 7: الاشتراكات والمدفوعات",
    content: (
       <div className="space-y-4 text-gray-700">
          <p><strong>7.1 نموذج التسعير:</strong> اشتراك شهري (SaaS) قابل للتعديل بإخطار مسبق 30 يوماً.</p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
             <h4 className="font-bold mb-2">7.3 نظام التأخر في السداد:</h4>
             <ul className="space-y-2 text-sm">
                <li>🟢 <strong>اليوم 1-7 (سماح):</strong> يعمل الحساب بشكل طبيعي.</li>
                <li>🟠 <strong>اليوم 8-14 (قراءة فقط):</strong> يمكن الاطلاع والتصدير، لا يمكن إضافة زيارات جديدة.</li>
                <li>🔴 <strong>بعد اليوم 15 (إيقاف):</strong> أرشفة الحساب وحجب الوصول حتى السداد.</li>
             </ul>
          </div>
          <p className="text-sm"><strong>7.4 عدم حذف البيانات:</strong> البيانات لا تُحذف عند الإيقاف المالي حفاظاً على سلامة المرضى.</p>
       </div>
    )
  },
  {
    id: "ar-8",
    title: "المادة 8: إنهاء الاشتراك وملكية البيانات",
    content: (
       <div className="space-y-3 text-gray-700 leading-7">
          <p><strong>8.1 الإلغاء:</strong> يحق للطبيب الإلغاء في أي وقت بإشعار 7 أيام.</p>
          <p><strong>8.2 نقل البيانات (Data Portability):</strong> يلتزم النظام بتوفير أدوات تصدير (Excel/PDF/ZIP) لكامل بيانات الطبيب خلال 30 يوماً من الطلب.</p>
          <p><strong>8.3 الأرشفة:</strong> يتم الاحتفاظ بنسخة مؤرشفة لمدة 10 سنوات (التزام قانوني) ولا يمكن الوصول إليها إلا بأمر قضائي.</p>
       </div>
    )
  },
  {
    id: "ar-9",
    title: "المادة 9: السرية الضريبية والمالية",
    content: (
       <div className="text-gray-700 space-y-2">
          <p><strong>9.1 حماية المعلومات:</strong> تتعهد الشركة بالحفاظ التام على سرية عدد المرضى ودخل العيادة.</p>
          <p><strong>9.2 عدم الإفصاح:</strong> لا يحق للمنصة مشاركة أي بيانات مالية مع مصلحة الضرائب أو أي جهة حكومية إلا بموجب <strong>أمر قضائي</strong> رسمي ومحدد.</p>
       </div>
    )
  },
  {
    id: "ar-10",
    title: "المادة 10: الأمان وحماية الحساب",
    content: (
       <ul className="list-disc pr-5 text-gray-700 space-y-2">
          <li><strong>مسؤولية الطبيب:</strong> الحساب شخصي. الطبيب مسؤول عن حفظ كلمة المرور وعدم مشاركتها مع المساعدين (يجب استخدام الحسابات الفرعية Sub-Accounts).</li>
          <li><strong>إخلاء المسؤولية:</strong> المنصة غير مسؤولة عن أي تسريب ناتج عن إهمال الطبيب في حفظ بيانات دخوله.</li>
       </ul>
    )
  },
  {
    id: "ar-11",
    title: "المادة 11: التوافر وجودة الخدمة (SLA)",
    content: (
       <div className="space-y-3 text-gray-700">
          <p>تسعى المنصة لضمان عمل النظام بنسبة 99% شهرياً.</p>
          <ul className="list-disc pr-5 text-sm">
             <li><strong>القوة القاهرة:</strong> المنصة غير مسؤولة عن انقطاع الإنترنت لدى الطبيب أو الكوارث الطبيعية.</li>
             <li><strong>الوضع غير المتصل (Offline Mode):</strong> يحتفظ الويب بنسخة مخبأة (Cached) لآخر 30 زيارة لضمان استمرار العمل الأساسي عند انقطاع النت.</li>
          </ul>
       </div>
    )
  },
  {
    id: "ar-12",
    title: "المادة 12: حدود المسؤولية والتعويضات",
    content: (
       <div className="text-gray-700 space-y-2">
          <p><strong>12.1 الحد الأقصى:</strong> مسؤولية المنصة لا تتجاوز إجمالي اشتراكات 6 أشهر.</p>
          <p><strong>12.3 إخلاء المسؤولية الطبية:</strong> المنصة ليست مؤسسة طبية. أي قرار طبي هو مسؤولية الطبيب وحده.</p>
       </div>
    )
  },
  {
    id: "ar-13",
    title: "المادة 13: الامتثال للقوانين",
    content: (
       <p className="text-gray-700">
         يخضع هذا العقد للقوانين المصرية (قانون 151 لسنة 2020، وقانون مزاولة مهنة الطب). تختص محاكم القاهرة بنظر أي نزاع.
       </p>
    )
  },
  {
    id: "ar-14",
    title: "المادة 14: التعديلات على الشروط",
    content: (
       <p className="text-gray-700">
         تحتفظ الشركة بحق تعديل الشروط مع إخطار المشتركين قبل 30 يوماً. الاستمرار في الاستخدام يعتبر موافقة ضمنية.
       </p>
    )
  },
  {
    id: "ar-15",
    title: "المادة 15: أحكام ختامية",
    content: (
       <p className="text-gray-700">
         هذه الوثيقة تشكل الاتفاق الكامل. في حال وجود تعارض لغوي، النسخة العربية هي المرجع في مصر.
         <br /><br />
         <strong>بالضغط على "أوافق"، أنت تقر بقراءة هذه الشروط وفهمها.</strong>
       </p>
    )
  },
];

// ==========================================
// 🇬🇧 القسم الإنجليزي (Full Text)
// ==========================================
export const englishTerms: TermSection[] = [
  {
    id: "en-1",
    title: "ARTICLE 1: DEFINITIONS",
    content: (
      <ul className="space-y-3 list-none text-gray-700 leading-8">
        <li><strong>1.1 'Platform':</strong> The cloud-based software system provided as a Service (SaaS) for medical clinic management and electronic patient records.</li>
        <li><strong>1.2 'Subscriber' or 'Physician':</strong> A legally licensed medical practitioner or medical facility that has registered and subscribed to the Platform.</li>
        <li><strong>1.3 'Data Controller':</strong> The subscribing Physician, legally responsible for the legitimacy of collecting and processing medical data in accordance with Egyptian Law No. 151/2020.</li>
        <li><strong>1.4 'Data Processor':</strong> The Company operating the Platform, acting solely as a technical infrastructure provider without responsibility for medical content.</li>
        <li><strong>1.5 'Unified Medical Record':</strong> A shared database aggregating a patient's medical history from multiple subscribing physicians, accessible via electronic consent mechanism (OTP).</li>
        <li><strong>1.6 'One-Time Password (OTP)':</strong> A temporary code sent to the patient's or guardian's phone, serving as an electronic signature for consent to access the Unified Record.</li>
      </ul>
    ),
  },
  {
    id: "en-2",
    title: "ARTICLE 2: REPRESENTATIONS AND WARRANTIES",
    content: (
       <div className="space-y-5 text-gray-700 leading-8">
         <div>
           <h4 className="font-bold text-gray-900 mb-2">2.1 Controller Liability Declaration:</h4>
           <p className="mb-2">The subscribing Physician expressly and unconditionally acknowledges:</p>
           <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
             <li>a) That they are the "sole Data Controller" for medical data entered, and the Platform is merely a "technical processor".</li>
             <li>b) That all recorded medical data was obtained within the scope of licensed medical practice and with express or implied consent.</li>
             <li>c) Full legal, criminal, and civil responsibility for accuracy, legitimacy, and any malpractice arising from this data.</li>
             <li>d) Possession of valid, unrestricted licenses to practice medicine in Egypt.</li>
           </ul>
         </div>
         
         <div>
           <h4 className="font-bold text-gray-900 mb-2">2.2 Intellectual Property Acknowledgment:</h4>
           <p className="mb-2">Physician acknowledges that the Platform software is exclusive IP of the Company. Subscription grants a "temporary license" only.</p>
           <p className="font-bold text-red-700">Strictly Prohibited:</p>
           <ul className="list-disc pl-5 text-red-700 space-y-1 mt-1">
              <li>Copying or mimicking the user interface</li>
              <li>Reverse engineering the code</li>
              <li>Sharing login credentials</li>
           </ul>
         </div>

         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <h4 className="font-bold text-red-900 text-sm">⛔ Liquidated Damages:</h4>
            <p className="text-red-800 text-sm mt-1">
              Breach of this clause subjects Subscriber to immediate liquidated damages of 500,000 EGP plus actual damages.
            </p>
         </div>
       </div>
    ),
  },
  {
    id: "en-3",
    title: "ARTICLE 3: CONDITIONAL ACCESS TO UNIFIED MEDICAL RECORD",
    content: (
      <div className="space-y-5 text-gray-700 leading-8">
        <div>
          <h4 className="font-bold text-gray-900">3.1 Authorized Access Mechanism:</h4>
          <p>Access requires Two-Factor Authentication via OTP provided by the patient.</p>
          <p className="mt-2 text-sm"><strong>Legal Effect:</strong> Entry of OTP constitutes Physician's declaration of obtaining consent and serves as a certified electronic signature.</p>
        </div>

        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <h4 className="font-bold text-orange-900 mb-2">🚨 3.2 Emergency 'Break-Glass' Protocol:</h4>
          <p className="text-sm text-orange-800 mb-2">In life-threatening emergencies where patient cannot provide consent, Physician may use 'Emergency Access' subject to:</p>
          <ul className="list-disc pl-5 text-sm text-orange-800 space-y-2">
            <li><strong>Mandatory:</strong> Detailed medical justification logged in Audit Log.</li>
            <li><strong>Notification:</strong> Immediate SMS/Push sent to Patient/Guardian.</li>
            <li><strong>Liability:</strong> Physician bears sole burden of proof. Company not liable for abuse.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "en-4",
    title: "ARTICLE 4: PROHIBITED USES",
    content: (
       <div className="space-y-4 text-gray-700">
          <p className="text-red-700 font-bold">4.1 Data Use Restrictions - Strictly Prohibited:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Copying or saving Unified Record data outside the Platform.</li>
            <li>Sharing data with insurance/marketing companies without consent.</li>
            <li>Using data for research/marketing without independent ethics approval.</li>
          </ul>
          <p className="font-bold mt-4">4.2 Penalties:</p>
          <p>Breach constitutes gross contract violation, criminal offense per Law 151/2020, and grounds for civil compensation.</p>
       </div>
    )
  },
  {
    id: "en-5",
    title: "ARTICLE 5: PLATFORM ROLE AND RESPONSIBILITIES",
    content: (
       <ul className="space-y-4 text-gray-700 leading-7">
         <li><strong>5.1 Limited Technical Role:</strong> Platform acts as "Data Processor" only (Infrastructure, Encryption, Backups).</li>
         <li><strong>5.2 Non-Guarantees:</strong> Platform does not verify Medical Content. AI is a support tool only. Platform not responsible for Physician's legal compliance.</li>
         <li><strong>5.3 Security:</strong> AES-256 encryption, strict access control, and 72-hour breach notification policy.</li>
       </ul>
    )
  },
  {
    id: "en-6",
    title: "ARTICLE 6: ARTIFICIAL INTELLIGENCE AND ASSISTIVE TOOLS",
    content: (
       <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 text-gray-800">
          <p className="mb-2"><strong>6.1 Tools:</strong> Platform provides statistical analysis and drug interaction alerts.</p>
          <h4 className="font-bold text-yellow-800 mt-2">⚠️ 6.2 Express Disclaimer:</h4>
          <p className="text-sm mt-1 leading-6">
            AI outputs may contain errors ("hallucinations"). Physician must manually verify every recommendation.
            <br/>
            <strong>Final Responsibility:</strong> Ultimate medical decision lies entirely with the human Physician.
          </p>
       </div>
    )
  },
  {
    id: "en-7",
    title: "ARTICLE 7: SUBSCRIPTIONS AND PAYMENTS",
    content: (
       <div className="space-y-4 text-gray-700">
          <p><strong>7.1 Pricing:</strong> Monthly SaaS subscription. 30-day notice for price changes.</p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
             <h4 className="font-bold mb-2">7.3 Payment Default System:</h4>
             <ul className="space-y-2 text-sm">
                <li>🟢 <strong>Days 1-7 (Grace):</strong> Normal operation.</li>
                <li>🟠 <strong>Days 8-14 (Read-Only):</strong> View/Export only. No new entries.</li>
                <li>🔴 <strong>After Day 15 (Suspension):</strong> Account archived. Access blocked until payment.</li>
             </ul>
          </div>
          <p className="text-sm"><strong>7.4 Data Non-Deletion:</strong> Data is not deleted upon suspension for safety reasons.</p>
       </div>
    )
  },
  {
    id: "en-8",
    title: "ARTICLE 8: TERMINATION AND DATA OWNERSHIP",
    content: (
       <div className="space-y-3 text-gray-700 leading-7">
          <p><strong>8.1 Cancellation:</strong> Anytime with 7-day notice.</p>
          <p><strong>8.2 Data Portability:</strong> Platform provides export tools (Excel/PDF/ZIP) within 30 days of request.</p>
          <p><strong>8.3 Archiving:</strong> Data retained for 10 years (legal obligation) unless permanent delete is requested with waiver.</p>
       </div>
    )
  },
  {
    id: "en-9",
    title: "ARTICLE 9: TAX AND FINANCIAL CONFIDENTIALITY",
    content: (
       <div className="text-gray-700 space-y-2">
          <p><strong>9.1 Protection:</strong> Company commits to complete confidentiality of patient counts and income.</p>
          <p><strong>9.2 Non-Disclosure:</strong> No sharing with Tax Authority or government entities except by specific <strong>Court Order</strong>.</p>
       </div>
    )
  },
  {
    id: "en-10",
    title: "ARTICLE 10: SECURITY AND ACCOUNT PROTECTION",
    content: (
       <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li><strong>Responsibility:</strong> Account is personal. Physician must not share credentials (use Sub-Accounts instead).</li>
          <li><strong>Disclaimer:</strong> Platform not responsible for leaks due to Physician negligence.</li>
       </ul>
    )
  },
  {
    id: "en-11",
    title: "ARTICLE 11: AVAILABILITY AND SERVICE QUALITY (SLA)",
    content: (
       <div className="space-y-3 text-gray-700">
          <p>Platform strives for 99% uptime.</p>
          <ul className="list-disc pl-5 text-sm">
             <li><strong>Force Majeure:</strong> Not liable for internet outages or natural disasters.</li>
             <li><strong>Offline Mode:</strong> Web app caches last 30 visits for basic offline viewing.</li>
          </ul>
       </div>
    )
  },
  {
    id: "en-12",
    title: "ARTICLE 12: LIABILITY LIMITATIONS",
    content: (
       <div className="text-gray-700 space-y-2">
          <p><strong>12.1 Cap:</strong> Liability limited to 6 months of subscription fees.</p>
          <p><strong>12.3 Disclaimer:</strong> Platform is not a medical institution. Medical decisions are Physician's sole responsibility.</p>
       </div>
    )
  },
  {
    id: "en-13",
    title: "ARTICLE 13: LEGAL COMPLIANCE",
    content: (
       <p className="text-gray-700">
         Governed by Egyptian Laws (Law 151/2020, Medical Practice Law). Exclusive jurisdiction: Cairo Courts.
       </p>
    )
  },
  {
    id: "en-14",
    title: "ARTICLE 14: AMENDMENTS",
    content: (
       <p className="text-gray-700">
         Company may amend terms with 30-day notice. Continued use implies acceptance.
       </p>
    )
  },
  {
    id: "en-15",
    title: "ARTICLE 15: FINAL PROVISIONS",
    content: (
       <p className="text-gray-700">
         This document is the entire agreement. Arabic version prevails in Egypt.
         <br /><br />
         <strong>By clicking 'Accept', you acknowledge reading and understanding these terms.</strong>
       </p>
    )
  },
];