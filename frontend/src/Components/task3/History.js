import React from "react";
import { useNavigate } from "react-router-dom";
import Device from "./Device";

const History = () => {
  const navigate = useNavigate();

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
          className="px-4 py-2 text-white bg-blue-600  font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Home
        </button>
        <button
          onClick={handleLogout}
          className="px-4 rounded-lg shadow-md py-2 bg-red-600   hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white font-semibold transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
      <Device />
    </div>
  );
};

export default History;
