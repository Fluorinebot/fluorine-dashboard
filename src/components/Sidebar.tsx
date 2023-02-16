import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Text,
    useColorMode,
    useColorModeValue,
    UseDisclosureReturn,
    useToast
} from '@chakra-ui/react';
import { MdDarkMode, MdLightMode, MdLogout } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const Sidebar: React.FC<{
    children: React.ReactNode;
    disclosureProps: UseDisclosureReturn;
}> = ({ children, disclosureProps }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    const buttons = (
        <>
            <IconButton
                onClick={() =>
                    toast({
                        title: 'You may not log out at this time.',
                        status: 'error',
                        duration: 9000,
                        position: 'top',
                        isClosable: true
                    })
                }
                aria-label={'Log out'}
                icon={<MdLogout size={'24'} />}
                variant="ghost"
            />
            <IconButton
                onClick={toggleColorMode}
                aria-label={colorMode === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
                icon={colorMode === 'dark' ? <MdDarkMode size={'24'} /> : <MdLightMode size={'24'} />}
                variant="ghost"
            />
        </>
    );

    return (
        <>
            {isMobile ? (
                <Drawer isOpen={disclosureProps.isOpen} placement="left" onClose={disclosureProps.onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Fluorine</DrawerHeader>

                        <DrawerBody onClickCapture={disclosureProps.onClose}>{children}</DrawerBody>

                        <DrawerFooter gap={2}>{buttons}</DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Flex
                    direction="column"
                    background={useColorModeValue('gray.50', 'gray.900')}
                    padding={4}
                    as={'aside'}
                    height={'100%'}
                    gap={3}
                >
                    <Link to="/">
                        <Text fontSize={'2xl'} as="h1" fontWeight={900}>
                            Fluorine
                        </Text>
                    </Link>

                    <Box flex={1} overflowY={'scroll'} maxHeight="100vh">
                        {children}
                    </Box>

                    <Flex gap={2}>{buttons}</Flex>
                </Flex>
            )}
        </>
    );
};

export default Sidebar;
