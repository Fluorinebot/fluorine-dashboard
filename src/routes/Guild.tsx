import { Authorize } from '#/components/ErrorBoundary';
import Sidebar from '#/components/Sidebar';
import TabsList from '#/components/sidebars/TabsList';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { useMediaQuery } from 'react-responsive';
import { Outlet, useLocation, useParams } from 'react-router-dom';

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

const Guild: React.FC<{ contentShownState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> = ({
    contentShownState: [showContent, setContentShown]
}) => {
    const params = useParams();
    const location = useLocation();
    const isCasesView = location.pathname.split('/')[3];
    const { data, error, loading, code } = useAPI<any>(`${BASE_URI}/guilds/${params.id}`);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const renderContent = (isMobile && showContent) || !isMobile;

    let jsx;

    if (loading) {
        jsx = <p className="noticeBox">Loading</p>;
    }

    if (error) {
        if (code === 401) {
            jsx = <Authorize />;
        } else if (code === 404) {
            jsx = (
                <div className="noticeBox">
                    <div>
                        <h2 className="Utils__Leading">Not Found</h2>
                        <p>Either that server doesn't exist or does not have Fluorine.</p>
                    </div>
                </div>
            );
        } else {
            jsx = <p className="noticeBox">An error has occured loading this server.</p>;
        }
    }

    if (data) {
        jsx = (
            <>
                <Outlet />
            </>
        );
    }

    return (
        <>
            <Sidebar contentShownState={[showContent, setContentShown]}>
                <TabsList data={data} error={error} loading={loading} code={code} id={params.id} />
            </Sidebar>

            {renderContent && (
                <main className="Utils__FullFlex">
                    {isMobile && data && (
                        <div className="TabsList__Header">
                            <img
                                className="Header__Image"
                                src={getIcon(params.id ?? '', data?.icon ?? undefined)}
                                alt=""
                            />
                            <div className="Header__Text">
                                <span className="Utils__Grey">Viewing</span>
                                <h2>{data.name}</h2>
                            </div>
                        </div>
                    )}
                    <section className="Utils__Container">{jsx}</section>
                    {/* fixes clipping in 100vh */}
                    {new Array(4).fill(<br />)}
                </main>
            )}
        </>
    );
};

export default Guild;
