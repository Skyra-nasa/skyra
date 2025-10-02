import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { MapPin, Crosshair, Layers, Maximize2, Navigation, Info, MapIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create different colored default markers
const createColoredMarker = (color = '#3388ff') => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="5" fill="#ffffff"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });
};

// Fix default markers fallback
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
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 12, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
};

// Enhanced marker events with better UX
const MarkerEvents = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      if (onLocationSelect) {
        // Add haptic feedback for mobile
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        onLocationSelect({ lat, lon: lng });
      }
    };

    map.on("click", handleMapClick);
    
    // Change cursor on hover
    map.on("mousemove", () => {
      map.getContainer().style.cursor = 'crosshair';
    });

    return () => {
      map.off("click", handleMapClick);
      map.off("mousemove");
    };
  }, [map, onLocationSelect]);

  return null;
};

// Geolocation component that provides the hook functionality
const GeolocationHook = ({ onLocationFound, onLocationError, onGeolocationHandler }) => {
  const map = useMap();

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      onLocationError?.('Geolocation is not supported by this browser');
      return;
    }

    map.locate({ 
      setView: true, 
      maxZoom: 12,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  }, [map, onLocationError]);

  useEffect(() => {
    const handleLocationFound = (e) => {
      const { lat, lng } = e.latlng;
      onLocationFound?.({ lat, lon: lng, accuracy: e.accuracy });
    };

    const handleLocationError = (e) => {
      onLocationError?.(e.message || 'Unable to find your location');
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [map, onLocationFound, onLocationError]);

  // Expose the geolocation handler to parent
  useEffect(() => {
    if (onGeolocationHandler) {
      onGeolocationHandler(handleGeolocation);
    }
  }, [handleGeolocation, onGeolocationHandler]);

  return null;
};

// Draggable marker component
const DraggableMarker = ({ position, onDragEnd, icon, children }) => {
  const markerRef = React.useRef(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onDragEnd({ lat: newPos.lat, lon: newPos.lng });
        }
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={icon}
    >
      {children}
    </Marker>
  );
};

// Map Controller to manage map instance
const MapController = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

// Enhanced Zoom and Navigation Controls
const EnhancedMapControls = ({ onZoomIn, onZoomOut, onResetView, onFitBounds, onGeolocation }) => {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center bg-background hover:bg-accent text-foreground hover:text-accent-foreground transition-colors border-b border-border/30 text-lg font-bold"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center bg-background hover:bg-accent text-foreground hover:text-accent-foreground transition-colors text-lg font-bold"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onResetView}
          className="w-10 h-10 flex items-center justify-center bg-background hover:bg-accent text-foreground hover:text-accent-foreground transition-colors border-b border-border/30"
          title="Reset View"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={onFitBounds}
          className="w-10 h-10 flex items-center justify-center bg-background hover:bg-accent text-foreground hover:text-accent-foreground transition-colors border-b border-border/30"
          title="Fit to Markers"
        >
          <MapIcon size={14} />
        </button>
        <button
          onClick={onGeolocation}
          className="w-10 h-10 flex items-center justify-center bg-background hover:bg-accent text-foreground hover:text-accent-foreground transition-colors"
          title="Find My Location"
        >
          <Navigation size={14} />
        </button>
      </div>
    </div>
  );
};

const InteractiveMap = ({ selectedLocation, onLocationSelect, onCityUpdate }) => {
  const [currentLayer, setCurrentLayer] = useState('street');
  const [userLocation, setUserLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [geolocationHandler, setGeolocationHandler] = useState(null);
  const defaultCenter = React.useMemo(() => [20, 0], []);

  const layers = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Reverse geocoding to get location info
  const fetchLocationInfo = useCallback(async (lat, lon) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();
      setLocationInfo({
        lat: lat, // Store coordinates to track changes
        lon: lon,
        name: data.display_name,
        address: data.address,
        country: data.address?.country,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setLocationInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle location selection with enhanced feedback
  const handleLocationSelect = useCallback((location) => {
    onLocationSelect(location);
    fetchLocationInfo(location.lat, location.lon);
  }, [onLocationSelect, fetchLocationInfo]);

  // Update location info when selectedLocation changes (from external sources like city search)
  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lon) {
      // Only fetch if we don't already have location info or the coordinates changed
      const coordsChanged = !locationInfo || 
        Math.abs(selectedLocation.lat - (locationInfo.lat || 0)) > 0.001 ||
        Math.abs(selectedLocation.lon - (locationInfo.lon || 0)) > 0.001;
      
      if (coordsChanged) {
        fetchLocationInfo(selectedLocation.lat, selectedLocation.lon);
      }
    }
  }, [selectedLocation, locationInfo, fetchLocationInfo]);

  const handleGeolocationFound = useCallback(async (location) => {
    setUserLocation(location);
    const selectedLoc = { lat: location.lat, lon: location.lon };
    
    // Also fetch city name for the location input
    if (onCityUpdate) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}&addressdetails=1`
        );
        const data = await response.json();
        const cityName = data.address?.city || data.address?.town || data.address?.village || data.name || '';
        
        if (cityName) {
          selectedLoc.name = cityName;
          onCityUpdate(cityName, location.lat.toFixed(6), location.lon.toFixed(6));
        }
      } catch (error) {
        console.error('Error fetching city name:', error);
      }
    }
    
    handleLocationSelect(selectedLoc);
  }, [handleLocationSelect, onCityUpdate]);

  const handleGeolocationError = useCallback((error) => {
    console.error('Geolocation error:', error);
    // You could show a toast notification here
  }, []);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback((location) => {
    onLocationSelect(location);
    fetchLocationInfo(location.lat, location.lon);
  }, [onLocationSelect, fetchLocationInfo]);

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  }, [mapInstance]);

  const handleResetView = useCallback(() => {
    if (mapInstance) {
      mapInstance.setView(defaultCenter, 2);
    }
  }, [mapInstance, defaultCenter]);

  const handleFitBounds = useCallback(() => {
    if (mapInstance && (selectedLocation || userLocation)) {
      const bounds = [];
      if (selectedLocation) bounds.push([selectedLocation.lat, selectedLocation.lon]);
      if (userLocation) bounds.push([userLocation.lat, userLocation.lon]);
      
      if (bounds.length > 0) {
        if (bounds.length === 1) {
          mapInstance.setView(bounds[0], 12);
        } else {
          mapInstance.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }
  }, [mapInstance, selectedLocation, userLocation]);

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-card shadow-xl">
      {/* Custom Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Layers size={14} />
            <span>Map Style</span>
          </div>
          <select
            value={currentLayer}
            onChange={(e) => setCurrentLayer(e.target.value)}
            className="w-full text-xs bg-background border border-border/50 rounded px-2 py-1"
          >
            <option value="street">Street View</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>

      {/* Location Info Panel */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-primary/10 rounded">
              <MapPin size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground mb-1">Selected Location</div>
              {isLoading ? (
                <div className="text-xs text-muted-foreground">Loading location info...</div>
              ) : locationInfo ? (
                <div className="space-y-1">
                  <div className="text-xs text-foreground font-medium truncate">
                    {/* Prioritize city name from search, then reverse geocoding */}
                    {selectedLocation.name || locationInfo.city || locationInfo.name?.split(',')[0] || 'Unknown Location'}
                  </div>
                  {locationInfo.country && (
                    <div className="text-xs text-muted-foreground">
                      {locationInfo.state ? `${locationInfo.state}, ` : ''}{locationInfo.country}
                    </div>
                  )}
                </div>
              ) : selectedLocation.name ? (
                <div className="space-y-1">
                  <div className="text-xs text-foreground font-medium truncate">
                    {selectedLocation.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Crosshair size={12} />
          <span>Click anywhere on the map to select a location</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="rounded-xl"
      >
        <TileLayer
          attribution={currentLayer === 'satellite' ? 
            '&copy; <a href="https://www.esri.com/">Esri</a>' : 
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          url={layers[currentLayer]}
        />

        {/* Map Controller to handle map instance */}
        <MapController onMapReady={setMapInstance} />

        <FlyToLocation selectedLocation={selectedLocation} />
        <MarkerEvents onLocationSelect={handleLocationSelect} />
        <GeolocationHook 
          onLocationFound={handleGeolocationFound}
          onLocationError={handleGeolocationError}
          onGeolocationHandler={setGeolocationHandler}
        />

        {/* User location marker with accuracy circle */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lon]}
              radius={userLocation.accuracy || 100}
              pathOptions={{
                fillColor: '#10b981',
                fillOpacity: 0.1,
                color: '#10b981',
                weight: 2,
                opacity: 0.3
              }}
            />
            <Marker 
              position={[userLocation.lat, userLocation.lon]}
              icon={createColoredMarker('#10b981')}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">Your Location</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Accuracy: ±{Math.round(userLocation.accuracy || 0)}m
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Selected location marker (draggable) */}
        {selectedLocation && (
          <DraggableMarker
            position={[selectedLocation.lat, selectedLocation.lon]}
            onDragEnd={handleMarkerDragEnd}
            icon={createColoredMarker('#3b82f6')}
          >
            <Popup>
              <div className="text-sm space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <span>Selected Location</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Draggable</span>
                </div>
                {locationInfo ? (
                  <div className="space-y-1">
                    <div className="text-sm">
                      {selectedLocation.name || locationInfo.city || locationInfo.name?.split(',')[0] || 'Unknown Location'}
                    </div>
                    {locationInfo.country && (
                      <div className="text-xs text-gray-600">
                        {locationInfo.state ? `${locationInfo.state}, ` : ''}{locationInfo.country}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 border-t pt-1">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                    </div>
                  </div>
                ) : selectedLocation.name ? (
                  <div className="space-y-1">
                    <div className="text-sm">{selectedLocation.name}</div>
                    <div className="text-xs text-gray-600 border-t pt-1">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-600">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  💡 Drag this marker to adjust the position
                </div>
              </div>
            </Popup>
          </DraggableMarker>
        )}
      </MapContainer>

      {/* Enhanced Map Controls */}
      <EnhancedMapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onFitBounds={handleFitBounds}
        onGeolocation={() => geolocationHandler?.()}
      />

      {/* Enhanced CSS for map and controls */}
      <style jsx>{`
        .leaflet-container {
          font-family: inherit;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid hsl(var(--border));
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .leaflet-control {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        
        .leaflet-control button:hover {
          transform: scale(1.05);
        }
        
        /* Smooth transitions for all interactive elements */
        .leaflet-marker-icon,
        .leaflet-control,
        .leaflet-control button {
          transition: all 0.2s ease;
        }
        
        /* Enhanced dragging feedback */
        .leaflet-marker-dragging {
          transition: none !important;
        }
        
        .leaflet-marker-dragging .leaflet-marker-icon {
          transform: scale(1.1);
          opacity: 0.8;
        }
        
        /* Custom marker hover effects */
        .leaflet-marker-icon:hover {
          transform: scale(1.1);
        }
        
        /* Geolocation button styling */
        .geolocation-btn:hover {
          background-color: #f5f5f5 !important;
          transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
