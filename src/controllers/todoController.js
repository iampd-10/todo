import dotenv from "dotenv";
import userSchema from "../models/userSchema.js";
import todoSchema from "../models/todoSchema.js";
dotenv.config();

export const createTodo = async (req, res) => {
  try {
    console.log("Creating Todo");
    const { title, description } = req.body;
    console.log("Title:", title, "Description:", description);
   
    const user = await userSchema.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    if (!user.isLoggedIn) { 
        return res.status(401).json({
            success: false,
            message: "User is not logged in",
        });
        }


    console.log("User found:", user);
    const userId = user._id;


    const newTodo = await todoSchema.create({
      title,
      description,
      userId 
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await todoSchema.find({ userId });

    return res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};