import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const LocationDetails = () => {
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = JSON.parse(localStorage.getItem("selectedLocation"));
    if (storedData) {
      setLocationData(storedData);
    } else {
      navigate("/"); // Redirect back if no data is found
    }
  }, [navigate]);

  if (!locationData) {
    return <p>Loading location data...</p>;
  }

  const { city, coordinates } = locationData;

  if (loadError) {
    return <p>Error loading </p>;
  }

  if (!isLoaded) {
    return <p>Loading ...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>{city}</p>
   
    </div>
  );
};

export default LocationDetails;
