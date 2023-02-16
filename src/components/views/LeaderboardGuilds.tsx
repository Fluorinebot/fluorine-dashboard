import '#/assets/components/sidebars/GuildList.css';
import { Authorize } from '#/components/ErrorBoundary';
import GuildCard from '#/components/GuildCard';
import { Spinner } from '@chakra-ui/react';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { APIGuild } from 'discord-api-types/v10';

const isAllowed = (x: APIGuild & { fluorine: boolean }) =>
    (Number(x.permissions) & 0x8) === 0x8 || (Number(x.permissions) & 0x20) === 32;

export default function LeaderboardGuilds() {
    const { loading, data, error, code } = useAPI<{ guilds: (APIGuild & { fluorine: boolean })[] }>(
        `${BASE_URI}/guilds`,
        { method: 'GET' }
    );

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return <Authorize />;
        }

        return <p className="Utils__NoticeBox">An error has occured. Please try again.</p>;
    }

    if (data) {
        const guildsWithFluorine = data.guilds.filter(x => x.fluorine);

        return (
            <>
                <h1 className="Utils__Leading">Server Leaderboards</h1>
                <p className="Utils__Leading">
                    You are in {data.guilds.length} servers, of those servers, you can view the economy and level
                    leaderboard of {guildsWithFluorine.length} servers.
                </p>
                <section className="Utils__Leading">
                    <ul>
                        {guildsWithFluorine
                            .sort((x, y) => {
                                if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
                                if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
                                return 0;
                            })
                            .map(guild => (
                                <li key={guild.id}>
                                    <GuildCard guild={guild} />
                                </li>
                            ))}
                    </ul>
                </section>
            </>
        );
    }

    return <></>;
}
