import { IconType } from 'react-icons';
import { FaArrowLeft, FaCog, FaFile } from 'react-icons/fa';
import classNames from 'classnames';
import { Link, useLocation, useParams } from 'react-router-dom';
import styles from '#/assets/components/sidebars/TabsList.module.css';
import { ErrorType } from '#/lib/types';

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
                <h5 className="headingSix">{tabName}</h5>
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

    const tabs: TabProps[] = [
        { tabName: 'Back', tabURI: isGuildBackURI ? `/guilds/${id}` : `/`, tabIcon: FaArrowLeft },
        {
            tabName: 'Cases',
            tabURI: `/guilds/${id}/cases`,
            tabIcon: FaFile
        },
        { tabName: 'Logging Options', tabURI: `/guilds/${id}/logging`, tabIcon: FaCog }
    ];

    if (loading) {
        return <p className="noticeBox">Just a sec</p>;
    }

    if (error) {
        if (code === 401) {
            return <p className="noticeBox">You must authorize to continue</p>;
        } else if (code === 404) {
            return <p className="noticeBox">That server does not exist</p>;
        }
    }

    return (
        <>
            {loading && <p>Just a sec</p>}
            {error && <p>You must authorize to continue.</p>}
            {data && (
                <div className={styles.flexContainer}>
                    <div className={styles.header}>
                        <img className={styles.cardImage} src={getIcon(id ?? '', data.icon)} alt="" />
                        <h2 className={`headingOne ${styles.cardText}`}>{data.name}</h2>
                    </div>
                    <nav>
                        {tabs.map(item => (
                            <Tab
                                {...item}
                                key={item.tabName}
                                selected={location.pathname.split('/')[3] === item.tabName.split(' ')[0].toLowerCase()}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
