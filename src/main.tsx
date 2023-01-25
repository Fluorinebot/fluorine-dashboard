import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '#/App';

const domElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(domElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
