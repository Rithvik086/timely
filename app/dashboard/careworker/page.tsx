"use client";
import { useState, useRef, useEffect } from "react";
import { Button, Alert, Space } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const Page = () => {
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [workerId, setWorkerId] = useState<string>("");
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestFixRef = useRef<GeolocationPosition | null>(null);

  // Initialize worker ID
  useEffect(() => {
    const storedId = localStorage.getItem("workerId");
    if (storedId) {
      setWorkerId(storedId);
    } else {
      const newId = `worker-${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem("workerId", newId);
      setWorkerId(newId);
    }
  }, []);

  const sendLocation = async (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;

    console.log("➡️ Sending location:", {
      userId: workerId,
      lat: latitude,
      lon: longitude,
      accuracy: Math.round(accuracy) + "m",
      timestamp: new Date(pos.timestamp).toISOString(),
    });

    try {
      const response = await fetch("/api/pusher/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: workerId,
          lat: latitude,
          lon: longitude,
          accuracy: Math.round(accuracy),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(`Failed to send location: ${data.error}`);
      } else if (data.clockedIn !== undefined && data.clockedIn !== clockedIn) {
        setClockedIn(data.clockedIn);
        setError(
          data.clockedIn
            ? "✅ You're now clocked in!"
            : "⚠️ You're now clocked out (outside work perimeter)"
        );
      }
    } catch (err) {
      console.error("❌ Error sending location:", err);
      setError("Failed to send location update");
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);
    setError(null);

    // Start watching GPS updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        latestFixRef.current = pos; // keep latest fix
        sendLocation(pos); // send immediately when GPS event arrives
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
        let errorMessage = "Location error: ";

        switch (err.code) {
          case err.TIMEOUT:
            errorMessage +=
              "Taking longer than usual to get your location. Please wait...";
            break;
          case err.PERMISSION_DENIED:
            errorMessage +=
              "Permission denied. Please enable location access in your browser settings.";
            stopTracking();
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage +=
              "Unable to determine your location. Please check your device's location settings.";
            break;
          default:
            errorMessage += err.message;
        }

        setError(errorMessage);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );

    // Start interval for forced updates every 10s
    intervalRef.current = setInterval(() => {
      if (latestFixRef.current) {
        console.log("⏰ Interval tick - sending last known fix");
        sendLocation(latestFixRef.current);
      }
    }, 10000);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <h1>Careworker Dashboard</h1>
        {workerId && <p>Worker ID: {workerId}</p>}

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
            message={clockedIn ? "Clocked In" : "Location Tracking Active"}
            description={
              clockedIn
                ? "You are within the work perimeter and clocked in."
                : "Your location is being tracked. Waiting for manager to set perimeter."
            }
            type={clockedIn ? "success" : "info"}
            showIcon
          />
        )}

        {!isTracking ? (
          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            onClick={startTracking}
            size="large"
          >
            Start Location Tracking
          </Button>
        ) : (
          <Button danger onClick={stopTracking} size="large">
            Stop Location Tracking
          </Button>
        )}
      </Space>
    </div>
  );
};

export default Page;
