// import '#/assets/components/Sidebar.css';
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    useColorMode,
    useColorModeValue,
    UseDisclosureReturn,
    useToast
} from '@chakra-ui/react';
import { MdDarkMode, MdLightMode, MdLogout } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';

const Sidebar: React.FC<{
    children: React.ReactNode;
    disclosureProps: UseDisclosureReturn;
}> = ({ children, disclosureProps }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    return (
        <>
            {isMobile ? (
                <Drawer isOpen={disclosureProps.isOpen} placement="left" onClose={disclosureProps.onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Fluorine</DrawerHeader>

                        <DrawerBody onClickCapture={disclosureProps.onClose}>{children}</DrawerBody>

                        <DrawerFooter gap={2}>
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
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box
                    className="Sidebar"
                    flex={'20%'}
                    background={useColorModeValue('gray.200', 'gray.900')}
                    padding={4}
                    as={'aside'}
                    height={'100vh'}
                >
                    <nav className="DisplayedContent">{children}</nav>
                </Box>
            )}
        </>
    );
};

export default Sidebar;
