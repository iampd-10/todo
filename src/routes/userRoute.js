import express from 'express';
import {
  login,
  logout,
  register,
  reverifyUser,
  updateUser
} from '../controllers/userController.js';
import { verification } from '../middleware/verifyToken.js';

const router = express.Router();


router.post('/register', register);
router.get('/verify', verification);
router.post('/login', login);
router.post('/reverify', reverifyUser); 


router.post('/logout', logout);
router.put('/update', updateUser);

export default router;
