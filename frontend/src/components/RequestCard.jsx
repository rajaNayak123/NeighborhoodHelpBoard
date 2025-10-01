// frontend/src/components/RequestCard.jsx
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiTag,
  FiClock,
  FiUser,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";

const RequestCard = ({ request }) => {
  // Helper to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Helper to get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "groceries":
        return "🛒";
      case "repairs":
        return "🔧";
      case "tools":
        return "🛠️";
      default:
        return "🤝";
    }
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300 overflow-hidden">
      <Link to={`/requests/${request._id}`} className="block">
        {/* Image Section */}
        <div className="relative">
          {request.images && request.images[0] ? (
            <img
              src={request.images[0].url}
              alt={request.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-6xl opacity-50">
                {getCategoryIcon(request.category)}
              </div>
            </div>
          )}

          {/* Urgency Badge */}
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
              request.urgency
            )}`}
          >
            {request.urgency?.toUpperCase() || "MEDIUM"}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
            <span className="mr-1">{getCategoryIcon(request.category)}</span>
            <span className="capitalize">{request.category}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {request.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {request.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-1 text-green-500" />
                <span className="truncate max-w-24">
                  {request.address?.split(",")[0] || "Location"}
                </span>
              </div>
            </div>

            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
              <span className="text-sm font-medium mr-1">View Details</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>

          {/* Author Info */}
          {request.author && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {request.author.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">Requested help</p>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RequestCard;
