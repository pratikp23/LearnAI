
import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken || !verifyToken.userId) {
            return res.status(401).json({ message: "User doesn't have valid token" });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        console.log("isAuth error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;