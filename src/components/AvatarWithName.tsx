import { BASE_URI } from '#/lib/constants';
import type { User, WithPayload } from '#/lib/types';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import useSWR from 'swr';

const getIcon = (id: string, tag: string, icon?: string) => {
    const parsed = tag.split('#');

    const ret = icon
        ? `https://cdn.discordapp.com/avatars/${id}/${icon}.${icon.endsWith('_a') ? 'gif' : 'webp'}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(parsed[parsed.length - 1]) % 5}.png`;

    return ret;
};

const AvatarWithName: React.FC<{ guildId: string; userId: string }> = ({ guildId, userId }) => {
    const { data, error, isLoading } = useSWR<WithPayload<User>>([`${BASE_URI}/guilds/${guildId}/users/${userId}`]);

    if (error || isLoading) {
        return (
            <Flex gap={2}>
                <Image
                    src="https://cdn.discordapp.com/embed/avatars/5.png"
                    h={['36px', '36px', '48px']}
                    w={['36px', '36px', '48px']}
                    rounded="full"
                />
                <Text size="md" fontWeight={600} colorScheme={'gray'}>
                    {isLoading && 'Loading User'}
                    {error && 'Unknown User'}#0000
                </Text>
            </Flex>
        );
    }

    if (data) {
        const { payload } = data;

        return (
            <Flex gap={2} alignItems="center">
                <Image
                    src={getIcon(userId, payload.tag, payload.avatar)}
                    h={['36px', '36px', '48px']}
                    w={['36px', '36px', '48px']}
                    rounded="full"
                />
                <Box>
                    {payload.nickname ? (
                        <Box>
                            <Text fontWeight={600} size="lg" wordBreak={'break-all'}>
                                {payload.nickname}
                            </Text>{' '}
                            <Text color={'gray'} size="md">
                                {payload.tag}
                            </Text>
                        </Box>
                    ) : (
                        <Text size="lg" fontWeight={600} wordBreak="break-all">
                            {payload.tag}
                        </Text>
                    )}
                </Box>
            </Flex>
        );
    }

    return <></>;
};

export default AvatarWithName;
