import { DistrictInfo, WorldEntity, InventoryItem, DistrictId } from '../types/game';

export const CITY_DISTRICTS: DistrictInfo[] = [
  {
    id: 'SECURITY_HQ',
    name: 'مركز القيادة والدرع السيبراني',
    arabicTitle: 'مركز الأمن والقيادة 🛡️',
    description: 'المقر الرئيسي لحراس الأمن السيبراني ومفاعل توليد درع الحماية الرقمي.',
    stageId: 1,
    x: 400,
    y: 400,
    width: 200,
    height: 180,
    color: '#0284c7',
    icon: 'Shield'
  },
  {
    id: 'LAW_COURT',
    name: 'مجمع التشريعات والقوانين',
    arabicTitle: 'مجمع العدالة الرقمية ⚖️',
    description: 'أرشيف قانون الجرائم الإلكترونية الأردني (2023) وأسباب انتشار الجرائم.',
    stageId: 2,
    x: 120,
    y: 380,
    width: 200,
    height: 170,
    color: '#059669',
    icon: 'Scale'
  },
  {
    id: 'SERVER_TOWER',
    name: 'أبراج الخوادم والشبكة المركزية',
    arabicTitle: 'برج السيرفر والشبكة 🌐',
    description: 'القلب النابض لاتصالات المدينة، هدف دائم لمحاولات الاختراق غير المصرح بها.',
    stageId: 3,
    x: 120,
    y: 120,
    width: 200,
    height: 180,
    color: '#9333ea',
    icon: 'Server'
  },
  {
    id: 'MALWARE_LAB',
    name: 'مختبر مكافحة البرمجيات الخبيثة',
    arabicTitle: 'مختبر الفيروسات 💻',
    description: 'مركز تحليل وعزل الفيروسات وبرامج التجسس وتطهير الأجهزة والمعدات.',
    stageId: 4,
    x: 400,
    y: 120,
    width: 200,
    height: 180,
    color: '#e11d48',
    icon: 'Bug'
  },
  {
    id: 'DATA_CENTER',
    name: 'مركز البيانات وتدقيق السجلات',
    arabicTitle: 'خزانة البيانات 🏢',
    description: 'مستودع السجلات المدرسية والطبية والحكومية وحمايتها من التلاعب والحذف غير القانوني.',
    stageId: 5,
    x: 680,
    y: 120,
    width: 200,
    height: 180,
    color: '#d97706',
    icon: 'Database'
  },
  {
    id: 'COMMS_HUB',
    name: 'مركز الاتصالات وصندوق البريد',
    arabicTitle: 'محطة البريد الإلكتروني 📱',
    description: 'محطة رصد رسائل التصيد والاحتيال والروابط الخادعة الواردة عبر الشبكة.',
    stageId: 6,
    x: 680,
    y: 380,
    width: 200,
    height: 170,
    color: '#2563eb',
    icon: 'Mail'
  },
  {
    id: 'CYBER_BANK',
    name: 'بنك الأمان وحماية الهوية',
    arabicTitle: 'بنك الأمان الرقمي 🏦',
    description: 'حماية الهويات الرقمية والمعلومات الشخصية من السرقة والانتحال بهدف الحصول على المال.',
    stageId: 7,
    x: 120,
    y: 640,
    width: 200,
    height: 180,
    color: '#0891b2',
    icon: 'Landmark'
  },
  {
    id: 'RANSOM_BUNKER',
    name: 'مخزن النسخ الاحتياطي وحماية الفدية',
    arabicTitle: 'مستودع النسخ الاحتياطي 💾',
    description: 'غرفة طوارئ مجهزة لاستعادة البيانات ومواجهة برمجيات الفدية الرقمية دون دفع أي أموال.',
    stageId: 8,
    x: 400,
    y: 660,
    width: 200,
    height: 170,
    color: '#ca8a04',
    icon: 'HardDrive'
  },
  {
    id: 'SCHOOL_ACADEMY',
    name: 'مدرسة المدينة الرقمية',
    arabicTitle: 'أكاديمية المعرفة 🏫',
    description: 'بيئة تعليمية آمنة توفر الدعم والإرشاد للتصدي للابتزاز الإلكتروني وتوثيق الأدلة.',
    stageId: 9,
    x: 680,
    y: 640,
    width: 200,
    height: 180,
    color: '#4f46e5',
    icon: 'GraduationCap'
  },
  {
    id: 'SHIELD_CORE',
    name: 'مفاعل الدرع الرقمي الموحد',
    arabicTitle: 'مفاعل الدرع الخارق 🛡️',
    description: 'تجميع وسائل الوقاية السبع المذكورة في الكتاب لتوليد طاقة درع 100%.',
    stageId: 10,
    x: 350,
    y: 910,
    width: 300,
    height: 170,
    color: '#06b6d4',
    icon: 'ShieldCheck'
  },
  {
    id: 'CITIZEN_PLAZA',
    name: 'ساحة المواطنة الرقمية',
    arabicTitle: 'ساحة السلوك المسؤول 🕊️',
    description: 'منارة تطبيق ركائز المواطنة الرقمية الخمسة والتواصل الآمن.',
    stageId: 11,
    x: 120,
    y: 910,
    width: 190,
    height: 170,
    color: '#10b981',
    icon: 'Compass'
  },
  {
    id: 'BOSS_CITADEL',
    name: 'قلعة الهجوم السيبراني النهائي',
    arabicTitle: 'قلعة الزعيم السيبراني ⚔️',
    description: 'موقع المعركة النهائية الكبرى لصد الهجوم المركب وتحرير المدينة بالكامل.',
    stageId: 12,
    x: 690,
    y: 910,
    width: 190,
    height: 170,
    color: '#e11d48',
    icon: 'Flame'
  }
];

export const WORLD_ENTITIES: WorldEntity[] = [
  // NPCs
  {
    id: 'npc_nova',
    name: '🤖 نوفا (Nova) — المرشد السيبراني',
    type: 'NPC',
    x: 500,
    y: 470,
    width: 36,
    height: 36,
    districtId: 'SECURITY_HQ',
    dialogue: [
      "أهلاً بك يا بطل في مدينة الفضاء الرقمي! أنا نوفا مرشدتك الذكية.",
      "تعرضت مدينتنا لسلسلة هجمات إلكترونية غير قانونية مخالفة لأحكام القانون.",
      "مهمتك هي حماية القطاعات الـ 12 وجمع عناصر الدرع الرقمي السبعة!",
      "تحرك باستخدام الأسهم أو WASD (أو أزرار اللمس على الهاتف) واقترب من الأجهزة والشخصيات للتفاعل!"
    ],
    actionPrompt: 'محادثة نوفا 🤖'
  },
  {
    id: 'npc_engineer',
    name: '👨‍💻 م. باسل (مسؤول الشبكة)',
    type: 'NPC',
    x: 210,
    y: 190,
    width: 36,
    height: 36,
    districtId: 'SERVER_TOWER',
    stageId: 3,
    dialogue: [
      "يا هلا بحارس الأمن السيبراني! الخوادم عم تتعرض لمحاولات اختراق خطيرة!",
      "الاختراق هو الوصول غير المصرّح به لأنظمة الحاسوب أو الشبكات بغية سرقة المعلومات أو العبث بها أو تعطيل نظام التشغيل.",
      "ساعدني بإغلاق المنافذ المفتوحة وتفعيل الجدار الناري فوراً!"
    ],
    actionPrompt: 'مساعدة مهندس الشبكة 👨‍💻'
  },
  {
    id: 'npc_scientist',
    name: '👩‍🔬 د. سارة (خبيرة الفيروسات)',
    type: 'NPC',
    x: 490,
    y: 190,
    width: 36,
    height: 36,
    districtId: 'MALWARE_LAB',
    stageId: 4,
    dialogue: [
      "أهلاً بك في مختبر العزل! البرمجيات الخبيثة تنتشر في الذاكرة!",
      "البرمجيات الخبيثة تشمل الفيروسات وبرامج التجسس وهدفها إتلاف أجهزة الحاسوب وسرقة المعلومات.",
      "افحص عينات الأجهزة واعزل الملفات الضارة لجمع مكافح الفيروسات!"
    ],
    actionPrompt: 'فحص مختبر البرمجيات 👩‍🔬'
  },
  {
    id: 'npc_databoss',
    name: '👨‍💼 عمر (مدير البيانات)',
    type: 'NPC',
    x: 770,
    y: 190,
    width: 36,
    height: 36,
    districtId: 'DATA_CENTER',
    stageId: 5,
    dialogue: [
      "حارس الأمن السيبراني! رصدنا تلاعباً غير قانوني في السجلات!",
      "التلاعب بالبيانات هو تغيير المعلومات أو حذفها بصورة غير قانونية.",
      "قارن السجلات الحالية بالأصلية وابطِل أي تعديل أو حذف غير مأذون به!"
    ],
    actionPrompt: 'تدقيق سجلات البيانات 👨‍💼'
  },
  {
    id: 'npc_teacher',
    name: '👩‍🏫 المعلمة ليلى',
    type: 'NPC',
    x: 770,
    y: 710,
    width: 36,
    height: 36,
    districtId: 'SCHOOL_ACADEMY',
    stageId: 9,
    dialogue: [
      "أهلاً بك يا بطل! طالبنا طارق تعرض لموقف ابتزاز إلكتروني خطير.",
      "الابتزاز الإلكتروني هو التهديد بالكشف عن معلومات مهمة أو إلحاق الضرر بالأجهزة لإجباره على دفع فدية مالية لقاء رفع الأذى عنه.",
      "علّم طارق التصرف الصحيح: لا خضوع، لا دفع فدية، توثيق الأدلة، والإبلاغ الفوري!"
    ],
    actionPrompt: 'التحدث مع المعلمة 👩‍🏫'
  },
  {
    id: 'npc_student',
    name: '🧑‍🎓 الطالب طارق',
    type: 'NPC',
    x: 720,
    y: 730,
    width: 36,
    height: 36,
    districtId: 'SCHOOL_ACADEMY',
    stageId: 9,
    dialogue: [
      "مرحباً يا حارس الأمن! وصلني تهديد على هاتفي بدفع 50 ديناراً أو سينشرون صوري ويخربون جهازي!",
      "أنا خائف ومتردد... هل أرسل لهم المال؟",
      "أرجوك ساعدني على اتخاذ القرار السليم كما تعلمنا في درس الجريمة الإلكترونية!"
    ],
    actionPrompt: 'إنقاذ الطالب طارق 🧑‍🎓'
  },

  // Mission Terminals
  {
    id: 'term_stage_1',
    name: 'رادار كشف الجريمة والبصمات',
    type: 'TERMINAL',
    x: 440,
    y: 470,
    width: 36,
    height: 36,
    districtId: 'SECURITY_HQ',
    stageId: 1,
    actionPrompt: 'تشغيل رادار الاستطلاع 📡'
  },
  {
    id: 'term_stage_2',
    name: 'أرشيف قانون 2023 وأسباب الانتشار',
    type: 'TERMINAL',
    x: 210,
    y: 460,
    width: 36,
    height: 36,
    districtId: 'LAW_COURT',
    stageId: 2,
    actionPrompt: 'فك شيفرة التشريعات ⚖️'
  },
  {
    id: 'term_stage_3',
    name: 'سيرفر التحكم بالشبكة (صد الاختراق)',
    type: 'SERVER',
    x: 230,
    y: 230,
    width: 40,
    height: 40,
    districtId: 'SERVER_TOWER',
    stageId: 3,
    actionPrompt: 'إغلاق منافذ الاختراق 🌐'
  },
  {
    id: 'term_stage_4',
    name: 'كبسولة عزل الفيروسات والتجسس',
    type: 'TERMINAL',
    x: 510,
    y: 230,
    width: 40,
    height: 40,
    districtId: 'MALWARE_LAB',
    stageId: 4,
    actionPrompt: 'عزل البرمجيات الخبيثة 🦠'
  },
  {
    id: 'term_stage_5',
    name: 'محطة تدقيق السجلات وقاعدة البيانات',
    type: 'TERMINAL',
    x: 790,
    y: 230,
    width: 40,
    height: 40,
    districtId: 'DATA_CENTER',
    stageId: 5,
    actionPrompt: 'كشف التلاعب بالبيانات 🏢'
  },
  {
    id: 'term_stage_6',
    name: 'صندوق البريد الإلكتروني (كشف التصيد)',
    type: 'TERMINAL',
    x: 770,
    y: 460,
    width: 36,
    height: 36,
    districtId: 'COMMS_HUB',
    stageId: 6,
    actionPrompt: 'فحص صندوق البريد 📩'
  },
  {
    id: 'term_stage_7',
    name: 'خزينة حماية الهوية الرقمية للبنك',
    type: 'TERMINAL',
    x: 210,
    y: 720,
    width: 36,
    height: 36,
    districtId: 'CYBER_BANK',
    stageId: 7,
    actionPrompt: 'إحباط سرقة الهوية 👤'
  },
  {
    id: 'term_stage_8',
    name: 'غرفة طوارئ هجوم الفدية الرقمية',
    type: 'TERMINAL',
    x: 490,
    y: 735,
    width: 36,
    height: 36,
    districtId: 'RANSOM_BUNKER',
    stageId: 8,
    actionPrompt: 'إنقاذ الملفات والنسخ الاحتياطي 💾'
  },
  {
    id: 'term_stage_10',
    name: 'مفاعل توليد الدرع الرقمي 100%',
    type: 'TERMINAL',
    x: 490,
    y: 980,
    width: 45,
    height: 45,
    districtId: 'SHIELD_CORE',
    stageId: 10,
    actionPrompt: 'بناء الدرع السيبراني 🛡️'
  },
  {
    id: 'term_stage_11',
    name: 'منارة المواطنة الرقمية والسلوك المسؤول',
    type: 'TERMINAL',
    x: 210,
    y: 980,
    width: 36,
    height: 36,
    districtId: 'CITIZEN_PLAZA',
    stageId: 11,
    actionPrompt: 'تفعيل منارة المواطنة 🕊️'
  },
  {
    id: 'term_stage_12',
    name: 'بوابة الحصن لمواجهة الهجوم النهائي',
    type: 'DOOR',
    x: 770,
    y: 980,
    width: 45,
    height: 45,
    districtId: 'BOSS_CITADEL',
    stageId: 12,
    actionPrompt: 'خوض المعركة النهائية ⚔️'
  },
  // Energy Recharge Station
  {
    id: 'station_recharge',
    name: 'محطة شحن طاقة القلوب والأمن',
    type: 'TERMINAL',
    x: 550,
    y: 470,
    width: 36,
    height: 36,
    districtId: 'SECURITY_HQ',
    dialogue: [
      "مرحباً بك في محطة شحن الطاقة الأمنية!",
      "إذا فقدت جزءاً من طاقتك (القلوب)، هنا يمكنك استعادتها بإجابة سؤال أمان سريع."
    ],
    actionPrompt: 'شحن الطاقة والقلوب ❤️'
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'item_firewall_antivirus',
    name: 'مكافح الفيروسات والجدار الناري (Anti-Virus & Firewall)',
    icon: 'Shield',
    description: 'تثبيت مكافح فيروسات وجدار ناري وتحديثهما بانتظام لحماية الأجهزة من البرامج الضارة والتهديدات الجديدة (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_updates',
    name: 'حزمة تحديثات النظام وسد الثغرات',
    icon: 'RefreshCw',
    description: 'المواظبة على تحديث أنظمة التشغيل والبرامج لمعالجة الثغرات الأمنية المكتشفة التي تصدر الشركات تحديثات أمان لها (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_password_manager',
    name: 'مدير كلمات المرور (Password Manager)',
    icon: 'Key',
    description: 'اختيار كلمات مرور معقدة وفريدة لكل حساب وتجنب السهلة، واستخدام مدير كلمات المرور لتخزينها وإدارتها بصورة آمنة (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_awareness',
    name: 'ماسح التوعية والتدريب السيبراني',
    icon: 'BookOpen',
    description: 'زيادة الوعي بالأساليب الشائعة للهجمات مثل التصيد والاحتيال، وتدريب الموظفين والمستخدمين على تعرّفها وتجنبها (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_encryption',
    name: 'بروتوكول التشفير الآمن (SSL / TLS)',
    icon: 'Lock',
    description: 'حماية البيانات المهمة عند تخزينها ونقلها عبر الشبكات، وتأمين الاتصالات عبر بروتوكولات التشفير (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_2fa',
    name: 'مفتاح التحقق بخطوتين (2FA Token)',
    icon: 'CheckCircle2',
    description: 'إضافة طبقة أخرى من الأمان تحتم إجراء خطوة إضافية لتأكيد الهوية عند تسجيل الدخول (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  },
  {
    id: 'item_backup',
    name: 'قرص النسخ الاحتياطي (Data Backup)',
    icon: 'HardDrive',
    description: 'المواظبة على النسخ الاحتياطي في وسائط تخزين خارجية أو خدمات سحابية موثوقة لاستعادة البيانات عند التعرض لهجمات (ص 37).',
    bookPage: 'كتاب الطالب ص 37',
    count: 1
  }
];

export const LEVEL_TITLES = [
  { level: 1, title: 'Digital Recruit — مجند رقمي' },
  { level: 2, title: 'Cyber Scout — كشاف سيبراني' },
  { level: 3, title: 'Cyber Defender — مدافع سيبراني' },
  { level: 4, title: 'Security Specialist — أخصائي أمن' },
  { level: 5, title: 'Cyber Guardian — حارس الأمن السيبراني' }
];

export const RANDOM_ALERTS = [
  { id: 'al_1', text: '🚨 تنبيه تكتيكي: تم رصد اتصال مجهول يحاول مسح منافذ السيرفر في القطاع الغربي!' },
  { id: 'al_2', text: '📩 إشعار: وردت رسائل بريد دعائية مشبوهة تدعي جوائز مالية وهمية في مركز الاتصالات!' },
  { id: 'al_3', text: '⚠️ إنذار: كبسولة الفيروسات تحذر من ملف تجسس يحاول سرقة ضربات لوحة المفاتيح!' },
  { id: 'al_4', text: '⚖️ تذكير قانوني: قانون الجرائم الإلكترونية الأردني 2023م يحمي خصوصية البيانات الشخصية للمواطنين.' },
  { id: 'al_5', text: '💾 نصيحة وقائية: النسخ الاحتياطي الدوري هو سلاحك الأقوى ضد هجمات برمجيات الفدية!' }
];
