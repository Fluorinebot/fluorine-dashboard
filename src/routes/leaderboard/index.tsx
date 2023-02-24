import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import GuildCard from '#/components/GuildCard';
import { BASE_URI } from '#/lib/constants';
import type { FluorineGuild } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { Center, Divider, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';

const Leaderboard: React.FC = () => {
    const { loading, data, error, code } = useAPI<{ guilds: FluorineGuild[] }>(`${BASE_URI}/guilds`, { method: 'GET' });

    if (loading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner size="xl" color="fixedBlue.100" />
            </Center>
        );
    }

    if (error) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return <ErrorMessage heading="Something went wrong!" message="Please try again." />;
    }

    if (data) {
        const guildsWithFluorine = data.guilds.filter(x => x.fluorine);

        return (
            <>
                <Text fontSize={'xl'} as="h2" fontWeight={800} colorScheme="whiteAlpha" marginBlock={'auto'}>
                    Server Leaderboards
                </Text>
                <Text fontSize={'lg'} as="p" fontWeight={400} colorScheme="whiteAlpha" marginBlock={'auto'}>
                    You are a member of {data.guilds.length} servers, of those servers, {guildsWithFluorine.length} have
                    Fluorine.
                </Text>

                <Divider marginY={2} />

                <Grid
                    gap={2}
                    templateColumns={{
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    }}
                >
                    {guildsWithFluorine
                        .sort((x, y) => {
                            if (x.name.toLowerCase() < y.name.toLowerCase()) {
                                return -1;
                            }
                            if (x.name.toLowerCase() > y.name.toLowerCase()) {
                                return 1;
                            }
                            return 0;
                        })
                        .map(guild => (
                            <GridItem key={guild.id}>
                                <GuildCard guild={guild} link="leaderboards" />
                            </GridItem>
                        ))}
                </Grid>
            </>
        );
    }

    return <></>;
};

export default Leaderboard;
