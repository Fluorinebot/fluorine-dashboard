import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
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
    Heading,
    IconButton,
    Avatar,
    Link,
    Text,
    useColorMode,
    useColorModeValue,
    UseDisclosureReturn,
    useToast
} from '@chakra-ui/react';
import { APIUser } from 'discord-api-types/v10';
import { MdDarkMode, MdLightMode, MdLogout } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Link as RouteTo, useNavigate } from 'react-router-dom';

const getIcon = (id: string, icon: string | null, discrim: string) =>
    icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=512`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(discrim) % BigInt(5)}.png?size=1024`;

const Sidebar: React.FC<{
    children: React.ReactNode;
    disclosureProps: UseDisclosureReturn;
}> = ({ children, disclosureProps }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();
    const navigate = useNavigate();

    const { loading, data, error, code } = useAPI<APIUser>(`${BASE_URI}/user`, { method: 'GET' });

    if (error || loading || !data) {
    }

    let name: string = '';
    let originalName = 'Fluorine Dashboard';
    let iconURL: string = '';

    if (error || loading) {
        if (loading) {
            name = 'Loading User#0000';
        }

        if (error) {
            navigate('/403');
            return <></>;
        }

        iconURL = 'https://cdn.discordapp.com/embed/avatars/5.png';
    }

    if (data) {
        iconURL = getIcon(data.id, data.avatar, data.discriminator);
        name = `${data.username}#${data.discriminator}`;
        originalName = data.username;
    }

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

    if (isMobile) {
        return (
            <Drawer isOpen={disclosureProps.isOpen} placement="left" size="80%" onClose={disclosureProps.onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Fluorine</DrawerHeader>

                    <DrawerBody onClickCapture={disclosureProps.onClose}>{children}</DrawerBody>

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
                                {buttons}
                            </Flex>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Flex
            direction="column"
            background={useColorModeValue('gray.50', 'gray.900')}
            padding={4}
            as={'aside'}
            height={'100%'}
            gap={3}
        >
            <Link as={RouteTo} to="/" colorScheme={'brand'}>
                <Heading fontSize={'2xl'} as="h1" fontWeight={900}>
                    Fluorine
                </Heading>
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
                    {buttons}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Sidebar;
