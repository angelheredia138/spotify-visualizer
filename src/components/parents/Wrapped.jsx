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
  useMediaQuery,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import "../css/Components.css";

const Wrapped = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [listeningHabits, setListeningHabits] = useState({});
  const [topGenres, setTopGenres] = useState([]);
  const [listeningTime, setListeningTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [
        artistsResponse,
        songsResponse,
        habitsResponse,
        genresResponse,
        timeResponse,
      ] = await Promise.all([
        fetch(`http://localhost:8000/api/top-artists/?time_range=short_term`, {
          headers,
        }),
        fetch(`http://localhost:8000/api/top-songs/`, { headers }),
        fetch(`http://localhost:8000/api/listening-habits/`, { headers }),
        fetch(`http://localhost:8000/api/top-genres/`, { headers }),
        fetch(`http://localhost:8000/api/listening-time/`, { headers }),
      ]);

      const artistsData = await artistsResponse.json();
      const songsData = await songsResponse.json();
      const habitsData = await habitsResponse.json();
      const genresData = await genresResponse.json();
      const timeData = await timeResponse.json();

      setTopArtists(artistsData.items || []);
      setTopSongs(Array.isArray(songsData.items) ? songsData.items : []); // Ensure it's an array
      setListeningHabits(habitsData);
      setTopGenres(genresData.top_genres);
      setListeningTime(timeData);
    } catch (error) {
      console.error("Error fetching Wrapped data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % 6);
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + 6) % 6);
  };

  const restartPresentation = () => {
    setCurrentStep(0);
  };

  const renderCurrentStep = () => {
    const desktopWidth = "80%";
    const mobileWidth = "100%";

    switch (currentStep) {
      case 0:
        return (
          <Box width={isMobile ? mobileWidth : desktopWidth}>
            <Heading as="h3" size="md" mb={4}>
              Top Artists
            </Heading>
            <List spacing={3}>
              {topArtists.map((artist, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {artist.name}
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 1:
        return (
          <Box width={isMobile ? mobileWidth : desktopWidth}>
            <Heading as="h3" size="md" mb={4}>
              Top Songs
            </Heading>
            <List spacing={3}>
              {topSongs.map((song, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {song.name} by{" "}
                  {song.artists.map((artist) => artist.name).join(", ")}
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 2:
        return (
          <Box width={isMobile ? mobileWidth : desktopWidth}>
            <Heading as="h3" size="md" mb={4}>
              Listening Habits
            </Heading>
            <List spacing={3}>
              {Object.entries(listeningHabits).map(([key, value], index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {key}: {value}
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 3:
        return (
          <Box width={isMobile ? mobileWidth : desktopWidth}>
            <Heading as="h3" size="md" mb={4}>
              Top Genres
            </Heading>
            <List spacing={3}>
              {topGenres.map((genre, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {genre.genre}
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 4:
        return (
          <Box width={isMobile ? mobileWidth : desktopWidth}>
            <Heading as="h3" size="md" mb={4}>
              Listening Time
            </Heading>
            <List spacing={3}>
              {listeningTime.map((time, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {time}
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 5:
        return (
          <Box textAlign="center" width={isMobile ? mobileWidth : desktopWidth}>
            <Text fontSize="lg" className="heading" mb={4}>
              Thank you for listening! We hope you enjoyed your year in music.
            </Text>
            <Button onClick={restartPresentation} colorScheme="green">
              Restart Presentation
            </Button>
          </Box>
        );
      default:
        return null;
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
        Your Spotify Wrapped
      </Heading>
      <Text fontSize="md" className="heading" mb={4}>
        Discover your top artists, songs, genres, and listening habits of the
        year.
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
        <Box className="chart-container" style={{ flex: 1, padding: "10px" }}>
          {renderCurrentStep()}
        </Box>
        <Flex mt={4}>
          {currentStep > 0 && (
            <Button onClick={previousStep} mr={4}>
              Previous
            </Button>
          )}
          {currentStep < 5 && <Button onClick={nextStep}>Next</Button>}
        </Flex>
      </Box>
    </div>
  );
};

export default Wrapped;
