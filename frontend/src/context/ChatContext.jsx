// frontend/src/context/ChatContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatProfiles, setChatProfiles] = useState({});
  const [activeConversations, setActiveConversations] = useState([]);

  // Load chat profiles from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProfiles = localStorage.getItem(`chatProfiles_${user._id}`);
      if (savedProfiles) {
        setChatProfiles(JSON.parse(savedProfiles));
      }
    }
  }, [user]);

  // Save chat profiles to localStorage whenever they change
  useEffect(() => {
    if (user && Object.keys(chatProfiles).length > 0) {
      localStorage.setItem(
        `chatProfiles_${user._id}`,
        JSON.stringify(chatProfiles)
      );
    }
  }, [chatProfiles, user]);

  // Save a chat profile when starting a conversation
  const saveChatProfile = (
    requestId,
    recipientProfile,
    isRequester = false
  ) => {
    const profileData = {
      _id: recipientProfile._id, // Changed from 'id' to '_id' for consistency
      name: recipientProfile.name,
      email: recipientProfile.email,
      profilePhoto: recipientProfile.profilePhoto,
      lastChatTime: new Date().toISOString(),
      requestId: requestId,
      requestTitle: recipientProfile.requestTitle || "Chat",
      isRequester: isRequester,
    };

    setChatProfiles((prev) => ({
      ...prev,
      [requestId]: profileData,
    }));

    // Add to active conversations if not already there
    setActiveConversations((prev) => {
      const exists = prev.some((conv) => conv.requestId === requestId);
      if (!exists) {
        return [
          ...prev,
          {
            requestId,
            recipient: profileData,
            lastMessage: null,
            unreadCount: 0,
          },
        ];
      }
      return prev;
    });
  };

  // Update last chat time
  const updateLastChatTime = (requestId) => {
    setChatProfiles((prev) => {
        if (prev[requestId]) {
            return {
                ...prev,
                [requestId]: {
                    ...prev[requestId],
                    lastChatTime: new Date().toISOString(),
                },
            };
        }
        return prev;
    });
};


  // Get chat profile for a specific request
  const getChatProfile = (requestId) => {
    return chatProfiles[requestId] || null;
  };

  // Get all chat profiles
  const getAllChatProfiles = () => {
    return Object.values(chatProfiles);
  };

  // Get active conversations
  const getActiveConversations = () => {
    return activeConversations;
  };

  // Clear chat data (for logout)
  const clearChatData = () => {
    setChatProfiles({});
    setActiveConversations([]);
  };

  return (
    <ChatContext.Provider
      value={{
        chatProfiles,
        activeConversations,
        saveChatProfile,
        updateLastChatTime,
        getChatProfile,
        getAllChatProfiles,
        getActiveConversations,
        clearChatData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;