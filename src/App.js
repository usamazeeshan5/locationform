import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import "./App.css";
const googleLibraries = ["places"];

const CitySearchForm = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [apiError, setApiError] = useState("");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ["(cities)"] },
    debounce: 300,
  });

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();
    setSelectedCity(description);

    try {
      const geocode = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(geocode[0]);
      setCoordinates({ lat, lng });
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setApiError("Failed to fetch coordinates. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "90%", // Limit width for larger screens
        width: "100%", // Take full width on smaller screens
        padding: "20px", // Add padding for spacing
        margin: "20px auto", // Center horizontally with auto margin
        backgroundColor: "white", // Ensure a clean background
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
        borderRadius: "8px", // Rounded corners
        border: "1px solid #ccc", // Light border
      }}
    >
      <h1
        style={{
          fontSize: "2rem", // Responsive font size
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Search for a City
      </h1>

      {apiError && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {apiError}
        </p>
      )}

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          style={{
            width: "100%", // Full width for responsiveness
            height: "40px",
            padding: "0 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            outline: "none",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Search for a city..."
        />
      </div>

      {status === "OK" && (
        <ul
          style={{
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxHeight: "200px", // Limit height
            overflowY: "auto", // Enable scrolling
            backgroundColor: "white",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            padding: "0",
            listStyleType: "none",
          }}
        >
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0", // Light separator
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={() => handleSelect(description)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f8ff")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
            >
              {description}
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          marginTop: "20px",
          textAlign: "center", // Center align
          fontSize: "1rem",
          color: "#555",
        }}
      >
        <p>Selected City: {selectedCity || "None"}</p>
        {coordinates && (
          <p style={{ marginTop: "10px" }}>
            Coordinates: {coordinates.lat}, {coordinates.lng}
          </p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const api = process.env.REACT_APP_GOOGLE_API_KEY;

  return (
    <LoadScript
      googleMapsApiKey={api}
      libraries={googleLibraries}
      onLoad={() => setIsApiReady(true)}
      onError={(error) => {
        console.error("Google Maps API Load Error:", error);
        setApiKeyError("Failed to load Google Maps API. Check your API key and configuration.");
      }}
    >
      {apiKeyError ? (
        <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
          {apiKeyError}
        </div>
      ) : isApiReady ? (
        <CitySearchForm />
      ) : (
        <p style={{ textAlign: "center", color: "#555" }}>
          Loading Google Maps API...
        </p>
      )}
    </LoadScript>
  );
};

export default App;
