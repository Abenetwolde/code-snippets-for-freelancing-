// app/apps/leaflet-maps/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default function LeafletMaps() {
  const examples = [
    { title: "Sign up/Firestore/Storage", path: "/apps/firebase/auth/signup" },
    { title: "Sign in/Firestore/Storage", path: "/apps/firebase/auth/signin" },
    { title: "CRUD", path: "/apps/firebase/crud" },
    { title: "Real-Time Database/chat app", path: "/apps/firebase/realtime-chat" },
   
    // Add more examples later, e.g., { title: "Markers", path: "/apps/leaflet-maps/examples/markers" }
  ];

  return (
    <div className={styles.container}>
      <h1>firebase Examples</h1>
      <div className={styles.cardList}>
        {examples.map((example) => (
          <Link key={example.path} href={example.path} className={styles.card}>
            <div>
              <h2>{example.title}</h2>
              <p>View this firebase map example</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}