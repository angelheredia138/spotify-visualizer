import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Callback from "./components/Callback";
import MainPage from "./components/MainPage";
import TopGenresAndArtists from "./components/parents/TopGenresandArtists";
import AudioFeatures from "./components/parents/AudioFeatures";
import ListeningHistory from "./components/parents/ListeningHistory";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SpotifyLogin />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/top-genres-artists" element={<TopGenresAndArtists />} />
          <Route path="/audio-features" element={<AudioFeatures />} />
          <Route path="/listening-history" element={<ListeningHistory />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
