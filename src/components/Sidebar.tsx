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
                <>{!showContent && <nav className="Utils__Container">{children}</nav>}</>
            ) : (
                <>
                    <aside className="Sidebar">
                        <nav className="DisplayedContent">{children}</nav>
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
