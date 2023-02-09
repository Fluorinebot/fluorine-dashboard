import useTheme from '#/lib/useTheme';
import Guild from '#/routes/Guild';
import Case from '#/routes/guild/Case';
import Cases from '#/routes/guild/Cases';
import Home from '#/routes/Home';
import { useState } from 'react';
import { FaArrowUp, FaBars } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
    const { isDarkTheme, setDarkTheme, setThemeStateFromButton } = useTheme();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const contentShownState = useState(true);

    return (
        <BrowserRouter>
            <header className="Header">
                <h1 className="Header__Text">Fluorine</h1>
                {isMobile && (
                    <button onClick={() => contentShownState[1](curr => !curr)} className="Header__Button">
                        {!contentShownState[0] ? <FaArrowUp /> : <FaBars />}
                    </button>
                )}
            </header>

            <div className="Utils__Home">
                <Routes>
                    <Route element={<Home contentShownState={contentShownState} />} path="/" />
                    <Route element={<Guild contentShownState={contentShownState} />} path="/guilds/:id">
                        <Route index element={<p>hi</p>} />
                        <Route element={<Cases />} path="/guilds/:id/cases">
                            <Route
                                index
                                element={<p className="noticeBox">No item selected</p>}
                                path="/guilds/:id/cases/"
                            />
                            <Route element={<Case />} path="/guilds/:id/cases/:item" />
                        </Route>
                    </Route>
                    <Route
                        element={
                            <div className="Utils__TakeScreen">
                                <div>
                                    <h1 className="leading">Not found</h1>
                                    <p className="leading">No such page exists.</p>
                                    <Link to="/" className="Button Button--Primary">
                                        Go back
                                    </Link>
                                </div>
                            </div>
                        }
                        path="*"
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
