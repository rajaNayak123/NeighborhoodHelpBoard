import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiUser,
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiMessageCircle,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import requestService from "../services/requestService";
import offerService from "../services/offerService";
import MapView from "../components/MapView";
import OfferList from "../components/OfferList";
import OfferForm from "../components/OfferForm";

const RequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOfferFormVisible, setIsOfferFormVisible] = useState(false);
  const [hasOffered, setHasOffered] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const requestRes = await requestService.getRequestById(id);
      setRequest(requestRes.data);

      // Fetch offers regardless of role to check if user has already offered
      const offersRes = await offerService.getOffersForRequest(id);

      if (user?._id === requestRes.data.createdBy._id) {
        const offersRes = await offerService.getOffersForRequest(id);
        setOffers(offersRes.data);
      }
      // Check if the current user (who is not the requester) has an existing offer
      const userOffer = offersRes.data.find(
        (offer) => offer.offeredBy._id === user?._id
      );
      setHasOffered(!!userOffer);
    } catch (err) {
      setError("Failed to load request details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleRespondToOffer = async (offerId, status) => {
    try {
      await offerService.respondToOffer(offerId, status);
      fetchData(); // Refresh all data after responding
    } catch (err) {
      alert("Failed to respond to offer.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Request
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The request you're looking for doesn't exist.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isRequester = user?._id === request.createdBy._id;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
          >
            <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Request Header */}
            <div className="card p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {request.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      <span>
                        Posted by{" "}
                        <span className="font-semibold text-gray-900">
                          {request.createdBy.name}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status?.toUpperCase() || "OPEN"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    {request.urgency?.toUpperCase() || "MEDIUM"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <FiTag className="w-3 h-3 inline mr-1" />
                    {request.category?.toUpperCase() || "OTHER"}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="w-full h-80 bg-gray-200 rounded-xl mb-6 overflow-hidden">
                {request.images && request.images[0] ? (
                  <img
                    src={request.images[0].url}
                    alt={request.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-6xl opacity-50">🤝</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {request.description}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-6 h-6 mr-2 text-blue-600" />
                Location
              </h2>
              <MapView
                coordinates={request.location.coordinates}
                address={request.address}
              />
            </div>
          </div>

          {/* Right Column: Status & Offers */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Request Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status?.toUpperCase() || "OPEN"}
                  </span>
                </div>

                {request.status === "in-progress" && request.helper && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <FiCheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-900">
                        Helper Assigned
                      </span>
                    </div>
                    <p className="text-blue-800">
                      <span className="font-semibold">
                        {request.helper.name}
                      </span>{" "}
                      is helping with this request
                    </p>

                    {/* Show Chat button only to requester and helper */}
                    {(user._id === request.createdBy._id ||
                      user._id === request.helper._id) && (
                      <Link
                        to="/chat"
                        state={{ request: request }}
                        className="btn btn-success w-full mt-4 flex items-center justify-center space-x-2"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        <span>Go to Chat</span>
                      </Link>
                    )}
                  </div>
                )}

                {isRequester ? (
                  <OfferList offers={offers} onRespond={handleRespondToOffer} />
                ) : (
                  request.status === "open" &&
                  !hasOffered && (
                    <button
                      onClick={() => setIsOfferFormVisible(true)}
                      className="btn btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Offer to Help</span>
                    </button>
                  )
                )}

                {hasOffered && !isRequester && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-900">
                        You've offered to help!
                      </span>
                    </div>
                    <p className="text-green-800 text-sm mt-1">
                      The requester will review your offer and get back to you.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Form Modal */}
        {isOfferFormVisible && (
          <OfferForm
            requestId={id}
            onClose={() => setIsOfferFormVisible(false)}
            onSubmitSuccess={() => {
              setHasOffered(true);
              setOfferSuccess(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
