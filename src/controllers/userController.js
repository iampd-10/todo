import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import { reVerifyEmail } from "../reVerifyEmail/reVerifyEmail.js";
import {
  loginValidator,
  userRegisterValidator,
  updateUserValidator
} from "../validator/userRegisterValidator.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    console.log("Registering user:", userName, email);

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { error } = userRegisterValidator.validate({
      userName,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
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
      expiresIn: "15m",
    });

    verifyEmail(token, email, userName, password);

    console.log(`Generated token: ${token}`);
    console.log(`User registered: ${userName}, Email: ${email}`);
    user.token = token;
    user.isVerified = false;
    user.isLoggedIn = false;
    user.updatedAt = null;
    user.createdAt = new Date();
    user.lastLogin = null;
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
    const { error } = await loginValidator.validateAsync({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
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
      }
      if (user.isLoggedIn === true) {
        return res.status(401).json({
          success: false,
          message: "User is already logged in",
        });
      }

      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Complete Email verification then Login..",
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

        user.lastLogin = new Date();
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
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for re-verification",
      });
    }
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
    reVerifyEmail(token, user.email, user.userName);
    user.token = token;
    user.isVerified = false;
    user.isLoggedIn = false;

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

export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for logout",
      });
    }
    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isLoggedIn = false;
    user.lastLogout = new Date();

    await user.save();

    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to find the user.",
      });
    }
    const { error } = updateUserValidator.validate({ email, userName, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userSchema.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address.",
      });
    }
    if (user.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "User is not verified. Cannot update user details.",
      });
    }
    if (user.isLoggedIn === false) {
      return res.status(401).json({
        success: false,
        message: "User is not logged in. Please log in to update your details.",
      });
    }
  
    if (userName) {
      user.userName = userName.trim();
    }

    if (password) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from the current password.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.updatedAt = new Date();
    await user.save();

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating user.",
    });
  }
};