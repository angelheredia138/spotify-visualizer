import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch("http://localhost:8000/api/spotify-callback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("spotifyAccessToken", data.access_token);
          localStorage.setItem("spotifyRefreshToken", data.refresh_token);
          navigate("/main");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [searchParams, navigate]);

  return <div>Redirecting...</div>;
};

export default Callback;
