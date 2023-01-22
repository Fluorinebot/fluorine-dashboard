import Sidebar from '../components/Sidebar';
import styles from './Home.module.css';

export default function Home() {
    return (
        <div className={styles.home}>
            <Sidebar listing="guilds" />
            <div className={`${styles.fullFlex} ${styles.noticeBox}`}>
                <h2>Please select a server</h2>
            </div>
        </div>
    );
}
