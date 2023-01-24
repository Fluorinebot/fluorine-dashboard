import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ContentBoundary } from './components/ErrorBoundary';
import Home from './routes/Home';
import Server from './routes/Server';

const Redirect: React.FC<{}> = () => {
    const params = useParams();
    return <Navigate to={`/${params.id}/cases`} />;
};

export default function App() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('darkThemeEnabled');

    const [isDark, setDarkState] = useState<boolean>(currentTheme ? JSON.parse(currentTheme) : prefersDarkScheme);
    const [show, setShow] = useState(false);

    document.body.classList.add(isDark ? 'dark' : 'light');

    if (!currentTheme) {
        localStorage.setItem('darkThemeEnabled', JSON.stringify(prefersDarkScheme));
    }

    function setDark() {
        localStorage.setItem('darkThemeEnabled', JSON.stringify(!isDark));
        setDarkState((dark: boolean) => !dark);
        document.body.classList.toggle(isDark ? 'dark' : 'light');
    }

    return (
        <ContentBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home state={[show, setShow]} />} />
                    <Route index path="/:id" element={<Redirect />} />
                    <Route index path="/:id/:tab" element={<Server state={[show, setShow]} />} />
                    <Route index path="/:id/:tab/:itemId" element={<Server state={[show, setShow]} />} />
                </Routes>
            </BrowserRouter>
        </ContentBoundary>
    );
}
