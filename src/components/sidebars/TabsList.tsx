// import '#/assets/components/sidebars/TabsList.css';
import { ErrorType } from '#/lib/types';
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Icon,
    Image,
    List,
    ListItem,
    Spinner,
    Text,
    useTab,
    useToast
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { MdArrowBack, MdError, MdInsertDriveFile, MdSettings } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

interface TabProps {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
}

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

function Tab({ tabName, tabURI, selected, ...props }: TabProps & { selected: boolean }) {
    return (
        <ListItem>
            <Link to={tabURI}>
                <Button
                    gap={2}
                    color={selected ? 'fixedBlue.100' : ''}
                    iconSpacing={2}
                    leftIcon={<props.tabIcon size="36" />}
                    variant="ghost"
                >
                    <Heading as="h5" size="md" fontWeight={600} marginBlock={'auto'}>
                        {tabName}
                    </Heading>
                </Button>
            </Link>
        </ListItem>
    );
}

export default function TabsList({
    loading,
    data,
    error,
    code,
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

    const tabs: TabProps[] = [
        { tabName: 'Back', tabURI: isGuildBackURI ? `/guilds/${id}/${currLocation}` : `/guilds`, tabIcon: MdArrowBack },
        {
            tabName: 'Cases',
            tabURI: `/guilds/${id}/cases`,
            tabIcon: MdInsertDriveFile
        },
        { tabName: 'Logging Options', tabURI: `/guilds/${id}/logging`, tabIcon: MdSettings }
    ];

    if (loading) {
        return <Spinner />;
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
            <Flex gap={4} direction="column">
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

                <Box as="nav">
                    <List spacing={2}>
                        {tabs.map(item => (
                            <Tab
                                key={item.tabName}
                                {...item}
                                selected={currLocation === item.tabName.split(' ')[0].toLowerCase()}
                            />
                        ))}
                    </List>
                </Box>
            </Flex>
        );
    }

    return <></>;
}
