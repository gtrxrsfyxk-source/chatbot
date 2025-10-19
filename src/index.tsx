import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))
app.use(renderer)

// Enhanced knowledge base with comprehensive vacation policy
const vacationPolicy = {
  general: {
    purpose: "נוהל זכאות, ניצול ותכנון ימי החופשה השנתיים עבור כל עובדי בנק דיסקונט",
    policyNumber: "HR-205",
    lastUpdated: "2024-10-11",
    version: "3.2"
  },
  
  entitlementsByType: {
    permanent: {
      "0-1": { days: 12, notes: "יחסי לתקופת העבודה" },
      "1-5": { days: 18, notes: "זכאות מלאה" },
      "5-10": { days: 21, notes: "תוספת ותק" },
      "10-15": { days: 24, notes: "תוספת ותק מתקדמת" },
      "15+": { days: 27, notes: "זכאות מקסימלית" }
    },
    temporary: {
      "0-6months": { days: 0, notes: "פטור מחופשה" },
      "6-12months": { days: 1.5, notes: "יום וחצי לכל חודש עבודה" },
      "12+months": { days: 15, notes: "זכאות מוקטנת" }
    },
    callCenter: {
      "0-6months": { days: 1, notes: "יום לחודש - הדרגתי" },
      "6-12months": { days: 15, notes: "זכאות בסיסית" },
      "12+months": { days: 18, notes: "זכאות מלאה" }
    },
    branch: {
      clerk: "כעובדים קבועים",
      manager: { days: 25, notes: "תוספת ניהול" },
      areaManager: { days: 28, notes: "דרגה עליונה" }
    },
    tech: {
      "0-2": { days: 20, notes: "מפתחים ואנליסטים" },
      "2-5": { days: 22, notes: "תוספת ותק" },
      "5+": { days: 25, notes: "ותק מתקדם" }
    }
  },
  
  requestProcess: {
    submissionTime: {
      singleDay: "48 שעות מראש",
      shortVacation: "שבוע מראש (2-5 ימים)",
      mediumVacation: "שבועיים מראש (6-13 ימים)",
      longVacation: "חודש מראש (14+ ימים)"
    },
    approvalRequired: {
      basic: "מנהל ישיר",
      extended: "מנהל ישיר + HR",
      long: "מנהל ישיר + HR + מנהל אגף"
    }
  },
  
  restrictions: {
    december: "מוגבל ל-20% מהעובדים",
    teamLimit: "מקסימום 25% מהצוות בו-זמנית",
    mandatoryVacation: {
      financial: "14 ימים רצופים (גישה למערכות כספיות)",
      managers: "10 ימים רצופים (מנהלי סניפים)",
      general: "7 ימים רצופים (מומלץ)"
    }
  },
  
  contact: {
    hr: "03-514-5555",
    email: "hr@discountbank.co.il",
    portal: "portal.discountbank.co.il",
    support: "1-599-500-500"
  }
}

// Digital Wallet Policy for Union Members
const digitalWalletPolicy = {
  general: {
    purpose: "נוהל זכאות, הקצאה ושימוש בהטבות כספיות לחברי ועד עובדים באמצעות ארנק דיגיטלי",
    policyNumber: "HR-420",
    lastUpdated: "2024-10-16", 
    version: "2.1"
  },
  
  basicEntitlements: {
    monthlyAllowance: 150, // ₪150 per month
    currency: "₪",
    eligibility: "חברי ועד עובדים פעילים",
    format: "הטבות דיגיטליות (לא מזומן)"
  },
  
  membershipCategories: {
    regular: {
      amount: 150,
      title: "חבר ועד רגיל", 
      notes: "זכאות בסיסית חודשית"
    },
    management: {
      amount: 200,
      title: "חבר הנהלת הוועד",
      notes: "תוספת לתפקידי ניהול"
    },
    chairman: {
      amount: 300,
      title: "יו״ר הוועד",
      notes: "הטבות מוגדלות"
    },
    subCommittee: {
      amount: 100,
      title: "חבר וועדת משנה",
      notes: "הטבות חלקיות"
    }
  },
  
  eligibilityRequirements: {
    basic: [
      "חברות פעילה בוועד העובדים",
      "מעמד עובד קבוע בבנק",
      "תשלום דמי ועד שוטף"
    ],
    restrictions: [
      "חופשה ללא תשלום - זכאות מושעית",
      "עזיבה/פיטורים - ביטול מיידי",
      "חובות לבנק - עלול להשפיע על זכאות"
    ]
  },
  
  approvedUses: [
    "חופשות ונופש - מלונות, טיסות, חבילות",
    "תרבות ובידור - מופעים, הצגות, קונצרטים",
    "רכישות צרכניות - חשמל, אופנה, ספורט", 
    "מסעדות וקייטרינג - ארוחות ואירועים",
    "השתלמויות ולימודים - קורסים מאושרים"
  ],
  
  prohibitedUses: [
    "המרה למזומן או העברה לאחרים",
    "רכישות לא חוקיות או לא מוסריות", 
    "הימורים או השקעות סיכון"
  ],
  
  managementRules: {
    activation: "רישום במערכת HR + אישור מזכירות הוועד",
    timeFrame: "הפעלה תוך 30 יום מאישור",
    accumulation: "צבירה עד שנתיים",
    autoReset: "איפוס אוטומטי בתום התקופה"
  },
  
  terminationRules: {
    endOfTerm: "סיום זכאות בתום חודש סיום הכהונה",
    leaving: "ביטול מיידי + איפוס יתרה",
    unpaidLeave: "השעיה עד חידוש תשלום דמי ועד",
    violations: "ביטול זכאות לתקופה מוגדרת"
  },
  
  contact: {
    hr: "03-514-5555",
    hrEmail: "hr@discountbank.co.il", 
    unionSecretary: "03-514-6666",
    unionEmail: "workers-committee@discountbank.co.il",
    digitalWalletPortal: "portal.discountbank.co.il/digital-wallet",
    techSupport: "1-599-500-600"
  }
}

const knowledgeBase = [
  {
    id: 1,
    topic: "vacation",
    question: "יתרת ימי חופשה",
    answer: `**📋 נוהל החופשות - HR-205 (מעודכן עפ"י נוהל רשמי)**\n\n` +
            `**🎯 זכאות שנתית לפי ותק - בהתאם לחוק החופשה השנתית:**\n` +
            `• **עובדים קבועים:** 12-25 ימים (לפי ותק)\n` +
            `  - 0-1 שנים: 12 ימים (מינימום חוקי)\n` +
            `  - 1-5 שנים: 14 ימים (לפי נוהל מעודכן)\n` +
            `  - 5-10 שנים: 18 ימים\n` +
            `  - 10-15 שנים: 21 ימים\n` +
            `  - 15+ שנים: 25 ימים\n\n` +
            `• **עובדי מוקד:** 12-18 ימים (לפי ותק)\n` +
            `• **עובדים זמניים:** 1.5 ימים לחודש (מעל 6 חודשי עבודה)\n` +
            `• **עובדי טכנולוגיות:** 14-25 ימים (לפי ותק)\n` +
            `• **מנהלי סניפים:** 18-25 ימים (לפי ותק)\n\n` +
            `**📅 צבירה וניצול:**\n` +
            `• צבירה על בסיס חודשי - ניתן לנצל יחסית\n` +
            `• העברת ימים לשנה הבאה אפשרית (עד 3 שנים)\n` +
            `• חופשה רציפה מומלצת לאיזון עבודה-חיים\n\n` +
            `**⚖️ בהתאם לחוק:**\n` +
            `• זכויות מוגנות לפי חוק החופשה השנתית בישראל\n` +
            `• מדיניות פנימית משלימה לחוק הבסיס\n\n` +
            `📞 **פרטים:** HR 03-514-5555 | hr@discountbank.co.il\n` +
            `💡 **לבדיקה אישית:** שאל "כמה ימי חופשה נשארו לי?"`,
    sources: ["נוהל חופשות HR-205"],
    policyRef: vacationPolicy
  },
  {
    id: 2,
    topic: "gifts",
    question: "מתנות לילדים",
    answer: "זכאות מתנות לילדים (עד גיל 18): ראש השנה, חנוכה ופורים. המתנות נמסרות אוטומטית לפי נתוני טופס 101. ניתן לבדוק סטטוס אישי.",
    sources: ["נוהל מתנות HR-310", "טופס 101"]
  },
  {
    id: 3,
    topic: "shifts",
    question: "משמרות",
    answer: "שיבוץ משמרות נעשה שבועית. מוקד טלפוני: 3 סוגי משמרות, סניפים: שעות קבועות, טכנולוגיה: גמישות בשעות. ניתן לראות לוח אישי.",
    sources: ["מערכת שיבוץ", "נוהל משמרות OP-150"]
  },
  {
    id: 4,
    topic: "digitalWallet",
    question: "ארנק דיגיטלי",
    answer: `**💳 נוהל הארנק הדיגיטלי - HR-420**\n\n` +
            `**🎯 זכאות חודשית לחברי ועד עובדים:**\n` +
            `• **חבר ועד רגיל:** ₪150 לחודש\n` +
            `• **חבר הנהלת הוועד:** ₪200 לחודש\n` +
            `• **יו״ר הוועד:** ₪300 לחודש\n` +
            `• **חבר וועדת משנה:** ₪100 לחודש\n\n` +
            `**✅ תנאי זכאות:**\n` +
            `• חברות פעילה בוועד העובדים\n` +
            `• מעמד עובד קבוע בבנק\n` +
            `• תשלום דמי ועד שוטף ומעודכן\n\n` +
            `**🛍️ שימושים מאושרים:**\n` +
            `• חופשות ונופש (מלונות, טיסות)\n` +
            `• תרבות ובידור (מופעים, הצגות)\n` +
            `• רכישות צרכניות (חשמל, אופנה)\n` +
            `• מסעדות וקייטרינג\n` +
            `• השתלמויות ולימודים מאושרים\n\n` +
            `**📋 כללי ניהול:**\n` +
            `• צבירה עד שנתיים מותרת\n` +
            `• איפוס אוטומטי בתום התקופה\n` +
            `• אסור: המרה למזומן או העברות\n\n` +
            `📞 **פרטים:** HR 03-514-5555 | מזכירות ועד 03-514-6666\n` +
            `💡 **לבדיקה אישית:** שאל "מה יתרת הארנק הדיגיטלי שלי?"`,
    sources: ["נוהל ארנק דיגיטלי HR-420", "מזכירות ועד עובדים"],
    policyRef: digitalWalletPolicy
  },
  {
    id: 5,
    topic: "sickLeave",
    question: "ימי מחלה",
    answer: `**🏥 נוהל ימי מחלה - HR-310**\n\n` +
            `**📊 צבירת ימי מחלה:**\n` +
            `• **צבירה חודשית:** 1.5 ימים לכל חודש עבודה מלא\n` +
            `• **צבירה שנתית:** עד 18 ימי מחלה בשנה\n` +
            `• **צבירה מקסימלית:** עד 90 ימים (בדרך כלל)\n\n` +
            `**💰 זכאות לתשלום:**\n` +
            `• **יום ראשון:** אין זכאות לתשלום (0%)\n` +
            `• **יום שני ושלישי:** זכאות ל-50% מהשכר\n` +
            `• **יום רביעי ואילך:** זכאות ל-100% מהשכר\n\n` +
            `**🏥 תנאים מיוחדים:**\n` +
            `• **חולי סרטן או דיאליזה:** תשלום מלא מהיום הראשון\n` +
            `• **הסכמים מיוחדים:** תנאים טובים יותר אפשריים\n\n` +
            `**📋 חובות העובד:**\n` +
            `• הודעה למעסיק בהקדם האפשרי\n` +
            `• אישור רפואי מהיום הרביעי\n` +
            `• אישור דיגיטלי זמין דרך קופת החולים (עד 7 ימים)\n\n` +
            `**👨‍👩‍👧‍👦 זכויות מיוחדות:**\n` +
            `• טיפול בבן משפחה חולה (בתנאים מסוימים)\n` +
            `• החלפת ימי חופשה במקרה של מחלה בחופשה\n` +
            `• ימי הצהרה (במקומות עבודה מסוימים)\n\n` +
            `**⚖️ בהתאם לחוק:** חוק דמי מחלה תשל"ו-1976\n\n` +
            `📞 **פרטים:** HR 03-514-5555 | portal.discountbank.co.il/sick-leave\n` +
            `💡 **לבדיקה אישית:** שאל "כמה ימי מחלה נשארו לי?"`,
    sources: ["נוהל ימי מחלה HR-310", "חוק דמי מחלה 1976"]
  }
]

// Enhanced user profiles with personal data
const userProfiles = {
  call_center: {
    name: "רחל כהן",
    role: "נציגת מוקד טלפוני",
    accessLevel: "basic",
    avatar: "ר.כ",
    
    // יתרת ימי חופשה - מעודכן לפי נוהל חדש
    vacation: {
      annualEntitlement: 14, // עפ"י נוהל חדש: 1-5 שנות ותק = 14 ימים
      used: 4,              // ניצלה עד כה (מעודכן)
      remaining: 10,        // נותר (10 ימים זמינים)
      details: [
        { date: "2024-03-15", days: 2, type: "חופשה אישית" },
        { date: "2024-08-12", days: 2, type: "חופשה קצרה" }
      ],
      accruedMonthly: true, // צבירה חודשית עפ"י נוהל חדש
      carryOverAllowed: true // אפשרות העברה לשנה הבאה
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      numberOfChildren: 2,
      childrenAges: [5, 8],
      eligibleChildren: 2, // שני ילדים עד גיל 18
      giftStatus: {
        "ראש השנה 2024": "נמסר ✅",
        "חנוכה 2024": "ממתין להגעה ⏳",
        "פורים 2025": "טרם הוזמן"
      }
    },
    
    // משמרות השבוע
    shifts: {
      thisWeek: [
        { day: "ראשון", hours: "07:00-15:00", type: "בוקר" },
        { day: "שני", hours: "13:00-21:00", type: "אחר צהריים" },
        { day: "שלישי", hours: "07:00-15:00", type: "בוקר" },
        { day: "רביעי", hours: "OFF", type: "יום חופש" },
        { day: "חמישי", hours: "15:00-23:00", type: "ערב" }
      ],
      totalHours: 32 // סה"כ שעות השבוע
    },
    
    // ימי מחלה - נוסף חדש
    sickLeave: {
      annualAccrual: 18, // 1.5 ימים x 12 חודשים = 18 ימים בשנה
      monthlyAccrual: 1.5, // צבירה חודשית
      totalAccrued: 45, // סה"כ נצבר (2.5 שנות עבודה)
      used: 8, // ימים שנוצלו השנה
      remaining: 37, // נותר לשימוש
      maxAllowed: 90, // תקרת צבירה
      details: [
        { date: "2024-02-05", days: 3, type: "שפעת", paymentRate: "50% ימים 1-2, 100% יום 3" },
        { date: "2024-06-12", days: 2, type: "כאב בטן", paymentRate: "50% שני ימים ראשונים" },
        { date: "2024-09-20", days: 3, type: "מיגרנה", paymentRate: "50% ימים 1-2, 100% יום 3" }
      ],
      hasDeclarationDays: true, // זכאות לימי הצהרה
      declarationDaysUsed: 2, // ימי הצהרה שנוצלו השנה
      declarationDaysAllowed: 4 // מקסימום ימי הצהרה בשנה
    },
    
    // ימי מחלת ילד - נוסף חדש
    childSickLeave: {
      annualEntitlement: 8, // 4 ימים לכל ילד עד גיל 16, יש לה 2 ילדים גיל 5 ו-8
      maxPerChild: 4, // מקסימום 4 ימים לילד
      childrenEligible: 2, // 2 ילדים עד גיל 16
      childrenAges: [5, 8], // גילאי הילדים
      used: 3, // ימים שנוצלו השנה
      remaining: 5, // נותר לשימוש
      details: [
        { date: "2024-03-15", days: 1, childAge: 8, type: "שפעת", paymentRate: "100% מהיום הראשון" },
        { date: "2024-07-22", days: 2, childAge: 5, type: "וירוס קיץ", paymentRate: "100% מהיום הראשון" }
      ],
      paymentRate: "100%", // תשלום מלא מהיום הראשון לימי מחלת ילד
      ageLimitNote: "עד גיל 16 (בחלק מהמקרים עד 18)"
    },
    
    // ארנק דיגיטלי (לא חברת ועד)
    digitalWallet: {
      membershipStatus: "לא חבר ועד",
      monthlyAllowance: 0,
      currentBalance: 0,
      isEligible: false,
      reason: "רק חברי ועד עובדים זכאים לארנק דיגיטלי",
      joinInstructions: "ניתן להצטרף לוועד העובדים במזכירות הוועד 03-514-6666"
    }
  },
  
  branch: {
    name: "דוד לוי", 
    role: "מנהל סניף",
    accessLevel: "branch",
    avatar: "ד.ל",
    
    // יתרת ימי חופשה - מעודכן לפי נוהל חדש
    vacation: {
      annualEntitlement: 21, // עפ"י נוהל חדש: 10-15 שנות ותק = 21 ימים
      used: 11,
      remaining: 10,
      details: [
        { date: "2024-02-10", days: 5, type: "חופשה חורפית" },
        { date: "2024-08-05", days: 6, type: "חופשה קיצית" }
      ],
      accruedMonthly: true, // צבירה חודשית עפ"י נוהל חדש
      carryOverAllowed: true, // אפשרות העברה עד 3 שנים
      seniorityLevel: "ניהול בינוני" // רמת ותק מתקדמת
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      numberOfChildren: 3,
      childrenAges: [12, 16, 20],
      eligibleChildren: 2, // רק 2 ילדים עד גיל 18
      giftStatus: {
        "ראש השנה 2024": "נמסר ✅",
        "חנוכה 2024": "נמסר ✅",
        "פורים 2025": "הוזמן, ממתין לאישור"
      }
    },
    
    // משמרות השבוע (מנהל - שעות קבועות)
    shifts: {
      thisWeek: [
        { day: "ראשון", hours: "08:00-17:00", type: "ניהול" },
        { day: "שני", hours: "08:00-17:00", type: "ניהול" },
        { day: "שלישי", hours: "08:00-17:00", type: "ניהול" },
        { day: "רביעי", hours: "08:00-17:00", type: "ניהול" },
        { day: "חמישי", hours: "08:00-16:00", type: "ניהול קצר" }
      ],
      totalHours: 44 // שעות מלאות
    },
    
    // ימי מחלה - נוסף חדש
    sickLeave: {
      annualAccrual: 18, // 1.5 ימים x 12 חודשים = 18 ימים בשנה
      monthlyAccrual: 1.5, // צבירה חודשית
      totalAccrued: 72, // סה"כ נצבר (4 שנות עבודה)
      used: 5, // ימים שנוצלו השנה
      remaining: 67, // נותר לשימוש
      maxAllowed: 90, // תקרת צבירה
      details: [
        { date: "2024-04-10", days: 2, type: "בדיקות רפואיות", paymentRate: "50% ימים 1-2" },
        { date: "2024-08-25", days: 3, type: "כאבי גב", paymentRate: "50% ימים 1-2, 100% יום 3" }
      ],
      hasDeclarationDays: true, // זכאות לימי הצהרה במנהלים
      declarationDaysUsed: 1, // ימי הצהרה שנוצלו השנה
      declarationDaysAllowed: 6, // מקסימום ימי הצהרה בשנה למנהלים
      managerialBenefits: true // הטבות מנהל
    },
    
    // ימי מחלת ילד - נוסף חדש
    childSickLeave: {
      annualEntitlement: 8, // 4 ימים לכל ילד עד גיל 16, יש לו 3 ילדים אבל רק 2 עד גיל 16
      maxPerChild: 4, // מקסימום 4 ימים לילד
      childrenEligible: 2, // 2 ילדים עד גיל 16 (הבן בן 20 לא זכאי)
      childrenAges: [12, 16], // גילאי הילדים הזכאים (בן 20 לא כלול)
      used: 2, // ימים שנוצלו השנה
      remaining: 6, // נותר לשימוש
      details: [
        { date: "2024-05-20", days: 2, childAge: 12, type: "דלקת אוזניים", paymentRate: "100% מהיום הראשון" }
      ],
      paymentRate: "100%", // תשלום מלא מהיום הראשון לימי מחלת ילד
      ageLimitNote: "עד גיל 16 (בן 20 לא זכאי)",
      managerialNote: "כמנהל - גמישות נוספת בזמני היעדרות"
    },
    
    // ארנק דיגיטלי (חבר הנהלת הוועד)
    digitalWallet: {
      membershipStatus: "חבר הנהלת הוועד",
      membershipStartDate: "2023-01-01",
      monthlyAllowance: 200, // ₪200 כחבר הנהלה
      currentBalance: 850, // יתרה נוכחית
      totalEarned: 3600, // סה"כ נצבר
      totalSpent: 2750, // סה"כ נוצל
      isEligible: true,
      recentTransactions: [
        { date: "2024-09-15", amount: -450, description: "חבילת נופש - אילת", type: "הוצאה" },
        { date: "2024-10-01", amount: 200, description: "זיכוי חודשי", type: "זיכוי" },
        { date: "2024-09-28", amount: -120, description: "כרטיסי קונצרט", type: "הוצאה" }
      ],
      usageCategories: {
        vacation: 60, // 60% חופשות
        culture: 25, // 25% תרבות
        shopping: 15 // 15% רכישות
      }
    }
  },
  
  tech: {
    name: "שרה גולדמן",
    role: "מפתחת תוכנה",
    accessLevel: "tech",
    avatar: "ש.ג",
    
    // יתרת ימי חופשה - מעודכן לפי נוהל חדש
    vacation: {
      annualEntitlement: 18, // עפ"י נוהל חדש: 5-10 שנות ותק = 18 ימים
      used: 8,
      remaining: 10,
      details: [
        { date: "2024-01-20", days: 3, type: "חופשה אישית" },
        { date: "2024-06-15", days: 5, type: "חופשה קיצית" }
      ],
      accruedMonthly: true, // צבירה חודשית עפ"י נוהל חדש
      carryOverAllowed: true, // אפשרות העברה עד 3 שנים
      seniorityLevel: "ותק בינוני" // 5-10 שנות ותק
    },
    
    // זכאות מתנות לילדים
    childrenGifts: {
      numberOfChildren: 1,
      childrenAges: [3],
      eligibleChildren: 1,
      giftStatus: {
        "ראש השנה 2024": "נמסר ✅",
        "חנוכה 2024": "נמסר ✅",
        "פורים 2025": "הוזמן"
      }
    },
    
    // משמרות השבוע (גמישות בטכנולוגיה)
    shifts: {
      thisWeek: [
        { day: "ראשון", hours: "09:00-18:00", type: "פיתוח" },
        { day: "שני", hours: "10:00-19:00", type: "פיתוח מאוחר" },
        { day: "שלישי", hours: "עבודה מהבית", type: "remote" },
        { day: "רביעי", hours: "09:00-18:00", type: "פיתוח" },
        { day: "חמישי", hours: "09:00-15:00", type: "יום קצר" }
      ],
      totalHours: 40 // שעות תקן
    },
    
    // ימי מחלה - נוסף חדש
    sickLeave: {
      annualAccrual: 18, // 1.5 ימים x 12 חודשים = 18 ימים בשנה
      monthlyAccrual: 1.5, // צבירה חודשית
      totalAccrued: 54, // סה"כ נצבר (3 שנות עבודה)
      used: 6, // ימים שנוצלו השנה
      remaining: 48, // נותר לשימוש
      maxAllowed: 90, // תקרת צבירה
      details: [
        { date: "2024-01-15", days: 1, type: "כאב ראש", paymentRate: "0% יום ראשון" },
        { date: "2024-05-22", days: 4, type: "דלקת גרון", paymentRate: "0% יום 1, 50% ימים 2-3, 100% יום 4" },
        { date: "2024-07-08", days: 1, type: "ימי הצהרה - מחילות", paymentRate: "100% (הצהרה)" }
      ],
      hasDeclarationDays: true, // זכאות לימי הצהרה
      declarationDaysUsed: 3, // ימי הצהרה שנוצלו השנה
      declarationDaysAllowed: 5, // מקסימום ימי הצהרה בשנה לטכנולוגיה
      techBenefits: true // הטבות עובדי טכנולוגיה
    },
    
    // ימי מחלת ילד - נוסף חדש
    childSickLeave: {
      annualEntitlement: 4, // 4 ימים לכל ילד עד גיל 16, יש לה 1 ילד בגיל 3
      maxPerChild: 4, // מקסימום 4 ימים לילד
      childrenEligible: 1, // 1 ילד עד גיל 16
      childrenAges: [3], // גילאי הילדים הזכאים
      used: 1, // ימים שנוצלו השנה
      remaining: 3, // נותר לשימוש
      details: [
        { date: "2024-06-10", days: 1, childAge: 3, type: "וירוס קיץ", paymentRate: "100% מהיום הראשון" }
      ],
      paymentRate: "100%", // תשלום מלא מהיום הראשון לימי מחלת ילד
      ageLimitNote: "עד גיל 16",
      techBenefits: "גמישות בעבודה מהבית בזמן מחלת ילד"
    },
    
    // ארנק דיגיטלי (חברת ועד רגילה)
    digitalWallet: {
      membershipStatus: "חברת ועד רגילה",
      membershipStartDate: "2024-03-01",
      monthlyAllowance: 150, // ₪150 חברות רגילה
      currentBalance: 420, // יתרה נוכחית
      totalEarned: 1200, // 8 חודשים × 150
      totalSpent: 780, // סה"כ נוצל
      isEligible: true,
      recentTransactions: [
        { date: "2024-10-01", amount: 150, description: "זיכוי חודשי", type: "זיכוי" },
        { date: "2024-09-25", amount: -180, description: "קורס פיתוח אונליין", type: "הוצאה" },
        { date: "2024-09-15", amount: -200, description: "ציוד ספורט", type: "הוצאה" },
        { date: "2024-09-01", amount: 150, description: "זיכוי חודשי", type: "זיכוי" }
      ],
      usageCategories: {
        education: 45, // 45% השתלמויות
        shopping: 35, // 35% רכישות
        culture: 20 // 20% תרבות
      }
    }
  }
}

// Main page
app.get('/', (c) => {
  const userType = c.req.query('user') || 'call_center'
  const currentUser = userProfiles[userType] || userProfiles.call_center
  
  return c.render(
    <div class="chat-container">
      <div class="chat-header">
        <div class="logo">
          <img src="https://page.gensparksite.com/v1/base64_upload/1c2cbdf24b458a240d8a4f579cd06d4d" 
               alt="לוגו בנק דיסקונט" 
               style="width: 55px; height: 55px; object-fit: contain;" />
        </div>
        <div class="title">
          <h1>צ'אטבוט בנק דיסקונט</h1>
          <p>עוזר הידע החכם • "בדיסקונט משקיעים בך!"</p>
        </div>
        <div class="user-info">
          <div class="user-badge">
            <div class="status-indicator"></div>
            <span>{currentUser.name}</span>
            <div style="font-size: 0.75rem; opacity: 0.9;">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>

      <div class="chat-messages" id="chat-messages">
        <div class="message message-assistant">
          <div class="message-avatar">בנק</div>
          <div class="message-content">
            <p class="message-text">
              שלום {currentUser.name}! 👋<br/>
              אני עוזר הידע החכם של בנק דיסקונט. <br/>
              <strong>בדיסקונט משקיעים בך!</strong><br/>
              <strong>איך אני יכול לעזור לך היום? 😊</strong>
            </p>
            <div class="message-meta">
              <i class="fas fa-clock"></i>
              <span id="current-time"></span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <div class="quick-action" onclick="sendQuickMessage('כמה ימי חופשה נשארו לי?')">
            <i class="fas fa-calendar-alt"></i> יתרת החופשה שלי
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מה סטטוס מתנות הילדים שלי?')">
            <i class="fas fa-gift"></i> מתנות הילדים שלי
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מה המשמרות שלי השבוע?')">
            <i class="fas fa-clock"></i> המשמרות שלי השבוע
          </div>
          <div class="quick-action" onclick="sendQuickMessage('כמה ימי מחלת ילד נשארו לי?')">
            <i class="fas fa-baby"></i> ימי מחלת ילד שלי
          </div>
          <div class="quick-action" onclick="sendQuickMessage('יתרת ימי חופשה')">
            <i class="fas fa-info-circle"></i> נוהל חופשות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מתנות לילדים')">
            <i class="fas fa-baby"></i> נוהל מתנות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('משמרות')">
            <i class="fas fa-calendar-week"></i> נוהל משמרות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מה יתרת הארנק הדיגיטלי שלי?')">
            <i class="fas fa-wallet"></i> הארנק הדיגיטלי שלי
          </div>
          <div class="quick-action" onclick="sendQuickMessage('ארנק דיגיטלי')">
            <i class="fas fa-credit-card"></i> נוהל ארנק דיגיטלי
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-container">
          <div class="input-wrapper">
            <textarea 
              id="chat-input" 
              class="chat-textarea" 
              placeholder="שאל אותי כל שאלה מקצועית..."
              rows="1" 
              onkeydown="handleKeyDown(event)">
            </textarea>
            <button id="send-button" class="send-button" onclick="sendMessage()" type="button">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

// Users page
app.get('/users', (c) => {
  return c.render(
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a, #3b82f6);">
      <div class="card" style="max-width: 500px; width: 100%; margin: 2rem; background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="color: #1e3a8a; margin-bottom: 1rem;">בחר סוג משתמש</h1>
          <p style="color: #6b7280;">לצורכי הדמו, בחר את סוג המשתמש:</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <a href="/?user=call_center" style="display: block; padding: 1.5rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 0.5rem; text-align: right;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              <i class="fas fa-headset"></i> רחל כהן - נציגת מוקד טלפוני
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
              📅 חופשה: 10/14 ימים • 🏥 מחלה: 37 ימים • 🎁 ילדים: 2 • 📊 שעות: 32
            </div>
          </a>
          <a href="/?user=branch" style="display: block; padding: 1.5rem; background: #059669; color: white; text-decoration: none; border-radius: 0.5rem; text-align: right;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              <i class="fas fa-building"></i> דוד לוי - מנהל סניף
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
              📅 חופשה: 10/21 ימים • 🏥 מחלה: 67 ימים • 🎁 ילדים: 2/3 • 📊 שעות: 44
            </div>
          </a>
          <a href="/?user=tech" style="display: block; padding: 1.5rem; background: #7c3aed; color: white; text-decoration: none; border-radius: 0.5rem; text-align: right;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              <i class="fas fa-code"></i> שרה גולדמן - מפתחת תוכנה
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
              📅 חופשה: 10/18 ימים • 🏥 מחלה: 48 ימים • 🎁 ילדים: 1 • 📊 שעות: 40
            </div>
          </a>
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; border: 2px solid #e5e7eb;">
          <h4 style="color: #1e3a8a; margin: 0 0 0.5rem 0;">💡 טיפים לדמו:</h4>
          <ul style="margin: 0; padding-right: 1rem; font-size: 0.875rem; color: #374151;">
            <li>כל עובד רואה נתונים אישיים שונים</li>
            <li>נסה שאלות אישיות: "כמה ימי חופשה/מחלה נשארו לי?"</li>
            <li>🆕 שאל על ימי מחלת ילד: "כמה ימי מחלת ילד נשארו לי?"</li>
            <li>או שאלות כלליות: "נוהל חופשות" / "נוהל ימי מחלה"</li>
            <li>🆕 חדש: מידע על ימי מחלה בהתאם לחוק דמי מחלה 1976</li>
          </ul>
        </div>
      </div>
    </div>
  )
})

// Chat API with personalized responses
app.post('/api/chat', async (c) => {
  try {
    const { message, userType, userId } = await c.req.json()
    
    // Map userId to userType for backward compatibility
    const userMap = {
      'rachel': 'call_center',
      'david': 'branch', 
      'sarah': 'tech'
    }
    
    const actualUserType = userType || userMap[userId] || 'call_center'
    const currentUser = userProfiles[actualUserType] || userProfiles.call_center
    
    if (!message?.trim()) {
      return c.json({ 
        text: 'לא הבנתי את השאלה. אנא נסה שוב עם שאלה ברורה יותר.',
        sources: []
      })
    }

    const lowerMessage = message.toLowerCase()
    let response = null

    // Check for personal questions first
    if (lowerMessage.includes('שלי') || lowerMessage.includes('נשאר') || lowerMessage.includes('כמה')) {
      
      // Enhanced personal vacation balance with policy info
      if (lowerMessage.includes('חופשה') || lowerMessage.includes('ימי חופש')) {
        const vacation = currentUser.vacation
        
        // Get user category for policy context
        let userCategory = "קבוע"
        let policyInfo = ""
        
        if (currentUser.role.includes('מוקד')) {
          userCategory = "מוקד טלפוני"
          policyInfo = "לפי נוהל HR-205 המעודכן: עובדי מוקד - זכאות של 14 ימים (1-5 שנות ותק). צבירה חודשית והעברה עד 3 שנים מותרת."
        } else if (currentUser.role.includes('מנהל')) {
          userCategory = "ניהול"
          policyInfo = "לפי נוהל HR-205 המעודכן: מנהלי סניפים - זכאות של 21 ימים (10-15 שנות ותק). צבירה חודשית והעברה עד 3 שנים מותרת."
        } else if (currentUser.role.includes('מפתח')) {
          userCategory = "טכנולוגיות"
          policyInfo = "לפי נוהל HR-205 המעודכן: עובדי טכנולוגיות - זכאות של 18 ימים (5-10 שנות ותק). צבירה חודשית והעברה עד 3 שנים מותרת."
        }
        
        response = {
          text: `**📅 יתרת ימי החופשה שלך, ${currentUser.name}:**\n\n` +
                `🎯 **זכאות שנתית:** ${vacation.annualEntitlement} ימים (${userCategory})\n` +
                `✅ **ניצלת עד כה:** ${vacation.used} ימים\n` +
                `🆓 **נותר לך:** **${vacation.remaining} ימים**\n\n` +
                `**📋 חופשות שלקחת השנה:**\n` +
                vacation.details.map(d => `• ${d.date} - ${d.days} ימים (${d.type})`).join('\n') +
                `\n\n📜 **מידע מהנוהל:**\n${policyInfo}\n\n` +
                `⏰ **זמני הגשת בקשה:**\n` +
                `• יום בודד: 48 שעות מראש\n` +
                `• 2-5 ימים: שבוע מראש\n` +
                `• 6+ ימים: שבועיים מראש\n\n` +
                `📞 **לפרטים נוספים:** נוהל HR-205 או מח' משאבי אנוש 03-514-5555`,
          sources: ["מערכת HR אישית", "נוהל חופשות HR-205"],
          personalized: true
        }
      }
      
      // Personal children gifts status
      else if (lowerMessage.includes('מתנות') || lowerMessage.includes('ילדים')) {
        const gifts = currentUser.childrenGifts
        response = {
          text: `**🎁 סטטוס מתנות הילדים שלך, ${currentUser.name}:**\n\n` +
                `👨‍👩‍👧‍👦 **מספר ילדים:** ${gifts.numberOfChildren}\n` +
                `🎂 **גילאי הילדים:** ${gifts.childrenAges.join(', ')}\n` +
                `✨ **ילדים זכאים למתנות:** ${gifts.eligibleChildren} (עד גיל 18)\n\n` +
                `**📦 סטטוס מתנות השנה:**\n` +
                Object.entries(gifts.giftStatus).map(([holiday, status]) => `• ${holiday}: ${status}`).join('\n') +
                `\n\n💝 **מתנות מגיעות אוטומטית לפי נתוני טופס 101!**`,
          sources: ["מערכת מתנות אישית", "טופס 101", "נוהל מתנות HR-310"],
          personalized: true
        }
      }
      
      // Personal weekly shifts
      else if (lowerMessage.includes('משמרות') || lowerMessage.includes('השבוע')) {
        const shifts = currentUser.shifts
        response = {
          text: `**📅 המשמרות שלך השבוע, ${currentUser.name}:**\n\n` +
                shifts.thisWeek.map(shift => 
                  `**${shift.day}:** ${shift.hours} (${shift.type})`
                ).join('\n') +
                `\n\n⏰ **סה"כ שעות השבוע:** ${shifts.totalHours} שעות\n\n` +
                `💼 **תפקידך:** ${currentUser.role}\n` +
                `📋 **הערה:** המשמרות מעודכנות שבועית במערכת`,
          sources: ["מערכת שיבוץ אישי", "נוהל משמרות OP-150"],
          personalized: true
        }
      }
      
      // Personal digital wallet status
      else if (lowerMessage.includes('ארנק') || lowerMessage.includes('דיגיטלי')) {
        const wallet = currentUser.digitalWallet
        
        if (wallet.isEligible) {
          const balanceStatus = wallet.currentBalance > 0 ? `**₪${wallet.currentBalance}**` : '₪0'
          response = {
            text: `**💳 הארנק הדיגיטלי שלך, ${currentUser.name}:**\n\n` +
                  `👥 **סטטוס חברות:** ${wallet.membershipStatus}\n` +
                  `💰 **יתרה נוכחית:** ${balanceStatus}\n` +
                  `📅 **הקצבה חודשית:** ₪${wallet.monthlyAllowance}\n\n` +
                  `📊 **סיכום כולל:**\n` +
                  `• סה"כ נצבר: ₪${wallet.totalEarned}\n` +
                  `• סה"כ נוצל: ₪${wallet.totalSpent}\n` +
                  `• חבר מתאריך: ${wallet.membershipStartDate}\n\n` +
                  `**📋 תנועות אחרונות:**\n` +
                  wallet.recentTransactions.slice(0, 3).map(t => 
                    `• ${t.date}: ${t.amount > 0 ? '+' : ''}${t.amount} - ${t.description}`
                  ).join('\n') +
                  `\n\n📜 **לפי נוהל HR-420:** שימוש מאושר לחופשות, תרבות, רכישות, מסעדות והשתלמויות\n` +
                  `📞 **פרטים:** מזכירות ועד 03-514-6666 | פורטל: portal.discountbank.co.il/digital-wallet`,
            sources: ["מערכת ארנק דיגיטלי", "נוהל HR-420", "מזכירות ועד עובדים"],
            personalized: true
          }
        } else {
          response = {
            text: `**💳 ארנק דיגיטלי - ${currentUser.name}:**\n\n` +
                  `❌ **סטטוס:** ${wallet.membershipStatus}\n` +
                  `💰 **יתרה:** ₪${wallet.currentBalance}\n\n` +
                  `📋 **סיבה:** ${wallet.reason}\n\n` +
                  `✅ **רוצה להצטרף לוועד העובדים?**\n` +
                  `${wallet.joinInstructions}\n\n` +
                  `📜 **לפי נוהל HR-420:** רק חברי ועד עובדים פעילים זכאים להטבות של ₪150-300 לחודש\n` +
                  `📞 **פרטים:** מזכירות ועד 03-514-6666`,
            sources: ["נוהל HR-420", "מזכירות ועד עובדים"],
            personalized: true
          }
        }
      }
      
      // Personal child sick leave status - MUST BE BEFORE general sick leave
      else if (lowerMessage.includes('מחלת ילד') || 
               lowerMessage.includes('ימי מחלת ילד') || 
               lowerMessage.includes('מחלה ילד') ||
               lowerMessage.includes('ימי מחלה ילד') ||
               lowerMessage.includes('מחלת הילד') ||
               lowerMessage.includes('מחלת הילדים') ||
               lowerMessage.includes('ילד חולה') ||
               lowerMessage.includes('ילדים חולים') ||
               (lowerMessage.includes('מחלה') && lowerMessage.includes('ילד') && lowerMessage.includes('שלי')) ||
               (lowerMessage.includes('חולה') && lowerMessage.includes('ילד') && lowerMessage.includes('שלי')) ||
               (lowerMessage.includes('ימי') && lowerMessage.includes('מחלה') && lowerMessage.includes('ילד'))) {
        
        const childSick = currentUser.childSickLeave
        const children = currentUser.childrenGifts
        
        if (children.numberOfChildren === 0 || !childSick || childSick.childrenEligible === 0) {
          response = {
            text: `**👶 ימי מחלת ילד - ${currentUser.name}:**\n\n` +
                  `❌ **אין זכאות לימי מחלת ילד**\n\n` +
                  `📋 **סיבה:** אין לך ילדים רשומים במערכת או שהם מעל הגיל המזכה\n\n` +
                  `📝 **לעדכון נתוני ילדים:** יש לפנות למחלקת משאבי אנוש עם טופס 101 מעודכן\n` +
                  `📞 **פרטים:** HR 03-514-5555 | portal.discountbank.co.il/family-data`,
            sources: ["מערכת HR אישית", "נוהל ימי מחלה HR-310", "טופס 101"],
            personalized: true
          }
        } else {
          response = {
            text: `**👶 ימי מחלת ילד שלך, ${currentUser.name}:**\n\n` +
                  `👨‍👩‍👧‍👦 **ילדים זכאים:** ${childSick.childrenEligible} ילדים\n` +
                  `🎂 **גילאים:** ${childSick.childrenAges.join(', ')} שנים\n` +
                  `📊 **זכאות שנתית:** ${childSick.annualEntitlement} ימים (${childSick.maxPerChild} ימים לכל ילד)\n\n` +
                  `📈 **מצב נוכחי:**\n` +
                  `• **נוצל השנה:** ${childSick.used} ימים\n` +
                  `• **נותר לשימוש:** **${childSick.remaining} ימים**\n\n` +
                  `**📋 היעדרויות השנה:**\n` +
                  (childSick.details.length > 0 ? 
                    childSick.details.map(d => 
                      `• ${d.date}: ${d.days} ימים (ילד גיל ${d.childAge}, ${d.type}) - ${d.paymentRate}`
                    ).join('\n') : 
                    `• אין היעדרויות השנה`) +
                  `\n\n💰 **תשלום:** ${childSick.paymentRate} מהיום הראשון\n` +
                  `⚖️ **גיל זכאות:** ${childSick.ageLimitNote}\n\n` +
                  (childSick.managerialNote ? `🔹 **הערה מיוחדת:** ${childSick.managerialNote}\n` : '') +
                  (childSick.techBenefits ? `💻 **הטבת טכנולוגיה:** ${childSick.techBenefits}\n` : '') +
                  `📜 **לפי נוהל HR-310:** זכאות לטיפול בילד חולה עד גיל 16\n` +
                  `📞 **פרטים:** HR 03-514-5555 | portal.discountbank.co.il/child-sick-leave`,
            sources: ["מערכת HR אישית", "נוהל ימי מחלה HR-310", "זכויות הורים"],
            personalized: true
          }
        }
      }
      
      // Personal sick leave status (general)
      else if (lowerMessage.includes('מחלה') || lowerMessage.includes('ימי מחלה') || lowerMessage.includes('חולה')) {
        const sickLeave = currentUser.sickLeave
        
        response = {
          text: `**🏥 ימי המחלה שלך, ${currentUser.name}:**\n\n` +
                `📊 **מצב נוכחי:**\n` +
                `• **צבירה שנתית:** ${sickLeave.annualAccrual} ימים\n` +
                `• **סה"כ נצבר:** ${sickLeave.totalAccrued} ימים\n` +
                `• **נוצל השנה:** ${sickLeave.used} ימים\n` +
                `• **נותר לשימוש:** **${sickLeave.remaining} ימים**\n\n` +
                `📈 **צבירה חודשית:** ${sickLeave.monthlyAccrual} ימים לחודש\n` +
                `🏦 **תקרת צבירה:** ${sickLeave.maxAllowed} ימים\n\n` +
                `**📋 היעדרויות השנה:**\n` +
                sickLeave.details.map(d => 
                  `• ${d.date}: ${d.days} ימים (${d.type}) - ${d.paymentRate}`
                ).join('\n') +
                (sickLeave.hasDeclarationDays ? 
                  `\n\n**📝 ימי הצהרה:**\n• נוצלו: ${sickLeave.declarationDaysUsed}/${sickLeave.declarationDaysAllowed} ימים` : '') +
                `\n\n📜 **לפי נוהל HR-310:**\n` +
                `• יום ראשון: ללא תשלום\n` +
                `• ימים 2-3: 50% שכר\n` +
                `• יום 4 ואילך: 100% שכר\n\n` +
                `📞 **פרטים:** HR 03-514-5555 | portal.discountbank.co.il/sick-leave`,
          sources: ["מערכת HR אישית", "נוהל ימי מחלה HR-310"],
          personalized: true
        }
      }
    }

    // General knowledge base search if no personal answer
    if (!response) {
      for (const item of knowledgeBase) {
        if ((lowerMessage.includes('חופשה') && item.topic === 'vacation') ||
            (lowerMessage.includes('נוהל חופשות') && item.topic === 'vacation') ||
            (lowerMessage.includes('מתנות') && item.topic === 'gifts') ||
            (lowerMessage.includes('נוהל מתנות') && item.topic === 'gifts') ||
            (lowerMessage.includes('משמרות') && item.topic === 'shifts') ||
            (lowerMessage.includes('נוהל משמרות') && item.topic === 'shifts') ||
            (lowerMessage.includes('ארנק') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('דיגיטלי') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('נוהל ארנק') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('זכאות') && lowerMessage.includes('ועד') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('זכאות') && lowerMessage.includes('חודשית') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('הטבות') && lowerMessage.includes('ועד') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('ועד עובדים') && item.topic === 'digitalWallet') ||
            (lowerMessage.includes('מחלה') && item.topic === 'sickLeave') ||
            (lowerMessage.includes('ימי מחלה') && item.topic === 'sickLeave') ||
            (lowerMessage.includes('נוהל מחלה') && item.topic === 'sickLeave') ||
            (lowerMessage.includes('דמי מחלה') && item.topic === 'sickLeave') ||
            (lowerMessage.includes('חולה') && !lowerMessage.includes('שלי') && item.topic === 'sickLeave')) {
          response = {
            text: item.answer,
            sources: item.sources || [],
            personalized: false
          }
          break
        }
      }
    }

    if (response) {
      return c.json({
        text: response.text,
        sources: response.sources || [],
        lastUpdated: "2024-10-11",
        confidence: response.personalized ? 1.0 : 0.9,
        personalized: response.personalized || false,
        userType: currentUser.role
      })
    } else {
      return c.json({
        text: `שלום ${currentUser.name}! לא מצאתי מידע ספציפי לשאלתך.\n\n` +
              `💡 **נסה לשאול על:**\n` +
              `• "כמה ימי חופשה נשארו לי?"\n` +
              `• "כמה ימי מחלת ילד נשארו לי?"\n` +
              `• "מה סטטוס מתנות הילדים שלי?"\n` +
              `• "מה המשמרות שלי השבוע?"\n\n` +
              `או שאל שאלות כלליות על נהלים.`,
        sources: [],
        lastUpdated: "2024-10-11",
        confidence: 0.5,
        personalized: true
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return c.json({ 
      text: 'אירעה שגיאה טכנית. אנא נסה שוב.',
      sources: []
    }, 500)
  }
})

export default app