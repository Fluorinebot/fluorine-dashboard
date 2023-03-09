import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { WithPayload } from '#/lib/types';
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
import { ChannelType } from 'discord-api-types/v10';
import { Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

interface Config {
    logModerationActions: boolean;
    logsEnabled: boolean;
    logsChannel?: string;
}

interface Channel {
    id: string;
    name: string;
    position: number;
    type: ChannelType;
    parentId: string;
}

const Logging: React.FC = () => {
    const params = useParams();
    const { data, isLoading, error } = useSWR<WithPayload<Config>>([`${BASE_URI}/guilds/${params.id}`]);
    const {
        data: channels,
        isLoading: channelsLoading,
        error: channelsError
    } = useSWR<WithPayload<Channel[]>>([`${BASE_URI}/guilds/${params.id}/channels`]);

    const { trigger } = useSWRMutation<WithPayload<any>, any, string[], string>(
        [`${BASE_URI}/guilds/${params.id}`],
        async ([url], { arg }) => {
            const res = await fetch(url, {
                credentials: 'include',
                method: 'PATCH',
                body: arg
            });

            return {
                code: res.status,
                payload: res.json(),
                ok: res.ok
            };
        }
    );

    const toast = useToast();

    if (isLoading || channelsLoading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner size="xl" color="fixedBlue.100" />
            </Center>
        );
    }

    if (error || channelsError) {
        if (error.code === 401) {
            return <AuthorizeError />;
        }

        return <ErrorMessage heading="Something went wrong" message="This tab could not be loaded" link="/guilds" />;
    }

    if (data && channels) {
        const categories = channels.payload.filter(category => category.type === ChannelType.GuildCategory);
        const textChannels = channels.payload.filter(channel =>
            [ChannelType.GuildText, ChannelType.AnnouncementThread].includes(channel.type)
        );

        const categoriesToChannels = [
            {
                label: 'Uncategorized',
                options: textChannels
                    .filter(channel => channel.parentId === '0')
                    .sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return 0;
                    })
            },
            ...categories
                .sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    }

                    if (a.position > b.position) {
                        return 1;
                    }

                    return 0;
                })
                .map(category => ({
                    label: category.name,
                    options: textChannels
                        .filter(channel => channel.parentId === category.id)
                        .sort((first, second) => {
                            if (first.position < second.position) {
                                return -1;
                            }
                            if (first.position > second.position) {
                                return 1;
                            }
                            return 0;
                        })
                }))
        ];

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
                        logsEnabled: data.payload.logsEnabled,
                        logModerationActions: data.payload.logModerationActions,
                        logsChannel: data.payload.logsChannel
                    }}
                    onSubmit={(values, actions) => {
                        setTimeout(async () => {
                            const patch = await trigger(JSON.stringify(values));

                            if (patch && patch.ok) {
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
                        <Form>
                            <Stack spacing={4} direction="column">
                                <Switch
                                    id="logsEnabled"
                                    name="logsEnabled"
                                    onChange={props.handleChange}
                                    isChecked={props.values.logsEnabled}
                                    colorScheme="brand"
                                >
                                    Log messages [edits/deletes]
                                </Switch>
                                <Switch
                                    id="logModerationActions"
                                    name="logModerationActions"
                                    onChange={props.handleChange}
                                    isChecked={props.values.logModerationActions}
                                    isDisabled={!props.values.logsEnabled}
                                    colorScheme="brand"
                                >
                                    Log cases
                                </Switch>
                                <FormControl isDisabled={!props.values.logsEnabled}>
                                    <FormLabel>Logs Channel</FormLabel>
                                    <Select
                                        options={categoriesToChannels}
                                        id="logsChannel"
                                        name="logsChannel"
                                        placeholder="Select channel"
                                        size="md"
                                        colorScheme="brand"
                                        onChange={(value: any) => props.handleChange('logsChannel')(value.id)}
                                        value={channels.payload.find(
                                            channel => channel.id === props.values.logsChannel
                                        )}
                                        getOptionLabel={(option: Channel) => `#${option.name}`}
                                        getOptionValue={(option: Channel) => option.id}
                                        selectedOptionStyle="check"
                                        isSearchable
                                        hasStickyGroupHeaders
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    isLoading={props.isSubmitting}
                                    loadingText="Saving changes"
                                    isDisabled={props.isSubmitting ? props.isSubmitting : !props.dirty}
                                    colorScheme={'brand'}
                                    width={'fit-content'}
                                >
                                    Save changes
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        );
    }

    return <></>;
};

export default Logging;
