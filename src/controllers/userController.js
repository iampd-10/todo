import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
dotenv.config();

export const register = async (req, res) => {
  try {
   
    let { userName, email, password } = req.body;
    userName = userName?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!userName || userName.length < 3 || userName.length > 8) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 8 characters",
      });
    }

    if (!email || !email.endsWith("@gmail.com")) {
      return res.status(400).json({
        success: false,
        message: "Email must be a valid Gmail address (ends with @gmail.com)",
      });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, contain one special character, and one number",
      });
    }

    const existing = await userSchema.findOne({ email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "1m",
    });

    verifyEmail(token, email, userName, password);
    user.token = token;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      } else if (passwordCheck && user.isVerified === true) {
        const accessToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "10days",
          }
        );

        const refreshToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "30days",
          }
        );

        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User Logged in Successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        });
      } else {
        res.status(401).json({
          message: "Complete Email verification then Login..",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reverifyUser = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { email } = req.body;

    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified === true) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "15m",
    });
    console.log(`Generated token: ${token}`);
    verifyEmail(token, user.email, user.userName, user.password);
    user.token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification email sent again",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {}
