import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())
app.use(renderer)

// Simulated knowledge base
const knowledgeBase = [
  {
    id: 1,
    category: "מוקד טלפוני",
    question: "מה הנוהל לטיפול בפניית לקוח על חיוב עמלה לא מוצדק?",
    answer: "על פי נוהל טיפול בפניות עמלות (מס' 205.12), יש לבצע: 1. בדיקת החיוב במערכת CRM 2. אימות זכאות הלקוח לזיכוי (עד 50 ₪ ללקוח מדורג) 3. ביצוע זיכוי מיידי או הסלמה למנהל משמרת.",
    sources: ["נוהל 205.12", "מדיניות שירות לקוחות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 2,
    category: "עובד סניף",
    question: "מהם הקריטריונים לאישור הלוואה עסקית של 500,000 ש\"ח?",
    answer: "על פי מדיניות אשראי עסקי (מס' 301.08), הלוואה בסכום זה דורשת: 1. ותק עסקי מינימלי של 2 שנים 2. מחזור שנתי מינימלי של 2 מיליון ש\"ח 3. דוחות כספיים מבוקרים 4. ערבויות בהתאם לסיכון. נדרשת הפניה לוועדת אשראי סניפית.",
    sources: ["מדיניות אשראי 301.08", "נספח ב' - קריטריונים"],
    lastUpdated: "2025-10-19",
    accessLevel: "branch"
  },
  {
    id: 3,
    category: "מפתח תוכנה",
    question: "איך מגישים בקשה לגישה למערכת הליבה החדשה?",
    answer: "תהליך בקשת גישה למערכת Core Banking v3.0: 1. מילוי טופס IT-403 במערכת ServiceNow 2. אישור מנהל ישיר ומנהל אבטחת מידע 3. השלמת קורס אבטחה S-205 4. זמן טיפול: עד 5 ימי עסקים.",
    sources: ["מדריך IT Procedures", "ServiceNow KB-1205"],
    lastUpdated: "2025-10-19",
    accessLevel: "tech"
  },
  {
    id: 4,
    category: "כללי",
    question: "מהן שעות הפעילות של מערכות הבנק?",
    answer: "מערכות הליבה פועלות: ראשון-חמישי 06:00-23:00, שישי 06:00-15:00. מערכות משנה זמינות 24/7. בימי חג ייתכנו הפסקות מתוכננות - ראה לוח השירות השבועי.",
    sources: ["לוח שירות IT", "נוהל תפעול מערכות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 5,
    category: "משאבי אנוש",
    question: "מהן שעות העבודה הרגילות בבנק ישראל?",
    answer: "על פי נוהל שעות עבודה (מס' HR-101.05): **משרדי הנהלה וחטיבות מטה:** ראשון-חמישי 08:00-17:00 (8.5 שעות עם הפסקת צהריים). **סניפים:** ראשון, שלישי, חמישי 08:30-13:15, שני, רביעי 08:30-13:15 + 16:00-19:00. **מוקד טלפוני:** משמרות: 07:00-15:00, 13:00-21:00, 15:00-23:00. **עבודה בשישי:** ערב חג/שישי רגיל עד 13:00. **גמישות:** אפשרות התחלה 07:30-09:00 בתיאום עם המנהל.",
    sources: ["נוהל HR-101.05", "הסכם קיבוצי 2025", "חוזר הנהלה 15/2025"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 6,
    category: "משאבי אנוש",
    question: "איך מגישים בקשה לחופשה שנתית?",
    answer: "תהליך אישור חופשה שנתית (נוהל HR-203.12): **1. הגשת בקשה:** מילוי טופס דיגיטלי במערכת 'עובד בנק' עד 14 יום מראש. **2. אישור ראשוני:** מנהל ישיר מאשר תוך 3 ימי עסקים. **3. אישור HR:** משאבי אנוש בודקים יתרת ימים ומאשרים. **4. הודעה:** הודעה אוטומטית נשלחת 24 שעות לפני החופשה. **זכאויות שנתיות:** עובד חדש: 12 יום, 1-5 שנים: 18 יום, 5+ שנים: 21 יום, 10+ שנים: 24 יום. **מגבלות:** מקסימום 10 ימים רצופים ללא אישור מיוחד.",
    sources: ["נוהל HR-203.12", "מערכת עובד בנק", "זכויות עובדים 2025"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 7,
    category: "משאבי אנוש",
    question: "מה הנוהל לדיווח מחלה?",
    answer: "נוהל דיווח מחלה ומחלת ילד (HR-204.08): **דיווח מיידי:** הודעה טלפונית למנהל ישיר + הודעה במערכת עד 09:30. **מסמכים נדרשים:** אישור רופא ליום אחד ומעלה, אישור רופא ילדים למחלת ילד. **זכאויות:** 18 ימי מחלה לשנה (מצטברים עד 90 יום), 8 ימי מחלת ילד לשנה. **החזר:** 100% מהשכר לימים 1-90, 75% לימים 91-180. **ביקורת רפואית:** מעל 3 ימים רצופים - בדיקת רופא בנק. **חזרה לעבודה:** אישור כושר עבודה מרופא מטפל לאחר מחלה מעל 7 ימים.",
    sources: ["נוהל HR-204.08", "ביטוח לאומי - הוראות", "רופא הבנק"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 8,
    category: "משאבי אנוש",
    question: "איך מבקשים שעות נוספות?",
    answer: "נוהל שעות נוספות ותגמולים (HR-105.20): **אישור מוקדם:** חובה לקבל אישור מנהל ישיר לפני ביצוע. **הגשה:** דיווח במערכת 'ציון שעות' תוך 3 ימי עסקים. **זכאויות לפי דרגה:** דרגות 1-6: תשלום 125% עד 150% לפי יום השבוע. דרגות 7+: פטור משעות נוספות, זכאים להפגה. **מגבלות:** עד 20 שעות חודשיות ללא אישור מיוחד, 40 שעות עם אישור מנכ\"ל. **תשלום:** תוספת לשכר החודש הבא. **חירום:** במצבי חירום - אישור למפרע תוך 24 שעות.",
    sources: ["נוהל HR-105.20", "הסכם קיבוצי סעיף 12", "מערכת ציון שעות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 9,
    category: "משאבי אנוש",
    question: "מה זכויות החופשת לידה והורות?",
    answer: "זכויות הורות ולידה (HR-210.15): **חופשת לידה:** 15 שבועות לאם (3 לפני + 12 אחרי), 7 ימים לאב. **חופשת הורות:** עד 12 חודשים נוספים ללא תשלום (לחלק בין ההורים). **הודעה מוקדמת:** 30 יום לפני התחלת חופשה. **שכר:** 100% שכר לתקופה המלאה מביטוח לאומי + השלמה מהבנק. **שמירת מקום עבודה:** מובטחת לעד 12 חודשים. **זכויות נוספות:** ימי מחלת ילד נוספים, הנקה במקום העבודה, גמישות שעות. **חזרה הדרגתית:** אפשרות לחזרה הדרגתית במשרה חלקית.",
    sources: ["נוהל HR-210.15", "חוק הגנת השכר", "זכויות הורים 2025"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 10,
    category: "משאבי אנוש",
    question: "איך מגישים תלונה או פנייה למשאבי אנוש?",
    answer: "נוהל טיפול בפניות עובדים (HR-301.10): **דרכי פנייה:** 1. פנייה ישירה למנהל ישיר, 2. מערכת 'שירות עובדים' באינטרא-נט, 3. טלפון חם HR: 02-6552800, 4. פגישה אישית בתיאום. **סוגי פניות:** בעיות משמעת, הטרדות, בעיות שכר, קידום, תנאי עבודה, פגיעה בכבוד. **זמני טיפול:** פניות רגילות - 5 ימי עסקים, דחופות - 24 שעות, הטרדות - טיפול מיידי. **סודיות מובטחת:** כל הפניות מטופלות בדיסקרטיות מלאה. **זכות ערעור:** אפשרות ערעור לוועדת משמעת או מנכ\"ל.",
    sources: ["נוהל HR-301.10", "טלפון חם HR", "ועדת משמעת"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 11,
    category: "מנהלים",
    question: "מה הנוהל לאישור חופשה לעובדים?",
    answer: "נוהל מנהלים - אישור חופשות (MNG-105.30): **עקרונות אישור:** 1. שמירה על רציפות שירות, 2. חלוקה הוגנת לכל העובדים, 3. עדיפות לוותיקים בתאריכי שיא. **בדיקות נדרשות:** יתרת ימים במערכת, כיסוי תפקיד, עומס עבודה צפוי. **מגבלות:** לא יותר מ-30% מהצוות בחופשה יחד, מקסימום 10 ימים רצופים. **עדיפויות:** חגים - לפי ותק, קיץ - סבבים שנתיים, מקרי חירום - ענייני משפחה. **דחיית בקשה:** נדרשת הנמקה בכתב + הצעת תאריך חלופי. **תיעוד:** רישום אישורים ברבעון + דוח שנתי למשאבי אנוש.",
    sources: ["נוהל MNG-105.30", "מערכת ניהול כוח אדם", "דוח חופשות רבעוני"],
    lastUpdated: "2025-10-19",
    accessLevel: "branch"
  },
  {
    id: 12,
    category: "IT ואבטחה",
    question: "מה הנוהל לעבודה מרחוק (Work From Home)?",
    answer: "נוהל עבודה מרחוק (IT-SEC-401.25): **זכאות:** עובדים בדרגה 4+ עם ותק מעל שנה. **תדירות:** עד 2 ימים בשבוع לאחר אישור מנהל. **אישורים נדרשים:** הסכמה דיגיטלית, הכשרת אבטחה, בדיקת תשתיות בית. **ציוד מאושר:** מחשב נייד בנק + VPN חובה, איסור על מחשבים אישיים. **שעות עבודה:** זהות למשרד, זמינות לפגישות ושיחות. **אבטחת מידע:** איסור הדפסה, איסור צילום מסך, נעילה אוטומטית אחרי 10 דק'. **ביקורת:** מעקב גישות למערכות + פגישת סטטוס שבועית. **ביטול הרשאה:** במקרה של הפרת נוהל או ירידה בביצועים.",
    sources: ["נוהל IT-SEC-401.25", "מדיניות אבטחת מידע", "הסכם עבודה מרחוק"],
    lastUpdated: "2025-10-19",
    accessLevel: "tech"
  },
  {
    id: 13,
    category: "משאבי אנוש - מערכות",
    question: "איך מנוהל קובץ המשמרות במערכת HR?",
    answer: "מערכת ניהול משמרות (HR-SYS-401.15): **נתוני עובד בקובץ:** ת\"ז, שם מלא, מחלקה, תפקיד. **פרטי משמרת:** תאריך, יום בשבוע, שעת התחלה וסיום, סוג משמרת (בוקר 07:00-15:00 / ערב 15:00-23:00 / לילה 23:00-07:00). **חישוב שעות:** המערכת מחשבת אוטומטית סה\"כ שעות בפועל כולל הפסקות. **עדכון נתונים:** המשמרות מעודכנות יומית במערכת 'זמנים ונוכחות'. **דוחות:** דוח חודשי לכל עובד + דוח מחלקתי למנהלים. **גישה:** עובדים רואים משמרות עצמיות, מנהלים רואים צוות, HR רואה הכל.",
    sources: ["נוהל HR-SYS-401.15", "מערכת זמנים ונוכחות", "מדריך משתמש משמרות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 14,
    category: "משאבי אנוש - זכויות",
    question: "איך עובד מערכת הזכאויות וניצול (חופשה, הבראה, ביגוד, מתנות)?",
    answer: "מערכת זכאויות וניצול (HR-ENT-205.40): **סוגי זכאויות:** חופשה שנתית (18-24 ימים), הבראה (7 ימים), ביגוד (1,500₪ שנתי), מתנות לחגים (500₪). **מעקב יתרות:** יתרת זכאות שנתית מתעדכנת ב-1 בינואר, ניצול בפועל עד כה מתעדכן יומי. **יתרה נוכחית:** זכאות מינוס ניצול = יתרה זמינה. **התראות מערכת:** הודעה ב-90% ניצול, תזכורת לפני פקיעה. **העברת יתרות:** חופשה - עד 5 ימים לשנה הבאה, הבראה - לא מועברת. **אישורים:** חופשה למעלה מ-5 ימים דורשת אישור מנהל + HR.",
    sources: ["נוהל HR-ENT-205.40", "מערכת זכאויות", "תקנון העברת יתרות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 15,
    category: "משאבי אנוש - מחלה",
    question: "איך מנוהל מעקב ימי מחלה מול זכאות?",
    answer: "מערכת ימי מחלה (HR-SICK-302.18): **זכאות שנתית:** 18 ימי מחלה בשנת כספים + 8 ימי מחלת ילד. **זכאות כללית מצטברת:** עד 90 ימי מחלה מקסימום (מצטבר משנים קודמות). **מעקב ניצול:** כל יום מחלה נרשם עם תאריך, סוג (מחלה עצמית/ילד), אישור רופא. **יתרה נוכחית:** המערכת מחשבת: זכאות כללית - ניצול השנה - יתרות שנים קודמות. **התראות:** הודעה ב-15 ימים, אזהרה ב-17 ימים, חסימה ב-18+ ימים. **אישורים רפואיים:** חובה מהיום הראשון, בדיקת רופא בנק מעל 7 ימים רצופים.",
    sources: ["נוהל HR-SICK-302.18", "מערכת מחלות", "ביטוח לאומי - הנחיות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 16,
    category: "משאבי אנוש - טופס 101",
    question: "מה זה טופס 101 ואיך מנוהלים נתוני משפחה?",
    answer: "טופס 101 - נתוני משפחה (HR-FAM-150.25): **מטרה:** עדכון שנתי של נתוני משפחה לצרכי זכויות וביטוחים. **נתונים הנדרשים:** ת\"ז עובד, מספר ילדים, גילאי הילדים (עד 18), סטטוס משפחתי (רווק/נשוי/גרוש/אלמן). **עדכון שנתי:** חובת עדכון עד 31 בינואר כל שנה. **השפעה על זכויות:** מספר ילדים משפיע על: מתנות, ימי מחלת ילד, קצבת ילדים, ביטוח בריאות משלים. **מסמכים נדרשים:** תעודות לידה, אישור משפחתי עדכני מרשם האוכלוסין. **עדכונים חריגים:** לידה, אימוץ, גירושין - עדכון תוך 30 יום מהאירוע.",
    sources: ["טופס 101 - הוראות", "מערכת נתוני משפחה", "זכויות לפי מצב משפחתי"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 17,
    category: "משאבי אנוש - חופשות",
    question: "איך מנוהל ניצול חופשה רציפה?",
    answer: "ניצול חופשה רציפה (HR-VAC-280.33): **הגדרת חופשה רציפה:** 5+ ימי חופשה רצופים (לא כולל סופי שבוע וחגים). **רישום במערכת:** תאריך תחילה וסיום, מספר ימי עבודה בפועל, סוג חופשה (שנתית/מיוחדת/ללא תשלום). **אישורים נדרשים:** 5-10 ימים - מנהל ישיר, 10+ ימים - מנהל + HR, חופשה ללא תשלום - מנכ\"ל. **מגבלות שנתיות:** עד 15 ימים רצופים במקטע אחד, מקסימום 2 חופשות ארוכות בשנה. **תכנון מראש:** הגשת בקשה 30 יום מראש לחופשות מעל 7 ימים. **עדיפות בחופשות:** עובדים עם ילדים בחופשת קיץ, ותיקים בחגי תשרי.",
    sources: ["נוהל HR-VAC-280.33", "מערכת חופשות", "לוח עדיפויות חופשות"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 18,
    category: "משאבי אנוש - מתנות ילדים",
    question: "מה זכאות המתנות לילדים וכיצד מנוהלת?",
    answer: "זכאות מתנות לילדים (HR-GIFT-345.60): **זכאות לפי גיל:** גיל 0-12: מתנה + 200₪, גיל 13-18: 300₪ במזומן, מעל 18: לא זכאי. **תנאי זכאות:** ילד רשום בטופס 101, עובד במשרה מעל 50%, ותק מינימלי 6 חודשים. **מועדי חלוקה:** ראש השנה (ספטמבר), חנוכה (דצמבר), פסח (מרץ-אפריל). **סטטוס מימוש:** 'ממתין' - טרם הוגש, 'בטיפול' - HR בודק זכאות, 'אושר' - מתנה/כסף הועברו. **הגשת בקשה:** דרך מערכת HR עד 30 לחודש שלפני החג. **אישור אוטומטי:** עובדים קבועים עם נתונים מעודכנים בטופס 101.",
    sources: ["נוהל HR-GIFT-345.60", "מערכת מתנות", "טבלת זכאויות לפי גיל"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 19,
    category: "משאבי אנוש - שעות נוספות",
    question: "איך מחושבת הזכאות החודשית לשעות נוספות?",
    answer: "זכאות חודשית שעות נוספות (HR-OT-420.75): **בסיס חישוב:** 160 שעות חודשיות סטנדרטיות (משרה מלאה). **תעריפי שעות נוספות:** רגיל: 125%, ערב (אחרי 18:00): 150%, שישי-שבת: 200%, חג: 300%. **מגבלות חודשיות:** דרגות 1-5: עד 25 שעות נוספות, דרגות 6+: עד 15 שעות נוספות. **חישוב זכאות:** (שעות בפועל - 160) × תעריף × שכר שעתי בסיס. **אישור מנהל:** חובה לקבל אישור מראש, אישור למפרע רק במצבי חירום. **תשלום:** מתווסף לשכר החודש הבא, עם פירוט בתלוש השכר. **מעקב:** דוח חודשי לכל עובד + התראה בהגעה ל-80% מהמכסה.",
    sources: ["נוהל HR-OT-420.75", "מערכת שעות נוספות", "תעריפון תגמולים 2025"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  },
  {
    id: 20,
    category: "משאבי אנוש - משכנתאות",
    question: "מהם תנאי המשכנתא לעובדי הבנק?",
    answer: "נוהל מתן משכנתאות לעובדי בנק (HR-MORTGAGE-510.20): **הטבות לעובדים:** 1. ריביות נמוכות (0.5-1% מתחת לשוק) 2. מסלולים אטרקטיביים יותר מללקוחות רגילים 3. הלוואות נוספות לשיפוצים/הון עצמי בתנאים מיוחדים. **תהליך אישור מהיר:** 1. הגשת בקשה למחלקת משכנתאות או משאבי אנוש 2. איסוף מסמכים בסיסיים (שכר, אישור עבודה, הוכחת בעלות) 3. הערכת שמאי לנכס 4. אישור ועיצוב מסלול מותאם אישית. **גמישות:** תנאי אשראי מקלים יותר, אישור מהיר בזכות ההיכרות הקרובה עם העובד. **הרכבת מימון:** גמישות גדולה יותר במימון והטבות נוספות לפי הסכמים קיבוציים ומדיניות הבנק.",
    sources: ["נוהל HR-MORTGAGE-510.20", "מחלקת משכנתאות", "הסכמים קיבוציים 2025"],
    lastUpdated: "2025-10-19",
    accessLevel: "basic"
  }
];

// User profiles simulation with employment status
// מסד נתונים מקיף של עובדים עם כל הנתונים האישיים
const employeeDatabase = {
  "call_center": {
    // פרטים אישיים
    id: "123456789",
    name: "רחל כהן",
    role: "נציגת מוקד טלפוני",
    department: "שירות לקוחות",
    accessLevel: "basic",
    avatar: "ר.כ",
    permissions: ["basic", "customer_service"],
    employmentType: "hourly", // שעתי
    seniority: 8, // חודשים
    grade: 3,
    hireDate: "2025-02-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 2,
      childrenAges: [5, 8],
      spouseDetails: { name: "יוסי כהן", birthYear: 1988 },
      lastUpdated: "2025-10-19"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 12, // ימי חופשה - עובד חדש
      recovery: 0,  // אין זכאות להבראה לשעתי
      clothing: 800, // ביגוד מופחת לשעתי
      gifts: 300,   // מתנות לחגים מופחתות
      sickDays: 12, // ימי מחלה מופחתים לשעתי
      childSickDays: 6 // ימי מחלת ילד מופחתים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: {
        used: 3,
        dates: [
          { startDate: "2025-03-15", endDate: "2025-03-17", days: 3, type: "חופשה שנתית" }
        ]
      },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 2,
        dates: [
          { date: "2025-04-10", type: "מחלה עצמית" },
          { date: "2025-05-22", type: "מחלה עצמית" }
        ]
      },
      childSickDays: {
        used: 1,
        dates: [
          { date: "2025-06-03", childAge: 5, type: "מחלת ילד" }
        ]
      }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 8, // ימי מחלה מצטברים
      vacation: 0  // חופשה לא מועברת לשעתי
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 2,
      giftStatus2025: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "לא רלוונטי עדיין"
      }
    },
    
    // נתוני משמרות ושעות נוספות
    workData: {
      monthlyHours: 140, // שעות חודשיות ממוצעות (משרה חלקית)
      overtimeThisMonth: 8,
      overtimeDetails: [
        { date: "2025-10-02", hours: 2, rate: "125%", approved: true },
        { date: "2025-10-08", hours: 3, rate: "150%", approved: true },
        { date: "2025-10-15", hours: 3, rate: "125%", approved: true }
      ]
    },
    
    // מערכת משמרות עובד זמני - מוקד טלפוני
    shiftsData: {
      isShiftWorker: true,
      shiftType: "מוקד טלפוני זמני",
      
      // משמרות ספטמבר 2025 (חודש אחורה) - עובד חדש התחיל באמצע החודש
      september2025: [
        // עדיין לא התחיל לעבוד
        { date: "2025-09-15", day: "ראשון", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2025-09-16", day: "שני", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2025-09-17", day: "שלישי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2025-09-18", day: "רביעי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2025-09-19", day: "חמישי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2025-09-20", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-09-21", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        
        // השבוע הראשון בעבודה עצמאית  
        { date: "2025-09-22", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-09-23", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-09-24", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-09-25", day: "רביעי", shift: "כיפור", startTime: "", endTime: "", hours: 0, status: "חג" },
        { date: "2025-09-26", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-09-27", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-09-28", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-09-29", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-09-30", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" }
      ],
      
      // משמרות אוקטובר 2025 (חודש נוכחי)
      october2025: [
        { date: "2025-10-01", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-10-02", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-10-03", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2025-10-04", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-10-05", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-10-06", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "נוכחי" },
        { date: "2025-10-07", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-08", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-09", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-10", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-11", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-10-12", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-10-13", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-14", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-15", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-16", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-17", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-18", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-10-19", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-10-20", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-21", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-22", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-23", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-24", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-25", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-10-26", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-10-27", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-28", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-29", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-30", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-31", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" }
      ],

      // משמרות נובמבר 2025 (חודש קדימה)
      november2025: [
        { date: "2025-11-01", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-02", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-03", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-04", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-05", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-06", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-07", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-08", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-09", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-11-10", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-11", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-12", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-13", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-14", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-15", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-16", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-11-17", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-18", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-19", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-20", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-21", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-22", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-23", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2025-11-24", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-25", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-26", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-27", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-28", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-29", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2025-11-30", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" }
      ],
      
      // סטטיסטיקות משמרות  
      shiftsStats: {
        totalHoursThisMonth: 176, // כ-22 ימי עבודה * 8 שעות
        morningShifts: 22,
        eveningShifts: 0,
        nightShifts: 0,
        daysOff: 8,
        holidays: 1,
        trainingDays: 5
      }
    },

    // נתוני משכנתא אישיים
    mortgageData: {
      eligibility: "זכאי מוגבל", // עובד שעתי - זכאות מוגבלת
      currentStatus: "אין משכנתא פעילה",
      maxLoanAmount: "עד 70% מערך הנכס (מוגבל ע\"י הכנסה שעתית)",
      interestRateDiscount: "0.3% הנחה מהריבית הבסיסית",
      specialConditions: [
        "דרוש ערב או ביטחונות נוספים",
        "בדיקת יציבות הכנסה של 12 חודשים",
        "מגבלה על סכום ההלוואה ע\"פ הכנסה שעתית"
      ],
      additionalLoans: {
        renovationLoan: "זכאי עד 100,000 ₪ בריבית מועדפת",
        equityLoan: "זכאי עד 50,000 ₪ להון עצמי"
      },
      applicationProcess: "הגשת בקשה דרך מחלקת משכנתאות + בדיקת יועץ משכנתאות מתמחה בעובדי בנק",
      lastUpdated: "2025-10-19"
    },

    // נתוני ארנק דיגיטלי אישיים
    digitalWalletData: {
      currentBalance: "2,450 ₪",
      monthlyAllocation: "800 ₪",
      usedThisMonth: "350 ₪",
      remainingThisMonth: "450 ₪",
      lastTransaction: {
        date: "2025-10-15",
        amount: "120 ₪",
        description: "ארוחת צהריים - קפטריה"
      },
      categories: {
        meals: { budget: "400 ₪", used: "180 ₪", remaining: "220 ₪" },
        transport: { budget: "200 ₪", used: "85 ₪", remaining: "115 ₪" },
        wellness: { budget: "200 ₪", used: "85 ₪", remaining: "115 ₪" }
      },
      restrictions: [
        "שעתיים - מגבלה על סכום יומי מקסימלי של 150 ₪",
        "זכאות מופחתת בהשוואה לעובדים קבועים"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "זכאי מוגבל",
      currentStatus: "לא מאושר",
      maxDaysPerWeek: 1,
      reason: "עובד שעתי - זכאות מוגבלת לעבודה מהבית",
      requirements: [
        "השלמת תקופת ניסיון של 6 חודשים",
        "אישור מנהל ישיר",
        "השלמת קורס אבטחת מידע לעבודה מרחוק"
      ],
      currentApproval: "ממתין לאישור מנהל לאחר השלמת 6 חודשי ותק",
      equipmentProvided: "מחשב נייד בנק + VPN (לאחר אישור)",
      workingHours: "חובה לשמור על שעות קבועות ונוכחות במשמרות",
      lastUpdated: "2025-10-19"
    }
  },
  
  "call_center_permanent": {
    // פרטים אישיים  
    id: "987654321",
    name: "מיכל אברהם",
    role: "נציגת מוקד בכירה",
    department: "שירות לקוחות",
    accessLevel: "basic",
    avatar: "מ.א",
    permissions: ["basic", "customer_service", "senior"],
    employmentType: "permanent", // קבוע
    seniority: 36, // חודשים
    grade: 5,
    hireDate: "2023-10-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "גרושה",
      numberOfChildren: 1,
      childrenAges: [12],
      spouseDetails: null,
      lastUpdated: "2025-01-20"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 18, // ימי חופשה - 1-5 שנים
      recovery: 7,  // זכאות להבראה מלאה
      clothing: 1500, // ביגוד מלא
      gifts: 500,   // מתנות לחגים מלאות
      sickDays: 18, // ימי מחלה מלאים
      childSickDays: 8 // ימי מחלת ילד מלאים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: {
        used: 12,
        dates: [
          { startDate: "2025-01-08", endDate: "2025-01-12", days: 5, type: "חופשה שנתית" },
          { startDate: "2025-07-15", endDate: "2025-07-21", days: 7, type: "חופשה רציפה" }
        ]
      },
      recovery: {
        used: 4,
        dates: [
          { startDate: "2025-09-02", endDate: "2025-09-05", days: 4, type: "הבראה" }
        ]
      },
      sickDays: {
        used: 5,
        dates: [
          { date: "2025-02-14", type: "מחלה עצמית" },
          { date: "2025-02-15", type: "מחלה עצמית" },
          { date: "2025-06-20", type: "מחלה עצמית" },
          { date: "2025-08-12", type: "מחלה עצמית" },
          { date: "2025-09-18", type: "מחלה עצמית" }
        ]
      },
      childSickDays: {
        used: 3,
        dates: [
          { date: "2025-03-25", childAge: 12, type: "מחלת ילד" },
          { date: "2025-05-10", childAge: 12, type: "מחלת ילד" },
          { date: "2025-09-05", childAge: 12, type: "מחלת ילד" }
        ]
      }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 25, // ימי מחלה מצטברים
      vacation: 3   // חופשה מועברת משנה שעברה
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 1,
      giftStatus2025: {
        "ראש השנה": "נמסר",
        "חנוכה": "נמסר", 
        "פסח": "לא רלוונטי עדיין"
      }
    },
    
    // נתוני משמרות ושעות נוספות
    workData: {
      monthlyHours: 160, // שעות חודשיות מלאות
      overtimeThisMonth: 15,
      overtimeDetails: [
        { date: "2025-10-01", hours: 4, rate: "125%", approved: true },
        { date: "2025-10-07", hours: 6, rate: "150%", approved: true },
        { date: "2025-10-14", hours: 5, rate: "125%", approved: true }
      ]
    },

    // נתוני משכנתא אישיים
    mortgageData: {
      eligibility: "זכאי מלא", // עובד קבוע - זכאות מלאה
      currentStatus: "משכנתא פעילה",
      currentMortgage: {
        loanAmount: "1,800,000 ₪",
        monthlyPayment: "6,200 ₪", 
        interestRate: "4.1% (הנחת עובדים 0.7%)",
        startDate: "2023-06-01",
        yearsRemaining: 18
      },
      maxLoanAmount: "עד 75% מערך הנכס",
      interestRateDiscount: "0.7% הנחה מהריבית הבסיסית",
      specialConditions: [
        "אישור מהיר תוך 10 ימי עסקים",
        "גמישות בתנאי האשראי",
        "אפשרות למשכנתא נוספת"
      ],
      additionalLoans: {
        renovationLoan: "זכאי עד 200,000 ₪ בריבית מועדפת",
        equityLoan: "זכאי עד 150,000 ₪ להון עצמי"
      },
      applicationProcess: "הגשת בקשה פשוטה דרך מחלקת משכנתאות עם אישור מהיר",
      lastUpdated: "2025-10-19"
    },

    // נתוני ארנק דיגיטלי אישיים
    digitalWalletData: {
      currentBalance: "3,200 ₪",
      monthlyAllocation: "1,200 ₪",
      usedThisMonth: "680 ₪",
      remainingThisMonth: "520 ₪",
      lastTransaction: {
        date: "2025-10-18",
        amount: "85 ₪",
        description: "תחבורה ציבורית - חודשון"
      },
      categories: {
        meals: { budget: "500 ₪", used: "320 ₪", remaining: "180 ₪" },
        transport: { budget: "400 ₪", used: "240 ₪", remaining: "160 ₪" },
        wellness: { budget: "300 ₪", used: "120 ₪", remaining: "180 ₪" }
      },
      restrictions: [
        "עובד קבוע - זכאות מלאה לכל הקטגוריות",
        "הנחות נוספות על ארוחות בקפטריה"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "זכאי מלא",
      currentStatus: "מאושר",
      maxDaysPerWeek: 2,
      approvedDays: ["שלישי", "חמישי"],
      reason: "עובד קבוע בכיר עם ותק מעל 3 שנים",
      requirements: [
        "✅ השלמת קורס אבטחת מידע",
        "✅ אישור מנהל ישיר",
        "✅ התקנת VPN ומערכות אבטחה"
      ],
      currentApproval: "מאושר עד סוף 2025",
      equipmentProvided: "מחשב נייד בנק + VPN + נקודת גישה מאובטחת",
      workingHours: "גמישות בשעות עבודה עם שמירה על זמינות לפגישות",
      monthlyUsage: {
        october: { planned: 8, used: 6, remaining: 2 },
        lastMonth: { planned: 8, used: 8, remaining: 0 }
      },
      lastUpdated: "2025-10-19"
    }
  },
  
  "call_center_temp": {
    // פרטים אישיים
    id: "456789123",
    name: "אור ישראלי",
    role: "נציג מוקד זמני",
    department: "שירות לקוחות",
    accessLevel: "basic",
    avatar: "א.י",
    permissions: ["basic", "customer_service"],
    employmentType: "temporary", // זמני
    seniority: 3, // חודשים
    grade: 1,
    hireDate: "2025-07-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "רווק",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2025-07-15"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 0, // אין זכאות לחופשה בחודשים הראשונים
      recovery: 0, // אין זכאות להבראה  
      clothing: 0, // אין זכאות לביגוד עדיין
      gifts: 200, // מתנות מופחתות לזמני
      sickDays: 12, // ימי מחלה בסיסיים
      childSickDays: 0 // אין ילדים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: { used: 0, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 1,
        dates: [
          { date: "2025-09-12", type: "מחלה עצמית" }
        ]
      },
      childSickDays: { used: 0, dates: [] }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 0, // עובד חדש
      vacation: 0  // עובד חדש
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2025: {}
    },
    
    // מערכת משמרות עובד זמני - מוקד טלפוני
    shiftsData: {
      isShiftWorker: true,
      shiftType: "מוקד טלפוני זמני",
      
      // משמרות אוקטובר 2025 (חודש נוכחי)
      october2025: [
        { date: "2025-10-06", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "נוכחי" },
        { date: "2025-10-07", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-08", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-09", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-10", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-11", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-12", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" }
      ]
    },
    
    // נתוני משמרות ושעות נוספות
    workData: {
      monthlyHours: 160, // שעות חודשיות מלאות
      overtimeThisMonth: 3,
      overtimeDetails: [
        { date: "2025-10-09", hours: 3, rate: "125%", approved: true }
      ]
    },

    // נתוני משכנתא אישיים
    mortgageData: {
      eligibility: "לא זכאי", // עובד זמני - אין זכאות
      currentStatus: "אין זכאות למשכנתא",
      reason: "העסקה זמנית - דרוש ותק מינימלי של 12 חודשים כעובד קבוע",
      futureEligibility: "יהיה זכאי לאחר קביעות בתפקיד",
      alternativeOptions: [
        "ייעוץ למשכנתא רגילה מהבנק ללא הטבות עובדים",
        "חסכון להון עצמי עד לקבלת זכאות",
        "בדיקת משכנתא בבנקים אחרים"
      ],
      maxLoanAmount: "לא רלוונטי - אין זכאות",
      interestRateDiscount: "לא רלוונטי - אין זכאות", 
      applicationProcess: "לא זמין - נדרש להמתין לקביעות בתפקיד",
      lastUpdated: "2025-10-19"
    },

    // נתוני ארנק דיגיטלי אישיים
    digitalWalletData: {
      currentBalance: "450 ₪",
      monthlyAllocation: "400 ₪",
      usedThisMonth: "125 ₪",
      remainingThisMonth: "275 ₪",
      lastTransaction: {
        date: "2025-10-17",
        amount: "35 ₪",
        description: "ארוחת בוקר - קפטריה"
      },
      categories: {
        meals: { budget: "200 ₪", used: "85 ₪", remaining: "115 ₪" },
        transport: { budget: "150 ₪", used: "40 ₪", remaining: "110 ₪" },
        wellness: { budget: "50 ₪", used: "0 ₪", remaining: "50 ₪" }
      },
      restrictions: [
        "עובד זמני - הקצבה מופחתת",
        "מגבלה יומית של 80 ₪",
        "לא זכאי להטבות רווחה מלאות"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "לא זכאי",
      currentStatus: "לא מאושר",
      maxDaysPerWeek: 0,
      reason: "עובד זמני - אין זכאות לעבודה מהבית בתקופת הניסיון",
      requirements: [
        "❌ נדרשת קביעות בתפקיד",
        "❌ השלמת 12 חודשי ותק כעובד קבוע", 
        "❌ אישור מנהל ישיר לאחר קביעות"
      ],
      currentApproval: "לא רלוונטי - עובד זמני",
      equipmentProvided: "לא זמין",
      workingHours: "חובה לעבוד במשרד - אין אפשרות עבודה מרחוק",
      futureEligibility: "יהיה זכאי לאחר קביעות בתפקיד ו-12 חודשי ותק",
      lastUpdated: "2025-10-19"
    }
  },
  
  "branch": {
    // פרטים אישיים
    id: "789123456",
    name: "דוד לוי",
    role: "מנהל סניף",
    department: "סניף תל אביב",
    accessLevel: "branch",
    avatar: "ד.ל",
    permissions: ["basic", "branch", "credit"],
    employmentType: "permanent", // קבוע
    seniority: 84, // חודשים (7 שנים)
    grade: 8,
    hireDate: "2017-10-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "נשוי",
      numberOfChildren: 3,
      childrenAges: [15, 17, 20],
      spouseDetails: { name: "רונית לוי", birthYear: 1985 },
      lastUpdated: "2025-01-25"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 21, // ימי חופשה - 5+ שנים
      recovery: 7,  // זכאות להבראה מלאה
      clothing: 2000, // ביגוד מנהלים
      gifts: 800,   // מתנות מנהלים מוגברות
      sickDays: 18, // ימי מחלה מלאים
      childSickDays: 8 // ימי מחלת ילד מלאים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: {
        used: 16,
        dates: [
          { startDate: "2025-02-12", endDate: "2025-02-16", days: 5, type: "חופשה שנתית" },
          { startDate: "2025-08-05", endDate: "2025-08-16", days: 10, type: "חופשה רציפה" },
          { startDate: "2025-09-30", endDate: "2025-09-30", days: 1, type: "יום יומולדת" }
        ]
      },
      recovery: {
        used: 7,
        dates: [
          { startDate: "2025-06-10", endDate: "2025-06-16", days: 7, type: "הבראה מלאה" }
        ]
      },
      sickDays: {
        used: 3,
        dates: [
          { date: "2025-01-22", type: "מחלה עצמית" },
          { date: "2025-04-18", type: "מחלה עצמית" },
          { date: "2025-07-30", type: "מחלה עצמית" }
        ]
      },
      childSickDays: {
        used: 2,
        dates: [
          { date: "2025-03-12", childAge: 15, type: "מחלת ילד" },
          { date: "2025-05-28", childAge: 17, type: "מחלת ילד" }
        ]
      }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 45, // ימי מחלה מצטברים רבים
      vacation: 5   // חופשה מועברת מקסימלית
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 2, // רק עד גיל 18
      giftStatus2025: {
        "ראש השנה": "נמסר",
        "חנוכה": "נמסר",
        "פסח": "לא רלוונטי עדיין"
      }
    },
    
    // נתוני משמרות ושעות נוספות (מנהלים פטורים)
    workData: {
      monthlyHours: 160,
      overtimeThisMonth: 0, // פטור משעות נוספות
      overtimeDetails: [],
      managementCompensation: true // זכאי להפגה במקום שעות נוספות
    },

    // נתוני משכנתא אישיים
    mortgageData: {
      eligibility: "זכאי מלא VIP", // מנהל בכיר - זכאות מקסימלית
      currentStatus: "משכנתא פעילה + הלוואה שיפוצים",
      currentMortgage: {
        loanAmount: "2,400,000 ₪",
        monthlyPayment: "7,800 ₪",
        interestRate: "3.8% (הנחת עובדים 1.0%)",
        startDate: "2022-03-01", 
        yearsRemaining: 16
      },
      additionalActiveLoans: {
        renovationLoan: "180,000 ₪ (תשלום חודשי: 1,200 ₪)"
      },
      maxLoanAmount: "עד 80% מערך הנכס",
      interestRateDiscount: "1.0% הנחה מהריבית הבסיסית (הנחה מקסימלית)",
      specialConditions: [
        "אישור מיידי תוך 5 ימי עסקים",
        "גמישות מקסימלית בתנאי האשראי", 
        "זכאות למשכנתא נוספת עד 70%",
        "ייעוץ אישי ממומחי המשכנתאות"
      ],
      additionalLoans: {
        renovationLoan: "זכאי עד 300,000 ₪ בריבית מועדפת",
        equityLoan: "זכאי עד 250,000 ₪ להון עצמי",
        investmentLoan: "זכאי להלוואה השקעות עד 200,000 ₪"
      },
      applicationProcess: "טיפול VIP דרך מנהל משכנתאות בכיר עם יועץ אישי",
      lastUpdated: "2025-10-19"
    },

    // נתוני ארנק דיגיטלי אישיים  
    digitalWalletData: {
      currentBalance: "4,800 ₪",
      monthlyAllocation: "2,000 ₪",
      usedThisMonth: "1,250 ₪",
      remainingThisMonth: "750 ₪",
      lastTransaction: {
        date: "2025-10-19",
        amount: "150 ₪",
        description: "ארוחת עסקים - מסעדה חיצונית"
      },
      categories: {
        meals: { budget: "800 ₪", used: "480 ₪", remaining: "320 ₪" },
        transport: { budget: "600 ₪", used: "420 ₪", remaining: "180 ₪" },
        wellness: { budget: "400 ₪", used: "250 ₪", remaining: "150 ₪" },
        business: { budget: "200 ₪", used: "100 ₪", remaining: "100 ₪" }
      },
      restrictions: [
        "מנהל בכיר - זכאות מקסימלית",
        "הנחות VIP במסעדות ובתי מלון",
        "גמישות מלאה בקטגוריות השונות"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "זכאי מלא VIP",
      currentStatus: "מאושר",
      maxDaysPerWeek: 3,
      approvedDays: ["שני", "רביעי", "חמישי"],
      reason: "מנהל בכיר - גמישות מלאה לצורכי ניהול",
      requirements: [
        "✅ סמכויות ניהול מלאות",
        "✅ גישה מרחוק לכל מערכות הבנק",
        "✅ ציוד מתקדם לפגישות וידאו"
      ],
      currentApproval: "מאושר קבוע ללא הגבלת זמן",
      equipmentProvided: "מחשב נייד מתקדם + VIP setup + ציוד וידאו קונפרנס",
      workingHours: "גמישות מלאה בשעות עבודה - זמינות לצורכי הסניף",
      monthlyUsage: {
        october: { planned: 12, used: 9, remaining: 3 },
        lastMonth: { planned: 12, used: 11, remaining: 1 }
      },
      specialPrivileges: [
        "יכולת לאשר עבודה מהבית לעובדי הסניף",
        "גישה לחדרי ישיבות וירטואליים מתקדמים", 
        "עדיפות בתמיכה טכנית"
      ],
      lastUpdated: "2025-10-19"
    }
  },
  
  "branch_temp": {
    // פרטים אישיים
    id: "321654987",
    name: "נועה כהן",
    role: "פקידת סניף זמנית",
    department: "סניף חיפה",
    accessLevel: "basic",
    avatar: "נ.כ",
    permissions: ["basic", "branch_basic"],
    employmentType: "temporary", // זמני
    seniority: 6, // חודשים
    grade: 2,
    hireDate: "2025-04-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 1,
      childrenAges: [3],
      spouseDetails: { name: "עמית כהן", birthYear: 1990 },
      lastUpdated: "2025-04-15"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 8, // ימי חופשה חלקיים לזמני עם ותק
      recovery: 0, // אין זכאות להבראה
      clothing: 600, // ביגוד חלקי
      gifts: 300, // מתנות מופחתות
      sickDays: 15, // ימי מחלה
      childSickDays: 6 // ימי מחלת ילד חלקיים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: {
        used: 3,
        dates: [
          { startDate: "2025-07-08", endDate: "2025-07-10", days: 3, type: "חופשה שנתית" }
        ]
      },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 4,
        dates: [
          { date: "2025-05-15", type: "מחלה עצמית" },
          { date: "2025-06-22", type: "מחלה עצמית" },
          { date: "2025-08-07", type: "מחלה עצמית" },
          { date: "2025-09-19", type: "מחלה עצמית" }
        ]
      },
      childSickDays: {
        used: 2,
        dates: [
          { date: "2025-06-12", childAge: 3, type: "מחלת ילד" },
          { date: "2025-08-25", childAge: 3, type: "מחלת ילד" }
        ]
      }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 0, // עובדת חדשה
      vacation: 0  // עובדת חדשה
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 1,
      giftStatus2025: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "לא רלוונטי עדיין"
      }
    },
    
    // נתוני משמרות ושעות נוספות
    workData: {
      monthlyHours: 160,
      overtimeThisMonth: 5,
      overtimeDetails: [
        { date: "2025-10-03", hours: 2, rate: "125%", approved: true },
        { date: "2025-10-11", hours: 3, rate: "125%", approved: true }
      ]
    },
    
    // מערכת משמרות עובדת שעתית - מוקד טלפוני
    shiftsData: {
      isShiftWorker: true,
      shiftType: "מוקד טלפוני שעתי",
      
      // משמרות ספטמבר 2025 (חודש אחורה)
      september2025: [
        { date: "2025-09-01", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-02", day: "שני", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-03", day: "שלישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-04", day: "רביעי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-05", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-06", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-07", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        
        { date: "2025-09-08", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-09", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-10", day: "שלישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-11", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-12", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-13", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-14", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-09-15", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-16", day: "שני", shift: "ראש השנה", startTime: "", endTime: "", hours: 0, status: "חג" },
        { date: "2025-09-17", day: "שלישי", shift: "ראש השנה", startTime: "", endTime: "", hours: 0, status: "חג" },
        { date: "2025-09-18", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-19", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-20", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-21", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-09-22", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-23", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-24", day: "שלישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-25", day: "רביעי", shift: "כיפור", startTime: "", endTime: "", hours: 0, status: "חג" },
        { date: "2025-09-26", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-09-27", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-09-28", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-09-29", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-09-30", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" }
      ],
      
      // משמרות אוקטובר 2025 (חודש נוכחי)
      october2025: [
        { date: "2025-10-01", day: "שלישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-10-02", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "הושלם" },
        { date: "2025-10-03", day: "חמישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "הושלם" },
        { date: "2025-10-04", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-05", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-10-06", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "נוכחי" },
        { date: "2025-10-07", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-08", day: "שלישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-09", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-10", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-11", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-12", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-10-13", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-14", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-15", day: "שלישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-16", day: "רביעי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-17", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-18", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-19", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-10-20", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-21", day: "שני", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-22", day: "שלישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-23", day: "רביעי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-24", day: "חמישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-25", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-10-26", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-10-27", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-28", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-29", day: "שלישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-30", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-10-31", day: "חמישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" }
      ],

      // משמרות נובמבר 2025 (חודש קדימה)
      november2025: [
        { date: "2025-11-01", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-02", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-03", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-04", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-05", day: "שלישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-06", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-07", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-08", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-09", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-11-10", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-11", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-12", day: "שלישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-13", day: "רביעי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-14", day: "חמישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-15", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-16", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-11-17", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-18", day: "שני", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-19", day: "שלישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-20", day: "רביעי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-21", day: "חמישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-22", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-23", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },

        { date: "2025-11-24", day: "ראשון", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-25", day: "שני", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-26", day: "שלישי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-27", day: "רביעי", shift: "בוקר", startTime: "07:00", endTime: "15:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-28", day: "חמישי", shift: "ערב", startTime: "13:00", endTime: "21:00", hours: 8, status: "מתוכנן" },
        { date: "2025-11-29", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" },
        { date: "2025-11-30", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש" }
      ],
      
      // סטטיסטיקות משמרות
      shiftsStats: {
        totalHoursThisMonth: 168, // כ-21 ימי עבודה * 8 שעות
        morningShifts: 11,
        eveningShifts: 10,
        nightShifts: 0,
        daysOff: 9,
        holidays: 0
      }
    },

    // נתוני ארנק דיגיטלי אישיים
    digitalWalletData: {
      currentBalance: "1,200 ₪",
      monthlyAllocation: "600 ₪",
      usedThisMonth: "385 ₪",
      remainingThisMonth: "215 ₪",
      lastTransaction: {
        date: "2025-10-16",
        amount: "45 ₪",
        description: "ארוחת צהריים עם הילד - קפטריה"
      },
      categories: {
        meals: { budget: "300 ₪", used: "190 ₪", remaining: "110 ₪" },
        transport: { budget: "200 ₪", used: "145 ₪", remaining: "55 ₪" },
        wellness: { budget: "100 ₪", used: "50 ₪", remaining: "50 ₪" }
      },
      restrictions: [
        "עובדת זמנית - הקצבה מופחתת",
        "מגבלה יומית של 100 ₪",
        "הטבות חלקיות עד לקביעות בתפקיד"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "זכאי מוגבל",
      currentStatus: "מאושר חלקית",
      maxDaysPerWeek: 1,
      approvedDays: ["רביעי"],
      reason: "עובדת זמנית עם ילד קטן - זכאות חלקית מטעמי רווחה",
      requirements: [
        "✅ אישור מנהל סניף",
        "✅ השלמת 6 חודשי ותק",
        "⏳ ממתינה לקורס אבטחת מידע"
      ],
      currentApproval: "מאושר זמנית עד סוף השנה",
      equipmentProvided: "מחשב נייד בנק + VPN בסיסי",
      workingHours: "שעות קבועות עם גמישות קלה לצורכי הילד",
      monthlyUsage: {
        october: { planned: 4, used: 3, remaining: 1 },
        lastMonth: { planned: 4, used: 4, remaining: 0 }
      },
      familyAccommodations: [
        "הקלות לאם עם ילד קטן",
        "אפשרות להפסקות נוספות לטיפול בילד",
        "גמישות בשעות התחלה וסיום"
      ],
      lastUpdated: "2025-10-19"
    }
  },
  
  "tech": {
    // פרטים אישיים
    id: "654321789",
    name: "שרה גולדמן",
    role: "מפתחת תוכנה",
    department: "חטיבת טכנולוגיות",
    accessLevel: "tech",
    avatar: "ש.ג",
    permissions: ["basic", "tech", "systems"],
    employmentType: "permanent", // קבוע
    seniority: 48, // חודשים (4 שנים)
    grade: 7,
    hireDate: "2022-10-01",
    
    // נתוני משפחה (טופס 101)
    familyData: {
      maritalStatus: "רווקה",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2025-01-10"
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 18, // ימי חופשה - 1-5 שנים
      recovery: 7,  // זכאות להבראה מלאה
      clothing: 1800, // ביגוד מפתחים מוגבר
      gifts: 600,   // מתנות טכנולוגיה
      sickDays: 18, // ימי מחלה מלאים
      childSickDays: 0 // אין ילדים
    },
    
    // ניצול השנה 2025
    currentYearUsage: {
      vacation: {
        used: 10,
        dates: [
          { startDate: "2025-01-15", endDate: "2025-01-19", days: 5, type: "חופשה שנתית" },
          { startDate: "2025-05-20", endDate: "2025-05-24", days: 5, type: "חופשה שנתית" }
        ]
      },
      recovery: {
        used: 0,
        dates: []
      },
      sickDays: {
        used: 2,
        dates: [
          { date: "2025-03-18", type: "מחלה עצמית" },
          { date: "2025-07-25", type: "מחלה עצמית" }
        ]
      },
      childSickDays: { used: 0, dates: [] }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 32, // ימי מחלה מצטברים
      vacation: 4   // חופשה מועברת
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2025: {}
    },
    
    // נתוני משמרות ושעות נוספות (דרגה גבוהה - פטורה)
    workData: {
      monthlyHours: 160,
      overtimeThisMonth: 0, // פטורה משעות נוספות
      overtimeDetails: [],
      managementCompensation: true // זכאית להפגה
    },

    // נתוני משכנתא אישיים
    mortgageData: {
      eligibility: "זכאי מלא Tech", // מפתחת - זכאות מלאה עם הטבות טכנולוגיה
      currentStatus: "משכנתא פעילה",
      currentMortgage: {
        loanAmount: "2,200,000 ₪",
        monthlyPayment: "7,100 ₪",
        interestRate: "3.9% (הנחת עובדים 0.8%)",
        startDate: "2022-12-01",
        yearsRemaining: 17
      },
      maxLoanAmount: "עד 75% מערך הנכס + הטבה טכנולוגית",
      interestRateDiscount: "0.8% הנחה מהריבית הבסיסית + הטבת היי-טק",
      specialConditions: [
        "אישור מהיר תוך 7 ימי עסקים",
        "גמישות גבוהה בתנאי האשראי",
        "הטבות מיוחדות לעובדי טכנולוגיה",
        "זכאות למשכנתא נוספת להשקעות",
        "ייעוץ מומחה למשכנתאות היי-טק"
      ],
      additionalLoans: {
        renovationLoan: "זכאי עד 250,000 ₪ בריבית מועדפת",
        equityLoan: "זכאי עד 200,000 ₪ להון עצמי",
        techLoan: "זכאי להלוואת ציוד טכנולוגי עד 80,000 ₪"
      },
      applicationProcess: "טיפול מהיר דרך מחלקת משכנתאות היי-טק עם ייעוץ מתמחה",
      lastUpdated: "2025-10-19"
    },

    // נתוני ארנק דיגיטלי אישיים
    digitalWalletData: {
      currentBalance: "3,850 ₪",
      monthlyAllocation: "1,500 ₪",
      usedThisMonth: "890 ₪",
      remainingThisMonth: "610 ₪",
      lastTransaction: {
        date: "2025-10-18",
        amount: "95 ₪",
        description: "קורס פיתוח און-ליין - השתלמות מקצועית"
      },
      categories: {
        meals: { budget: "600 ₪", used: "280 ₪", remaining: "320 ₪" },
        transport: { budget: "300 ₪", used: "180 ₪", remaining: "120 ₪" },
        wellness: { budget: "400 ₪", used: "330 ₪", remaining: "70 ₪" },
        professional: { budget: "200 ₪", used: "100 ₪", remaining: "100 ₪" }
      },
      restrictions: [
        "עובדת טכנולוגיה - זכאות מקצועית מורחבת",
        "הטבות נוספות על קורסים ושתמלמויות",
        "גמישות בקטגוריית פיתוח מקצועי"
      ]
    },

    // נתוני עבודה מהבית אישיים
    workFromHomeData: {
      eligibility: "זכאי מלא היי-טק",
      currentStatus: "מאושר",
      maxDaysPerWeek: 4,
      approvedDays: ["שני", "שלישי", "רביעי", "חמישי"],
      reason: "מפתחת בכירה - עבודה היברידית אידיאלית למתכנתים",
      requirements: [
        "✅ סביבת פיתוח מתקדמת בבית",
        "✅ חיבור אינטרנט מהיר וביטוח גיבוי",
        "✅ VPN מאובטח לגישה לסביבות פיתוח"
      ],
      currentApproval: "מאושר עד סוף 2025 עם אופציה להארכה",
      equipmentProvided: "מחשב נייד פיתוח מתקדם + 2 מסכים + ציוד אבטחת מידע",
      workingHours: "גמישות מלאה בשעות פיתוח עם availability לפגישות צוות",
      monthlyUsage: {
        october: { planned: 16, used: 14, remaining: 2 },
        lastMonth: { planned: 16, used: 16, remaining: 0 }
      },
      techBenefits: [
        "גישה מרחוק לכל סביבות הפיתוח",
        "רשת VPN מתקדמת לטסטים ו-debugging",
        "תמיכה טכנית 24/7 לבעיות פיתוח",
        "אפשרות עבודה לילית עם אישור מוקדם"
      ],
      lastUpdated: "2025-10-19"
    }
  },
  
  // רפרנס נוסף לרחל כהן בשם "hourly" לתאימות
  "hourly": null // Will be set below
};

// Set the hourly reference to the same data as call_center (Rachel Cohen)
employeeDatabase.hourly = employeeDatabase.call_center;

// Alias for backward compatibility
const userProfiles = employeeDatabase;

// Main chatbot page
app.get('/', (c) => {
  const userType = c.req.query('user') || 'call_center';
  const currentUser = userProfiles[userType] || userProfiles.call_center;
  
  return c.render(
    <div class="app-container">
      {/* Main Chat Area */}
      <div class="chat-container">
        {/* Chat Header */}
        <div class="chat-header">
          <div class="logo">
            <img src="https://page.gensparksite.com/v1/base64_upload/e17c2fb9f005af7e1ed1694d3a9f309d" 
                 alt="DBRAIN - לוגו צ'אטבוט חכם" 
                 style="height: 40px; object-fit: contain;" />
          </div>
          <div class="title">
            <h1>DBRAIN - עוזר הידע החכם</h1>
            <p>בינה מלאכותית לבנק דיסקונט • "בדיסקונט משקיעים בך!"</p>
          </div>
          <div class="user-info">
            <div class="user-badge">
              <div class="status-indicator"></div>
              <span>{currentUser.name}</span>
              <div style="font-size: 0.75rem; opacity: 0.9;">
                {currentUser.role}<br/>
                {currentUser.employmentType === 'permanent' ? '🟢 קבוע' : 
                 currentUser.employmentType === 'temporary' ? '🟡 זמני' : '🔵 שעתי'} • 
                דרגה {currentUser.grade} • 
                {Math.floor(currentUser.seniority / 12) > 0 ? `${Math.floor(currentUser.seniority / 12)} שנים` : `${currentUser.seniority} חודשים`}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div class="chat-messages" id="chat-messages">
          {/* Welcome Message */}
          <div class="message message-assistant">
            <div class="message-avatar">DB</div>
            <div class="message-content">
              <p class="message-text">
                שלום {currentUser.name}! 👋<br/>
                אני <strong>DBRAIN</strong> - עוזר הידע החכם עם בינה מלאכותית של בנק דיסקונט. <br/>
                זיהיתי אותך כ<strong>{currentUser.employmentType === 'permanent' ? 'עובד קבוע' : 
                currentUser.employmentType === 'temporary' ? 'עובד זמני' : 'עובד שעתי'}</strong> ב{currentUser.department}.<br/>
                <strong>בדיסקונט משקיעים בך!</strong> התשובות שלי מותאמות אישית לסטטוס ההעסקה ולזכויותיך.<br/>
                <strong>איך אני יכול לעזור לך היום? 🤖</strong>
              </p>
              <div class="message-meta">
                <i class="fas fa-clock"></i>
                <span id="current-time"></span>
                <span>•</span>
                <span>מחובר כ{currentUser.role}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="quick-actions">
            <div class="quick-action" onclick="sendQuickMessage('ניצול ימי חופשה שלי')">
              <i class="fas fa-calendar-alt"></i>
              <span>ניצול ימי חופשה</span>
            </div>
            <div class="quick-action" onclick="sendQuickMessage('יתרת ארנק דיגיטלי שלי')">
              <i class="fas fa-wallet"></i>
              <span>יתרת ארנק דיגיטלי</span>
            </div>
            <div class="quick-action" onclick="sendQuickMessage('עבודה מהבית שלי')">
              <i class="fas fa-laptop-house"></i>
              <span>עבודה מהבית</span>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div class="chat-input">
          <div class="input-container">
            <div class="input-wrapper">
              <textarea 
                id="chat-input"
                class="chat-textarea"
                placeholder="כתוב כאן את השאלה שלך..."
                rows="1"
                onkeydown="handleKeyDown(event)"
              ></textarea>
              <button 
                id="send-button"
                class="send-button"
                onclick="sendMessage()"
                type="button"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar with Chat History */}
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img src="https://page.gensparksite.com/v1/base64_upload/e17c2fb9f005af7e1ed1694d3a9f309d" 
                 alt="DBRAIN" 
                 style="height: 24px; object-fit: contain;" />
          </div>
          <h3 class="sidebar-title">היסטוריית שיחות</h3>
          <button class="new-chat-btn" onclick="startNewChat()">
            <i class="fas fa-plus"></i>
            שיחה חדשה
          </button>
        </div>
        <div class="chat-history" id="chat-history">
          {/* Example chat history items - will be populated by JavaScript */}
          <div class="chat-item active" onclick="loadChatHistory('current')">
            <div class="chat-item-title">שיחה נוכחית</div>
            <div class="chat-item-preview">שלום {currentUser.name}! איך אני יכול לעזור...</div>
            <div class="chat-item-time">עכשיו</div>
          </div>
          <div class="chat-item" onclick="loadChatHistory('1')">
            <div class="chat-item-title">שאלות על ימי חופשה</div>
            <div class="chat-item-preview">כמה ימי חופשה נשארו לי השנה?</div>
            <div class="chat-item-time">אתמול</div>
          </div>
          <div class="chat-item" onclick="loadChatHistory('2')">
            <div class="chat-item-title">בירור זכויות ארנק דיגיטלי</div>
            <div class="chat-item-preview">מה היתרה שלי בארנק הדיגיטלי?</div>
            <div class="chat-item-time">לפני 3 ימים</div>
          </div>
          <div class="chat-item" onclick="loadChatHistory('3')">
            <div class="chat-item-title">עבודה מהבית</div>
            <div class="chat-item-preview">איך אני יכול לקבל אישור לעבודה מהבית?</div>
            <div class="chat-item-time">השבוע</div>
          </div>
          <div class="chat-item" onclick="loadChatHistory('4')">
            <div class="chat-item-title">שאלות על משכנתא</div>
            <div class="chat-item-preview">מה התנאים למשכנתא לעובדי הבנק?</div>
            <div class="chat-item-time">השבוע</div>
          </div>
          <div class="chat-item" onclick="loadChatHistory('5')">
            <div class="chat-item-title">ימי מחלה וזכויות</div>
            <div class="chat-item-preview">כמה ימי מחלה צברתי השנה?</div>
            <div class="chat-item-time">לפני שבוע</div>
          </div>
        </div>
      </div>
    </div>
  )
})

// פונקציות עזר לחישוב יתרות וזכאויות
function calculateVacationBalance(employee) {
  const entitled = employee.annualEntitlements.vacation + employee.accumulatedBalance.vacation;
  const used = employee.currentYearUsage.vacation.used;
  return {
    entitled,
    used, 
    remaining: entitled - used,
    details: employee.currentYearUsage.vacation.dates
  };
}

function calculateSickDaysBalance(employee) {
  const annualEntitlement = employee.annualEntitlements.sickDays;
  const accumulated = employee.accumulatedBalance.sickDays;
  const totalEntitled = Math.min(annualEntitlement + accumulated, 90); // מקסימום 90 ימים
  const used = employee.currentYearUsage.sickDays.used;
  
  return {
    annualEntitlement,
    accumulated,
    totalEntitled,
    used,
    remaining: totalEntitled - used,
    details: employee.currentYearUsage.sickDays.dates
  };
}

function calculateChildSickDaysBalance(employee) {
  const entitled = employee.annualEntitlements.childSickDays;
  const used = employee.currentYearUsage.childSickDays.used;
  
  return {
    entitled,
    used,
    remaining: entitled - used,
    details: employee.currentYearUsage.childSickDays.dates,
    eligibleChildren: employee.familyData.numberOfChildren
  };
}

function calculateRecoveryBalance(employee) {
  const entitled = employee.annualEntitlements.recovery;
  const used = employee.currentYearUsage.recovery.used;
  
  return {
    entitled,
    used,
    remaining: entitled - used,
    details: employee.currentYearUsage.recovery.dates
  };
}

function calculateOvertimeStatus(employee) {
  const currentMonth = employee.workData.overtimeThisMonth;
  const maxMonthly = employee.grade <= 6 ? 25 : 15; // מגבלות לפי דרגה
  const isExempt = employee.grade >= 7 || employee.workData.managementCompensation;
  
  return {
    currentMonth,
    maxMonthly: isExempt ? 0 : maxMonthly,
    remaining: isExempt ? 0 : Math.max(0, maxMonthly - currentMonth),
    isExempt,
    details: employee.workData.overtimeDetails || []
  };
}

function getChildrenGiftStatus(employee) {
  return {
    eligibleChildren: employee.childrenGifts.eligibleChildren,
    childrenAges: employee.familyData.childrenAges,
    status2025: employee.childrenGifts.giftStatus2025
  };
}

function getMortgageStatus(employee) {
  const mortgageData = employee.mortgageData;
  
  // אם אין נתוני משכנתא - החזר ברירת מחדל
  if (!mortgageData) {
    return {
      eligibility: "לא זמין",
      currentStatus: "נתונים לא זמינים",
      maxLoanAmount: "נתונים לא זמינים",
      interestRateDiscount: "נתונים לא זמינים",
      specialConditions: ["פנה למחלקת משכנתאות לקבלת פרטים מדויקים"],
      additionalLoans: {},
      applicationProcess: "פנה למחלקת משכנתאות",
      lastUpdated: "2025-10-19"
    };
  }
  
  return {
    eligibility: mortgageData.eligibility,
    currentStatus: mortgageData.currentStatus,
    currentMortgage: mortgageData.currentMortgage,
    maxLoanAmount: mortgageData.maxLoanAmount,
    interestRateDiscount: mortgageData.interestRateDiscount,
    specialConditions: mortgageData.specialConditions,
    additionalLoans: mortgageData.additionalLoans,
    applicationProcess: mortgageData.applicationProcess,
    lastUpdated: mortgageData.lastUpdated
  };
}

// פונקציות חישוב משמרות
function getWeeklyShifts(employee, targetDate = null) {
  // אם העובד לא עובד במשמרות
  if (!employee.shiftsData || !employee.shiftsData.isShiftWorker) {
    return {
      isShiftWorker: false,
      message: "העובד לא עובד במשמרות - עבודה בשעות קבועות"
    };
  }
  
  // For demo purposes, we'll simulate being in October 2025
  const today = targetDate ? new Date(targetDate) : new Date('2025-10-06');
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based  
  const currentYear = today.getFullYear();
  
  // מצא את השבוע הנוכחי (ראשון עד שבת)
  const dayOfWeek = today.getDay(); // 0 = ראשון, 6 = שבת
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  const weekShifts = [];
  
  // קבל את המשמרות לחודש הנוכחי
  let monthlyShifts = [];
  if (currentMonth === 9 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.september2025 || [];
  } else if (currentMonth === 10 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.october2025 || [];
  } else if (currentMonth === 11 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.november2025 || [];
  }
  
  // מצא משמרות לשבוע הנוכחי
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(startOfWeek);
    checkDate.setDate(startOfWeek.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const shift = monthlyShifts.find(s => s.date === dateStr);
    if (shift) {
      weekShifts.push(shift);
    }
  }
  
  // סטטיסטיקות השבוע
  const workDays = weekShifts.filter(s => s.hours > 0);
  const totalHours = workDays.reduce((sum, s) => sum + s.hours, 0);
  const daysOff = weekShifts.filter(s => s.hours === 0);
  
  return {
    isShiftWorker: true,
    shiftType: employee.shiftsData.shiftType,
    weekShifts: weekShifts,
    weekStats: {
      totalHours: totalHours,
      workDays: workDays.length,
      daysOff: daysOff.length,
      morningShifts: workDays.filter(s => s.shift === 'בוקר').length,
      eveningShifts: workDays.filter(s => s.shift === 'ערב').length,
      nightShifts: workDays.filter(s => s.shift === 'לילה').length
    },
    weekRange: {
      start: startOfWeek.toISOString().split('T')[0],
      end: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };
}

function getMonthlyShifts(employee, targetMonth = null, targetYear = null) {
  // אם העובד לא עובד במשמרות
  if (!employee.shiftsData || !employee.shiftsData.isShiftWorker) {
    return {
      isShiftWorker: false,
      message: "העובד לא עובד במשמרות - עבודה בשעות קבועות"
    };
  }
  
  // For demo purposes, we'll simulate being in October 2025
  const today = new Date('2025-10-06');
  const month = targetMonth || (today.getMonth() + 1);
  const year = targetYear || today.getFullYear();
  
  // קבל את המשמרות לחודש המבוקש
  let monthlyShifts = [];
  let monthName = '';
  
  if (month === 9 && year === 2025) {
    monthlyShifts = employee.shiftsData.september2025 || [];
    monthName = 'ספטמבר 2025';
  } else if (month === 10 && year === 2025) {
    monthlyShifts = employee.shiftsData.october2025 || [];
    monthName = 'אוקטובר 2025';
  } else if (month === 11 && year === 2025) {
    monthlyShifts = employee.shiftsData.november2025 || [];
    monthName = 'נובמבר 2025';
  }
  
  // חישוב סטטיסטיקות החודש
  const workDays = monthlyShifts.filter(s => s.hours > 0);
  const totalHours = workDays.reduce((sum, s) => sum + s.hours, 0);
  const daysOff = monthlyShifts.filter(s => s.hours === 0);
  const holidays = monthlyShifts.filter(s => s.status === 'חג');
  
  return {
    isShiftWorker: true,
    shiftType: employee.shiftsData.shiftType,
    monthName: monthName,
    monthlyShifts: monthlyShifts,
    monthStats: {
      totalHours: totalHours,
      workDays: workDays.length,
      daysOff: daysOff.length,
      holidays: holidays.length,
      morningShifts: workDays.filter(s => s.shift === 'בוקר').length,
      eveningShifts: workDays.filter(s => s.shift === 'ערב').length,
      nightShifts: workDays.filter(s => s.shift === 'לילה').length,
      trainingDays: workDays.filter(s => s.shift === 'הכשרה').length
    }
  };
}

function getTodaysShift(employee) {
  // אם העובד לא עובד במשמרות
  if (!employee.shiftsData || !employee.shiftsData.isShiftWorker) {
    return {
      isShiftWorker: false,
      message: "העובד לא עובד במשמרות - עבודה בשעות קבועות"
    };
  }
  
  // For demo purposes, we'll simulate being in October 6, 2025
  const today = new Date('2025-10-06');
  const dateStr = today.toISOString().split('T')[0];
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  // קבל את המשמרות לחודש הנוכחי
  let monthlyShifts = [];
  if (currentMonth === 9 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.september2025 || [];
  } else if (currentMonth === 10 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.october2025 || [];
  } else if (currentMonth === 11 && currentYear === 2025) {
    monthlyShifts = employee.shiftsData.november2025 || [];
  }
  
  // מצא את המשמרת של היום
  const todaysShift = monthlyShifts.find(s => s.date === dateStr);
  
  if (!todaysShift) {
    return {
      isShiftWorker: true,
      hasShift: false,
      message: "לא נמצאה משמרת להיום"
    };
  }
  
  return {
    isShiftWorker: true,
    hasShift: true,
    shiftType: employee.shiftsData.shiftType,
    todaysShift: todaysShift,
    date: dateStr,
    isWorkingDay: todaysShift.hours > 0,
    shiftStatus: todaysShift.status
  };
}

function getDigitalWalletStatus(employee) {
  const walletData = employee.digitalWalletData;
  
  // אם אין נתוני ארנק - החזר ברירת מחדל
  if (!walletData) {
    return {
      currentBalance: "0 ₪",
      monthlyAllocation: "0 ₪",
      usedThisMonth: "0 ₪",
      remainingThisMonth: "0 ₪",
      categories: {},
      restrictions: ["נתונים לא זמינים במערכת"],
      lastTransaction: null
    };
  }
  
  return {
    currentBalance: walletData.currentBalance,
    monthlyAllocation: walletData.monthlyAllocation,
    usedThisMonth: walletData.usedThisMonth,
    remainingThisMonth: walletData.remainingThisMonth,
    categories: walletData.categories || {},
    restrictions: walletData.restrictions || [],
    lastTransaction: walletData.lastTransaction
  };
}

function getWorkFromHomeStatus(employee) {
  const wfhData = employee.workFromHomeData;
  
  // אם אין נתוני עבודה מהבית - החזר ברירת מחדל
  if (!wfhData) {
    return {
      eligibility: "לא זמין",
      currentStatus: "נתונים לא זמינים",
      maxDaysPerWeek: 0,
      approvedDays: [],
      reason: "נתונים לא זמינים במערכת",
      requirements: ["פנה למחלקת משאבי אנוש לקבלת פרטים"],
      currentApproval: "לא זמין",
      equipmentProvided: "לא זמין",
      workingHours: "לא זמין",
      monthlyUsage: null
    };
  }
  
  return {
    eligibility: wfhData.eligibility,
    currentStatus: wfhData.currentStatus,
    maxDaysPerWeek: wfhData.maxDaysPerWeek,
    approvedDays: wfhData.approvedDays || [],
    reason: wfhData.reason,
    requirements: wfhData.requirements || [],
    currentApproval: wfhData.currentApproval,
    equipmentProvided: wfhData.equipmentProvided,
    workingHours: wfhData.workingHours,
    monthlyUsage: wfhData.monthlyUsage
  };
}

function generatePersonalizedResponse(baseAnswer, employee, topic) {
  let personalSection = "\n\n**📊 המידע האישי שלך:**\n";
  
  switch(topic) {
    case 'vacation':
      const vacBalance = calculateVacationBalance(employee);
      personalSection += `**זכאות שנתית:** ${vacBalance.entitled} ימים\n`;
      personalSection += `**ניצלת השנה:** ${vacBalance.used} ימים\n`;
      personalSection += `**יתרה זמינה:** ${vacBalance.remaining} ימים\n`;
      if (vacBalance.details.length > 0) {
        personalSection += `**חופשות שנלקחו:** ${vacBalance.details.map(d => `${d.startDate} (${d.days} ימים)`).join(', ')}\n`;
      }
      break;
      
    case 'sick':
      const sickBalance = calculateSickDaysBalance(employee);
      personalSection += `**זכאות שנתית:** ${sickBalance.annualEntitlement} ימים\n`;
      personalSection += `**יתרה מצטברת:** ${sickBalance.accumulated} ימים\n`;
      personalSection += `**סה"כ זכאות:** ${sickBalance.totalEntitled} ימים\n`;
      personalSection += `**ניצלת השנה:** ${sickBalance.used} ימים\n`;
      personalSection += `**יתרה זמינה:** ${sickBalance.remaining} ימים\n`;
      break;
      
    case 'childSick':
      const childSickBalance = calculateChildSickDaysBalance(employee);
      personalSection += `**מספר ילדים זכאים:** ${childSickBalance.eligibleChildren}\n`;
      personalSection += `**זכאות שנתית:** ${childSickBalance.entitled} ימים\n`;
      personalSection += `**ניצלת השנה:** ${childSickBalance.used} ימים\n`;
      personalSection += `**יתרה זמינה:** ${childSickBalance.remaining} ימים\n`;
      break;
      
    case 'overtime':
      const overtimeStatus = calculateOvertimeStatus(employee);
      if (overtimeStatus.isExempt) {
        personalSection += `**דרגה ${employee.grade}:** פטור משעות נוספות, זכאי להפגה\n`;
      } else {
        personalSection += `**שעות נוספות החודש:** ${overtimeStatus.currentMonth} שעות\n`;
        personalSection += `**מכסה חודשית:** ${overtimeStatus.maxMonthly} שעות\n`;
        personalSection += `**יתרה זמינה:** ${overtimeStatus.remaining} שעות\n`;
      }
      break;
      
    case 'gifts':
      const giftStatus = getChildrenGiftStatus(employee);
      personalSection += `**ילדים זכאים:** ${giftStatus.eligibleChildren}\n`;
      if (giftStatus.eligibleChildren > 0) {
        personalSection += `**גילאי הילדים:** ${giftStatus.childrenAges.join(', ')}\n`;
        personalSection += `**סטטוס מתנות 2025:**\n`;
        Object.entries(giftStatus.status2025).forEach(([holiday, status]) => {
          personalSection += `  • ${holiday}: ${status}\n`;
        });
      }
      break;
      
    case 'family':
      const family = employee.familyData;
      personalSection += `**סטטוס משפחתי:** ${family.maritalStatus}\n`;
      personalSection += `**מספר ילדים:** ${family.numberOfChildren}\n`;
      if (family.numberOfChildren > 0) {
        personalSection += `**גילאי ילדים:** ${family.childrenAges.join(', ')}\n`;
      }
      personalSection += `**עודכן לאחרונה:** ${family.lastUpdated}\n`;
      break;
      
    default:
      // תגובה כללית עם פרטי עובד
      personalSection += `**סוג העסקה:** ${employee.employmentType === 'permanent' ? 'קבוע' : 
                                          employee.employmentType === 'temporary' ? 'זמני' : 'שעתי'}\n`;
      personalSection += `**ותק:** ${Math.floor(employee.seniority / 12)} שנים, ${employee.seniority % 12} חודשים\n`;
      personalSection += `**דרגה:** ${employee.grade}\n`;
  }
  
  return baseAnswer + personalSection;
}

// API endpoint for chat
app.post('/api/chat', async (c) => {
  try {
    const { message, userType = 'call_center' } = await c.req.json()
    const currentUser = userProfiles[userType] || userProfiles.call_center;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Enhanced keyword matching for demo with personal data support
    const lowerMessage = message.toLowerCase();
    let matchedKnowledge = null;
    let personalTopic = null;
    
    // זיהוי שאלות אישיות עם יתרות ומאגר מידע מותאם אישית
    const personalQuestions = {
      vacation: ['כמה חופשה נשארה', 'כמה ימי חופשה', 'יתרת חופשה', 'חופשה שלי', 'ימי החופשה שלי', 'יתרת ימי חופשה', 'כמה חופשה יש לי', 'ניצול ימי חופשה שלי'],
      sick: ['כמה ימי מחלה', 'יתרת מחלה', 'ימי מחלה שלי', 'כמה מחלה נשארה', 'יתרת ימי מחלה', 'ניצול ימי מחלה שלי'],
      childSick: ['מחלת ילד', 'ימי מחלת ילד שלי', 'כמה ימי מחלת ילד', 'יתרת מחלת ילד'],
      overtime: ['שעות נוספות שלי', 'כמה שעות נוספות', 'יתרת שעות נוספות', 'מכסת שעות נוספות'],
      gifts: ['מתנות לילדים שלי', 'מתנות הילדים', 'סטטוס מתנות', 'מתנות שלי', 'מתנות ילדים שלי'],
      family: ['טופס 101 שלי', 'נתוני המשפחה שלי', 'פרטי משפחה', 'ילדים שלי', 'מצב משפחתי'],
      // יתרת ארנק דיגיטלי - נושא חדש
      digitalWallet: ['יתרת ארנק דיגיטלי', 'ארנק דיגיטלי שלי', 'יתרת הארנק', 'כמה כסף בארנק', 'ארנק דיגיטלי', 'יתרת הארנק הדיגיטלי'],
      // עבודה מהבית - נושא חדש מותאם אישית
      workFromHome: ['עבודה מהבית שלי', 'זכאות עבודה מהבית', 'מתי יכול לעבוד מהבית', 'ימי עבודה מהבית שלי', 'סטטוס עבודה מרחוק שלי', 'עבודה מרחוק שלי'],
      // משמרות - שאלות אישיות על משמרות
      weeklyShifts: ['המשמרות שלי השבוע', 'משמרות השבוע', 'מה המשמרות שלי', 'לוח משמרות השבוע', 'איך המשמרות שלי השבוע', 'משמרות השבוע שלי', 'משמרות', 'המשמרות שלי'],
      monthlyShifts: ['המשמרות שלי החודש', 'משמרות החודש', 'לוח משמרות החודש', 'משמרות החודש שלי', 'איך המשמרות החודש'],
      todayShift: ['המשמרת שלי היום', 'משמרת היום', 'איזה משמרת היום', 'מה המשמרת שלי היום', 'באיזה משמרת אני היום', 'מתי המשמרת שלי היום'],
      // משכנתאות - שאלות אישיות על משכנתאות
      mortgage: ['המשכנתא שלי', 'זכאות משכנתא שלי', 'תנאי המשכנתא שלי', 'סטטוס המשכנתא', 'כמה משכנתא אני יכול', 'איך לקבל משכנתא', 'משכנתא עובדים', 'הטבות משכנתא שלי']
    };
    
    // בדיקה אם זו שאלה אישית
    for (const [topic, keywords] of Object.entries(personalQuestions)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        personalTopic = topic;
        break;
      }
    }
    
    // Priority-based keyword matching - more specific first
    if (lowerMessage.includes('חופשה') || lowerMessage.includes('חופש')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('חופשה'));
    } else if (lowerMessage.includes('מחלה') || lowerMessage.includes('חולה')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('מחלה'));
    } else if ((lowerMessage.includes('שעות') && lowerMessage.includes('נוספות')) || lowerMessage.includes('תגמול')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('שעות נוספות'));
    } else if ((lowerMessage.includes('שעות') && lowerMessage.includes('עבודה')) || lowerMessage.includes('משמרת')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('שעות העבודה'));
    } else if (lowerMessage.includes('לידה') || lowerMessage.includes('הורות') || lowerMessage.includes('הריון')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('הורות'));
    } else if (lowerMessage.includes('תלונה') || lowerMessage.includes('פנייה') || lowerMessage.includes('בעיה')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('תלונה'));
    } else if (lowerMessage.includes('משכנתא') || lowerMessage.includes('הלוואת דיור') || lowerMessage.includes('מימון דירה')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('משכנתא'));
    } else if (lowerMessage.includes('מרחוק') || lowerMessage.includes('בית') || lowerMessage.includes('טלעבודה')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('מרחוק'));
    } else if (lowerMessage.includes('אישור') && lowerMessage.includes('חופשה') && lowerMessage.includes('מנהל')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('אישור חופשה'));
    } else if (lowerMessage.includes('עמלה') || lowerMessage.includes('חיוב') || lowerMessage.includes('זיכוי')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('עמלה'));
    } else if (lowerMessage.includes('הלוואה') || lowerMessage.includes('אשראי') || lowerMessage.includes('מימון')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('הלוואה'));
    } else if (lowerMessage.includes('גישה') || (lowerMessage.includes('מערכת') && (lowerMessage.includes('הרשאה') || lowerMessage.includes('ליבה')))) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('גישה למערכת'));
    } else if (lowerMessage.includes('פעילות') && lowerMessage.includes('מערכות')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('שעות הפעילות'));
    } else if ((lowerMessage.includes('משמרות') && !lowerMessage.includes('שלי') && !lowerMessage.includes('השבוע') && !lowerMessage.includes('החודש') && !lowerMessage.includes('היום')) || 
               lowerMessage.includes('קובץ משמרות') || 
               (lowerMessage.includes('מערכת') && lowerMessage.includes('משמרות'))) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('קובץ המשמרות'));
    } else if ((lowerMessage.includes('זכאויות') && lowerMessage.includes('ניצול')) || lowerMessage.includes('מערכת זכאויות')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('מערכת הזכאויות'));
    } else if (lowerMessage.includes('טופס 101') || (lowerMessage.includes('נתוני') && lowerMessage.includes('משפחה'))) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('טופס 101'));
    } else if ((lowerMessage.includes('חופשה') && lowerMessage.includes('רציפה')) || lowerMessage.includes('ניצול חופשה')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('חופשה רציפה'));
    } else if ((lowerMessage.includes('מתנות') && lowerMessage.includes('ילדים')) || lowerMessage.includes('זכאות מתנות')) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('מתנות לילדים'));
    } else if ((lowerMessage.includes('זכאות') && lowerMessage.includes('חודשית')) || (lowerMessage.includes('חודשית') && lowerMessage.includes('שעות'))) {
      matchedKnowledge = knowledgeBase.find(kb => kb.question.includes('זכאות חודשית'));
    }
    
    // Fallback: try direct text similarity
    if (!matchedKnowledge) {
      for (const kb of knowledgeBase) {
        const similarity = calculateSimilarity(lowerMessage, kb.question.toLowerCase());
        if (similarity > 0.2) {
          matchedKnowledge = kb;
          break;
        }
      }
    }
    
    let response;
    
    // טיפול בשאלות אישיות עם נתונים מהמאגר
    if (personalTopic) {
      let personalResponse = "";
      let sources = ["מאגר נתוני עובדים", "מערכת HR"];
      
      switch (personalTopic) {
        case 'vacation':
          const vacBalance = calculateVacationBalance(currentUser);
          personalResponse = `**🏖️ יתרת ימי החופשה שלך:**\n\n`;
          personalResponse += `📅 **זכאות שנתית:** ${vacBalance.entitled} ימים\n`;
          personalResponse += `✅ **ניצלת עד כה:** ${vacBalance.used} ימים\n`;
          personalResponse += `🎯 **יתרה זמינה:** **${vacBalance.remaining} ימים**\n\n`;
          
          if (vacBalance.details.length > 0) {
            personalResponse += `**📋 חופשות שנלקחו השנה:**\n`;
            vacBalance.details.forEach(d => {
              personalResponse += `• ${d.startDate} עד ${d.endDate} (${d.days} ימים) - ${d.type}\n`;
            });
          } else {
            personalResponse += `💡 **עדיין לא נלקחו חופשות השנה!**\n`;
          }
          
          if (currentUser.employmentType === 'temporary' && currentUser.seniority < 6) {
            personalResponse += `\n⚠️ **שים לב:** כעובד זמני עם ותק מתחת ל-6 חודשים, ייתכן שאין לך זכאות מלאה לחופשה.`;
          }
          break;
          
        case 'sick':
          const sickBalance = calculateSickDaysBalance(currentUser);
          personalResponse = `**🏥 יתרת ימי המחלה שלך:**\n\n`;
          personalResponse += `📅 **זכאות שנתית:** ${sickBalance.annualEntitlement} ימים\n`;
          personalResponse += `💼 **יתרה מצטברת:** ${sickBalance.accumulated} ימים\n`;
          personalResponse += `📊 **סה"כ זכאות:** ${sickBalance.totalEntitled} ימים\n`;
          personalResponse += `✅ **ניצלת השנה:** ${sickBalance.used} ימים\n`;
          personalResponse += `🎯 **יתרה זמינה:** **${sickBalance.remaining} ימים**\n\n`;
          
          if (sickBalance.details.length > 0) {
            personalResponse += `**📋 ימי מחלה שנלקחו השנה:**\n`;
            sickBalance.details.forEach(d => {
              personalResponse += `• ${d.date} - ${d.type}\n`;
            });
          }
          
          if (sickBalance.remaining < 3) {
            personalResponse += `\n⚠️ **אזהרה:** נותרו לך מעט ימי מחלה. שקול לשמור על הזכאות לחירום.`;
          }
          break;
          
        case 'childSick':
          const childSickBalance = calculateChildSickDaysBalance(currentUser);
          personalResponse = `**👶 יתרת ימי מחלת ילד שלך:**\n\n`;
          personalResponse += `👨‍👩‍👧‍👦 **מספר ילדים זכאים:** ${childSickBalance.eligibleChildren}\n`;
          if (childSickBalance.eligibleChildren > 0) {
            personalResponse += `📅 **זכאות שנתית:** ${childSickBalance.entitled} ימים\n`;
            personalResponse += `✅ **ניצלת השנה:** ${childSickBalance.used} ימים\n`;
            personalResponse += `🎯 **יתרה זמינה:** **${childSickBalance.remaining} ימים**\n`;
            personalResponse += `🎂 **גילאי הילדים:** ${currentUser.familyData.childrenAges.join(', ')}\n`;
          } else {
            personalResponse += `\n💡 **אין לך ילדים רשומים במערכת או שהם מעל גיל 18.**`;
          }
          break;
          
        case 'overtime':
          const overtimeStatus = calculateOvertimeStatus(currentUser);
          personalResponse = `**⏰ מצב שעות נוספות שלך:**\n\n`;
          if (overtimeStatus.isExempt) {
            personalResponse += `👔 **דרגה ${currentUser.grade}:** פטור משעות נוספות\n`;
            personalResponse += `💰 **זכאות:** הפגה/תוספת ניהולית במקום שעות נוספות\n`;
          } else {
            personalResponse += `⏱️ **שעות נוספות החודש:** ${overtimeStatus.currentMonth} שעות\n`;
            personalResponse += `📊 **מכסה חודשית מותרת:** ${overtimeStatus.maxMonthly} שעות\n`;
            personalResponse += `🎯 **יתרה זמינה:** **${overtimeStatus.remaining} שעות**\n\n`;
            
            if (overtimeStatus.details.length > 0) {
              personalResponse += `**📋 שעות נוספות החודש:**\n`;
              overtimeStatus.details.forEach(d => {
                personalResponse += `• ${d.date}: ${d.hours} שעות (${d.rate}) - ${d.approved ? '✅ מאושר' : '⏳ ממתין לאישור'}\n`;
              });
            }
          }
          break;
          
        case 'gifts':
          const giftStatus = getChildrenGiftStatus(currentUser);
          personalResponse = `**🎁 מצב מתנות לילדים שלך:**\n\n`;
          personalResponse += `👨‍👩‍👧‍👦 **ילדים זכאים:** ${giftStatus.eligibleChildren}\n`;
          
          if (giftStatus.eligibleChildren > 0) {
            personalResponse += `🎂 **גילאי הילדים:** ${giftStatus.childrenAges.join(', ')}\n\n`;
            personalResponse += `**📅 סטטוס מתנות 2025:**\n`;
            Object.entries(giftStatus.status2025).forEach(([holiday, status]) => {
              const statusEmoji = status === 'נמסר' ? '✅' : status === 'ממתין' ? '⏳' : '❓';
              personalResponse += `• ${holiday}: ${statusEmoji} ${status}\n`;
            });
          } else {
            personalResponse += `\n💡 **אין לך ילדים זכאים למתנות (עד גיל 18).**`;
          }
          break;
          
        case 'family':
          const family = currentUser.familyData;
          personalResponse = `**👨‍👩‍👧‍👦 הטופס 101 - נתוני המשפחה שלך:**\n\n`;
          personalResponse += `💑 **סטטוס משפחתי:** ${family.maritalStatus}\n`;
          personalResponse += `👶 **מספר ילדים:** ${family.numberOfChildren}\n`;
          
          if (family.numberOfChildren > 0) {
            personalResponse += `🎂 **גילאי ילדים:** ${family.childrenAges.join(', ')}\n`;
            personalResponse += `🎁 **ילדים זכאים למתנות:** ${family.childrenAges.filter(age => age <= 18).length}\n`;
            personalResponse += `🏥 **ילדים זכאים למחלת ילד:** ${family.childrenAges.filter(age => age <= 16).length}\n`;
          }
          
          personalResponse += `📅 **עודכן לאחרונה:** ${family.lastUpdated}\n`;
          
          const nextUpdate = new Date('2025-01-31');
          const today = new Date();
          if (today > nextUpdate) {
            personalResponse += `\n⚠️ **דרוש עדכון:** הטופס צריך עדכון עד 31.1 בכל שנה!`;
          } else {
            personalResponse += `\n✅ **הטופס עדכני** - העדכון הבא נדרש עד 31.1.2025`;
          }
          break;
          
        case 'weeklyShifts':
          const weeklyShifts = getWeeklyShifts(currentUser);
          if (!weeklyShifts.isShiftWorker) {
            personalResponse = `**📋 משמרות השבוע שלך:**\n\n`;
            personalResponse += `💼 **סוג העבודה:** עבודה בשעות קבועות\n`;
            personalResponse += `⏰ **שעות עבודה:** ${currentUser.role.includes('מנהל') ? 'עבודה ניהולית ללא שעות קבועות' : 'ימים א\'-ה\' 08:00-17:00'}\n`;
            personalResponse += `📅 **מערכת:** אין מערכת משמרות - עבודה בשגרה קבועה\n\n`;
            personalResponse += `💡 **הערה:** עובדי משרד עובדים בשעות קבועות ולא במערכת משמרות.`;
          } else {
            personalResponse = `**📋 המשמרות שלך השבוע (${weeklyShifts.weekRange.start} עד ${weeklyShifts.weekRange.end}):**\n\n`;
            personalResponse += `🏢 **סוג משמרות:** ${weeklyShifts.shiftType}\n`;
            personalResponse += `⏰ **סה"כ שעות השבוע:** ${weeklyShifts.weekStats.totalHours} שעות\n`;
            personalResponse += `📅 **ימי עבודה:** ${weeklyShifts.weekStats.workDays} ימים\n`;
            personalResponse += `🏠 **ימי חופש:** ${weeklyShifts.weekStats.daysOff} ימים\n\n`;
            
            personalResponse += `**📅 פירוט משמרות השבוע:**\n`;
            weeklyShifts.weekShifts.forEach(shift => {
              const emoji = shift.hours > 0 ? '💼' : '🏠';
              const timeStr = shift.hours > 0 ? `${shift.startTime}-${shift.endTime}` : 'חופש';
              const statusEmoji = shift.status === 'הושלם' ? '✅' : shift.status === 'נוכחי' ? '🔄' : shift.status === 'מתוכנן' ? '📋' : '🏠';
              personalResponse += `• **${shift.day} ${shift.date}:** ${emoji} ${shift.shift} ${timeStr} ${statusEmoji}\n`;
            });
            
            if (weeklyShifts.weekStats.morningShifts > 0 || weeklyShifts.weekStats.eveningShifts > 0) {
              personalResponse += `\n**📊 פירוט סוגי משמרות השבוע:**\n`;
              if (weeklyShifts.weekStats.morningShifts > 0) {
                personalResponse += `🌅 **בוקר:** ${weeklyShifts.weekStats.morningShifts} משמרות\n`;
              }
              if (weeklyShifts.weekStats.eveningShifts > 0) {
                personalResponse += `🌆 **ערב:** ${weeklyShifts.weekStats.eveningShifts} משמרות\n`;
              }
              if (weeklyShifts.weekStats.nightShifts > 0) {
                personalResponse += `🌙 **לילה:** ${weeklyShifts.weekStats.nightShifts} משמרות\n`;
              }
            }
          }
          break;
          
        case 'monthlyShifts':
          const monthlyShifts = getMonthlyShifts(currentUser);
          if (!monthlyShifts.isShiftWorker) {
            personalResponse = `**📅 לוח העבודה החודשי שלך:**\n\n`;
            personalResponse += `💼 **סוג העבודה:** עבודה בשעות קבועות\n`;
            personalResponse += `⏰ **שעות חודשיות:** כ-${currentUser.workData.monthlyHours} שעות\n`;
            personalResponse += `📋 **מערכת:** עבודת משרד רגילה ללא משמרות\n\n`;
            personalResponse += `💡 **הערה:** עובדי משרד עובדים בשגרה קבועה ללא מערכת משמרות מתחלפות.`;
          } else {
            personalResponse = `**📅 המשמרות שלך ${monthlyShifts.monthName}:**\n\n`;
            personalResponse += `🏢 **סוג משמרות:** ${monthlyShifts.shiftType}\n`;
            personalResponse += `⏰ **סה"כ שעות החודש:** ${monthlyShifts.monthStats.totalHours} שעות\n`;
            personalResponse += `📅 **ימי עבודה:** ${monthlyShifts.monthStats.workDays} ימים\n`;
            personalResponse += `🏠 **ימי חופש:** ${monthlyShifts.monthStats.daysOff} ימים\n`;
            if (monthlyShifts.monthStats.holidays > 0) {
              personalResponse += `🎄 **חגים:** ${monthlyShifts.monthStats.holidays} ימים\n`;
            }
            if (monthlyShifts.monthStats.trainingDays > 0) {
              personalResponse += `🎓 **ימי הכשרה:** ${monthlyShifts.monthStats.trainingDays} ימים\n`;
            }
            
            personalResponse += `\n**📊 פירוט סוגי משמרות החודש:**\n`;
            if (monthlyShifts.monthStats.morningShifts > 0) {
              personalResponse += `🌅 **בוקר:** ${monthlyShifts.monthStats.morningShifts} משמרות\n`;
            }
            if (monthlyShifts.monthStats.eveningShifts > 0) {
              personalResponse += `🌆 **ערב:** ${monthlyShifts.monthStats.eveningShifts} משמרות\n`;
            }
            if (monthlyShifts.monthStats.nightShifts > 0) {
              personalResponse += `🌙 **לילה:** ${monthlyShifts.monthStats.nightShifts} משמרות\n`;
            }
            
            personalResponse += `\n💡 **לצפייה בפירוט יומי מלא ניתן לגשת למערכת זמנים ונוכחות.**`;
          }
          break;
          
        case 'todayShift':
          const todayShift = getTodaysShift(currentUser);
          if (!todayShift.isShiftWorker) {
            personalResponse = `**📋 המשמרת שלך היום:**\n\n`;
            personalResponse += `💼 **סוג העבודה:** עבודה בשעות קבועות\n`;
            personalResponse += `⏰ **שעות היום:** ${currentUser.role.includes('מנהל') ? 'עבודה ניהולית גמישה' : '08:00-17:00'}\n`;
            personalResponse += `📍 **מיקום:** ${currentUser.department}\n\n`;
            personalResponse += `💡 **הערה:** אין לך מערכת משמרות - עבודה בשעות משרד רגילות.`;
          } else if (!todayShift.hasShift) {
            personalResponse = `**📋 המשמרת שלך היום:**\n\n`;
            personalResponse += `❓ **סטטוס:** לא נמצאה משמרת מוגדרת להיום\n`;
            personalResponse += `📞 **המלצה:** פנה למנהל המשמרות לבירור\n\n`;
            personalResponse += `💡 **הערה:** יתכן שהיום אינו יום עבודה או שיש עדכון במערכת המשמרות.`;
          } else {
            const shift = todayShift.todaysShift;
            personalResponse = `**📋 המשמרת שלך היום (${todayShift.date}):**\n\n`;
            personalResponse += `🏢 **סוג משמרת:** ${shift.shift}\n`;
            
            if (shift.hours > 0) {
              personalResponse += `⏰ **שעות עבודה:** ${shift.startTime} - ${shift.endTime}\n`;
              personalResponse += `⌚ **סה"כ שעות:** ${shift.hours} שעות\n`;
              personalResponse += `📍 **מיקום:** ${currentUser.department}\n`;
              
              const statusEmoji = shift.status === 'הושלם' ? '✅' : shift.status === 'נוכחי' ? '🔄' : '📋';
              personalResponse += `📊 **סטטוס:** ${statusEmoji} ${shift.status}\n`;
              
              if (shift.status === 'נוכחי') {
                personalResponse += `\n🔔 **אתה כרגע במשמרת!**`;
              } else if (shift.status === 'מתוכנן') {
                personalResponse += `\n⏰ **המשמרת מתחילה בעוד מעט - הכן לעבודה!**`;
              }
            } else {
              personalResponse += `🏠 **סטטוס:** ${shift.status}\n`;
              personalResponse += `⏰ **היום:** יום חופש מעבודה\n`;
              
              if (shift.status === 'חג') {
                personalResponse += `🎄 **סיבה:** יום חג\n`;
              } else if (shift.status === 'חופש שבועי') {
                personalResponse += `🏠 **סיבה:** חופש שבועי קבוע\n`;
              }
            }
          }
          break;
          
        case 'mortgage':
          const mortgageStatus = getMortgageStatus(currentUser);
          personalResponse = `**🏠 נתוני המשכנתא האישיים שלך:**\\n\\n`;
          
          personalResponse += `📊 **סטטוס זכאות:** ${mortgageStatus.eligibility}\\n`;
          personalResponse += `🏦 **מצב נוכחי:** ${mortgageStatus.currentStatus}\\n\\n`;
          
          if (mortgageStatus.currentMortgage) {
            personalResponse += `💰 **המשכנתא הפעילה שלך:**\\n`;
            personalResponse += `• סכום הלוואה: ${mortgageStatus.currentMortgage.loanAmount}\\n`;
            personalResponse += `• תשלום חודשי: ${mortgageStatus.currentMortgage.monthlyPayment}\\n`;
            personalResponse += `• ריבית: ${mortgageStatus.currentMortgage.interestRate}\\n`;
            personalResponse += `• תחילת הלוואה: ${mortgageStatus.currentMortgage.startDate}\\n`;
            personalResponse += `• שנים נותרות: ${mortgageStatus.currentMortgage.yearsRemaining}\\n\\n`;
          }
          
          personalResponse += `🎯 **זכאות מקסימלית:** ${mortgageStatus.maxLoanAmount}\\n`;
          personalResponse += `💳 **הנחת ריבית:** ${mortgageStatus.interestRateDiscount}\\n\\n`;
          
          if (mortgageStatus.specialConditions && mortgageStatus.specialConditions.length > 0) {
            personalResponse += `✨ **התנאים המיוחדים שלך:**\\n`;
            mortgageStatus.specialConditions.forEach(condition => {
              personalResponse += `• ${condition}\\n`;
            });
            personalResponse += `\\n`;
          }
          
          if (mortgageStatus.additionalLoans) {
            personalResponse += `🏗️ **הלוואות נוספות זמינות:**\\n`;
            if (mortgageStatus.additionalLoans.renovationLoan) {
              personalResponse += `• שיפוצים: ${mortgageStatus.additionalLoans.renovationLoan}\\n`;
            }
            if (mortgageStatus.additionalLoans.equityLoan) {
              personalResponse += `• הון עצמי: ${mortgageStatus.additionalLoans.equityLoan}\\n`;
            }
            if (mortgageStatus.additionalLoans.techLoan) {
              personalResponse += `• ציוד טכנולוגי: ${mortgageStatus.additionalLoans.techLoan}\\n`;
            }
            if (mortgageStatus.additionalLoans.investmentLoan) {
              personalResponse += `• השקעות: ${mortgageStatus.additionalLoans.investmentLoan}\\n`;
            }
            personalResponse += `\\n`;
          }
          
          personalResponse += `📋 **תהליך הגשת בקשה:** ${mortgageStatus.applicationProcess}\\n\\n`;
          personalResponse += `💡 **טיפ:** לקבלת ייעוץ מקצועי והצעת מחיר מותאמת אישית, צור קשר עם מחלקת המשכנתאות.`;
          
          sources = ["נתוני עובד אישיים", "מחלקת משכנתאות", "נוהל HR-MORTGAGE-510.20"];
          break;
          
        case 'digitalWallet':
          const walletData = currentUser.digitalWalletData || {
            currentBalance: "0 ₪",
            monthlyAllocation: "0 ₪",
            usedThisMonth: "0 ₪",
            remainingThisMonth: "0 ₪",
            categories: {},
            restrictions: ["נתונים לא זמינים"]
          };
          
          personalResponse = `**💳 יתרת הארנק הדיגיטלי שלך:**\n\n`;
          personalResponse += `💰 **יתרה נוכחית:** ${walletData.currentBalance}\n`;
          personalResponse += `📊 **הקצבה חודשית:** ${walletData.monthlyAllocation}\n`;
          personalResponse += `✅ **נוצל החודש:** ${walletData.usedThisMonth}\n`;
          personalResponse += `🎯 **נותר החודש:** **${walletData.remainingThisMonth}**\n\n`;
          
          if (walletData.lastTransaction) {
            personalResponse += `**💸 העסקה האחרונה:**\n`;
            personalResponse += `• ${walletData.lastTransaction.date}: ${walletData.lastTransaction.amount} - ${walletData.lastTransaction.description}\n\n`;
          }
          
          if (walletData.categories && Object.keys(walletData.categories).length > 0) {
            personalResponse += `**📈 פירוט לפי קטגוריות:**\n`;
            Object.entries(walletData.categories).forEach(([category, data]) => {
              const categoryName = category === 'meals' ? 'ארוחות' : 
                                   category === 'transport' ? 'תחבורה' : 
                                   category === 'wellness' ? 'בריאות ורווחה' : category;
              personalResponse += `• **${categoryName}:** ${data.used} / ${data.budget} (נותר: ${data.remaining})\n`;
            });
            personalResponse += `\n`;
          }
          
          if (walletData.restrictions && walletData.restrictions.length > 0) {
            personalResponse += `**ℹ️ הגבלות ותנאים:**\n`;
            walletData.restrictions.forEach(restriction => {
              personalResponse += `• ${restriction}\n`;
            });
          }
          
          personalResponse += `\n💡 **טיפ:** ניתן לטעון את הארנק או לבדוק היסטוריית עסקאות באפליקציית העובדים.`;
          sources = ["מאגר נתוני עובדים", "מערכת ארנק דיגיטלי"];
          break;
          
        case 'workFromHome':
          const wfhData = currentUser.workFromHomeData || {
            eligibility: "לא זמין",
            currentStatus: "נתונים לא זמינים",
            maxDaysPerWeek: 0,
            reason: "נתונים לא זמינים במערכת",
            requirements: [],
            currentApproval: "לא זמין"
          };
          
          personalResponse = `**🏠 מצב העבודה מהבית שלך:**\n\n`;
          personalResponse += `✅ **סטטוס זכאות:** ${wfhData.eligibility}\n`;
          personalResponse += `📋 **מצב נוכחי:** ${wfhData.currentStatus}\n`;
          personalResponse += `📅 **מקסימום ימים בשבוע:** ${wfhData.maxDaysPerWeek}\n\n`;
          
          if (wfhData.approvedDays && wfhData.approvedDays.length > 0) {
            personalResponse += `**📆 ימים מאושרים:** ${wfhData.approvedDays.join(', ')}\n\n`;
          }
          
          personalResponse += `**💼 נימוק:** ${wfhData.reason}\n\n`;
          
          if (wfhData.requirements && wfhData.requirements.length > 0) {
            personalResponse += `**📋 דרישות/סטטוס:**\n`;
            wfhData.requirements.forEach(req => {
              personalResponse += `• ${req}\n`;
            });
            personalResponse += `\n`;
          }
          
          personalResponse += `**🔖 סטטוס אישור:** ${wfhData.currentApproval}\n`;
          
          if (wfhData.equipmentProvided) {
            personalResponse += `**💻 ציוד מסופק:** ${wfhData.equipmentProvided}\n`;
          }
          
          if (wfhData.workingHours) {
            personalResponse += `**⏰ תנאי שעות עבודה:** ${wfhData.workingHours}\n`;
          }
          
          if (wfhData.monthlyUsage) {
            personalResponse += `\n**📊 ניצול חודשי (אוקטובר):**\n`;
            const usage = wfhData.monthlyUsage.october;
            personalResponse += `• מתוכנן: ${usage.planned} ימים\n`;
            personalResponse += `• נוצל: ${usage.used} ימים\n`;
            personalResponse += `• נותר: ${usage.remaining} ימים\n`;
          }
          
          personalResponse += `\n💡 **הערה:** לשינוי סטטוס או הגדרות עבודה מהבית, פנה למנהל הישיר או למחלקת משאבי אנוש.`;
          sources = ["מאגר נתוני עובדים", "מערכת עבודה מרחוק", "נוהל IT-SEC-401.25"];
          break;
      }
      
      response = {
        text: personalResponse,
        sources: sources,
        lastUpdated: new Date().toISOString().split('T')[0],
        confidence: 1.0,
        personalized: true,
        personalData: true,
        userType: currentUser.employmentType,
        userSeniority: `${Math.floor(currentUser.seniority / 12)} שנים, ${currentUser.seniority % 12} חודשים`
      };
      
    } else if (matchedKnowledge) {
      // Check access permissions
      const hasAccess = currentUser.permissions.includes(matchedKnowledge.accessLevel);
      
      if (hasAccess) {
        // Customize answer based on user's employment status
        const customizedAnswer = customizeAnswerForUser(
          matchedKnowledge.answer, 
          currentUser, 
          matchedKnowledge.id
        );
        
        response = {
          text: customizedAnswer,
          sources: matchedKnowledge.sources,
          lastUpdated: matchedKnowledge.lastUpdated,
          confidence: 0.95,
          personalized: true,
          userType: currentUser.employmentType,
          userSeniority: `${Math.floor(currentUser.seniority / 12)} שנים, ${currentUser.seniority % 12} חודשים`
        };
      } else {
        response = {
          text: "מצטער, אין לך הרשאה לגשת למידע זה. אנא פנה למנהל הישיר שלך או למוקד IT לקבלת הרשאות נוספות.",
          sources: [],
          lastUpdated: new Date().toISOString().split('T')[0],
          confidence: 1.0
        };
      }
    } else {
      response = {
        text: "מצטער, לא מצאתי מידע רלוונטי לשאלתך במאגרי הידע המאושרים. מומלץ לפנות לגורם המקצועי הרלוונטי או לבדוק במערכות הפנימיות העדכניות.",
        sources: [],
        lastUpdated: new Date().toISOString().split('T')[0],
        confidence: 0.0
      };
    }
    
    return c.json(response)
  } catch (error) {
    return c.json({ error: 'שגיאה בעיבוד הבקשה' }, 500)
  }
})

// Helper function for text similarity (simple word overlap)
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(' ').filter(w => w.length > 2);
  const words2 = text2.split(' ').filter(w => w.length > 2);
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// Function to customize answers based on employment status
function customizeAnswerForUser(answer: string, user: any, questionId: number): string {
  let customizedAnswer = answer;
  
  // Customize vacation/leave answers based on employment type
  if (questionId === 6) { // חופשה שנתית
    const vacationRights = getVacationRights(user);
    customizedAnswer = `${answer}\n\n**🎯 זכויותיך האישיות:**\n${vacationRights}`;
  } else if (questionId === 7) { // דיווח מחלה
    const sickLeaveRights = getSickLeaveRights(user);
    customizedAnswer = `${answer}\n\n**🎯 זכויותיך האישיות:**\n${sickLeaveRights}`;
  } else if (questionId === 8) { // שעות נוספות
    const overtimeRights = getOvertimeRights(user);
    customizedAnswer = `${answer}\n\n**🎯 זכויותיך האישיות:**\n${overtimeRights}`;
  } else if (questionId === 5) { // שעות עבודה
    const workHours = getPersonalWorkHours(user);
    customizedAnswer = `${answer}\n\n**🎯 משמרותיך:**\n${workHours}`;
  }
  
  return customizedAnswer;
}

// Get vacation rights based on employment type and seniority
function getVacationRights(user: any): string {
  const seniorityYears = Math.floor(user.seniority / 12);
  
  switch (user.employmentType) {
    case 'permanent':
      if (seniorityYears < 1) return "**עובד קבוע חדש:** 12 ימי חופשה בשנה הראשונה, 18 ימים מהשנה השנייה.";
      else if (seniorityYears < 5) return "**עובד קבוע (1-5 שנים):** 18 ימי חופשה בשנה + יום יומולדת.";
      else if (seniorityYears < 10) return "**עובד קבוע ותיק (5-10 שנים):** 21 ימי חופשה בשנה + יום יומולדת + יום מתנה.";
      else return "**עובד קבוע בכיר (10+ שנים):** 24 ימי חופשה בשנה + יום יומולדת + יום מתנה + חופשה נוספת.";
      
    case 'temporary':
      const monthsWorked = user.seniority;
      if (monthsWorked < 6) return "**עובד זמני:** אין זכאות לחופשה שנתית בחודשים הראשונים. זכאי לחופש ללא תשלום בתיאום.";
      else if (monthsWorked < 12) return "**עובד זמני (6+ חודשים):** זכאי ל-1 יום חופשה לכל חודש עבודה (מקסימום 6 ימים).";
      else return "**עובד זמני (שנה+):** זכאי ל-12 ימי חופשה בשנה (פרו-רטה לפי תקופת ההעסקה).";
      
    case 'hourly':
      return "**עובד שעתי:** זכאי לחופש ללא תשלום בהתראה של 14 יום. אין זכאות לחופשה בתשלום.";
      
    default:
      return "פנה למשאבי אנוש לבירור זכויותיך המדויקות.";
  }
}

// Get sick leave rights based on employment type
function getSickLeaveRights(user: any): string {
  switch (user.employmentType) {
    case 'permanent':
      return "**עובד קבוע:** 18 ימי מחלה בשנה (מצטברים עד 90 יום) + 8 ימי מחלת ילד. תשלום 100% מהשכר.";
    case 'temporary':
      const monthsWorked = user.seniority;
      if (monthsWorked < 6) return "**עובד זמני:** 6 ימי מחלה בשנה בלבד. תשלום 75% מהשכר היומי.";
      else return "**עובד זמני (6+ חודשים):** 12 ימי מחלה בשנה + 4 ימי מחלת ילד. תשלום 85% מהשכר.";
    case 'hourly':
      return "**עובד שעתי:** אין זכאות לימי מחלה בתשלום. זכאי לאישור רופא לביטוח לאומי בלבד.";
    default:
      return "פנה למשאבי אנוש לבירור זכויותיך המדויקות.";
  }
}

// Get overtime rights based on grade and employment type
function getOvertimeRights(user: any): string {
  if (user.employmentType === 'hourly') {
    return "**עובד שעתי:** שעות נוספות מעבר ל-8 שעות יומיות בתוספת 25%. מעבר ל-10 שעות יומיות בתוספת 50%.";
  }
  
  if (user.grade >= 7) {
    return `**דרגה ${user.grade}:** פטור משעות נוספות. זכאי להפגה או פיצוי בהתאם לנהלי החברה.`;
  } else {
    const rate = user.employmentType === 'permanent' ? '125%-150%' : '110%-125%';
    const maxHours = user.employmentType === 'permanent' ? '20 שעות' : '10 שעות';
    return `**דרגה ${user.grade}:** תשלום ${rate} לפי יום השבוע. מגבלה חודשית: ${maxHours}.`;
  }
}

// Get personal work hours based on role and employment type
function getPersonalWorkHours(user: any): string {
  if (user.role.includes('מוקד')) {
    const shifts = user.employmentType === 'permanent' ? 
      "משמרות קבועות: 07:00-15:00 או 13:00-21:00 (לפי בחירה)" :
      "משמרות משתנות: 07:00-15:00, 13:00-21:00, 15:00-23:00 (לפי צורך)";
    return shifts;
  } else if (user.role.includes('סניף')) {
    return user.employmentType === 'permanent' ? 
      "שעות סניף קבועות + משמרות ערב לפי תורנות" :
      "שעות סניף בלבד, ללא משמרות ערב";
  } else {
    return user.employmentType === 'permanent' ?
      "שעות מטה: 08:00-17:00 עם גמישות מלאה" :
      "שעות קבועות: 08:30-16:30 ללא גמישות";
  }
}

// User switching endpoint
app.get('/switch/:userType', (c) => {
  const userType = c.req.param('userType');
  return c.redirect(`/?user=${userType}`);
})

// User selection page  
app.get('/users', (c) => {
  return c.render(
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--boi-navy), var(--boi-blue));">
      <div class="card" style="max-width: 500px; width: 100%; margin: 2rem;">
        <div class="card-header" style="text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">
            <i class="fas fa-piggy-bank" style="color: var(--discount-accent);"></i>
          </div>
          <h1 style="margin: 0; font-size: 1.75rem; color: white; font-weight: 700;">בנק דיסקונט</h1>
          <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9); font-weight: 500;">מערכת זיהוי פנים-ארגוני • "בדיסקונט משקיעים בך!"</p>
        </div>
        <div class="card-body" style="text-align: center;">
          <h2 style="color: var(--boi-navy); margin-bottom: 1.5rem;">בחר את פרופיל המשתמש</h2>
          <p style="color: var(--boi-gray-600); margin-bottom: 2rem;">
            לצורכי הדמו, בחר את סוג המשתמש שברצונך לדמות:
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-headset"></i> עובדי מוקד טלפוני
            </h3>
            
            <a href="/?user=call_center_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-user-clock"></i>
              אור ישראלי - נציג מוקד זמני
              <small style="display: block; opacity: 0.8; font-weight: normal;">זמני • 3 חודשים • הרשאות מוגבלות</small>
            </a>
            
            <a href="/?user=call_center" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-headset"></i>
              רחל כהן - נציגת מוקד
              <small style="display: block; opacity: 0.8; font-weight: normal;">שעתי • 8 חודשים • הרשאות בסיסיות</small>
            </a>
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-building"></i> עובדי סניפים
            </h3>
            
            <a href="/?user=branch_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-user-clock"></i>
              נועה כהן - פקידת סניף זמנית
              <small style="display: block; opacity: 0.8; font-weight: normal;">זמני • 6 חודשים • הרשאות בסיסיות</small>
            </a>
            
            <a href="/?user=branch" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-building"></i>
              דוד לוי - מנהל סניף
              <small style="display: block; opacity: 0.8; font-weight: normal;">קבוע • 7 שנים • הרשאות ניהול מלאות</small>
            </a>
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-laptop-code"></i> צוות טכנולוגיות
            </h3>
            
            <a href="/?user=tech" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-code"></i>
              שרה גולדמן - מפתחת תוכנה
              <small style="display: block; opacity: 0.8; font-weight: normal;">קבוע • 4 שנים • הרשאות טכניות מלאות</small>
            </a>
          </div>
          
          <div style="margin-top: 2rem; padding: 1rem; background: var(--boi-light-blue); border-radius: 0.5rem;">
            <h4 style="color: var(--boi-navy); margin: 0 0 0.5rem 0;">💡 טיפ לדמו:</h4>
            <p style="margin: 0; font-size: 0.875rem; color: var(--boi-gray-700);">
              כל סוג משתמש רואה תשובות מותאמות לתפקידו ולהרשאות הגישה שלו.
              נסה לשאול את אותה השאלה ממשתמשים שונים!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

// SSO Simulation page
app.get('/login', (c) => {
  return c.render(
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--boi-navy), var(--boi-blue));">
      <div class="card" style="max-width: 500px; width: 100%; margin: 2rem;">
        <div class="card-header" style="text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">
            <i class="fas fa-piggy-bank" style="color: var(--discount-accent);"></i>
          </div>
          <h1 style="margin: 0; font-size: 1.75rem; color: white; font-weight: 700;">בנק דיסקונט</h1>
          <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9); font-weight: 500;">מערכת זיהוי פנים-ארגוני • "בדיסקונט משקיעים בך!"</p>
        </div>
        <div class="card-body" style="text-align: center;">
          <h2 style="color: var(--boi-navy); margin-bottom: 1.5rem;">בחר את פרופיל המשתמש</h2>
          <p style="color: var(--boi-gray-600); margin-bottom: 2rem;">
            לצורכי הדמו, בחר את סוג המשתמש שברצונך לדמות:
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-headset"></i> עובדי מוקד טלפוני
            </h3>
            
            <a href="/?user=call_center_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-user-clock"></i>
              אור ישראלי - נציג מוקד זמני
              <small style="display: block; opacity: 0.8; font-weight: normal;">זמני • 3 חודשים • זכויות מוגבלות</small>
            </a>
            
            <a href="/?user=call_center" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-headset"></i>
              רחל כהן - נציגת מוקד שעתית
              <small style="display: block; opacity: 0.8; font-weight: normal;">שעתי • 8 חודשים • ללא חופשה בתשלום</small>
            </a>
            
            <a href="/?user=call_center_permanent" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-user-tie"></i>
              מיכל אברהם - נציגת מוקד בכירה
              <small style="display: block; opacity: 0.8; font-weight: normal;">קבוע • 3 שנים • זכויות מלאות</small>
            </a>
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-building"></i> עובדי סניפים
            </h3>
            
            <a href="/?user=branch_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-user-clock"></i>
              נועה כהן - פקידת סניף זמנית
              <small style="display: block; opacity: 0.8; font-weight: normal;">זמני • 6 חודשים • הרשאות בסיסיות</small>
            </a>
            
            <a href="/?user=branch" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-building"></i>
              דוד לוי - מנהל סניף
              <small style="display: block; opacity: 0.8; font-weight: normal;">קבוע • 7 שנים • הרשאות ניהול מלאות</small>
            </a>
            
            <h3 style="color: var(--boi-navy); margin: 1.5rem 0 0.75rem 0; border-bottom: 2px solid var(--boi-gold); padding-bottom: 0.5rem;">
              <i class="fas fa-laptop-code"></i> צוות טכנולוגיות
            </h3>
            
            <a href="/?user=tech" class="btn btn-primary" style="text-decoration: none; padding: 1rem;">
              <i class="fas fa-code"></i>
              שרה גולדמן - מפתחת תוכנה
              <small style="display: block; opacity: 0.8; font-weight: normal;">קבוע • 4 שנים • הרשאות טכניות מלאות</small>
            </a>
          </div>
          
          <div style="margin-top: 2rem; padding: 1rem; background: var(--boi-light-blue); border-radius: 0.5rem;">
            <h4 style="color: var(--boi-navy); margin: 0 0 0.5rem 0;">💡 טיפ לדמו:</h4>
            <p style="margin: 0; font-size: 0.875rem; color: var(--boi-gray-700);">
              כל סוג משתמש רואה תשובות מותאמות לתפקידו ולהרשאות הגישה שלו.
              נסה לשאול את אותה השאלה ממשתמשים שונים!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default app
