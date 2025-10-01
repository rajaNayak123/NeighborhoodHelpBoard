import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationList = ({ onClose }) => {
    const { notifications, markAsRead } = useNotifications();

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        onClose();
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20">
            <div className="py-2">
                <h3 className="text-lg font-semibold text-gray-800 px-4 py-2">Notifications</h3>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="text-gray-600 px-4 py-3">No notifications yet.</p>
                    ) : (
                        notifications.map(notification => (
                            <Link
                                key={notification._id}
                                to={notification.link}
                                onClick={() => handleNotificationClick(notification)}
                                className={`block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                            >
                                <p className={`font-medium ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationList;