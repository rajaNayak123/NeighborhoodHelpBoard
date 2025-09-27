import express from 'express';
import {
    createOffer,
    getOffersForRequest,
    respondToOffer,
} from '../controllers/offerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.route('/:requestId')
    .post(createOffer)
    .get(getOffersForRequest);

router.put('/:offerId/respond', respondToOffer);

export { router as offerRoutes };