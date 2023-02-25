import AvatarWithName from '#/components/AvatarWithName';
import { AuthorizeError, ErrorMessage } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Case, WithPayload } from '#/lib/types';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
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
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { Form, Formik, type FormikHelpers } from 'formik';
import { useRef } from 'react';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

type Values = { reason: string };

export default function Case() {
    const toast = useToast();
    const params = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useSWR<WithPayload<Case>, WithPayload<any>>([
        `${BASE_URI}/guilds/${params.id}/cases/${params.item}`
    ]);

    const { mutate } = useSWRConfig();
    const { trigger: editReason } = useSWRMutation(
        [`${BASE_URI}/guilds/${params.id}/cases/${params.item}`],
        async ([url], { arg }) => {
            const res = await fetch(url, {
                credentials: 'include',
                method: 'PATCH',
                body: arg
            });

            return {
                code: res.status,
                payload: res.json()
            };
        }
    );

    const { trigger: deleteCaseTrigger } = useSWRMutation(
        [`${BASE_URI}/guilds/${params.id}/cases/${params.item}`, 'CaseDelete::Trigger'],
        async ([url]) => {
            const res = await fetch(url, {
                credentials: 'include',
                method: 'DELETE'
            });

            return {
                code: res.status,
                payload: res.json()
            };
        }
    );

    const { isOpen, onOpen, onClose, getButtonProps, getDisclosureProps } = useDisclosure({
        id: 'CaseWithItem::DeleteConfirmModal'
    });
    const cancelRef = useRef<any>();

    if (isLoading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner size="xl" color="fixedBlue.100" />
            </Center>
        );
    }

    if (error) {
        if (error.code === 401) {
            return <AuthorizeError />;
        }

        if (error.code === 404) {
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
        const { payload } = data;

        const handleSumbit = (values: Values, actions: FormikHelpers<Values>) => {
            setTimeout(async () => {
                const patch = await editReason(JSON.stringify(values));

                if (patch && patch.code >= 200 && patch.code <= 200) {
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

                actions.setSubmitting(false);
            }, 250);
        };

        const deleteCase = async () => {
            const patch = await deleteCaseTrigger();

            if (patch) {
                if (patch.code >= 200 && patch.code <= 200) {
                    toast({
                        title: 'Deleted case',
                        status: 'success',
                        duration: 9000,
                        isClosable: true
                    });

                    setTimeout(() => {
                        navigate(`/guilds/${params.id}/cases`);
                        mutate([`${BASE_URI}/guilds/${params.id}/cases`]);
                    }, 250);
                } else {
                    toast({
                        title: 'Something went wrong!',
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    });
                }
            }

            onClose();
        };

        return (
            <Box width={['full', 'full', `${50 + 25 / 2}%`]} height="100vh">
                <Flex gap={3} direction={'column'}>
                    <Heading as="h2" size="xl" fontWeight={800}>
                        Case #{payload.caseId}
                    </Heading>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Type
                        </Text>
                        <Text size="sm" fontWeight={400} flex="75%">
                            {toTitleCase(payload.type)}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Moderator
                        </Text>
                        <Box flex="75%">
                            <AvatarWithName guildId={payload.guildId} userId={payload.caseCreator} />
                        </Box>
                    </Flex>
                    <Flex>
                        <Text size="md" fontWeight={600} flex="25%" color="gray" marginBlock="auto">
                            Offending User
                        </Text>
                        <Box flex="75%">
                            <AvatarWithName guildId={payload.guildId} userId={payload.moderatedUser} />
                        </Box>
                    </Flex>
                    <Flex direction="column" gap={2}>
                        <Box>
                            <Formik<Values>
                                initialValues={{ reason: payload.reason ?? '' }}
                                onSubmit={handleSumbit}
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
                                                {...getButtonProps()}
                                                onClick={onOpen}
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

                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isCentered
                    {...getDisclosureProps()}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Case #{payload.caseId}
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to delete this case? You can't undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme="red" onClick={deleteCase} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        );
    }

    return <></>;
}
