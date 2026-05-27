# 🚀 Modern Real-Time LAN Chat and User Tracking System

A modern browser-based real-time communication platform built using **Node.js, Express.js, Socket.IO, MongoDB, and Glassmorphism UI Design**.  

This project enables fast and secure communication between multiple users connected within the same Local Area Network (LAN). The system supports real-time messaging, live user tracking, voice notes, file sharing, QR-based LAN connection, and dynamic modern UI features inspired by modern messaging applications like WhatsApp and Telegram.

---

# 📌 Project Overview

The **Modern Real-Time LAN Chat and User Tracking System** is designed to provide seamless communication between devices connected on the same network.  

The application uses **Socket.IO WebSocket technology** for instant bi-directional communication without requiring page refreshes. Messages are transmitted in real time and stored inside a MongoDB database for persistence.

The project focuses on:

- Real-time communication
- LAN networking
- User activity monitoring
- File and media sharing
- Voice note support
- Responsive modern interface
- Event-driven architecture

This system can be used for:
- Educational purposes
- Office/local communication
- LAN-based messaging
- Networking projects
- Real-time system demonstrations

---

# ✨ Features

## 💬 Real-Time Messaging
- Instant communication using Socket.IO
- Low-latency LAN messaging
- Dynamic message updates

## 👥 Live User Tracking
- Displays connected users in real time
- Dynamic online device count
- Join/Leave notifications

## 🕒 Message Timestamp
- Every message contains live timestamp
- WhatsApp-style time display

## ✍️ Typing Indicator
- Shows when another user is typing

## 😊 Emoji Chat Support
- Interactive emoji picker
- Emoji message support

## 🎤 Voice Notes
- Record and send voice messages
- Browser-based audio recording

## 📁 File Sharing
Users can upload and share:
- Images
- Videos
- Audio files
- Documents

## 🖼 Media Preview
- Image preview support
- Video preview support
- Audio player integration

## 📡 QR-Based LAN Connection
- QR code generation for quick connection
- Easy device joining within LAN

## 💾 MongoDB Database Integration
- Stores chat messages
- Stores message metadata
- Persistent chat history

## 🎨 Modern Glassmorphism UI
- WhatsApp-inspired interface
- Animated network background
- Blur effects and smooth transitions

## 📱 Responsive Design
- Desktop support
- Tablet support
- Mobile support

## ⚡ Event-Driven Architecture
- Real-time socket communication
- Dynamic frontend rendering
- Live updates without reload

---

# 🛠️ Technologies Used

## Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- Multer
- QRCode

## Frontend
- HTML5
- CSS3
- JavaScript

## Development Tools
- Visual Studio Code
- MongoDB Compass
- Browser Developer Tools

---

# 📂 Project Structure

```bash
LAN-CHAT-SYSTEM/
│
├── node_modules/
│
├── public/
│   ├── uploads/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js
