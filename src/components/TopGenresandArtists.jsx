import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import {
  Select,
  Box,
  Container,
  Heading,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import "../assets/css/Genre.css"; // Make sure to import the CSS

const TopGenresandArtists = () => {
  const [topGenres, setTopGenres] = useState([]);
  const [leastGenres, setLeastGenres] = useState([]);
  const [randomLeastGenre, setRandomLeastGenre] = useState(null);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term"); // Default to medium_term
  const [loading, setLoading] = useState(true); // Add loading state
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const genresResponse = await fetch(
        `http://localhost:8000/api/top-genres/?time_range=${timeRange}`,
        { headers }
      );
      const genresData = await genresResponse.json();
      console.log("Top Genres Data: ", genresData);

      const artistsResponse = await fetch(
        `http://localhost:8000/api/top-artists/?time_range=${timeRange}`,
        { headers }
      );
      const artistsData = await artistsResponse.json();
      console.log("Top Artists Data: ", artistsData);

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
      setLoading(false); // Set loading to false when data fetching is complete
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Ensure loading is set to false in case of an error
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (topGenres.length > 0) {
      drawGenresChart(topGenres);
    }
  }, [topGenres]);

  useEffect(() => {
    if (artists.length > 0) {
      drawLeaderboard(artists);
    }
  }, [artists]);

  const drawLeaderboard = (artists) => {
    const svg = d3
      .select("#d3-leaderboard")
      .attr("width", 800) // Match the width with the genres chart
      .attr("height", 650) // Match the height for consistency
      .style("background-color", "transparent");

    svg.selectAll("*").remove(); // Clear the chart before drawing

    const margin = { top: 20, right: 30, bottom: 150, left: 150 }; // Match margins with genres chart
    const width = 800 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(artists, (d) => d.popularity)])
      .nice()
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(artists.slice(0, 25).map((d) => d.name))
      .range([0, height])
      .padding(0.1);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip for artists
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("display", "none");

    chart
      .append("g")
      .selectAll("rect")
      .data(artists.slice(0, 25))
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.name))
      .attr("width", (d) => x(d.popularity))
      .attr("height", y.bandwidth())
      .style("fill", "steelblue")
      .style("filter", "url(#drop-shadow)")
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .html(
            `<strong>${d.name}</strong><br/>Popularity: ${
              d.popularity
            }<br/>Genres: ${d.genres.join(", ")}`
          );
        d3.select(this).style("fill", "darkblue");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).style("fill", "steelblue");
      });

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold");

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold");

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold")
      .text("Popularity");
    svg
      .append("foreignObject")
      .attr("x", margin.left)
      .attr("y", height + margin.top + 50)
      .attr("width", width) // Set width to ensure text wrapping
      .attr("height", 100) // Adjust height as needed
      .append("xhtml:div")
      .style("font-size", "14px") // Increase font size
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "normal")
      .style("color", "#333")
      .style("text-align", "center")
      .html(
        "Popularity is a metric provided by Spotify that indicates how popular an artist is based on the number of streams, album sales, and other factors."
      );
  };

  const drawGenresChart = (genres) => {
    const svg = d3
      .select("#d3-genres-chart")
      .attr("width", 800)
      .attr("height", 650) // Increase height to provide more space for labels
      .style("background-color", "transparent");

    svg.selectAll("*").remove(); // Clear the chart before drawing

    const maxGenreLength = Math.max(...genres.map((d) => d.genre.length));
    const margin = {
      top: 20,
      right: 30,
      bottom: 150, // Increase margin for the bottom
      left: 50,
    };

    const width = 800 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(genres.map((d) => d.genre))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(genres, (d) => d.count)])
      .nice()
      .range([height, 0]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add drop shadow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    const feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("display", "none");

    chart
      .append("g")
      .selectAll("rect")
      .data(genres)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.genre))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .style("fill", "steelblue")
      .style("filter", "url(#drop-shadow)")
      .on("mouseover", function (event, d) {
        const description = d.description || "No description available"; // Provide default description
        tooltip
          .style("display", "block")
          .html(
            `<strong>${d.genre}</strong><br/>Listens: ${d.count}<br/>Artists: ${description}`
          );
        d3.select(this).style("fill", "darkblue");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).style("fill", "steelblue");
      });

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold"); // Make text bold

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold"); // Make text bold

    // Add y-axis label
    svg
      .append("text")
      .attr("x", -(height / 2) - margin.top)
      .attr("y", margin.left - 40)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "'Poppins', sans-serif")
      .text("Listens");
  };

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
        Most Played Genres
      </Heading>
      <SimpleGrid columns={columns} spacing={10} width="100%" padding={4}>
        <Box className="chart-container">
          <Heading as="h3" size="md" mb={4}>
            Most Played Genres (D3.js)
          </Heading>
          <svg id="d3-genres-chart" style={{ marginBottom: "40px" }}></svg>
          <Box className="time-range-controls">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="dropdown"
            >
              <option value="short_term">Last 4 weeks</option>
              <option value="medium_term">Last 6 months</option>
              <option value="long_term">All time</option>
            </Select>
          </Box>
        </Box>
        <Box className="chart-container">
          <Heading as="h3" size="md" mb={4}>
            All Time Artist Leaderboard
          </Heading>
          <svg id="d3-leaderboard" style={{ marginBottom: "40px" }}></svg>
          <Box>
            <Heading as="h3" size="md" mt={4} textAlign={"center"}>
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
            {randomLeastGenre && (
              <Box mt={4}>
                <Text fontSize="lg" fontWeight="bold" color="teal.500">
                  {randomLeastGenre.genre}
                </Text>
                <Text fontSize="md" color="gray.500">
                  ({randomLeastGenre.artist})
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default TopGenresandArtists;
