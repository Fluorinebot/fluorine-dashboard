import MainLayout from '#/components/layouts/Main';
import Home from '#/routes';
import GuildSelection from '#/routes/guilds';
import Guild from '#/routes/guilds/[id]';
import Cases from '#/routes/guilds/[id]/cases';
import Case from '#/routes/guilds/[id]/cases/[id]';
import Logging from '#/routes/guilds/[id]/logging';
import Leaderboard from '#/routes/leaderboard';
import {
    Box,
    Center,
    DarkMode,
    Flex,
    Heading,
    Icon,
    IconButton,
    Text,
    useColorMode,
    useDisclosure
} from '@chakra-ui/react';
import { MdArrowUpward, MdDarkMode, MdError, MdLightMode, MdMenu } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ContentBoundary, ErrorMessage } from './components/ErrorBoundary';

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { isOpen, onOpen, onClose, onToggle, ...disclosure } = useDisclosure();
    const disclosureProps = { ...disclosure, isOpen, onOpen, onClose, onToggle };

    return (
        <BrowserRouter>
            {isMobile && (
                <Flex
                    background={'fixedBlue.100'}
                    padding="2"
                    justify={'space-between'}
                    position={['sticky', 'sticky', 'relative']}
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
            )}

            <ContentBoundary>
                <Routes>
                    <Route element={<MainLayout disclosureProps={disclosureProps} />}>
                        <Route element={<Home />} path="/" />
                        <Route element={<GuildSelection />} path="/guilds" />
                        <Route element={<Leaderboard />} path="/leaderboards" />
                    </Route>

                    <Route element={<Guild disclosureProps={disclosureProps} />} path="/guilds/:id">
                        <Route
                            index
                            element={
                                <Center height={'100vh'} width={'100%'}>
                                    <Flex gap={2}>
                                        <Icon as={MdError} h={10} w={10} />
                                        <Box>
                                            <Heading size="md">No tab selected.</Heading>
                                            <Text size="md">You need to select a tab from the menu.</Text>
                                        </Box>
                                    </Flex>
                                </Center>
                            }
                        />

                        <Route element={<Cases />} path="/guilds/:id/cases" />
                        <Route element={<Case />} path="/guilds/:id/cases/:item" />

                        <Route index element={<Logging />} path="/guilds/:id/logging/" />
                    </Route>

                    <Route
                        element={
                            <Center width="100%" height="100vh">
                                <ErrorMessage
                                    heading="Not found!"
                                    message="Somehow, you were lead here! Sorry for the trouble."
                                    isInternal
                                />
                            </Center>
                        }
                        path="*"
                    />
                </Routes>
            </ContentBoundary>
        </BrowserRouter>
    );
}

export default App;
