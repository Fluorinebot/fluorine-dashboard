import Sidebar from '#/components/Sidebar';
import styles from '#/assets/routes/Route.module.css';
import { useMediaQuery } from 'react-responsive';
import GuildList from '#/components/sidebars/GuildList';
import ProfileEdit from '#/components/views/ProfileEdit';

const Home: React.FC<{ contentShownState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> = ({
    contentShownState: [showContent, setContentShown]
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const renderContent = (isMobile && showContent) || !isMobile;

    return (
        <div className={styles.home}>
            <Sidebar contentShownState={[showContent, setContentShown]}>
                <GuildList />
            </Sidebar>

            {renderContent && (
                <main className={`${styles.fullFlex} container`}>
                    <ProfileEdit />
                </main>
            )}
        </div>
    );
};

export default Home;
