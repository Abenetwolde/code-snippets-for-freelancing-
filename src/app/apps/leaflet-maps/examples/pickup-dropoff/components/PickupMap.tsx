// app/apps/leaflet-maps/examples/pickup-dropoff/components/PickupMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PickupPoint } from "../data";

interface PickupMapProps {
  points: PickupPoint[];
  selectedPoint: PickupPoint | null;
  onSelectPoint: (point: PickupPoint) => void;
}

const PickupMap = ({ points, selectedPoint, onSelectPoint }: PickupMapProps) => {
  const center: [number, number] = [9.0192, 38.7525]; // Central Addis Ababa

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedPoint) {
        map.setView(selectedPoint.location, 14);
      }
    }, [map, selectedPoint]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={point.location}
          eventHandlers={{
            click: () => onSelectPoint(point),
          }}
        >
          <Popup>
            <h3 className="font-semibold">{point.name}</h3>
            <p>Type: {point.type}</p>
            <p>Availability: {point.availability} slots</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PickupMap;