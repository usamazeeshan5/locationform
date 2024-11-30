import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CitySearchForm from "./pages/countryform";
import LocationDetails from "./pages/locationdetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitySearchForm />} />
        <Route path="/location" element={<LocationDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
