// Select necessary DOM elements
const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');

// Function to send a message to Rasa via the Express server
async function sendToRasa(message) {
<<<<<<< HEAD
    const response = await fetch('https://charli-1-server.onrender.com/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
    });
=======
    const response = await fetch('https://charli-1-server.onrender.com/api/message', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message }),
});
>>>>>>> 29dc9c082a1e0f425746e197d9ef5c9691bb5f9c

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
}

<<<<<<< HEAD
// Function to display messages in the chat container with typing effect
=======
// Function to display messages in the chat container
>>>>>>> 29dc9c082a1e0f425746e197d9ef5c9691bb5f9c
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    chatContainer.appendChild(messageElement);
    
    let i = 0;
    const typingEffect = setInterval(() => {
        messageElement.textContent += message.charAt(i);
        i++;
        if (i > message.length) {
            clearInterval(typingEffect); // Stop typing effect once done
        }
    }, 50); // Adjust typing speed here (in ms)
}

// Function to handle sending message when the user clicks the send button
sendButton.addEventListener('click', async () => {
    const userMessage = inputField.value.trim(); // Remove unnecessary spaces
    if (!userMessage) return; // Prevent sending empty messages

    displayMessage('user', userMessage); // Display user message
    inputField.value = ''; // Clear input field

    // Show typing indication from the bot
    displayMessage('bot', 'Charli is typing...');

    try {
<<<<<<< HEAD
        const rasaResponse = await sendToRasa(userMessage); // Get response from Rasa
        
        // Clear "typing..." message
        chatContainer.lastChild.textContent = ''; // Clear "Charli is typing..." message

        // Ensure response is an array or single object
        const responses = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];

        responses.forEach((msg) => {
=======
        const rasaResponse = await sendToRasa(userMessage);
        
        // Ensure response is an array or single object
        const responses = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];
        
        responses.forEach((msg) => {
            // Check if the message contains 'text' property
>>>>>>> 29dc9c082a1e0f425746e197d9ef5c9691bb5f9c
            if (msg.hasOwnProperty('text')) {
                displayMessage('bot', msg.text); // Display bot's reply
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
