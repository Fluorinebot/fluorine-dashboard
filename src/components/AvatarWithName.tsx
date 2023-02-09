import '#/assets/components/AvatarWithName.css';
import { BASE_URI } from '#/lib/constants';
import type { User } from '#/lib/types';
import useAPI from '#/lib/useAPI';

const getIcon = (id: string, tag: string, icon?: string) => {
    const parsed = tag.split('#');

    const ret = icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=32`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(parsed[parsed.length - 1]) % 5}.png`;

    return ret;
};

const AvatarWithName: React.FC<{ guildId: string; userId: string }> = ({ guildId, userId }) => {
    const { data, error, loading } = useAPI<User>(`${BASE_URI}/guilds/${guildId}/users/${userId}`);

    if (error || loading) {
        return (
            <div className="Avatar Utils__Flex--75">
                <img className="Avatar__Image" src="https://cdn.discordapp.com/embed/avatars/5.png" />
                <div>
                    <span className="Utils__Grey">
                        {loading && 'Loading User'}
                        {error && 'Unknown User'}#0000
                    </span>
                </div>
            </div>
        );
    }

    if (data) {
        return (
            <div className="Avatar Utils__Flex--75">
                <img className="Avatar__Image" src={getIcon(userId, data.tag, data.avatar)} />
                <div>
                    {data.nickname ? (
                        <p>
                            <b>{data.nickname}</b> <span className="Utils__Grey">{data.tag}</span>
                        </p>
                    ) : (
                        <p>
                            <b>{data.tag}</b>
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return <></>;
};

export default AvatarWithName;
