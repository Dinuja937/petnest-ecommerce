import express from 'express';
import {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { registerValidation, loginValidation } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, authUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
