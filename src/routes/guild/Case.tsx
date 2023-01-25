import styles from '#/assets/routes/guild/Cases.module.css';
import AvatarWithName from '#/components/AvatarWithName';
import { Authorize } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

export default function Case() {
    const params = useParams();
    const { loading, data, code, error } = useAPI<Case>(`${BASE_URI}/guilds/${params.id}/cases/${params.item}`);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    if (loading) {
        return <p className="noticeBox container">Loading all cases</p>;
    }

    if (error) {
        if (code === 401) {
            return (
                <div className="container">
                    <Authorize />
                </div>
            );
        } else if (code === 404) {
            return (
                <div className="container">
                    <p>Not found.</p>
                </div>
            );
        }

        return <p className="noticeBox container">There was an error loading the cases, try again.</p>;
    }

    if (data) {
        if (isMobile) {
            return <p>hi, you're on mobile. case view on mobile isnt done yet!</p>;
        }

        return (
            <div className="container">
                <div>
                    <h2 className="leading">Case #{data.caseId}</h2>
                    <p className="leading">A {data.type}</p>
                </div>

                <div>
                    <p className={`${styles.nameFlex} leading`}>
                        <p className={`${styles.sideName} grey`}>Moderator </p>
                        <AvatarWithName guildId={data.guildId} userId={data.caseCreator} />
                    </p>
                    <div className={`${styles.nameFlex} leading`}>
                        <p className={`${styles.sideName} grey`}>Moderated User </p>
                        <AvatarWithName guildId={data.guildId} userId={data.moderatedUser} />
                    </div>
                    <div className={styles.nameFlex}>
                        <p className={`${styles.sideName} grey`}>Reason </p>
                        <b className={styles.name}>{data.reason ?? 'None'}</b>
                    </div>
                </div>
            </div>
        );
    }

    return <></>;
}
