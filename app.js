const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const saltRounds = 10;

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the database.");
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
});

app.use(express.json());

// Middleware de validación
const validateData = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  next();
};

// Registro de usuario (con hashing de contraseña)
app.post("/register", validateData, async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = `INSERT INTO user (email, password) VALUES (?, ?)`;

    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Registration failed" });
      }
      res.status(201).json({ success: "User registered" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login (con comparación de contraseñas hasheadas)
app.post("/login", validateData, (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM user WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: "Login successful", user: { email: user.email } });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
