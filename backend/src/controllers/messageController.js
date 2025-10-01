import { Message } from "../models/Message.js";
import { Request } from "../models/Request.js";
import { getIO } from "../config/socket.js";

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, requestId, content } = req.body;
    const senderId = req.user._id.toString();

    if (!receiverId || !requestId || !content) {
        res.status(400);
        throw new Error("Missing required fields: receiverId, requestId, content");
    }

    const request = await Request.findById(requestId);
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    const requesterId = request.createdBy.toString();
    const helperId = request.helper ? request.helper.toString() : null;

    if (!helperId) {
        res.status(403);
        throw new Error("This request does not have an assigned helper yet.");
    }

    const isUserTheRequester = senderId === requesterId;
    const isUserTheHelper = senderId === helperId;
    const isReceiverTheRequester = receiverId === requesterId;
    const isReceiverTheHelper = receiverId === helperId;

    const isAuthorized =
      (isUserTheRequester && isReceiverTheHelper) ||
      (isUserTheHelper && isReceiverTheRequester);

    if (!isAuthorized) {
      res.status(403);
      throw new Error(
        "You are not authorized to send messages for this request"
      );
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      request: requestId,
      content: content,
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profilePhoto');

    getIO().to(receiverId).emit("receiveMessage", populatedMessage);

    res.status(201).json(populatedMessage);
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
    }).populate('sender', 'name profilePhoto').sort({ createdAt: "asc" });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export { sendMessage, getMessagesForConversation };