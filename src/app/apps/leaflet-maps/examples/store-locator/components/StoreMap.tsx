// app/apps/leaflet-maps/examples/store-locator/components/StoreMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Store } from "../data";

interface StoreMapProps {
  stores: Store[];
  userLocation: [number, number] | null;
}

const StoreMap = ({ stores, userLocation, selectedStore}: StoreMapProps) => {
  const defaultCenter: [number, number] = [51.505, -0.09];

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedStore) {
        map.flyTo(selectedStore, 15); // Zoom level 15 for a closer look
      } else if (userLocation) {
        map.flyTo(userLocation, 13);
      }
    }, [map, selectedStore, userLocation]);
    return null;
  };
  

  return (
    <MapContainer
      center={userLocation || defaultCenter}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController />
      {stores.map((store) => (
        <Marker key={store.id} position={[store.lat, store.lng]}>
          <Popup>
            <h3 className="font-semibold">{store.name}</h3>
            <p>{store.address}</p>
            <p>Hours: {store.hours}</p>
            <p>Contact: {store.contact}</p>
          </Popup>
        </Marker>
      ))}
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default StoreMap;