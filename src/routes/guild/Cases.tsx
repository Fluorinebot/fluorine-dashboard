import styles from '#/assets/routes/guild/Cases.module.css';
import { Authorize } from '#/components/ErrorBoundary';
import AvatarWithName from '#/components/AvatarWithName';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { useMediaQuery } from 'react-responsive';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

const CaseCard: React.FC<{ caseData: Case }> = ({ caseData }) => {
    return (
        <Link to={`/guilds/${caseData.guildId}/cases/${caseData.caseId}`}>
            <div className={`${styles.card} transition`}>
                <p className="leading">
                    <span className="grey">Case </span>
                    <b>#{caseData.caseId}</b>
                    <span className="grey"> | {toTitleCase(caseData.type)}</span>
                </p>
                <p className={`${styles.nameFlex} leading`}>
                    <p className={`${styles.sideName} grey`}>Mod </p>
                    <AvatarWithName guildId={caseData.guildId} userId={caseData.caseCreator} />
                </p>
                <div className={`${styles.nameFlex} leading`}>
                    <p className={`${styles.sideName} grey`}>User </p>
                    <AvatarWithName guildId={caseData.guildId} userId={caseData.moderatedUser} />
                </div>
                <div className={styles.nameFlex}>
                    <p className={`${styles.sideName} grey`}>Reason </p>
                    <b className={styles.name}>{caseData.reason ?? 'None'}</b>
                </div>
            </div>
        </Link>
    );
};

export default function Cases() {
    const params = useParams();
    const { loading, data, code, error } = useAPI<Case[]>(`${BASE_URI}/guilds/${params.id}/cases`);

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
                    <h2 className="leading">Cases</h2>
                    <p>The log of all moderation cases in this server.</p>
                </div>

                <div className={styles.flex}>
                    <div className={styles.sidebar}>
                        {data.length > 0 &&
                            data
                                .sort((x, y) => {
                                    if (x.caseId < y.caseId) return -1;
                                    if (x.caseId > y.caseId) return 1;
                                    return 0;
                                })
                                .map(caseData => <CaseCard key={caseData.caseId} caseData={caseData} />)}

                        {data.length === 0 && (
                            <>
                                <p className="noticeBox">No cases to show.</p>
                            </>
                        )}

                        {/* fixes clipping in 100vh */}
                        {new Array(4).fill(<br />)}
                    </div>
                    <div className={styles.content}>
                        <Outlet />
                    </div>
                </div>
            </div>
        );
    }

    return <></>;
}
