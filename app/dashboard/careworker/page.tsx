"use client";
import { useState } from "react";
import { Button, Alert, Space } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const Page = () => {
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        console.log("📍 Got location:", pos.coords);
        const { latitude, longitude } = pos.coords;
        setError(null);
        setIsTracking(true);

        try {
          const response = await fetch("/api/pusher/", {
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

          const data = await response.json();
          if (!data.success) {
            setError(`Failed to send location: ${data.error}`);
          }
        } catch (error) {
          setError("Error sending location data");
          console.error("Error sending location:", error);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(`Location error: ${err.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <h1>Careworker Dashboard</h1>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}

        {isTracking && (
          <Alert
            message="Location Tracking Active"
            description="Your location is being tracked and shared with the system."
            type="success"
            showIcon
          />
        )}

        {!isTracking && (
          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            onClick={startTracking}
            size="large"
          >
            Start Location Tracking
          </Button>
        )}
      </Space>
    </div>
  );
};

export default Page;
