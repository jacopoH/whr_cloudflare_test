"use client"; // Required for client-side state

import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data"); // Fetch data from Next.js API route

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (!data) fetchData();
  }, [data]);

  return (
    <DataContext.Provider value={{ data, error, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
