import { Link } from 'react-router-dom';
import { BASE_URI } from '../../lib/constants';
import { useFetch } from '../../lib/useFetch';
import styles from './Cases.module.css';

interface CaseType {
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

export function CaseView({ id, data }: { id?: string; data: CaseType }) {
    const caseCreator = useFetch<any>(`${BASE_URI}/guilds/${id}/users/${data.caseCreator}`);
    const moderatedUser = useFetch<any>(`${BASE_URI}/guilds/${id}/users/${data.moderatedUser}`);

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
        <>
            <div>
                <h2 className="headingTwo textHeading">Case #{data.caseId}</h2>
                <p>
                    <span className="grey">CASE TYPE</span> <b>{data.type}</b>
                </p>
                <p>
                    <span className="grey">MODERATOR</span> <b>{creatorTag}</b>
                </p>
                <p>
                    <span className="grey">MODERATED USER</span> <b>{moderatedTag}</b>
                </p>
                <p>
                    <span className="grey">REASON</span> <b>{data.reason}</b>
                </p>
            </div>
        </>
    );
}

export function Case({ id, caseId }: { id?: string; caseId: string }) {
    const data = useFetch<CaseType, CaseType>(`${BASE_URI}/guilds/${id}/cases/${caseId}`);

    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading case</p>;
    }

    if (data && 'error' in data) {
        JSXReturn = <p>There was an error loading the case, try again. Perhaps it doesn't exist.</p>;
    }

    if (data && !('error' in data)) {
        JSXReturn = <CaseView id={id} data={data} />;
    }

    return <>{JSXReturn}</>;
}
