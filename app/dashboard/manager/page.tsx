"use client";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function ManagerDashboard() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("locations");

    channel.bind("location-update", (data: any) => {
      setLocations((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe("locations");
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manager Dashboard</h1>
      <ul>
        {locations.map((loc, i) => (
          <li key={i}>
            {loc.userId} → {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)} at {loc.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
