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
    lastUpdated: "2024-10-15",
    accessLevel: "basic"
  },
  {
    id: 2,
    category: "עובד סניף",
    question: "מהם הקריטריונים לאישור הלוואה עסקית של 500,000 ש\"ח?",
    answer: "על פי מדיניות אשראי עסקי (מס' 301.08), הלוואה בסכום זה דורשת: 1. ותק עסקי מינימלי של 2 שנים 2. מחזור שנתי מינימלי של 2 מיליון ש\"ח 3. דוחות כספיים מבוקרים 4. ערבויות בהתאם לסיכון. נדרשת הפניה לוועדת אשראי סניפית.",
    sources: ["מדיניות אשראי 301.08", "נספח ב' - קריטריונים"],
    lastUpdated: "2024-10-10",
    accessLevel: "branch"
  },
  {
    id: 3,
    category: "מפתח תוכנה",
    question: "איך מגישים בקשה לגישה למערכת הליבה החדשה?",
    answer: "תהליך בקשת גישה למערכת Core Banking v3.0: 1. מילוי טופס IT-403 במערכת ServiceNow 2. אישור מנהל ישיר ומנהל אבטחת מידע 3. השלמת קורס אבטחה S-205 4. זמן טיפול: עד 5 ימי עסקים.",
    sources: ["מדריך IT Procedures", "ServiceNow KB-1205"],
    lastUpdated: "2024-10-12",
    accessLevel: "tech"
  },
  {
    id: 16,
    category: "משאבי אנוש - טופס 101",
    question: "מה זה טופס 101 ואיך מנוהלים נתוני משפחה?",
    answer: "טופס 101 - נתוני משפחה (HR-FAM-150.25): **מטרה:** עדכון שנתי של נתוני משפחה לצרכי זכויות וביטוחים. **נתונים הנדרשים:** ת\"ז עובד, מספר ילדים, גילאי הילדים (עד 18), סטטוס משפחתי (רווק/נשוי/גרוש/אלמן). **עדכון שנתי:** חובת עדכון עד 31 בינואר כל שנה. **השפעה על זכויות:** מספר ילדים משפיע על: מתנות, ימי מחלת ילד, קצבת ילדים, ביטוח בריאות משלים. **מסמכים נדרשים:** תעודות לידה, אישור משפחתי עדכני מרשם האוכלוסין. **עדכונים חריגים:** לידה, אימוץ, גירושין - עדכון תוך 30 יום מהאירוע.",
    sources: ["טופס 101 - הוראות", "מערכת נתוני משפחה", "זכויות לפי מצב משפחתי"],
    lastUpdated: "2024-09-30",
    accessLevel: "basic"
  },
  {
    id: 18,
    category: "משאבי אנוש - מתנות ילדים",
    question: "מה זכאות המתנות לילדים וכיצד מנוהלת?",
    answer: "זכאות מתנות לילדים (HR-GIFT-345.60): **זכאות לפי גיל:** גיל 0-12: מתנה + 200₪, גיל 13-18: 300₪ במזומן, מעל 18: לא זכאי. **תנאי זכאות:** ילד רשום בטופס 101, עובד במשרה מעל 50%, ותק מינימלי 6 חודשים. **מועדי חלוקה:** ראש השנה (ספטמבר), חנוכה (דצמבר), פסח (מרץ-אפריל). **סטטוס מימוש:** 'ממתין' - טרם הוגש, 'בטיפול' - HR בודק זכאות, 'אושר' - מתנה/כסף הועברו. **הגשת בקשה:** דרך מערכת HR עד 30 לחודש שלפני החג. **אישור אוטומטי:** עובדים קבועים עם נתונים מעודכנים בטופס 101.",
    sources: ["נוהל HR-GIFT-345.60", "מערכת מתנות", "טבלת זכאויות לפי גיל"],
    lastUpdated: "2024-10-05",
    accessLevel: "basic"
  }
];

// Employee database with comprehensive Form 101 family data
const employeeDatabase = {
  "call_center": {
    id: "123456789",
    name: "רחל כהן",
    role: "נציגת מוקד טלפוני",
    department: "שירות לקוחות",
    accessLevel: "basic",
    avatar: "ר.כ",
    permissions: ["basic", "customer_service"],
    employmentType: "hourly",
    seniority: 8,
    grade: 3,
    hireDate: "2024-02-01",
    
    // נתוני משפחה (טופס 101) - נשואה עם 2 ילדים קטנים
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 2,
      childrenAges: [5, 8],
      spouseDetails: { name: "יוסי כהן", birthYear: 1988, occupation: "חשמלאי" },
      lastUpdated: "2024-01-15",
      additionalInfo: {
        marriageDate: "2015-06-20",
        emergencyContact: "יוסי כהן - בעל"
      }
    },
    
    annualEntitlements: {
      vacation: 12,
      recovery: 0,
      clothing: 800,
      gifts: 300,
      sickDays: 12,
      childSickDays: 10 // ימי מחלת ילד מוגברים - 2 ילדים קטנים
    },
    
    currentYearUsage: {
      vacation: { used: 5, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: { used: 4, dates: [] },
      childSickDays: { used: 6, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 2,
      giftStatus2024: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "נמסר"
      },
      childrenDetails: [
        { age: 5, giftType: "מתנה + 200₪" },
        { age: 8, giftType: "מתנה + 200₪" }
      ]
    }
  },
  
  "call_center_temp": {
    id: "987654321", 
    name: "אור ישראלי",
    role: "נציג מוקד זמני",
    department: "מוקד טלפוני",
    accessLevel: "basic",
    avatar: "א.י",
    permissions: ["basic"],
    employmentType: "temporary",
    seniority: 3,
    grade: 2,
    hireDate: "2024-07-01",
    
    // נתוני משפחה (טופס 101) - עובד צעיר רווק
    familyData: {
      maritalStatus: "רווק",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2024-07-15",
      additionalInfo: {
        emergencyContact: "אמא - דליה ישראלי",
        livingArrangement: "דירת שותפים"
      }
    },
    
    annualEntitlements: {
      vacation: 0,
      recovery: 0,
      clothing: 400,
      gifts: 100,
      sickDays: 6,
      childSickDays: 0
    },
    
    currentYearUsage: {
      vacation: { used: 0, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: { used: 1, dates: [] },
      childSickDays: { used: 0, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2024: {}
    }
  },
  
  "call_center_permanent": {
    id: "456789123",
    name: "מיכל אברהם", 
    role: "נציגת מוקד בכירה",
    department: "מוקד טלפוני ומענה ללקוחות VIP",
    accessLevel: "basic",
    avatar: "מ.א",
    permissions: ["basic", "vip_customers", "supervision"],
    employmentType: "permanent",
    seniority: 36,
    grade: 5,
    hireDate: "2021-10-01",
    
    // נתוני משפחה (טופס 101) - אם לשני ילדים קטנים
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 2,
      childrenAges: [3, 6],
      spouseDetails: { name: "רונן אברהם", birthYear: 1985, occupation: "מהנדס תוכנה" },
      lastUpdated: "2024-01-20",
      additionalInfo: {
        marriageDate: "2017-05-15",
        emergencyContact: "רונן אברהם - בעל",
        kindergartenArrangements: "גן ליד הבית ומטפלת פרטית"
      }
    },
    
    annualEntitlements: {
      vacation: 18,
      recovery: 7,
      clothing: 1200,
      gifts: 500,
      sickDays: 18,
      childSickDays: 12 // ימי מחלת ילד מוגברים - 2 ילדים צעירים
    },
    
    currentYearUsage: {
      vacation: { used: 14, dates: [] },
      recovery: { used: 7, dates: [] },
      sickDays: { used: 5, dates: [] },
      childSickDays: { used: 8, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 2,
      giftStatus2024: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "נמסר"
      },
      childrenDetails: [
        { age: 3, giftType: "מתנה + 200₪" },
        { age: 6, giftType: "מתנה + 200₪" }
      ]
    }
  },
  
  "branch_temp": {
    id: "321654987",
    name: "נועה כהן",
    role: "פקידת סניף זמנית", 
    department: "סניף תל אביב מרכז",
    accessLevel: "basic",
    avatar: "נ.כ",
    permissions: ["basic"],
    employmentType: "temporary",
    seniority: 6,
    grade: 3,
    hireDate: "2024-04-01",
    
    // נתוני משפחה (טופס 101) - גרושה עם ילד אחד
    familyData: {
      maritalStatus: "גרושה",
      numberOfChildren: 1,
      childrenAges: [12],
      spouseDetails: null,
      lastUpdated: "2024-04-10",
      additionalInfo: {
        custodyArrangement: "משמורת בלעדית",
        singleParentBenefits: true,
        emergencyContact: "סבתא - רחל כהן",
        divorceDate: "2020-03-15"
      }
    },
    
    annualEntitlements: {
      vacation: 6,
      recovery: 0,
      clothing: 600,
      gifts: 200,
      sickDays: 12,
      childSickDays: 8 // ימי מחלת ילד - הורה יחיד
    },
    
    currentYearUsage: {
      vacation: { used: 3, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: { used: 4, dates: [] },
      childSickDays: { used: 3, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 1,
      giftStatus2024: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "נמסר"
      },
      childrenDetails: [
        { age: 12, giftType: "מתנה + 200₪" }
      ]
    }
  },
  
  "branch": {
    id: "789123456",
    name: "דוד לוי",
    role: "מנהל סניף",
    department: "סניף חיפה מרכז",
    accessLevel: "branch",
    avatar: "ד.ל",
    permissions: ["basic", "branch", "management", "loans", "approvals"],
    employmentType: "permanent",
    seniority: 84,
    grade: 9,
    hireDate: "2017-10-01",
    
    // נתוני משפחה (טופס 101) - נשוי + 3 ילדים
    familyData: {
      maritalStatus: "נשוי",
      numberOfChildren: 3,
      childrenAges: [8, 14, 17],
      spouseDetails: { name: "מירית לוי", birthYear: 1982, occupation: "רוקחת" },
      lastUpdated: "2024-01-25",
      additionalInfo: {
        marriageDate: "2005-09-12",
        familyEvents: ["בר מצווה בנובמבר 2024 לבן הבכור"],
        spouseEmployment: "מועסקת במשרה מלאה - בית מרקחת שיכמן",
        emergencyContact: "מירית לוי - רעיה"
      }
    },
    
    annualEntitlements: {
      vacation: 24,
      recovery: 10,
      clothing: 2500,
      gifts: 800,
      sickDays: 18,
      childSickDays: 15 // ימי מחלת ילד מוגברים - 3 ילדים
    },
    
    currentYearUsage: {
      vacation: { used: 18, dates: [] },
      recovery: { used: 10, dates: [] },
      sickDays: { used: 3, dates: [] },
      childSickDays: { used: 7, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 3,
      giftStatus2024: {
        "ראש השנה": "נמסר",
        "חנוכה": "ממתין",
        "פסח": "נמסר"
      },
      childrenDetails: [
        { age: 8, giftType: "מתנה + 200₪" },
        { age: 14, giftType: "300₪ במזומן" },
        { age: 17, giftType: "300₪ במזומן" }
      ]
    }
  },
  
  "tech": {
    id: "654321789",
    name: "שרה גולדמן",
    role: "מפתחת תוכנה",
    department: "חטיבת טכנולוגיות",
    accessLevel: "tech",
    avatar: "ש.ג",
    permissions: ["basic", "tech", "systems"],
    employmentType: "permanent",
    seniority: 48,
    grade: 7,
    hireDate: "2020-10-01",
    
    // נתוני משפחה (טופס 101) - רווקה ללא ילדים
    familyData: {
      maritalStatus: "רווקה",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2024-01-10",
      additionalInfo: {
        livingArrangement: "דירה עצמאית",
        emergencyContact: "אבא - משה גולדמן",
        personalStatus: "ממוקדת בקריירה"
      }
    },
    
    annualEntitlements: {
      vacation: 18,
      recovery: 7,
      clothing: 1800,
      gifts: 600,
      sickDays: 18,
      childSickDays: 0
    },
    
    currentYearUsage: {
      vacation: { used: 10, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: { used: 2, dates: [] },
      childSickDays: { used: 0, dates: [] }
    },
    
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2024: {}
    }
  }
};

// הגדרת רפרנס לתאימות אחורית
employeeDatabase["hourly"] = employeeDatabase["call_center"];

const userProfiles = employeeDatabase;

// Main chatbot page
app.get('/', (c) => {
  const userType = c.req.query('user') || 'call_center';
  const currentUser = userProfiles[userType] || userProfiles.call_center;
  
  return c.render(
    <div class="chat-container">
      {/* Chat Header */}
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
              {currentUser.role}<br/>
              {currentUser.employmentType === 'permanent' ? '🟢 קבוע' : 
               currentUser.employmentType === 'temporary' ? '🟡 זמני' : '🔵 שעתי'} • 
              דרגה {currentUser.grade} • 
              {Math.floor(currentUser.seniority / 12) > 0 ? `${Math.floor(currentUser.seniority / 12)} שנים` : `${currentUser.seniority} חודשים`}
              {currentUser.familyData && currentUser.familyData.numberOfChildren > 0 ? (
                <div style="margin-top: 0.25rem; color: #FF6B35; font-weight: 600;">
                  👨‍👩‍👧‍👦 {currentUser.familyData.maritalStatus} • {currentUser.familyData.numberOfChildren} ילדים
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div class="chat-messages" id="chat-messages">
        {/* Welcome Message */}
        <div class="message message-assistant">
          <div class="message-avatar">בנק</div>
          <div class="message-content">
            <p class="message-text">
              שלום {currentUser.name}! 👋<br/>
              אני עוזר הידע החכם של בנק דיסקונט. <br/>
              זיהיתי אותך כ<strong>{currentUser.employmentType === 'permanent' ? 'עובד קבוע' : 
              currentUser.employmentType === 'temporary' ? 'עובד זמני' : 'עובד שעתי'}</strong> ב{currentUser.department}.<br/>
              {currentUser.familyData && currentUser.familyData.numberOfChildren > 0 ? (
                <span><strong>נתוני משפחה:</strong> {currentUser.familyData.maritalStatus} עם {currentUser.familyData.numberOfChildren} ילדים (גילאים: {currentUser.familyData.childrenAges?.join(', ')})<br/></span>
              ) : null}
              <strong>בדיסקונט משקיעים בך!</strong> התשובות שלי מותאמות אישית לסטטוס ההעסקה ולזכויותיך.<br/>
              <strong>איך אני יכול לעזור לך היום? 😊</strong>
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
          <div class="quick-action" onclick="sendQuickMessage('מה שעות העבודה הרגילות?')">
            <i class="fas fa-clock"></i> שעות עבודה
          </div>
          <div class="quick-action" onclick="sendQuickMessage('איך מגישים בקשה לחופשה?')">
            <i class="fas fa-calendar-alt"></i> חופשה שנתית
          </div>
          <div class="quick-action" onclick="sendQuickMessage('נוהל דיווח מחלה')">
            <i class="fas fa-user-md"></i> דיווח מחלה
          </div>
          <div class="quick-action" onclick="sendQuickMessage('איך מבקשים שעות נוספות?')">
            <i class="fas fa-plus-circle"></i> שעות נוספות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('זכויות הורות ולידה')">
            <i class="fas fa-baby"></i> זכויות הורות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('עבודה מרחוק')">
            <i class="fas fa-home"></i> עבודה מהבית
          </div>
          <div class="quick-action" onclick="sendQuickMessage('טופס 101 נתוני משפחה')">
            <i class="fas fa-users"></i> טופס 101
          </div>
          <div class="quick-action" onclick="sendQuickMessage('זכאות מתנות לילדים')">
            <i class="fas fa-gift"></i> מתנות ילדים
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מעקב ימי מחלה מול זכאות')">
            <i class="fas fa-heartbeat"></i> ימי מחלה
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מערכת זכאויות וניצול')">
            <i class="fas fa-chart-line"></i> זכויות וניצול
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div class="input-area">
        <div class="input-wrapper">
          <input 
            type="text" 
            id="user-input" 
            placeholder="הקלד את השאלה שלך כאן..." 
            onkeypress="if(event.key==='Enter') sendMessage()"
          />
          <button onclick="sendMessage()" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* User Switcher */}
      <div class="user-switcher">
        <h3 style="color: var(--discount-green-dark); margin: 1.5rem 0 1rem 0; border-bottom: 3px solid var(--discount-accent); padding-bottom: 0.75rem; font-family: 'Heebo', sans-serif; font-size: 1.25rem;">
          <i class="fas fa-phone" style="color: var(--discount-accent); margin-left: 0.5rem;"></i> מוקד טלפוני
        </h3>
        
        <a href="/?user=call_center" class="btn btn-primary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-headset" style="font-size: 1.5rem; opacity: 0.9;"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">רחל כהן - נציגת מוקד</div>
              <small style="opacity: 0.8; font-weight: normal;">שעתי • 8 חודשים • הרשאות בסיסיות</small>
              <div style="color: #FF6B35; font-size: 0.8rem; margin-top: 0.25rem; font-weight: 600;">
                👨‍👩‍👧‍👦 נשואה • 2 ילדים
              </div>
            </div>
          </div>
        </a>
        
        <a href="/?user=call_center_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-user-clock" style="font-size: 1.5rem; color: var(--discount-gray-500);"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">אור ישראלי - נציג זמני</div>
              <small style="opacity: 0.8; font-weight: normal; color: var(--discount-gray-600);">זמני • 3 חודשים • הרשאות מוגבלות</small>
              <div style="color: #6B7280; font-size: 0.8rem; margin-top: 0.25rem;">
                👤 רווק • ללא ילדים
              </div>
            </div>
          </div>
        </a>
        
        <a href="/?user=call_center_permanent" class="btn btn-primary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-star" style="font-size: 1.5rem; opacity: 0.9;"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">מיכל אברהם - נציגת בכירה</div>
              <small style="opacity: 0.8; font-weight: normal;">קבוע • 3 שנים • הרשאות VIP</small>
              <div style="color: #FF6B35; font-size: 0.8rem; margin-top: 0.25rem; font-weight: 600;">
                👨‍👩‍👧‍👦 נשואה • 2 ילדים צעירים
              </div>
            </div>
          </div>
        </a>

        <h3 style="color: var(--discount-green-dark); margin: 2rem 0 1rem 0; border-bottom: 3px solid var(--discount-accent); padding-bottom: 0.75rem; font-family: 'Heebo', sans-serif; font-size: 1.25rem;">
          <i class="fas fa-university" style="color: var(--discount-accent); margin-left: 0.5rem;"></i> עובדי סניפים
        </h3>
        
        <a href="/?user=branch_temp" class="btn btn-secondary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-user-clock" style="font-size: 1.5rem; color: var(--discount-gray-500);"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">נועה כהן - פקידת סניף זמנית</div>
              <small style="opacity: 0.8; font-weight: normal; color: var(--discount-gray-600);">זמני • 6 חודשים • הרשאות בסיסיות</small>
              <div style="color: #DC2626; font-size: 0.8rem; margin-top: 0.25rem; font-weight: 600;">
                👩‍👧 גרושה • 1 ילד (הורה יחיד)
              </div>
            </div>
          </div>
        </a>
        
        <a href="/?user=branch" class="btn btn-primary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-building" style="font-size: 1.5rem; opacity: 0.9;"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">דוד לוי - מנהל סניף</div>
              <small style="opacity: 0.8; font-weight: normal;">קבוע • 7 שנים • הרשאות ניהול מלאות</small>
              <div style="color: #FF6B35; font-size: 0.8rem; margin-top: 0.25rem; font-weight: 600;">
                👨‍👩‍👧‍👦 נשוי • 3 ילדים
              </div>
            </div>
          </div>
        </a>
        
        <h3 style="color: var(--discount-green-dark); margin: 2rem 0 1rem 0; border-bottom: 3px solid var(--discount-accent); padding-bottom: 0.75rem; font-family: 'Heebo', sans-serif; font-size: 1.25rem;">
          <i class="fas fa-laptop-code" style="color: var(--discount-accent); margin-left: 0.5rem;"></i> צוות טכנולוגיות
        </h3>
        
        <a href="/?user=tech" class="btn btn-primary" style="text-decoration: none; padding: 1.5rem; border-radius: 1.25rem; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <i class="fas fa-code" style="font-size: 1.5rem; opacity: 0.9;"></i>
            <div style="flex: 1; text-align: right; margin-right: 1rem;">
              <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">שרה גולדמן - מפתחת תוכנה</div>
              <small style="opacity: 0.8; font-weight: normal;">קבוע • 4 שנים • הרשאות טכניות מלאות</small>
              <div style="color: #6B7280; font-size: 0.8rem; margin-top: 0.25rem;">
                👤 רווקה • ללא ילדים
              </div>
            </div>
          </div>
        </a>
      </div>
      
      <div style="margin-top: 2.5rem; padding: 1.5rem; background: var(--discount-gray-50); border-radius: 1rem; border: 2px solid rgba(46, 125, 50, 0.1);">
        <h4 style="color: var(--discount-green-dark); margin: 0 0 0.75rem 0; font-family: 'Heebo', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <i class="fas fa-lightbulb" style="color: var(--discount-accent);"></i>
          טיפ לדמו
        </h4>
        <p style="margin: 0; font-size: 0.95rem; color: var(--discount-gray-700); font-family: 'Assistant', sans-serif; line-height: 1.6;">
          כל סוג משתמש רואה תשובות מותאמות לתפקידו ולהרשאות הגישה שלו.
          נסה לשאול את אותה השאלה ממשתמשים שונים!
          <strong>חדש:</strong> נתוני טופס 101 משפיעים על זכויות המתנות וימי המחלה של כל עובד.
        </p>
      </div>
    </div>
  )
})

// Chat API endpoint
app.post('/api/chat', async (c) => {
  const { message, userType } = await c.req.json()
  const currentUser = userProfiles[userType] || userProfiles.call_center
  
  if (!message || message.trim().length === 0) {
    return c.json({ 
      error: 'הודעה ריקה', 
      response: 'לא הבנתי את השאלה. אנא נסה שוב עם שאלה ברורה יותר.' 
    }, 400)
  }

  // Search for relevant answers in knowledge base
  const relevantAnswers = knowledgeBase.filter(item => {
    // Check access level
    if (item.accessLevel === 'basic' || 
        (item.accessLevel === 'branch' && currentUser.accessLevel === 'branch') ||
        (item.accessLevel === 'tech' && currentUser.accessLevel === 'tech')) {
      
      // Check if message contains keywords from question or answer
      const searchText = message.toLowerCase()
      const questionText = item.question.toLowerCase()
      const answerText = item.answer.toLowerCase()
      
      return questionText.includes(searchText) || 
             answerText.includes(searchText) ||
             searchText.includes('טופס 101') ||
             searchText.includes('נתוני משפחה') ||
             searchText.includes('מתנות ילדים') ||
             searchText.includes('מחלת ילד')
    }
    return false
  })

  let response = ''
  
  if (relevantAnswers.length > 0) {
    // Return the most relevant answer
    const bestMatch = relevantAnswers[0]
    response = bestMatch.answer
    
    // Add personalized information for family-related queries
    if (message.toLowerCase().includes('טופס 101') || message.toLowerCase().includes('נתוני משפחה')) {
      const familyData = currentUser.familyData
      response += `\n\n**הנתונים האישיים שלך (${currentUser.name}):**\n`
      response += `• מצב משפחתי: ${familyData?.maritalStatus || 'לא עודכן'}\n`
      response += `• מספר ילדים: ${familyData?.numberOfChildren || 0}\n`
      if (familyData?.childrenAges && familyData.childrenAges.length > 0) {
        response += `• גילאי הילדים: ${familyData.childrenAges.join(', ')}\n`
      }
      response += `• עדכון אחרון: ${familyData?.lastUpdated || 'לא עודכן'}\n`
    }
    
    if (message.toLowerCase().includes('מתנות ילדים')) {
      const gifts = currentUser.childrenGifts
      if (gifts?.eligibleChildren > 0) {
        response += `\n\n**הזכאות שלך למתנות ילדים:**\n`
        response += `• מספר ילדים זכאים: ${gifts.eligibleChildren}\n`
        gifts.childrenDetails?.forEach((child, index) => {
          response += `• ילד ${index + 1} (גיל ${child.age}): ${child.giftType}\n`
        })
        response += `\n**סטטוס מתנות 2024:**\n`
        Object.entries(gifts.giftStatus2024).forEach(([holiday, status]) => {
          response += `• ${holiday}: ${status}\n`
        })
      } else {
        response += `\n\n**הערה:** כרגע אין לך ילדים רשומים בטופס 101, לכן אין זכאות למתנות ילדים.`
      }
    }
    
  } else {
    // Generic helpful response
    response = `שלום ${currentUser.name}! 👋\n\n`
    response += `לא מצאתי מידע ספציפי על "${message}", אבל אני כאן לעזור!\n\n`
    response += `כעובד ${currentUser.employmentType === 'permanent' ? 'קבוע' : 
                currentUser.employmentType === 'temporary' ? 'זמני' : 'שעתי'} ב${currentUser.department}, `
    response += `תוכל לשאול אותי על:\n\n`
    response += `📋 **נהלי משאבי אנוש:** חופשות, מחלות, שעות נוספות\n`
    response += `👨‍👩‍👧‍👦 **טופס 101:** נתוני משפחה וזכויות לפי מצב משפחתי\n`
    response += `🎁 **מתנות ילדים:** זכאויות והטבות לפי גיל הילדים\n`
    response += `💼 **זכויות עובדים:** חופשות, הבראה, ביגוד וכו'\n`
    response += `🏥 **ביטוח ובריאות:** ימי מחלה וביטוח משלים\n\n`
    response += `נסה לשאול בצורה יותר ספציפית, למשל:\n`
    response += `• "מה הזכויות שלי לימי מחלת ילד?"\n`
    response += `• "איך מעדכנים טופס 101?"\n`
    response += `• "מתי אקבל מתנות לילדים?"\n`
  }

  return c.json({
    response,
    userType: currentUser.role,
    timestamp: new Date().toISOString()
  })
})

// API endpoint for getting employee family data  
app.get('/api/employee/:id/family', (c) => {
  const employeeId = c.req.param('id');
  const employee = Object.values(userProfiles).find(emp => emp.id === employeeId);
  
  if (!employee) {
    return c.json({ error: 'עובד לא נמצא' }, 404);
  }
  
  return c.json({
    employee: employee.name,
    familyData: employee.familyData,
    childrenGifts: employee.childrenGifts,
    entitlements: {
      childSickDays: employee.annualEntitlements?.childSickDays || 0,
      giftEligibility: employee.childrenGifts?.eligibleChildren || 0
    }
  });
});

// API endpoint for calculating family-based entitlements
app.get('/api/entitlements/:userType', (c) => {
  const userType = c.req.param('userType');
  const employee = userProfiles[userType];
  
  if (!employee) {
    return c.json({ error: 'עובד לא נמצא' }, 404);
  }
  
  const familyData = employee.familyData;
  const childrenCount = familyData?.numberOfChildren || 0;
  const maritalStatus = familyData?.maritalStatus || 'רווק';
  
  // Calculate family-based entitlements
  const baseChildSickDays = 8;
  const additionalPerChild = childrenCount > 0 ? Math.min(childrenCount * 2, 10) : 0;
  const totalChildSickDays = baseChildSickDays + additionalPerChild;
  
  const giftEntitlement = childrenCount * 600; // 600₪ per child per year (3 holidays)
  
  return c.json({
    employee: employee.name,
    familyStatus: {
      maritalStatus,
      numberOfChildren: childrenCount,
      childrenAges: familyData?.childrenAges || []
    },
    calculatedEntitlements: {
      childSickDays: Math.min(totalChildSickDays, employee.annualEntitlements?.childSickDays || 0),
      annualGiftBudget: giftEntitlement,
      eligibleChildren: employee.childrenGifts?.eligibleChildren || 0,
      familyAllowance: maritalStatus === 'נשוי' || maritalStatus === 'נשואה' ? true : false
    },
    currentUsage: employee.currentYearUsage
  });
});

export default app