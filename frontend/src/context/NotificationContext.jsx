// frontend/src/context/NotificationContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useSocket } from './SocketContext';
import notificationService from '../services/notificationService'; // We'll create this next

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if(socket) {
            socket.on('receiveNotification', (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
            });

            return () => {
                socket.off('receiveNotification');
            }
        }
    }, [socket]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    )
}