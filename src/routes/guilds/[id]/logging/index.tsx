import { AuthorizeError } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    FormControl, FormLabel,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    useToast
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';

interface Config {
    logModerationActions: boolean;
    logsEnabled: boolean;
    logsChannel?: string;
}

const Logging: React.FC<{}> = ({}) => {
    const params = useParams();
    const { data, loading, error, code } = useAPI<Config>(`${BASE_URI}/guilds/${params.id}`);
    const toast = useToast();

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return <AuthorizeError />;
        }

        return <p>An error has occured.</p>;
    }

    if (data) {
        return (
            <Box width={['full', 'full', `${50 + 25 / 2}%`]}>
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
                        logsChannel: data.logsChannel ?? ''
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
                    {props => {
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <Stack spacing={4} direction="column">
                                    <Checkbox
                                        id="logsEnabled"
                                        name="logsEnabled"
                                        onChange={props.handleChange}
                                        checked={props.values.logsEnabled}
                                        colorScheme="brand"
                                    >
                                        Enable logs?
                                    </Checkbox>

                                    <Checkbox
                                        id="logModerationActions"
                                        name="logModerationActions"
                                        onChange={props.handleChange}
                                        checked={props.values.logModerationActions}
                                        disabled={!props.values.logsEnabled}
                                        colorScheme="brand"
                                    >
                                        Log moderation actions
                                    </Checkbox>
                                    <FormControl>
                                        <FormLabel>Logs Channel</FormLabel>
                                        <Input
                                            type="text"
                                            id="logsChannel"
                                            name="logsChannel"
                                            onChange={props.handleChange}
                                            value={props.values.logsChannel}
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
                        );
                    }}
                </Formik>
            </Box>
        );
    }

    return <></>;
};

export default Logging;
