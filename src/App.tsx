import useTheme from '#/lib/useTheme';
import Guild from '#/routes/Guild';
import Case from '#/routes/guild/Case';
import Cases from '#/routes/guild/Cases';
import Home from '#/routes/Home';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
    const { isDarkTheme, setDarkTheme, setThemeStateFromButton } = useTheme();
    const contentShownState = useState(true);

    return (
        <BrowserRouter>
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
                    {/* <Route
                        element={
                            <>
                                <p>the funny with tabs</p> <Outlet />
                            </>
                        }
                        path="/guilds/:id/:tab"
                    >
                        <Route index element={<p>the funny with an empty preview</p>} />
                        <Route element={<p>the funny except we have item</p>} path="/guilds/:id/:tab/:item" />
                    </Route> */}
                </Route>
                <Route
                    element={
                        <div className="full">
                            <div className="noticeBox">
                                <div>
                                    <h1 className="leading">Not found</h1>
                                    <p className="leading">No such page exists.</p>
                                    <Link to="/" className="ctaButton">
                                        Go back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                    path="*"
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
