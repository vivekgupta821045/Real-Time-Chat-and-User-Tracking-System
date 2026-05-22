# Real-Time Chat and User Tracking System

A browser-based real-time communication platform built using Node.js, Express.js, Socket.IO, and MySQL. This project enables instant messaging, live user tracking, and real-time communication within a local network environment. 

---

## 📌 Project Overview

The **Real-Time Chat and User Tracking System** is designed to provide fast and efficient communication between users over a LAN or local environment. The application uses WebSocket technology through Socket.IO to deliver instant message transmission without page refresh. 

The system supports:

* Real-time messaging
* Online user tracking
* Typing indicators
* Dynamic user updates
* Database storage for messages and users

---

## 🚀 Features

* ⚡ Instant real-time messaging
* 👥 Online user tracking
* ✍️ Typing indicator support
* 💾 MySQL database integration
* 📱 Responsive user interface
* 🔄 Dynamic socket communication
* 🧠 Event-driven architecture




---

## 🛠️ Technologies Used

### Backend

* Node.js
* Express.js
* Socket.IO
* MySQL

### Frontend

* HTML
* CSS
* JavaScript

### Development Tools

* Visual Studio Code
* Web Browser



---

## 📂 Project Structure

```bash
project-folder/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
└── database.sql
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure MySQL Database

Create a MySQL database and import required tables.

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    socket_id VARCHAR(255),
    username VARCHAR(100),
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP NULL,
    status VARCHAR(20)
);
```

### Messages Table

```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```



---

## ▶️ Run the Project

```bash
node server.js
```

Open your browser and visit:

```bash
http://localhost:3000
```

---

## 🔄 Working Procedure

1. User opens the application
2. User enters a username
3. Socket connection is established
4. User joins the chat room
5. Messages are transmitted instantly
6. Messages are stored in the database
7. Online users update dynamically
8. Disconnect events are recorded



---

## 🧪 Testing

The application was tested successfully for:

* User joining
* Real-time message delivery
* Online user display
* Database storage
* Disconnect handling



---

## 📈 Future Enhancements

* User authentication
* Private chat system
* Voice & video calling
* Media/file sharing
* Group chat support
* Notification system
* Cloud deployment
* Mobile application support
* End-to-end encryption



---

## 🎯 Advantages

* Fast communication
* Lightweight architecture
* Easy-to-use interface
* Efficient database handling
* Real-time user updates



---

## 📚 Learning Outcomes

This project helped in understanding:

* Real-time networking concepts
* WebSocket communication
* Client-server architecture
* Database connectivity
* Event-driven programming
* Modern web application development



---

## 👨‍💻 Author

**Vivek Gupta**
Computer Science & Engineering
Arka Jain University, Jamshedpur

---

## 📄 License

This project is developed for educational and academic purposes.
