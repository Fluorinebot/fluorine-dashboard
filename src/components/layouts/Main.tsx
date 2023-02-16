import Sidebar from '#/components/Sidebar';
import HomeMenu from '#/components/sidebars/HomeMenu';
import { Box, Center, Flex, UseDisclosureReturn } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC<{ disclosureProps: UseDisclosureReturn }> = ({ disclosureProps }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    // const renderContent = (isMobile && renderContext && renderContext[0] === 'content') || !isMobile;

    return (
        <Flex overflowY="hidden">
            <Sidebar disclosureProps={disclosureProps}>
                <HomeMenu />
            </Sidebar>
            <Box as="main" flex="80%" padding={4}>
                <Center flexDirection={'column'}>
                    <Box width={['full', 'full', `${50 + 25 / 2}%`]}>
                        <Outlet />
                    </Box>
                </Center>
            </Box>
        </Flex>
    );
};

export default MainLayout;
