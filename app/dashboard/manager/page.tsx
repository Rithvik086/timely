"use client";
import Pusher from "pusher-js";
import { useEffect, useState, useRef } from "react";
import { haverSineDistance } from "@/lib/geoDist";
import { Button } from "antd";

// ✅ Define the type for events
type LocationUpdate = {
  userId: string;
  lat: number;
  lon: number;
  timestamp: string;
  status?: string;
  accuracy?: number;
};

export default function ManagerDashboard() {
  const [locations, setLocations] = useState<LocationUpdate[]>([]);
  const [managerCoords, setManagerCoords] = useState<LocationUpdate | null>(
    null
  );
  const managerCoordsRef = useRef<LocationUpdate | null>(null);

  const perimeterRadius = 50; // in meters

  const saveManagerCoords = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const coords: LocationUpdate = {
        userId: "manager",
        lat: latitude,
        lon: longitude,
        timestamp: new Date().toISOString(),
      };
      setManagerCoords(coords);
      managerCoordsRef.current = coords; // ✅ keep ref in sync
      console.log("✅ Manager perimeter set at:", coords);
    });
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("locations");

    channel.bind("location-update", (data: LocationUpdate) => {
      console.log("📡 Incoming location:", data);
      setLocations((prev) => [...prev, data]);

      const manager = managerCoordsRef.current;
      if (!manager) {
        console.warn("⚠️ Manager location not set yet");
        return;
      }

      const dist = haverSineDistance(
        manager.lat,
        manager.lon,
        data.lat,
        data.lon
      );

      const isClockedIn = dist <= perimeterRadius;
      const status = isClockedIn
        ? `✅ Clocked IN (${dist.toFixed(2)}m from perimeter)`
        : `🚨 Clocked OUT (${dist.toFixed(2)}m from perimeter)`;

      setLocations((prev) => {
        // Remove old entries for this user
        const filtered = prev.filter((loc) => loc.userId !== data.userId);
        // Add new entry with status
        return [...filtered, { ...data, status }];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manager Dashboard</h1>
      <Button type="primary" onClick={saveManagerCoords}>
        Set Perimeter
      </Button>

      <div className="mt-4">
        {managerCoords ? (
          <p>
            📍 Manager perimeter set at: {managerCoords.lat.toFixed(5)},{" "}
            {managerCoords.lon.toFixed(5)} (Radius: {perimeterRadius}m)
          </p>
        ) : (
          <p className="text-gray-500">No perimeter set yet.</p>
        )}
      </div>

      <h2 className="mt-6 font-semibold">Worker Status</h2>
      <ul className="space-y-2">
        {locations.map((loc, i) => (
          <li
            key={i}
            className={`p-2 rounded ${
              loc.status?.includes("IN") ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div>
              <strong>{loc.userId}</strong>
            </div>
            <div className="text-sm text-gray-600">
              Location: {loc.lat.toFixed(5)}, {loc.lon.toFixed(5)}
            </div>
            <div className="text-sm">{loc.status}</div>
            <div className="text-xs text-gray-500">
              Last update: {new Date(loc.timestamp).toLocaleTimeString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
