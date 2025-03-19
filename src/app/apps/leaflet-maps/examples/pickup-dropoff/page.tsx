// app/apps/leaflet-maps/examples/pickup-dropoff/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { pickupPoints, updateAvailability, PickupPoint } from "./data";

const PickupMap = dynamic(() => import("./components/PickupMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const PointDetails = dynamic(() => import("./components/PointDetails"), {
  ssr: false,
});

export default function PickupDropoffPage() {
  const [points, setPoints] = useState<PickupPoint[]>(pickupPoints);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const router = useRouter();

  // Simulate real-time availability updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prevPoints) => updateAvailability(prevPoints));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSelectPoint = (point: PickupPoint) => {
    setSelectedPoint(point);
  };

  const handleConfirm = (point: PickupPoint) => {
    alert(`Pickup point confirmed: ${point.name}`);
    router.push("/apps/leaflet-maps"); // Redirect after confirmation
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pickup & Drop-off Point Selection</h1>
      <div className="flex flex-col md:flex-row gap-6 h-[500px]">
        <div className="flex-2">
          <PickupMap points={points} selectedPoint={selectedPoint} onSelectPoint={handleSelectPoint} />
        </div>
        <div className="flex-1">
          <PointDetails selectedPoint={selectedPoint} onConfirm={handleConfirm} />
        </div>
      </div>
    </div>
  );
}