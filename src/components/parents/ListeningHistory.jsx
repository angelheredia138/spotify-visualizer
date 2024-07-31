import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimelineChart from "../children/TimelineChart";
import HeatmapChart from "../children/HeatmapChart";
import {
  Box,
  Heading,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import "../css/Components.css";

const ListeningHistory = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const navigate = useNavigate();

  const fetchRecentlyPlayed = async () => {
    try {
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await fetch(
        `http://localhost:8000/api/recently-played/`,
        { headers }
      );
      const text = await response.text();
      const data = JSON.parse(text);
      setTracks(data.items || []);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
      setTracks([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchRecentlyPlayed();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
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
            Loading...
          </Text>
          <Spinner size="xl" color="green.500" />
        </VStack>
      </Flex>
    );
  }

  return (
    <div className="animated-background">
      <Heading as="h2" size="lg" mb={4} className="heading" paddingTop={"10px"}>
        Listening History
      </Heading>
      <Text fontSize="md" className="heading">
        Explore your recently played tracks displayed on a clock timeline or a
        heatmap, showcasing your listening patterns and the most recent track
        played.
      </Text>

      <Box textAlign="center" mb={4}>
        <Button
          colorScheme="red"
          className="button"
          onClick={() => navigate("/main")}
        >
          Back to Home
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={2}
      >
        <SimpleGrid
          columns={columns}
          spacing={4}
          width={isMobile ? "100%" : "65%"}
          padding={2}
        >
          <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
            <Heading as="h3" size="md" mb={4}>
              Recently Played Clock Timeline
            </Heading>
            <TimelineChart tracks={tracks} />
          </Box>
          <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
            <Heading as="h3" size="md" mb={4}>
              Listening Patterns Heatmap
            </Heading>
            <HeatmapChart tracks={tracks} />
          </Box>
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default ListeningHistory;
