import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
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
  const columns = useBreakpointValue({ base: 1, md: 1 });
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await fetch(`http://localhost:8000/api/genres/`, {
        headers,
      });
      const data = await response.json();
      setGenres(data.genres || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setGenres([]);
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

  const oneCountGenres = genres.filter((g) => g.count === 1);
  const displayedOneCountGenres = oneCountGenres
    .slice(0, 3)
    .map((g) => g.genre);
  const moreCountText =
    oneCountGenres.length > 3 ? ", and many, many more." : "";

  return (
    <div className="animated-background">
      <Heading as="h2" size="lg" mb={4} className="heading" paddingTop={"10px"}>
        Genres
      </Heading>
      <Text fontSize="md" className="heading" mb={4}>
        Discover the distribution of your favorite genres with this interactive
        pie chart and word cloud.
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
        padding={4}
      >
        <Box
          className="chart-container"
          style={{
            flex: 1,
            padding: "10px",
            width: isMobile ? "100%" : "40%",
            height: "600px", // Set a fixed height
          }}
        >
          <Heading as="h3" size="md" mb={4}>
            Genre Word Cloud
          </Heading>
          <WordCloud genres={genres} />
          <Text
            mt={4}
            textAlign="center"
            fontSize="14px"
            fontFamily="'Poppins', sans-serif"
          >
            Hover or tap the genre name if it is cut off to read the full name!
          </Text>
        </Box>
        <Box
          className="chart-container"
          style={{
            flex: 1,
            padding: "10px",
            width: isMobile ? "100%" : "40%",
            marginTop: "20px", // Add some space between the charts
            height: "600px", // Set a fixed height
          }}
        >
          <Heading as="h3" size="md" mb={4}>
            Genre Distribution Pie Chart
          </Heading>
          <PieChart genres={genres} />
          {oneCountGenres.length > 0 && (
            <Text
              mt={4}
              textAlign="center"
              fontSize="14px"
              fontFamily="'Poppins', sans-serif"
            >
              Genres that had one artist listen but didn't fit the chart cause
              it would look dumb: {displayedOneCountGenres.join(", ")}
              {moreCountText}
            </Text>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Genres;
