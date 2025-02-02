document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.getElementById('chat-container');
    const inputField = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');
    const loadingScreen = document.getElementById('loading');  // Reference to the loading screen

    // Show the chat container after loading
    loadingScreen.style.display = 'none';  // Hide loading screen
    chatContainer.classList.remove('hidden');  // Show chat container

    // Function to send a message to Rasa via the Express server
    async function sendToRasa(message) {
        try {
            // My backend URL of server
            const backendURL = 'http://192.168.29.2:5006/api/message'; 

            const response = await fetch(backendURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during message fetch:', error);
            throw new Error('Failed to communicate with Charli. Please try again later.');
        }
    }

    // Function to display messages in the chat container
    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageElement.textContent = message;

        // Append message to the chat box
        const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }

    // Typing effect function for bot response
    function typeWriter(element, message, i, callback) {
        if (i < message.length) {
            element.textContent += message.charAt(i);
            i++;
            setTimeout(function () {
                typeWriter(element, message, i, callback);
            }, 25);
        } else {
            callback();
        }
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bot-message typing-indicator';
        typingIndicator.textContent = 'Charli is typing...';
        const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
        return typingIndicator;
    }

    // Function to hide typing indicator
    function hideTypingIndicator(typingIndicator) {
        typingIndicator.remove();
    }

    // Handle Bot Response
    async function handleBotResponse(rasaResponse) {
        const responses = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];

        const typingIndicator = showTypingIndicator();

        for (const msg of responses) {
            if (msg.hasOwnProperty('text')) {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'bot-message';
                document.getElementById('chat-box').appendChild(botMessageElement);

                await new Promise((resolve) => {
                    typeWriter(botMessageElement, msg.text, 0, resolve);
                });
            }
        }

        hideTypingIndicator(typingIndicator);
    }

    // Handle sending message when the user clicks the send button
    sendButton.addEventListener('click', async () => {
        const userMessage = inputField.value.trim();
        if (!userMessage) return;

        displayMessage('user', userMessage);
        inputField.value = ''; // Clear input field

        try {
            const rasaResponse = await sendToRasa(userMessage);
            await handleBotResponse(rasaResponse);
        } catch (error) {
            console.error(error);
            displayMessage('bot', 'Sorry, something went wrong. Please try again later.');
        }
    });

    // Handle pressing Enter key to send message
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
