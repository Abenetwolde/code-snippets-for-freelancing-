// app/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const miniApps = [
    { title: "Leaflet Maps", path: "/apps/leaflet-maps" },
    { title: "Supabase Examples", path: "/apps/supabase-examples" },
    // Add more mini-apps later, e.g., { title: "Charts", path: "/apps/charts" }
  ];

  return (
    <div className={styles.container}>
      <h1>Mini Apps</h1>
      <div className={styles.cardList}>
        {miniApps.map((app) => (
          <Link key={app.path} href={app.path} className={styles.card}>
            <div>
              <h2>{app.title}</h2>
              <p>Explore examples of this mini-app</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}