import { useEffect, useState } from 'react';

const useAPI = <SuccessType, ErrorType = {}>(url: string, options: RequestInit = {}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<({ error?: string } & Record<string, any>) | ErrorType | undefined>();
    const [data, setData] = useState<Partial<SuccessType> | undefined>();

    useEffect(() => {
        fetch(url, { credentials: 'include', ...options })
            .then(res => {
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
    }, []);

    return {
        loading,
        error,
        data
    };
};

export default useAPI;
