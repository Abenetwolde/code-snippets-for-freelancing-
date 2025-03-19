// app/apps/leaflet-maps/examples/pickup-dropoff/components/PointDetails.tsx
"use client";

import { PickupPoint } from "../data";

interface PointDetailsProps {
  selectedPoint: PickupPoint | null;
  onConfirm: (point: PickupPoint) => void;
}

const PointDetails = ({ selectedPoint, onConfirm }: PointDetailsProps) => {
  if (!selectedPoint) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Pickup Point Details</h2>
        <p className="text-gray-600">Select a point on the map to see details.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pickup Point Details</h2>
      <div className="border border-gray-200 p-4 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">Name:</span> {selectedPoint.name}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Type:</span> {selectedPoint.type}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Availability:</span> {selectedPoint.availability} slots
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Location:</span>{" "}
          {selectedPoint.location[0].toFixed(4)}, {selectedPoint.location[1].toFixed(4)}
        </p>
        <button
          onClick={() => onConfirm(selectedPoint)}
          disabled={selectedPoint.availability === 0}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white ${
            selectedPoint.availability > 0
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default PointDetails;