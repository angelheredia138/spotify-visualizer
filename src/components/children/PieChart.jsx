import React, { useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import "../css/Components.css";

const PieChart = ({ genres }) => {
  useEffect(() => {
    if (genres.length > 0) {
      drawPieChart(genres);
    }
  }, [genres]);

  const drawPieChart = (genres) => {
    // Pie chart drawing logic
  };

  return (
    <Box
      className="chart-container-transparent"
      style={{ flex: 1, padding: "10px" }}
    >
      <svg id="d3-pie-chart" style={{ width: "100%", height: "100%" }}></svg>
    </Box>
  );
};

export default PieChart;
