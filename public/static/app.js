// צ'אטבוט בנק ישראל - JavaScript

// הגדרות גלובליות
let isTyping = false;
let messageHistory = [];
let currentUser = 'call_center';

// אתחול האפליקציה
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateCurrentTime();
    // עדכן זמן כל דקה
    setInterval(updateCurrentTime, 60000);
    
    // זיהוי סוג המשתמש מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    currentUser = urlParams.get('user') || 'call_center';
});

// אתחול האפליקציה
function initializeApp() {
    dayjs.locale('he');
    
    // הגדר גובה התיבה בהתאם לתוכן
    const textarea = document.getElementById('chat-input');
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    
    console.log('🏛️ צ\'אטבוט בנק ישראל הופעל בהצלחה');
}

// הגדרת מאזיני אירועים
function setupEventListeners() {
    const textarea = document.getElementById('chat-input');
    
    if (textarea) {
        // התאמת גובה אוטומטית
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            // הפעלה/השבתה של כפתור השליחה
            const sendButton = document.getElementById('send-button');
            if (sendButton) {
                sendButton.disabled = this.value.trim().length === 0 || isTyping;
            }
        });
    }
}

// עדכון הזמן הנוכחי
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = dayjs().format('HH:mm DD/MM/YYYY');
    }
}

// טיפול בלחיצה על Enter
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// שליחת הודעה מהירה
function sendQuickMessage(message) {
    const textarea = document.getElementById('chat-input');
    if (textarea) {
        textarea.value = message;
        sendMessage();
    }
}

// שליחת הודעה
async function sendMessage() {
    const textarea = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (!textarea || !sendButton || isTyping) return;
    
    const message = textarea.value.trim();
    if (!message) return;
    
    // הוסף הודעת משתמש
    addMessage(message, 'user');
    messageHistory.push({ role: 'user', content: message });
    
    // נקה את שדה הקלט
    textarea.value = '';
    textarea.style.height = 'auto';
    sendButton.disabled = true;
    
    // הצג אינדיקטור טיפוס
    showTypingIndicator();
    
    try {
        // שלח בקשה לשרת
        const response = await axios.post('/api/chat', {
            message: message,
            userType: currentUser,
            history: messageHistory.slice(-5) // שלח רק 5 הודעות אחרונות
        });
        
        const data = response.data;
        
        // הסר אינדיקטור טיפוס
        hideTypingIndicator();
        
        // הוסף תגובת הבוט
        addMessage(data.text, 'assistant', {
            sources: data.sources,
            lastUpdated: data.lastUpdated,
            confidence: data.confidence
        });
        
        messageHistory.push({ 
            role: 'assistant', 
            content: data.text,
            metadata: {
                sources: data.sources,
                confidence: data.confidence
            }
        });
        
    } catch (error) {
        hideTypingIndicator();
        addMessage('מצטער, אירעה שגיאה טכנית. אנא נסה שוב או פנה לתמיכה טכנית.', 'assistant', {
            sources: [],
            lastUpdated: dayjs().format('YYYY-MM-DD'),
            confidence: 0
        });
        console.error('שגיאה בשליחת הודעה:', error);
    }
    
    sendButton.disabled = false;
}

// הוספת הודעה לצ'אט
function addMessage(text, type, metadata = {}) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? getUserAvatar() : 'בנק';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.className = 'message-text';
    textP.innerHTML = formatMessageText(text);
    content.appendChild(textP);
    
    // הוסף מטא-דטה (זמן, מקורות וכו')
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    
    const timeSpan = document.createElement('span');
    timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${dayjs().format('HH:mm')}`;
    meta.appendChild(timeSpan);
    
    if (type === 'assistant' && metadata.confidence !== undefined) {
        const confidenceSpan = document.createElement('span');
        confidenceSpan.textContent = '•';
        meta.appendChild(confidenceSpan);
        
        const ratingSpan = document.createElement('span');
        ratingSpan.innerHTML = `<i class="fas fa-chart-line"></i> רמת ודאות: ${Math.round(metadata.confidence * 100)}%`;
        meta.appendChild(ratingSpan);
    }
    
    if (metadata.lastUpdated) {
        const updatedSpan = document.createElement('span');
        updatedSpan.textContent = '•';
        meta.appendChild(updatedSpan);
        
        const dateSpan = document.createElement('span');
        dateSpan.innerHTML = `<i class="fas fa-calendar-alt"></i> עודכן: ${formatDate(metadata.lastUpdated)}`;
        meta.appendChild(dateSpan);
    }
    
    content.appendChild(meta);
    
    // הוסף מקורות אם קיימים
    if (metadata.sources && metadata.sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'source-links';
        
        const sourcesLabel = document.createElement('span');
        sourcesLabel.innerHTML = '<i class="fas fa-book"></i> מקורות: ';
        sourcesDiv.appendChild(sourcesLabel);
        
        metadata.sources.forEach((source, index) => {
            const sourceLink = document.createElement('a');
            sourceLink.href = '#';
            sourceLink.className = 'source-link';
            sourceLink.innerHTML = `<i class="fas fa-external-link-alt"></i> ${source}`;
            sourceLink.onclick = (e) => {
                e.preventDefault();
                showSourceModal(source);
            };
            sourcesDiv.appendChild(sourceLink);
        });
        
        content.appendChild(sourcesDiv);
    }
    
    // הוסף מנגנון feedback לתגובות הבוט
    if (type === 'assistant') {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-section';
        
        const feedbackText = document.createElement('span');
        feedbackText.className = 'feedback-text';
        feedbackText.textContent = 'התשובה הועילה?';
        
        const ratingButtons = document.createElement('div');
        ratingButtons.className = 'rating-buttons';
        
        const thumbsUp = document.createElement('button');
        thumbsUp.className = 'rating-button';
        thumbsUp.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        thumbsUp.onclick = () => handleFeedback(messageHistory.length, 'positive', thumbsUp);
        
        const thumbsDown = document.createElement('button');
        thumbsDown.className = 'rating-button';
        thumbsDown.innerHTML = '<i class="fas fa-thumbs-down"></i>';
        thumbsDown.onclick = () => handleFeedback(messageHistory.length, 'negative', thumbsDown);
        
        ratingButtons.appendChild(thumbsUp);
        ratingButtons.appendChild(thumbsDown);
        
        feedbackDiv.appendChild(feedbackText);
        feedbackDiv.appendChild(ratingButtons);
        content.appendChild(feedbackDiv);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    
    // גלול למטה
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // אנימציה
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
}

// קבלת אווטר המשתמש
function getUserAvatar() {
    const profiles = {
        'call_center': 'ר.כ',
        'branch': 'ד.ל',
        'tech': 'ש.ג'
    };
    return profiles[currentUser] || 'משתמש';
}

// עיצוב טקסט ההודעה
function formatMessageText(text) {
    // המרת קווי חלוקה לבר אליין
    text = text.replace(/\n/g, '<br>');
    
    // הדגשת מילים חשובות
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // הדגשת מספרי נהלים
    text = text.replace(/(נוהל|מדיניות|טופס)\s+([א-ת0-9\-\.]+)/g, '<strong>$1 $2</strong>');
    
    // הדגשת סכומים
    text = text.replace(/(\d{1,3}(?:,\d{3})*)\s*₪/g, '<strong>$1 ₪</strong>');
    
    return text;
}

// עיצוב תאריך
function formatDate(dateStr) {
    return dayjs(dateStr).format('DD/MM/YYYY');
}

// הצגת אינדיקטור טיפוס
function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-assistant';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'בנק';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.innerHTML = `
        <span>מחפש במאגרי הידע...</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    content.appendChild(typingContent);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// הסתרת אינדיקטור טיפוס
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// טיפול בפידבק
function handleFeedback(messageIndex, type, button) {
    // הסר בחירות קודמות מאותה קבוצה
    const parent = button.parentElement;
    parent.querySelectorAll('.rating-button').forEach(btn => {
        btn.classList.remove('active-positive', 'active-negative');
    });
    
    // הוסף בחירה נוכחית
    button.classList.add(type === 'positive' ? 'active-positive' : 'active-negative');
    
    // שלח פידבק לשרת (סימולציה)
    console.log(`פידבק נשלח: הודעה ${messageIndex}, דירוג: ${type}`);
    
    // הצג הודעת תודה
    const feedbackText = parent.previousElementSibling;
    const originalText = feedbackText.textContent;
    feedbackText.textContent = 'תודה על המשוב!';
    feedbackText.style.color = 'var(--boi-green)';
    
    setTimeout(() => {
        feedbackText.textContent = originalText;
        feedbackText.style.color = '';
    }, 2000);
}

// הצגת חלון מקור
function showSourceModal(source) {
    alert(`מקור: ${source}\n\nבתכנון: חלון פרטים מפורט עם תוכן המסמך המלא.`);
}

// פונקציות עזר לניווט
function switchUser(userType) {
    window.location.href = `/?user=${userType}`;
}

// מניעת טעינה כפולה
let isLoading = false;

// פונקציית עזר לטיפול בשגיאות
function handleError(error, context = 'פעולה כללית') {
    console.error(`שגיאה ב${context}:`, error);
    
    // הצג הודעת שגיאה למשתמש
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        addMessage(
            'מצטער, אירעה שגיאה טכנית. אנא רענן את הדף ונסה שוב, או פנה לתמיכה טכנית.',
            'assistant',
            {
                sources: [],
                lastUpdated: dayjs().format('YYYY-MM-DD'),
                confidence: 1.0
            }
        );
    }
}

// פונקציות למעקב אנליטיקה (לדמו)
function trackUserAction(action, details = {}) {
    console.log(`📊 מעקב: ${action}`, details);
    // כאן ניתן להוסיף שליחה לשירות אנליטיקה
}

console.log('✅ JavaScript של צ\'אטבוט בנק ישראל נטען בהצלחה');