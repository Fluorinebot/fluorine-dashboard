import Tab, { TabObject } from '#/components/sidebars/Tab';
import { List } from '@chakra-ui/react';
import { MdLeaderboard, MdPeople, MdPerson } from 'react-icons/md';

export default function HomeMenu() {
    const tabs: TabObject[] = [
        { tabName: 'User Settings', tabIcon: MdPerson, tabURI: '/', end: true },
        { tabName: 'Server Settings', tabIcon: MdPeople, tabURI: '/guilds' },
        {
            tabName: 'Leaderboards',
            tabIcon: MdLeaderboard,
            tabURI: '/leaderboards'
        }
    ];

    return (
        <List as="nav" spacing={2}>
            {tabs.map(item => (
                <Tab {...item} key={item.tabName} />
            ))}
        </List>
    );
}
