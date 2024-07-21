import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import "../assets/css/Callback.css";

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

  return (
    <Flex
      className="animated-background"
      minHeight="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
      color="white"
      p={6}
    >
      <VStack
        spacing={6}
        p={6}
        boxShadow="lg"
        bg="white"
        rounded="md"
        color="black"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Redirecting...
        </Text>
        <Spinner size="xl" color="green.500" />
      </VStack>
    </Flex>
  );
};

export default Callback;
