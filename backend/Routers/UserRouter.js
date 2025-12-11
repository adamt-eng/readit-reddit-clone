// Routers/UserRouter.js
import express from 'express';
import { getUserById, searchUsers } from '../Controllers/UserController.js';

const router = express.Router();

// /users/search?q=...
router.get('/search', searchUsers);

// /users/:id
router.get('/:id', getUserById);

export default router;
