const socket = io();

const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");

const joinScreen = document.getElementById("join-screen");
const chatContainer = document.getElementById("chat-container");

const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");

const messagesContainer = document.getElementById("messages-container");

const onlineCount = document.getElementById("online-count");
const userList = document.getElementById("user-list");

const typingIndicator = document.getElementById("typing-indicator");

const emojiToggle = document.getElementById("emoji-toggle");
const emojiPicker = document.getElementById("emoji-picker");

const notifySound = document.getElementById("notify-sound");

let currentUser = "";

function appendMessage(username,text,own=false){

  const div = document.createElement("div");

  div.className = own
  ? "message own"
  : "message other";

  div.innerHTML = `
  
    <div class="text">${text}</div>

    <div class="meta">
      ${username} • ${new Date().toLocaleTimeString()}
    </div>

  `;

  messagesContainer.appendChild(div);

  scrollBottom();
}

function appendSystemMessage(text){

  const div = document.createElement("div");

  div.className = "message system";

  div.innerText = text;

  messagesContainer.appendChild(div);

  scrollBottom();
}

function scrollBottom(){

  messagesContainer.scrollTop =
  messagesContainer.scrollHeight;

}

joinBtn.addEventListener("click",()=>{

  const username = usernameInput.value.trim();

  if(!username) return;

  currentUser = username;

  socket.emit("join",{username});

  joinScreen.classList.add("hidden");
  chatContainer.classList.remove("hidden");

});

sendBtn.addEventListener("click",sendMessage);

messageInput.addEventListener("keydown",(e)=>{

  if(e.key === "Enter"){
    sendMessage();
  }

});

function sendMessage(){

  const text = messageInput.value.trim();

  if(!text) return;

  socket.emit("message",{text});

  appendMessage(currentUser,text,true);

  messageInput.value = "";

}

socket.on("message",(data)=>{

  appendMessage(data.username,data.text,false);

  notifySound.play().catch(()=>{});

});

socket.on("system",(data)=>{

  appendSystemMessage(data.text);

});

socket.on("online-users",(data)=>{

  onlineCount.innerText =
  `${data.users.length} Users Online`;

  userList.innerHTML = "";

  data.users.forEach((user)=>{

    const div = document.createElement("div");

    div.className = "user-item";

    div.innerHTML = `
      🟢 ${user.username}
    `;

    userList.appendChild(div);

  });

});

socket.on("typing",(data)=>{

  if(data.isTyping){

    typingIndicator.innerText =
    `${data.username} is typing...`;

  }else{

    typingIndicator.innerText = "";

  }

});

let typingTimeout;

messageInput.addEventListener("input",()=>{

  socket.emit("typing",{
    isTyping:true
  });

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(()=>{

    socket.emit("typing",{
      isTyping:false
    });

  },1000);

});

emojiToggle.addEventListener("click",()=>{

  emojiPicker.classList.toggle("hidden");

});

document.querySelectorAll(".emoji-item")
.forEach((emoji)=>{

  emoji.addEventListener("click",()=>{

    messageInput.value += emoji.innerText;

    messageInput.focus();

  });

});