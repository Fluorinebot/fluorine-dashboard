import { useEffect, useState } from 'react';
import { ErrorType } from './types';

const useAPI = <SuccessType, K = {}>(url: string, options: RequestInit = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType<K>>();
    const [data, setData] = useState<SuccessType | undefined>();
    const [code, setCode] = useState<number>(0);

    useEffect(() => {
        let ignore = false;

        fetch(url, { credentials: 'include', ...options })
            .then(res => {
                setCode(res.status);
                if (res.ok) {
                    return res.json();
                }

                throw res;
            })
            .then(resData => setData(resData))
            .catch(err => {
                console.error(error);
                setError(err?.message ? { error: err.message } : err);
            })
            .finally(() => setLoading(false));

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
