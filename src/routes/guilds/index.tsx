import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import GuildCard from '#/components/GuildCard';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { Box, Divider, Flex, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import { APIGuild } from 'discord-api-types/v10';

const isAllowed = (x: APIGuild & { fluorine: boolean }) =>
    (Number(x.permissions) & 0x8) === 0x8 || (Number(x.permissions) & 0x20) === 32;

function GuildSection({ header, data }: { header: string; data: (APIGuild & { fluorine: boolean })[] }) {
    return (
        <Box>
            <Text fontSize={'lg'} as="h2" fontWeight={800} colorScheme="whiteAlpha" marginBottom={2}>
                {header}
            </Text>

            <Grid
                gap={2}
                templateColumns={{
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)'
                }}
            >
                {data
                    .sort((x, y) => {
                        if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
                        if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
                        return 0;
                    })
                    .map(guild => (
                        <GridItem key={guild.id}>
                            <GuildCard guild={guild} link="guilds" />
                        </GridItem>
                    ))}
            </Grid>
        </Box>
    );
}

const GuildSelection: React.FC<{}> = ({}) => {
    const { loading, data, error, code } = useAPI<{ guilds: (APIGuild & { fluorine: boolean })[] }>(
        `${BASE_URI}/guilds`,
        { method: 'GET' }
    );

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return <ErrorMessage heading="Something went wrong!" message="Please try again." isInternal />;
    }

    if (data) {
        const filtered = data.guilds.filter(x => isAllowed(x));
        const guildsWithFluorine = filtered.filter(x => x.fluorine);
        const guildsWithoutFluorine = filtered.filter(x => !x.fluorine);

        return (
            <>
                <Text fontSize={'xl'} as="h2" fontWeight={800} colorScheme="whiteAlpha" marginBlock={'auto'}>
                    Your servers
                </Text>
                <Text fontSize={'lg'} as="p" fontWeight={400} colorScheme="whiteAlpha" marginBlock={'auto'}>
                    You have admin permissions in {filtered.length} servers, {guildsWithFluorine.length} of which have
                    Fluorine.
                </Text>

                <Divider marginY={2} />

                <Flex gap={6} direction={'column'}>
                    <GuildSection header="Servers you can edit" data={guildsWithFluorine} />
                    <GuildSection header="Servers you can add Fluorine to" data={guildsWithoutFluorine} />
                </Flex>
            </>
        );
    }

    return <></>;
};

export default GuildSelection;