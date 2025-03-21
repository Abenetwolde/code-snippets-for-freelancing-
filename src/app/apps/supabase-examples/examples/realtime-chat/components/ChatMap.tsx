// app/apps/supabase-examples/examples/realtime-chat/components/ChatMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const ChatMap = () => {
  const meetupLocation: [number, number] = [51.505, -0.09]; // Hardcoded London location

  return (
    <MapContainer center={meetupLocation} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={meetupLocation}>
        <Popup>Chat Meetup Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default ChatMap;