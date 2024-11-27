import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa"; // Import location and close icons
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

  const handleClearInput = () => {
    setValue("");
    setSelectedCity("");
    clearSuggestions();
  };

  const handleSubmit = () => {
    window.open("https://fuelmemories.com/yachts/", "_blank");
  };

  return (
    <div>
      {apiError && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {apiError}
        </p>
      )}

      <div style={{ position: "relative", marginBottom: "20px", display: "flex", gap: "10px" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "40px",
              paddingRight: "40px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Where to?"
          />
          <FaMapMarkerAlt
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
              fontSize: "20px",
              pointerEvents: "none",
            }}
          />
          {value && (
            <FaTimes
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={handleClearInput}
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit
        </button>
      </div>

      {status === "OK" && (
        <ul
          style={{
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
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
                borderBottom: "1px solid #f0f0f0",
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
