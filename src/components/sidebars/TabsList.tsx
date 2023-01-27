import '#/assets/components/sidebars/TabsList.css';
import { ErrorType } from '#/lib/types';
import classNames from 'classnames';
import { IconType } from 'react-icons';
import { FaArrowLeft, FaCog, FaFile } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

interface TabProps {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
}

const getIcon = (id: string, icon?: string) =>
    icon
        ? `https://cdn.discordapp.com/icons/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=48`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(id) % BigInt(5)}.png?size=48`;

function Tab({ tabName, tabURI, selected, ...props }: TabProps & { selected: boolean }) {
    return (
        <Link to={tabURI} className={classNames('TabCard', { 'TabCard--Selected': selected })}>
            <props.tabIcon className="TabCard__Icon" />
            <h5 className="TabCard__Text">{tabName}</h5>
        </Link>
    );
}

export default function TabsList({
    loading,
    data,
    error,
    code,
    id,
    isGuildBackURI
}: {
    loading: boolean;
    error: ErrorType<any>;
    data: any;
    code: number;
    isGuildBackURI?: boolean;
    id?: string;
}) {
    const location = useLocation();

    const tabs: TabProps[] = [
        { tabName: 'Back', tabURI: isGuildBackURI ? `/guilds/${id}` : `/`, tabIcon: FaArrowLeft },
        {
            tabName: 'Cases',
            tabURI: `/guilds/${id}/cases`,
            tabIcon: FaFile
        },
        { tabName: 'Logging Options', tabURI: `/guilds/${id}/logging`, tabIcon: FaCog }
    ];

    if (loading) {
        return <p className="noticeBox">Just a sec</p>;
    }

    if (error) {
        if (code === 401) {
            return <p className="noticeBox">You must authorize to continue</p>;
        } else if (code === 404) {
            return <p className="noticeBox">That server does not exist</p>;
        }
    }

    return (
        <>
            {loading && <p>Just a sec</p>}
            {error && <p>You must authorize to continue.</p>}
            {data && (
                <div className="TabsList__Flex">
                    <div className="TabsList__Header">
                        <img className="Header__Image" src={getIcon(id ?? '', data.icon)} alt="" />
                        <h2 className="Header__Text">{data.name}</h2>
                    </div>
                    <nav>
                        {tabs.map(item => (
                            <Tab
                                {...item}
                                key={item.tabName}
                                selected={location.pathname.split('/')[3] === item.tabName.split(' ')[0].toLowerCase()}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
