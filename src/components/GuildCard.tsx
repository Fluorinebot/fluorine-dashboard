import { CLIENT_ID } from '#/lib/constants';
import { Card, Center, Heading, Image } from '@chakra-ui/react';
import { APIGuild } from 'discord-api-types/v10';
import { Link } from 'react-router-dom';

const getIcon = (x: APIGuild & { fluorine: boolean }) =>
    x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(x.id) % BigInt(5)}.png?size=48`;

const GuildCard: React.FC<{ guild: APIGuild & { fluorine: boolean } }> = ({ guild }) => {
    const jsx = (
        <Card gap={2} rounded={'md'} p={2}>
            <Center>
                <Image objectFit="cover" w={'36'} h={'36'} src={getIcon(guild)} alt="" rounded={'full'} />
            </Center>
            <Heading as="h5" size="md" marginBlock={'auto'} textAlign="center">
                {guild.name}
            </Heading>
        </Card>
    );

    return (
        <>
            {guild.fluorine ? (
                <Link to={`/guilds/${guild.id}/cases`}>{jsx}</Link>
            ) : (
                <a
                    href={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=1374389881878&guild_id=${guild.id}`}
                >
                    {jsx}
                </a>
            )}
        </>
    );
};

export default GuildCard;
