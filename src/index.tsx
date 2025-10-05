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
    id: 4,
    category: "כללי",
    question: "מהן שעות הפעילות של מערכות הבנק?",
    answer: "מערכות הליבה פועלות: ראשון-חמישי 06:00-23:00, שישי 06:00-15:00. מערכות משנה זמינות 24/7. בימי חג ייתכנו הפסקות מתוכננות - ראה לוח השירות השבועי.",
    sources: ["לוח שירות IT", "נוהל תפעול מערכות"],
    lastUpdated: "2024-10-08",
    accessLevel: "basic"
  },
  {
    id: 5,
    category: "משאבי אנוש",
    question: "מהן שעות העבודה הרגילות בבנק ישראל?",
    answer: "על פי נוהל שעות עבודה (מס' HR-101.05): **משרדי הנהלה וחטיבות מטה:** ראשון-חמישי 08:00-17:00 (8.5 שעות עם הפסקת צהריים). **סניפים:** ראשון, שלישי, חמישי 08:30-13:15, שני, רביעי 08:30-13:15 + 16:00-19:00. **מוקד טלפוני:** משמרות: 07:00-15:00, 13:00-21:00, 15:00-23:00. **עבודה בשישי:** ערב חג/שישי רגיל עד 13:00. **גמישות:** אפשרות התחלה 07:30-09:00 בתיאום עם המנהל.",
    sources: ["נוהל HR-101.05", "הסכם קיבוצי 2023", "חוזר הנהלה 15/2024"],
    lastUpdated: "2024-09-30",
    accessLevel: "basic"
  },
  {
    id: 6,
    category: "משאבי אנוש",
    question: "איך מגישים בקשה לחופשה שנתית?",
    answer: "תהליך אישור חופשה שנתית (נוהל HR-203.12): **1. הגשת בקשה:** מילוי טופס דיגיטלי במערכת 'עובד בנק' עד 14 יום מראש. **2. אישור ראשוני:** מנהל ישיר מאשר תוך 3 ימי עסקים. **3. אישור HR:** משאבי אנוש בודקים יתרת ימים ומאשרים. **4. הודעה:** הודעה אוטומטית נשלחת 24 שעות לפני החופשה. **זכאויות שנתיות:** עובד חדש: 12 יום, 1-5 שנים: 18 יום, 5+ שנים: 21 יום, 10+ שנים: 24 יום. **מגבלות:** מקסימום 10 ימים רצופים ללא אישור מיוחד.",
    sources: ["נוהל HR-203.12", "מערכת עובד בנק", "זכויות עובדים 2024"],
    lastUpdated: "2024-10-01",
    accessLevel: "basic"
  },
  {
    id: 7,
    category: "משאבי אנוש",
    question: "מה הנוהל לדיווח מחלה?",
    answer: "נוהל דיווח מחלה ומחלת ילד (HR-204.08): **דיווח מיידי:** הודעה טלפונית למנהל ישיר + הודעה במערכת עד 09:30. **מסמכים נדרשים:** אישור רופא ליום אחד ומעלה, אישור רופא ילדים למחלת ילד. **זכאויות:** 18 ימי מחלה לשנה (מצטברים עד 90 יום), 8 ימי מחלת ילד לשנה. **החזר:** 100% מהשכר לימים 1-90, 75% לימים 91-180. **ביקורת רפואית:** מעל 3 ימים רצופים - בדיקת רופא בנק. **חזרה לעבודה:** אישור כושר עבודה מרופא מטפל לאחר מחלה מעל 7 ימים.",
    sources: ["נוהל HR-204.08", "ביטוח לאומי - הוראות", "רופא הבנק"],
    lastUpdated: "2024-09-25",
    accessLevel: "basic"
  },
  {
    id: 8,
    category: "משאבי אנוש",
    question: "איך מבקשים שעות נוספות?",
    answer: "נוהל שעות נוספות ותגמולים (HR-105.20): **אישור מוקדם:** חובה לקבל אישור מנהל ישיר לפני ביצוע. **הגשה:** דיווח במערכת 'ציון שעות' תוך 3 ימי עסקים. **זכאויות לפי דרגה:** דרגות 1-6: תשלום 125% עד 150% לפי יום השבוע. דרגות 7+: פטור משעות נוספות, זכאים להפגה. **מגבלות:** עד 20 שעות חודשיות ללא אישור מיוחד, 40 שעות עם אישור מנכ\"ל. **תשלום:** תוספת לשכר החודש הבא. **חירום:** במצבי חירום - אישור למפרע תוך 24 שעות.",
    sources: ["נוהל HR-105.20", "הסכם קיבוצי סעיף 12", "מערכת ציון שעות"],
    lastUpdated: "2024-10-05",
    accessLevel: "basic"
  },
  {
    id: 9,
    category: "משאבי אנוש",
    question: "מה זכויות החופשת לידה והורות?",
    answer: "זכויות הורות ולידה (HR-210.15): **חופשת לידה:** 15 שבועות לאם (3 לפני + 12 אחרי), 7 ימים לאב. **חופשת הורות:** עד 12 חודשים נוספים ללא תשלום (לחלק בין ההורים). **הודעה מוקדמת:** 30 יום לפני התחלת חופשה. **שכר:** 100% שכר לתקופה המלאה מביטוח לאומי + השלמה מהבנק. **שמירת מקום עבודה:** מובטחת לעד 12 חודשים. **זכויות נוספות:** ימי מחלת ילד נוספים, הנקה במקום העבודה, גמישות שעות. **חזרה הדרגתית:** אפשרות לחזרה הדרגתית במשרה חלקית.",
    sources: ["נוהל HR-210.15", "חוק הגנת השכר", "זכויות הורים 2024"],
    lastUpdated: "2024-09-20",
    accessLevel: "basic"
  },
  {
    id: 10,
    category: "משאבי אנוש",
    question: "איך מגישים תלונה או פנייה למשאבי אנוש?",
    answer: "נוהל טיפול בפניות עובדים (HR-301.10): **דרכי פנייה:** 1. פנייה ישירה למנהל ישיר, 2. מערכת 'שירות עובדים' באינטרא-נט, 3. טלפון חם HR: 02-6552800, 4. פגישה אישית בתיאום. **סוגי פניות:** בעיות משמעת, הטרדות, בעיות שכר, קידום, תנאי עבודה, פגיעה בכבוד. **זמני טיפול:** פניות רגילות - 5 ימי עסקים, דחופות - 24 שעות, הטרדות - טיפול מיידי. **סודיות מובטחת:** כל הפניות מטופלות בדיסקרטיות מלאה. **זכות ערעור:** אפשרות ערעור לוועדת משמעת או מנכ\"ל.",
    sources: ["נוהל HR-301.10", "טלפון חם HR", "ועדת משמעת"],
    lastUpdated: "2024-10-03",
    accessLevel: "basic"
  },
  {
    id: 11,
    category: "מנהלים",
    question: "מה הנוהל לאישור חופשה לעובדים?",
    answer: "נוהל מנהלים - אישור חופשות (MNG-105.30): **עקרונות אישור:** 1. שמירה על רציפות שירות, 2. חלוקה הוגנת לכל העובדים, 3. עדיפות לוותיקים בתאריכי שיא. **בדיקות נדרשות:** יתרת ימים במערכת, כיסוי תפקיד, עומס עבודה צפוי. **מגבלות:** לא יותר מ-30% מהצוות בחופשה יחד, מקסימום 10 ימים רצופים. **עדיפויות:** חגים - לפי ותק, קיץ - סבבים שנתיים, מקרי חירום - ענייני משפחה. **דחיית בקשה:** נדרשת הנמקה בכתב + הצעת תאריך חלופי. **תיעוד:** רישום אישורים ברבעון + דוח שנתי למשאבי אנוש.",
    sources: ["נוהל MNG-105.30", "מערכת ניהול כוח אדם", "דוח חופשות רבעוני"],
    lastUpdated: "2024-09-28",
    accessLevel: "branch"
  },
  {
    id: 12,
    category: "IT ואבטחה",
    question: "מה הנוהל לעבודה מרחוק (Work From Home)?",
    answer: "נוהל עבודה מרחוק (IT-SEC-401.25): **זכאות:** עובדים בדרגה 4+ עם ותק מעל שנה. **תדירות:** עד 2 ימים בשבוع לאחר אישור מנהל. **אישורים נדרשים:** הסכמה דיגיטלית, הכשרת אבטחה, בדיקת תשתיות בית. **ציוד מאושר:** מחשב נייד בנק + VPN חובה, איסור על מחשבים אישיים. **שעות עבודה:** זהות למשרד, זמינות לפגישות ושיחות. **אבטחת מידע:** איסור הדפסה, איסור צילום מסך, נעילה אוטומטית אחרי 10 דק'. **ביקורת:** מעקב גישות למערכות + פגישת סטטוס שבועית. **ביטול הרשאה:** במקרה של הפרת נוהל או ירידה בביצועים.",
    sources: ["נוהל IT-SEC-401.25", "מדיניות אבטחת מידע", "הסכם עבודה מרחוק"],
    lastUpdated: "2024-10-12",
    accessLevel: "tech"
  }
];

// User profiles simulation
const userProfiles = {
  "call_center": {
    name: "רחל כהן",
    role: "נציגת מוקד טלפוני",
    department: "שירות לקוחות",
    accessLevel: "basic",
    avatar: "ר.כ",
    permissions: ["basic", "customer_service"]
  },
  "branch": {
    name: "דוד לוי",
    role: "מנהל סניף",
    department: "סניף תל אביב",
    accessLevel: "branch",
    avatar: "ד.ל",
    permissions: ["basic", "branch", "credit"]
  },
  "tech": {
    name: "שרה גולדמן",
    role: "מפתחת תוכנה",
    department: "חטיבת טכנולוגיות",
    accessLevel: "tech",
    avatar: "ש.ג",
    permissions: ["basic", "tech", "systems"]
  }
};

// Main chatbot page
app.get('/', (c) => {
  const userType = c.req.query('user') || 'call_center';
  const currentUser = userProfiles[userType] || userProfiles.call_center;
  
  return c.render(
    <div class="chat-container">
      {/* Chat Header */}
      <div class="chat-header">
        <div class="logo">
          <i class="fas fa-university"></i>
        </div>
        <div class="title">
          <h1>צ'אטבוט בנק ישראל</h1>
          <p>עוזר הידע הפנים-ארגוני החכם</p>
        </div>
        <div class="user-info">
          <div class="user-badge">
            <div class="status-indicator"></div>
            <span>{currentUser.name}</span>
            <span class="text-xs">({currentUser.role})</span>
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
              אני עוזר הידע הפנים-ארגוני של בנק ישראל. אני כאן כדי לעזור לך למצוא מידע מקצועי מאושר ומעודכן.<br/>
              <strong>איך אני יכול לעזור לך היום?</strong>
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
        </div>
      </div>

      {/* Chat Input */}
      <div class="chat-input">
        <div class="input-container">
          <div class="input-wrapper">
            <textarea 
              id="chat-input"
              class="chat-textarea"
              placeholder="שאל אותי כל שאלה מקצועית..."
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
  )
})

// API endpoint for chat
app.post('/api/chat', async (c) => {
  try {
    const { message, userType = 'call_center' } = await c.req.json()
    const currentUser = userProfiles[userType] || userProfiles.call_center;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Enhanced keyword matching for demo
    const lowerMessage = message.toLowerCase();
    let matchedKnowledge = null;
    
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
    if (matchedKnowledge) {
      // Check access permissions
      const hasAccess = currentUser.permissions.includes(matchedKnowledge.accessLevel);
      
      if (hasAccess) {
        response = {
          text: matchedKnowledge.answer,
          sources: matchedKnowledge.sources,
          lastUpdated: matchedKnowledge.lastUpdated,
          confidence: 0.95
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

// User switching endpoint
app.get('/switch/:userType', (c) => {
  const userType = c.req.param('userType');
  return c.redirect(`/?user=${userType}`);
})

// SSO Simulation page
app.get('/login', (c) => {
  return c.render(
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--boi-navy), var(--boi-blue));">
      <div class="card" style="max-width: 500px; width: 100%; margin: 2rem;">
        <div class="card-header" style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-university"></i>
          </div>
          <h1 style="margin: 0; font-size: 1.5rem; color: white;">בנק ישראל</h1>
          <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9);">מערכת זיהוי פנים-ארגוני</p>
        </div>
        <div class="card-body" style="text-align: center;">
          <h2 style="color: var(--boi-navy); margin-bottom: 1.5rem;">בחר את פרופיל המשתמש</h2>
          <p style="color: var(--boi-gray-600); margin-bottom: 2rem;">
            לצורכי הדמו, בחר את סוג המשתמש שברצונך לדמות:
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <a href="/?user=call_center" class="btn btn-primary" style="text-decoration: none; padding: 1.25rem;">
              <i class="fas fa-headset"></i>
              רחל כהן - נציגת מוקד טלפוני
              <small style="display: block; opacity: 0.8; font-weight: normal;">גישה למידע בסיסי ונהלי שירות לקוחות</small>
            </a>
            
            <a href="/?user=branch" class="btn btn-primary" style="text-decoration: none; padding: 1.25rem;">
              <i class="fas fa-building"></i>
              דוד לוי - מנהל סניף
              <small style="display: block; opacity: 0.8; font-weight: normal;">גישה למידע מתקדם ומדיניות אשראי</small>
            </a>
            
            <a href="/?user=tech" class="btn btn-primary" style="text-decoration: none; padding: 1.25rem;">
              <i class="fas fa-code"></i>
              שרה גולדמן - מפתחת תוכנה
              <small style="display: block; opacity: 0.8; font-weight: normal;">גישה למידע טכני ומערכות פנימיות</small>
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
