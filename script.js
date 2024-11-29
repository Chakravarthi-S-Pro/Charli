// Select necessary DOM elements
document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.getElementById('chat-container');
    const inputField = document.getElementById('input-field');
    const sendButton = document.getElementById('send-button');

    // Function to send a message to Rasa via the Express server
    async function sendToRasa(message) {
        try {
            const response = await fetch('https://charli-1-server.onrender.com/api/message', {
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
            throw new Error('Failed to communicate with the bot. Please try again later.');
        }
    }

    // Function to display messages in the chat container immediately
    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom
    }

    // Typing effect function for bot response (with a fast typing effect)
    function typeWriter(element, message, i, callback) {
        if (i < message.length) {
            element.textContent += message.charAt(i); // Add one character at a time
            i++;
            setTimeout(function () {
                typeWriter(element, message, i, callback);
            }, 25); // Adjust the speed here
        } else {
            callback(); // Once typing is done, execute the callback function
        }
    }

    // Function to show "Bot is typing..." indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bot-message typing-indicator';
        typingIndicator.textContent = 'Bot is typing...';
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom
        return typingIndicator;
    }

    // Function to hide "Bot is typing..." indicator
    function hideTypingIndicator(typingIndicator) {
        typingIndicator.remove();
    }

    // Typing effect and message display in one function
    async function handleBotResponse(rasaResponse) {
        const responses = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];

        // Show typing indicator while waiting for the bot response
        const typingIndicator = showTypingIndicator();

        // Iterate over responses
        for (const msg of responses) {
            if (msg.hasOwnProperty('text')) {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'bot-message'; // Add a class to style it as bot message
                chatContainer.appendChild(botMessageElement); // Add it to the chat container

                // Call the typeWriter function to simulate typing
                await new Promise((resolve) => {
                    typeWriter(botMessageElement, msg.text, 0, resolve); // Wait for typing animation to complete
                });
            }
        }

        // Hide typing indicator after response is displayed
        hideTypingIndicator(typingIndicator);
    }

    // Function to handle sending message when the user clicks the send button
    sendButton.addEventListener('click', async () => {
        const userMessage = inputField.value.trim(); // Remove unnecessary spaces
        if (!userMessage) return; // Prevent sending empty messages