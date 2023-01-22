import Sidebar from '../components/Sidebar';
import styles from './Home.module.css';

export default function Server() {
    return (
        <div className={styles.home}>
            <Sidebar listing="options" />
            <div className={`${styles.fullFlex} ${styles.noticeBox}`}>
                <h2>so you've selected a server, huh</h2>
            </div>
        </div>
    );
}
