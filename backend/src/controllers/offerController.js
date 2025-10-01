import { Offer } from "../models/Offer.js";
import { Request } from "../models/Request.js";
import { Notification } from "../models/Notification.js";
import { getIO } from "../config/socket.js";

const createOffer = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);

    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Prevent user from offering on their own request
    if (request.createdBy.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot make an offer on your own request");
    }

    // Prevent duplicate offers
    const existingOffer = await Offer.findOne({
      request: requestId,
      offeredBy: req.user._id,
    });

    if (existingOffer) {
      res.status(400);
      throw new Error("You have already made an offer on this request");
    }

    const offer = await Offer.create({
      request: requestId,
      offeredBy: req.user._id,
      requester: request.createdBy,
      message: req.body.message,
    });

    // Create a notification for the requester
    const notification = await Notification.create({
      user: request.createdBy,
      message: `${req.user.name} has offered to help with your request: "${request.title}"`,
      link: `/requests/${requestId}`,
    });
    // Emit a real-time notification
    getIO()
      .to(request.createdBy.toString())
      .emit("receiveNotification", notification);

    res.status(201).json(offer);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error while creating offer";
  }
};

const getOffersForRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Allow any authenticated user to view offers for a request
    // This helps users see if someone has already offered to help
    // The requester can still manage/respond to offers through other endpoints

    const offers = await Offer.find({ request: req.params.requestId }).populate(
      "offeredBy",
      "name profilePhoto reputation"
    );

    res.status(200).json(offers);
  } catch (error) {
    const errorMessage =
      error.message || "Error while fetching offers by request";
    next(error);
  }
};

const respondToOffer = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const offer = await Offer.findById(req.params.offerId);

    if (!offer) {
      res.status(404);
      throw new Error("Offer not found");
    }

    // Ensure the logged-in user is the requester
    if (offer.requester.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to respond to this offer");
    }

    offer.status = status;
    await offer.save();

    if (status === "accepted") {
      // Update the request status and assign the helper
      const request = await Request.findByIdAndUpdate(offer.request, {
        status: "in-progress",
        helper: offer.offeredBy,
      });

      // Reject all other pending offers for this request
      await Offer.updateMany(
        { request: offer.request, status: "pending" },
        { status: "rejected" }
      );

      // Notify the accepted helper
      const notification = await Notification.create({
        user: offer.offeredBy,
        message: `Your offer for "${request.title}" has been accepted!`,
        link: `/requests/${request._id}`,
      });
      getIO()
        .to(offer.offeredBy.toString())
        .emit("receiveNotification", notification);
    } else {
      // Notify the rejected helper
      const request = await Request.findById(offer.request);
      const notification = await Notification.create({
        user: offer.offeredBy,
        message: `Your offer for "${request.title}" was not accepted.`,
        link: `/requests/${request._id}`,
      });
      getIO()
        .to(offer.offeredBy.toString())
        .emit("receiveNotification", notification);
    }
    res.status(200).json(offer);
  } catch (error) {
    const errorMessage = error.message || "Error while responding to offer";
    next(error);
  }
};

export { createOffer, getOffersForRequest, respondToOffer };
