import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatComponent from "../Components/Chat/ChatComponent";
import HomePage from "../Components/HomePage";

const RoutesConfigure = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/chat" element={<ChatComponent />} />
    </Routes>
  );
};

export default RoutesConfigure;