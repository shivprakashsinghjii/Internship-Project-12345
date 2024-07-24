import React, { useEffect, useState } from "react";
import platform from "platform";
import { useTranslation } from "react-i18next";

const mobile = () => {
  return (
    navigator.maxTouchPoints > 0 && /android|iphone/i.test(navigator.userAgent)
  );
};

const Device = () => {
  const { t, i18n } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [isMobile, setIsMobile] = useState(mobile());

  const updateUserInfo = () => {
    const email = localStorage.getItem("email");
    const info = {
      email: email || "Unknown", // Add email to the userInfo object
      browser: t(platform.name.toLowerCase()) || platform.name,
      os: t(platform.os.family.toLowerCase()) || platform.os.family,
      deviceType: isMobile ? t("mobile") : t("desktop"),
      ipAddress,
    };
    setUserInfo(info);
  };

  useEffect(() => {
    // Function to fetch IP address
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org/?format=json");
        if (response.ok) {
          const data = await response.json();
          setIpAddress(data.ip);
        } else {
          console.error("Failed to fetch IP address");
        }
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    // Fetch IP address when component mounts
    fetchIpAddress();

    // Set initial user info
    updateUserInfo();

    // Auto-refresh the page every 3 seconds
    const intervalId = setInterval(() => {
      // updateUserInfo();
    }, 3000);

    // Clear the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [t, isMobile, ipAddress]);

  useEffect(() => {
    // Update background color based on the selected language
    switch (i18n.language) {
      case "hi":
        document.body.style.backgroundColor = "blue";
        break;
      case "zh":
        document.body.style.backgroundColor = "green";
        break;
      case "fr":
        document.body.style.backgroundColor = "yellow";
        break;
      default:
        document.body.style.backgroundColor = "white";
        break;
    }

    // Update text color based on the selected language
    const isWhiteText = i18n.language === "hi" || i18n.language === "zh";
    document.body.style.color = isWhiteText ? "white" : "black";
  }, [i18n.language]);

  useEffect(() => {
    // Detect changes between mobile and desktop
    const handleResize = () => {
      const currentIsMobile = mobile();
      if (currentIsMobile !== isMobile) {
        setIsMobile(currentIsMobile);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    // Update user info when device type changes
    updateUserInfo();
  }, [isMobile]);

  useEffect(() => {
    const sendDataToServer = async () => {
      if (userInfo) {
        try {
          console.log("Sending data to server:", userInfo); // Debugging log
          const response = await fetch(
            "http://localhost:4002/api/device-info",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userInfo),
            }
          );

          const responseData = await response.json();
          console.log("Response from server:", responseData); // Debugging log

          if (!response.ok) {
            console.error("Failed to send data to server");
          }
        } catch (error) {
          console.error("Error sending data to server:", error);
        }
      }
    };

    const intervalId = setInterval(() => {
      sendDataToServer();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userInfo]);

  return (
    <div className="max-w-md w-full mx-auto text-center mt-4 p-4">
      {userInfo && (
        <div>
          <h2 className="text-lg font-bold mb-2">{t("userInformation")}</h2>
          {/* <p>
            <strong>{t("email")}:</strong> {userInfo.email}
          </p> */}
          <p>
            <strong>{t("browser")}:</strong> {userInfo.browser}
          </p>
          <p>
            <strong>{t("operatingSystem")}:</strong> {userInfo.os}
          </p>
          <p>
            <strong>{t("deviceType")}:</strong> {userInfo.deviceType}
          </p>
          {ipAddress && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">{t("yourIpAddress")}</h2>
              <p>{ipAddress}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Device;
