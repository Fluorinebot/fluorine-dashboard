import Sidebar from '#/components/Sidebar';
import HomeMenu from '#/components/sidebars/HomeMenu';
import { Box, Center, Flex, UseDisclosureReturn } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC<{ disclosureProps: UseDisclosureReturn }> = ({ disclosureProps }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <Box overflowY="hidden">
            {isMobile ? (
                <Box>
                    <Sidebar disclosureProps={disclosureProps}>
                        <HomeMenu />
                    </Sidebar>

                    <Box as="main" padding={4}>
                        <Outlet />
                    </Box>
                </Box>
            ) : (
                <Flex overflowY="hidden" height="100vh">
                    <Box flex="20%" height="100vh">
                        <Sidebar disclosureProps={disclosureProps}>
                            <HomeMenu />
                        </Sidebar>
                    </Box>
                    <Box as="main" flex="80%" padding={4} maxHeight="100vh" overflowY="scroll">
                        <Center flexDirection={'column'}>
                            <Box width={['full', 'full', `${50 + 25 / 2}%`]}>
                                <Outlet />
                            </Box>
                        </Center>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};

export default MainLayout;
