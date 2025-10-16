const employeeDatabase = {
  "call_center": {
    // פרטים אישיים - רחל כהן
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
    hireDate: "2024-02-01",
    
    // נתוני משפחה (טופס 101) - נשואה עם 2 ילדים קטנים
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 2,
      childrenAges: [5, 8],
      spouseDetails: { name: "יוסי כהן", birthYear: 1988, occupation: "חשמלאי" },
      lastUpdated: "2024-01-15",
      
      // פרטים נוספים רלוונטיים לזכויות
      additionalInfo: {
        marriageDate: "2015-06-20",
        emergencyContact: "יוסי כהן - בעל"
      }
    },
    
    // זכאויות שנתיות לפי ותק וסוג העסקה
    annualEntitlements: {
      vacation: 12, // ימי חופשה - עובד חדש
      recovery: 0,  // אין זכאות להבראה לשעתי
      clothing: 800, // ביגוד מופחת לשעתי
      gifts: 300,   // מתנות לחגים מופחתות
      sickDays: 12, // ימי מחלה מופחתים לשעתי
      childSickDays: 10 // ימי מחלת ילד מוגברים - 2 ילדים קטנים
    },
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: {
        used: 5,
        dates: [
          { startDate: "2024-03-15", endDate: "2024-03-17", days: 3, type: "חופשה שנתית" },
          { startDate: "2024-07-22", endDate: "2024-07-23", days: 2, type: "חופש קיץ" }
        ]
      },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 4,
        dates: [
          { date: "2024-04-10", type: "מחלה עצמית" },
          { date: "2024-05-22", type: "מחלה עצמית" },
          { date: "2024-07-08", type: "מחלה עצמית" },
          { date: "2024-09-14", type: "מחלה עצמית" }
        ]
      },
      childSickDays: {
        used: 6,
        dates: [
          { date: "2024-02-20", childAge: 5, type: "מחלת ילד - שפעת" },
          { date: "2024-04-15", childAge: 8, type: "מחלת ילד - בטן" },
          { date: "2024-06-03", childAge: 5, type: "מחלת ילד - חום" },
          { date: "2024-07-18", childAge: 8, type: "מחלת ילד - אוזניים" },
          { date: "2024-08-25", childAge: 5, type: "מחלת ילד - כאב בטן" },
          { date: "2024-09-30", childAge: 8, type: "מחלת ילד - דלקת גרון" }
        ]
      }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 8, // ימי מחלה מצטברים
      vacation: 0  // חופשה לא מועברת לשעתי
    },
    
    // זכאות מתנות לילדים - 2 ילדים קטנים
    childrenGifts: {
      eligibleChildren: 2,
      giftStatus2024: {
        "ראש השנה": "נמסר", // 2 מתנות + 400₪
        "חנוכה": "ממתין",   // טרם הגיע
        "פסח": "נמסר"       // 2 מתנות + 400₪
      },
      // פירוט לפי ילד
      childrenDetails: [
        { age: 5, giftType: "מתנה + 200₪" },   // עד 12
        { age: 8, giftType: "מתנה + 200₪" }    // עד 12
      ]
    },
    
    // נתוני עבודה - עובד שעתי ללא משמרות
    workData: {
      monthlyHours: 140, // שעות חודשיות ממוצעות (משרה חלקית)
      overtimeThisMonth: 8,
      overtimeDetails: [
        { date: "2024-09-25", hours: 2, approvedBy: "מנהל מוקד", rate: 125 },
        { date: "2024-10-02", hours: 3, approvedBy: "מנהל מוקד", rate: 150 },
        { date: "2024-10-08", hours: 3, approvedBy: "מנהל מוקד", rate: 125 }
      ],
      managementCompensation: false
  },

  "call_center_temp": {
    // פרטים אישיים - אור ישראלי
    id: "987654321",
    name: "אור ישראלי",
    role: "נציג מוקד זמני",
    department: "מוקד טלפוני",
    accessLevel: "basic",
    avatar: "א.י",
    permissions: ["basic"],
    employmentType: "temporary", // זמני
    seniority: 3, // חודשים
    grade: 2,
    hireDate: "2024-07-01",
    
    // נתוני משפחה (טופס 101) - עובד צעיר רווק
    familyData: {
      maritalStatus: "רווק",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2024-07-15",
      
      // פרטים נוספים לעובד צעיר
      additionalInfo: {
        emergencyContact: "אמא - דליה ישראלי",
        livingArrangement: "דירת שותפים"
      }
    },
    
    // זכאויות שנתיות מוגבלות לעובד זמני
    annualEntitlements: {
      vacation: 0, // אין זכאות לחופשה בחודשים הראשונים
      recovery: 0,  // אין זכאות להבראה
      clothing: 400, // ביגוד בסיסי
      gifts: 100,   // מתנות מופחתות
      sickDays: 6, // ימי מחלה מוגבלים
      childSickDays: 0 // אין ילדים
    },
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: { used: 0, dates: [] },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 1,
        dates: [
          { date: "2024-08-15", type: "מחלה עצמית - קדחת" }
        ]
      },
      childSickDays: { used: 0, dates: [] }
    },
    
    // יתרות צבורות - עובד חדש
    accumulatedBalance: {
      sickDays: 0,
      vacation: 0
    },
    
    // זכאות מתנות לילדים - אין ילדים
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2024: {}
    },
    
    // נתוני עבודה - עובד זמני עם משמרות
    workData: {
      monthlyHours: 120, // משרה חלקית
      overtimeThisMonth: 8,
      overtimeDetails: [
        { date: "2024-09-20", hours: 4, approvedBy: "מנהל משמרת", rate: 125 },
        { date: "2024-09-25", hours: 4, approvedBy: "מנהל משמרת", rate: 125 }
      ],
      managementCompensation: false
    },
    
    // מערכת משמרות עובד זמני - מוקד טלפוני
    shiftsData: {
      isShiftWorker: true,
      shiftType: "מוקד טלפוני זמני",
      
      // משמרות ספטמבר 2024 (חודש אחורה) - עובד חדש התחיל באמצע החודש
      september2024: [
        // עדיין לא התחיל לעבוד
        { date: "2024-09-15", day: "ראשון", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2024-09-16", day: "שני", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2024-09-17", day: "שלישי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2024-09-18", day: "רביעי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2024-09-19", day: "חמישי", shift: "הכשרה", startTime: "08:00", endTime: "16:00", hours: 8, status: "הכשרה" },
        { date: "2024-09-20", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-09-21", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        
        // השבוע הראשון בעבודה עצמאית  
        { date: "2024-09-22", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-09-23", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-09-24", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-09-25", day: "רביעי", shift: "כיפור", startTime: "", endTime: "", hours: 0, status: "חג" },
        { date: "2024-09-26", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-09-27", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-09-28", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-09-29", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-09-30", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" }
      ],
      
      // משמרות אוקטובר 2024 (חודש נוכחי)
      october2024: [
        { date: "2024-10-01", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-10-02", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-10-03", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "הושלם" },
        { date: "2024-10-04", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-10-05", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-10-06", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "נוכחי" },
        { date: "2024-10-07", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-08", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-09", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-10", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-11", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-10-12", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-10-13", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-14", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-15", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-16", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-17", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-18", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-10-19", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-10-20", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-21", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-22", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-23", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-24", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-25", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-10-26", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-10-27", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-28", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-29", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-30", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-10-31", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" }
      ],

      // משמרות נובמבר 2024 (חודש קדימה)
      november2024: [
        { date: "2024-11-01", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-02", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-03", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-04", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-05", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-06", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-07", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-08", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-09", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-11-10", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-11", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-12", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-13", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-14", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-15", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-16", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-11-17", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-18", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-19", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-20", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-21", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-22", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-23", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },

        { date: "2024-11-24", day: "ראשון", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-25", day: "שני", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-26", day: "שלישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-27", day: "רביעי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-28", day: "חמישי", shift: "בוקר", startTime: "08:00", endTime: "16:00", hours: 8, status: "מתוכנן" },
        { date: "2024-11-29", day: "שישי", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" },
        { date: "2024-11-30", day: "שבת", shift: "חופש", startTime: "", endTime: "", hours: 0, status: "חופש שבועי" }
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
    }
  },

  "call_center_permanent": {
    // פרטים אישיים - מיכל אברהם
    id: "456789123",
    name: "מיכל אברהם",
    role: "נציגת מוקד בכירה",
    department: "מוקד טלפוני ומענה ללקוחות VIP",
    accessLevel: "basic",
    avatar: "מ.א",
    permissions: ["basic", "vip_customers", "supervision"],
    employmentType: "permanent", // קבוע
    seniority: 36, // חודשים (3 שנים)
    grade: 5,
    hireDate: "2021-10-01",
    
    // נתוני משפחה (טופס 101) - אם לשני ילדים קטנים
    familyData: {
      maritalStatus: "נשואה",
      numberOfChildren: 2,
      childrenAges: [3, 6], // ילדים צעירים
      spouseDetails: { name: "רונן אברהם", birthYear: 1985, occupation: "מהנדס תוכנה" },
      lastUpdated: "2024-01-20",
      
      // פרטים נוספים לאם עובדת
      additionalInfo: {
        marriageDate: "2017-05-15",
        emergencyContact: "רונן אברהם - בעל",
        kindergartenArrangements: "גן ליד הבית ומטפלת פרטית"
      }
    },
    
    // זכאויות שנתיות מלאות לעובד קבוע
    annualEntitlements: {
      vacation: 18, // ימי חופשה - 1-5 שנים
      recovery: 7,  // זכאות להבראה מלאה
      clothing: 1200, // ביגוד מוקד מקצועי
      gifts: 500,   // מתנות חג מלאות
      sickDays: 18, // ימי מחלה מלאים
      childSickDays: 12 // ימי מחלת ילד מוגברים - 2 ילדים קטנים
    },
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: {
        used: 14,
        dates: [
          { startDate: "2024-02-12", endDate: "2024-02-16", days: 5, type: "חופשה שנתית" },
          { startDate: "2024-06-10", endDate: "2024-06-14", days: 5, type: "חופשה שנתית" },
          { startDate: "2024-08-05", endDate: "2024-08-08", days: 4, type: "חופשה שנתית - חופש קיץ" }
        ]
      },
      recovery: {
        used: 7,
        dates: [
          { startDate: "2024-09-16", endDate: "2024-09-22", days: 7, type: "הבראה" }
        ]
      },
      sickDays: {
        used: 5,
        dates: [
          { date: "2024-01-22", type: "מחלה עצמית" },
          { date: "2024-03-14", type: "מחלה עצמית" },
          { date: "2024-06-18", type: "מחלה עצמית - דלקת גרון" },
          { date: "2024-07-30", type: "מחלה עצמית" },
          { date: "2024-09-05", type: "מחלה עצמית - כאב ראש" }
        ]
      },
      childSickDays: {
        used: 8,
        dates: [
          { date: "2024-02-05", childAge: 3, type: "מחלת ילד - שפעת" },
          { date: "2024-03-20", childAge: 6, type: "מחלת ילד - בטן" },
          { date: "2024-04-15", childAge: 3, type: "מחלת ילד - חום גבוה" },
          { date: "2024-05-08", childAge: 6, type: "מחלת ילד - אוזניים" },
          { date: "2024-07-12", childAge: 3, type: "מחלת ילד - כאב בטן" },
          { date: "2024-08-25", childAge: 6, type: "מחלת ילד - דלקת גרון" },
          { date: "2024-09-10", childAge: 3, type: "מחלת ילד - נזלת" },
          { date: "2024-09-28", childAge: 6, type: "מחלת ילד - כאב ראש" }
        ]
      }
    },
    
    // יתרות צבורות
    accumulatedBalance: {
      sickDays: 28, // ימי מחלה מצטברים
      vacation: 6   // חופשה מועברת
    },
    
    // זכאות מתנות לילדים - 2 ילדים צעירים
    childrenGifts: {
      eligibleChildren: 2,
      giftStatus2024: {
        "ראש השנה": "נמסר", // 2 מתנות + 400₪
        "חנוכה": "ממתין",   // טרם הגיע
        "פסח": "נמסר"       // 2 מתנות + 400₪
      },
      // פירוט לפי ילד
      childrenDetails: [
        { age: 3, giftType: "מתנה + 200₪" },   // עד 12
        { age: 6, giftType: "מתנה + 200₪" }    // עד 12
      ]
    },
    
    // נתוני עבודה - עובד קבוע ללא משמרות
    workData: {
      monthlyHours: 170, // מעט יותר בגלל פגישות VIP
      overtimeThisMonth: 12,
      overtimeDetails: [
        { date: "2024-09-18", hours: 4, approvedBy: "מנהל מוקד", rate: 150 },
        { date: "2024-09-22", hours: 4, approvedBy: "מנהל מוקד", rate: 150 },
        { date: "2024-09-26", hours: 4, approvedBy: "מנהל מוקד", rate: 125 }
      ],
      managementCompensation: false
    }
  },

  "branch_temp": {
    // פרטים אישיים - נועה כהן
    id: "321654987",
    name: "נועה כהן",
    role: "פקידת סניף זמנית",
    department: "סניף תל אביב מרכז",
    accessLevel: "basic",
    avatar: "נ.כ",
    permissions: ["basic"],
    employmentType: "temporary", // זמני
    seniority: 6, // חודשים
    grade: 3,
    hireDate: "2024-04-01",
    
    // נתוני משפחה (טופס 101) - גרושה עם ילד אחד
    familyData: {
      maritalStatus: "גרושה",
      numberOfChildren: 1,
      childrenAges: [12], // ילד בגיל בר מצווה
      spouseDetails: null, // גרושה
      lastUpdated: "2024-04-10",
      
      // פרטים נוספים רלוונטיים למצב משפחתי
      additionalInfo: {
        custodyArrangement: "משמורת בלעדית",
        singleParentBenefits: true,
        emergencyContact: "סבתא - רחל כהן",
        divorceDate: "2020-03-15"
      }
    },
    
    // זכאויות מוגבלות לעובד זמני
    annualEntitlements: {
      vacation: 6, // זכאות מוגבלת לעובד זמני אחרי 6 חודשים
      recovery: 0,  // אין זכאות להבראה
      clothing: 600, // ביגוד סניף
      gifts: 200,   // מתנות מופחתות
      sickDays: 12, // ימי מחלה בסיסיים
      childSickDays: 8 // ימי מחלת ילד - הורה יחיד
    },
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: {
        used: 3,
        dates: [
          { startDate: "2024-07-15", endDate: "2024-07-17", days: 3, type: "חופשה שנתית - חופש בית ספר" }
        ]
      },
      recovery: { used: 0, dates: [] },
      sickDays: {
        used: 4,
        dates: [
          { date: "2024-05-12", type: "מחלה עצמית - דלקת גרון" },
          { date: "2024-06-25", type: "מחלה עצמית - כאב ראש" },
          { date: "2024-08-08", type: "מחלה עצמית - בטן" },
          { date: "2024-09-18", type: "מחלה עצמית - חום" }
        ]
      },
      childSickDays: {
        used: 3,
        dates: [
          { date: "2024-05-20", childAge: 12, type: "מחלת ילד - שפעת" },
          { date: "2024-07-08", childAge: 12, type: "מחלת ילד - כאב בטן" },
          { date: "2024-09-12", childAge: 12, type: "מחלת ילד - כאב ראש" }
        ]
      }
    },
    
    // יתרות צבורות - עובד חדש יחסית
    accumulatedBalance: {
      sickDays: 2,
      vacation: 0
    },
    
    // זכאות מתנות לילדים - ילד אחד בגיל 12
    childrenGifts: {
      eligibleChildren: 1,
      giftStatus2024: {
        "ראש השנה": "נמסר", // מתנה + 200₪
        "חנוכה": "ממתין",   // טרם הגיע
        "פסח": "נמסר"       // מתנה + 200₪
      },
      // פירוט לפי ילד
      childrenDetails: [
        { age: 12, giftType: "מתנה + 200₪" }   // עד 12
      ]
    },
    
    // נתוני עבודה - עובד סניף ללא משמרות
    workData: {
      monthlyHours: 155, // משרה קרובה למלאה
      overtimeThisMonth: 6,
      overtimeDetails: [
        { date: "2024-09-15", hours: 3, approvedBy: "מנהל סניף", rate: 125 },
        { date: "2024-09-28", hours: 3, approvedBy: "מנהל סניף", rate: 125 }
      ],
      managementCompensation: false
    }
  },

  "branch": {
    // פרטים אישיים - דוד לוי
    id: "789123456",
    name: "דוד לוי",
    role: "מנהל סניף",
    department: "סניף חיפה מרכז",
    accessLevel: "branch",
    avatar: "ד.ל",
    permissions: ["basic", "branch", "management", "loans", "approvals"],
    employmentType: "permanent", // קבוע
    seniority: 84, // חודשים (7 שנים)
    grade: 9,
    hireDate: "2017-10-01",
    
    // נתוני משפחה (טופס 101) - נשוי + 3 ילדים
    familyData: {
      maritalStatus: "נשוי",
      numberOfChildren: 3,
      childrenAges: [8, 14, 17], // ילדים בגילאים שונים
      spouseDetails: { name: "מירית לוי", birthYear: 1982, occupation: "רוקחת" },
      lastUpdated: "2024-01-25",
      
      // פרטים נוספים למנהל בכיר
      additionalInfo: {
        marriageDate: "2005-09-12",
        familyEvents: ["בר מצווה בנובמבר 2024 לבן הבכור"],
        spouseEmployment: "מועסקת במשרה מלאה - בית מרקחת שיכמן",
        emergencyContact: "מירית לוי - רעיה"
      }
    },
    
    // זכאויות מלאות למנהל ותיק
    annualEntitlements: {
      vacation: 24, // ימי חופשה מקסימליים - מעל 5 שנים
      recovery: 10,  // זכאות הבראה מוגברת למנהל
      clothing: 2500, // ביגוד ניהולי מקצועי
      gifts: 800,   // מתנות חג מלאות + בונוס ניהולי
      sickDays: 18, // ימי מחלה מלאים
      childSickDays: 15 // ימי מחלת ילד מוגברים - 3 ילדים
    },
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: {
        used: 18,
        dates: [
          { startDate: "2024-01-08", endDate: "2024-01-12", days: 5, type: "חופשה שנתית" },
          { startDate: "2024-04-22", endDate: "2024-04-26", days: 5, type: "חופשה פסח" },
          { startDate: "2024-07-15", endDate: "2024-07-26", days: 8, type: "חופשה קיץ משפחתית" }
        ]
      },
      recovery: {
        used: 10,
        dates: [
          { startDate: "2024-03-11", endDate: "2024-03-22", days: 10, type: "הבראה" }
        ]
      },
      sickDays: {
        used: 3,
        dates: [
          { date: "2024-02-14", type: "מחלה עצמית - דלקת גרון" },
          { date: "2024-06-19", type: "מחלה עצמית - כאב גב" },
          { date: "2024-08-23", type: "מחלה עצמית - מיגרנה" }
        ]
      },
      childSickDays: {
        used: 7,
        dates: [
          { date: "2024-01-15", childAge: 8, type: "מחלת ילד - חום גבוה" },
          { date: "2024-03-08", childAge: 14, type: "מחלת ילד - כאב בטן" },
          { date: "2024-04-18", childAge: 8, type: "מחלת ילד - אוזניים" },
          { date: "2024-06-12", childAge: 17, type: "מחלת ילד - דלקת גרון" },
          { date: "2024-07-25", childAge: 8, type: "מחלת ילד - שפעת קיץ" },
          { date: "2024-09-03", childAge: 14, type: "מחלת ילד - כאב ראש" },
          { date: "2024-09-20", childAge: 8, type: "מחלת ילד - בחילות" }
        ]
      }
    },
    
    // יתרות צבורות למנהל ותיק
    accumulatedBalance: {
      sickDays: 45, // ימי מחלה מצטברים רבים
      vacation: 12  // חופשה מועברת
    },
    
    // זכאות מתנות לילדים - 3 ילדים בגילאים שונים
    childrenGifts: {
      eligibleChildren: 3,
      giftStatus2024: {
        "ראש השנה": "נמסר", // 3 מתנות/תשלומים לפי גיל
        "חנוכה": "ממתין",   // טרם הגיע
        "פסח": "נמסר"       // 3 מתנות/תשלומים לפי גיל
      },
      // פירוט לפי ילד
      childrenDetails: [
        { age: 8, giftType: "מתנה + 200₪" },   // עד 12
        { age: 14, giftType: "300₪ במזומן" },  // 13-18
        { age: 17, giftType: "300₪ במזומן" }   // 13-18
      ]
    },
    
    // נתוני עבודה - מנהל בכיר
    workData: {
      monthlyHours: 180, // שעות ניהול מוגברות
      overtimeThisMonth: 0, // פטור משעות נוספות
      overtimeDetails: [],
      managementCompensation: true, // זכאי להפגה ניהולית
      managementLevel: "branch_manager",
      additionalResponsibilities: ["ניהול צוות 15 עובדים", "אחריות P&L", "יעדי מכירות"]
    }
  },
  
  "tech": {
    // פרטים אישיים - שרה גולדמן
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
    hireDate: "2020-10-01",
    
    // נתוני משפחה (טופס 101) - רווקה ללא ילדים
    familyData: {
      maritalStatus: "רווקה",
      numberOfChildren: 0,
      childrenAges: [],
      spouseDetails: null,
      lastUpdated: "2024-01-10",
      
      // פרטים נוספים לאישה רווקה קריירה
      additionalInfo: {
        livingArrangement: "דירה עצמאית",
        emergencyContact: "אבא - משה גולדמן",
        personalStatus: "ממוקדת בקריירה"
      }
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
    
    // ניצול השנה 2024
    currentYearUsage: {
      vacation: {
        used: 10,
        dates: [
          { startDate: "2024-01-15", endDate: "2024-01-19", days: 5, type: "חופשה שנתית" },
          { startDate: "2024-05-20", endDate: "2024-05-24", days: 5, type: "חופשה שנתית" }
        ]
      },
      recovery: {
        used: 0,
        dates: []
      },
      sickDays: {
        used: 2,
        dates: [
          { date: "2024-03-18", type: "מחלה עצמית - מיגרנה" },
          { date: "2024-07-25", type: "מחלה עצמית - דלקת גרון" }
        ]
      },
      childSickDays: { used: 0, dates: [] }
    },
    
    // יתרות צבורות משנים קודמות
    accumulatedBalance: {
      sickDays: 32, // ימי מחלה מצטברים
      vacation: 4   // חופשה מועברת
    },
    
    // זכאות מתנות לילדים - אין ילדים
    childrenGifts: {
      eligibleChildren: 0,
      giftStatus2024: {}
    },
    
    // נתוני משמרות ושעות נוספות (דרגה גבוהה - פטורה)
    workData: {
      monthlyHours: 160,
      overtimeThisMonth: 0, // פטורה משעות נוספות
      overtimeDetails: [],
      managementCompensation: true // זכאית להפגה
    }
  }
};
