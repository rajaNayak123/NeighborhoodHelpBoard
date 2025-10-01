// frontend/src/services/notificationService.js
import api from './api';

const getNotifications = () => {
  return api.get('/notifications');
};

const markAsRead = (id) => {
  return api.put(`/notifications/${id || 'all'}/read`);
};

const notificationService = {
  getNotifications,
  markAsRead,
};

export default notificationService;