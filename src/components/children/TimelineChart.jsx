import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { Box, Text, Spinner, Flex } from "@chakra-ui/react";
import "../css/Components.css";

const TimelineChart = ({ tracks, updating }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [showUpdating, setShowUpdating] = useState(false);

  useEffect(() => {
    if (tracks.length > 0) {
      drawClockTimelineChart(tracks);
      const interval = setInterval(() => {
        updateClockHand();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tracks]);

  useEffect(() => {
    if (updating) {
      setShowUpdating(true);
      setTimeout(() => setShowUpdating(false), 1000); // Show updating for 3 seconds
    }
  }, [updating]);

  const drawClockTimelineChart = (tracks) => {
    const svg = d3
      .select("#d3-clock-timeline-chart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${400} ${400}`)
      .classed("svg-content-responsive", true)
      .style("background-color", "transparent");

    svg.selectAll("*").remove(); // Clear the chart before drawing

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 20;

    const clockGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Draw clock face
    clockGroup
      .append("circle")
      .attr("r", radius)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Add hour numbers with AM/PM labels
    const hourScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, 2 * Math.PI]);
    const hours = d3.range(0, 24);

    clockGroup
      .selectAll(".hour-label")
      .data(hours)
      .enter()
      .append("text")
      .attr("class", "hour-label")
      .attr("x", (d) => Math.cos(hourScale(d) - Math.PI / 2) * (radius - 30))
      .attr("y", (d) => Math.sin(hourScale(d) - Math.PI / 2) * (radius - 30))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "13px")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold")
      .text((d) => {
        const hour = d % 12 || 12;
        const period = d < 12 || d === 24 ? "AM" : "PM";
        return `${hour}${period}`;
      });

    // Tooltip
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

    // Filter tracks to include those played today and yesterday
    const today = new Date().toISOString().slice(0, 10);
    const todayTracks = tracks.filter((track) =>
      track.played_at.startsWith(today)
    );

    // Color scale for today's songs
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Draw data points
    tracks.forEach((track, index) => {
      const date = new Date(track.played_at);
      const hours = date.getHours() + date.getMinutes() / 60;
      const angle = (hours / 24) * 2 * Math.PI;
      const offset = (index % 2 === 0 ? 1 : -1) * 0.03; // Alternate the offset direction

      const x = Math.cos(angle - Math.PI / 2 + offset) * (radius - 10); // Move points closer to the border
      const y = Math.sin(angle - Math.PI / 2 + offset) * (radius - 10);

      const pointColor =
        hours * 60 > currentTimeInMinutes ? "gray" : colorScale(index);

      const point = clockGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4) // Smaller radius for the points
        .style("fill", pointColor)
        .style("opacity", 0.7) // Make the points slightly opaque
        .on("mouseover", function (event) {
          setIsHovering(true);
          clearTimeout(hoverTimeout);
          d3.select(this).transition().attr("r", 6); // Enlarge the point on hover
          const formattedTime = formatTime(date);
          tooltip
            .style("display", "block")
            .html(
              `<strong>${
                track.track.name
              }</strong><br/>Played at: ${formattedTime}<br/>Artist: ${track.track.artists
                .map((artist) => artist.name)
                .join(", ")}`
            );
          d3.select(this).style("stroke", "#000").style("stroke-width", "2px");

          setHoverTimeout(
            setTimeout(() => {
              tooltip.style("display", "none");
            }, 5000)
          ); // Hide the tooltip after 5 seconds
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          setIsHovering(false);
          clearTimeout(hoverTimeout); // Clear the hover timeout
          tooltip.style("display", "none");
          d3.select(this).transition().attr("r", 4); // Shrink the point back to original size
          d3.select(this).style("stroke", "none");
        })
        .on("click", function (event, d) {
          if (isHovering) return;
          d3.select(this).transition().attr("r", 6); // Enlarge the point on click
          tooltip
            .style("display", "block")
            .html(
              `<strong>${track.track.name}</strong><br/>Played at: ${formatTime(
                date
              )}<br/>Artist: ${track.track.artists
                .map((artist) => artist.name)
                .join(", ")}`
            );
          d3.select(this).style("stroke", "#000").style("stroke-width", "2px");

          clearTimeout(clickTimeout); // Clear any existing timeout
          setClickTimeout(
            setTimeout(() => {
              tooltip.style("display", "none");
              d3.select(this).transition().attr("r", 4); // Shrink the point back to original size
              d3.select(this).style("stroke", "none");
            }, 5000)
          ); // Hide the tooltip after 5 seconds
        });
    });

    // Draw hour hand
    drawClockHand(clockGroup, radius);

    // Display the last played song above the center
    if (todayTracks.length > 0) {
      const lastPlayedTrack = todayTracks[0];
      const lastPlayedTime = new Date(lastPlayedTrack.played_at);
      const formattedTime = formatTime(lastPlayedTime);

      clockGroup
        .append("text")
        .attr("class", "last-played-title")
        .attr("x", 0)
        .attr("y", -50) // Position above the center
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "bold")
        .style("text-decoration", "underline")
        .text("Last Played:");

      clockGroup
        .append("text")
        .attr("class", "last-played-song")
        .attr("x", 0)
        .attr("y", -35) // Position below the title
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "bold")
        .text(lastPlayedTrack.track.name);

      clockGroup
        .append("text")
        .attr("class", "last-played-artist")
        .attr("x", 0)
        .attr("y", -20) // Position below the song name
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "bold")
        .text(
          lastPlayedTrack.track.artists.map((artist) => artist.name).join(", ")
        );

      clockGroup
        .append("text")
        .attr("class", "last-played-time")
        .attr("x", 0)
        .attr("y", -5) // Position below the artist name
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "bold")
        .text(formattedTime);
    }
  };

  const drawClockHand = (clockGroup, radius) => {
    const now = new Date();
    const currentHours = now.getHours() + now.getMinutes() / 60;
    const hourAngle = (currentHours / 24) * 2 * Math.PI;

    clockGroup.selectAll(".clock-hand").remove(); // Clear the existing clock hand

    const handLength = radius - 60;
    const arrowLength = 15;
    const arrowWidth = 3;

    clockGroup
      .append("line")
      .attr("class", "clock-hand")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", Math.cos(hourAngle - Math.PI / 2) * handLength)
      .attr("y2", Math.sin(hourAngle - Math.PI / 2) * handLength)
      .attr("stroke", "red")
      .attr("stroke-width", 4);

    clockGroup
      .append("polygon")
      .attr(
        "points",
        `
          ${Math.cos(hourAngle - Math.PI / 2) * (handLength + arrowLength)},${
          Math.sin(hourAngle - Math.PI / 2) * (handLength + arrowLength)
        }
          ${
            Math.cos(hourAngle - Math.PI / 2 + Math.PI / 24) *
            (handLength - arrowWidth)
          },${
          Math.sin(hourAngle - Math.PI / 2 + Math.PI / 24) *
          (handLength - arrowWidth)
        }
          ${
            Math.cos(hourAngle - Math.PI / 2 - Math.PI / 24) *
            (handLength - arrowWidth)
          },${
          Math.sin(hourAngle - Math.PI / 2 - Math.PI / 24) *
          (handLength - arrowWidth)
        }
        `
      )
      .attr("fill", "red");
  };

  const updateClockHand = () => {
    const svg = d3.select("#d3-clock-timeline-chart");
    const clockGroup = svg.select("g");
    const radius = Math.min(400, 400) / 2 - 20;

    drawClockHand(clockGroup, radius);
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <Box
      className="chart-container-transparent"
      style={{ flex: 1, padding: "10px" }}
    >
      {showUpdating && (
        <Flex direction="column" align="center" mt={2}>
          <Text
            fontSize="18px"
            fontFamily="'Poppins', sans-serif"
            fontWeight="bold"
            mb={1}
          >
            Updating...
          </Text>
          <Spinner size="xs" color="green.500" />
        </Flex>
      )}

      {!showUpdating && (
        <Flex direction="column" align="center" mt={2}>
          <Text
            fontSize="18px"
            fontFamily="'Poppins', sans-serif"
            fontWeight="bold"
            color="transparent"
            mb={1}
          >
            Updating...
          </Text>
          <Spinner size="xs" color="transparent" />
        </Flex>
      )}
      <svg
        id="d3-clock-timeline-chart"
        style={{ width: "100%", height: "100%" }}
      ></svg>
      <Text
        mt={4}
        textAlign="center"
        fontSize="14px"
        fontFamily="'Poppins', sans-serif"
      >
        This clock actively updates as the day goes on, displaying what song you
        were listening to at what time.
      </Text>
      <Text
        mt={2}
        textAlign="center"
        fontSize="14px"
        fontFamily="'Poppins', sans-serif"
      >
        Gray data points are from the day before, and the colored data points
        are from today.
      </Text>
    </Box>
  );
};

export default TimelineChart;
