// app/apps/leaflet-maps/examples/delivery-tracker/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  initialOrders,
  initialDriverState,
  optimizeRoute,
  simulateDriverMovement,
  updateDeliveryState,
  Order,
  DriverState,
} from "./data";

const DeliveryMap = dynamic(() => import("./components/DeliveryMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const OrderDetails = dynamic(() => import("./components/OrderDetails"), {
  ssr: false,
});

export default function DeliveryTrackerPage() {
  const [orders, setOrders] = useState<Order[]>(optimizeRoute(initialDriverState.location, initialOrders));
  const [driver, setDriver] = useState<DriverState>(initialDriverState);

  useEffect(() => {
    const interval = setInterval(() => {
      setDriver((prevDriver) => {
        if (prevDriver.currentOrderIndex >= orders.length) return prevDriver; // All delivered

        const currentTarget = orders[prevDriver.currentOrderIndex].deliveryLocation;
        const newLocation = simulateDriverMovement(prevDriver.location, currentTarget);

        setOrders((prevOrders) =>
          updateDeliveryState(prevOrders, newLocation, prevDriver.currentOrderIndex)
        );

        const distanceToTarget = calculateDistance(
          newLocation[0],
          newLocation[1],
          currentTarget[0],
          currentTarget[1]
        );

        if (distanceToTarget < 0.01) {
          return {
            ...prevDriver,
            location: newLocation,
            currentOrderIndex: prevDriver.currentOrderIndex + 1,
          };
        }

        return { ...prevDriver, location: newLocation };
      });
    }, 1000); // Update every 1 second

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delivery Tracker</h1>
      <div className="flex flex-col md:flex-row gap-6 h-[500px]">
        <div className="flex-2">
          <DeliveryMap orders={orders} driver={driver} />
        </div>
        <div className="flex-1">
          <OrderDetails orders={orders} driver={driver} />
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate distance (duplicated here for clarity, ideally imported)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};