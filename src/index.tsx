import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))
app.use(renderer)

// Focused knowledge base - 3 main topics
const knowledgeBase = [
  {
    id: 1,
    topic: "vacation",
    question: "יתרת ימי חופשה",
    answer: "על פי נוהל חופשות HR-205: זכאות שנתית נקבעת לפי ותק וסוג העסקה. ניתן לבדוק יתרה אישית במערכת HR או לשאול שאלה אישית.",
    sources: ["נוהל חופשות HR-205"]
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
  }
]

// Enhanced user profiles with personal data
const userProfiles = {
  call_center: {
    name: "רחל כהן",
    role: "נציגת מוקד טלפוני",
    accessLevel: "basic",
    avatar: "ר.כ",
    
    // יתרת ימי חופשה
    vacation: {
      annualEntitlement: 18, // זכאות שנתית
      used: 8,              // ניצלה עד כה
      remaining: 10,        // נותר
      details: [
        { date: "2024-03-15", days: 3, type: "חופשה קצרה" },
        { date: "2024-07-20", days: 5, type: "חופשה קיצית" }
      ]
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
    }
  },
  
  branch: {
    name: "דוד לוי", 
    role: "מנהל סניף",
    accessLevel: "branch",
    avatar: "ד.ל",
    
    // יתרת ימי חופשה
    vacation: {
      annualEntitlement: 25, // זכאות גבוהה כמנהל ותיק
      used: 15,
      remaining: 10,
      details: [
        { date: "2024-02-10", days: 7, type: "חופשה חורפית" },
        { date: "2024-08-05", days: 8, type: "חופשה קיצית" }
      ]
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
    }
  },
  
  tech: {
    name: "שרה גולדמן",
    role: "מפתחת תוכנה",
    accessLevel: "tech",
    avatar: "ש.ג",
    
    // יתרת ימי חופשה
    vacation: {
      annualEntitlement: 22, // זכאות בטכנולוגיה
      used: 12,
      remaining: 10,
      details: [
        { date: "2024-01-20", days: 5, type: "חופשה טכנולוגית" },
        { date: "2024-06-15", days: 7, type: "חופשה קיצית" }
      ]
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
          <div class="quick-action" onclick="sendQuickMessage('יתרת ימי חופשה')">
            <i class="fas fa-info-circle"></i> נוהל חופשות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('מתנות לילדים')">
            <i class="fas fa-baby"></i> נוהל מתנות
          </div>
          <div class="quick-action" onclick="sendQuickMessage('משמרות')">
            <i class="fas fa-calendar-week"></i> נוהל משמרות
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
              📅 חופשה: 10/18 ימים • 🎁 ילדים: 2 (גיל 5,8) • 📊 שעות השבוע: 32
            </div>
          </a>
          <a href="/?user=branch" style="display: block; padding: 1.5rem; background: #059669; color: white; text-decoration: none; border-radius: 0.5rem; text-align: right;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              <i class="fas fa-building"></i> דוד לוי - מנהל סניף
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
              📅 חופשה: 10/25 ימים • 🎁 ילדים: 2 זכאים מתוך 3 • 📊 שעות השבוע: 44
            </div>
          </a>
          <a href="/?user=tech" style="display: block; padding: 1.5rem; background: #7c3aed; color: white; text-decoration: none; border-radius: 0.5rem; text-align: right;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              <i class="fas fa-code"></i> שרה גולדמן - מפתחת תוכנה
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
              📅 חופשה: 10/22 ימים • 🎁 ילדים: 1 (גיל 3) • 📊 שעות השבוע: 40
            </div>
          </a>
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; border: 2px solid #e5e7eb;">
          <h4 style="color: #1e3a8a; margin: 0 0 0.5rem 0;">💡 טיפים לדמו:</h4>
          <ul style="margin: 0; padding-right: 1rem; font-size: 0.875rem; color: #374151;">
            <li>כל עובד רואה נתונים אישיים שונים</li>
            <li>נסה שאלות אישיות: "כמה חופשה נשארה לי?"</li>
            <li>או שאלות כלליות: "נוהל חופשות"</li>
          </ul>
        </div>
      </div>
    </div>
  )
})

// Chat API with personalized responses
app.post('/api/chat', async (c) => {
  try {
    const { message, userType } = await c.req.json()
    const currentUser = userProfiles[userType] || userProfiles.call_center
    
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
      
      // Personal vacation balance
      if (lowerMessage.includes('חופשה') || lowerMessage.includes('ימי חופש')) {
        const vacation = currentUser.vacation
        response = {
          text: `**📅 יתרת ימי החופשה שלך, ${currentUser.name}:**\n\n` +
                `🎯 **זכאות שנתית:** ${vacation.annualEntitlement} ימים\n` +
                `✅ **ניצלת עד כה:** ${vacation.used} ימים\n` +
                `🆓 **נותר לך:** **${vacation.remaining} ימים**\n\n` +
                `**📋 חופשות שלקחת השנה:**\n` +
                vacation.details.map(d => `• ${d.date} - ${d.days} ימים (${d.type})`).join('\n') +
                `\n\n💡 **טיפ:** תוכל לקחת חופשה נוספת עד סוף השנה!`,
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
    }

    // General knowledge base search if no personal answer
    if (!response) {
      for (const item of knowledgeBase) {
        if ((lowerMessage.includes('חופשה') && item.topic === 'vacation') ||
            (lowerMessage.includes('מתנות') && item.topic === 'gifts') ||
            (lowerMessage.includes('משמרות') && item.topic === 'shifts')) {
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