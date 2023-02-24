import AvatarWithName from '#/components/AvatarWithName';
import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Spinner,
    Text,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

export default function Case() {
    const toast = useToast();
    const params = useParams();
    const navigate = useNavigate();
    const { loading, data, code, error } = useAPI<Case>(`${BASE_URI}/guilds/${params.id}/cases/${params.item}`);

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
        } else if (code === 404) {
            return (
                <ErrorMessage
                    heading="Not Found!"
                    message="No case with that ID exists."
                    button="See all cases"
                    link={`/guilds/${params.id}/cases`}
                />
            );
        }

        return (
            <ErrorMessage
                heading="Something Went Wrong!"
                message="Please try again."
                button="See all cases"
                link={`/guilds/${params.id}/cases`}
            />
        );
    }

    if (data) {
        return (
            <Box width={['full', 'full', `${50 + 25 / 2}%`]} height="100vh">
                <Flex gap={3} direction={'column'}>
                    <Heading as="h2" size="xl" fontWeight={800}>
                        Case #{data.caseId}
                    </Heading>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Type
                        </Text>
                        <Text size="sm" fontWeight={400} flex="75%">
                            {toTitleCase(data.type)}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Moderator
                        </Text>
                        <Box flex="75%">
                            <AvatarWithName guildId={data.guildId} userId={data.caseCreator} />
                        </Box>
                    </Flex>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Offending User
                        </Text>
                        <Box flex="75%">
                            <AvatarWithName guildId={data.guildId} userId={data.moderatedUser} />
                        </Box>
                    </Flex>
                    <Flex direction="column" gap={2}>
                        <Box>
                            <Formik
                                initialValues={{ reason: data.reason ?? '' }}
                                onSubmit={(values, actions) => {
                                    setTimeout(async () => {
                                        const patch = await fetch(
                                            `${BASE_URI}/guilds/${params.id}/cases/${params.item}`,
                                            {
                                                credentials: 'include',
                                                method: 'PATCH',
                                                body: JSON.stringify(values)
                                            }
                                        ).catch(err => {
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
                                {({ handleChange, values, isSubmitting, dirty }) => (
                                    <Form>
                                        <FormControl>
                                            <FormLabel>Reason</FormLabel>
                                            <Textarea
                                                id="reason"
                                                name="reason"
                                                onChange={handleChange}
                                                value={values.reason}
                                            />
                                        </FormControl>

                                        <ButtonGroup mt="4">
                                            <Button
                                                type="submit"
                                                isLoading={isSubmitting}
                                                loadingText="Saving Changes"
                                                disabled={isSubmitting ? isSubmitting : dirty}
                                                colorScheme={'brand'}
                                            >
                                                Save Changes
                                            </Button>
                                            <Button
                                                leftIcon={<MdDelete size="20" />}
                                                colorScheme={'red'}
                                                variant="outline"
                                                onClick={() => {
                                                    setTimeout(async () => {
                                                        const patch = await fetch(
                                                            `${BASE_URI}/guilds/${params.id}/cases/${params.item}`,
                                                            {
                                                                credentials: 'include',
                                                                method: 'DELETE'
                                                            }
                                                        ).catch(err => {
                                                            throw new Error(err.message);
                                                        });

                                                        if (patch.ok) {
                                                            toast({
                                                                title: 'Deleted case',
                                                                status: 'success',
                                                                duration: 9000,
                                                                isClosable: true
                                                            });

                                                            setTimeout(() => {
                                                                navigate(`/guilds/${params.id}/cases`);
                                                            });
                                                        } else {
                                                            toast({
                                                                title: 'Something went wrong!',
                                                                status: 'error',
                                                                duration: 9000,
                                                                isClosable: true
                                                            });
                                                        }
                                                    }, 0);
                                                }}
                                            >
                                                Delete Case
                                            </Button>
                                        </ButtonGroup>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        );
    }

    return <></>;
}
