// צ'אטבוט בנק דיסקונט - JavaScript גרסה יציבה עם היסטוריית שיחות

let isTyping = false;
let messageHistory = [];
let currentUser = 'call_center';
let chatSessions = {}; // Store multiple chat sessions
let currentChatId = 'current';

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
    avatar.textContent = type === 'user' ? getUserAvatar() : 'DB';
    
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
    avatar.textContent = 'DB';
    
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

// Chat History Management Functions
function startNewChat() {
    console.log('🆕 התחלת שיחה חדשה');
    
    // Clear current messages except welcome message
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        // Keep only the first message (welcome) and quick actions
        const children = messagesContainer.children;
        // Remove all messages except the first two (welcome message + quick actions)
        while (children.length > 2) {
            children[children.length - 1].remove();
        }
    }
    
    // Create new chat session
    const newChatId = 'chat_' + Date.now();
    currentChatId = newChatId;
    chatSessions[newChatId] = {
        id: newChatId,
        title: 'שיחה חדשה',
        messages: [],
        createdAt: new Date(),
        lastMessage: 'התחלת שיחה חדשה'
    };
    
    // Update chat history display
    updateChatHistoryDisplay();
    
    // Clear input field
    const textarea = document.getElementById('chat-input');
    if (textarea) {
        textarea.value = '';
        textarea.focus();
    }
}

function loadChatHistory(chatId) {
    console.log('📜 טוען היסטוריית שיחה:', chatId);
    
    if (chatId === 'current') {
        // This is the current session - just highlight it
        highlightChatItem(chatId);
        return;
    }
    
    // Update active chat indicator
    currentChatId = chatId;
    highlightChatItem(chatId);
    
    // Here you could load actual chat history from storage
    // For now, we'll just show a placeholder
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        // For demo purposes, we'll just show that the chat was loaded
        addMessage(`נטענה שיחה קודמת: ${chatId}`, 'assistant');
    }
}

function highlightChatItem(chatId) {
    // Remove active class from all chat items
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected chat item
    const activeItem = document.querySelector(`[onclick*="${chatId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function updateChatHistoryDisplay() {
    const historyContainer = document.getElementById('chat-history');
    if (!historyContainer) return;
    
    // Clear current history except the current chat item
    const currentChatItem = historyContainer.querySelector('.chat-item.active');
    
    // This function could be expanded to dynamically update the history
    // For now, it's a placeholder for future enhancements
    console.log('📊 מעדכן תצוגת היסטוריה');
}

// Save current chat session (could be expanded to use localStorage or API)
function saveChatSession() {
    if (messageHistory.length > 0 && currentChatId) {
        chatSessions[currentChatId] = {
            id: currentChatId,
            title: generateChatTitle(messageHistory[0]),
            messages: [...messageHistory],
            createdAt: chatSessions[currentChatId]?.createdAt || new Date(),
            lastMessage: messageHistory[messageHistory.length - 1]?.text || ''
        };
        console.log('💾 שמירת שיחה:', currentChatId);
    }
}

function generateChatTitle(firstMessage) {
    if (!firstMessage) return 'שיחה חדשה';
    
    const text = firstMessage.text || firstMessage;
    // Extract the first meaningful words for title
    const words = text.split(' ').slice(0, 4);
    return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
}

// Enhanced message adding with chat session tracking
function addMessageWithHistory(text, type) {
    addMessage(text, type);
    
    // Add to message history
    messageHistory.push({
        text: text,
        type: type,
        timestamp: new Date()
    });
    
    // Auto-save session
    saveChatSession();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + N for new chat
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        startNewChat();
    }
});

// Initialize chat sessions on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize current session
    currentChatId = 'current';
    chatSessions[currentChatId] = {
        id: currentChatId,
        title: 'שיחה נוכחית',
        messages: [],
        createdAt: new Date(),
        lastMessage: 'התחלת שיחה'
    };
});

console.log('✅ JavaScript עם היסטוריית שיחות נטען בהצלחה');