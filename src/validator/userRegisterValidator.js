import Joi from 'joi';

export const registerSchema = Joi.object({
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
