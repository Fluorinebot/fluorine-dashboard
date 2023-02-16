import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { ListItem, Flex, Heading, List, Button } from '@chakra-ui/react';
import classNames from 'classnames';
import { APIUser } from 'discord-api-types/v10';
import { IconType } from 'react-icons';
import { MdLeaderboard, MdLogout, MdPeople, MdPerson } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

interface TabProps {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
}

const getIcon = (id: string, icon: string | null, discrim: string) =>
    icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(discrim) % BigInt(5)}.png?size=48`;

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
    const { loading, data, error, code } = useAPI<APIUser>(`${BASE_URI}/user`, { method: 'GET' });

    let profileJSX;

    if (error || loading) {
        profileJSX = (
            <div className="Avatar TabLike">
                <img className="TabCard__Avatar" src="https://cdn.discordapp.com/embed/avatars/5.png" />
                <div className="TabCard__Text">
                    <p className="Utils__Grey">Logged in as</p>
                    <h5>
                        {loading && 'Loading User'}
                        {error && 'Unknown User'}#0000
                    </h5>
                </div>
            </div>
        );
    }

    if (data) {
        profileJSX = (
            <div className="Avatar TabLike">
                <img className="TabCard__Avatar" src={getIcon(data.id, data.avatar, data.discriminator)} />
                <div className="TabCard__Text">
                    <p className="Utils__Grey">Logged in as</p>
                    <h5>
                        {data.username}#{data.discriminator}
                    </h5>
                </div>
            </div>
        );
    }

    const tabs: (TabProps & { selected: boolean })[] = [
        { tabName: 'User Settings', tabIcon: MdPerson, tabURI: '/', selected: location.pathname === '/' },
        { tabName: 'Server Settings', tabIcon: MdPeople, tabURI: '/guilds', selected: location.pathname === '/guilds' },
        {
            tabName: 'Leaderboards',
            tabIcon: MdLeaderboard,
            tabURI: '/leaderboards',
            selected: location.pathname === '/leaderboards'
        },
        { tabName: 'Log out', tabIcon: MdLogout, tabURI: '/log-out', selected: location.pathname === '/log-out' }
    ];
    return (
        <>
            {code === 401 ? (
                <p>You must authorize to continue.</p>
            ) : (
                <div>
                    {/* {profileJSX} */}
                    <nav>
                        <List spacing={2}>
                            {tabs.map(item => (
                                <Tab {...item} key={item.tabName} />
                            ))}
                        </List>
                    </nav>
                </div>
            )}
        </>
    );
}
