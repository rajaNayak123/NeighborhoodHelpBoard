// frontend/src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const MapView = ({ coordinates, address }) => {
  // Validate coordinates
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return (
      <div className="h-64 md:h-80 rounded-lg overflow-hidden z-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Invalid location data</p>
        </div>
      </div>
    );
  }

  // Leaflet coordinates are [latitude, longitude]
  // Our GeoJSON is [longitude, latitude], so we need to reverse it.
  const position = [coordinates[1], coordinates[0]];

  // Validate that coordinates are valid numbers
  if (isNaN(position[0]) || isNaN(position[1])) {
    return (
      <div className="h-64 md:h-80 rounded-lg overflow-hidden z-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Invalid coordinate values</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80 rounded-lg overflow-hidden z-0">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        key={`${position[0]}-${position[1]}`}
        zoomControl={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <strong>{address || "Location"}</strong>
              <br />
              <span className="text-gray-600">
                {position[0].toFixed(4)}, {position[1].toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
