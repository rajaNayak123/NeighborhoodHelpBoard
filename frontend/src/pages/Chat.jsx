import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ChatBox from "../components/ChatBox";

const Chat = () => {
  const location = useLocation();
  const { user } = useAuth();

  const { request } = location.state || {};

  if (!request) {
    return <Navigate to="/dashboard" />;
  }

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
