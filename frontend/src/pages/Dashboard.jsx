// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiMapPin,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiAlertCircle,
  FiMessageCircle,
  FiClock,
} from "react-icons/fi";
import requestService from "../services/requestService";
import useAuth from "../hooks/useAuth";
import RequestCard from "../components/RequestCard";
import CreateRequestForm from "../components/CreateRequestForm";

const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Function to fetch requests, can be called to refresh data
  const fetchRequests = (loc) => {
    setLoading(true);
    requestService
      .getNearbyRequests(loc.latitude, loc.longitude)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((err) => {
        setError("Could not fetch nearby requests.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { latitude, longitude };
          setLocation(userLocation);
          fetchRequests(userLocation);
        },
        () => {
          setError(
            "Unable to retrieve your location. Please enable location permissions."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const handlePostSuccess = () => {
    fetchRequests(location);
  };

  const handleRefresh = () => {
    if (location) {
      fetchRequests(location);
    }
  };

  // Filter requests based on search term and category
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || request.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "groceries", "repairs", "tools", "other"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Community Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Discover help requests in your neighborhood
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setIsFormVisible(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create Request</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-48 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 appearance-none"
                >
                  <option value="all">All Categories</option>
                  <option value="groceries">Groceries</option>
                  <option value="repairs">Repairs</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
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
        </div>

        {/* Location Status */}
        {location && (
          <div className="mb-8 flex items-center text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <FiMapPin className="w-5 h-5 mr-3 text-blue-600" />
            <span className="font-medium">
              Showing requests near your location
            </span>
          </div>
        )}

        {/* Create Request Modal */}
        {isFormVisible && (
          <CreateRequestForm
            userLocation={location}
            onClose={() => setIsFormVisible(false)}
            onPostSuccess={handlePostSuccess}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading nearby requests...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold">
                  Error Loading Requests
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && !error && (
          <>
            {filteredRequests.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {filteredRequests.length} request
                    {filteredRequests.length !== 1 ? "s" : ""}
                    {searchTerm && ` matching "${searchTerm}"`}
                    {filterCategory !== "all" &&
                      ` in ${filterCategory} category`}
                  </p>
                </div>

                {/* Open Requests Section */}
                {filteredRequests.filter((req) => req.status === "open")
                  .length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FiSearch className="w-6 h-6 mr-2 text-green-600" />
                      Open Requests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRequests
                        .filter((req) => req.status === "open")
                        .map((request, index) => (
                          <div
                            key={request._id}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <RequestCard request={request} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* In-Progress Requests Section */}
                {filteredRequests.filter((req) => req.status === "in-progress")
                  .length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FiMessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                      In Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRequests
                        .filter((req) => req.status === "in-progress")
                        .map((request, index) => (
                          <div
                            key={request._id}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <RequestCard request={request} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FiMapPin className="w-16 h-16 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "No matching requests found"
                    : "No help requests in your area"}
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Be the first to create a help request in your neighborhood!"}
                </p>
                {!searchTerm && filterCategory === "all" && (
                  <button
                    onClick={() => setIsFormVisible(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-3 mx-auto"
                  >
                    <FiPlus className="w-5 h-5" />
                    <span>Create First Request</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
