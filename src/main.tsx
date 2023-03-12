import App from '#/App';
import theme from '#/lib/theme';
import { Center, ChakraProvider, ColorModeProvider, ColorModeScript, Spinner, useToast } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ContentBoundary } from './components/ErrorBoundary';
import type { WithPayload } from './lib/types';

const Fallback = () => (
    <Center height="100vh" width="100vw">
        <Spinner colorScheme="brand" size="xl" />
    </Center>
);

const FluorineDashboard = () => {
    const toast = useToast();

    return (
        <React.StrictMode>
            <ColorModeScript initialColorMode={'dark'} />
            <ChakraProvider theme={theme}>
                <ColorModeProvider>
                    <BrowserRouter>
                        <ContentBoundary>
                            <SWRConfig
                                value={{
                                    fetcher: async ([resource, options]) => {
                                        const res = await fetch(resource, { credentials: 'include', ...options });
                                        const payload = await res.json();

                                        if (res.ok) {
                                            return {
                                                payload,
                                                code: res.status,
                                                ok: res.ok
                                            };
                                        }

                                        throw {
                                            payload,
                                            code: res.status,
                                            ok: res.ok
                                        };
                                    },
                                    refreshInterval: 2 * 60 * 1000,
                                    onLoadingSlow(key) {
                                        toast({
                                            id: key[0],
                                            title: 'This is taking a while...',
                                            description: "If it takes too long, we're probably down.",
                                            status: 'loading'
                                        });
                                    },
                                    onSuccess(data, key) {
                                        toast.close(key[0]);
                                    },
                                    onErrorRetry: (
                                        error: WithPayload<any>,
                                        key,
                                        config,
                                        revalidate,
                                        { retryCount }
                                    ) => {
                                        if ([404, 401, 403].includes(error.code)) {
                                            return;
                                        }

                                        if (retryCount >= 10) {
                                            return;
                                        }

                                        setTimeout(() => revalidate({ retryCount }), 5000);
                                    }
                                }}
                            >
                                <Suspense fallback={<Fallback />}>
                                    <App />
                                </Suspense>
                            </SWRConfig>
                        </ContentBoundary>
                    </BrowserRouter>
                </ColorModeProvider>
            </ChakraProvider>
        </React.StrictMode>
    );
};

const domElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(domElement).render(<FluorineDashboard />);
