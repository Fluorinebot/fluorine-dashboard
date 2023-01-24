import { FaArrowUp } from '@react-icons/all-files/fa/FaArrowUp';
import { FaBars } from '@react-icons/all-files/fa/FaBars';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { AsideBoundary } from './ErrorBoundary';
import styles from './Sidebar.module.css';
import GuildList from './sidebarViews/GuildList';
import TabsList from './sidebarViews/TabsList';

export default function Sidebar({
    listing,
    state,
    optionsData
}: {
    listing: 'guilds' | 'options';
    state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    optionsData?: {
        name: string;
        tab?: string;
        id?: string;
        icon?: string;
        isGuildBackURI?: boolean;
    };
}) {
    let JSXReturn;

    if (listing === 'guilds') {
        JSXReturn = <GuildList />;
    } else {
        JSXReturn = <TabsList {...optionsData} />;
    }

    return (
        <>
            <div className={`${styles.sidebar} mobileHidden`}>
                <header className={styles.header}>
                    <Link to="/">
                        <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                    </Link>
                </header>
                <nav className={styles.displayedContent}>
                    <AsideBoundary>{JSXReturn}</AsideBoundary>
                </nav>
            </div>
            <header className="desktopHidden">
                <div className={styles.header}>
                    <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                    <button onClick={() => state[1](curr => !curr)} className={styles.button}>
                        {state[0] ? <FaArrowUp /> : <FaBars />}
                    </button>
                </div>
            </header>
            <div className={classNames('desktopHidden', { mobileHidden: !state[0] })}>
                <div className="paddedContainer">
                    <AsideBoundary>{JSXReturn}</AsideBoundary>
                </div>
            </div>
        </>
    );
}
