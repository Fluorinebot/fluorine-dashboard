import { APIGuild } from 'discord-api-types/v10';
import { Link } from 'react-router-dom';
import { BASE_URI } from '../lib/constants';
import { useFetch } from '../lib/useFetch';
import styles from './GuildList.module.css';

const isAllowed = (x: APIGuild & { fluorine: boolean }) =>
    (Number(x.permissions) & 0x8) === 0x8 || (Number(x.permissions) & 0x20) === 0x32;

const getIcon = (x: APIGuild & { fluorine: boolean }) =>
    x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(x.id) % BigInt(5)}.png?size=48`;

function GuildCard({ guild }: { guild: APIGuild & { fluorine: boolean } }) {
    return (
        <Link key={guild.id} to={`/${guild.id}`} className={styles.card}>
            <img className={styles.cardImage} src={getIcon(guild)} alt="" />
            <h4>{guild.name}</h4>
        </Link>
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
        <div className={styles.padded}>
            <h3 className={styles.lessPadded}>{header}</h3>
            <div>
                {data
                    .filter(x => (hasFluorine ? x.fluorine : !x.fluorine) && isAllowed(x))
                    .map(guild => (
                        <GuildCard guild={guild} />
                    ))}
            </div>
        </div>
    );
}

export default function GuildList() {
    const data = useFetch<{ guilds: (APIGuild & { fluorine: boolean })[] }>(`${BASE_URI}/guilds`, { method: 'GET' });

    return (
        <>
            {!data && <p>Loading your servers</p>}
            {data && 'error' in data && <p>There was an error loading your servers, try again. </p>}
            {data && 'guilds' in data && (
                <>
                    <Guilds header="Servers You Can Edit" data={data.guilds} hasFluorine={true} />
                    <Guilds header="Servers You Can Add Fluorine To" data={data.guilds} hasFluorine={false} />
                </>
            )}
        </>
    );
}
