import dotenv from "dotenv";
import todoSchema from "../models/todoSchema.js";
import { todoValidator } from "../validator/userRegisterValidator.js";
dotenv.config();


export const addTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title ) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    const { error } = todoValidator.validate({ title, userId: req.userId, description });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existing = await todoSchema.findOne({ title: title, userId: req.userId, });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }
    const data = await todoSchema.create({ title, userId: req.userId, description });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "todo created successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "could not access", });
  }
};



export const getTodo = async (req, res) => {
  try {
    const data = await todoSchema.find({ userId: req.userId, });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "todo fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};



export const getByIdTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const data = await todoSchema.findById({ userId: req.userId, _id: todoId, });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "todo fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, mesasage: "could not access" })
  }
}




export const updateByIdTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todoId = req.params.id;
    const data = await todoSchema.findOne({ userId: req.userId, _id: todoId });
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Title not exists",
      });
    }
    const existing = await todoSchema.findOne({ title, userId: req.userId, _id: todoId, });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "title already exists",
      });
    }
    data.title = title
    await data.save()
    return res.status(200).json({
      success: true,
      message: "todo updated successfully",
      data: data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};



export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const data = await todoSchema.findByIdAndDelete({ userId: req.userId, _id: todoId, });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "todo deleted successfully",
        data: data,
      })
    }

    else {
      return res.status(404).json({
        success: false,
        message: "todo not found",
        data: data,
      })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "could not access", });
  }
}