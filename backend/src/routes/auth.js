// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password_hash,
      role,
    });
    console.log("username",username);
    
    console.log("original pass", password);
    
    console.log("pass hash while signing up", password_hash);
    
    const token =await jwt.sign({username,role},process.env.JWT_SECRET);

    res.status(201).json({ message: "User registered successfully", user: newUser,token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

router.put("/update", async (req, res) => {
  try {
    const { user_id, username, password, role } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const updatedData = {};
    if (username) updatedData.username = username;
    if (role) updatedData.role = role;
    if (password) updatedData.password_hash = await bcrypt.hash(password, 10);

    await user.update(updatedData);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User Controller
router.delete("/delete", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login Controller
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    let user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    user=user.dataValues;    
    console.log(user);
    console.log("user password",password);
    console.log("hashed", user.password_hash);
    
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
    
  }
});

module.exports = router;