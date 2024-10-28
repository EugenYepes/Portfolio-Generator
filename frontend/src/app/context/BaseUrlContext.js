"use client"

import React, { createContext, useContext } from "react";

// Create the context
const BaseUrlContext = createContext();

// Create a provider component
export const BaseUrlProvider = ({ children }) => {
  const BASE_URL = "http://localhost:4000"; // Define your base URL here
  return (
    <BaseUrlContext.Provider value={BASE_URL}>
      {children}
    </BaseUrlContext.Provider>
  );
};

// Create a custom hook for easier access to the context
export const useBaseUrl = () => useContext(BaseUrlContext);