// Anti-inspect protection
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showAntiInspect();
});

document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        showAntiInspect();
    }
});

function showAntiInspect() {
    const antiInspect = document.getElementById('anti-inspect');
    antiInspect.style.display = 'block';
    
    setTimeout(() => {
        antiInspect.style.display = 'none';
    }, 3000);
}

// DOM Elements
const webhookList = document.getElementById('webhook-list');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const avatarInput = document.getElementById('avatar');
const fileInput = document.getElementById('file');
const fileInfo = document.getElementById('file-info');
const ttsCheckbox = document.getElementById('tts');
const modeSelect = document.getElementById('mode');
const spamSettings = document.getElementById('spam-settings');
const countInput = document.getElementById('count');
const delayInput = document.getElementById('delay');
const delayUnit = document.getElementById('delay-unit');
const delayVariationInput = document.getElementById('delay-variation');
const variationUnit = document.getElementById('variation-unit');
const sendBtn = document.getElementById('send');
const stopBtn = document.getElementById('stop');
const previewBtn = document.getElementById('preview-btn');
const clearBtn = document.getElementById('clear-btn');
const statusDiv = document.getElementById('status');
const historyDiv = document.getElementById('history');
const threadNameInput = document.getElementById('thread-name');
const randomUsernameCheckbox = document.getElementById('random-username');
const usernamePoolContainer = document.getElementById('username-pool-container');
const usernamePool = document.getElementById('username-pool');
const addUsernameBtn = document.getElementById('add-username');
const randomAvatarCheckbox = document.getElementById('random-avatar');
const avatarPoolContainer = document.getElementById('avatar-pool-container');
const avatarPool = document.getElementById('avatar-pool');
const addAvatarBtn = document.getElementById('add-avatar');
const enableEmbedCheckbox = document.getElementById('enable-embed');
const embedSettings = document.getElementById('embed-settings');
const embedTitleInput = document.getElementById('embed-title');
const embedDescriptionInput = document.getElementById('embed-description');
const embedColorInput = document.getElementById('embed-color');
const embedImageInput = document.getElementById('embed-image');
const randomEmbedImageCheckbox = document.getElementById('random-embed-image');
const embedImagePoolContainer = document.getElementById('embed-image-pool-container');
const embedImagePool = document.getElementById('embed-image-pool');
const addEmbedImageBtn = document.getElementById('add-embed-image');
const previewContainer = document.getElementById('preview');
const previewAvatar = document.getElementById('preview-avatar');
const previewUsername = document.getElementById('preview-username');
const previewContent = document.getElementById('preview-content');
const previewEmbed = document.getElementById('preview-embed');
const previewEmbedTitle = document.getElementById('preview-embed-title');
const previewEmbedDescription = document.getElementById('preview-embed-description');
const previewEmbedImage = document.getElementById('preview-embed-image');
const previewFile = document.getElementById('preview-file');
const addWebhookBtn = document.getElementById('add-webhook');
const terminalBtn = document.getElementById('terminal-btn');
const terminal = document.getElementById('terminal');
const closeTerminalBtn = document.getElementById('close-terminal');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const themeBtn = document.getElementById('theme-btn');

// State
let isSending = false;
let stopRequested = false;
let selectedFile = null;
let isDarkMode = true;
let terminalHistory = [];
let historyIndex = -1;

// Event Listeners
fileInput.addEventListener('change', updateFileInfo);
modeSelect.addEventListener('change', toggleSpamSettings);
sendBtn.addEventListener('click', sendMessages);
stopBtn.addEventListener('click', stopSending);
previewBtn.addEventListener('click', updatePreview);
clearBtn.addEventListener('click', clearHistory);
randomUsernameCheckbox.addEventListener('change', toggleUsernamePool);
addUsernameBtn.addEventListener('click', addUsernameField);
usernamePool.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-username')) {
        e.target.parentElement.remove();
        if (usernamePool.children.length === 0) {
            addUsernameField();
        }
    }
});
randomAvatarCheckbox.addEventListener('change', toggleAvatarPool);
addAvatarBtn.addEventListener('click', addAvatarField);
avatarPool.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-avatar')) {
        e.target.parentElement.remove();
        if (avatarPool.children.length === 0) {
            addAvatarField();
        }
    }
});
enableEmbedCheckbox.addEventListener('change', toggleEmbedSettings);
embedTitleInput.addEventListener('input', updatePreview);
embedDescriptionInput.addEventListener('input', updatePreview);
embedColorInput.addEventListener('input', updatePreview);
embedImageInput.addEventListener('input', updatePreview);
randomEmbedImageCheckbox.addEventListener('change', toggleEmbedImagePool);
addEmbedImageBtn.addEventListener('click', addEmbedImageField);
embedImagePool.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-embed-image')) {
        e.target.parentElement.remove();
        if (embedImagePool.children.length === 0) {
            addEmbedImageField();
        }
    }
});
messageInput.addEventListener('input', updatePreview);
usernameInput.addEventListener('input', updatePreview);
avatarInput.addEventListener('input', updatePreview);
addWebhookBtn.addEventListener('click', addWebhookField);
webhookList.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-webhook')) {
        e.target.parentElement.remove();
        if (webhookList.children.length === 0) {
            addWebhookField();
        }
    }
});
terminalBtn.addEventListener('click', toggleTerminal);
closeTerminalBtn.addEventListener('click', toggleTerminal);
terminalInput.addEventListener('keydown', handleTerminalInput);
themeBtn.addEventListener('click', toggleTheme);

// Initialize
toggleSpamSettings();
toggleUsernamePool();
toggleAvatarPool();
toggleEmbedSettings();
toggleEmbedImagePool();
updatePreview();
addTerminalMessage('System initialized. Type "help" for commands.');

function addWebhookField() {
    const div = document.createElement('div');
    div.className = 'webhook-item';
    div.innerHTML = `
        <input type="text" class="webhook-url" placeholder="https://discord.com/api/webhooks/...">
        <button class="remove-webhook hacker-btn">-</button>
    `;
    webhookList.appendChild(div);
}

function updateFileInfo() {
    if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
        fileInfo.textContent = `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`;
    } else {
        selectedFile = null;
        fileInfo.textContent = 'No file selected';
    }
    updatePreview();
}

function toggleSpamSettings() {
    spamSettings.style.display = modeSelect.value === 'once' ? 'none' : 'block';
}

function toggleUsernamePool() {
    usernamePoolContainer.style.display = randomUsernameCheckbox.checked ? 'block' : 'none';
    updatePreview();
}

function toggleAvatarPool() {
    avatarPoolContainer.style.display = randomAvatarCheckbox.checked ? 'block' : 'none';
    updatePreview();
}

function toggleEmbedSettings() {
    embedSettings.style.display = enableEmbedCheckbox.checked ? 'block' : 'none';
    updatePreview();
}

function toggleEmbedImagePool() {
    embedImagePoolContainer.style.display = randomEmbedImageCheckbox.checked ? 'block' : 'none';
    updatePreview();
}

function addUsernameField() {
    const div = document.createElement('div');
    div.className = 'random-pool-item';
    div.innerHTML = `
        <input type="text" placeholder="Username" class="hacker-input">
        <button class="remove-username hacker-btn">-</button>
    `;
    usernamePool.appendChild(div);
}

function addAvatarField() {
    const div = document.createElement('div');
    div.className = 'random-pool-item';
    div.innerHTML = `
        <input type="text" placeholder="Avatar URL" class="hacker-input">
        <button class="remove-avatar hacker-btn">-</button>
    `;
    avatarPool.appendChild(div);
}

function addEmbedImageField() {
    const div = document.createElement('div');
    div.className = 'random-pool-item';
    div.innerHTML = `
        <input type="text" placeholder="Image URL" class="hacker-input">
        <button class="remove-embed-image hacker-btn">-</button>
    `;
    embedImagePool.appendChild(div);
}

function getRandomUsername() {
    const inputs = usernamePool.querySelectorAll('input');
    const usernames = Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
    return usernames.length > 0 
        ? usernames[Math.floor(Math.random() * usernames.length)]
        : 'hacker_' + Math.floor(Math.random() * 1000);
}

function getRandomAvatar() {
    const inputs = avatarPool.querySelectorAll('input');
    const avatars = Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
    if (avatars.length === 0) return 'https://i.imgur.com/J7lY1Z5.png';
    
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    return randomAvatar || 'https://i.imgur.com/J7lY1Z5.png';
}

function getRandomEmbedImage() {
    const inputs = embedImagePool.querySelectorAll('input');
    const images = Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
    return images.length > 0 
        ? images[Math.floor(Math.random() * images.length)]
        : 'https://i.imgur.com/9mQ3Z6j.jpg';
}

function convertToMs(value, unit) {
    switch(unit) {
        case 'ms': return value;
        case 's': return value * 1000;
        case 'm': return value * 1000 * 60;
        case 'h': return value * 1000 * 60 * 60;
        case 'd': return value * 1000 * 60 * 60 * 24;
        case 'w': return value * 1000 * 60 * 60 * 24 * 7;
        case 'M': return value * 1000 * 60 * 60 * 24 * 30;
        case 'y': return value * 1000 * 60 * 60 * 24 * 365;
        default: return value * 1000;
    }
}

function hexToDecimal(hex) {
    return parseInt(hex.replace('#', ''), 16);
}

function updatePreview() {
    previewContainer.classList.remove('hidden');
    
    // Set username
    const username = usernameInput.value.trim() || 'Webhook User';
    previewUsername.textContent = randomUsernameCheckbox.checked ? getRandomUsername() : username;
    
    // Set avatar
    const avatar = avatarInput.value.trim();
    if (randomAvatarCheckbox.checked) {
        const randomAvatar = getRandomAvatar();
        previewAvatar.style.backgroundImage = `url(${randomAvatar})`;
        previewAvatar.textContent = '';
    } else if (avatar) {
        previewAvatar.style.backgroundImage = `url(${avatar})`;
        previewAvatar.textContent = '';
    } else {
        previewAvatar.style.backgroundImage = '';
        previewAvatar.textContent = username.charAt(0).toUpperCase();
    }
    
    // Set content
    previewContent.textContent = messageInput.value.trim() || '[No message content]';
    
    // Set file preview
    if (selectedFile) {
        previewFile.classList.remove('hidden');
        previewFile.textContent = `Attachment: ${selectedFile.name}`;
    } else {
        previewFile.classList.add('hidden');
    }
    
    // Set embed preview
    if (enableEmbedCheckbox.checked) {
        previewEmbed.classList.remove('hidden');
        
        // Set embed title
        const embedTitle = embedTitleInput.value.trim();
        previewEmbedTitle.textContent = embedTitle || 'Embed Title';
        previewEmbedTitle.style.display = embedTitle ? 'block' : 'none';
        
        // Set embed description
        const embedDesc = embedDescriptionInput.value.trim();
        previewEmbedDescription.textContent = embedDesc || 'Embed description goes here...';
        previewEmbedDescription.style.display = embedDesc ? 'block' : 'none';
        
        // Set embed color
        previewEmbed.style.borderLeftColor = embedColorInput.value;
        
        // Set embed image
        const embedImage = randomEmbedImageCheckbox.checked 
            ? getRandomEmbedImage() 
            : embedImageInput.value.trim();
        
        if (embedImage) {
            previewEmbedImage.classList.remove('hidden');
            previewEmbedImage.src = embedImage;
            previewEmbedImage.alt = 'Embed image';
        } else {
            previewEmbedImage.classList.add('hidden');
        }
    } else {
        previewEmbed.classList.add('hidden');
    }
}

async function sendMessages() {
    const webhookElements = webhookList.querySelectorAll('.webhook-url');
    const webhooks = Array.from(webhookElements).map(el => el.value.trim()).filter(Boolean);
    
    if (webhooks.length === 0) {
        showStatus('Please add at least one webhook URL', 'error');
        addTerminalMessage('Error: No webhook URLs provided');
        return;
    }
    
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim();
    const avatar = avatarInput.value.trim();
    const tts = ttsCheckbox.checked;
    const mode = modeSelect.value;
    const count = mode === 'once' ? 1 : parseInt(countInput.value);
    const baseDelay = mode === 'once' ? 0 : convertToMs(parseFloat(delayInput.value), delayUnit.value);
    const delayVariation = mode === 'once' ? 0 : convertToMs(parseFloat(delayVariationInput.value), variationUnit.value);
    const threadName = threadNameInput.value.trim();
    const enableEmbed = enableEmbedCheckbox.checked;
    const embedTitle = embedTitleInput.value.trim();
    const embedDescription = embedDescriptionInput.value.trim();
    const embedColor = hexToDecimal(embedColorInput.value);
    const embedImage = randomEmbedImageCheckbox.checked 
        ? getRandomEmbedImage() 
        : embedImageInput.value.trim();
    
    // Validate
    if (!message && !selectedFile && !enableEmbed) {
        showStatus('Please enter a message, add a file, or enable embed', 'error');
        addTerminalMessage('Error: No content to send');
        return;
    }
    
    if (isNaN(count) || count < 1) {
        showStatus('Invalid message count', 'error');
        addTerminalMessage('Error: Invalid message count');
        return;
    }
    
    if (isNaN(baseDelay) || baseDelay < 0) {
        showStatus('Invalid delay value', 'error');
        addTerminalMessage('Error: Invalid delay value');
        return;
    }
    
    if (isNaN(delayVariation) || delayVariation < 0) {
        showStatus('Invalid delay variation', 'error');
        addTerminalMessage('Error: Invalid delay variation');
        return;
    }
    
    // Start sending
    isSending = true;
    stopRequested = false;
    sendBtn.disabled = true;
    stopBtn.classList.remove('hidden');
    
    showStatus(`Sending ${count} messages to ${webhooks.length} webhooks...`, 'info');
    addTerminalMessage(`Starting ${mode} attack with ${count} messages`);
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < count; i++) {
        if (stopRequested) break;
        
        try {
            // Build payload
            const payload = {
                content: message || undefined,
                username: randomUsernameCheckbox.checked ? getRandomUsername() : username || undefined,
                avatar_url: randomAvatarCheckbox.checked ? getRandomAvatar() : avatar || undefined,
                tts: tts
            };
            
            // Add embed if enabled
            if (enableEmbed) {
                payload.embeds = [{
                    title: embedTitle || undefined,
                    description: embedDescription || undefined,
                    color: embedColor || undefined,
                    image: embedImage ? { url: embedImage } : undefined
                }];
            }
            
            // Add thread if specified
            if (threadName) {
                payload.thread_name = threadName;
            }
            
            // Send to all webhooks
            for (const webhook of webhooks) {
                if (stopRequested) break;
                
                try {
                    let response;
                    
                    if (selectedFile) {
                        // Send with file
                        const formData = new FormData();
                        formData.append('payload_json', JSON.stringify(payload));
                        formData.append('file', selectedFile);
                        
                        response = await fetch(webhook, {
                            method: 'POST',
                            body: formData
                        });
                    } else {
                        // Send without file
                        response = await fetch(webhook, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                    }
                    
                    if (response.ok) {
                        success++;
                        addHistory('success', message || '[File]' || '[Embed]', webhook);
                        addTerminalMessage(`Message ${i+1} sent successfully to ${webhook.substring(0, 30)}...`);
                    } else {
                        errors++;
                        const error = await response.json().catch(() => ({}));
                        addHistory('error', message || '[File]' || '[Embed]', error.message || 'Unknown error', webhook);
                        addTerminalMessage(`Error sending message ${i+1}: ${error.message || 'Unknown error'}`);
                    }
                } catch (err) {
                    errors++;
                    addHistory('error', message || '[File]' || '[Embed]', err.message, webhook);
                    addTerminalMessage(`Error: ${err.message}`);
                }
            }
            
            showStatus(`Sent ${i+1}/${count} (${success} OK, ${errors} failed)`, 'info');
            
            // Delay if not last message
            if (i < count - 1 && baseDelay > 0) {
                const variation = delayVariation > 0 
                    ? Math.floor(Math.random() * delayVariation * 2) - delayVariation
                    : 0;
                const actualDelay = Math.max(0, baseDelay + variation);
                
                await new Promise(resolve => setTimeout(resolve, actualDelay));
            }
        } catch (err) {
            errors++;
            addHistory('error', message || '[File]' || '[Embed]', err.message);
            showStatus(`Error: ${err.message}`, 'error');
            addTerminalMessage(`Fatal error: ${err.message}`);
        }
    }
    
    // Done sending
    isSending = false;
    sendBtn.disabled = false;
    stopBtn.classList.add('hidden');
    
    if (stopRequested) {
        showStatus(`Stopped. Sent ${success} messages`, 'warning');
        addTerminalMessage(`Attack stopped. ${success} messages sent`);
    } else {
        showStatus(`Done! ${success} sent, ${errors} failed`, success === (count * webhooks.length) ? 'success' : 'warning');
        addTerminalMessage(`Attack completed. ${success} successful, ${errors} failed`);
    }
}

function stopSending() {
    if (isSending) {
        stopRequested = true;
        stopBtn.disabled = true;
        showStatus('Stopping...', 'warning');
        addTerminalMessage('Stopping attack...');
    }
}

function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.className = `status ${type}`;
}

function addHistory(type, message, error = '', webhook = '') {
    const item = document.createElement('div');
    item.className = `history-item ${type}`;
    
    const time = new Date().toLocaleTimeString();
    const preview = message.length > 50 ? message.substring(0, 50) + '...' : message;
    const webhookPreview = webhook ? ` (${webhook.substring(0, 20)}...)` : '';
    
    item.innerHTML = `
        <div>[${time}]${webhookPreview} ${preview}</div>
        ${error ? `<div style="color:var(--${type === 'error' ? 'error' : 'text'})">${error}</div>` : ''}
    `;
    
    historyDiv.prepend(item);
    
    // Limit history
    if (historyDiv.children.length > 50) {
        historyDiv.removeChild(historyDiv.lastChild);
    }
}

function clearHistory() {
    historyDiv.innerHTML = '';
    addTerminalMessage('Message history cleared');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Terminal functions
function toggleTerminal() {
    terminal.classList.toggle('hidden');
}

function addTerminalMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = type;
    messageElement.textContent = `> ${message}`;
    terminalOutput.appendChild(messageElement);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        terminalInput.value = '';
        
        if (command) {
            terminalHistory.push(command);
            historyIndex = terminalHistory.length;
            addTerminalMessage(command, 'input');
            processCommand(command);
        }
    } else if (e.key === 'ArrowUp') {
        if (terminalHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            terminalInput.value = terminalHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        if (terminalHistory.length > 0 && historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            terminalInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = terminalHistory.length;
            terminalInput.value = '';
        }
    }
}

function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    
    switch(cmd) {
        case 'help':
            addTerminalMessage('Available commands:');
            addTerminalMessage('help - Show this help message');
            addTerminalMessage('clear - Clear terminal');
            addTerminalMessage('start - Start sending messages');
            addTerminalMessage('stop - Stop sending messages');
            addTerminalMessage('status - Show current status');
            addTerminalMessage('theme - Toggle dark/light mode');
            break;
            
        case 'clear':
            terminalOutput.innerHTML = '';
            break;
            
        case 'start':
            sendMessages();
            break;
            
        case 'stop':
            stopSending();
            break;
            
        case 'status':
            addTerminalMessage(`Current status: ${statusDiv.textContent}`);
            break;
            
        case 'theme':
            toggleTheme();
            break;
            
        default:
            addTerminalMessage(`Unknown command: ${cmd}`, 'error');
            break;
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.documentElement.style.setProperty('--dark-bg', '#0a0a0a');
        document.documentElement.style.setProperty('--darker-bg', '#050505');
        document.documentElement.style.setProperty('--text', '#e0e0e0');
        themeBtn.textContent = 'Dark Mode';
    } else {
        document.documentElement.style.setProperty('--dark-bg', '#f0f0f0');
        document.documentElement.style.setProperty('--darker-bg', '#e0e0e0');
        document.documentElement.style.setProperty('--text', '#333333');
        themeBtn.textContent = 'Light Mode';
    }
}
