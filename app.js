const socket = io();

/* =========================
   VARIABLES
========================= */

let username = "";

let mediaRecorder;

let audioChunks = [];

let isRecording = false;

/* =========================
   JOIN CHAT
========================= */

function joinChat(){

  username =
document
.getElementById("username")
.value.trim();

  if(username === ""){

    alert("Enter Username");

    return;
  }

  socket.emit(
    "join",
    username
  );

  document
  .getElementById("joinScreen")
  .style.display = "none";

  document
  .getElementById("chatContainer")
  .classList.remove("hidden");
}

/* =========================
   SEND MESSAGE
========================= */

function sendMessage(){

  const input =
  document
  .getElementById("messageInput");

  const message =
  input.value;

  if(message.trim() === "") return;

  socket.emit("chatMessage",{

    username,

    message,

    time:new Date()
    .toLocaleTimeString([],{
  hour:'2-digit',
  minute:'2-digit'
}),

    seen:true
  });

  input.value = "";
}

/* =========================
   RECEIVE MESSAGE
========================= */

socket.on("chatMessage",(data)=>{

  addMessage(data);
});

/* =========================
   OLD MESSAGES
========================= */

socket.on("oldMessages",(msgs)=>{

  document
  .getElementById("messages")
  .innerHTML = "";

  msgs.forEach(msg=>{

    addMessage(msg);
  });
});

/* =========================
   ADD MESSAGE
========================= */

function addMessage(data){

  const div =
  document.createElement("div");

  div.classList.add("message");

 if(data.username === username){

  div.classList.add("own");

}

else{

  div.classList.add("other");
}

/* SYSTEM */

if(data.username === "SYSTEM"){

  div.classList.add("system");
}

div.innerHTML = `

<div class="username">

  ${data.username}

</div>

<div class="text message-content">

  ${data.message}

</div>

<div class="meta">

  <span class="time">

    ${data.time}

  </span>

  <span class="tick">

    ✓✓

  </span>

</div>
`;

  document
  .getElementById("messages")
  .appendChild(div);

  div.scrollIntoView({

    behavior:"smooth"
  });
}

/* =========================
   USERS
========================= */

socket.on("users",(users)=>{

  const usersDiv =
  document
  .getElementById("users");

  usersDiv.innerHTML = "";

  users.forEach(user=>{

    const div =
    document.createElement("div");

    div.classList.add("user-item");

    div.innerHTML = `

      🟢 ${user}

    `;

    usersDiv.appendChild(div);
  });

  document
  .getElementById("onlineCount")
  .innerText =
  users.length;

  document
  .getElementById("deviceCount")
  .innerText =
  users.length;
});

/* =========================
   TYPING
========================= */

document
.getElementById("messageInput")
.addEventListener("keypress",(e)=>{

  if(e.key === "Enter"){

    sendMessage();
  }

  socket.emit(
    "typing",
    username
  );
});

socket.on("typing",(user)=>{

  document
  .getElementById("typing")
  .innerText =

  `${user} is typing...`;

  setTimeout(()=>{

    document
    .getElementById("typing")
    .innerText =

    "Online";

  },1500);
});

/* =========================
   FILE SHARE
========================= */

document
.getElementById("fileInput")
.addEventListener(
"change",

async function(){

  const file =
  this.files[0];

  if(!file) return;

  const formData =
  new FormData();

  formData.append(
    "file",
    file
  );

  const res =
  await fetch("/upload",{

    method:"POST",

    body:formData
  });

  const data =
  await res.json();

  let content = "";

  /* IMAGE */

  if(
    file.type
    .startsWith("image/")
  ){

    content = `

    <img
    src="/uploads/${data.file}"

    style="
    width:240px;
    border-radius:22px;
    margin-top:8px;
    ">
    `;
  }

  /* AUDIO */

  else if(
    file.type
    .startsWith("audio/")
  ){

    content = `

    <audio
    controls
    style="
    width:240px;
    margin-top:8px;
    ">

    <source
    src="/uploads/${data.file}">

    </audio>
    `;
  }

  /* VIDEO */

  else if(
    file.type
    .startsWith("video/")
  ){

    content = `

    <video
    controls
    style="
    width:260px;
    border-radius:20px;
    margin-top:8px;
    ">

    <source
    src="/uploads/${data.file}">

    </video>
    `;
  }

  /* NORMAL FILE */

  else{

    content = `

    <a
    href="/uploads/${data.file}"
    target="_blank">

    📁 ${file.name}

    </a>
    `;
  }

  socket.emit("chatMessage",{

    username,

    message:content,

    time:new Date()
    .toLocaleTimeString([],{
  hour:'2-digit',
  minute:'2-digit'
}),

    seen:true
  });
});

/* =========================
   DRAG DROP
========================= */

const messagesArea =
document.getElementById("messages");

messagesArea
.addEventListener(
"dragover",

(e)=>{

  e.preventDefault();

  messagesArea.style.border =
  "2px dashed #ff9ac7";
});

messagesArea
.addEventListener(
"dragleave",

()=>{

  messagesArea.style.border =
  "none";
});

messagesArea
.addEventListener(
"drop",

(e)=>{

  e.preventDefault();

  messagesArea.style.border =
  "none";

  document
  .getElementById("fileInput")
  .files =
  e.dataTransfer.files;

  const event =
  new Event("change");

  document
  .getElementById("fileInput")
  .dispatchEvent(event);
});

/* =========================
   VOICE NOTE
========================= */

async function startRecording(){

  try{

    if(!isRecording){

      const stream =

      await navigator
      .mediaDevices
      .getUserMedia({

        audio:true
      });

      mediaRecorder =
      new MediaRecorder(stream);

      audioChunks = [];

      mediaRecorder.start();

      isRecording = true;

      const micBtn =

      document
      .querySelector(".mic-btn");

      micBtn.innerText = "⏹";

      micBtn
      .classList
      .add("recording");

      mediaRecorder
      .ondataavailable = (e)=>{

        audioChunks.push(e.data);
      };

      mediaRecorder.onstop =
      async()=>{

        const audioBlob =

        new Blob(audioChunks,{

          type:"audio/webm"
        });

        const formData =
        new FormData();

        formData.append(

          "file",

          audioBlob,

          `voice-${Date.now()}.webm`
        );

        const upload =

        await fetch("/upload",{

          method:"POST",

          body:formData
        });

        const result =

        await upload.json();

        socket.emit("chatMessage",{

          username,

          message:`

          <audio
          controls
          style="
          width:240px;
          margin-top:8px;
          ">

          <source
          src="/uploads/${result.file}"
          type="audio/webm">

          </audio>
          `,

          time:new Date()
         .toLocaleTimeString([],{
  hour:'2-digit',
  minute:'2-digit'
}),

          seen:true
        });

        micBtn.innerText = "🎤";

        micBtn
        .classList
        .remove("recording");

        isRecording = false;
      };

    }else{

      mediaRecorder.stop();
    }

  }catch(err){

    console.log(err);

    alert(

      "Microphone permission denied"
    );
  }
}

/* =========================
   QR CODE
========================= */

function openQR(){

  window.open("/qr");
}
