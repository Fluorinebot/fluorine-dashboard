import { ErrorType } from '#/lib/types';
import { Box, Center, Flex, Heading, Icon, Image, List, Spinner, Text } from '@chakra-ui/react';
import { MdArrowBack, MdError, MdHistory, MdSettings } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import Tab, { TabObject } from '#/components/sidebars/Tab';

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

export default function TabsList({
    loading,
    data,
    error,
    id,
    isGuildBackURI
}: {
    loading: boolean;
    error: ErrorType<any>;
    data: any;
    code: number;
    isGuildBackURI?: boolean;
    id?: string;
}) {
    const location = useLocation();
    const currLocation = location.pathname.split('/')[3];

    const tabs: TabObject[] = [
        {
            tabName: 'Back',
            tabURI: isGuildBackURI ? `/guilds/${id}/${currLocation}` : `/guilds`,
            TabIcon: MdArrowBack,
            end: true
        },
        {
            tabName: 'Cases',
            tabURI: `/guilds/${id}/cases`,
            TabIcon: MdHistory
        },
        { tabName: 'Logging Options', tabURI: `/guilds/${id}/logging`, TabIcon: MdSettings }
    ];

    if (loading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner />
            </Center>
        );
    }

    if (error) {
        return (
            <Center height={'100%'} width={'100%'}>
                <Flex gap={2}>
                    <Icon as={MdError} h={10} w={10}></Icon>
                </Flex>
            </Center>
        );
    }

    if (data) {
        return (
            <Flex gap={8} direction="column">
                <Flex gap="2">
                    <Image
                        objectFit="cover"
                        w={'14'}
                        h={'14'}
                        src={getIcon(id ?? '', data.icon)}
                        alt=""
                        rounded={'full'}
                    />
                    <Box marginBlock={'auto'}>
                        <Text size="sm" color="gray">
                            Viewing
                        </Text>
                        <Heading as="h5" size="md">
                            {data.name}
                        </Heading>
                    </Box>
                </Flex>

                <List as="nav" spacing={2}>
                    {tabs.map(item => (
                        <Tab key={item.tabName} {...item} />
                    ))}
                </List>
            </Flex>
        );
    }

    return <></>;
}
