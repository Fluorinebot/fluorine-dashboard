import { CLIENT_ID } from '#/lib/constants';
import { Card, Center, Heading, Avatar, LinkBox, useColorModeValue } from '@chakra-ui/react';
import { APIGuild } from 'discord-api-types/v10';
import { Link } from 'react-router-dom';

const getIcon = (x: APIGuild & { fluorine: boolean }) =>
    x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `no-icon-rip-bozo`;

const GuildCard: React.FC<{ guild: APIGuild & { fluorine: boolean }; link: string }> = ({ guild, link }) => {
    const val = useColorModeValue('blackAlpha.100', 'whiteAlpha.400');

    const jsx = (
        <Card
            gap={2}
            rounded={'md'}
            p={2}
            width="100%"
            _hover={{
                background: val
            }}
        >
            <Center>
                <Avatar objectFit="cover" w={'24'} h={'24'} src={getIcon(guild)} name={guild.name} rounded={'full'} />
            </Center>
            <Heading as="h5" size="md" marginBlock={'auto'} textAlign="center">
                {guild.name}
            </Heading>
        </Card>
    );

    return (
        <>
            {guild.fluorine ? (
                <LinkBox as={Link} to={`/${link}/${guild.id}/cases`}>
                    {jsx}
                </LinkBox>
            ) : (
                <LinkBox
                    as="a"
                    href={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=1374389881878&guild_id=${guild.id}`}
                >
                    {jsx}
                </LinkBox>
            )}
        </>
    );
};

export default GuildCard;
