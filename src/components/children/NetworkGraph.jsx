import React, { useEffect } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import "../css/Components.css";

const NetworkGraph = ({ playlists }) => {
  useEffect(() => {
    if (playlists.length > 0) {
      drawNetworkGraph(playlists);
    }
  }, [playlists]);

  const drawNetworkGraph = (playlists) => {
    // Network graph drawing logic
  };

  return (
    <Box
      className="chart-container-transparent"
      style={{ flex: 1, padding: "10px" }}
    >
      <svg
        id="d3-network-graph"
        style={{ width: "100%", height: "100%" }}
      ></svg>
    </Box>
  );
};

export default NetworkGraph;
