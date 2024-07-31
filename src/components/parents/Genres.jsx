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
  useMediaQuery,
} from "@chakra-ui/react";
import PieChart from "../children/PieChart";
import WordCloud from "../children/WordCloud";
import "../css/Components.css";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch genres data
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
        Genres
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        padding={4}
      >
        <SimpleGrid
          columns={columns}
          spacing={4}
          width={isMobile ? "100%" : "65%"}
          padding={2}
        >
          <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
            <Heading as="h3" size="md" mb={4}>
              Genre Distribution Pie Chart
            </Heading>
            <PieChart genres={genres} />
          </Box>
          <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
            <Heading as="h3" size="md" mb={4}>
              Genre Word Cloud
            </Heading>
            <WordCloud genres={genres} />
          </Box>
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default Genres;
