// app/apps/leaflet-maps/examples/delivery-tracker/components/OrderDetails.tsx
"use client";

import { Order, DriverState } from "../data";

interface OrderDetailsProps {
  orders: Order[];
  driver: DriverState;
}

const OrderDetails = ({ orders, driver }: OrderDetailsProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-semibold">Order ID:</span> {order.id}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Customer:</span> {order.customerName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Status:</span> {order.status}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">ETA:</span> {order.eta}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Location:</span>{" "}
              {order.deliveryLocation[0].toFixed(4)}, {order.deliveryLocation[1].toFixed(4)}
            </p>
          </div>
        ))}
        <div className="border border-gray-200 p-4 rounded-lg">
          <p className="text-gray-700">
            <span className="font-semibold">Driver Location:</span>{" "}
            {driver.location[0].toFixed(4)}, {driver.location[1].toFixed(4)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Current Target:</span>{" "}
            {orders[driver.currentOrderIndex]?.customerName || "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;