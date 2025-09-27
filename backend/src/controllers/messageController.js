import Message from "../models/Message";
import Request from "../models/Request";

const sendMessage = async (req, res) => {
  try {
    const { receiverId, requestId, content } = req.body;

    // You might add validation here to ensure the sender and receiver
    // are actually the requester and helper for the given request.
    const request = await Request.findById(requestId);
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    if (
      !(
        req.user._id.equals(request.createdBy) &&
        receiverId.equals(request.helper)
      ) &&
      !(
        req.user._id.equals(request.helper) &&
        receiverId.equals(request.createdBy)
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

    res.status(201).json(message);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error while sending message";
    console.log(errorMessage);
  }
};

const getMessagesForConversation = async (req, res) => {
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

export { 
    sendMessage, 
    getMessagesForConversation 
};
