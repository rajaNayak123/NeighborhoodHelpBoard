import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSocket } from './SocketContext';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await notificationService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        if (socket) {
            const handleReceiveNotification = (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
            };

            socket.on('receiveNotification', handleReceiveNotification);

            return () => {
                socket.off('receiveNotification', handleReceiveNotification);
            };
        }
    }, [socket]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};