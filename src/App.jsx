import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Callback from "./components/Callback";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SpotifyLogin />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
