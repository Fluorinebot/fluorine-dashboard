import { CLIENT_ID } from '#/lib/constants';
import type { FluorineGuild } from '#/lib/types';
import { Card, Center, Heading, Image, LinkBox, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const getIcon = (x: FluorineGuild) => {
    const ret = x.icon
        ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.${x.icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${BigInt(x.id) % BigInt(5)}.png`;

    return ret;
};

const GuildCard: React.FC<{ guild: FluorineGuild; link: string }> = ({ guild, link }) => {
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
                <Image objectFit="cover" w={'24'} h={'24'} src={getIcon(guild)} alt="" rounded={'full'} />
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
