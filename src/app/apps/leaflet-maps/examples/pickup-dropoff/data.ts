// app/apps/leaflet-maps/examples/pickup-dropoff/data.ts
export interface PickupPoint {
    id: string;
    name: string;
    type: "Locker" | "Store";
    location: [number, number]; // [lat, lng]
    availability: number; // Available slots or capacity
  }
  
  export const pickupPoints: PickupPoint[] = [
    {
      id: "P1",
      name: "Bole Locker",
      type: "Locker",
      location: [9.0132, 38.7498], // Bole, Addis Ababa
      availability: 5,
    },
    {
      id: "P2",
      name: "Piassa Store",
      type: "Store",
      location: [9.0309, 38.7525], // Piassa, Addis Ababa
      availability: 3,
    },
    {
      id: "P3",
      name: "Mexico Square Locker",
      type: "Locker",
      location: [9.0105, 38.7399], // Mexico Square, Addis Ababa
      availability: 2,
    },
    {
      id: "P4",
      name: "Meskel Square Store",
      type: "Store",
      location: [9.0119, 38.7618], // Meskel Square, Addis Ababa
      availability: 4,
    },
  ];
  
  // Simulate real-time availability updates
  export const updateAvailability = (points: PickupPoint[]): PickupPoint[] => {
    return points.map((point) => ({
      ...point,
      availability: Math.max(0, point.availability + (Math.random() > 0.7 ? -1 : 0)), // Randomly decrease availability
    }));
  };