console.log("Script Loaded");

const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message

// API configuration
const SERVER_URL = "https://personal-assistant-backend.onrender.com/assistant"; // Your deployed server URL here

// Function to generate a unique ID
const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Create a chat <li> element with passed message and className
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  
  // Define the content based on message type
  let chatContent;
  if (className === "outgoing") {
    chatContent = `
      <p>${message}</p>
    `;
  } else {
    chatContent = `
      <img src="https://www.internetandtechnologylaw.com/files/2019/06/iStock-872962368-chat-bots.jpg" alt="AI Avatar" class="avatar">
      <p>${message}</p>
    `;
  }
  
  chatLi.innerHTML = chatContent;
  return chatLi; // return chat <li> element
};

// Function to auto-scroll to the bottom of the chatbox
const scrollToBottom = () => {
  chatbox.scrollTop = chatbox.scrollHeight;
};

const sessionId = localStorage.getItem('session_id') || generateUniqueId();
localStorage.setItem('session_id', sessionId);

const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMessage,
      language:"English",
      sessionId: sessionId
    }),
  };
  console.log(sessionId)
  try {
    const response = await fetch(SERVER_URL, requestOptions);
    const data = await response.json();
    messageElement.textContent = data.response || "No response"; // Display the generated response
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = "Sorry, something went wrong.";
  }

  // Ensure the chatbox scrolls to the latest message
  scrollToBottom();
};

const toggleChatbot = () => {
  console.log("Toggle Chatbot Clicked");
  document.body.classList.toggle("show-chatbot");
  if (document.body.classList.contains("show-chatbot")) {
    console.log("Chatbot is now visible");
    chatInput.focus();
  } else {
    console.log("Chatbot is now hidden");
  }
};

// Function to handle clicks outside the chatbot container

const handleChat = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (chatInput.value.trim()) {
      userMessage = chatInput.value.trim();
      chatbox.appendChild(createChatLi(userMessage, "outgoing"));
      chatInput.value = "";

      // Simulate a chatbot response
      chatbox.appendChild(createChatLi("Loading...", "incoming"));
      scrollToBottom(); // Scroll to the latest message
      const latestChat = chatbox.querySelector(".chat.incoming:last-of-type");
      generateResponse(latestChat);
    }
  }
};

const handleSendChat = () => {
  if (chatInput.value.trim()) {
    userMessage = chatInput.value.trim();
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";

    // Simulate a chatbot response
    chatbox.appendChild(createChatLi("Loading...", "incoming"));
    scrollToBottom(); // Scroll to the latest message
    const latestChat = chatbox.querySelector(".chat.incoming:last-of-type");
    generateResponse(latestChat);
  }
};

chatInput.addEventListener("keydown", handleChat);
sendChatBtn.addEventListener("click", handleSendChat);
closeBtn.addEventListener("click", toggleChatbot);
