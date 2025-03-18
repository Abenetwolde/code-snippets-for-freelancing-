// app/apps/leaflet-maps/examples/store-locator/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { stores, Store } from "./data";

const StoreMap = dynamic(() => import("./components/StoreMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const StoreList = dynamic(() => import("./components/StoreList"), {
  ssr: false,
});

export default function StoreLocatorPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [selectedStore, setSelectedStore] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setUserLocation([lat, lng]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Store Locator</h1>
      <div className="mb-6">
        <p className="mb-2">
          Enter your location manually (or use geolocation):
        </p>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-32"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-32"
          />
          <button
            onClick={handleManualLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Set Location
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 h-[500px]">
        <div className="flex-2">
          <StoreMap stores={stores} userLocation={userLocation}       selectedStore={selectedStore}/>
        </div>
        <div className="flex-1">
          <StoreList stores={stores} userLocation={userLocation}  onStoreSelect={(lat, lng) => setSelectedStore([lat, lng])} />
        </div>
      </div>
    </div>
  );
}