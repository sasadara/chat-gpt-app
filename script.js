let messages = [];

document.getElementById('userInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});


function displayMessage(content, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${sender}`;

    if (content.includes("```")) {
        const parts = content.split("```");
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                messageContainer.innerHTML += marked.parse(part);
            } else {
                const codeContainer = document.createElement('div');
                codeContainer.className = 'code-container';

                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = part;
                pre.appendChild(code);

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(part).then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => copyButton.textContent = 'Copy', 2000);
                    });
                };

                codeContainer.appendChild(pre);
                codeContainer.appendChild(copyButton);
                messageContainer.appendChild(codeContainer);
            }
        });
    } else {
        messageContainer.innerHTML = marked.parse(content);
    }

    document.getElementById('chatMessages').appendChild(messageContainer);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}



async function sendMessage() {
    const apiKey = document.getElementById('apiKey').value;
    // const apiKey = "";
    const model = document.getElementById('model').value;
    const userInput = document.getElementById('userInput').value;

    if (!apiKey || !model || !userInput) {
        alert("Please enter API key, select model, and type a message.");
        return;
    }

    displayMessage(userInput, 'user');
    messages.push({ role: 'user', content: userInput });
    document.getElementById('userInput').value = '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: messages
        })
    });

    const data = await response.json();
    const botMessage = data.choices[0].message.content;
    displayMessage(botMessage, 'bot');
    messages.push({ role: 'assistant', content: botMessage });
}

// document.getElementById('userInput').addEventListener('paste', handlePaste);
// document.getElementById('userInput').addEventListener('keydown', function (event) {
//     if (event.key === 'Enter') {
//         sendMessage();
//     }
// });

// document.getElementById('imageInput').addEventListener('change', handleFileSelect);

// function handlePaste(event) {
//     const items = event.clipboardData.items;
//     for (const item of items) {
//         if (item.type.indexOf('image') !== -1) {
//             const file = item.getAsFile();
//             uploadImage(file);
//         }
//     }
// }

// function handleFileSelect(event) {
//     const file = event.target.files[0];
//     if (file) {
//         uploadImage(file);
//     }
// }

// function uploadImage(file) {
//     const reader = new FileReader();
//     reader.onload = function (event) {
//         const imageDataUrl = event.target.result;
//         displayMessage(`<img src="${imageDataUrl}" alt="User Image" style="max-width: 200px; max-height: 200px;">`, 'user');
//         messages.push({ role: 'user', content: imageDataUrl });

//         sendMessage(imageDataUrl);  // Send the image data URL to the API
//     };
//     reader.readAsDataURL(file);
// }

// async function sendMessage(imageDataUrl) {
//     const apiKey = "";
//     const model = document.getElementById('model').value;
//     const userInput = document.getElementById('userInput').value;

//     if (!apiKey || !model || (!userInput && !imageDataUrl)) {
//         alert("Please enter API key, select model, and type a message or paste an image.");
//         return;
//     }

//     const userMessage = imageDataUrl || userInput;

//     displayMessage(userMessage, 'user');
//     messages.push({ role: 'user', content: userMessage });
//     document.getElementById('userInput').value = '';

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             model: model,
//             messages: messages
//         })
//     });

//     const data = await response.json();
//     const botMessage = data.choices[0].message.content;
//     displayMessage(botMessage, 'bot');
//     messages.push({ role: 'assistant', content: botMessage });
// }

function clearSession() {
    messages = [];
    document.getElementById('chatMessages').innerHTML = '';
}