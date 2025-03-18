// app/apps/leaflet-maps/examples/components/BasicMap.tsx
"use client"; // Client component

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const BasicMap = () => {
  const position: [number, number] = [51.505, -0.09]; // London coordinates

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A sample popup. <br /> Welcome to London!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default BasicMap;