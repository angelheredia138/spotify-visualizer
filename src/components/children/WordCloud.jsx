import React, { useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import "../css/Components.css";

const WordCloud = ({ genres }) => {
  useEffect(() => {
    if (genres.length > 0) {
      drawWordCloud(genres);
    }
  }, [genres]);

  const drawWordCloud = (genres) => {
    // Word cloud drawing logic
  };

  return (
    <Box
      className="chart-container-transparent"
      style={{ flex: 1, padding: "10px" }}
    >
      <svg id="d3-word-cloud" style={{ width: "100%", height: "100%" }}></svg>
    </Box>
  );
};

export default WordCloud;
