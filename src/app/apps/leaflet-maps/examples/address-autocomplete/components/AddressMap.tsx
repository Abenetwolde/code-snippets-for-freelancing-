// app/apps/leaflet-maps/examples/address-autocomplete/components/AddressMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface AddressMapProps {
  location: [number, number] | null;
  address: string | null;
}

const AddressMap = ({ location, address }: AddressMapProps) => {
  const defaultCenter: [number, number] = [51.505, -0.09]; // London fallback

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView(location, 13);
      }
    }, [map, location]);
    return null;
  };

  return (
    <MapContainer center={location || defaultCenter} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController />
      {location && address && (
        <Marker position={location}>
          <Popup>{address}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default AddressMap;