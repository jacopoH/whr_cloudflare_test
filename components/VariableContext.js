"use client";

import { createContext, useContext, useState } from "react";

const VariableContext = createContext();

export function VariableProvider({ children }) {
  const [selectedVariable, setSelectedVariable] = useState("");

  return (
    <VariableContext.Provider value={{ selectedVariable, setSelectedVariable }}>
      {children}
    </VariableContext.Provider>
  );
}

export function useVariable() {
  const context = useContext(VariableContext);
  if (!context) {
    console.warn("useVariable called outside VariableProvider");
    return {
      selectedVariable: "", // Default fallback value
      setSelectedVariable: () => {}, // No-op function
    };
  }
  return context;
}

