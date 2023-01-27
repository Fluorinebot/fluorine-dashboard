import { APIGuild } from 'discord-api-types/v10';
import { BASE_URI, CLIENT_ID } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import '#/assets/components/sidebars/GuildList.css';

const isAllowed = (x: APIGuild & { fluorine: boolean }) =>
    (Number(x.permissions) & 0x8) === 0x8 || (Number(x.permissions) & 0x20) === 32;

const getIcon = (x: APIGuild & { fluorine: boolean }) =>
    x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(x.id) % BigInt(5)}.png?size=48`;

function GuildCard({ guild }: { guild: APIGuild & { fluorine: boolean } }) {
    return (
        <a
            href={
                guild.fluorine
                    ? `/guilds/${guild.id}/cases`
                    : `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=1374389881878&guild_id=${guild.id}`
            }
            className="GuildCard"
        >
            <img className="GuildCard__Image" src={getIcon(guild)} alt="" />
            <div className="GuildCard__Text">
                <h5>{guild.name}</h5>
            </div>
        </a>
    );
}

function Guilds({
    header,
    data,
    hasFluorine
}: {
    header: string;
    data: (APIGuild & { fluorine: boolean })[];
    hasFluorine: boolean;
}) {
    return (
        <div className="Utils__Leading">
            <h6 className="Utils__Grey">{header}</h6>
            <div>
                {data
                    .filter(x => (hasFluorine ? x.fluorine : !x.fluorine))
                    .sort((x, y) => {
                        if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
                        if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
                        return 0;
                    })
                    .map(guild => (
                        <GuildCard key={guild.id} guild={guild} />
                    ))}
            </div>
        </div>
    );
}

export default function GuildList() {
    const { loading, data, error, code } = useAPI<{ guilds: (APIGuild & { fluorine: boolean })[] }>(
        `${BASE_URI}/guilds`,
        { method: 'GET' }
    );

    if (loading) {
        return <p className="noticeBox">Loading your servers</p>;
    }

    if (error) {
        if (code === 401) {
            return <p className="noticeBox">You must authorize to continue.</p>;
        }

        return <p className="noticeBox">There was an error loading your servers, try again.</p>;
    }

    if (data) {
        const filtered = data.guilds.filter(x => isAllowed(x));

        return (
            <>
                <Guilds header="Servers You Can Edit" data={filtered} hasFluorine={true} />
                <Guilds header="Servers You Can Add Fluorine To" data={filtered} hasFluorine={false} />
            </>
        );
    }

    return <></>;
}
