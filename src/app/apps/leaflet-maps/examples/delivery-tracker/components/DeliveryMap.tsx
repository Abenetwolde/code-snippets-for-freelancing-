// app/apps/leaflet-maps/examples/delivery-tracker/components/DeliveryMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Order, DriverState } from "../data";

interface DeliveryMapProps {
  orders: Order[];
  driver: DriverState;
}

const DeliveryMap = ({ orders, driver }: DeliveryMapProps) => {
  const center: [number, number] = [
    orders.reduce((sum, o) => sum + o.deliveryLocation[0], driver.location[0]) / (orders.length + 1),
    orders.reduce((sum, o) => sum + o.deliveryLocation[1], driver.location[1]) / (orders.length + 1),
  ];

  const routePositions: [number, number][] = [
    driver.location,
    ...orders.map((order) => order.deliveryLocation),
  ];

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(driver.location, 13);
    }, [map, driver.location]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController />
      <Marker position={driver.location}>
        <Popup>
          <h3 className="font-semibold">Driver</h3>
          <p>Current Target: {orders[driver.currentOrderIndex]?.customerName || "None"}</p>
        </Popup>
      </Marker>
      {orders.map((order) => (
        <Marker key={order.id} position={order.deliveryLocation}>
          <Popup>
            <h3 className="font-semibold">{order.customerName}</h3>
            <p>Status: {order.status}</p>
            <p>ETA: {order.eta}</p>
          </Popup>
        </Marker>
      ))}
      <Polyline positions={routePositions} color="blue" weight={4} opacity={0.7} />
    </MapContainer>
  );
};

export default DeliveryMap;