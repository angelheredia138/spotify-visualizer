import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MostPlayedGenres from "./MostPlayedGenres";
import ArtistLeaderboard from "./ArtistLeaderboard";
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
import "../assets/css/Genre.css";

const TopGenresandArtists = () => {
  const [topGenres, setTopGenres] = useState([]);
  const [leastGenres, setLeastGenres] = useState([]);
  const [randomLeastGenre, setRandomLeastGenre] = useState(null);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [loading, setLoading] = useState(true);
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const navigate = useNavigate(); // Use the useNavigate hook from React Router v6

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const genresResponse = await fetch(
        `http://localhost:8000/api/top-genres/?time_range=${timeRange}`,
        { headers }
      );
      const genresData = await genresResponse.json();

      const artistsResponse = await fetch(
        `http://localhost:8000/api/top-artists/?time_range=${timeRange}`,
        { headers }
      );
      const artistsData = await artistsResponse.json();

      const enrichedGenres = genresData.top_genres.map((genre) => {
        if (!genre.description) {
          const genreArtists = artistsData.items.filter((artist) =>
            artist.genres.includes(genre.genre)
          );
          genre.description = `Artists: ${genreArtists
            .map((artist) => artist.name)
            .join(", ")}`;
        }
        return genre;
      });
      setTopGenres(enrichedGenres);
      setLeastGenres(genresData.least_genres || []);
      setArtists(artistsData.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const generateRandomGenre = () => {
    if (leastGenres.length > 0) {
      const randomGenre =
        leastGenres[Math.floor(Math.random() * leastGenres.length)];
      setRandomLeastGenre({
        genre: randomGenre.genre.toUpperCase(),
        artist: randomGenre.artists[0] || "Unknown Artist",
      });
    }
  };

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
        Genre Ranking and Artist Leaderboard!
      </Heading>
      <Text fontSize="md" className="heading">
        Hover over or tap the bars for additional details about the artist and
        genre!
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
            Most Played Genres (D3.js)
          </Heading>
          <MostPlayedGenres
            topGenres={topGenres}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </Box>
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          <Heading as="h3" size="md" mb={4}>
            Artist Leaderboard
          </Heading>
          <ArtistLeaderboard artists={artists} />
          <Box mt={4} textAlign="center">
            <Heading as="h3" size="md" mt={4}>
              Generate a random genre you have listened to!
            </Heading>
            <Button
              onClick={generateRandomGenre}
              className="button"
              colorScheme="green"
              mt={2}
            >
              Generate Random Genre
            </Button>
            <Box mt={4} minHeight="50px">
              {randomLeastGenre ? (
                <>
                  <Text fontSize="lg" fontWeight="bold" color="teal.500">
                    {randomLeastGenre.genre}
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    ({randomLeastGenre.artist})
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="transparent"
                    userSelect={"none"}
                  >
                    Placeholder
                  </Text>
                  <Text fontSize="md" color="transparent" userSelect={"none"}>
                    Placeholder
                  </Text>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default TopGenresandArtists;
