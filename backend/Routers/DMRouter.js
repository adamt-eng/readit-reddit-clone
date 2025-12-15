import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import createDMController from "../Controllers/DMController.js";

export default function createDMRouter({ io, onlineUsers }) {
  const router = express.Router();
  const DMController = createDMController({ io, onlineUsers });

  // create or get conversation with other user
  router.post("/conversations/:otherUserId", auth, DMController.getOrCreateConversation);

  // list conversations for current user
  router.get("/conversations", auth, DMController.listConversations);

  // get messages for a conversation
  router.get("/messages/:conversationId", auth, DMController.getMessages);

  // send message (body: { conversationId?, recipientId?, content })
  router.post("/messages", auth, DMController.sendMessage);

  return router;
}
