# AI Tutoring Study Helper + Quizer

This project is a full stack AI tutoring/study helper web app where users can create an account, login, ask study questions, and get responses back using Google Gemini AI. I wanted to make something that felt more like a study tool instead of just a basic chatbot, so I also added a quiz me section where the AI can generate quiz questions based on topics the user was studying and grade the answers after.

I made this project using the stuff we learned throughout the semester like Node.js, Express.js, APIs, EJS, frontend styling, and databases.

Technologies Used

Frontend:
- HTML
- CSS
- JavaScript
- EJS

Backend:
- Node.js
- Express.js

Database:
- SQLite using better-sqlite3

API:
- Google Gemini AI API

Hosting:
- Render

Version Control:
- GitHub

Features

- User signup page
- User login page
- AI study dashboard
- Gemini AI integration
- Quiz me feature
- Quiz grading and feedback
- SQLite database for storing users
- Styled frontend with custom backgrounds/colors
- Hosted online using Render

Database

The project uses SQLite for the database. User information like usernames, emails, and passwords are stored inside the database.db file. SQLite is connected through Node.js using the better-sqlite3 package in server.js.

Users Table:
- id
- username
- email
- password

How to Run the Project

Install packages first:

```bash
npm install
```

Run the server:

```bash
node server.js
```

Then open:

```txt
http://localhost:3000
```

Environment Variables

Create a .env file and add:

```env
GEMINI_API_KEY=your_api_key_here
```

Live Website

https://project-2-ai-study-helper.onrender.com

GitHub Repository

https://github.com/Subedi21/Project-2-ai-study-helper.git

Test Login
Email: test@gmail.com
Password: Test123