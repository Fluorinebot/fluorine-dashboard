import { Link } from 'react-router-dom';
import GuildList from './GuildList';
import styles from './Sidebar.module.css';

export default function Sidebar({ listing }: { listing: 'guilds' | 'options' }) {
    let JSXReturn;

    if (listing === 'guilds') {
        JSXReturn = <GuildList />;
    } else {
        JSXReturn = (
            <Link to="/" className="primaryButton">
                Back
            </Link>
        );
    }

    return (
        <nav className={styles.sidebar}>
            <div className={styles.header}>
                <h1 className={styles.headerText}>Fluorine</h1>
            </div>
            <div className={styles.displayedContent}>{JSXReturn}</div>
        </nav>
    );
}
