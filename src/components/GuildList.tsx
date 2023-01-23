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
        <Link to={`/${guild.id}`} className={styles.card}>
            <img className={styles.cardImage} src={getIcon(guild)} alt="" />
            <div className={styles.cardText}>
                <h4 className="headingFive">{guild.name}</h4>
                <p className={styles.cardId}>{guild.id}</p>
            </div>
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
            <h3 className={`${styles.lessPadded} headingSix ${hasFluorine ? styles.fullFlex : ''}`}>{header}</h3>
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
    const data = useFetch<{ guilds: (APIGuild & { fluorine: boolean })[] }>(`${BASE_URI}/guilds`, { method: 'GET' });
    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading your servers</p>;
    }

    if (data && 'error' in data) {
        JSXReturn = <p>There was an error loading your servers, try again. </p>;
    }

    if (data && 'guilds' in data) {
        const filtered = data.guilds.filter(x => isAllowed(x));

        JSXReturn = (
            <div className={styles.flexContainer}>
                <Guilds header="Servers You Can Edit" data={filtered} hasFluorine={true} />
                <Guilds header="Servers You Can Add Fluorine To" data={filtered} hasFluorine={false} />
            </div>
        );
    }

    return <>{JSXReturn}</>;
}
