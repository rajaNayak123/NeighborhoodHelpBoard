import api from './api';

const getOffersForRequest = (requestId) => {
  return api.get(`/offers/${requestId}`);
};

const createOffer = (requestId, message) => {
  return api.post(`/offers/${requestId}`, { message });
};

const respondToOffer = (offerId, status) => {
  return api.put(`/offers/${offerId}/respond`, { status });
};

const offerService = {
  getOffersForRequest,
  createOffer,
  respondToOffer,
};

export default offerService;