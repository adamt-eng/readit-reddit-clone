import DmConversation from "../Models/DMConversation.js";
import DmMessage from "../Models/DMMessage.js";

const ensureOrder = (a, b) => (a.toString() < b.toString() ? [a, b] : [b, a]);

const createDMController = ({
    io,
    onlineUsers
}) => {
    const getOrCreateConversation = async (req, res) => {
        try {
            if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });
            const userId = req.user.id;
            const {
                otherUserId
            } = req.params;
            const [userA, userB] = ensureOrder(userId, otherUserId);

            let convo = await DmConversation.findOne({
                userA,
                userB
            });
            if (!convo) {
                convo = await DmConversation.create({
                    userA,
                    userB
                });
            }

            convo = await convo.populate("userA userB");
            return res.json(convo);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    };

    const listConversations = async (req, res) => {
        try {
            if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });
            const userId = req.user.id;
            const convos = await DmConversation.find({
                    $or: [{
                        userA: userId
                    }, {
                        userB: userId
                    }]
                })
                .sort({
                    createdAt: -1
                })
                .populate("userA userB");

            return res.json(convos);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    };

    const getMessages = async (req, res) => {
        try {
            if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });
            const userId = req.user.id;
            const {
                conversationId
            } = req.params;
            const limit = parseInt(req.query.limit) || 50;
            const messages = await DmMessage.find({
                    conversationId
                })
                .sort({
                    createdAt: 1
                })
                .limit(limit)
                .populate("senderId", "username avatarUrl");

            return res.json(messages);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    };

    const sendMessage = async (req, res) => {
        try {
            if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });
            const senderId = req.user.id;
            const {
                conversationId,
                recipientId,
                content
            } = req.body;

            let convoId = conversationId;

            if (!convoId && recipientId) {
                const [userA, userB] = ensureOrder(senderId, recipientId);
                let convo = await DmConversation.findOne({
                    userA,
                    userB
                });
                if (!convo) convo = await DmConversation.create({
                    userA,
                    userB
                });
                convoId = convo._id;
            }

            if (!convoId) return res.status(400).json({
                message: "No conversation or recipient provided"
            });

            const message = await DmMessage.create({
                conversationId: convoId,
                senderId,
                content
            });
            const populated = await message.populate("senderId", "username avatarUrl");

            // emit to recipient if online via provided io/onlineUsers
            const convo = await DmConversation.findById(convoId);
            if (convo && onlineUsers) {
                const other = convo.userA.toString() === senderId.toString() ? convo.userB.toString() : convo.userA.toString();
                const socketId = onlineUsers.get(other);
                if (socketId && io) {
                    io.to(socketId).emit("dm:new_message", {
                        conversationId: convoId,
                        message: populated
                    });
                }
            }

            return res.status(201).json(populated);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    };

    return {
        getOrCreateConversation,
        listConversations,
        getMessages,
        sendMessage,
    };
};

export default createDMController;