import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, CheckCircle, Search } from "lucide-react";
import InteractiveMap from "./IntercativeMap";

const LocationStep = ({selectedLocation,setSelectedLocation}) => {
  const [cityName, setCityName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
 
  const searchContainerRef = useRef(null);

  // search cities
  const searchCities = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&featuretype=city`
      );
      

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      const results = data.map((item) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        name: item.name || item.display_name.split(",")[0],
      }));

      setSearchResults(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error("Geocoding error:", error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelect = (result) => {
    const location = {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.name,
    };
    setSelectedLocation(location);
    setCityName(result.name);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setShowSuggestions(false);
  };

  // update lat/long inputs when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation.lat.toFixed(6));
      setLongitude(selectedLocation.lon.toFixed(6));
    }
  }, [selectedLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSuggestions &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (
      !isNaN(lat) &&
      !isNaN(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      setSelectedLocation({ lat, lon });
    } else {
      alert("Invalid coordinates entered");
    }
  };

  return (
    <div className="flex gap-7 mt-7 max-xl:flex-wrap">
      {/* Location Input Controls */}
      <div className="space-y-6 w-[40%] max-xl:w-full">
        <Card className="pt-0">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 text-xl pt-5 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-[22px]">
              <MapPin className="h-5 w-5" />
              Choose Your Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* City Search */}
            <div
              className="space-y-2 relative search-container"
              ref={searchContainerRef}
            >
              <Label htmlFor="city" className="mb-2.5 text-base font-medium">
                Search by City
              </Label>
              <div className="relative">
                <Input
                  id="city"
                  placeholder="Type a city name..."
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchCities(cityName);
                    }
                  }}
                  onFocus={() => setShowSuggestions(searchResults.length > 0)}
                  className="pr-10 h-11"
                />
                {/* Loader or Search Icon */}
                {isSearching ? (
                  <Loader2 className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : (
                  <Search
                    className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => searchCities(cityName)}
                  />
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 rounded-xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.45),0_2px_6px_-2px_rgba(0,0,0,0.35)]">
                    <div className="max-h-60 overflow-y-auto thin-scrollbar overscroll-contain rounded-xl">
                      {searchResults.map((result, idx) => (
                        <button
                          key={result.place_id}
                          className="group relative w-full text-left px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:bg-accent/70 focus:text-accent-foreground hover:bg-accent/60 hover:text-accent-foreground/95"
                          onClick={() => handleCitySelect(result)}
                        >
                          <div className="font-medium leading-tight truncate flex items-center gap-2">
                            <span className="inline-block size-1.5 rounded-full bg-gradient-to-r from-primary to-chart-2 group-hover:from-chart-2 group-hover:to-primary transition-all" />
                            {result.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground/70 group-hover:text-accent-foreground/80 truncate tracking-wide">
                            {result.display_name}
                          </div>
                          {idx !== searchResults.length - 1 && (
                            <span className="pointer-events-none absolute left-3 right-3 bottom-0 h-px bg-border/50" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Coordinate Input */}
            <div className="space-y-2">
              <Label className="mb-2.5 text-base font-medium">Enter Coordinates</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  className="h-11 rounded-xl bg-background/60 dark:bg-input/40 hover:bg-background/80 focus-visible:bg-background/90 transition-colors border-border/60 focus-visible:border-primary/60 pr-9 number-modern"
                />
                <Input
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  className="h-11 rounded-xl bg-background/60 dark:bg-input/40 hover:bg-background/80 focus-visible:bg-background/90 transition-colors border-border/60 focus-visible:border-primary/60 pr-9 number-modern"
                />
                <Button
                  onClick={handleCoordinateSubmit}
                  disabled={!latitude || !longitude}
                  className="h-11"
                >
                  Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Location Display */}
        {selectedLocation && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Location Selected</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.lat.toFixed(4)},{" "}
                    {selectedLocation.lon.toFixed(4)}
                    {selectedLocation?.name && (
                      <span className="block">{selectedLocation.name}</span>
                    )}
                  </p>
                </div>
              </div> 
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interactive Map */}
      <div className="space-y-4 w-[60%] max-xl:w-full">
        <Card className="py-0">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 text-xl pt-5 rounded-t-xl">
            <CardTitle className="text-[22px]">Interactive Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InteractiveMap
              onLocationSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground text-center">
          Click anywhere on the map to select a location
        </p>
      </div>
    </div>
  );
};

export default LocationStep;
