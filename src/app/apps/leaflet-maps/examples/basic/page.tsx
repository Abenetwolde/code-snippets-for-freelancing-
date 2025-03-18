// app/apps/leaflet-maps/examples/basic/page.tsx
"use client"; // Client component
import dynamic from "next/dynamic";

const BasicMap = dynamic(() => import("./components/BasicMap"), {
  ssr: false, // Disable SSR for Leaflet
  loading: () => <p>Loading map...</p>,
});

export default function BasicMapPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Basic Map Example</h1>
      <div style={{ height: "500px", width: "100%" }}>
        <BasicMap />
      </div>
    </div>
  );
}