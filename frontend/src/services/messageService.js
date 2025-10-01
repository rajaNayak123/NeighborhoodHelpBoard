import api from './api';

const getMessagesForConversation = (requestId, otherUserId) => {
  return api.get(`/messages/${requestId}/${otherUserId}`);
};

const messageService = {
  getMessagesForConversation,
};

export default messageService;