require("dotenv").config();

const express = require("express");
const Database = require("better-sqlite3");
const axios = require("axios");

const app = express();

//user study question
let studyQuestions = [];
let currentQuiz = "";

const db = new Database("database.db");

console.log("Connected to SQLite database");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT
    )
`);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



// ROUTES

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});



// SIGNUP

app.post("/signup", (req, res) => {

    const { username, email, password } = req.body;

    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    try {

        const statement = db.prepare(sql);

        statement.run(username, email, password);

        console.log("User added to database");

        res.send("Signup Successful");

    } catch (err) {

        console.log(err.message);

        res.send("Error creating account");

    }

});



// LOGIN

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users WHERE email = ?
    `;

    try {

        const statement = db.prepare(sql);

        const user = statement.get(email);

        if (!user) {
            return res.send("User not found");
        }

        if (user.password !== password) {
            return res.send("Incorrect password");
        }

        res.redirect("/dashboard");

    } catch (err) {

        console.log(err.message);

        res.send("Database error");

    }

});



// AI ROUTE

app.post("/ask-ai", async (req, res) => {

    const question = req.body.question;

    studyQuestions.push(question);

    if (studyQuestions.length > 4) {
        studyQuestions.shift();
    }

    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: question
                            }
                        ]
                    }
                ]
            }
        );


        const aiResponse =
            response.data.candidates[0].content.parts[0].text;

        res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="/css/style.css">
            </head>

            <body class="dashboard-page">

                <div class="container">

                    <div class="card">

                        <h1>AI Response</h1>

                        <p>${aiResponse}</p>

                        <br>

                        <a class="btn" href="/dashboard">
                            Ask Another Question
                        </a>

                    </div>

                </div>

            </body>
            </html>
        `);

    } catch (error) {

        console.log(error.message);

        res.send("Error connecting to Gemini AI");

    }

});

//Quiz

app.get("/quiz", async (req, res) => {

    try {

        const topics = studyQuestions.join(", ");

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    `Create a 4 question quiz based on these study topics: ${topics}.
                                
                               Create a 4 question quiz based on these study topics: ${topics}.

Only show the questions.

Do NOT include answers.
                                Format clearly.`
                            }
                        ]
                    }
                ]
            }
        );

        currentQuiz =
            response.data.candidates[0].content.parts[0].text;

        res.send(`
            <html>

            <head>
                <link rel="stylesheet" href="/css/style.css">
            </head>

            <body class="dashboard-page">

                <div class="container">

                    <div class="card">

                        <h1>Quiz Me</h1>

                        <p>${currentQuiz.replace(/\n/g, "<br>")}</p>

                        <br>

                        <form action="/grade-quiz" method="POST">

                            <textarea
                                name="answers"
                                placeholder="Enter your answers here..."
                                required
                            ></textarea>

                            <br><br>

                            <button class="btn" type="submit">
                                Grade My Quiz
                            </button>

                        </form>

                    </div>

                </div>

            </body>

            </html>
        `);

    } catch (error) {

        console.log(error.message);

        res.send("Error generating quiz");

    }

});

//Grading
app.post("/grade-quiz", async (req, res) => {

    const userAnswers = req.body.answers;

    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    `
                                Here is the quiz:

                                ${currentQuiz}

                                Here are the student's answers:

                                ${userAnswers}

                                Grade the quiz.

                                Include:
                                - score out of 4
                                - correct answers
                                - explanations
                                - what the student should improve on
                                `
                            }
                        ]
                    }
                ]
            }
        );

        const grading =
            response.data.candidates[0].content.parts[0].text;

        res.send(`
            <html>

            <head>
                <link rel="stylesheet" href="/css/style.css">
            </head>

            <body class="dashboard-page">

                <div class="container">

                    <div class="card">

                        <h1>Quiz Results</h1>

                        <p>${grading.replace(/\n/g, "<br>")}</p>

                        <br>

                        <a class="btn" href="/dashboard">
                            Back To Dashboard
                        </a>

                    </div>

                </div>

            </body>

            </html>
        `);

    } catch (error) {

        console.log(error.message);

        res.send("Error grading quiz");

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});