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
    <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200 mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Search for a City</h1>

      {apiError && (
        <p className="text-red-500 text-center mb-4">{apiError}</p>
      )}

<div className="relative w-full mb-6">
  <input
    style={{
      width: "400px",
      height: "40px", // Adjusted to make it look better
      padding: "0 12px", // Added padding for better text spacing
      borderRadius: "8px", // Added rounded corners
      border: "1px solid #ccc", // Subtle border color
      fontSize: "14px", // Adjusted font size for readability
      outline: "none", // Removes default outline
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Light shadow for depth
      zIndex: "1",
    }}
    type="text"
    value={value}
    onChange={handleInputChange}
    placeholder="Search for a city..."
  />
</div>





      {status === "OK" && (
        <ul style={{
          marginTop:"20px"
         }}
         className="border rounded-md mt-4 max-h-60 overflow-y-auto bg-white shadow-lg rounded-lg">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="p-4 cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10"
      style={{
       marginTop:"20px"
      }}
      >
        <p className="font-medium text-gray-700">Selected City: {selectedCity || "None"}</p>
        {coordinates && (
          <p className="mt-7 text-gray-700">
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
        <div className="text-center text-red-500 p-4">
          {apiKeyError}
        </div>
      ) : isApiReady ? (
        <CitySearchForm />
      ) : (
        <p className="text-center text-gray-500">Loading Google Maps API...</p>
      )}
    </LoadScript>
  );
};

export default App;
