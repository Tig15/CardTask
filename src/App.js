import React from "react";
import "./App.css"
import CardListing from "./Components/CardListing";

const App = () => {
  return (
    <div>
      <h1 className="clis">Card Listing</h1>
      <CardListing />
    </div>
  );
};

export default App;
