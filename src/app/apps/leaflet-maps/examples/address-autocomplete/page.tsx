// app/apps/leaflet-maps/examples/address-autocomplete/page.tsx
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce"; // Optional: for debouncing API calls

const AddressMap = dynamic(() => import("./components/AddressMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

// Install lodash for debouncing: npm install lodash
// Alternatively, implement a simple debounce manually

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function AddressAutocompletePage() {
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const router = useRouter();

  // Debounced function to fetch address suggestions from Nominatim
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
        );
        const data: NominatimResult[] = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Nominatim API error:", err);
        setError("Failed to fetch address suggestions.");
        setSuggestions([]);
      }
    }, 500), // 500ms debounce
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setIsValid(false); // Reset validation on manual input
    setError("");
    fetchSuggestions(value);
  };

  const handleSuggestionSelect = (suggestion: NominatimResult) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setAddress(suggestion.display_name);
      setLocation([lat, lon]);
      setIsValid(true);
      setSuggestions([]);
      setError("");
    } else {
      setIsValid(false);
      setError("Invalid location data for this address.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please select a valid address from the suggestions.");
      return;
    }
    alert("Checkout successful with address: " + address);
    router.push("/apps/leaflet-maps");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Address Autocomplete & Validation</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="address" className="block text-lg font-medium mb-2">
                Delivery Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.display_name}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-2 px-4 rounded-md text-white ${
                isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Complete Checkout
            </button>
          </form>
        </div>
        <div className="flex-1 h-[500px]">
          <AddressMap location={location} address={address} />
        </div>
      </div>
    </div>
  );
}