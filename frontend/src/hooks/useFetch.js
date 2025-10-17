import { useState, useEffect } from 'react';

// Custom hook for fetching data from an API.
export const useFetch = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true; // Flag to prevent state updates on unmounted components

    const fetchData = async () => {
      if (!apiCall) return; // Don't fetch if no API call is provided
      
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();
        if (mounted) {
          setData(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.error || err.message || 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to set the mounted flag to false when the component unmounts
    return () => {
      mounted = false;
    };
  }, dependencies); // Re-run the effect if the dependencies change

  return { data, loading, error };
};