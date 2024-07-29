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
import "../css/Components.css";

const Wrapped = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch wrapped data
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
        Classic Spotify Wrapped
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
      <SimpleGrid columns={columns} spacing={4} width="100%" padding={2}>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          {/* Placeholder for Wrapped component content */}
          <Text>Wrapped Content 1</Text>
        </Box>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          {/* Placeholder for Wrapped component content */}
          <Text>Wrapped Content 2</Text>
        </Box>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          {/* Placeholder for Wrapped component content */}
          <Text>Wrapped Content 3</Text>
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default Wrapped;
