# מדריך התקנה מהיר - צ'אטבוט בנק דיסקונט

## התקנה מהירה (5 דקות)

### 1. וודא שיש לך Node.js
```bash
node --version  # צריך להיות 18+ 
npm --version   # צריך לעבוד
```
אם לא - [הורד Node.js](https://nodejs.org)

### 2. הורד ופתח הפרויקט
```bash
# אם הורדת ZIP - חלץ אותו ואז:
cd webapp

# או אם יש git:
git clone <repository-url>
cd webapp
```

### 3. התקן והרץ
```bash
npm run setup     # התקנת תלויות ובנייה
npm run start     # הפעלת השרת
```

### 4. פתח בדפדפן
🌐 **http://localhost:8788**

---

## פקודות שימושיות

```bash
npm run dev       # פיתוח עם hot-reload
npm run build     # בנייה בלבד
npm run preview   # הרצת build מקומי
npm run test      # בדיקה שהשרת רץ
npm run clean     # ניקוי מלא
```

## בעיות נפוצות

**הפורט תפוס?**
```bash
# Windows
netstat -ano | findstr :8788

# Mac/Linux  
lsof -i :8788
```

**שגיאות?**
```bash
npm run clean
npm run setup
```

**זה עובד!** 🎉
- עמוד ראשי: http://localhost:8788
- בחירת משתמש: http://localhost:8788/users