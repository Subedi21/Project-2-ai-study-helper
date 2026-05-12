# AI Tutoring Study Helper By Lochana Subedi BCS377

## Project Description

This project is a full stack AI Tutoring Study Helper web app where users can create an account, login, and ask study questions using Google Gemini AI. The AI gives responses back to help explain concepts, answer questions, and help users study. I made this project using the technologies we learned throughout the semester like Node.js, Express.js, APIs, EJS, frontend design, and databases.
---

# Technologies Used

## Frontend
- HTML | CSS | JavaScript | EJS

## Backend
- Node.js | Express.js

## Database
- SQLite

## AI API
- Google Gemini API

## Hosting
- Render

## Version Control
- GitHub

---

# Features

Signup page | Login page | AI dashboard | Gemini AI integration | SQLite database | User authentication | Styled frontend with custom backgrounds and colors | Online deployment using Render

---

# Database Schema

## Users Table

| Column | Type |
|---|---|
| id | INTEGER |
| username | TEXT |
| email | TEXT |
| password | TEXT |

---

# How To Run The Project

First install all packages:

```bash
npm install
```

Then run the server:

```bash
node server.js
```

Then open:

```txt
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file and add:

```env
GEMINI_API_KEY=your_api_key_here
```

---

# Live Website

https://project-2-ai-study-helper.onrender.com

---

# GitHub Repository

https://github.com/Subedi21/Project-2-ai-study-helper.git

# Test Login

Email: test@gmail.com
Password: Test123