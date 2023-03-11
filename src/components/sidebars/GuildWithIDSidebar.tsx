import Tab, { type TabObject } from '#/components/sidebars/Tab';
import { BASE_URI } from '#/lib/constants';
import type { FluorineGuild, WithPayload } from '#/lib/types';
import { Box, Center, Flex, FormControl, FormLabel, Icon, Image, List, Spinner, Text } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { MdArrowBack, MdError, MdHistory, MdSettings } from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

const getIcon = (id: string, icon?: string | null) => {
    const ret = icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

    return ret;
};

const isAllowed = (x: FluorineGuild) => (Number(x.permissions) & 0x8) === 0x8 || (Number(x.permissions) & 0x20) === 32;

const GuildWithIDSidebar: React.FC = () => {
    const { isLoading, data, error } = useSWR<WithPayload<{ guilds: FluorineGuild[] }>, WithPayload<any>>([
        `${BASE_URI}/guilds`
    ]);

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [, , , currLocation] = location.pathname.split('/');

    const tabs: TabObject[] = [
        {
            tabName: 'Back',
            tabURI: params.item ? `/guilds/${params.id}/${currLocation}` : `/guilds`,
            TabIcon: MdArrowBack,
            end: true
        },
        {
            tabName: 'Cases',
            tabURI: `/guilds/${params.id}/cases`,
            TabIcon: MdHistory
        },
        { tabName: 'Logging Options', tabURI: `/guilds/${params.id}/logging`, TabIcon: MdSettings }
    ];

    if (isLoading) {
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
        const filtered = data.payload.guilds.filter(x => isAllowed(x));
        const guildsWithFluorine = filtered
            .filter(x => x.fluorine)
            .sort((x, y) => {
                if (x.name.toLowerCase() < y.name.toLowerCase()) {
                    return -1;
                }
                if (x.name.toLowerCase() > y.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            })
            .map(x => ({ label: x.name, icon: getIcon(x.id, x.icon), value: x.id }));

        return (
            <Flex gap={8} direction="column">
                <FormControl paddingTop={4}>
                    <FormLabel>Selected Server</FormLabel>
                    <Select
                        colorScheme="brand"
                        value={guildsWithFluorine.find(x => x.value === params.id)}
                        options={guildsWithFluorine}
                        onChange={prop => navigate(`/guilds/${prop?.value}/${currLocation}`)}
                        formatOptionLabel={data => (
                            <Flex gap={2} alignItems="center">
                                <Image src={data.icon} h={'36px'} w={'36px'} rounded="full" />
                                <Box>
                                    <Text size="lg" fontWeight={600} wordBreak="break-all">
                                        {data.label}
                                    </Text>
                                </Box>
                            </Flex>
                        )}
                        isSearchable={false}
                    />
                </FormControl>

                <List as="nav" spacing={2}>
                    {tabs.map(item => (
                        <Tab key={item.tabName} {...item} />
                    ))}
                </List>
            </Flex>
        );
    }

    return <></>;
};

export default GuildWithIDSidebar;
