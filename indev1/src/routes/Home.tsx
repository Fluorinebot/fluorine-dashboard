import { ContentBoundary } from '../components/ErrorBoundary';
import ProfileEdit from '../components/contentViews/ProfileEdit';
import Sidebar from '../components/Sidebar';
import styles from './Home.module.css';
import classNames from 'classnames';

export default function Home({ state }: { state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
    return (
        <div className={styles.home}>
            <Sidebar listing="guilds" state={state} />
            <div className={classNames(styles.fullFlex, { mobileHidden: state[0] })}>
                <ContentBoundary>
                    <ProfileEdit />
                </ContentBoundary>
            </div>
        </div>
    );
}
