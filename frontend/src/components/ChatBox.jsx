// frontend/src/components/ChatBox.jsx
import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import useAuth from "../hooks/useAuth";
import messageService from "../services/messageService";

const ChatBox = ({ request, recipient }) => {
  const { user } = useAuth();
  const { saveChatProfile, updateLastChatTime } = useChat();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    messageService
      .getMessagesForConversation(request._id, recipient._id)
      .then((res) => setMessages(res.data));

    if (recipient && request) {
      const recipientProfile = {
        ...recipient,
        requestTitle: request.title,
      };
      const isRequester = user._id === request.createdBy._id;
      saveChatProfile(request._id, recipientProfile, isRequester);
    }
  }, [request._id, recipient._id, recipient, request, saveChatProfile, user._id]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (incomingMessage) => {
        if (incomingMessage.request === request._id) {
          setMessages((prev) => [...prev, incomingMessage]);
        }
      };
      socket.on("receiveMessage", handleReceiveMessage);
      return () => socket.off("receiveMessage", handleReceiveMessage);
    }
  }, [socket, request._id]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessageId = Date.now();
    const messageData = {
      _id: tempMessageId,
      sender: user,
      receiver: recipient,
      request: request._id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    socket.emit("sendMessage", {
      receiverId: recipient._id,
      senderId: user._id,
      ...messageData,
    });

    try {
      const response = await messageService.sendMessage({
        receiverId: recipient._id,
        requestId: request._id,
        content: newMessage,
      });
      setMessages(prev => prev.map(msg =>
        msg._id === tempMessageId ? { ...response.data, status: 'sent' } : msg
      ));
      updateLastChatTime(request._id);
    } catch (err) {
      console.error("Failed to save message", err);
      setMessages(prev => prev.map(msg =>
        msg._id === tempMessageId ? { ...msg, status: 'failed' } : msg
      ));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">
              {recipient.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{recipient.name}</h2>
            <p className="text-blue-100 text-sm">Chat about: {request.title}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = msg.sender._id || msg.sender;
            const isOwnMessage = senderId === user._id;

            return (
              <div
                key={index}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    isOwnMessage
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  } ${msg.status === 'sending' ? 'opacity-70' : ''} ${msg.status === 'failed' ? 'bg-red-200 border-red-500' : ''}`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                    {isOwnMessage && msg.status === 'failed' && <span className="ml-2 text-red-500 font-bold">Failed</span>}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>Send</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;