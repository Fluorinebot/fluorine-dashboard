import { ContentBoundary } from '../components/ErrorBoundary';
import ProfileEdit from '../components/contentViews/ProfileEdit';
import Sidebar from '../components/Sidebar';
import styles from './Home.module.css';

export default function Home({ state }: { state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
    return (
        <div className={styles.home}>
            <Sidebar listing="guilds" state={state} />
            {!state[0] && (
                <div className={styles.fullFlex}>
                    <ContentBoundary>
                        <ProfileEdit />
                    </ContentBoundary>
                </div>
            )}
        </div>
    );
}
