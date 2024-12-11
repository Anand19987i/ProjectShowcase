import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Assumes token is passed as Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
        req.userId = decoded.id; // Attach the decoded user data to req.user
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
export default isAuthenticated;
