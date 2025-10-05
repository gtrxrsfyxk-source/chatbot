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
          <div class="quick-action" onclick="sendQuickMessage('מה שעות הפעילות של מערכות הבנק?')">
            <i class="fas fa-clock"></i> שעות פעילות מערכות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('נהלי שירות לקוחות')">
            <i class="fas fa-users"></i> נהלי שירות לקוחות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מדיניות אשראי')">
            <i class="fas fa-credit-card"></i> מדיניות אשראי
          </div>
          <div class="quick-action" onclick="sendQuickMessage('בקשות IT')">
            <i class="fas fa-laptop"></i> בקשות טכנולוגיות
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
    
    // Simple keyword matching for demo
    const lowerMessage = message.toLowerCase();
    let matchedKnowledge = null;
    
    // Find relevant knowledge
    for (const kb of knowledgeBase) {
      const keywords = kb.question.toLowerCase();
      if (keywords.includes('עמלה') && lowerMessage.includes('עמלה')) {
        matchedKnowledge = kb;
        break;
      } else if (keywords.includes('הלוואה') && lowerMessage.includes('הלוואה')) {
        matchedKnowledge = kb;
        break;
      } else if (keywords.includes('גישה') && lowerMessage.includes('גישה')) {
        matchedKnowledge = kb;
        break;
      } else if (keywords.includes('שעות') && lowerMessage.includes('שעות')) {
        matchedKnowledge = kb;
        break;
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
