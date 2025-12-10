import express from 'express';
import {getUserById} from '../Controllers/UserController.js'

const router = express.Router();

router.get('/:id', getUserById);


export default router;