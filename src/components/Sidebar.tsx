import { Link } from 'react-router-dom';
import { AsideBoundary } from './ErrorBoundary';
import GuildList from './GuildList';
import styles from './Sidebar.module.css';

export default function Sidebar({
    listing,
    state,
    selectedTab
}: {
    listing: 'guilds' | 'options';
    state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    selectedTab?: string;
}) {
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
        <>
            <nav className={`${styles.sidebar} mobileHidden`}>
                <div className={styles.header}>
                    <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                </div>
                <div className={styles.displayedContent}>
                    <AsideBoundary>{JSXReturn}</AsideBoundary>
                </div>
            </nav>
            <nav className="desktopHidden">
                <div className={styles.header}>
                    <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                    <button onClick={() => state[1](curr => !curr)} className={styles.button}>
                        {state[0] ? '(back)' : '(three bars)'}
                    </button>
                </div>
            </nav>
            {state[0] && (
                <div className="paddedContainer">
                    <div className="blurContainer">
                        <AsideBoundary>{JSXReturn}</AsideBoundary>
                    </div>
                </div>
            )}
        </>
    );
}
