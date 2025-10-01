import { createContext, useState, useContext, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatProfiles, setChatProfiles] = useState({});

  useEffect(() => {
    if (user) {
      const savedProfiles = localStorage.getItem(`chatProfiles_${user._id}`);
      if (savedProfiles) {
        setChatProfiles(JSON.parse(savedProfiles));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && Object.keys(chatProfiles).length > 0) {
      localStorage.setItem(
        `chatProfiles_${user._id}`,
        JSON.stringify(chatProfiles)
      );
    }
  }, [chatProfiles, user]);

  const saveChatProfile = useCallback(
    (requestId, recipientProfile, isRequester = false) => {
      const profileData = {
        _id: recipientProfile._id,
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
    },
    []
  );

  const updateLastChatTime = useCallback((requestId) => {
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
  }, []);

  const getAllChatProfiles = useCallback(() => {
    return Object.values(chatProfiles);
  }, [chatProfiles]);

  const clearChatData = useCallback(() => {
      setChatProfiles({});
  }, []);

  return (
    <ChatContext.Provider
      value={{
        saveChatProfile,
        updateLastChatTime,
        getAllChatProfiles,
        clearChatData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;