import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { votePost, voteComment } from "../Controllers/VoteController.js";

const router = express.Router();

router.post("/posts/:id", auth, votePost);
router.post("/comments/:commentId", auth, voteComment);
=======
=======
>>>>>>> Stashed changes
import { votePost,getMyVotes } from '../Controllers/VoteController.js';

const router = express.Router();

router.post("/:id",auth,votePost)
router.get("/me", auth, getMyVotes);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default router;
