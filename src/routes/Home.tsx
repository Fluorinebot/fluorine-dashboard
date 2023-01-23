import { ContentBoundary } from '../components/ErrorBoundary';
import ProfileEdit from '../components/ProfileEdit';
import Sidebar from '../components/Sidebar';
import styles from './Home.module.css';

export default function Home() {
    return (
        <div className={styles.home}>
            <Sidebar listing="guilds" />
            <div className={styles.fullFlex}>
                <ContentBoundary>
                    <ProfileEdit />
                </ContentBoundary>
            </div>
        </div>
    );
}
