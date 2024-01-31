import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatComponent from "../Components/Chat/ChatComponent";
import HomePage from "../Components/HomePage";
import NotFoundComponent from "../Components/NotFoundComponent";

const RoutesConfigure = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/chat" element={<ChatComponent />} />
      <Route path="*" element={<NotFoundComponent />} />
    </Routes>
  );
};

export default RoutesConfigure;
