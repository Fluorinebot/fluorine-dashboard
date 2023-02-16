import { Authorize } from '#/components/ErrorBoundary';
import { Box, Center, Flex, Heading, Icon, Spinner, Text } from '@chakra-ui/react';
import EditProfile from '#/components/views/EditProfile';
import { BASE_URI } from '#/lib/constants';
import type { Profile } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { MdError } from 'react-icons/md';

const Home: React.FC<{}> = ({}) => {
    const { data, error, loading, code } = useAPI<Profile, { error: string; userId: string | bigint }>(
        `${BASE_URI}/profile`
    );

    if (loading) {
        return <Spinner />;
    }

    if (error && code !== 404) {
        if (code === 401) {
            return <Authorize />;
        } else {
            return (
                <Center height={'100%'} width={'100%'}>
                    <Flex gap={2}>
                        <Icon as={MdError} h={10} w={10}></Icon>
                        <Box>
                            <Heading size="md">Something went wrong.</Heading>
                            <Text size="md">Please try again.</Text>
                        </Box>
                    </Flex>
                </Center>
            );
        }
    }

    if (data || (error && code === 404)) {
        return <EditProfile data={data} code={code} />;
    }

    return <></>;
};

export default Home;
