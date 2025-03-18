// app/apps/leaflet-maps/examples/store-locator/components/StoreList.tsx
"use client";

import { Store } from "../data";

interface StoreListProps {
  stores: Store[];
  userLocation: [number, number] | null;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const StoreList = ({ stores, userLocation ,onStoreSelect}: StoreListProps) => {
  const sortedStores = userLocation
    ? [...stores].sort((a, b) => {
        const distA = calculateDistance(
          userLocation[0],
          userLocation[1],
          a.lat,
          a.lng
        );
        const distB = calculateDistance(
          userLocation[0],
          userLocation[1],
          b.lat,
          b.lng
        );
        return distA - distB;
      })
    : stores;

  return (
    <div className="p-4 overflow-y-auto max-h-[500px]">
      {sortedStores.map((store) => (
        <div
          key={store.id}
          className="border border-gray-200 p-4 mb-4 rounded-lg"
          onClick={() => onStoreSelect(store.lat, store.lng)}
        >
          <h3 className="font-semibold text-lg">{store.name}</h3>
          <p className="text-gray-700">{store.address}</p>
          <p className="text-gray-700">Hours: {store.hours}</p>
          <p className="text-gray-700">Contact: {store.contact}</p>
          {userLocation && (
            <p className="text-gray-600">
              Distance:{" "}
              {calculateDistance(
                userLocation[0],
                userLocation[1],
                store.lat,
                store.lng
              ).toFixed(2)}{" "}
              km
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoreList;