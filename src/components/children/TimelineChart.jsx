import React, { useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import "../css/Components.css";

const TimelineChart = ({ tracks }) => {
  useEffect(() => {
    if (tracks.length > 0) {
      drawTimelineChart(tracks);
    }
  }, [tracks]);

  const drawTimelineChart = (tracks) => {
    // Timeline chart drawing logic
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
