import { useState, useEffect, useCallback } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using useCallback to memoize the fetch function if options can change
  // This helps prevent unnecessary re-runs of the effect if the options object
  // reference changes but its content remains the same.
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Attempt to parse error message from response, or use status text
        const errorData = await response.json().catch(() => ({})); // Try to parse JSON, fall back to empty object
        const errorMessage = errorData.message || response.statusText || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]); // Dependency array includes URL and stringified options

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency on fetchData ensures it runs when fetchData changes (which it does if url/options change)

  return { data, loading, error };
};

export default useFetch;