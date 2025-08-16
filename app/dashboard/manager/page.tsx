"use client";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

// ✅ Define the type for events
type LocationUpdate = {
  userId: string;
  lat: number;
  lon: number; // keep consistent with your API
  timestamp: string;
};

export default function ManagerDashboard() {
  const [locations, setLocations] = useState<LocationUpdate[]>([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("locations");

    channel.bind("location-update", (data: LocationUpdate) => {
      setLocations((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all(); // ✅ properly unbind events
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manager Dashboard</h1>
      <ul>
        {locations.map((loc, i) => (
          <li key={i}>
            {loc.userId} → {loc.lat.toFixed(5)}, {loc.lon.toFixed(5)} at{" "}
            {new Date(loc.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
