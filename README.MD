🚆 RailConnect – Train WiFi Add-On System

RailConnect is a full-stack MERN prototype application that simulates a modern railway ticket booking system with an innovative onboard WiFi add-on service. It enhances the passenger experience by allowing users to seamlessly book tickets and optionally purchase internet access during their journey.

The project also demonstrates a conceptual approach toward future integration with Indian Railway Catering and Tourism Corporation, while currently functioning as a standalone prototype built for demonstration and learning purposes.

📌 Overview

RailConnect is designed to solve a real-world problem — the lack of reliable internet connectivity during train travel. By integrating WiFi services directly into the booking flow, this system provides a smarter, more connected, and convenient travel experience.

💡 Inspiration

During train journeys, many passengers struggle with unstable or unavailable internet access. This project is inspired by that real-life challenge and aims to provide a practical, user-centric solution by embedding WiFi services directly into railway bookings.

✨ Features
🔐 User Authentication (JWT-based login & registration)
🔍 Train Search (source → destination)
🚆 Train Listings (timing, pricing, seat availability)
🎫 End-to-End Ticket Booking Flow
📶 WiFi Add-on Option during booking
💰 Dynamic Pricing based on selected services
🧾 Booking Summary & Confirmation
📊 User Dashboard (travel history tracking)
🌙 Dark Mode / ☀️ Light Mode Toggle
🎨 Modern UI/UX (responsive & clean design)

🛠️ Tech Stack
🔹 Frontend
React.js
Tailwind CSS
Lucide React
🔹 Backend
Node.js
Express.js
🔹 Database
MongoDB (Mongoose)
🔹 Authentication
JWT (JSON Web Tokens)
BcryptJS

📂 Project Structure
RailConnect/
│── client/        # React frontend (Vite + Tailwind)
│── server/        # Express backend (MVC architecture)
│── .gitignore     # Ignored files
│── README.md      # Documentation
⚙️ Prerequisites

Make sure you have installed:

Node.js
MongoDB (local or Atlas)
🚀 Getting Started
🔧 Backend Setup
cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/railconnect
JWT_SECRET=your_jwt_secret_here

Start the backend server:

node index.js

Seed initial train data:

# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/trains/seed" -Method Post

# OR using curl
curl -X POST http://localhost:5000/api/trains/seed
💻 Frontend Setup
cd client
npm install
npm run dev
🎯 Purpose

This project demonstrates:

Full-stack development using the MERN stack
Solving a real-world problem with a practical feature
Clean and modern UI/UX design principles
API integration and authentication handling
🔮 Future Scope
💳 Payment Gateway Integration
📡 Real-time Train Data via APIs
🧠 Smart WiFi Plan Recommendations
📱 Mobile-first Optimization
🌐 Cloud Deployment & CI/CD Integration
🌍 Real-World Relevance

RailConnect is inspired by real railway systems like Indian Railway Catering and Tourism Corporation and explores how additional services like onboard WiFi can be integrated into existing booking platforms to enhance passenger convenience and digital accessibility.

👨‍💻 Author

Saket Raj

📄 License

This project is licensed under the MIT License.