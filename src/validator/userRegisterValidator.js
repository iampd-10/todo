import Joi from 'joi';

export const userRegisterValidator = Joi.object({
  userName: Joi.string()
    .trim()
    .min(3)
    .max(8)
    .required()
    .messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be at most 8 characters',
    }),

  email: Joi.string()
    .trim()
    .email()
    .pattern(/@gmail\.com$/)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.pattern.base': 'Email must be a valid Gmail address (ends with @gmail.com)',
    }),

  password: Joi.string()
    .trim()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long, contain one special character, and one number',
    }),
});

export const loginValidator = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .pattern(/@gmail\.com$/)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.pattern.base': 'Email must be a valid Gmail address (ends with @gmail.com)',
    }), 
  password: Joi.string()
    .trim()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long, contain one special character, and one number',
    }),
});

export const todoValidator = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must be at most 50 characters',
    }),
  userId: Joi.string()
    .required()
    .messages({
      'string.base': 'User ID must be a string',
      'string.empty': 'User ID is required',
    }),
  description: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must be at most 200 characters',
    }),
});

export const updateUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required to find the user.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

  userName: Joi.string()
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.min": "Username must be at least 3 characters.",
      "string.max": "Username must not exceed 30 characters.",
    }),

  password: Joi.string()
    .min(6)
    .max(50)
    .optional()
    .messages({
      "string.min": "Password must be at least 6 characters.",
      "string.max": "Password must not exceed 50 characters.",
    }),
});
