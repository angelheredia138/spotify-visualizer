import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import "./css/MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
    sessionStorage.removeItem("spotifyCallbackHandled");
    navigate("/");
  };

  const handleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const visualizations = [
    {
      title: "Top Genres and Artists",
      description:
        "Discover your most played genres and artists with interactive charts and detailed insights.",
      path: "/top-genres-artists",
    },
    {
      title: "Audio Features",
      description:
        "Visualize attributes like danceability, energy, tempo, and valence of your top tracks with radar charts or scatter plots.",
      path: "/audio-features",
    },
    {
      title: "Listening History",
      description:
        "See your recently played tracks displayed on a timeline or heatmap, showing your listening patterns.",
      path: "/listening-history",
    },
    {
      title: "Genres",
      description:
        "Understand the distribution of genres you listen to with pie charts or word clouds.",
      path: "/genres",
    },
    {
      title: "Playlists",
      description:
        "Explore your created and followed playlists using network graphs showing relationships between playlists, tracks, and artists.",
      path: "/playlists",
    },
    {
      title: "Classic Spotify Wrapped",
      description: "tbd",
      path: "/wrapped",
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
      <VStack spacing={6} width="100%">
        <Heading fontSize="2xl" fontWeight="bold">
          Welcome to Spotify Visualizer
        </Heading>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          width="100%"
          className={expanded !== null ? "blur-background" : ""}
        >
          {visualizations.map((vis, index) => (
            <Box
              key={index}
              p={4}
              borderWidth={1}
              borderRadius="md"
              bg="white"
              color="black"
              textAlign="center"
              boxShadow="lg"
              onClick={() => handleExpand(index)}
              cursor="pointer"
              className="grid-item"
            >
              <Heading fontSize="lg">{vis.title}</Heading>
            </Box>
          ))}
        </Grid>
        {expanded !== null && (
          <Box className="expanded-box">
            <Heading fontSize="lg">{visualizations[expanded].title}</Heading>
            <Text mt={4}>{visualizations[expanded].description}</Text>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => handleNavigate(visualizations[expanded].path)}
            >
              View {visualizations[expanded].title}
            </Button>
            <Button mt={4} colorScheme="red" onClick={() => setExpanded(null)}>
              Close
            </Button>
          </Box>
        )}
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>
    </Flex>
  );
};

export default MainPage;
