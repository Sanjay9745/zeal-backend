const Admin = require('../../models/Admin'); // Ensure the path is correct
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_ADMIN_SECRET;

// Register a new admin
module.exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the username or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        //hash password
        let hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email
        });

        // Save the admin (password will be hashed by the pre-save hook)
        await newAdmin.save();

        res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Login an admin
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create and send JWT
        const token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, jwtSecret);
        res.status(200).json({ success: true, token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Protected route example
module.exports.protected = (req, res) => {
    res.status(200).json({ success: true, message: 'You are accessing a protected route!' });
};
