@echo off
echo =================================
echo צ'אטבוט בנק דיסקונט - התקנה
echo =================================
echo.

echo בודק Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo שגיאה: Node.js לא מותקן!
    echo נא להוריד מ: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js נמצא! ✓
echo.

echo מתקין תלויות...
call npm install
if %errorlevel% neq 0 (
    echo שגיאה בהתקנת תלויות!
    pause
    exit /b 1
)

echo בונה את הפרויקט...
call npm run build
if %errorlevel% neq 0 (
    echo שגיאה בבנייה!
    pause
    exit /b 1
)

echo.
echo התקנה הושלמה בהצלחה! ✓
echo.
echo להפעלה:
echo   npm run start
echo.
echo או לפיתוח:
echo   npm run dev
echo.
echo הפרויקט יפעל ב: http://localhost:8788
echo.
pause