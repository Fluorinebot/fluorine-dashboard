import { useEffect, useState } from 'react';

export function useFetch<T>(url: string, options: RequestInit = {}) {
  const [response, setResponse] = useState<T | { error: string; errorReason: string }>();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url, { ...options, credentials: 'include' });
        return setResponse((await res.json()) as T);
      } catch (e: any) {
        setResponse({ error: 'Fetch Failed', errorReason: e.message });
      }
    })();
  }, []);

  return response;
}
