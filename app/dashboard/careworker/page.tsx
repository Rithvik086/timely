"use client";
import { useEffect } from "react";
const Page = () => {
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        await fetch("/api/pusher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user-id",
            lat: latitude,
            lon: longitude,
          }),
        });
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return <div>careworker dahboard</div>;
};

export default Page;
