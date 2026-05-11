require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const axios = require("axios");

const db = new sqlite3.Database("./database.db", (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to SQLite database");
    }

});

db.run(`
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

    db.run(sql, [username, email, password], function(err) {

        if (err) {
            console.log(err.message);
            return res.send("Error creating account");
        }

        console.log("User added to database");

        res.send("Signup Successful");

    });

});



// LOGIN

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users WHERE email = ?
    `;

    db.get(sql, [email], (err, user) => {

        if (err) {
            console.log(err.message);
            return res.send("Database error");
        }

        if (!user) {
            return res.send("User not found");
        }

        if (user.password !== password) {
            return res.send("Incorrect password");
        }

        res.redirect("/dashboard");

    });

});

app.post("/ask-ai", async (req, res) => {

    const question = req.body.question;

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
            <h1>AI Response</h1>
            <p>${aiResponse}</p>

            <br>

            <a href="/dashboard">Ask Another Question</a>
        `);

    } catch (error) {

        console.log(error.message);

        res.send("Error connecting to Gemini AI");

    }

});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});