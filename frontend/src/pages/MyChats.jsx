// frontend/src/pages/MyChats.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import useAuth from "../hooks/useAuth";
import {
  FiMessageCircle,
  FiClock,
  FiUser,
  FiMapPin,
  FiTag,
  FiArrowRight,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

const MyChats = () => {
  const { user } = useAuth();
  const { getAllChatProfiles, getActiveConversations } = useChat();
  const [chatProfiles, setChatProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const profiles = getAllChatProfiles();
    setChatProfiles(profiles);
  }, [getAllChatProfiles]);

  // Filter profiles based on search and status
  const filteredProfiles = chatProfiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.requestTitle.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, we'll show all profiles since we don't have status filtering yet
    return matchesSearch;
  });

  const formatLastChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  My Chats
                </h1>
                <p className="text-gray-600 text-lg">
                  Continue conversations with people you've helped
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search chats by name or request..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-48 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 appearance-none"
              >
                <option value="all">All Chats</option>
                <option value="recent">Recent</option>
                <option value="active">Active</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, index) => (
              <div
                key={profile.requestId}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 transition-all duration-200 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {profile.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {formatLastChatTime(profile.lastChatTime)}
                    </p>
                  </div>
                </div>

                {/* Request Context */}
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FiTag className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">About:</span>
                  </div>
                  <p className="text-gray-800 font-medium text-sm bg-gray-50 rounded-lg p-3">
                    {profile.requestTitle}
                  </p>
                </div>

                {/* Action Button */}
                <Link
                  to="/chat"
                  state={{
                    request: {
                      _id: profile.requestId,
                      title: profile.requestTitle,
                      createdBy: profile.isRequester ? user : profile,
                      helper: profile.isRequester ? profile : user,
                    },
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span>Continue Chat</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiMessageCircle className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm ? "No matching chats found" : "No chats yet"}
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Start helping people in your neighborhood to begin conversations!"}
            </p>
            {!searchTerm && (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-3"
              >
                <FiMapPin className="w-5 h-5" />
                <span>Browse Requests</span>
              </Link>
            )}
          </div>
        )}

        {/* Stats Section */}
        {filteredProfiles.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {filteredProfiles.length}
                </div>
                <div className="text-gray-600">Total Chats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {
                    filteredProfiles.filter(
                      (p) =>
                        new Date(p.lastChatTime) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-gray-600">Recent (24h)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {
                    filteredProfiles.filter(
                      (p) =>
                        new Date(p.lastChatTime) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-gray-600">This Week</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
