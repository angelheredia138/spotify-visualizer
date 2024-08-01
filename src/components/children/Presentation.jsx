import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as d3 from "d3";
import "../css/Components.css";

const Presentation = ({ data }) => {
  const [step, setStep] = useState(0);
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const navigate = useNavigate();

  const drawTopGenresChart = (data) => {
    const svg = d3.select("#chart1");
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map((d) => d.name));
    y.domain([0, d3.max(data, (d) => d.value)]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value));
  };

  const drawTopArtistsChart = (data) => {
    const svg = d3.select("#chart2");
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map((d) => d.name));
    y.domain([0, d3.max(data, (d) => d.value)]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value));
  };

  const drawTopSongsChart = (data) => {
    const svg = d3.select("#chart3");
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map((d) => d.title));
    y.domain([0, d3.max(data, (d) => d.playCount)]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Play Count");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.title))
      .attr("y", (d) => y(d.playCount))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.playCount));
  };

  const drawRecentlyPlayedChart = (data) => {
    const svg = d3.select("#chart4");
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map((d) => d.title));
    y.domain([0, d3.max(data, (d) => d.playCount)]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Play Count");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.title))
      .attr("y", (d) => y(d.playCount))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.playCount));
  };

  const handleNext = () => {
    setStep((prevStep) => (prevStep + 1) % (charts.length + 1));
  };

  const handleBack = () => {
    setStep(
      (prevStep) => (prevStep - 1 + charts.length + 1) % (charts.length + 1)
    );
  };

  const ChartComponent = ({ id, data, drawFunction }) => {
    useEffect(() => {
      if (data) {
        drawFunction(data);
      }
    }, [data, drawFunction]);

    return (
      <svg
        id={id}
        width="100%"
        height="400"
        style={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}
      />
    );
  };

  const charts = [
    {
      id: "chart1",
      title: "Top Genres",
      drawFunction: drawTopGenresChart,
      data: data.topGenres,
    },
    {
      id: "chart2",
      title: "Top Artists",
      drawFunction: drawTopArtistsChart,
      data: data.topArtists,
    },
    {
      id: "chart3",
      title: "Most Played Songs",
      drawFunction: drawTopSongsChart,
      data: data.topTracks,
    },
    {
      id: "chart4",
      title: "Recently Played",
      drawFunction: drawRecentlyPlayedChart,
      data: data.recentlyPlayed,
    },
  ];

  return (
    <div className="animated-background">
      <Flex
        direction="column"
        align="center"
        justify="center"
        minHeight="100vh"
        p={6}
      >
        {step < charts.length ? (
          <>
            <Heading
              as="h2"
              size="lg"
              mb={4}
              className="heading"
              paddingTop={"10px"}
            >
              {charts[step].title}
            </Heading>
            <Box
              className="chart-container"
              style={{ flex: 1, padding: "10px" }}
            >
              <ChartComponent
                id={charts[step].id}
                data={charts[step].data}
                drawFunction={charts[step].drawFunction}
              />
            </Box>
            <Flex mt={4}>
              <Button onClick={handleBack} mr={4} disabled={step === 0}>
                Back
              </Button>
              <Button onClick={handleNext}>
                {step === charts.length - 1 ? "Finish" : "Next"}
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Heading
              as="h2"
              size="lg"
              mb={4}
              className="heading"
              paddingTop={"10px"}
            >
              Thank You!
            </Heading>
            <Text fontSize="xl">
              We hope you enjoyed your Spotify Wrapped presentation.
            </Text>
            <Button mt={4} onClick={() => navigate("/main")}>
              Back to Home
            </Button>
          </>
        )}
      </Flex>
    </div>
  );
};

export default Presentation;
