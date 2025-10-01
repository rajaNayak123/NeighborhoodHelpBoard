import React from "react";

const OfferList = ({ offers, onRespond }) => {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Offers Received</h3>
        {offers.length === 0 ? (
          <p>No offers have been made yet.</p>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer._id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{offer.offeredBy.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{offer.message || 'Wants to help!'}</p>
                </div>
                {offer.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button onClick={() => onRespond(offer._id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                    <button onClick={() => onRespond(offer._id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                  </div>
                )}
                {offer.status === 'accepted' && <span className="text-green-600 font-bold">Accepted</span>}
                {offer.status === 'rejected' && <span className="text-red-600 font-bold">Rejected</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  export default OfferList;