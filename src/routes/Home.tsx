import Sidebar from '#/components/Sidebar';
import { useMediaQuery } from 'react-responsive';
import GuildList from '#/components/sidebars/GuildList';
import ProfileEdit from '#/components/views/ProfileEdit';

const Home: React.FC<{ contentShownState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> = ({
    contentShownState: [showContent, setContentShown]
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const renderContent = (isMobile && showContent) || !isMobile;

    return (
        <>
            <Sidebar contentShownState={[showContent, setContentShown]}>
                <GuildList />
            </Sidebar>

            {renderContent && (
                <main className="Utils__FullFlex Utils__Container">
                    <ProfileEdit />
                </main>
            )}
        </>
    );
};

export default Home;
