import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ChatBox from "../components/ChatBox";

const Chat = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Data is expected to be passed via <Link state={{...}} />
  const { request } = location.state || {};

  if (!request) {
    // If someone navigates here directly without state, redirect them
    return <Navigate to="/dashboard" />;
  }

  // Determine who the other person in the chat is
  // If current user is the requester, recipient is the helper
  // If current user is the helper, recipient is the requester
  const recipient =
    user._id === request.createdBy._id ? request.helper : request.createdBy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <ChatBox request={request} recipient={recipient} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
