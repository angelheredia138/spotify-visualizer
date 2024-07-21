import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import { Select, Box, Container, Heading, Button } from "@chakra-ui/react";
import "../assets/css/Genre.css"; // Make sure to import the CSS

const TopTracksArtists = () => {
  const [topGenres, setTopGenres] = useState([]);
  const [leastGenres, setLeastGenres] = useState([]);
  const [randomLeastGenre, setRandomLeastGenre] = useState(null);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term"); // Default to medium_term

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("spotify_access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const genresResponse = await fetch(
        `http://localhost:8000/api/top-genres/?time_range=${timeRange}`,
        { headers }
      );
      const genresData = await genresResponse.json();
      console.log("Top Genres Data: ", genresData);
      setTopGenres(genresData.top_genres || []);
      setLeastGenres(genresData.least_genres || []);

      const artistsResponse = await fetch(
        `http://localhost:8000/api/top-artists/?time_range=${timeRange}`,
        { headers }
      );
      const artistsData = await artistsResponse.json();
      console.log("Top Artists Data: ", artistsData);
      setArtists(artistsData.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      drawArtistsChart(artists);
    }
  }, [artists]);

  const drawGenresChart = (genres) => {
    const svg = d3
      .select("#d3-genres-chart")
      .attr("width", 800)
      .attr("height", 500)
      .style("background-color", "white");

    svg.selectAll("*").remove(); // Clear the chart before drawing

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
      .attr("height", (d) => height - y(d.count));

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    chart.append("g").call(d3.axisLeft(y));
  };

  const drawArtistsChart = (artists) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 500);
    document
      .getElementById("three-artists-chart")
      .appendChild(renderer.domElement);

    artists.forEach((artist, index) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(index * 2 - artists.length, 0, 0);
      scene.add(sphere);
    });

    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  };

  const generateRandomGenre = () => {
    if (leastGenres.length > 0) {
      const randomGenre =
        leastGenres[Math.floor(Math.random() * leastGenres.length)];
      setRandomLeastGenre(randomGenre.genre.toUpperCase());
    }
  };

  return (
    <div className="animated-background">
      <Container className="container">
        <Heading as="h2" size="lg" mb={4} className="heading">
          Top Tracks and Artists
        </Heading>
        <Box mb={4}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="short_term">Last 4 weeks</option>
            <option value="medium_term">Last 6 months</option>
            <option value="long_term">All time</option>
          </Select>
        </Box>
        <Box className="chart-container">
          <Heading as="h3" size="md" mb={4}>
            Most Played Genres (D3.js)
          </Heading>
          <svg id="d3-genres-chart"></svg>
        </Box>
        <Box className="chart-container">
          <Heading as="h3" size="md" mt={4} textAlign={"center"}>
            Generate a random genre you have listened to!
          </Heading>
          <Button onClick={generateRandomGenre} className="button">
            Generate Random Genre
          </Button>
          {randomLeastGenre && <p>{randomLeastGenre}</p>}
        </Box>
        <Box className="chart-container" mt={8}>
          <Heading as="h3" size="md" mb={4}>
            Top Artists (Three.js)
          </Heading>
          <div id="three-artists-chart"></div>
        </Box>
      </Container>
    </div>
  );
};

export default TopTracksArtists;
