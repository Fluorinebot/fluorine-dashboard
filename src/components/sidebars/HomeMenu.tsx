import { Button, Flex, Heading, List, ListItem } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { MdLeaderboard, MdPeople, MdPerson } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

interface TabProps {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
}

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

export default function HomeMenu() {
    const location = useLocation();

    const tabs: (TabProps & { selected: boolean })[] = [
        { tabName: 'User Settings', tabIcon: MdPerson, tabURI: '/', selected: location.pathname === '/' },
        { tabName: 'Server Settings', tabIcon: MdPeople, tabURI: '/guilds', selected: location.pathname === '/guilds' },
        {
            tabName: 'Leaderboards',
            tabIcon: MdLeaderboard,
            tabURI: '/leaderboards',
            selected: location.pathname === '/leaderboards'
        }
    ];

    return (
        <Flex gap={4} direction="column">
            <nav>
                <List spacing={2}>
                    {tabs.map(item => (
                        <Tab {...item} key={item.tabName} />
                    ))}
                </List>
            </nav>
        </Flex>
    );
}
