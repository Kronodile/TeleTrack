import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/connectToDatabase";


const JWT_SECRET = process.env.JWT_SECRET || 'secret is a secret';
const SALT_ROUNDS = 10;

async function signup(req, res) {
    try {
        const { user_name, password, role } = req.body;

        // Validate required fields
        if (!user_name || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT user_name FROM users WHERE user_name = ?',
            [user_name]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        let result=null;
        db.query(
            'INSERT INTO users (user_name, password, role) VALUES (?, ?, ?)',
            [user_name, hashedPassword, role]
        ,(err,results)=>{
            if(err){
                throw err;
            }
            result=results
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertId, user_name, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
}

// Login controller
async function login(req, res) {
    try {
        const { user_name, password } = req.body;

        // Validate required fields
        if (!user_name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        let result=null;
        // Find user
        db.query(
            'SELECT * FROM users WHERE user_name = ?',
            [user_name]
        ,(err,results)=>{
            if(err){
                throw err;
            }
            result = results;
        });
        const users=result.users;
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, user_name: user.user_name, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
}

export {signup,login}

