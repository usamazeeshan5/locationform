import React, { useState } from "react";
import "../css/countryform.css";

const categories = ["All", "Party boats", "Luxury boats", "Wedding boats"]; // Example categories

const CitySearchForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      console.log("Selected Category:", selectedCategory);

      // Navigate to the next page with the selected category
      const encodedCategory = encodeURIComponent(selectedCategory);
      window.open(
        `https://fuelmemories.com/yachts-worldwide/?category=${encodedCategory}`,
        "_blank"
      );
    } else {
      console.log("No category selected.");
    }
  };

  return (
    <div className="container">
      <div className="input-container-wrapper">
        <div className="input-container">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-dropdown"
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CitySearchForm;
