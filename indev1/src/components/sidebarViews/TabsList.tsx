import { IconType } from '@react-icons/all-files';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaCog } from '@react-icons/all-files/fa/FaCog';

import { FaFile } from '@react-icons/all-files/fa/FaFile';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './TabsList.module.css';

interface TabProps {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
}

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

function Tab({ tabName, tabURI, selected, ...props }: TabProps & { selected: boolean }) {
    return (
        <Link to={tabURI} className={classNames(styles.card, { [styles.selected]: selected })}>
            <props.tabIcon className={styles.icon} />
            <div className={styles.cardText}>
                <h4 className="headingSix">{tabName}</h4>
            </div>
        </Link>
    );
}

// function Guilds({
//     header,
//     data,
//     hasFluorine
// }: {
//     header: string;
//     data: (APIGuild & { fluorine: boolean })[];
//     hasFluorine: boolean;
// }) {
//     return (
//         <div className={styles.padded}>
//             <h3 className={`${styles.lessPadded} ${hasFluorine ? styles.fullFlex : ''}`}>{header}</h3>
//             <div>
//                 {data
//                     .filter(x => (hasFluorine ? x.fluorine : !x.fluorine))
//                     .sort((x, y) => {
//                         if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
//                         if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
//                         return 0;
//                     })
//                     .map(guild => (
//                         <GuildCard key={guild.id} guild={guild} />
//                     ))}
//             </div>
//         </div>
//     );
// }

export default function TabsList({
    id,
    icon,
    tab,
    name,
    isGuildBackURI
}: {
    name?: string;
    tab?: string;
    id?: string;
    icon?: string;
    isGuildBackURI?: boolean;
}) {
    const tabs: TabProps[] = [
        { tabName: 'Back', tabURI: isGuildBackURI ? `/${id}` : `/`, tabIcon: FaArrowLeft },
        {
            tabName: 'Cases',
            tabURI: `/${id}/cases`,
            tabIcon: FaFile
        },
        { tabName: 'Logging Options', tabURI: `/${id}/logging`, tabIcon: FaCog }
    ];

    return (
        <div className={styles.flexContainer}>
            {!name && <p>Just a sec</p>}
            {name && id === 'FetchFail' && <p>You must authorize to continue.</p>}
            {name && id !== 'FetchFail' && (
                <>
                    <div className={styles.header}>
                        <img className={styles.cardImage} src={getIcon(id ?? '', icon)} alt="" />
                        <h2 className={`headingOne ${styles.cardText}`}>{name}</h2>
                    </div>
                    <nav>
                        {tabs.map(item => (
                            <Tab {...item} key={item.tabName} selected={tab === item.tabName.toLowerCase()} />
                        ))}
                    </nav>
                </>
            )}
        </div>
    );
}
