// צ'אטבוט בנק דיסקונט - JavaScript גרסה יציבה

let isTyping = false;
let messageHistory = [];
let currentUser = 'call_center';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
    
    const urlParams = new URLSearchParams(window.location.search);
    currentUser = urlParams.get('user') || 'call_center';
    console.log('✅ צ\'אטבוט הופעל, משתמש נוכחי:', currentUser);
});

function initializeApp() {
    dayjs.locale('he');
    console.log('🏛️ צ\'אטבוט בנק דיסקונט הופעל בהצלחה');
}

function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = dayjs().format('HH:mm DD/MM/YYYY');
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendQuickMessage(message) {
    console.log('🚀 שליחת הודעה מהירה:', message);
    const textarea = document.getElementById('chat-input');
    if (textarea) {
        textarea.value = message;
        sendMessage();
    }
}

async function sendMessage() {
    const textarea = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (!textarea || !sendButton || isTyping) return;
    
    const message = textarea.value.trim();
    if (!message) return;
    
    console.log('📤 שולח הודעה:', message);
    
    addMessage(message, 'user');
    textarea.value = '';
    sendButton.disabled = true;
    showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                userType: currentUser
            })
        });
        
        const data = await response.json();
        console.log('📥 תשובה התקבלה:', data);
        
        hideTypingIndicator();
        addMessage(data.text, 'assistant');
        
    } catch (error) {
        console.error('❌ שגיאה:', error);
        hideTypingIndicator();
        addMessage('מצטער, אירעה שגיאה. אנא נסה שוב.', 'assistant');
    }
    
    sendButton.disabled = false;
}

function addMessage(text, type) {
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
    
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const timeSpan = document.createElement('span');
    timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${dayjs().format('HH:mm')}`;
    meta.appendChild(timeSpan);
    content.appendChild(meta);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getUserAvatar() {
    const profiles = {
        'call_center': 'ר.כ',
        'branch': 'ד.ל', 
        'tech': 'ש.ג'
    };
    return profiles[currentUser] || 'משתמש';
}

function formatMessageText(text) {
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return text;
}

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
    content.innerHTML = '<div class="typing-indicator">מחפש במאגרי הידע...</div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

console.log('✅ JavaScript נטען בהצלחה');