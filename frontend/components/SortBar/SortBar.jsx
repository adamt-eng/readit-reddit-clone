import { useState } from "react";
import "./SortBar.css";

function SortBar({ onSortChange }) {
  const [activeSort, setActiveSort] = useState("Best");

  const handleSortClick = (sortType) => {
    setActiveSort(sortType);
    if (onSortChange) onSortChange(sortType);
  };

  const sortOptions = ["Best", "Hot", "New", "Top"];

  return (
    <div className="sortBar">
      {sortOptions.map((option) => (
        <button
          key={option}
          className={`sortButton ${activeSort === option ? "active" : ""}`}
          onClick={() => handleSortClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default SortBar;
