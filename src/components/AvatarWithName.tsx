// import '#/assets/components/AvatarWithName.css';
import { BASE_URI } from '#/lib/constants';
import type { User } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

const getIcon = (id: string, tag: string, icon?: string) => {
    const parsed = tag.split('#');

    const ret = icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(parsed[parsed.length - 1]) % 5}.png`;

    return ret;
};

const AvatarWithName: React.FC<{ guildId: string; userId: string }> = ({ guildId, userId }) => {
    const { data, error, loading } = useAPI<User>(`${BASE_URI}/guilds/${guildId}/users/${userId}`);

    if (error || loading) {
        return (
            <Flex gap={2}>
                <Image src="https://cdn.discordapp.com/embed/avatars/5.png" h="48px" w="48px" rounded="full" />
                <Text size="md" fontWeight={600} colorScheme={'gray'}>
                    {loading && 'Loading User'}
                    {error && 'Unknown User'}#0000
                </Text>
            </Flex>
        );
    }

    if (data) {
        return (
            <Flex gap={2}>
                <Image src={getIcon(userId, data.tag, data.avatar)} h="48px" w="48px" rounded="full" />
                <Box>
                    {data.nickname ? (
                        <Box>
                            <Text fontWeight={600} size="lg">
                                {data.nickname}
                            </Text>{' '}
                            <Text color={'gray'} size="md">
                                {data.tag}
                            </Text>
                        </Box>
                    ) : (
                        <Text size="lg" fontWeight={600}>
                            {data.tag}
                        </Text>
                    )}
                </Box>
            </Flex>
        );
    }

    return <></>;
};

export default AvatarWithName;
