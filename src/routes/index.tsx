import { AuthorizeError } from '#/components/ErrorBoundary';
import { BASE_URI } from '#/lib/constants';
import type { Profile, WithPayload } from '#/lib/types';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    Icon,
    Input,
    Spinner,
    Text,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { MdError } from 'react-icons/md';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const validate = async ({ description, location, birthday, pronouns, website }: Profile) => {
    const errors: Profile = {};

    if (description && description.length > 300) {
        errors.description = `Description must be less than 300 characters. You're off by ${
            description.length - 300
        } character(s).`;
    }

    if (location) {
        if (location.length < 3) {
            errors.location = 'Location must be more than 3 characters.';
        }

        if (location.length > 15) {
            errors.location = `Location must be less than 15 characters. You're off by ${
                location.length - 15
            } character(s).`;
        }
    }

    if (birthday) {
        const [day, month] = birthday.split('/').map(str => parseInt(str) || 0);

        if (day > 31 || day < 1 || month > 12 || month < 1) {
            errors.birthday = 'Not a valid birthday. Use DD/MM format!';
        }
    }

    if (website) {
        const regex =
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gu;

        if (!website.match(regex)) {
            errors.website = 'Not a valid website URL.';
        }
    }

    if (pronouns && !['she/her', 'he/him', 'they/them'].includes(pronouns)) {
        errors.pronouns = 'Pronouns other than (she/her, he/him and they/them) are not supported.';
    }

    return errors;
};

const Home: React.FC = () => {
    const toast = useToast();
    const { data, isLoading, error } = useSWR<WithPayload<Profile>, WithPayload<{ error: string; userId: string }>>([
        `${BASE_URI}/profile`
    ]);

    const { trigger } = useSWRMutation([`${BASE_URI}/profile`], async ([url], { arg }) => {
        const res = await fetch(url, {
            credentials: 'include',
            method: 'PATCH',
            body: arg
        });

        return {
            code: res.status,
            payload: res.json()
        };
    });

    if (isLoading) {
        return (
            <Center width="100%" height="100vh">
                <Spinner />
            </Center>
        );
    }

    if (error && error.code !== 404) {
        if (error.code === 401) {
            return <AuthorizeError />;
        }
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

    if (data || (error && error.code === 404)) {
        return (
            <>
                <Flex direction={'column'} gap={2}>
                    <Heading as="h2" size="xl" fontWeight={800}>
                        Your profile
                    </Heading>
                    <Text size="md" fontWeight={400}>
                        Change your profile here. {error?.code === 404 && 'You currently do not have a profile!'}
                    </Text>
                </Flex>

                <Divider marginY={4} />

                <Formik
                    initialValues={{
                        userId: data && 'userId' in data.payload ? data.payload.userId ?? '' : '',
                        location: data && 'location' in data.payload ? data.payload.location ?? '' : '',
                        birthday: data && 'birthday' in data.payload ? data.payload.birthday ?? '' : '',
                        pronouns: data && 'pronouns' in data.payload ? data.payload.pronouns ?? '' : '',
                        website: data && 'website' in data.payload ? data.payload.website ?? '' : '',
                        description: data && 'description' in data.payload ? data.payload.description ?? '' : ''
                    }}
                    onSubmit={(values, actions) => {
                        setTimeout(async () => {
                            const patch = await trigger(
                                JSON.stringify(values, (key, value) => (value === '' ? null : value))
                            );

                            if (patch && patch.code >= 200 && patch.code <= 299) {
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
                    }}
                    validate={validate}
                    enableReinitialize
                >
                    {props => (
                        <Form>
                            <Flex direction={'column'} gap={4}>
                                <FormControl isInvalid={Boolean(props.touched.description && props.errors.description)}>
                                    <FormLabel>Description</FormLabel>

                                    <Textarea
                                        id="description"
                                        name="description"
                                        onChange={props.handleChange}
                                        value={props.values.description}
                                    />

                                    <FormErrorMessage>{props.errors.description}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={Boolean(props.touched.pronouns && props.errors.pronouns)}>
                                    <FormLabel>Pronouns</FormLabel>

                                    <Input
                                        type="text"
                                        id="pronouns"
                                        name="pronouns"
                                        onChange={props.handleChange}
                                        value={props.values.pronouns}
                                    />

                                    <FormErrorMessage>{props.errors.pronouns}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={Boolean(props.touched.birthday && props.errors.birthday)}>
                                    <FormLabel>Birthday</FormLabel>

                                    <Input
                                        type="text"
                                        id="birthday"
                                        name="birthday"
                                        onChange={props.handleChange}
                                        value={props.values.birthday}
                                    />

                                    <FormHelperText>Use DD/MM format, no leading zeros.</FormHelperText>
                                    <FormErrorMessage>{props.errors.birthday}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={Boolean(props.touched.website && props.errors.website)}>
                                    <FormLabel>Website</FormLabel>

                                    <Input
                                        type="text"
                                        id="website"
                                        name="website"
                                        onChange={props.handleChange}
                                        value={props.values.website}
                                    />

                                    <FormErrorMessage>{props.errors.website}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={Boolean(props.touched.location && props.errors.location)}>
                                    <FormLabel>Location</FormLabel>
                                    <Input
                                        type="text"
                                        id="location"
                                        name="location"
                                        onChange={props.handleChange}
                                        value={props.values.location}
                                    />
                                    <FormErrorMessage>{props.errors.location}</FormErrorMessage>
                                </FormControl>

                                <Button
                                    type="submit"
                                    isLoading={props.isSubmitting}
                                    loadingText="Updating Profile"
                                    isDisabled={props.isSubmitting ? props.isSubmitting : !props.dirty}
                                    colorScheme={'brand'}
                                    width={'fit-content'}
                                >
                                    Update Profile
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    return <></>;
};

export default Home;
