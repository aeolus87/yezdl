import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const isYoutubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (isYoutubeLink(inputValue)) {
        setError("");
        localStorage.setItem("lastSearch", inputValue);
        window.location.reload();
      } else {
        setError("Please enter a valid YouTube link.");
      }
    } else {
      setError("Please enter a YouTube link.");
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          placeholder="Enter or Paste Youtube Video Link"
          className={`w-full max-w-xl px-12 py-2 text-gray-700 bg-white border rounded-t-full sm:rounded-l-full sm:rounded-t-none focus:outline-none focus:border-blue-500 mb-2 sm:mb-0 ${
            error ? "border-red-500" : ""
          }`}
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-500 rounded-b-full sm:rounded-r-full sm:rounded-b-none hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

export default SearchBar;
