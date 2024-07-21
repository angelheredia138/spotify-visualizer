import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const TopTracksArtists = () => {
  const [data, setData] = useState({ tracks: [], artists: [] });

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = localStorage.getItem("spotifyAccessToken");

      try {
        let response = await fetch(
          "http://localhost:8000/api/top-tracks-artists/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          const refreshResponse = await fetch(
            "http://localhost:8000/api/refresh-token/",
            {
              method: "POST",
            }
          );

          const refreshData = await refreshResponse.json();
          if (refreshData.access_token) {
            accessToken = refreshData.access_token;
            localStorage.setItem("spotifyAccessToken", accessToken);

            response = await fetch(
              "http://localhost:8000/api/top-tracks-artists/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
          } else {
            throw new Error("Failed to refresh access token");
          }
        }

        const result = await response.json();
        setData({
          tracks: result.top_tracks.items || [],
          artists: result.top_artists.items || [],
        });
        drawBarChart(result.top_tracks.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const drawBarChart = (tracks) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#barChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(tracks, (d) => d.popularity)])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(tracks.map((d) => d.name))
      .range([0, height])
      .padding(0.1);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(tracks)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.name))
      .attr("width", (d) => x(d.popularity))
      .attr("height", y.bandwidth());
  };

  return (
    <div>
      <h2>Top Tracks</h2>
      <div id="barChart"></div>
    </div>
  );
};

export default TopTracksArtists;
