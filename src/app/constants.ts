export const FILTERS_CONFIG = {'all': [{'field': 'languages',
'options': [{'v': 'אמהרית', 'v__ar': 'الأمهرية', 'v__en': 'Amharic'},
            {'v': 'אנגלית', 'v__ar': 'الإنجليزية', 'v__en': 'English'},
            {'v': 'טיגרינית', 'v__ar': 'التغرينية', 'v__en': 'Tigrinya'},
            {'v': 'יידיש', 'v__ar': 'الإيديش', 'v__en': 'Yiddish'},
            {'v': 'כל שפה נדרשת', 'v__ar': 'أي لغة مطلوبة', 'v__en': 'Any required language'},
            {'v': 'ספרדית', 'v__ar': 'الإسبانية', 'v__en': 'Spanish'},
            {'v': 'עברית', 'v__ar': 'العبرية', 'v__en': 'Hebrew'},
            {'v': 'ערבית', 'v__ar': 'العربية', 'v__en': 'Arabic'},
            {'v': 'צרפתית', 'v__ar': 'الفرنسية', 'v__en': 'French'},
            {'v': 'רוסית', 'v__ar': 'الروسية', 'v__en': 'Russian'}]}],
'gender_index': [{'field': 'life_areas',
         'options': [{'v': 'אלימות מגדרית', 'v__ar': 'عنف جندريّ', 'v__en': 'Gender Violence'},
                     {'v': 'ביטחון', 'v__ar': 'أمن', 'v__en': 'Security'},
                     {'v': 'בריאות ומיניות', 'v__ar': 'صحة وجنسانيّة', 'v__en': 'Health & Sexuality'},
                     {'v': 'דת', 'v__ar': 'دين', 'v__en': 'Religion'},
                     {'v': 'חברה בישראל', 'v__ar': 'مجتمع في إسرائيل', 'v__en': 'Society in Israel'},
                     {'v': 'חינוך והשכלה', 'v__ar': 'تربية وتعليم', 'v__en': 'Education'},
                     {'v': 'כלכלה ושוק העבודה',
                      'v__ar': 'اقتصاد وسوق العمل',
                      'v__en': 'Economy & Labor Market'},
                     {'v': 'מדע, טכנולוגיה וסביבה',
                      'v__ar': 'العلم، التكنولوجيا والبيئة',
                      'v__en': 'Science, Technology & Environment'},
                     {'v': 'מעגל החיים וזמן',
                      'v__ar': 'الدورة الحياتيّة والوقت',
                      'v__en': 'Life Cycle & Time'},
                     {'v': 'משפחה', 'v__ar': 'عائلة', 'v__en': 'Family'},
                     {'v': 'משפט', 'v__ar': 'قانون', 'v__en': 'Law'},
                     {'v': 'עוני', 'v__ar': 'فقر', 'v__en': 'Poverty'},
                     {'v': 'עוצמה', 'v__ar': 'قوة', 'v__en': 'Power'},
                     {'v': 'פמיניזם', 'v__ar': 'نسويّة', 'v__en': 'Feminism'},
                     {'v': 'תקשורת', 'v__ar': 'إعلام', 'v__en': 'Media'},
                     {'v': 'תרבות וספורט', 'v__ar': 'ثقافة ورياضة', 'v__en': 'Culture & Sport'}]}],
'organisations': [{'field': 'languages',
          'options': [{'v': 'אמהרית', 'v__ar': 'الأمهرية', 'v__en': 'Amharic'},
                      {'v': 'אנגלית', 'v__ar': 'الإنجليزية', 'v__en': 'English'},
                      {'v': 'טיגרינית', 'v__ar': 'التغرينية', 'v__en': 'Tigrinya'},
                      {'v': 'יידיש', 'v__ar': 'الإيديش', 'v__en': 'Yiddish'},
                      {'v': 'כל שפה נדרשת', 'v__ar': 'أي لغة مطلوبة', 'v__en': 'Any required language'},
                      {'v': 'ספרדית', 'v__ar': 'الإسبانية', 'v__en': 'Spanish'},
                      {'v': 'עברית', 'v__ar': 'العبرية', 'v__en': 'Hebrew'},
                      {'v': 'ערבית', 'v__ar': 'العربية', 'v__en': 'Arabic'},
                      {'v': 'צרפתית', 'v__ar': 'الفرنسية', 'v__en': 'French'},
                      {'v': 'רוסית', 'v__ar': 'الروسية', 'v__en': 'Russian'}]},
         {'field': 'provided_services',
          'options': [{'v': 'איגוד עובדות ועובדים', 'v__ar': 'اتّحاد العاملات والعاملين'},
                      {'v': 'אירועים תרבותיים וקהילתיים', 'v__ar': 'أنشطة ثقافيّة وجماهيريّة'},
                      {'v': 'גיוס אמצעי תקשורת להעלאת נושאים פמיניסטיים לסדר היום הציבורי',
                       'v__ar': 'تجنيد وسائل الإعلام لطرح قضايا نسويّة على الأجندة العامّة'},
                      {'v': 'הנגשת זכויות', 'v__ar': 'إتاحة الحقوق'},
                      {'v': 'העלאת מודעות וקמפיינים', 'v__ar': 'رفع الوعي وحملات دعائيّة'},
                      {'v': 'התערבות בשעת משבר', 'v__ar': 'التدخّل في الأزمات'},
                      {'v': 'חשיבה, ביקורת ותיאוריה פמיניסטית', 'v__ar': 'فِكر، نقد ونظرية نسويّة'},
                      {'v': 'טיפול פרטני וקבוצתי לנשים עגונות ומסורבות גט',
                       'v__ar': 'علاج فرديّ وجماعيّ لنساء معلّقات وغير قادرات على الحصول على الطلاق'},
                      {'v': 'ייעוץ או סיוע לא משפטי', 'v__ar': 'إستشارة أو مساعدة غير قضائيّة'},
                      {'v': 'ייעוץ משפטי אישי בנושאים של אלימות נגד נשים, עיקולים, הוצאה לפועל, מזונות, ' +
                            'ביטוח לאומי, ליווי תעסוקתי, ועוד'},
                      {'v': 'ייעוץ משפטי ומיצוי זכויות', 'v__ar': 'إستشارة قضائية وتحصيل الحقوق'},
                      {'v': 'לובי וקידום מדיניות', 'v__ar': 'مجموعات ضغط وتأثير ودعم سياسات'},
                      {'v': 'ליווי ארגוני', 'v__ar': 'مرافقة تنظيميّة'},
                      {'v': 'ליווי מול רשויות', 'v__ar': 'مرافقة أمام السلطات'},
                      {'v': 'מחקר ומידע, ארכיון', 'v__ar': 'أبحاث ومعلومات، أرشيف'},
                      {'v': 'מענקים, מלגות ופרסים', 'v__ar': 'هِبات، مِنح وجوائز'},
                      {'v': 'מערך התנדבות', 'v__ar': 'منظومة تطوّع'},
                      {'v': 'מפגשים מקצועיים', 'v__ar': 'لقاءات مهنيّة'},
                      {'v': 'ניהול והפעלת מקלטים לנשים מוכות וילדיהן',
                       'v__ar': 'إدارة وتفعيل ملاجئ للنساء المعنّفات وأطفالهن'},
                      {'v': 'סדנאות חינוכיות לבני נוער, לצעירים ולצוותים חינוכיים',
                       'v__ar': 'ورشات عمل تربويّة لأبناء الشبيبة، للشباب وللطواقم التربويّة'},
                      {'v': 'עמוד אישי במאגר לכל מוזיקאית'},
                      {'v': 'פלטפורמה לשיתוף פעולה', 'v__ar': 'منصّة تعاونيّة'},
                      {'v': 'קבוצות תמיכה/טיפול נפשי', 'v__ar': 'مجموعات دعم/علاج نفسيّ'},
                      {'v': 'קהילה מקצועית שיתופית לתמיכה, ייעוץ וקידום נשים',
                       'v__ar': 'مجتمع مهنيّ تعاونيّ للدعم، الاستشارة وتمكين النساء'},
                      {'v': 'קו חם/מחסה', 'v__ar': 'خط دافئ / مأوى'},
                      {'v': 'קורסים, הכשרות והתמחויות', 'v__ar': 'دورات، تدريبات وتخصّصات'},
                      {'v': 'קידום פתרונות חוץ ממסדיים לבעיות בתחום הדין האישי',
                       'v__ar': 'طرح حلول غير موسّسيّة للمشاكل في مجال قانون الأحوال الشخصيّة'},
                      {'v': 'תמיכה לבוגרות הקורסים', 'v__ar': 'دعم خريّجات الدورات'}]},
         {'field': 'regions',
          'options': [{'v': 'בינלאומי', 'v__ar': 'دوليًّا', 'v__en': 'International'},
                      {'v': 'דרום', 'v__ar': 'الجنوب', 'v__en': 'South'},
                      {'v': 'כל הארץ', 'v__ar': 'كل البلاد', 'v__en': 'Israel'},
                      {'v': 'מרכז', 'v__ar': 'المركز', 'v__en': 'Center'},
                      {'v': 'צפון', 'v__ar': 'الشمال', 'v__en': 'North'}]},
         {'field': 'org_kind',
          'options': [{'v': 'איגוד/התאגדות מקצועית', 'v__ar': 'إتحاد/رابطة مهنية'},
                      {'v': 'ארגון למטרת רווח', 'v__ar': 'منظّمة ربحيّة'},
                      {'v': 'גוף או תכנית ממשלתית', 'v__ar': 'هيئة حكوميّة أو برنامج حكوميّ'},
                      {'v': 'יחידה או תכנית עירונית', 'v__ar': 'وحدة بلديّة  أو برنامج بلديّ'},
                      {'v': 'מרכז אקדמי/תכנית לימודים',
                       'v__ar': 'مركز أكاديميّ/برنامج دراسيّ',
                       'v__en': 'Academic center or program'},
                      {'v': 'עמותה/חל"צ',
                       'v__ar': 'جمعية مسجّلة /  شركة لمنفعة الجمهور',
                       'v__en': 'NGO (non profit)'},
                      {'v': 'פורום/התארגנות', 'v__ar': 'منتدى/تنظيم'},
                      {'v': 'קהילת פייסבוק', 'v__ar': 'مجتمع على الفيسبوك', 'v__en': 'Facebook community'},
                      {'v': 'קואליציית ארגונים', 'v__ar': 'ائتلاف منظّمات'},
                      {'v': 'קליניקה משפטית', 'v__ar': 'عيادة قانونيّة', 'v__en': 'Legal clinic'},
                      {'v': 'קרן פילנתרופית', 'v__ar': 'صندوق خيريّ'}]}],
'publications': [{'field': 'item_kind',
         'options': [{'v': 'איורים ותמונות', 'v__en': 'Images, Illustrations'},
                     {'v': 'אתר אינטרנט', 'v__en': 'Website'},
                     {'v': 'דו”ח', 'v__ar': 'تقرير', 'v__en': 'Report'},
                     {'v': 'דף נתונים', 'v__en': 'Datasheet'},
                     {'v': 'הרצאות וכנסים', 'v__en': 'Lecture, Conference'},
                     {'v': 'חקיקה ומשפט', 'v__en': 'Law and Legislation'},
                     {'v': 'כתבות ומאמרים', 'v__en': 'Articles and Papers'},
                     {'v': 'מאגר נתונים', 'v__en': 'Database'},
                     {'v': 'מדריכים, מערכי שיעור, Good Practice', 'v__en': 'Good Practice, Guide'},
                     {'v': 'מחקר אקדמי', 'v__ar': 'بحث', 'v__en': 'Academic Research'},
                     {'v': 'נייר עמדה', 'v__en': 'Position paper'},
                     {'v': 'סדרת נתונים', 'v__en': 'Data series'},
                     {'v': 'ספר עיון', 'v__en': 'Book'},
                     {'v': 'ספרות יפה (סיפורת, שירה)', 'v__en': 'Literature, Poetry'},
                     {'v': 'סרטונים/סרטים', 'v__en': 'Video'}]},
        {'field': 'source_kind',
         'options': [{'v': 'אקדמיה', 'v__en': 'Academic Institutions'},
                     {'v': 'ארגון בינלאומי', 'v__en': 'International Organization'},
                     {'v': 'אתר אינטרנט', 'v__en': 'Website'},
                     {'v': 'גוף מחקר עצמאי', 'v__en': 'Research Institute'},
                     {'v': 'חברה אזרחית', 'v__en': 'Civil Society'},
                     {'v': 'כלי תקשורת', 'v__en': 'Media'},
                     {'v': 'כתב עת', 'v__en': 'Journal, Periodical'},
                     {'v': 'מגזר פרטי', 'v__en': 'Private Sector'},
                     {'v': 'מגזר ציבורי', 'v__en': 'Public Sector'},
                     {'v': 'משרד ממשלתי', 'v__en': 'Government Ministry'},
                     {'v': 'ספר', 'v__en': 'Book'},
                     {'v': 'פרלמנט', 'v__en': 'Parliament'},
                     {'v': 'צבא', 'v__en': 'Military'}]},
        {'field': 'life_areas',
         'options': [{'v': 'אלימות מגדרית', 'v__ar': 'عنف جندريّ', 'v__en': 'Gender Violence'},
                     {'v': 'ביטחון', 'v__ar': 'أمن', 'v__en': 'Security'},
                     {'v': 'בריאות ומיניות', 'v__ar': 'صحة وجنسانيّة', 'v__en': 'Health & Sexuality'},
                     {'v': 'דת', 'v__ar': 'دين', 'v__en': 'Religion'},
                     {'v': 'חברה בישראל', 'v__ar': 'مجتمع في إسرائيل', 'v__en': 'Society in Israel'},
                     {'v': 'חינוך והשכלה', 'v__ar': 'تربية وتعليم', 'v__en': 'Education'},
                     {'v': 'כלכלה ושוק העבודה',
                      'v__ar': 'اقتصاد وسوق العمل',
                      'v__en': 'Economy & Labor Market'},
                     {'v': 'מדע, טכנולוגיה וסביבה',
                      'v__ar': 'العلم، التكنولوجيا والبيئة',
                      'v__en': 'Science, Technology & Environment'},
                     {'v': 'מעגל החיים וזמן',
                      'v__ar': 'الدورة الحياتيّة والوقت',
                      'v__en': 'Life Cycle & Time'},
                     {'v': 'משפחה', 'v__ar': 'عائلة', 'v__en': 'Family'},
                     {'v': 'משפט', 'v__ar': 'قانون', 'v__en': 'Law'},
                     {'v': 'עוני', 'v__ar': 'فقر', 'v__en': 'Poverty'},
                     {'v': 'עוצמה', 'v__ar': 'قوة', 'v__en': 'Power'},
                     {'v': 'פמיניזם', 'v__ar': 'نسويّة', 'v__en': 'Feminism'},
                     {'v': 'תקשורת', 'v__ar': 'إعلام', 'v__en': 'Media'},
                     {'v': 'תרבות וספורט', 'v__ar': 'ثقافة ورياضة', 'v__en': 'Culture & Sport'}]},
        {'field': 'languages',
         'options': [{'v': 'אמהרית', 'v__ar': 'الأمهرية', 'v__en': 'Amharic'},
                     {'v': 'אנגלית', 'v__ar': 'الإنجليزية', 'v__en': 'English'},
                     {'v': 'טיגרינית', 'v__ar': 'التغرينية', 'v__en': 'Tigrinya'},
                     {'v': 'יידיש', 'v__ar': 'الإيديش', 'v__en': 'Yiddish'},
                     {'v': 'כל שפה נדרשת', 'v__ar': 'أي لغة مطلوبة', 'v__en': 'Any required language'},
                     {'v': 'ספרדית', 'v__ar': 'الإسبانية', 'v__en': 'Spanish'},
                     {'v': 'עברית', 'v__ar': 'العبرية', 'v__en': 'Hebrew'},
                     {'v': 'ערבית', 'v__ar': 'العربية', 'v__en': 'Arabic'},
                     {'v': 'צרפתית', 'v__ar': 'الفرنسية', 'v__en': 'French'},
                     {'v': 'רוסית', 'v__ar': 'الروسية', 'v__en': 'Russian'}]}],
'stats': [{'field': 'life_areas',
  'options': [{'v': 'אלימות מגדרית', 'v__ar': 'عنف جندريّ', 'v__en': 'Gender Violence'},
              {'v': 'ביטחון', 'v__ar': 'أمن', 'v__en': 'Security'},
              {'v': 'בריאות ומיניות', 'v__ar': 'صحة وجنسانيّة', 'v__en': 'Health & Sexuality'},
              {'v': 'דת', 'v__ar': 'دين', 'v__en': 'Religion'},
              {'v': 'חברה בישראל', 'v__ar': 'مجتمع في إسرائيل', 'v__en': 'Society in Israel'},
              {'v': 'חינוך והשכלה', 'v__ar': 'تربية وتعليم', 'v__en': 'Education'},
              {'v': 'כלכלה ושוק העבודה', 'v__ar': 'اقتصاد وسوق العمل', 'v__en': 'Economy & Labor Market'},
              {'v': 'מדע, טכנולוגיה וסביבה',
               'v__ar': 'العلم، التكنولوجيا والبيئة',
               'v__en': 'Science, Technology & Environment'},
              {'v': 'מעגל החיים וזמן', 'v__ar': 'الدورة الحياتيّة والوقت', 'v__en': 'Life Cycle & Time'},
              {'v': 'משפחה', 'v__ar': 'عائلة', 'v__en': 'Family'},
              {'v': 'משפט', 'v__ar': 'قانون', 'v__en': 'Law'},
              {'v': 'עוני', 'v__ar': 'فقر', 'v__en': 'Poverty'},
              {'v': 'עוצמה', 'v__ar': 'قوة', 'v__en': 'Power'},
              {'v': 'פמיניזם', 'v__ar': 'نسويّة', 'v__en': 'Feminism'},
              {'v': 'תקשורת', 'v__ar': 'إعلام', 'v__en': 'Media'},
              {'v': 'תרבות וספורט', 'v__ar': 'ثقافة ورياضة', 'v__en': 'Culture & Sport'}]}]};
