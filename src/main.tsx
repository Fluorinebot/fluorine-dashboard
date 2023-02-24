import App from '#/App';
import theme from '#/lib/theme';
import { ChakraProvider, ColorModeProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const FluorineDashboard = () => (
    <React.StrictMode>
        <ColorModeScript initialColorMode={'dark'} />
        <ChakraProvider theme={theme}>
            <ColorModeProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ColorModeProvider>
        </ChakraProvider>
    </React.StrictMode>
);

const domElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(domElement).render(<FluorineDashboard />);
