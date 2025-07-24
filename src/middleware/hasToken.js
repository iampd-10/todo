import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";


export const hasToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log("authhh", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing or invalid",
            });
        } else {
            const token = authHeader.split(" ")[1];

            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(400).json({
                            success: false,
                            message:
                                "Access token has expired, use refreshToken to generate again",
                        });
                    } else
                        return res.status(400).json({
                            success: false,
                            message: "Access token is missing or invalid",
                        });
                } else {
                    const { id } = decoded;
                    const user = await userSchema.findById(id);
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "user not found",
                        });
                    }
                    req.userId = user._id;
                    next();
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Could not access",
        });
    }
};