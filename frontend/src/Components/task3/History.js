import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [deviceInfo, setDeviceInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4002/api/device-info");
        if (response.ok) {
          const data = await response.json();
          setDeviceInfo(data);
        } else {
          console.error("Failed to fetch device info data");
        }
      } catch (error) {
        console.error("Error fetching device info data:", error);
      }
    };

    fetchData();
  }, []);

  const handleHome = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userdbtoken");
    navigate("/");
  };

  return (
    <div className="max-w-md w-full mx-auto text-center mt-4 p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleHome}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Home
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
      <h2 className="text-lg font-bold mb-2">Device Information History</h2>
      {deviceInfo.length > 0 ? (
        deviceInfo.map((info) => (
          <div
            key={info._id}
            className="mb-4 p-2 border border-gray-300 rounded"
          >
            <p>
              <strong>Browser:</strong> {info.browser}
            </p>
            <p>
              <strong>Operating System:</strong> {info.os}
            </p>
            <p>
              <strong>Device Type:</strong> {info.deviceType}
            </p>
            <p>
              <strong>IP Address:</strong> {info.ipAddress}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(info.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No device information data available</p>
      )}
    </div>
  );
};

export default History;
