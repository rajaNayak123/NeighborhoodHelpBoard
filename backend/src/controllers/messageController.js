import { Message } from "../models/Message.js";
import { Request } from "../models/Request.js";
import { getIO } from "../config/socket.js";

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, requestId, content } = req.body;

    const request = await Request.findById(requestId);
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    if (
      !(
        req.user._id.equals(request.createdBy) &&
        String(request.helper) === receiverId
      ) &&
      !(
        req.user._id.equals(request.helper) &&
        String(request.createdBy) === receiverId
      )
    ) {
      res.status(403);
      throw new Error(
        "You are not authorized to send messages for this request"
      );
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      request: requestId,
      content: content,
    });

    getIO().to(receiverId).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const getMessagesForConversation = async (req, res, next) => {
  try {
    const { requestId, otherUserId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      request: requestId,
      $or: [
        { sender: loggedInUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: loggedInUserId },
      ],
    }).sort({ createdAt: "asc" });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export { sendMessage, getMessagesForConversation };