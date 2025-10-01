import express from "express";
import {
  createRequest,
  getNearbyRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 5), createRequest); // upload.array for multiple files

router.get('/nearby', getNearbyRequests);

router.route('/:id')
  .get(getRequestById)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

export { router as requestRoutes };
