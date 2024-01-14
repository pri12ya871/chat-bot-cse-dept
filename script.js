document.getElementById('chat-toggle').addEventListener('click', function () {
    document.getElementById('chatbot-container').classList.toggle('open');
});

document.getElementById("chat-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    var userInput = document.getElementById("chat-input").value;

    // Append user message to chat
    appendMessage("User", userInput, true);

    // Send the user message to the backend for processing and receive the chatbot's response
    fetch('/answer', {  // Update the endpoint to match your Flask server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_question: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        // Append chatbot response to chat
        appendMessage("DHARA", data.answer, false);
    });

    // Clear the user input field
    document.getElementById("chat-input").value = "";
}

function appendMessage(sender, message, isUser) {
    var chatBody = document.getElementById("chat-body");

    var messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "chatbot-message";
    messageDiv.innerHTML = "<strong>" + sender + ":</strong> " + message;

    chatBody.appendChild(messageDiv);

    // Scroll to the bottom to show the latest message
    chatBody.scrollTop = chatBody.scrollHeight;
}