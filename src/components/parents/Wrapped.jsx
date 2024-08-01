import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import Presentation from "../children/Presentation";
import "../css/Components.css";

const Wrapped = () => {
  const [data, setData] = useState({
    topArtists: [],
    topTracks: [],
    recentlyPlayed: [],
    topGenres: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWrappedData = async () => {
    try {
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const wrappedResponse = await fetch(
        "http://localhost:8000/api/wrapped/",
        { headers }
      );
      const wrappedResult = await wrappedResponse.json();

      const genresResponse = await fetch(
        "http://localhost:8000/api/top-genres/",
        { headers }
      );
      const genresResult = await genresResponse.json();

      setData({
        topArtists: wrappedResult.top_artists?.items || [],
        topTracks: wrappedResult.top_tracks?.items || [],
        recentlyPlayed: wrappedResult.recently_played?.items || [],
        topGenres: genresResult.top_genres || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWrappedData();
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

  return <Presentation data={data} />;
};

export default Wrapped;
