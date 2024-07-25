import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScatterPlot from "./ScatterPlot";
import RadarChart from "./RadarChart";
import {
  Select,
  Box,
  Heading,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import "../assets/css/Components.css";

const AudioFeatures = () => {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [loading, setLoading] = useState(true);
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const navigate = useNavigate(); // Use the useNavigate hook from React Router v6

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      let fetchedTracks = [];
      let offset = 0;
      const limit = 50;

      while (fetchedTracks.length < 100) {
        // Adjust the loop to fetch 100 tracks
        const tracksResponse = await fetch(
          `http://localhost:8000/api/top-tracks/?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
          { headers }
        );
        const tracksData = await tracksResponse.json();

        fetchedTracks = fetchedTracks.concat(tracksData.items);
        offset += limit;

        if (tracksData.items.length < limit) break;
      }

      console.log("Fetched tracks data:", fetchedTracks);

      const trackIds = fetchedTracks.map((track) => track.id).join(",");

      const audioFeaturesResponse = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
        { headers }
      );
      const audioFeaturesData = await audioFeaturesResponse.json();

      console.log("Fetched audio features data:", audioFeaturesData);

      const tracksWithAudioFeatures = fetchedTracks.map((track) => {
        const audioFeatures = audioFeaturesData.audio_features.find(
          (feature) => feature.id === track.id
        );
        return { ...track, audio_features: audioFeatures };
      });

      setTracks(tracksWithAudioFeatures);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

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
        Top Tracks Audio Features
      </Heading>
      <Text fontSize="md" className="heading">
        Visualize the audio features of your top tracks!
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
      <SimpleGrid columns={columns} spacing={4} width="100%" padding={2}>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          <Heading as="h3" size="md" mb={4}>
            Audio Features Scatter Plot
          </Heading>
          <ScatterPlot
            tracks={tracks}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </Box>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          <Heading as="h3" size="md" mb={4}>
            Audio Features Radar Chart
          </Heading>
          <RadarChart tracks={tracks} />
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default AudioFeatures;
