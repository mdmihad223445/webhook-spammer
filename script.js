// Anti-inspect protection
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showAntiInspect();
});

document.addEventListener('keydown', function(e) {
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
const connectionType = document.getElementById('connection-type');
const webhookContainer = document.getElementById('webhook-container');
const tokenSection = document.getElementById('token-section');
const webhookList = document.getElementById('webhook-list');
const targetIdList = document.getElementById('target-id-list');
const messageInput = document.getElementById('message');
const fileInput = document.getElementById('file');
const fileInfo = document.getElementById('file-info');
const ttsCheckbox = document.getElementById('tts');
const enableEmbedCheckbox = document.getElementById('enable-embed');
const embedSettings = document.getElementById('embed-settings');
const embedTitleInput = document.getElementById('embed-title');
const embedUrlInput = document.getElementById('embed-url');
const embedDescriptionInput = document.getElementById('embed-description');
const embedColorInput = document.getElementById('embed-color');
const embedAuthorNameInput = document.getElementById('embed-author-name');
const embedAuthorUrlInput = document.getElementById('embed-author-url');
const embedAuthorIconInput = document.getElementById('embed-author-icon');
const embedImageInput = document.getElementById('embed-image');
const embedThumbnailInput = document.getElementById('embed-thumbnail');
const embedFooterTextInput = document.getElementById('embed-footer-text');
const embedFooterIconInput = document.getElementById('embed-footer-icon');
const randomEmbedImageCheckbox = document.getElementById('random-embed-image');
const embedImagePoolContainer = document.getElementById('embed-image-pool-container');
const embedImagePool = document.getElementById('embed-image-pool');
const modeSelect = document.getElementById('mode');
const spamSettings = document.getElementById('spam-settings');
const countInput = document.getElementById('count');
const delayInput = document.getElementById('delay');
const delayUnit = document.getElementById('delay-unit');
const sendBtn = document.getElementById('send');
const stopBtn = document.getElementById('stop');
const previewBtn = document.getElementById('preview-btn');
const testBtn = document.getElementById('test-btn');
const statusDiv = document.getElementById('status');
const historyDiv = document.getElementById('history');
const previewContainer = document.getElementById('preview');
const previewAvatar = document.getElementById('preview-avatar');
const previewUsername = document.getElementById('preview-username');
const previewContent = document.getElementById('preview-content');
const previewEmbed = document.getElementById('preview-embed');
const previewEmbedAuthor = document.getElementById('preview-embed-author');
const previewEmbedTitle = document.getElementById('preview-embed-title');
const previewEmbedDescription = document.getElementById('preview-embed-description');
const previewEmbedThumbnail = document.getElementById('preview-embed-thumbnail');
const previewEmbedImage = document.getElementById('preview-embed-image');
const previewEmbedFooter = document.getElementById('preview-embed-footer');
const previewFile = document.getElementById('preview-file');
const addWebhookBtn = document.getElementById('add-webhook');
const addTargetIdBtn = document.getElementById('add-target-id');
const tokenInput = document.getElementById('token');
const messageTypeSelect = document.getElementById('message-type');
const addEmbedImageBtn = document.getElementById('add-embed-image');

// State
let isSending = false;
let stopRequested = false;
let selectedFile = null;

// Event Listeners
connectionType.addEventListener('change', function() {
    if (connectionType.value === 'webhook') {
        webhookContainer.style.display = 'block';
        tokenSection.style.display = 'none';
    } else {
        webhookContainer.style.display = 'none';
        tokenSection.style.display = 'block';
    }
});

fileInput.addEventListener('change', updateFileInfo);
enableEmbedCheckbox.addEventListener('change', function() {
    embedSettings.style.display = enableEmbedCheckbox.checked ? 'block' : 'none';
    updatePreview();
});
randomEmbedImageCheckbox.addEventListener('change', function() {
    embedImagePoolContainer.style.display = randomEmbedImageCheckbox.checked ? 'block' : 'none';
    updatePreview();
});
modeSelect.addEventListener('change', function() {
    spamSettings.style.display = modeSelect.value === 'spam' ? 'block' : 'none';
});
sendBtn.addEventListener('click', sendMessages);
stopBtn.addEventListener('click', stopSending);
previewBtn.addEventListener('click', updatePreview);
testBtn.addEventListener('click', testConnection);
addWebhookBtn.addEventListener('click', addWebhookField);
addTargetIdBtn.addEventListener('click', addTargetIdField);
addEmbedImageBtn.addEventListener('click', addEmbedImageField);

// Add event listeners for all embed fields
const embedFields = [
    embedTitleInput, embedUrlInput, embedDescriptionInput, embedColorInput,
    embedAuthorNameInput, embedAuthorUrlInput, embedAuthorIconInput,
    embedImageInput, embedThumbnailInput, embedFooterTextInput, embedFooterIconInput
];
embedFields.forEach(field => field.addEventListener('input', updatePreview));

// Initialize
addWebhookField();
addTargetIdField();
updatePreview();

function addWebhookField() {
    const div = document.createElement('div');
    div.className = 'webhook-item';
    div.innerHTML = `
        <input type="text" class="webhook-url" placeholder="https://discord.com/api/webhooks/...">
        <button class="remove-webhook">-</button>
    `;
    webhookList.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-webhook').addEventListener('click', function() {
        if (webhookList.children.length > 1) {
            div.remove();
        } else {
            showStatus('You must have at least one webhook', 'error');
        }
    });
}

function addTargetIdField() {
    const div = document.createElement('div');
    div.className = 'target-id-item';
    div.innerHTML = `
        <input type="text" class="target-id" placeholder="User ID or Channel ID">
        <button class="remove-target-id">-</button>
    `;
    targetIdList.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-target-id').addEventListener('click', function() {
        if (targetIdList.children.length > 1) {
            div.remove();
        } else {
            showStatus('You must have at least one target ID', 'error');
        }
    });
}

function addEmbedImageField() {
    const div = document.createElement('div');
    div.className = 'random-pool-item';
    div.innerHTML = `
        <input type="text" placeholder="Image URL">
        <button class="remove-embed-image">-</button>
    `;
    embedImagePool.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-embed-image').addEventListener('click', function() {
        if (embedImagePool.children.length > 1) {
            div.remove();
        } else {
            showStatus('You must have at least one image URL', 'error');
        }
    });
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

function getRandomImage() {
    const inputs = embedImagePool.querySelectorAll('input');
    const images = Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
    return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : '';
}

function updatePreview() {
    previewContainer.classList.remove('hidden');
    
    // Update message content
    previewContent.textContent = messageInput.value.trim() || '[No message content]';
    
    // Update embed preview if enabled
    if (enableEmbedCheckbox.checked) {
        previewEmbed.classList.remove('hidden');
        
        // Title and URL
        previewEmbedTitle.textContent = embedTitleInput.value.trim() || 'Embed Title';
        previewEmbedTitle.style.display = embedTitleInput.value.trim() ? 'block' : 'none';
        
        // Description
        previewEmbedDescription.textContent = embedDescriptionInput.value.trim() || 'Embed description will appear here...';
        previewEmbedDescription.style.display = embedDescriptionInput.value.trim() ? 'block' : 'none';
        
        // Author
        const authorName = embedAuthorNameInput.value.trim();
        if (authorName) {
            let authorText = authorName;
            if (embedAuthorUrlInput.value.trim()) {
                authorText = `[${authorName}](${embedAuthorUrlInput.value.trim()})`;
            }
            previewEmbedAuthor.innerHTML = authorText;
            previewEmbedAuthor.style.display = 'block';
            
            if (embedAuthorIconInput.value.trim()) {
                previewEmbedAuthor.innerHTML += ` <img src="${embedAuthorIconInput.value.trim()}" style="width:20px;height:20px;border-radius:50%;vertical-align:middle;">`;
            }
        } else {
            previewEmbedAuthor.style.display = 'none';
        }
        
        // Thumbnail
        if (embedThumbnailInput.value.trim()) {
            previewEmbedThumbnail.src = embedThumbnailInput.value.trim();
            previewEmbedThumbnail.classList.remove('hidden');
        } else {
            previewEmbedThumbnail.classList.add('hidden');
        }
        
        // Image
        let imageUrl = embedImageInput.value.trim();
        if (randomEmbedImageCheckbox.checked) {
            imageUrl = getRandomImage();
        }
        
        if (imageUrl) {
            previewEmbedImage.src = imageUrl;
            previewEmbedImage.classList.remove('hidden');
        } else {
            previewEmbedImage.classList.add('hidden');
        }
        
        // Footer
        const footerText = embedFooterTextInput.value.trim();
        if (footerText) {
            let footerHTML = footerText;
            if (embedFooterIconInput.value.trim()) {
                footerHTML += ` <img src="${embedFooterIconInput.value.trim()}" style="width:16px;height:16px;border-radius:50%;vertical-align:middle;">`;
            }
            previewEmbedFooter.innerHTML = footerHTML;
            previewEmbedFooter.classList.remove('hidden');
        } else {
            previewEmbedFooter.classList.add('hidden');
        }
        
        // Color
        previewEmbed.style.borderLeftColor = embedColorInput.value;
    } else {
        previewEmbed.classList.add('hidden');
    }
    
    // Update file preview
    if (selectedFile) {
        previewFile.textContent = `Attachment: ${selectedFile.name}`;
        previewFile.classList.remove('hidden');
    } else {
        previewFile.classList.add('hidden');
    }
}

function processMessageContent(content) {
    // Process special tags
    return content
        .replace(/\{mention\}/g, '@everyone')
        .replace(/\{server\}/g, 'Discord Server')
        .replace(/\{user\(proper\)\}/g, 'User#1234')
        .replace(/\{server\(members\)\}/g, '100')
        .replace(/\{random:([^}]+)\}/g, function(match, options) {
            const choices = options.split('~');
            return choices[Math.floor(Math.random() * choices.length)].trim();
        })
        .replace(/\{ord:(\d+)\}/g, function(match, num) {
            return addOrdinalSuffix(num);
        });
}

function addOrdinalSuffix(num) {
    const j = num % 10, k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
}

async function sendMessages() {
    const method = connectionType.value;
    
    if (method === 'webhook') {
        await sendWebhookMessages();
    } else {
        await sendTokenMessages();
    }
}

async function sendWebhookMessages() {
    const webhookElements = webhookList.querySelectorAll('.webhook-url');
    const webhooks = Array.from(webhookElements).map(el => el.value.trim()).filter(Boolean);
    
    if (webhooks.length === 0) {
        showStatus('Please add at least one webhook URL', 'error');
        return;
    }
    
    const message = processMessageContent(messageInput.value.trim());
    const tts = ttsCheckbox.checked;
    const mode = modeSelect.value;
    const count = mode === 'spam' ? parseInt(countInput.value) : 1;
    const delay = mode === 'spam' ? convertToMs(parseFloat(delayInput.value), delayUnit.value) : 0;
    
    // Validate
    if (!message && !selectedFile && !enableEmbedCheckbox.checked) {
        showStatus('Please enter a message, add a file, or enable embed', 'error');
        return;
    }
    
    if (isNaN(count) || count < 1) {
        showStatus('Invalid message count', 'error');
        return;
    }
    
    if (isNaN(delay) || delay < 0) {
        showStatus('Invalid delay value', 'error');
        return;
    }
    
    // Start sending
    isSending = true;
    stopRequested = false;
    sendBtn.disabled = true;
    stopBtn.classList.remove('hidden');
    
    showStatus(`Sending ${count} messages to ${webhooks.length} webhooks...`, 'info');
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < count; i++) {
        if (stopRequested) break;
        
        try {
            // Build payload
            const payload = {
                content: message || undefined,
                tts: tts
            };
            
            // Add embed if enabled
            if (enableEmbedCheckbox.checked) {
                let imageUrl = embedImageInput.value.trim();
                if (randomEmbedImageCheckbox.checked) {
                    imageUrl = getRandomImage();
                }
                
                const embed = {
                    title: embedTitleInput.value.trim() || undefined,
                    url: embedUrlInput.value.trim() || undefined,
                    description: embedDescriptionInput.value.trim() || undefined,
                    color: hexToDecimal(embedColorInput.value) || undefined,
                    image: imageUrl ? { url: imageUrl } : undefined,
                    thumbnail: embedThumbnailInput.value.trim() ? { url: embedThumbnailInput.value.trim() } : undefined,
                    footer: embedFooterTextInput.value.trim() ? {
                        text: embedFooterTextInput.value.trim(),
                        icon_url: embedFooterIconInput.value.trim() || undefined
                    } : undefined,
                    author: embedAuthorNameInput.value.trim() ? {
                        name: embedAuthorNameInput.value.trim(),
                        url: embedAuthorUrlInput.value.trim() || undefined,
                        icon_url: embedAuthorIconInput.value.trim() || undefined
                    } : undefined
                };
                
                payload.embeds = [embed];
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
                    } else {
                        errors++;
                        const error = await response.json().catch(() => ({}));
                        addHistory('error', message || '[File]' || '[Embed]', error.message || 'Unknown error', webhook);
                    }
                } catch (err) {
                    errors++;
                    addHistory('error', message || '[File]' || '[Embed]', err.message, webhook);
                }
            }
            
            showStatus(`Sent ${i+1}/${count} (${success} OK, ${errors} failed)`, 'info');
            
            // Delay if not last message
            if (i < count - 1 && delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (err) {
            errors++;
            addHistory('error', message || '[File]' || '[Embed]', err.message);
            showStatus(`Error: ${err.message}`, 'error');
        }
    }
    
    // Done sending
    isSending = false;
    sendBtn.disabled = false;
    stopBtn.classList.add('hidden');
    
    if (stopRequested) {
        showStatus(`Stopped. Sent ${success} messages`, 'warning');
    } else {
        showStatus(`Done! ${success} sent, ${errors} failed`, success === (count * webhooks.length) ? 'success' : 'warning');
    }
}

async function sendTokenMessages() {
    const token = tokenInput.value.trim();
    const targetIdElements = targetIdList.querySelectorAll('.target-id');
    const targetIds = Array.from(targetIdElements).map(el => el.value.trim()).filter(Boolean);
    const messageType = messageTypeSelect.value;
    
    if (!token || targetIds.length === 0) {
        showStatus('Token and at least one target ID are required', 'error');
        return;
    }
    
    const message = processMessageContent(messageInput.value.trim());
    const mode = modeSelect.value;
    const count = mode === 'spam' ? parseInt(countInput.value) : 1;
    const delay = mode === 'spam' ? convertToMs(parseFloat(delayInput.value), delayUnit.value) : 0;
    
    // Validate
    if (!message && !selectedFile && !enableEmbedCheckbox.checked) {
        showStatus('Please enter a message, add a file, or enable embed', 'error');
        return;
    }
    
    if (isNaN(count) || count < 1) {
        showStatus('Invalid message count', 'error');
        return;
    }
    
    if (isNaN(delay) || delay < 0) {
        showStatus('Invalid delay value', 'error');
        return;
    }
    
    // Start sending
    isSending = true;
    stopRequested = false;
    sendBtn.disabled = true;
    stopBtn.classList.remove('hidden');
    
    showStatus(`Sending ${count} messages to ${targetIds.length} targets...`, 'info');
    
    let success = 0;
    let errors = 0;
    
    try {
        // Process each target ID
        for (const targetId of targetIds) {
            if (stopRequested) break;
            
            let channelId = targetId;
            
            // If DM, create DM channel first
            if (messageType === 'dm') {
                try {
                    const dmResponse = await fetch('https://discord.com/api/v9/users/@me/channels', {
                        method: 'POST',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            recipient_id: targetId
                        })
                    });
                    
                    if (!dmResponse.ok) {
                        throw new Error('Failed to create DM channel');
                    }
                    
                    const dmData = await dmResponse.json();
                    channelId = dmData.id;
                } catch (err) {
                    errors++;
                    addHistory('error', `Failed to create DM for ${targetId}`, err.message);
                    continue; // Skip to next target if DM creation fails
                }
            }
            
            // Send messages to this channel
            for (let i = 0; i < count; i++) {
                if (stopRequested) break;
                
                try {
                    // Build payload
                    const payload = {
                        content: message || undefined
                    };
                    
                    // Add embed if enabled
                    if (enableEmbedCheckbox.checked) {
                        let imageUrl = embedImageInput.value.trim();
                        if (randomEmbedImageCheckbox.checked) {
                            imageUrl = getRandomImage();
                        }
                        
                        const embed = {
                            title: embedTitleInput.value.trim() || undefined,
                            url: embedUrlInput.value.trim() || undefined,
                            description: embedDescriptionInput.value.trim() || undefined,
                            color: hexToDecimal(embedColorInput.value) || undefined,
                            image: imageUrl ? { url: imageUrl } : undefined,
                            thumbnail: embedThumbnailInput.value.trim() ? { url: embedThumbnailInput.value.trim() } : undefined,
                            footer: embedFooterTextInput.value.trim() ? {
                                text: embedFooterTextInput.value.trim(),
                                icon_url: embedFooterIconInput.value.trim() || undefined
                            } : undefined,
                            author: embedAuthorNameInput.value.trim() ? {
                                name: embedAuthorNameInput.value.trim(),
                                url: embedAuthorUrlInput.value.trim() || undefined,
                                icon_url: embedAuthorIconInput.value.trim() || undefined
                            } : undefined
                        };
                        
                        payload.embeds = [embed];
                    }
                    
                    // Send message
                    let response;
                    
                    if (selectedFile) {
                        // Send with file
                        const formData = new FormData();
                        formData.append('payload_json', JSON.stringify(payload));
                        formData.append('file', selectedFile);
                        
                        response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                            method: 'POST',
                            headers: {
                                'Authorization': token
                            },
                            body: formData
                        });
                    } else {
                        // Send without file
                        response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                            method: 'POST',
                            headers: {
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                    }
                    
                    if (response.ok) {
                        success++;
                        addHistory('success', message || '[File]' || '[Embed]', `Target: ${targetId}`);
                    } else {
                        errors++;
                        const error = await response.json().catch(() => ({}));
                        addHistory('error', message || '[File]' || '[Embed]', error.message || 'Unknown error', `Target: ${targetId}`);
                    }
                    
                    showStatus(`Sent ${i+1}/${count} to ${targetId} (${success} OK, ${errors} failed)`, 'info');
                    
                    // Delay if not last message
                    if (i < count - 1 && delay > 0) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                } catch (err) {
                    errors++;
                    addHistory('error', message || '[File]' || '[Embed]', err.message, `Target: ${targetId}`);
                    showStatus(`Error for ${targetId}: ${err.message}`, 'error');
                }
            }
        }
    } catch (err) {
        errors++;
        addHistory('error', message || '[File]' || '[Embed]', err.message);
        showStatus(`Error: ${err.message}`, 'error');
    }
    
    // Done sending
    isSending = false;
    sendBtn.disabled = false;
    stopBtn.classList.add('hidden');
    
    if (stopRequested) {
        showStatus(`Stopped. Sent ${success} messages`, 'warning');
    } else {
        showStatus(`Done! ${success} sent, ${errors} failed`, success === (count * targetIds.length) ? 'success' : 'warning');
    }
}

async function testConnection() {
    if (connectionType.value === 'webhook') {
        const webhookElements = webhookList.querySelectorAll('.webhook-url');
        const webhooks = Array.from(webhookElements).map(el => el.value.trim()).filter(Boolean);
        
        if (webhooks.length === 0) {
            showStatus('No webhooks to test', 'error');
            return;
        }
        
        showStatus('Testing webhook connection...', 'info');
        
        try {
            const response = await fetch(webhooks[0], {
                method: 'GET'
            });
            
            if (response.status === 200) {
                showStatus('Webhook connection successful', 'success');
            } else {
                showStatus('Webhook connection failed', 'error');
            }
        } catch (err) {
            showStatus('Connection error: ' + err.message, 'error');
        }
    } else {
        const token = tokenInput.value.trim();
        
        if (!token) {
            showStatus('No token provided', 'error');
            return;
        }
        
        showStatus('Testing token connection...', 'info');
        
        try {
            const response = await fetch('https://discord.com/api/v9/users/@me', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            
            if (response.status === 200) {
                const data = await response.json();
                showStatus(`Connected as ${data.username}#${data.discriminator}`, 'success');
            } else {
                showStatus('Token connection failed', 'error');
            }
        } catch (err) {
            showStatus('Connection error: ' + err.message, 'error');
        }
    }
}

function stopSending() {
    if (isSending) {
        stopRequested = true;
        stopBtn.disabled = true;
        showStatus('Stopping...', 'warning');
    }
}

function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.style.color = 
        type === 'error' ? 'var(--error)' :
        type === 'success' ? 'var(--hacker-green)' :
        type === 'warning' ? 'var(--warning)' :
        'var(--text)';
    statusDiv.style.borderColor = 
        type === 'error' ? 'var(--error)' :
        type === 'success' ? 'var(--hacker-green)' :
        type === 'warning' ? 'var(--warning)' :
        'var(--border)';
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

function convertToMs(value, unit) {
    switch(unit) {
        case 'ms': return value;
        case 's': return value * 1000;
        case 'm': return value * 1000 * 60;
        case 'h': return value * 1000 * 60 * 60;
        case 'd': return value * 1000 * 60 * 60 * 24;
        default: return value * 1000;
    }
}

function hexToDecimal(hex) {
    return parseInt(hex.replace('#', ''), 16);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
