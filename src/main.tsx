import App from '#/App';
import theme from '#/lib/theme';
import { Center, ChakraProvider, ColorModeProvider, ColorModeScript, Spinner } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig, type BareFetcher } from 'swr';
import { ContentBoundary } from './components/ErrorBoundary';
import type { WithPayload } from './lib/types';

const fetcher: BareFetcher<WithPayload<any>> = async ([resource, options]) => {
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
};

const Fallback = () => (
    <Center height="100vh" width="100vw">
        <Spinner colorScheme="brand" size="xl" />
    </Center>
);

const config = {
    fetcher,
    refreshInterval: 2 * 60 * 1000
};

const FluorineDashboard = () => (
    <React.StrictMode>
        <ColorModeScript initialColorMode={'dark'} />
        <ChakraProvider theme={theme}>
            <ColorModeProvider>
                <BrowserRouter>
                    <ContentBoundary>
                        <SWRConfig value={config}>
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

const domElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(domElement).render(<FluorineDashboard />);
