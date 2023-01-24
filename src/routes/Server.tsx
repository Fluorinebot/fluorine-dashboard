import { useParams } from 'react-router-dom';
import { Case } from '../components/contentViews/Case';
import Cases from '../components/contentViews/Cases';
import { ContentBoundary } from '../components/ErrorBoundary';
import Sidebar from '../components/Sidebar';
import { BASE_URI } from '../lib/constants';
import { useFetch } from '../lib/useFetch';
import styles from './Home.module.css';

export default function Server({ state }: { state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
    const params = useParams();

    const data = useFetch<any>(`${BASE_URI}/guilds/${params.id}`, { method: 'GET' });
    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading this server</p>;
    }

    if (data && 'error' in data) {
        JSXReturn = <p>There was an error loading this server, try again. Perhaps it doesn't exist?</p>;
    }

    if (data && !('error' in data)) {
        // const tabDisplay = {
        //     cases: <Cases id={params.id} />
        // } as const;

        // JSXReturn = tabDisplay[(params.tab ?? 'cases') as keyof typeof tabDisplay];
        if (params.tab === 'cases') {
            JSXReturn = <Cases id={params.id} />;

            if (params.itemId) {
                JSXReturn = <Case id={params.id} caseId={params.itemId} />;
            }
        }
    }

    return (
        <div className={styles.home}>
            {data && !('error' in data) ? (
                <Sidebar
                    listing="options"
                    state={state}
                    optionsData={{
                        name: data.name ?? '',
                        id: params.id ?? '',
                        icon: data.icon ?? '',
                        tab: params.tab,
                        isGuildBackURI: Boolean(params.itemId)
                    }}
                />
            ) : (
                <Sidebar listing="options" state={state} />
            )}
            <div className={styles.fullFlex}>
                {!state[0] && (
                    <ContentBoundary>
                        <div className="paddedContainer">{JSXReturn}</div>
                    </ContentBoundary>
                )}
            </div>
        </div>
    );
}
