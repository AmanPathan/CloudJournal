import React from "react";
import { Route, Routes } from "react-router-dom";
import Error from "./components/Error";
import Hero from "./components/Hero";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/forecast" element={<Home/>} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </>
  );
}

export default App;
