import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Callback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch("http://localhost:8000/api/callback", {
        // Backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("spotifyAccessToken", data.access_token);
          localStorage.setItem("spotifyRefreshToken", data.refresh_token);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [searchParams]);

  return <div>Redirecting...</div>;
};

export default Callback;
