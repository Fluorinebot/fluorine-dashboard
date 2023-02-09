import { FaArrowUp, FaBars } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import '#/assets/components/Sidebar.css';

const Sidebar: React.FC<{
    contentShownState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    children: React.ReactNode;
}> = ({ contentShownState: [showContent, setContentShown], children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {isMobile ? (
                <>
                    <header className="Header">
                        <h1 className="Header__Text">Fluorine</h1>
                        <button onClick={() => setContentShown(curr => !curr)} className="Header__Button">
                            {!showContent ? <FaArrowUp /> : <FaBars />}
                        </button>
                    </header>
                    {!showContent && <nav className="Utils__Container">{children}</nav>}
                </>
            ) : (
                <>
                    <aside className="Sidebar">
                        <header className="Header">
                            <Link to="/">
                                <h1 className="Header__Text">Fluorine</h1>
                            </Link>
                        </header>
                        <nav className="DisplayedContent">{children}</nav>
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
