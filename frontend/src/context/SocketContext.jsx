// frontend/src/context/SocketContext.jsx
import { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Connect to the backend socket server
      const newSocket = io(import.meta.env.VITE_API_URL.replace('/api', ''));
      setSocket(newSocket);

      // Join a private room based on user ID
      newSocket.emit('joinRoom', user._id);

      return () => newSocket.close();
    } else {
      // If there is no user, disconnect any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};