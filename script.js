// Select necessary DOM elements
const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');

// Function to send a message to Rasa via the Express server
async function sendToRasa(message) {
    const response = await fetch('https://charli-1-server.onrender.com/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
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
        setTimeout(function() {
            typeWriter(element, message, i, callback);
        }, 25); // Adjust the speed here
    } else {
        callback(); // Once typing is done, execute the callback function
    }
}

// Function to handle sending message when the user clicks the send button
sendButton.addEventListener('click', async () => {
    const userMessage = inputField.value.trim(); // Remove unnecessary spaces
    if (!userMessage) return; // Prevent sending empty messages

    displayMessage('user', userMessage); // Show user's message
    inputField.value = ''; // Clear input field

    try {
        const rasaResponse = await sendToRasa(userMessage);

        // Ensure response is an array or single object
        const responses = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];

        responses.forEach((msg) => {
            if (msg.hasOwnProperty('text')) {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'bot-message'; // Add a class to style it as bot message
                chatContainer.appendChild(botMessageElement); // Add it to the chat container

                // Call the typeWriter function to simulate typing
                typeWriter(botMessageElement, msg.text, 0, () => {
                    // Once the typing is done, you can trigger any follow-up action
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        displayMessage('bot', 'Sorry, something went wrong. Please try again later.');
    }
});

// Optional: Handle pressing Enter key to send the message
inputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
