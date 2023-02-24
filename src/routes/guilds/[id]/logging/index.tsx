import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Spinner,
    Stack,
    Switch,
    Text,
    useToast
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';

interface Config {
    logModerationActions: boolean;
    logsEnabled: boolean;
    logsChannel?: string;
}

const Logging: React.FC = () => {
    const params = useParams();
    const { data, loading, error, code } = useAPI<Config>(`${BASE_URI}/guilds/${params.id}`);
    const {
        data: channels,
        loading: channelsLoading,
        error: channelsError
    } = useAPI<any[]>(`${BASE_URI}/guilds/${params.id}/channels`);

    const toast = useToast();

    if (loading || channelsLoading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner size="xl" color="fixedBlue.100" />
            </Center>
        );
    }

    if (error || channelsError) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return <ErrorMessage heading="Something went wrong" message="This tab could not be loaded" link="/guilds" />;
    }

    if (data && channels) {
        return (
            <Box width={['full', 'full', `${50 + 25 / 2}%`]} height="100vh">
                <Flex direction={'column'} gap={2}>
                    <Heading as="h2" size="xl" fontWeight={800}>
                        Logging
                    </Heading>
                    <Text size="md" fontWeight={400}>
                        Change the behavior of Fluorine's logging system in this server.
                    </Text>
                </Flex>

                <Divider marginY={4} />

                <Formik
                    initialValues={{
                        logsEnabled: data.logsEnabled,
                        logModerationActions: data.logModerationActions,
                        logsChannel: data.logsChannel
                    }}
                    onSubmit={(values, actions) => {
                        setTimeout(async () => {
                            const patch = await fetch(`${BASE_URI}/guilds/${params.id}`, {
                                credentials: 'include',
                                method: 'PATCH',
                                body: JSON.stringify(values)
                            }).catch(err => {
                                throw new Error(err.message);
                            });

                            if (patch.ok) {
                                toast({
                                    title: 'Saved changes.',
                                    status: 'success',
                                    duration: 9000,
                                    isClosable: true
                                });
                            } else {
                                toast({
                                    title: 'Something went wrong!',
                                    status: 'error',
                                    duration: 9000,
                                    isClosable: true
                                });
                            }

                            actions.setValues(values);
                            actions.setSubmitting(false);
                        }, 1000);
                    }}
                    enableReinitialize
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Stack spacing={4} direction="column">
                                <Switch
                                    id="logsEnabled"
                                    name="logsEnabled"
                                    onChange={props.handleChange}
                                    checked={props.values.logsEnabled}
                                    colorScheme="brand"
                                >
                                    Log messages [edits/deletes]
                                </Switch>

                                <Switch
                                    id="logModerationActions"
                                    name="logModerationActions"
                                    onChange={props.handleChange}
                                    checked={props.values.logModerationActions}
                                    disabled={!props.values.logsEnabled}
                                    colorScheme="brand"
                                >
                                    Log cases
                                </Switch>

                                <FormControl isDisabled={!props.values.logsEnabled}>
                                    <FormLabel>Logs Channel</FormLabel>
                                    <Select
                                        options={channels}
                                        id="logsChannel"
                                        name="logsChannel"
                                        placeholder="Select channel"
                                        size="md"
                                        onChange={(value: any) => props.handleChange('logsChannel')(value.id)}
                                        value={channels.find((channel: any) => channel.id === props.values.logsChannel)}
                                        getOptionLabel={(option: any) => `#${option.name}`}
                                        getOptionValue={(option: any) => option.id}
                                        colorScheme="brand"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    isLoading={props.isSubmitting}
                                    loadingText="Saving changes"
                                    disabled={props.isSubmitting ? props.isSubmitting : props.dirty}
                                    colorScheme={'brand'}
                                    width={'fit-content'}
                                >
                                    Save changes
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </Box>
        );
    }

    return <></>;
};

export default Logging;
