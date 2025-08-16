"use client";
import { useEffect, useState } from "react";
import { Button, Alert, Space } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const Page = () => {
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const requestGeolocation = async () => {
    try {
      // First, check if geolocation is supported
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      // Request permission
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionStatus(permission.state);

      if (permission.state === "granted") {
        startTracking();
      } else if (permission.state === "denied") {
        setError(
          "Location permission denied. Please enable location services in your browser settings."
        );
      }

      // Listen for permission changes
      permission.addEventListener("change", () => {
        setPermissionStatus(permission.state);
        if (permission.state === "granted") {
          startTracking();
        }
      });
    } catch (err) {
      setError("Error requesting location permission");
      console.error(err);
    }
  };

  const startTracking = () => {
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
            onClick={requestGeolocation}
            size="large"
          >
            {permissionStatus === "denied"
              ? "Enable Location Services"
              : "Start Location Tracking"}
          </Button>
        )}

        {permissionStatus === "denied" && (
          <Alert
            message="Location Access Required"
            description={
              <div>
                To enable location tracking:
                <ol>
                  <li>
                    Click the lock/info icon in your browser's address bar
                  </li>
                  <li>Find "Location" or "Site Settings"</li>
                  <li>Change the permission to "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            }
            type="warning"
            showIcon
          />
        )}
      </Space>
    </div>
  );
};

export default Page;
