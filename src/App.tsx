import MainLayout from '#/components/layouts/Main';
import { RenderingContext } from '#/lib/RenderContext';
import Home from '#/routes';
import GuildSection from '#/routes/guilds';
import Guild from '#/routes/guilds/[id]';
import Cases from '#/routes/guilds/[id]/cases';
import Case from '#/routes/guilds/[id]/cases/[id]';
import Logging from '#/routes/guilds/[id]/logging';
import Leaderboard from '#/routes/leaderboard';
import LogOut from '#/routes/LogOut';
import { DarkMode, Flex, IconButton, Text, useColorMode, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { MdArrowUpward, MdDarkMode, MdLightMode, MdMenu } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { isOpen, onOpen, onClose, onToggle, ...disclosure } = useDisclosure();
    const disclosureProps = { ...disclosure, isOpen, onOpen, onClose, onToggle };

    return (
        <BrowserRouter>
            <Flex
                background={'fixedBlue.100'}
                padding="2"
                justify={'space-between'}
                position="sticky"
                top={0}
                zIndex={100}
                shadow="2xl"
            >
                <DarkMode>
                    <Text fontSize={'2xl'} as="h1" fontWeight={900} color="whiteAlpha.900" marginBlock={'auto'}>
                        Fluorine
                    </Text>
                    <Flex gap={2}>
                        <IconButton
                            onClick={toggleColorMode}
                            aria-label={colorMode === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
                            icon={colorMode === 'dark' ? <MdDarkMode size={'24'} /> : <MdLightMode size={'24'} />}
                            variant="ghost"
                        />
                        {isMobile && (
                            <IconButton
                                onClick={onToggle}
                                aria-label={!isOpen ? 'Open Menu' : 'Close'}
                                icon={!isOpen ? <MdMenu size={'24'} /> : <MdArrowUpward size={'24'} />}
                                variant="ghost"
                            />
                        )}
                    </Flex>
                </DarkMode>
            </Flex>

            <ErrorBoundary>
                <Routes>
                    {/* main menu */}
                    <Route element={<MainLayout disclosureProps={disclosureProps} />}>
                        <Route element={<Home />} path="/" />
                        <Route element={<GuildSection />} path="/guilds" />
                        <Route element={<Leaderboard />} path="/leaderboards" />
                        <Route element={<LogOut />} path="/log-out" />
                    </Route>

                    <Route element={<Guild disclosureProps={disclosureProps} />} path="/guilds/:id">
                        <Route index element={<p>hi</p>} />

                        <Route element={<Cases />} path="/guilds/:id/cases">
                            <Route
                                index
                                element={<p className="Utils__NoticeBox">No item selected</p>}
                                path="/guilds/:id/cases/"
                            />

                            <Route element={<Case />} path="/guilds/:id/cases/:item" />
                        </Route>

                        <Route index element={<Logging />} path="/guilds/:id/logging/" />
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
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
