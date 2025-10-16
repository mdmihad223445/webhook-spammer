// Add these new DOM elements at the top
const tokenList = document.getElementById('token-list');
const addTokenBtn = document.getElementById('add-token');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const clearFilesBtn = document.getElementById('clear-files');

// State
let selectedFiles = [];

// Add event listeners
addTokenBtn.addEventListener('click', addTokenField);
fileInput.addEventListener('change', updateFileList);
clearFilesBtn.addEventListener('click', clearFiles);

// New functions for token management
function addTokenField() {
    const div = document.createElement('div');
    div.className = 'token-item';
    div.innerHTML = `
        <input type="password" class="token" placeholder="User or Bot Token">
        <button class="remove-token">-</button>
    `;
    tokenList.appendChild(div);
    
    div.querySelector('.remove-token').addEventListener('click', function() {
        if (tokenList.children.length > 1) {
            div.remove();
        } else {
            showStatus('You must have at least one token', 'error');
        }
    });
}

// New functions for file management
function updateFileList() {
    selectedFiles = Array.from(fileInput.files);
    renderFileList();
    updatePreview();
}

function renderFileList() {
    fileList.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        fileList.innerHTML = '<div class="file-info">No files selected</div>';
        return;
    }
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item-info">
                <div class="file-item-name">${file.name}</div>
                <div class="file-item-size">(${formatFileSize(file.size)})</div>
                <div class="file-item-remove" data-index="${index}">✕</div>
            </div>
        `;
        fileList.appendChild(fileItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.file-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            selectedFiles.splice(index, 1);
            renderFileList();
            updatePreview();
        });
    });
}

function clearFiles() {
    selectedFiles = [];
    fileInput.value = '';
    renderFileList();
    updatePreview();
}

// Update the send functions to handle multiple tokens and files
async function sendWebhookMessages() {
    const webhookElements = webhookList.querySelectorAll('.webhook-url');
    const webhooks = Array.from(webhookElements).map(el => el.value.trim()).filter(Boolean);
    
    // ... rest of validation
    
    // Build payload
    const payload = {
        content: message || undefined,
        tts: tts
    };
    
    // Add embed if enabled
    if (enableEmbedCheckbox.checked) {
        // ... embed building code
        payload.embeds = [embed];
    }
    
    // Send to all webhooks
    for (const webhook of webhooks) {
        if (stopRequested) break;
        
        try {
            let response;
            const formData = new FormData();
            
            if (selectedFiles.length > 0) {
                // Add files to form data
                selectedFiles.forEach(file => {
                    formData.append('file', file);
                });
                formData.append('payload_json', JSON.stringify(payload));
                
                response = await fetch(webhook, {
                    method: 'POST',
                    body: formData
                });
            } else {
                // Send without files
                response = await fetch(webhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            
            // ... rest of response handling
        } catch (err) {
            // ... error handling
        }
    }
    // ... rest of function
}

async function sendTokenMessages() {
    const tokenElements = tokenList.querySelectorAll('.token');
    const tokens = Array.from(tokenElements).map(el => el.value.trim()).filter(Boolean);
    const targetIdElements = targetIdList.querySelectorAll('.target-id');
    const targetIds = Array.from(targetIdElements).map(el => el.value.trim()).filter(Boolean);
    const messageType = messageTypeSelect.value;
    
    if (tokens.length === 0 || targetIds.length === 0) {
        showStatus('At least one token and target ID are required', 'error');
        return;
    }
    
    // ... rest of validation
    
    // Start sending
    isSending = true;
    stopRequested = false;
    sendBtn.disabled = true;
    stopBtn.classList.remove('hidden');
    
    showStatus(`Sending ${count} messages to ${targetIds.length} targets using ${tokens.length} tokens...`, 'info');
    
    let success = 0;
    let errors = 0;
    
    try {
        // Process each token
        for (const token of tokens) {
            if (stopRequested) break;
            
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
                        addHistory('error', `Failed to create DM for ${targetId} with token ${token.substring(0, 10)}...`, err.message);
                        continue;
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
                            // ... embed building code
                            payload.embeds = [embed];
                        }
                        
                        // Send message
                        let response;
                        const formData = new FormData();
                        
                        if (selectedFiles.length > 0) {
                            // Add files to form data
                            selectedFiles.forEach(file => {
                                formData.append('file', file);
                            });
                            formData.append('payload_json', JSON.stringify(payload));
                            
                            response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': token
                                },
                                body: formData
                            });
                        } else {
                            // Send without files
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
                            addHistory('success', message || '[Files]' || '[Embed]', `Token: ${token.substring(0, 10)}..., Target: ${targetId}`);
                        } else {
                            errors++;
                            const error = await response.json().catch(() => ({}));
                            addHistory('error', message || '[Files]' || '[Embed]', error.message || 'Unknown error', `Token: ${token.substring(0, 10)}..., Target: ${targetId}`);
                        }
                        
                        showStatus(`Sent ${i+1}/${count} to ${targetId} (${success} OK, ${errors} failed)`, 'info');
                        
                        // Delay if not last message
                        if (i < count - 1 && delay > 0) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    } catch (err) {
                        errors++;
                        addHistory('error', message || '[Files]' || '[Embed]', err.message, `Token: ${token.substring(0, 10)}..., Target: ${targetId}`);
                        showStatus(`Error for ${targetId}: ${err.message}`, 'error');
                    }
                }
            }
        }
    } catch (err) {
        errors++;
        addHistory('error', message || '[Files]' || '[Embed]', err.message);
        showStatus(`Error: ${err.message}`, 'error');
    }
    
    // Done sending
    isSending = false;
    sendBtn.disabled = false;
    stopBtn.classList.add('hidden');
    
    if (stopRequested) {
        showStatus(`Stopped. Sent ${success} messages`, 'warning');
    } else {
        showStatus(`Done! ${success} sent, ${errors} failed`, success === (count * targetIds.length * tokens.length) ? 'success' : 'warning');
    }
}

// Update the preview function to show multiple files
function updatePreview() {
    // ... existing preview code
    
    // Update file preview
    if (selectedFiles.length > 0) {
        previewFile.innerHTML = selectedFiles.map(file => 
            `Attachment: ${file.name} (${formatFileSize(file.size)})`
        ).join('<br>');
        previewFile.classList.remove('hidden');
    } else {
        previewFile.classList.add('hidden');
    }
}

// Initialize
addWebhookField();
addTokenField();
addTargetIdField();
updatePreview();
