#!/bin/bash

echo "================================="
echo "צ'אטבוט בנק דיסקונט - התקנה"
echo "================================="
echo

# Check Node.js
echo "בודק Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ שגיאה: Node.js לא מותקן!"
    echo "נא להוריד מ: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js נמצא! ($(node --version))"
echo

# Install dependencies
echo "מתקין תלויות..."
if ! npm install; then
    echo "❌ שגיאה בהתקנת תלויות!"
    exit 1
fi

# Build project
echo "בונה את הפרויקט..."
if ! npm run build; then
    echo "❌ שגיאה בבנייה!"
    exit 1
fi

echo
echo "✅ התקנה הושלמה בהצלחה!"
echo
echo "להפעלה:"
echo "  npm run start"
echo
echo "או לפיתוח:"
echo "  npm run dev"
echo
echo "הפרויקט יפעל ב: http://localhost:8788"
echo