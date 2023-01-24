import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { Case } from '../components/contentViews/Case';
import Cases from '../components/contentViews/Cases';
import { Authorize, ContentBoundary } from '../components/ErrorBoundary';
import Sidebar from '../components/Sidebar';
import { BASE_URI } from '../lib/constants';
import { useFetch } from '../lib/useFetch';
import styles from './Home.module.css';

export default function GuildView({ state }: { state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
    const params = useParams();

    const data = useFetch<any>(`${BASE_URI}/guilds/${params.id}`, { method: 'GET' });
    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading this server</p>;
    }

    if (data && 'error' in data) {
        if (['Missing token', 'Invalid token'].includes(data.error)) {
            JSXReturn = <Authorize />;
        } else {
            JSXReturn = <p>There was an error loading this server, try again. Perhaps it doesn't exist?</p>;
        }
    }

    if (data && !('error' in data)) {
        if (params.tab === 'cases') {
            JSXReturn = <Cases id={params.id} />;

            if (params.itemId) {
                JSXReturn = <Case id={params.id} caseId={params.itemId} />;
            }
        } else {
            JSXReturn = (
                <div>
                    <h2 className="headingTwo textHeading">That tab doesn't exist</h2>
                    <p>Whatever link led you here, it's busted.</p>
                </div>
            );
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
                <Sidebar listing="options" state={state} optionsData={{ name: 'FetchFail', id: 'FetchFail' }} />
            )}
            <div className={classNames(styles.fullFlex, { mobileHidden: state[0] })}>
                <ContentBoundary>
                    <div className="paddedContainer">{JSXReturn}</div>
                </ContentBoundary>
            </div>
        </div>
    );
}
