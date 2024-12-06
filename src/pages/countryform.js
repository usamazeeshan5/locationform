import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import "../css/countryform.css";

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
    if (selectedCity) {
      console.log("Selected Location:", selectedCity);
      console.log("Coordinates:", coordinates);
  
      const locationData = { city: selectedCity, coordinates };
      localStorage.setItem("selectedLocation", JSON.stringify(locationData));
  
      // Encode the location, then replace encoded characters with readable ones
      const encodedLocation = encodeURIComponent(selectedCity)
        .replace(/%20/, " ") 
        .replace(/%20/g, " ") 
        .replace(/%2C/g, ",") 
        .replace(/%26/g, "&") 
        .replace(/%27/g, "'"); 
  
      // Navigate to the next page with the cleaned location in the URL
    window.open(`https://fuelmemories.com/yachts-worldwide/?location=${encodedLocation}`, "_blank");
      
    } else {
      console.log("No location selected.");
    }
  };
  
  
  
  
  
//   const handleSubmit = () => {
//     if (selectedCity) {
//       console.log("Selected Location:", selectedCity);
//       console.log("Coordinates:", coordinates);
//     //   window.open("https://fuelmemories.com/yacht-2/", "_blank");

//     } else {
//       console.log("No location selected.");
//     }
//   };
  

  return (
    <div className="container">
  {apiError && <p style={{ color: "red", marginBottom: "10px" }}>{apiError}</p>}

  <div className="input-category-container">
    <div className="input-container">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Where to?"
      />
      <FaMapMarkerAlt className="icon left" />
      {value && <FaTimes className="icon right" onClick={handleClearInput} />}
    </div>

    <select
      className="category-dropdown"
      onChange={(e) => console.log("Selected Category:", e.target.value)}
    >
      <option value="" disabled selected>
        Select Category
      </option>
      <option value="All">All</option>
      <option value="Partyboats">Party boats
      </option>
      <option value="Luxuryboats">Luxury boats
      </option>
      <option value="Weddingboats">Wedding boats</option>
    </select>
  </div>

  <button className="submit-btn" onClick={handleSubmit}>
    Submit
  </button>

  {status === "OK" && (
    <ul className="suggestions">
      {data.map(({ place_id, description }) => (
        <li key={place_id} onClick={() => handleSelect(description)}>
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
