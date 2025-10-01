import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import NotificationList from "./NotificationList";

const NotificationBell = () => {
    const { unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            >
                <FiBell className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white shadow-lg animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && <NotificationList onClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationBell;