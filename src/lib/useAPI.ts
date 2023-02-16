import { useEffect, useState } from 'react';
import { ErrorType } from './types';

const useAPI = <SuccessType, K = {}>(url: string, options: RequestInit = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType<K>>();
    const [data, setData] = useState<SuccessType | undefined>();
    const [code, setCode] = useState<number>(0);

    useEffect(() => {
        let ignore = false;

        const func = async () => {
            try {
                const res = await fetch(url, { credentials: 'include', ...options });
                setCode(res.status);

                const body = await res.json();

                if (res.ok) {
                    setData(body);
                } else {
                    console.log(body);
                    setError(body);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError({ error: err.message });
                    setCode(1000);
                }
            }

            setLoading(false);
        };

        func();

        return () => {
            ignore = true;
        };
    }, []);

    return {
        loading,
        error,
        data,
        code
    };
};

export default useAPI;
