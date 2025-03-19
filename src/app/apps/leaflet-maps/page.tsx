// app/apps/leaflet-maps/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default function LeafletMaps() {
  const examples = [
    { title: "Basic Map", path: "/apps/leaflet-maps/examples/basic" },
    { title: "Store Locator", path: "/apps/leaflet-maps/examples/store-locator" },
    { title: "Delivery Tracker", path: "/apps/leaflet-maps/examples/delivery-tracker" },
    { title: "Address Autocomplete", path: "/apps/leaflet-maps/examples/address-autocomplete" },
    { title: "Pickup & Drop-off Points", path: "/apps/leaflet-maps/examples/pickup-dropoff" },
    // Add more examples later, e.g., { title: "Markers", path: "/apps/leaflet-maps/examples/markers" }
  ];

  return (
    <div className={styles.container}>
      <h1>Leaflet Maps Examples</h1>
      <div className={styles.cardList}>
        {examples.map((example) => (
          <Link key={example.path} href={example.path} className={styles.card}>
            <div>
              <h2>{example.title}</h2>
              <p>View this Leaflet map example</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}