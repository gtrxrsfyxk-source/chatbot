# מבני הנתונים - צ'אטבוט בנק דיסקונט

## 📊 **סקירת מבני הנתונים**

הצ'אטבוט מסתמך על נתונים מקומיים המדמים מערכות HR וניהול עובדים אמיתיות.

---

## 👥 **פרופילי עובדים (userProfiles)**

### 🎧 **רחל כהן - נציגת מוקד טלפוני (call_center)**

```javascript
{
  name: "רחל כהן",
  role: "נציגת מוקד טלפוני",
  accessLevel: "basic",
  avatar: "ר.כ",
  
  // 📅 יתרת ימי חופשה
  vacation: {
    annualEntitlement: 18,    // זכאות שנתית: 18 ימים
    used: 8,                  // ניצלה עד כה: 8 ימים  
    remaining: 10,            // נותר: 10 ימים
    details: [
      { date: "2024-03-15", days: 3, type: "חופשה קצרה" },
      { date: "2024-07-20", days: 5, type: "חופשה קיצית" }
    ]
  },
  
  // 🎁 זכאות מתנות לילדים
  childrenGifts: {
    numberOfChildren: 2,      // יש לה 2 ילדים
    childrenAges: [5, 8],     // גילאים: 5 ו-8
    eligibleChildren: 2,      // שני ילדים זכאים (עד גיל 18)
    giftStatus: {
      "ראש השנה 2024": "נמסר ✅",
      "חנוכה 2024": "ממתין להגעה ⏳", 
      "פורים 2025": "טרם הוזמן"
    }
  },
  
  // 🕐 משמרות השבוע
  shifts: {
    thisWeek: [
      { day: "ראשון", hours: "07:00-15:00", type: "בוקר" },
      { day: "שני", hours: "13:00-21:00", type: "אחר צהריים" },
      { day: "שלישי", hours: "07:00-15:00", type: "בוקר" },
      { day: "רביעי", hours: "OFF", type: "יום חופש" },
      { day: "חמישי", hours: "15:00-23:00", type: "ערב" }
    ],
    totalHours: 32            // סה"כ שעות השבוע
  }
}
```

---

### 🏢 **דוד לוי - מנהל סניף (branch)**

```javascript
{
  name: "דוד לוי",
  role: "מנהל סניף", 
  accessLevel: "branch",
  avatar: "ד.ל",
  
  // 📅 יתרת ימי חופשה  
  vacation: {
    annualEntitlement: 25,    // זכאות גבוהה כמנהל ותיק: 25 ימים
    used: 15,                 // ניצל עד כה: 15 ימים
    remaining: 10,            // נותר: 10 ימים
    details: [
      { date: "2024-02-10", days: 7, type: "חופשה חורפית" },
      { date: "2024-08-05", days: 8, type: "חופשה קיצית" }
    ]
  },
  
  // 🎁 זכאות מתנות לילדים
  childrenGifts: {
    numberOfChildren: 3,      // יש לו 3 ילדים
    childrenAges: [12, 16, 20], // גילאים: 12, 16, 20
    eligibleChildren: 2,      // רק 2 זכאים (עד גיל 18) 
    giftStatus: {
      "ראש השנה 2024": "נמסר ✅",
      "חנוכה 2024": "נמסר ✅",
      "פורים 2025": "הוזמן, ממתין לאישור"
    }
  },
  
  // 🕐 משמרות השבוע (מנהל - שעות קבועות)
  shifts: {
    thisWeek: [
      { day: "ראשון", hours: "08:00-17:00", type: "ניהול" },
      { day: "שני", hours: "08:00-17:00", type: "ניהול" },
      { day: "שלישי", hours: "08:00-17:00", type: "ניהול" }, 
      { day: "רביעי", hours: "08:00-17:00", type: "ניהול" },
      { day: "חמישי", hours: "08:00-16:00", type: "ניהול קצר" }
    ],
    totalHours: 44            // שעות מלאות
  }
}
```

---

### 💻 **שרה גולדמן - מפתחת תוכנה (tech)**

```javascript
{
  name: "שרה גולדמן",
  role: "מפתחת תוכנה",
  accessLevel: "tech", 
  avatar: "ש.ג",
  
  // 📅 יתרת ימי חופשה
  vacation: {
    annualEntitlement: 22,    // זכאות בטכנולוגיה: 22 ימים
    used: 12,                 // ניצלה עד כה: 12 ימים
    remaining: 10,            // נותר: 10 ימים  
    details: [
      { date: "2024-01-20", days: 5, type: "חופשה טכנולוגית" },
      { date: "2024-06-15", days: 7, type: "חופשה קיצית" }
    ]
  },
  
  // 🎁 זכאות מתנות לילדים
  childrenGifts: {
    numberOfChildren: 1,      // יש לה ילד אחד
    childrenAges: [3],        // גיל: 3
    eligibleChildren: 1,      // זכאי למתנות
    giftStatus: {
      "ראש השנה 2024": "נמסר ✅", 
      "חנוכה 2024": "נמסר ✅",
      "פורים 2025": "הוזמן"
    }
  },
  
  // 🕐 משמרות השבוע (גמישות בטכנולוגיה)  
  shifts: {
    thisWeek: [
      { day: "ראשון", hours: "09:00-18:00", type: "פיתוח" },
      { day: "שני", hours: "10:00-19:00", type: "פיתוח מאוחר" },
      { day: "שלישי", hours: "עבודה מהבית", type: "remote" },
      { day: "רביעי", hours: "09:00-18:00", type: "פיתוח" },
      { day: "חמישי", hours: "09:00-15:00", type: "יום קצר" }
    ],
    totalHours: 40            // שעות תקן
  }
}
```

---

## 📚 **מאגר הידע הכללי (knowledgeBase)**

```javascript
[
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
```

---

## 🎯 **איך הנתונים משמשים בתגובות**

### **שאלות אישיות (עם "שלי"):**
- **"כמה ימי חופשה נשארו לי?"** ← משתמש ב-`currentUser.vacation`
- **"מה סטטוס מתנות הילדים שלי?"** ← משתמש ב-`currentUser.childrenGifts`  
- **"מה המשמרות שלי השבוע?"** ← משתמש ב-`currentUser.shifts`

### **שאלות כלליות:**
- **"נוהל חופשות"** ← משתמש ב-`knowledgeBase[0]` (topic: "vacation")
- **"נוהל מתנות"** ← משתמש ב-`knowledgeBase[1]` (topic: "gifts")
- **"נוהל משמרות"** ← משתמש ב-`knowledgeBase[2]` (topic: "shifts")

---

## ⚙️ **לוגיקת זיהוי שאלות**

```javascript
// בדיקה אם זו שאלה אישית
if (lowerMessage.includes('שלי') || lowerMessage.includes('נשאר') || lowerMessage.includes('כמה')) {
  
  // זיהוי נושא
  if (lowerMessage.includes('חופשה') || lowerMessage.includes('ימי חופש')) {
    // החזרת תשובה אישית מ-currentUser.vacation
  }
  else if (lowerMessage.includes('מתנות') || lowerMessage.includes('ילדים')) {
    // החזרת תשובה אישית מ-currentUser.childrenGifts  
  }
  else if (lowerMessage.includes('משמרות') || lowerMessage.includes('השבוע')) {
    // החזרת תשובה אישית מ-currentUser.shifts
  }
}
```

---

## 🔧 **כיצד להוסיף עובד חדש**

```javascript
// הוסף לuserProfiles:
newEmployee: {
  name: "שם העובד",
  role: "התפקיד", 
  accessLevel: "basic|branch|tech",
  avatar: "ראשי תיבות",
  
  vacation: { /* נתוני חופשה */ },
  childrenGifts: { /* נתוני מתנות */ },
  shifts: { /* נתוני משמרות */ }
}
```

---

**💡 הנתונים מאורגנים היטב ומאפשרים הרחבה קלה של המערכת עם עובדים נוספים או שדות מידע חדשים.**