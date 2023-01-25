import { FaArrowUp, FaBars } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import styles from '#/assets/components/Sidebar.module.css';

const Sidebar: React.FC<{
    contentShownState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    children: React.ReactNode;
}> = ({ contentShownState: [showContent, setContentShown], children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {isMobile ? (
                <>
                    <header>
                        <div className={styles.header}>
                            <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                            <button onClick={() => setContentShown(curr => !curr)} className={styles.button}>
                                {!showContent ? <FaArrowUp /> : <FaBars />}
                            </button>
                        </div>
                    </header>
                    {!showContent && <div className="container">{children}</div>}
                </>
            ) : (
                <>
                    <div className={styles.sidebar}>
                        <header className={styles.header}>
                            <Link to="/">
                                <h1 className={`${styles.headerText} headingOne`}>Fluorine</h1>
                            </Link>
                        </header>
                        <nav className={styles.displayedContent}>{children}</nav>
                    </div>
                </>
            )}
        </>
    );
};

export default Sidebar;
