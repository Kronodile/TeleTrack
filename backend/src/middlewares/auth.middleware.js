
// Authentication middleware
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = await jwt.verify(token, JWT_SECRET);
        
        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            user_name: decoded.user_name,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};