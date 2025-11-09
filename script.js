// Tab functionality
function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // Show current tab and set button as active
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Chat functionality
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';

    // Get AI response
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        addMessage(data.response, 'ai');
    } catch (error) {
        addMessage('Error: Could not get response', 'ai');
    }
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Image analysis functionality
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.style.display = 'block';
            preview.dataset.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

async function analyzeImage() {
    const imageData = document.getElementById('image-preview').dataset.imageData;
    const question = document.getElementById('image-question').value || 'What do you see in this image?';

    if (!imageData) {
        alert('Please upload an image first');
        return;
    }

    try {
        const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                image: imageData, 
                question: question 
            })
        });

        const data = await response.json();
        document.getElementById('image-response').innerHTML = `<strong>Analysis:</strong> ${data.response}`;
    } catch (error) {
        document.getElementById('image-response').innerHTML = 'Error analyzing image';
    }
}

// Code generation functionality
async function generateCode() {
    const description = document.getElementById('code-description').value;
    const language = document.getElementById('code-language').value;

    if (!description) {
        alert('Please enter a code description');
        return;
    }

    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                description: description,
                language: language
            })
        });

        const data = await response.json();
        document.getElementById('code-output').textContent = data.response;
    } catch (error) {
        document.getElementById('code-output').textContent = 'Error generating code';
    }
}

// Content creation functionality
async function createContent() {
    const topic = document.getElementById('content-topic').value;
    const contentType = document.getElementById('content-type').value;
    const tone = document.getElementById('content-tone').value;

    if (!topic) {
        alert('Please enter a topic');
        return;
    }

    try {
        const response = await fetch('/api/create-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                topic: topic,
                content_type: contentType,
                tone: tone
            })
        });

        const data = await response.json();
        document.getElementById('content-output').innerHTML = data.response;
    } catch (error) {
        document.getElementById('content-output').innerHTML = 'Error creating content';
    }
}

// Enter key support for chat
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
