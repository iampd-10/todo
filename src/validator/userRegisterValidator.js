import yup from "yup";
export const userSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .min(3, "UserName must be atleast 3 characters")
    .required(),
   email: yup
    .string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|protonmail)\.com$/,
      'Email must be a valid .com address from providers like gmail, yahoo, outlook, or protonmail'
    ),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});
export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ messase: err.errors });
  }
};
