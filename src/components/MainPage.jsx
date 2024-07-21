import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, VStack, Box, Text, Flex } from "@chakra-ui/react";
import "../assets/css/MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    navigate("/");
  };

  const visualizations = [
    {
      title: "Top Tracks and Artists",
      description:
        "View your most played tracks and artists over time with bar charts or bubble charts.",
    },
    {
      title: "Audio Features",
      description:
        "Visualize attributes like danceability, energy, tempo, and valence of your top tracks with radar charts or scatter plots.",
    },
    {
      title: "Listening History",
      description:
        "See your recently played tracks displayed on a timeline or heatmap, showing your listening patterns.",
    },
    {
      title: "Genres",
      description:
        "Understand the distribution of genres you listen to with pie charts or word clouds.",
    },
    {
      title: "Playlists",
      description:
        "Explore your created and followed playlists using network graphs showing relationships between playlists, tracks, and artists.",
    },
    {
      title: "Top Genres",
      description:
        "Visualize the aggregated genres of your top artists with sunburst charts or hierarchical treemaps.",
    },
  ];

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
        width="80%"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Spotify Visualizer!
        </Text>
        <Text>
          Your Spotify data will be displayed here through various
          visualizations.
        </Text>
        {visualizations.map((vis, index) => (
          <Box
            key={index}
            p={4}
            borderWidth={1}
            borderRadius="md"
            w="100%"
            textAlign="left"
          >
            <Text fontSize="lg" fontWeight="bold">
              {vis.title}
            </Text>
            <Text>{vis.description}</Text>
            <Button colorScheme="blue" mt={2}>
              View {vis.title}
            </Button>
          </Box>
        ))}
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>
    </Flex>
  );
};

export default MainPage;
