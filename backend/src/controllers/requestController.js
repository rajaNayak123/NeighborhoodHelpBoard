import { Request } from "../models/Request.js";

const createRequest = async (req, res, next) => {
  try {
    const { title, description, category, urgency, location, address } =
      req.body;
    const coordinates = JSON.parse(location); // Expecting [longitude, latitude]

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const request = await Request.create({
      title,
      description,
      category,
      urgency,
      location: { type: "Point", coordinates },
      address,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error creating request";
    console.log(errorMessage);
  }
};

const getNearbyRequests = async (req, res, next) => {
  try {
    const { longitude, latitude, radius, category } = req.query; // radius in km

    if (!longitude || !latitude) {
      res.status(400);
      throw new Error("Longitude and latitude are required");
    }

    const maxDistance = (radius || 10) / 6378.1; // Convert km to radians for MongoDB

    const filter = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistance * 1000, // in meters
        },
      },
      status: "open",
    };

    if (category) {
      filter.category = category;
    }

    const requests = await Request.find(filter).populate(
      "createdBy",
      "name profilePhoto"
    );
    res.status(200).json(requests);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error fetching nearby requests";
    console.log(errorMessage);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("createdBy", "name profilePhoto ratings")
      .populate("helper", "name profilePhoto ratings");

    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error fetching request by ID";
    console.log(errorMessage);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Check if the user is the owner of the request
    if (request.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to update this request");
    }

    request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(request);
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error updating request status";
    console.log(errorMessage);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    if (request.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await request.remove();

    res.status(200).json({ success: true, message: "Request removed" });
  } catch (error) {
    next(error);
    const errorMessage = error.message || "Error deleting request";
    console.log(errorMessage);
  }
};

export{
    createRequest,
    getNearbyRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest,
}