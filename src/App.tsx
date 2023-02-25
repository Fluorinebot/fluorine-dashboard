import { ErrorMessage } from '#/components/ErrorBoundary';
import { CLIENT_ID, REDIRECT_URI } from '#/lib/constants';
import { Box, Center, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { MdError } from 'react-icons/md';
import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

import MainLayout from '#/components/layouts/Main';

const Home = lazy(() => import('#/routes'));
const Guilds = lazy(() => import('#/routes/guilds'));
const Guild = lazy(() => import('#/routes/guilds/[id]'));
const Cases = lazy(() => import('#/routes/guilds/[id]/cases'));
const Case = lazy(() => import('#/routes/guilds/[id]/cases/[item]'));
const Logging = lazy(() => import('#/routes/guilds/[id]/logging'));
const Leaderboard = lazy(() => import('#/routes/leaderboard'));

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<Home />} path="/" />
                <Route element={<Guilds />} path="/guilds" />
                <Route element={<Leaderboard />} path="/leaderboards" />
            </Route>

            <Route element={<Guild />} path="/guilds/:id">
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
                    <ErrorMessage
                        isExternal
                        heading="You aren't logged in!"
                        message="To continue, you must login with Discord"
                        button="Continue with Discord"
                        link={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
                    />
                }
                path="/403"
            />

            <Route
                element={
                    <Center width="100%" height="100vh">
                        <ErrorMessage
                            heading="Not found!"
                            message="Somehow, you were lead here! Sorry for the trouble."
                        />
                    </Center>
                }
                path="*"
            />
        </Routes>
    );
}

export default App;
