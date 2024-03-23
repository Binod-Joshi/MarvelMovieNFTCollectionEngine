import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AllMintedNFT from "./components/AllMintedNFT";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element = {<Home/>} />
          <Route path="/viewMintedNFT/:baseUrlOfNFT/:tokenIdsMinted" element={<AllMintedNFT />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
