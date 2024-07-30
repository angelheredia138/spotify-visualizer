import React, { useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import "../css/Components.css";

const TimelineChart = ({ tracks }) => {
  let hoverTimeout = null;

  useEffect(() => {
    if (tracks.length > 0) {
      drawTimelineChart(tracks);
    }
  }, [tracks]);

  const drawTimelineChart = (tracks) => {
    const svg = d3
      .select("#d3-timeline-chart")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${1400} ${1000}`) // Increase the size of the chart
      .classed("svg-content-responsive", true)
      .style("background-color", "transparent");

    svg.selectAll("*").remove(); // Clear the chart before drawing

    const margin = { top: 50, right: 30, bottom: 100, left: 150 }; // Increase margins
    const width = 1400 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain(d3.extent(tracks, (d) => new Date(d.played_at)))
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(tracks.map((d) => d.track.name))
      .range([0, height])
      .padding(0.1);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    chart
      .append("g")
      .selectAll("circle")
      .data(tracks)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(new Date(d.played_at)))
      .attr("cy", (d) => y(d.track.name) + y.bandwidth() / 2)
      .attr("r", 12) // Increase the radius of the points
      .style("fill", (d) => color(d.track.name))
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .html(
            `<strong>${d.track.name}</strong><br/>Played at: ${
              d.played_at
            }<br/>Artist: ${d.track.artists
              .map((artist) => artist.name)
              .join(", ")}`
          );
        d3.select(this).style("stroke", "#000").style("stroke-width", "2px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).style("stroke", "none");
      });

    // X-axis
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "18px") // Increase the font size of the axis labels
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold");

    chart
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20) // Adjust y position of x-axis label
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .style("font-size", "22px") // Increase the font size of the axis title
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold")
      .text("Time");

    // Y-axis
    chart
      .append("g")
      .call(d3.axisLeft(y).tickFormat(() => ""))
      .selectAll("text")
      .style("font-size", "18px") // Increase the font size of the axis labels
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold");

    chart
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 50) // Adjust y position of y-axis label
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .style("font-size", "22px") // Increase the font size of the axis title
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold")
      .text("Songs");
  };

  return (
    <Box
      className="chart-container-transparent"
      style={{ flex: 1, padding: "10px" }}
    >
      <svg
        id="d3-timeline-chart"
        style={{ width: "100%", height: "100%" }}
      ></svg>
    </Box>
  );
};

export default TimelineChart;
