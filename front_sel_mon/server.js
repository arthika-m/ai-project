
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const Student = require("./models/Student");
const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cors());

// Serve frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));


// ================= REGISTER =================

app.post("/register", async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            gender,
            hobbies,
            email,
            phone,
            city,
            address,
            password
        } = req.body;

        // Check required fields
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check whether email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Save new user
        const user = new User({
            firstname,
            lastname,
            gender,
            hobbies,
            email,
            phone,
            city,
            address,
            password
        });

        await user.save();

        console.log("Registration successful for:", email);

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed due to a server error"
        });
    }
});


// ================= LOGIN =================

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        console.log("Login attempt for:", email);

        // Find user by email first
        const user = await User.findOne({
            email: email.trim()
        });

        if (!user) {
            console.log("User not found in MongoDB");

            return res.status(401).json({
                success: false,
                message: "Email not registered"
            });
        }

        // Compare with the password stored in the current schema
        if (user.password !== password) {
            console.log("Password does not match");

            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        console.log("Login successful for:", email);

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed due to a server error"
        });
    }
});


// ================= STUDENT CRUD =================

// GET - READ ALL STUDENTS
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        return res.json(students);
    } catch (error) {
        console.error("Fetch students error:", error);
        return res.status(500).json({
            message: "Unable to fetch students"
        });
    }
});


// POST - CREATE STUDENT
app.post("/students", async (req, res) => {
    try {
        const { name, department, year } = req.body;

        if (!name || !department || !year) {
            return res.status(400).json({
                message: "Name, department and year are required"
            });
        }

        const student = new Student({
            name,
            department,
            year
        });

        const savedStudent = await student.save();

        return res.status(201).json(savedStudent);
    } catch (error) {
        console.error("Create student error:", error);
        return res.status(500).json({
            message: "Unable to create student"
        });
    }
});


// PUT - UPDATE STUDENT
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.json(updatedStudent);
    } catch (error) {
        console.error("Update student error:", error);
        return res.status(500).json({
            message: "Unable to update student"
        });
    }
});


// DELETE - DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(204).end();
    } catch (error) {
        console.error("Delete student error:", error);
        return res.status(500).json({
            message: "Unable to delete student"
        });
    }
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
