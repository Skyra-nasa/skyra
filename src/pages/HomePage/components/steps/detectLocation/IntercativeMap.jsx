import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to move the map when selectedLocation changes
const FlyToLocation = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 8, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
};
const MarkerEvents = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (onLocationSelect) {
        onLocationSelect({ lat, lon: lng });
      }
    });
  }, [map, onLocationSelect]);

  return null;
};

const InteractiveMap = ({ selectedLocation, onLocationSelect }) => {
  const defaultCenter = [20, 0];

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={defaultCenter}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation selectedLocation={selectedLocation} />

        <MarkerEvents onLocationSelect={onLocationSelect} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lon]} />
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
