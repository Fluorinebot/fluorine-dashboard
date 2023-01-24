import { Link } from 'react-router-dom';
import { BASE_URI } from '../../lib/constants';
import { useFetch } from '../../lib/useFetch';
import styles from './Cases.module.css';

interface Case {
    caseId: number;
    guildId: string;
    caseCreator: string;
    moderatedUser: string;
    type: 'warn' | 'ban' | 'timeout' | 'kick';
    reason: string;
}

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

const CaseRow: React.FC<{ caseData: Case }> = ({ caseData }) => {
    const caseCreator = useFetch<any>(`${BASE_URI}/guilds/${caseData.guildId}/users/${caseData.caseCreator}`);
    const moderatedUser = useFetch<any>(`${BASE_URI}/guilds/${caseData.guildId}/users/${caseData.moderatedUser}`);

    let creatorTag;
    let moderatedTag;

    if (!caseCreator || !moderatedUser) {
        creatorTag = 'Loading';
        moderatedTag = 'Loading';
    } else {
        creatorTag = 'error' in caseCreator ? 'User not found' : caseCreator.tag;
        moderatedTag = 'error' in moderatedUser ? 'User not found' : moderatedUser.tag;
    }

    return (
        <tr>
            <td>
                <Link to={`/${caseData.guildId}/cases/${caseData.caseId}`}>{caseData.caseId}</Link>
            </td>
            <td>{creatorTag}</td>
            <td>{moderatedTag}</td>
            <td>{toTitleCase(caseData.type)}</td>
            <td className={styles.caseReason}>{caseData.reason}</td>
        </tr>
    );
};

export default function Cases({ id }: { id?: string }) {
    const data = useFetch<Case[], Case[]>(`${BASE_URI}/guilds/${id}/cases`);

    return (
        <>
            {!data && <p>Loading all cases</p>}
            {data && 'error' in data && <p>There was an error loading the cases, try again. </p>}
            {data && !('error' in data) && (
                <>
                    <div>
                        <h2 className="headingTwo textHeading">Cases</h2>
                        <p>The log of all moderation cases in this server.</p>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Moderator</th>
                                <th>Moderated User</th>
                                <th>Case Type</th>
                                <th>Case Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data
                                .sort((x, y) => {
                                    if (x.caseId < y.caseId) return -1;
                                    if (x.caseId > y.caseId) return 1;
                                    return 0;
                                })
                                .map(caseData => (
                                    <CaseRow key={caseData.caseId} caseData={caseData} />
                                ))}
                        </tbody>
                    </table>
                    {data.length === 0 && <p className={styles.wideTD}>There are no cases.</p>}
                </>
            )}
        </>
    );
}
