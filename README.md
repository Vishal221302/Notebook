# ReadTopic - Digital Study Notes Dashboard

A premium, modern web application for organizing and managing study notes. Built with a high-performance React frontend and a scalable Node.js + MongoDB backend.

## 🚀 Key Features

*   **Topic Management**: Create, Read, Update, and Delete study topics across different categories.
*   **Language Categories**: organize notes by languages/subjects (e.g., Python, JavaScript, CSS).
*   **Rich UI/UX**: Premium aesthetic with glassmorphism, dynamic transitions, and modern typography.
*   **Cloud Persistence**: All data is securely stored in MongoDB Atlas.
*   **Admin Access**: Secure login system for administrative control.

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite (for blazing fast builds), Vanilla CSS (Custom Design System).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB Atlas (Mongoose ODM).

## 📂 Project Structure

```text
ReadTopic/
├── backend/            # Express.js server & MongoDB logic
├── src/                # React components & frontend logic
├── public/             # Static assets
└── vite.config.js      # Frontend build configuration
```

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas Account

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_uri
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. From the root directory, install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open `http://localhost:5173` (default Vite port) in your browser.

## 📝 License
This project is for personal study and professional portfolio use.
