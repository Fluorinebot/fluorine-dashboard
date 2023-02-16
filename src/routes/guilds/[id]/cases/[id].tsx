import AvatarWithName from '#/components/AvatarWithName';
import { AuthorizeError } from '#/components/ErrorBoundary';
import { Spinner } from '@chakra-ui/react';
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
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return (
                <div className="container">
                    <AuthorizeError />
                </div>
            );
        } else if (code === 404) {
            return (
                <div className="container">
                    <p>Not found.</p>
                </div>
            );
        }

        return <p className="Utils__NoticeBox container">There was an error loading the cases, try again.</p>;
    }

    if (data) {
        if (isMobile) {
            return <p>hi, you're on mobile. case view on mobile isnt done yet!</p>;
        }

        return (
            <div>
                <div>
                    <h2 className="Utils__Leading">Case #{data.caseId}</h2>
                    <p className="Utils__Leading">A {data.type}</p>
                </div>

                <div>
                    <p className="Utils__Leading">
                        <p className="Utils__Grey">Moderator</p>
                        <AvatarWithName guildId={data.guildId} userId={data.caseCreator} />
                    </p>
                    <div className="Utils__Leading">
                        <p className="Utils__Grey">Moderated User</p>
                        <AvatarWithName guildId={data.guildId} userId={data.moderatedUser} />
                    </div>
                    <div className="Utils__Leading">
                        <p className="Utils__Grey">Reason</p>
                        <b>{data.reason ?? 'None'}</b>
                    </div>
                </div>
            </div>
        );
    }

    return <></>;
}
