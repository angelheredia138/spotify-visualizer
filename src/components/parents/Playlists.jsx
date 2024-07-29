import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import NetworkGraph from "../children/NetworkGraph";
import "../css/Components.css";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch playlists data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
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
        Playlists
      </Heading>
      <Box textAlign="center" mb={4}>
        <Button
          colorScheme="red"
          className="button"
          onClick={() => navigate("/main")}
        >
          Back to Home
        </Button>
      </Box>
      <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
        <NetworkGraph playlists={playlists} />
      </Box>
    </div>
  );
};

export default Playlists;
