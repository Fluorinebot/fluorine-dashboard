import { Authorize } from '#/components/ErrorBoundary';
import { Spinner, UseDisclosureReturn } from '@chakra-ui/react';
import Sidebar from '#/components/Sidebar';
import TabsList from '#/components/sidebars/TabsList';
import { BASE_URI } from '#/lib/constants';
import { RenderingContext } from '#/lib/RenderContext';
import useAPI from '#/lib/useAPI';
import { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet, useLocation, useParams } from 'react-router-dom';

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

const Guild: React.FC<{ disclosureProps: UseDisclosureReturn }> = ({ disclosureProps }) => {
    const params = useParams();
    const location = useLocation();
    const { data, error, loading, code } = useAPI<any>(`${BASE_URI}/guilds/${params.id}`);

    const renderContext = useContext(RenderingContext);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const renderContent = (isMobile && renderContext && renderContext[0] === 'content') || !isMobile;

    let jsx;

    if (loading) {
        jsx = <Spinner />;
    }

    if (error) {
        if (code === 401) {
            jsx = <Authorize />;
        } else if (code === 404) {
            jsx = (
                <div className="Utils__NoticeBox">
                    <div>
                        <h2 className="Utils__Leading">Not Found</h2>
                        <p>Either that server doesn't exist or does not have Fluorine.</p>
                    </div>
                </div>
            );
        } else {
            jsx = <p className="Utils__NoticeBox">An error has occured loading this server.</p>;
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
            <Sidebar disclosureProps={disclosureProps}>
                <TabsList
                    data={data}
                    error={error}
                    loading={loading}
                    code={code}
                    id={params.id}
                    isGuildBackURI={Boolean(params.item)}
                />
            </Sidebar>

            <main className="Utils__FullFlex">
                {isMobile && data && (
                    <div className="TabsList__Header">
                        <img className="Header__Image" src={getIcon(params.id ?? '', data?.icon ?? undefined)} alt="" />
                        <div className="Header__Text">
                            <span className="Utils__Grey">Viewing</span>
                            <h2>{data.name}</h2>
                        </div>
                    </div>
                )}
                <section className="Utils__Container">{jsx}</section>
            </main>
        </>
    );
};

export default Guild;
