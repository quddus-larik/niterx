import { useEffect, useState } from "react";

export const useValidatorFetch = (url: string, time: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const res = await fetch(url, { next: { revalidate: time } as any });
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };
    getData();

    return () => {
      isMounted = false;
    };
  }, [url, time]);

  return { data, loading, error };
};
