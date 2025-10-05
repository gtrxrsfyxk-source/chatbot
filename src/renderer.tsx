import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>צ'אטבוט בנק ישראל - עוזר הידע הפנים-ארגוני</title>
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700&family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/he.js"></script>
      </head>
      <body class="font-assistant bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
