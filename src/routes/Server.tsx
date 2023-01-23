import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContentBoundary, ErrorMessage } from '../components/ErrorBoundary';
import Sidebar from '../components/Sidebar';
import { BASE_URI } from '../lib/constants';
import { useFetch } from '../lib/useFetch';
import styles from './Home.module.css';

const getIcon = (x: any) =>
    x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(x.id) % BigInt(5)}.png?size=48`;

export default function Server({ state }: { state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
    const params = useParams();
    const tab = params.tab === '' ? 'general' : params.tab;

    const data = useFetch<any>(`${BASE_URI}/guilds/${params.id}`, { method: 'GET' });
    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading your servers</p>;
    }

    if (data && 'error' in data) {
        console.log(data.error, data.errorReason);
        JSXReturn = <p>There was an error loading your servers, try again. </p>;
    }

    if (data && !('error' in data)) {
        JSXReturn = (
            <>
                <code>{JSON.stringify(data, null, 4)}</code>
                <p>{tab}</p>
            </>
        );
    }

    return (
        <div className={styles.home}>
            <Sidebar listing="options" selectedTab={params.tab} state={state} />
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
