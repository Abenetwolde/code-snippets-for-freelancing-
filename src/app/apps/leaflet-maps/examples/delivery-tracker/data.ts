// app/apps/leaflet-maps/examples/delivery-tracker/data.ts
export interface Order {
    id: string;
    customerName: string;
    deliveryLocation: [number, number];
    status: "Pending" | "In Transit" | "Delivered";
    eta: string;
  }
  
  export interface DriverState {
    location: [number, number];
    currentOrderIndex: number; // Index of the current order being delivered
  }
  
  // Initial driver state
  export const initialDriverState: DriverState = {
    location: [51.52, -0.12], // Starting position
    currentOrderIndex: 0,
  };
  
  // Sample multiple orders
  export const initialOrders: Order[] = [
    {
      id: "ORD123",
      customerName: "John Doe",
      deliveryLocation: [51.505, -0.09],
      status: "Pending",
      eta: "Calculating...",
    },
    {
      id: "ORD124",
      customerName: "Jane Smith",
      deliveryLocation: [51.51, -0.1],
      status: "Pending",
      eta: "Calculating...",
    },
    {
      id: "ORD125",
      customerName: "Bob Johnson",
      deliveryLocation: [51.50, -0.12],
      status: "Pending",
      eta: "Calculating...",
    },
  ];
  
  // Haversine formula for distance calculation (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Optimize delivery route using nearest neighbor algorithm
  export const optimizeRoute = (start: [number, number], orders: Order[]): Order[] => {
    const unvisited = [...orders];
    const optimizedOrders: Order[] = [];
    let currentLocation = start;
  
    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;
  
      // Find the nearest unvisited order
      unvisited.forEach((order, index) => {
        const distance = calculateDistance(
          currentLocation[0],
          currentLocation[1],
          order.deliveryLocation[0],
          order.deliveryLocation[1]
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });
  
      const nearestOrder = unvisited.splice(nearestIndex, 1)[0];
      optimizedOrders.push(nearestOrder);
      currentLocation = nearestOrder.deliveryLocation;
    }
  
    return optimizedOrders;
  };
  
  // Simulate driver movement towards the current target
  export const simulateDriverMovement = (
    currentLocation: [number, number],
    targetLocation: [number, number],
    step: number = 0.005
  ): [number, number] => {
    const [currentLat, currentLng] = currentLocation;
    const [targetLat, targetLng] = targetLocation;
  
    const newLat =
      currentLat < targetLat
        ? Math.min(currentLat + step, targetLat)
        : Math.max(currentLat - step, targetLat);
    const newLng =
      currentLng < targetLng
        ? Math.min(currentLng + step, targetLng)
        : Math.max(currentLng - step, targetLng);
  
    return [newLat, newLng];
  };
  
  // Update order status and ETA
  export const updateDeliveryState = (
    orders: Order[],
    driverLocation: [number, number],
    currentOrderIndex: number
  ): Order[] => {
    return orders.map((order, index) => {
      const distance = calculateDistance(
        driverLocation[0],
        driverLocation[1],
        order.deliveryLocation[0],
        order.deliveryLocation[1]
      );
      if (index === currentOrderIndex) {
        if (distance < 0.01) {
          return { ...order, status: "Delivered", eta: "Arrived" };
        } else if (order.status === "Pending") {
          return { ...order, status: "In Transit", eta: `${Math.round(distance * 5)} minutes` };
        } else {
          return { ...order, eta: `${Math.round(distance * 5)} minutes` };
        }
      }
      return order.status === "Delivered" ? order : { ...order, eta: "Pending" };
    });
  };