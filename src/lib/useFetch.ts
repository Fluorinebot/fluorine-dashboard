import { useEffect, useState } from 'react';

export function useFetch<T, K = {}>(url: string, options: RequestInit = {}) {
    const [response, setResponse] = useState<T | { error: string; errorReason: string } | undefined | K>();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url, { ...options, credentials: 'include' });
                return setResponse((await res.json()) as T);
            } catch (e: any) {
                setResponse({ error: 'Fetch Failed', errorReason: e.message });
                console.error(e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return response;
}
