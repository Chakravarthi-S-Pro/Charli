// Select necessary DOM elements
const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');

// Function to send a message to Rasa via the Express server
async function sendToRasa(message) {
    const response = await fetch('https://charli-1-server.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
}


// Function to display messages in the chat container
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
}

// Function to handle sending message when the user clicks the send button
sendButton.addEventListener('click', async () => {
    const userMessage = inputField.value;
    if (!userMessage) return; // Prevent sending empty messages

    displayMessage('user', userMessage);
    inputField.value = ''; // Clear input field

    try {
        const rasaResponse = await sendToRasa(userMessage);
        rasaResponse.forEach((msg) => {
            // Check if the message contains 'text' property
            if (msg.hasOwnProperty('text')) {
                displayMessage('bot', msg.text);
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




/*
// Get references to the DOM elements
const questionInput = document.getElementById('userInput'); // Changed from 'question' to 'userInput'
const askButton = document.getElementById('send-button'); // Changed from 'ask' to 'send-button'
const answerOutput = document.getElementById('answer'); // Keep this ID as 'answer'

// Function to handle button click
askButton.addEventListener('click', async () => {
  const question = questionInput.value; // Get the user's question

  // Validate the input
  if (!question) {
    answerOutput.textContent = 'Please enter a question.';
    return;
  }

  // Send a POST request to the server
  try {
    const response = await fetch('http://localhost:3000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json(); // Parse the JSON response
    answerOutput.textContent = data.answer; // Display the answer
  } catch (error) {
    console.error('Error:', error);
    answerOutput.textContent = 'An error occurred. Please try again later.';
  }
});
*/
