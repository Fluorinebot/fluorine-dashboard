import { BASE_URI } from '#/lib/constants';
import type { WithPayload } from '#/lib/types';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    Image,
    Link,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';
import type { APIUser } from 'discord-api-types/v10';
import { useRef } from 'react';
import { MdArrowUpward, MdDarkMode, MdLightMode, MdLogout, MdMenu } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link as RouteTo, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const getIcon = (id: string, icon: string | null, discrim: string) => {
    const ret = icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=512`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(discrim) % BigInt(5)}.png?size=1024`;

    return ret;
};

const Sidebar: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { isOpen, onClose, onToggle, getButtonProps, getDisclosureProps } = useDisclosure({
        id: 'App::MobileSidebar'
    });

    const {
        isOpen: isLogOutOpen,
        onClose: onLogOutClose,
        onToggle: onLogOutToggle,
        getDisclosureProps: getLogOutDisclosure,
        getButtonProps: getLogOutButton
    } = useDisclosure({ id: 'App::LogOut' });
    const navigate = useNavigate();
    const { isLoading, data, error, mutate } = useSWR<WithPayload<APIUser>>([`${BASE_URI}/user`], {
        refreshInterval: 0
    });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { colorMode, toggleColorMode } = useColorMode();
    const sidebarBackground = useColorModeValue('gray.50', 'gray.900');
    const navbarShadow = useColorModeValue('md', 'lg');
    const cancelRef = useRef<any>();

    let name = '';
    let originalName = '';
    let iconURL = '';

    if (error || isLoading) {
        if (isLoading) {
            name = 'Loading User#0000';
        }

        if (error) {
            navigate('/403');
            return <></>;
        }

        iconURL = 'https://cdn.discordapp.com/embed/avatars/5.png';
    }

    if (data) {
        iconURL = getIcon(data.payload.id, data.payload.avatar, data.payload.discriminator);
        name = `${data.payload.username}#${data.payload.discriminator}`;
        originalName = data.payload.username;
    }

    const userSideButtons = (
        <>
            <IconButton
                onClick={onLogOutToggle}
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

    const logOut = () => {
        onLogOutClose();
        mutate();
    };

    const logOutModal = (
        <AlertDialog
            isOpen={isLogOutOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
            {...getLogOutDisclosure()}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Log Out?
                    </AlertDialogHeader>

                    <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onLogOutClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={logOut} ml={3}>
                            Log Out
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );

    if (isMobile) {
        return (
            <Flex background={sidebarBackground} padding="2" justify={'space-between'} shadow={navbarShadow}>
                <Link as={RouteTo} to="/">
                    <Flex gap={4} alignItems="center">
                        <Image src="/fluorine.svg" width="10" height="10" rounded="full" />
                        <Text fontSize={'2xl'} as="h1" fontWeight={900}>
                            Fluorine
                        </Text>
                    </Flex>
                </Link>

                <Flex gap={2}>
                    <IconButton
                        aria-label={isOpen ? 'Close' : 'Open Menu'}
                        icon={isOpen ? <MdArrowUpward size={'24'} /> : <MdMenu size={'24'} />}
                        variant="ghost"
                        {...getButtonProps()}
                    />
                </Flex>

                <Drawer isOpen={isOpen} placement="left" size="80%" {...getDisclosureProps()} onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Link as={RouteTo} to="/">
                                <Flex gap={4} alignItems="center">
                                    <Image src="/fluorine.svg" width="10" height="10" rounded="full" />
                                    <Text fontSize={'2xl'} as="h1" fontWeight={900}>
                                        Fluorine
                                    </Text>
                                </Flex>
                            </Link>
                        </DrawerHeader>

                        <DrawerBody onClickCapture={onClose}>{children}</DrawerBody>

                        <DrawerFooter>
                            <Flex justifyContent="space-between" alignItems="center" flex="1">
                                <Flex gap="2" alignItems="center">
                                    <Avatar w={'12'} h={'12'} src={iconURL} name={originalName} rounded={'full'} />
                                    <Box>
                                        <Text color="gray" size="xs">
                                            Logged in as
                                        </Text>
                                        <Heading as="h5" size="sm" wordBreak="break-all">
                                            {name}
                                        </Heading>
                                    </Box>
                                </Flex>

                                <Flex justifyContent="flex-end" gap={2} marginBlock="auto">
                                    {userSideButtons}
                                </Flex>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {logOutModal}
            </Flex>
        );
    }

    return (
        <Flex direction="column" background={sidebarBackground} padding={4} as={'aside'} height={'100%'} gap={3}>
            <Link as={RouteTo} to="/">
                <Flex gap={4} alignItems="center">
                    <Image src="/fluorine.svg" width="10" height="10" rounded="full" />
                    <Text fontSize={'2xl'} as="h1" fontWeight={900}>
                        Fluorine
                    </Text>
                </Flex>
            </Link>

            <Box flex={1} overflowY={'scroll'} maxHeight="100vh">
                {children}
            </Box>

            <Flex justifyContent="space-between" alignItems="center">
                <Flex gap="2" alignItems="center">
                    <Avatar w={'12'} h={'12'} src={iconURL} name={originalName} rounded={'full'} />
                    <Box>
                        <Text color="gray" size="xs">
                            Logged in as
                        </Text>
                        <Heading as="h5" size="sm" wordBreak="break-all">
                            {name}
                        </Heading>
                    </Box>
                </Flex>

                <Flex justifyContent="flex-end" gap={2}>
                    {userSideButtons}
                </Flex>
            </Flex>

            {logOutModal}
        </Flex>
    );
};

export default Sidebar;
