import React from "react";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

const SpotifyLogin = () => {
  const handleLogin = () => {
    const clientId = "ecc927ddea8743b3af6b32d78a149e68";
    const redirectUri = "http://localhost:5173/callback";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scope = "user-read-recently-played user-top-read";

    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&show_dialog=true`;
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.800"
    >
      <VStack spacing={4} p={6} boxShadow="lg" bg="white" rounded="md">
        <Heading size="lg" color="green.500">
          Spotify Visualizer
        </Heading>
        <Text>Log in to view your Spotify listening habits</Text>
        <Button colorScheme="green" onClick={handleLogin}>
          Log in with Spotify
        </Button>
      </VStack>
    </Flex>
  );
};

export default SpotifyLogin;
