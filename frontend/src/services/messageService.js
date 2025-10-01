// frontend/src/services/messageService.js
import api from './api';

const getMessagesForConversation = (requestId, otherUserId) => {
  return api.get(`/messages/${requestId}/${otherUserId}`);
};

const sendMessage = (receiverId, requestId, content) => {
  return api.post('/messages', { receiverId, requestId, content });
};

const messageService = {
  getMessagesForConversation,
  sendMessage,
};

export default messageService;